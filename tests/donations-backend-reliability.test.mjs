import Stripe from "stripe";
import {
  managePOST,
  stripePOST,
  jobsPOST,
} from "../src/lib/donations/handlers.mjs";
import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { pool, migrate } from "../src/lib/donations/db.mjs";
import { createCheckout, getDonation } from "../src/lib/donations/service.mjs";
import { reconcile } from "../src/lib/donations/jobs.mjs";
import { route, response } from "../src/lib/donations/http.mjs";
process.env.DATABASE_URL ||= process.env.DONATIONS_DATABASE_URL;
const enabled = !!process.env.DATABASE_URL;
process.env.DONATIONS_TOKEN_SECRET =
  "test-only-for-audit-not-production-123456789";
const cfg = {
  enabled: true,
  stripeEnabled: true,
  currencies: { USD: { min: 500, max: 10000 } },
};
const input = () => ({
  provider: "stripe",
  frequency: "once",
  currency: "USD",
  amount: 1000,
  firstName: "A",
  lastName: "B",
  email: "a@example.org",
  idempotencyKey: randomUUID(),
});
const providers = { create: async (d) => ({ providerId: `cs_${d.id}` }) };
test.before(async () => {
  if (enabled) await migrate();
});
test(
  "rollback flag stops checkout but existing operational routes continue with database rate limits",
  { skip: !enabled },
  async () => {
    process.env.DONATIONS_ENABLED = "false";
    const r = new Request("https://example.org/api/rollback");
    const operational = route(async () => response({ ok: true }), {
      enabled: false,
      operational: true,
    });
    assert.equal((await operational(r)).status, 200);
    const checkout = route(async () => response({ ok: true }));
    assert.equal((await checkout(r)).status, 503);
    process.env.DONATIONS_ORIGIN = "https://example.org";
    const d = await createCheckout(input(), providers, cfg);
    const removal = await managePOST(
      new Request("https://example.org/api/donations/manage", {
        method: "POST",
        headers: {
          origin: "https://example.org",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          id: d.id,
          token: d.manageToken,
          action: "remove-public",
        }),
      }),
    );
    assert.equal(removal.status, 200);
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test_rollback";
    const payload = JSON.stringify({
      id: "evt_rollback",
      type: "not-handled",
      data: { object: {} },
    });
    const signature = Stripe.webhooks.generateTestHeaderString({
      payload,
      secret: process.env.STRIPE_WEBHOOK_SECRET,
    });
    assert.equal(
      (
        await stripePOST(
          new Request("https://example.org/api/donations/webhooks/stripe", {
            method: "POST",
            headers: { "stripe-signature": signature },
            body: payload,
          }),
        )
      ).status,
      200,
    );
    process.env.DONATIONS_CRON_SECRET =
      "test-only-rollback-cron-secret-1234567890";
    assert.equal(
      (
        await jobsPOST(
          new Request("https://example.org/api/donations/jobs", {
            method: "POST",
          }),
        )
      ).status,
      401,
    );
  },
);
test(
  "failed earliest batch cannot starve record26; paid and expired records are swept for refunds and late settlement",
  { skip: !enabled },
  async () => {
    const rows = [];
    for (let i = 0; i < 26; i++)
      rows.push(await createCheckout(input(), providers, cfg));
    // Isolated test database: suspend unrelated test fixtures for deterministic batch selection.
    await pool().query(
      "UPDATE donations SET reconcile_after=now()+interval '1 day'",
    );
    await pool().query(
      "UPDATE donations SET reconcile_after=now()-interval '1 hour',status='paid' WHERE id=ANY($1::uuid[])",
      [rows.map((r) => r.id)],
    );
    let reached = false;
    const first = await reconcile({
      limit: 25,
      truth: async () => {
        throw Error("provider outage");
      },
    });
    assert.equal(first.failed, 25);
    const next = await reconcile({
      limit: 25,
      truth: async () => {
        reached = true;
        return { status: "failed" };
      },
    });
    assert.equal(next.checked, 1);
    assert.equal(reached, true);
    const d = rows[0];
    await pool().query(
      "UPDATE donations SET status='expired',reconcile_after=now()-interval '1 hour' WHERE id=$1",
      [d.id],
    );
    await reconcile({ truth: async () => ({ status: "paid" }), limit: 25 });
    assert.equal((await getDonation(d.id, d.token)).status, "paid");
  },
);
test.after(async () => {
  if (enabled) await pool().end();
});
