import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID, createHmac } from "node:crypto";
import Stripe from "stripe";
import { pool, migrate } from "../src/lib/donations/db.mjs";
import {
  createCheckout,
  getDonation,
  refreshDonation,
} from "../src/lib/donations/service.mjs";
import {
  stripeWebhook,
  bitcoinWebhook,
} from "../src/lib/donations/webhooks.mjs";
import { submitMajorGift, drainOutbox } from "../src/lib/donations/jobs.mjs";
process.env.DATABASE_URL ||= process.env.DONATIONS_DATABASE_URL;
const enabled = !!process.env.DATABASE_URL;
const cfg = {
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
  "signed Stripe webhook refetches truth; invalid signature leaves database untouched",
  { skip: !enabled },
  async () => {
    const d = await createCheckout(
      input(),
      { create: async (d) => ({ providerId: `cs_${d.id}` }) },
      cfg,
    );
    const secret = "whsec_test_secret";
    const payload = JSON.stringify({
      id: `evt_${randomUUID()}`,
      type: "checkout.session.completed",
      data: { object: { id: `cs_${d.id}` } },
    });
    const header = Stripe.webhooks.generateTestHeaderString({
      payload,
      secret,
    });
    await assert.rejects(
      () =>
        stripeWebhook(Buffer.from(payload), "bad", {
          secret,
          truth: async () => ({ status: "paid" }),
        }),
      (e) => e.status === 400,
    );
    assert.equal((await getDonation(d.id, d.token)).status, "pending");
    await stripeWebhook(Buffer.from(payload), header, {
      secret,
      truth: async () => ({ status: "paid" }),
    });
    assert.equal((await getDonation(d.id, d.token)).status, "paid");
  },
);
test(
  "BTCPay signature authenticates bytes and store, duplicates deduplicate",
  { skip: !enabled },
  async () => {
    const d = await createCheckout(
      { ...input(), provider: "btcpay" },
      { create: async (d) => ({ providerId: `inv_${d.id}` }) },
      cfg,
    );
    const secret = "btc-secret",
      storeId = "store";
    const payload = JSON.stringify({
      deliveryId: randomUUID(),
      type: "InvoiceSettled",
      storeId,
      invoiceId: `inv_${d.id}`,
    });
    const signature =
      "sha256=" + createHmac("sha256", secret).update(payload).digest("hex");
    await assert.rejects(
      () =>
        bitcoinWebhook(Buffer.from(payload + " "), signature, {
          secret,
          storeId,
        }),
      (e) => e.status === 400,
    );
    await bitcoinWebhook(Buffer.from(payload), signature, {
      secret,
      storeId,
      truth: async () => ({ status: "paid" }),
    });
    assert.equal((await getDonation(d.id, d.token)).status, "paid");
  },
);
test(
  "major gifts persist once and outbox retries failed transport with stable idempotency",
  { skip: !enabled },
  async () => {
    const body = {
      name: "Donor",
      email: `${randomUUID()}@example.org`,
      organization: "Org",
      message: "A substantial institutional gift",
      locale: "pt",
    };
    await submitMajorGift(body);
    await submitMajorGift(body);
    const hash = (
      await pool().query(
        "SELECT id FROM donation_outbox WHERE kind='major-gift' AND payload->>'email'=$1",
        [body.email],
      )
    ).rows;
    assert.equal(hash.length, 1);
    let calls = 0;
    const keys = [];
    await drainOutbox({
      send: async (row) => {
        if (row.id === hash[0].id) {
          calls++;
          keys.push(row.dedupe_key);
          throw new Error("network");
        }
      },
      limit: 100,
    });
    await pool().query(
      "UPDATE donation_outbox SET available_at=now() WHERE id=$1",
      [hash[0].id],
    );
    await drainOutbox({
      send: async (row) => {
        if (row.id === hash[0].id) {
          calls++;
          keys.push(row.dedupe_key);
        }
      },
      limit: 100,
    });
    assert.equal(calls, 2);
    assert.equal(keys[0], keys[1]);
    assert(
      (
        await pool().query("SELECT sent_at FROM donation_outbox WHERE id=$1", [
          hash[0].id,
        ])
      ).rows[0].sent_at,
    );
  },
);
test(
  "signed refund event resolves payment intent metadata and re-fetches canonical truth, never old paid payload",
  { skip: !enabled },
  async () => {
    const d = await createCheckout(
      input(),
      { create: async (d) => ({ providerId: `cs_${d.id}` }) },
      cfg,
    );
    await refreshDonation(d.id, async () => ({ status: "paid" }));
    const secret = "whsec_refund";
    const payload = JSON.stringify({
      id: `evt_${randomUUID()}`,
      type: "charge.refunded",
      data: {
        object: {
          id: "ch_test",
          payment_intent: "pi_test",
          amount_refunded: 1000,
        },
      },
    });
    const signature = Stripe.webhooks.generateTestHeaderString({
      payload,
      secret,
    });
    const transport = {
      paymentIntents: {
        retrieve: async () => ({ metadata: { donationId: d.id } }),
      },
    };
    await stripeWebhook(Buffer.from(payload), signature, {
      secret,
      stripe: transport,
      truth: async () => ({ status: "failed" }),
    });
    assert.equal((await getDonation(d.id, d.token)).status, "failed");
    const stale = JSON.stringify({
      id: `evt_${randomUUID()}`,
      type: "checkout.session.completed",
      data: { object: { id: `cs_${d.id}`, payment_status: "paid" } },
    });
    await stripeWebhook(
      Buffer.from(stale),
      Stripe.webhooks.generateTestHeaderString({ payload: stale, secret }),
      { secret, truth: async () => ({ status: "failed" }) },
    );
    assert.equal((await getDonation(d.id, d.token)).status, "failed");
  },
);
test.after(async () => {
  if (enabled) await pool().end();
});
