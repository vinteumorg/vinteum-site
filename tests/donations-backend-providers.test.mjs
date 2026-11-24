import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
let fixture;
test.before(async () => {
  fixture = await mkdtemp(join(process.env.TMPDIR, "donations-provider-"));
  process.env.BTCPAY_NETWORK_ATTESTATION_FILE = join(fixture, "evidence.json");
  process.env.BTCPAY_STORE_ID = "test-store";
  process.env.BTCPAY_TEST_NETWORK = "true";
  process.env.BTCPAY_URL = "https://pay.example.org";
  await evidence("regtest");
});
test.after(async () => {
  await rm(fixture, { recursive: true, force: true });
});
async function evidence(network) {
  await writeFile(
    process.env.BTCPAY_NETWORK_ATTESTATION_FILE,
    JSON.stringify({
      origin: new URL(process.env.BTCPAY_URL).origin,
      storeId: process.env.BTCPAY_STORE_ID,
      version: "2.4.7",
      network,
      verifiedAt: new Date().toISOString(),
      evidence: "MOCKED deployment evidence in unit tests ONLY",
    }),
  );
}
import {
  stripeCreate,
  stripeTruth,
  bitcoinTruth,
  btcpayCreate,
  providerTruth,
  assertBitcoinNetwork,
  providerUrl,
} from "../src/lib/donations/providers.mjs";
const donation = {
  id: "internal-id",
  provider: "stripe",
  frequency: "monthly",
  currency: "BRL",
  amount: 2500,
  email: "donor@example.org",
  locale: "pt",
};
test("Stripe creates embedded recurring session with server amount and durable idempotency", async () => {
  let received;
  const stripe = {
    checkout: {
      sessions: {
        create: async (...args) => {
          received = args;
          return { id: "cs_test_1", client_secret: "secret" };
        },
      },
    },
  };
  await stripeCreate(donation, stripe, { origin: "https://example.org" });
  assert.equal(received[0].ui_mode, "embedded_page");
  assert.equal(received[0].mode, "subscription");
  assert.equal(received[0].line_items[0].price_data.currency, "brl");
  assert.equal(received[0].line_items[0].price_data.unit_amount, 2500);
  assert.deepEqual(received[0].line_items[0].price_data.recurring, {
    interval: "month",
  });
  assert.equal(received[1].idempotencyKey, "donation:internal-id");
});
test("Stripe authoritative state excludes incomplete and failed renewal subscriptions", () => {
  assert.equal(
    stripeTruth({ payment_status: "unpaid", status: "complete" }, null).status,
    "pending",
  );
  assert.equal(
    stripeTruth(
      { payment_status: "paid", status: "complete" },
      { status: "past_due" },
    ).recurringStatus,
    "past_due",
  );
  assert.equal(
    stripeTruth(
      { payment_status: "paid", status: "complete" },
      { status: "canceled" },
    ).recurringStatus,
    "cancelled",
  );
  assert.equal(
    stripeTruth({ payment_status: "unpaid", status: "expired" }, null).status,
    "expired",
  );
});
test("BTCPay treats processing, partial, late and expired as NOT confirmed payment", () => {
  assert.equal(bitcoinTruth({ status: "Settled" }).status, "paid");
  assert.equal(bitcoinTruth({ status: "Processing" }).status, "confirming");
  assert.equal(
    bitcoinTruth({ status: "Expired", additionalStatus: "PaidPartial" }).status,
    "partial",
  );
  assert.equal(
    bitcoinTruth({ status: "Expired", additionalStatus: "PaidLate" }).status,
    "late",
  );
  assert.equal(bitcoinTruth({ status: "Expired" }).status, "expired");
});
test("native BTC invoice uses exact decimal amount, no identifying data for direct gifts", async () => {
  let body;
  const request = async (path, options) => {
    if (path === "/server/info") return { version: "2.4.7" };
    body = options.body;
    return { id: "invoice", checkoutLink: "https://pay.example.org/i/invoice" };
  };
  process.env.BTCPAY_TEST_NETWORK = "true";
  await btcpayCreate(
    {
      ...donation,
      provider: "btcpay",
      frequency: "once",
      direct: true,
      email: null,
    },
    request,
    { origin: "https://example.org" },
  );
  assert.equal(body.amount, "25.00");
  assert.equal(body.currency, "BRL");
  assert.equal(body.metadata.buyerEmail, undefined);
  assert.equal(body.metadata.orderId, "internal-id");
});
test("Stripe renewal failure, scheduled cancellation and refunded charge override historic session payment", () => {
  const session = { payment_status: "paid", status: "complete" };
  assert.equal(
    stripeTruth(session, {
      status: "past_due",
      latest_invoice: { status: "open", attempt_count: 1 },
    }).status,
    "failed",
  );
  const scheduled = stripeTruth(session, {
    status: "active",
    cancel_at_period_end: true,
    latest_invoice: { status: "paid" },
  });
  assert.equal(scheduled.status, "paid");
  assert.equal(scheduled.cancellationScheduled, true);
  assert.equal(
    stripeTruth(session, null, { amount_refunded: 100 }).status,
    "failed",
  );
});
test("canonical Stripe fetch rejects cross-donation amount or metadata before reporting paid", async () => {
  const d = { ...donation, provider_id: "cs_1", frequency: "once" };
  const session = {
    id: "cs_1",
    amount_total: 2500,
    currency: "brl",
    client_reference_id: d.id,
    metadata: { donationId: d.id },
    payment_status: "paid",
    payment_intent: {
      latest_charge: {
        amount_refunded: 0,
        paid: true,
        captured: true,
        amount: 2500,
        currency: "brl",
      },
    },
  };
  const stripe = { checkout: { sessions: { retrieve: async () => session } } };
  assert.equal((await providerTruth(d, { stripe })).status, "paid");
  session.amount_total = 2501;
  await assert.rejects(() => providerTruth(d, { stripe }));
  session.amount_total = 2500;
  session.metadata.donationId = "other";
  await assert.rejects(() => providerTruth(d, { stripe }));
});
test("Bitcoin test flag cannot allow a mainnet server and provider URL policy is separate from public links", async () => {
  const old = {
    url: process.env.BTCPAY_URL,
    test: process.env.BTCPAY_TEST_NETWORK,
    live: process.env.DONATIONS_ALLOW_LIVE,
  };
  try {
    process.env.BTCPAY_TEST_NETWORK = "true";
    delete process.env.DONATIONS_ALLOW_LIVE;
    process.env.BTCPAY_URL = "http://127.0.0.1:1234";
    await evidence("mainnet");
    await assert.rejects(() =>
      assertBitcoinNetwork(async () => ({ version: "2.4.7" })),
    );
    await evidence("regtest");
    await assertBitcoinNetwork(async () => ({ version: "2.4.7" }));
    assert.equal(
      providerUrl("http://127.0.0.1:1234/i/abc"),
      "http://127.0.0.1:1234/i/abc",
    );
    assert.throws(() => providerUrl("http://evil.org/i/abc"));
  } finally {
    for (const [k, v] of [
      ["BTCPAY_URL", old.url],
      ["BTCPAY_TEST_NETWORK", old.test],
      ["DONATIONS_ALLOW_LIVE", old.live],
    ])
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
  }
});

test("canonical Stripe subscription fetch reads latest invoice payments, renewal failures, scheduled cancellation and refund", async () => {
  const d = { ...donation, provider_id: "cs_month" };
  let invoice = {
    id: "in_current",
    currency: "brl",
    amount_due: 2500,
    amount_paid: 2500,
    status: "paid",
    attempt_count: 1,
  };
  let charge = {
    paid: true,
    captured: true,
    amount: 2500,
    currency: "brl",
    amount_refunded: 0,
  };
  const subscription = {
    id: "sub_month",
    status: "active",
    metadata: { donationId: d.id },
    items: {
      data: [
        {
          quantity: 1,
          price: {
            unit_amount: 2500,
            currency: "brl",
            recurring: { interval: "month" },
          },
        },
      ],
    },
    latest_invoice: invoice,
  };
  const stripe = {
    checkout: {
      sessions: {
        retrieve: async () => ({
          id: d.provider_id,
          amount_total: 2500,
          currency: "brl",
          metadata: { donationId: d.id },
          client_reference_id: d.id,
          payment_status: "paid",
          subscription: "sub_month",
        }),
      },
    },
    subscriptions: { retrieve: async () => subscription },
    invoicePayments: {
      list: async () => ({
        data: [{ payment: { payment_intent: "pi_current" } }],
        has_more: false,
      }),
    },
    paymentIntents: { retrieve: async () => ({ latest_charge: charge }) },
  };
  assert.equal((await providerTruth(d, { stripe })).status, "paid");
  invoice.status = "open";
  invoice.amount_paid = 0;
  subscription.status = "past_due";
  assert.equal((await providerTruth(d, { stripe })).status, "failed");
  invoice.status = "paid";
  invoice.amount_paid = 2500;
  subscription.status = "active";
  subscription.cancel_at_period_end = true;
  assert.equal(
    (await providerTruth(d, { stripe })).cancellationScheduled,
    true,
  );
  charge.amount_refunded = 100;
  assert.equal((await providerTruth(d, { stripe })).status, "failed");
  charge = { paid: false, amount: 2500, currency: "brl" };
  await assert.rejects(() => providerTruth(d, { stripe }));
});

test("BTC monthly native checkout validates configured plan and never activates from checkout redirect", async () => {
  process.env.BTCPAY_URL = "https://pay.example.org";
  await evidence("regtest");
  const plan = {
    id: "plan",
    status: "Active",
    currency: "BRL",
    price: "25.00",
    recurringType: "Monthly",
    optimisticActivation: false,
    trialDays: 0,
    renewable: true,
  };
  process.env.BTCPAY_MONTHLY_PLANS = JSON.stringify({
    "BRL:2500": { offeringId: "off", planId: "plan" },
  });
  let creation;
  const request = async (path, o) => {
    if (path === "/server/info") return { version: "2.4.7" };
    if (path === "/plan-checkout") {
      creation = o.body;
      return {
        id: "checkout",
        url: "https://pay.example.org/plan-checkout/checkout",
      };
    }
    return plan;
  };
  const result = await btcpayCreate(
    { ...donation, provider: "btcpay" },
    request,
    { bitcoinMonthlyEnabled: true },
  );
  assert.equal(result.planId, "plan");
  assert.equal(creation.isTrial, false);
  assert.equal(creation.newSubscriberMetadata.donationId, donation.id);
  const d = {
    ...donation,
    provider: "btcpay",
    provider_id: "checkout",
    offering_id: "off",
    plan_id: "plan",
  };
  let phase = "Normal",
    suspended = false;
  const truthRequest = async (path) =>
    path.startsWith("/plan-checkout/")
      ? {
          id: "checkout",
          metadata: { donationId: d.id },
          plan,
          isTrial: false,
          invoiceId: "inv",
          subscriber: { customer: { id: "customer" } },
        }
      : path.includes("/invoices/")
        ? {
            status: "Settled",
            currency: "BRL",
            amount: "25.00",
            metadata: { orderId: d.id },
          }
        : {
            metadata: { donationId: d.id },
            offering: { id: "off" },
            customer: { id: "customer" },
            plan,
            isActive: true,
            phase,
            isSuspended: suspended,
          };
  assert.equal(
    (await providerTruth(d, { request: truthRequest })).status,
    "paid",
  );
  phase = "Grace";
  assert.equal(
    (await providerTruth(d, { request: truthRequest })).status,
    "failed",
  );
  suspended = true;
  assert.equal(
    (await providerTruth(d, { request: truthRequest })).status,
    "cancelled",
  );
  plan.optimisticActivation = true;
  await assert.rejects(() =>
    btcpayCreate({ ...donation, provider: "btcpay" }, request, {
      bitcoinMonthlyEnabled: true,
    }),
  );
  delete process.env.BTCPAY_MONTHLY_PLANS;
});
