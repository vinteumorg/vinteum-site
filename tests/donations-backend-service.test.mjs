import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { pool, migrate } from "../src/lib/donations/db.mjs";
import {
  deliverOutbox,
  subscribeNewsletter,
} from "../src/lib/donations/jobs.mjs";
import {
  createCheckout,
  refreshDonation,
  getDonation,
  processEvent,
  manageDonation,
} from "../src/lib/donations/service.mjs";
process.env.DATABASE_URL ||= process.env.DONATIONS_DATABASE_URL;
const enabled = !!process.env.DATABASE_URL;
const cfg = {
  enabled: true,
  origin: "https://example.org",
  stripeEnabled: true,
  bitcoinEnabled: true,
  bitcoinMonthlyEnabled: true,
  currencies: {
    USD: { min: 500, max: 10000000 },
    BRL: { min: 500, max: 10000000 },
  },
};
const make = () => ({
  provider: "stripe",
  frequency: "monthly",
  currency: "USD",
  amount: 1000,
  email: "alice@example.org",
  firstName: "Alice",
  lastName: "Doe",
  publicConsent: true,
  publicProfile: { name: "Pseudonym", url: "https://example.org" },
  idempotencyKey: randomUUID(),
});
const provider = {
  create: async (d) => ({ providerId: `cs_${d.id}`, clientSecret: "secret" }),
  truth: async () => ({
    status: "paid",
    recurringStatus: "active",
    customerId: "cus_test",
    subscriptionId: "sub_test",
  }),
};
test.before(async () => {
  if (enabled) await migrate();
});
test(
  "real persistence: payment confirmation gates moderation; tokens deny disclosure; duplicate event serializes",
  { skip: !enabled },
  async () => {
    const created = await createCheckout(make(), provider, cfg);
    assert.equal(created.status, "pending");
    assert.equal(
      (
        await pool().query(
          "select state from donation_profiles where donation_id=$1",
          [created.id],
        )
      ).rows[0].state,
      "awaiting_payment",
    );
    await assert.rejects(
      () => getDonation(created.id, "invalid"),
      (e) => e.status === 404,
    );
    const eventId = randomUUID();
    await Promise.all(
      Array.from({ length: 4 }, () =>
        processEvent("stripe", eventId, created.id, provider.truth),
      ),
    );
    assert.equal((await getDonation(created.id, created.token)).status, "paid");
    assert.equal(
      (
        await pool().query(
          "select state from donation_profiles where donation_id=$1",
          [created.id],
        )
      ).rows[0].state,
      "pending",
    );
    assert.equal(
      (
        await pool().query(
          "select * from donation_webhook_events where event_id=$1",
          [eventId],
        )
      ).rowCount,
      1,
    );
    assert.equal(
      (
        await pool().query(
          "select * from donation_outbox where donation_id=$1 and kind='confirmation'",
          [created.id],
        )
      ).rowCount,
      1,
    );
    await refreshDonation(created.id, async () => ({
      status: "paid",
      recurringStatus: "past_due",
    }));
    assert.equal(
      (
        await pool().query(
          "select activity from donation_profiles where donation_id=$1",
          [created.id],
        )
      ).rows[0].activity,
      "past",
    );
  },
);
test(
  "checkout key does not disclose existing tokens; changed request rejects; provider create only once",
  { skip: !enabled },
  async () => {
    const input = make();
    let calls = 0;
    const p = {
      ...provider,
      create: async (d) => {
        calls++;
        return provider.create(d);
      },
    };
    const first = await createCheckout(input, p, cfg);
    await assert.rejects(
      () => createCheckout({ ...input, amount: 2000 }, p, cfg),
      (e) => e.status === 409,
    );
    assert.deepEqual(await createCheckout(input, p, cfg), first);
    assert.equal(calls, 1);
    assert.equal((await getDonation(first.id, first.token)).status, "pending");
  },
);
test(
  "private and once gifts never create public candidate",
  { skip: !enabled },
  async () => {
    const created = await createCheckout(
      {
        ...make(),
        frequency: "once",
        publicConsent: false,
        publicProfile: undefined,
      },
      provider,
      cfg,
    );
    await refreshDonation(created.id, provider.truth);
    assert.equal(
      (
        await pool().query(
          "select * from donation_profiles where donation_id=$1",
          [created.id],
        )
      ).rowCount,
      0,
    );
  },
);
test(
  "remove-public withdraws consent and records donor removal",
  { skip: !enabled },
  async () => {
    const created = await createCheckout(make(), provider, cfg);
    await refreshDonation(created.id, provider.truth);
    await manageDonation({
      id: created.id,
      token: created.manageToken,
      action: "remove-public",
    });
    assert.equal(
      (
        await pool().query("select public_consent from donations where id=$1", [
          created.id,
        ])
      ).rows[0].public_consent,
      false,
    );
    assert.equal(
      (
        await pool().query(
          "select state from donation_profiles where donation_id=$1",
          [created.id],
        )
      ).rows[0].state,
      "removed",
    );
  },
);
test(
  "confirmation email recovers a management capability in fragment, never query or plaintext storage",
  { skip: !enabled },
  async () => {
    process.env.DONATIONS_ORIGIN = "https://example.org";
    process.env.RESEND_API_KEY = "test";
    process.env.RESEND_FROM_EMAIL = "donations@example.org";
    const d = await createCheckout(make(), provider, cfg);
    await refreshDonation(d.id, provider.truth);
    const row = (
      await pool().query(
        "SELECT * FROM donation_outbox WHERE donation_id=$1 AND kind='confirmation'",
        [d.id],
      )
    ).rows[0];
    let message;
    const original = global.fetch;
    global.fetch = async (_url, o) => {
      message = JSON.parse(o.body);
      return new Response("{}");
    };
    try {
      await deliverOutbox(row);
    } finally {
      global.fetch = original;
    }
    assert(
      message.text.includes(`/donate/manage#id=${d.id}&token=${d.manageToken}`),
    );
    assert(!JSON.stringify(row.payload).includes(d.manageToken));
  },
);
test(
  "cancel requests provider change, scheduled state remains paid until canonical cancellation",
  { skip: !enabled },
  async () => {
    const d = await createCheckout(make(), provider, cfg);
    await refreshDonation(d.id, provider.truth);
    let update;
    await manageDonation(
      { id: d.id, token: d.manageToken, action: "cancel" },
      {
        stripe: {
          subscriptions: {
            update: async (...args) => {
              update = args;
            },
          },
        },
        truth: async () => ({
          status: "paid",
          recurringStatus: "active",
          cancellationScheduled: true,
        }),
      },
    );
    assert.equal(update[1].cancel_at_period_end, true);
    assert.equal((await getDonation(d.id, d.token)).status, "paid");
    assert.equal(
      (
        await pool().query(
          "SELECT * FROM donation_outbox WHERE donation_id=$1 AND kind='cancellation'",
          [d.id],
        )
      ).rowCount,
      0,
    );
    assert.equal(
      (
        await pool().query(
          "SELECT * FROM donation_outbox WHERE donation_id=$1 AND kind='cancellation-scheduled'",
          [d.id],
        )
      ).rowCount,
      1,
    );
    await refreshDonation(d.id, async () => ({
      status: "cancelled",
      recurringStatus: "cancelled",
    }));
    assert.equal((await getDonation(d.id, d.token)).status, "cancelled");
  },
);
test("newsletter appends the existing Ghost list and never reactivates globally unsubscribed members", async () => {
  process.env.GHOST_URL = "https://ghost.example.org";
  process.env.GHOST_ADMIN_API_KEY = "test:" + "ab".repeat(32);
  process.env.DONATIONS_GHOST_NEWSLETTER_ID = "new";
  let writes = [],
    subscribed = true;
  const original = global.fetch;
  global.fetch = async (_url, o) => {
    if (o.method === "GET")
      return Response.json({
        members: [
          { id: "member", subscribed, newsletters: [{ id: "existing" }] },
        ],
      });
    writes.push(JSON.parse(o.body));
    return Response.json({ members: [] });
  };
  try {
    await subscribeNewsletter({ email: "test@example.org", name: "Test" });
    assert.deepEqual(writes[0].members[0].newsletters, [
      { id: "existing" },
      { id: "new" },
    ]);
    subscribed = false;
    writes = [];
    await subscribeNewsletter({ email: "test@example.org" });
    assert.equal(writes.length, 0);
  } finally {
    global.fetch = original;
  }
});
test.after(async () => {
  if (enabled) await pool().end();
});
