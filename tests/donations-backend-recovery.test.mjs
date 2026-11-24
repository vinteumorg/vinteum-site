import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { pool, migrate } from "../src/lib/donations/db.mjs";
import { createCheckout, getDonation } from "../src/lib/donations/service.mjs";
process.env.DATABASE_URL ||= process.env.DONATIONS_DATABASE_URL;
process.env.DONATIONS_TOKEN_SECRET =
  "test-only-secret-not-for-deployment-123456789";
const enabled = !!process.env.DATABASE_URL,
  cfg = {
    enabled: true,
    stripeEnabled: true,
    bitcoinEnabled: true,
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
test.before(async () => {
  if (enabled) await migrate();
});
test(
  "same authenticated request replays complete checkout after lost response without another provider POST",
  { skip: !enabled },
  async () => {
    let calls = 0;
    const p = {
      create: async (d) => {
        calls++;
        return { providerId: `cs_${d.id}`, clientSecret: "cs_secret" };
      },
    };
    const body = input();
    const first = await createCheckout(body, p, cfg),
      again = await createCheckout(body, p, cfg);
    assert.deepEqual(again, first);
    assert.equal(calls, 1);
    await assert.rejects(
      () => createCheckout({ ...body, amount: 2000 }, p, cfg),
      (e) => e.status === 409,
    );
    await assert.rejects(
      () => getDonation(first.id, body.idempotencyKey),
      (e) => e.status === 404,
    );
  },
);
test(
  "uncertain Stripe reuses durable provider idempotency; uncertain Bitcoin is never posted twice",
  { skip: !enabled },
  async () => {
    for (const provider of ["stripe", "btcpay"]) {
      const body = { ...input(), provider };
      let calls = 0,
        ids = [];
      const p = {
        create: async (d) => {
          calls++;
          ids.push(d.id);
          if (calls === 1) throw Error("lost response");
          return { providerId: `cs_${d.id}` };
        },
      };
      const first = await createCheckout(body, p, cfg);
      const again = await createCheckout(body, p, cfg);
      assert.equal(again.id, first.id);
      assert.equal(calls, provider === "stripe" ? 2 : 1);
      assert.equal(new Set(ids).size, 1);
    }
  },
);
test.after(async () => {
  if (enabled) await pool().end();
});
