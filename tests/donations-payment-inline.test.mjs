import test from "node:test";
import assert from "node:assert/strict";

process.env.BTCPAY_STORE_ID = "test-store";

const donation = {
  id: "9d1a5f0e-6b1f-4f6a-9a7c-2d3e4f5a6b7c",
  provider: "btcpay",
  frequency: "once",
  currency: "BRL",
  amount: 2500,
  provider_id: "inv-1",
};
const invoice = (overrides = {}) => ({
  id: "inv-1",
  storeId: "test-store",
  amount: "25.00",
  currency: "BRL",
  status: "New",
  additionalStatus: "None",
  expirationTime: 1795540842,
  metadata: { orderId: donation.id },
  ...overrides,
});
const methodList = (overrides = {}) => [
    {
      paymentMethodId: "BTC-LN",
      destination: "lnbcrt1u1p3xyzqpp5examplebolt11invoice",
      paymentLink: "bitcoin:lnbcrt1u1p3xyzqpp5examplebolt11invoice",
      amount: "0.00010000",
      due: "0.00010000",
      rate: "2500000",
      ...overrides.ln,
    },
    {
      paymentMethodId: "BTC-CHAIN",
      destination: "bcrt1qexampleaddress000000000000000000000",
      paymentLink: "bitcoin:bcrt1qexampleaddress000000000000000000000",
      amount: "0.00010000",
      due: "0.00010000",
      rate: "2500000",
      ...overrides.chain,
    },
];
const methods = (overrides = {}) => methodList(overrides);
const wrappedMethods = (overrides = {}) => ({ paymentMethods: methodList(overrides) });

test("one-off Bitcoin payment data is reduced to status, expiry and allowlisted methods", async () => {
  const { btcpayPayment } = await import("../src/lib/donations/providers.mjs");
  const paths = [];
  const request = async (path) => {
    paths.push(path);
    if (path.endsWith("/payment-methods")) return methods();
    return invoice();
  };
  const data = await btcpayPayment(donation, { request });

  assert.deepEqual(paths, [
    "/stores/test-store/invoices/inv-1",
    "/stores/test-store/invoices/inv-1/payment-methods",
  ]);
  assert.deepEqual(data, {
    status: "pending",
    expiresAt: "2026-11-24T17:20:42.000Z",
    methods: [
      {
        kind: "lightning",
        uri: "lnbcrt1u1p3xyzqpp5examplebolt11invoice",
        address: null,
        btcAmount: "0.00010000",
        confirmed: false,
      },
      {
        kind: "onchain",
        uri: "bitcoin:bcrt1qexampleaddress000000000000000000000",
        address: "bcrt1qexampleaddress000000000000000000000",
        btcAmount: "0.00010000",
        confirmed: false,
      },
    ],
  });
});

const withRequest = (invoiceOverrides = {}, methodOverrides = {}) => {
  const paths = [];
  const request = async (path) => {
    paths.push(path);
    if (path.endsWith("/payment-methods")) return methods(methodOverrides);
    return invoice(invoiceOverrides);
  };
  return { paths, request };
};

test("payment data refuses an invoice that belongs to another donation or amount", async () => {
  const { btcpayPayment } = await import("../src/lib/donations/providers.mjs");
  for (const overrides of [
    { id: "inv-other" },
    { metadata: { orderId: "another-donation" } },
    { metadata: {} },
    { amount: "26.00" },
    { currency: "USD" },
  ]) {
    const { request } = withRequest(overrides);
    await assert.rejects(
      () => btcpayPayment(donation, { request }),
      (error) => error.status === 503,
      JSON.stringify(overrides),
    );
  }
});

test("settled, expired and late invoices report the panel status, not vendor fields", async () => {
  const { btcpayPayment } = await import("../src/lib/donations/providers.mjs");
  const settled = await btcpayPayment(donation, {
    request: withRequest({ status: "Settled" }).request,
  });
  assert.equal(settled.status, "paid");

  const expired = await btcpayPayment(donation, {
    request: withRequest({ status: "Expired" }).request,
  });
  assert.equal(expired.status, "expired");
  assert.equal(Object.hasOwn(expired, "additionalStatus"), false);

  const late = await btcpayPayment(donation, {
    request: withRequest({ status: "Expired", additionalStatus: "PaidLate" })
      .request,
  });
  assert.equal(late.status, "late");

  const invalid = await btcpayPayment(donation, {
    request: withRequest({ status: "Invalid" }).request,
  });
  assert.equal(invalid.status, "failed");
});

test("an unactivated payment method is omitted instead of rendered empty", async () => {
  const { btcpayPayment } = await import("../src/lib/donations/providers.mjs");
  const [{ methods: list }] = [
    await btcpayPayment(donation, {
      request: withRequest(
        {},
        { ln: { destination: "", paymentLink: "" } },
      ).request,
    }),
  ];
  assert.deepEqual(
    list.map((method) => method.kind),
    ["onchain"],
  );
});

test("unsafe or unknown payment destinations never reach the panel", async () => {
  const { btcpayPayment } = await import("../src/lib/donations/providers.mjs");
  const data = await btcpayPayment(donation, {
    request: withRequest(
      {},
      {
        ln: {
          destination: "javascript:alert(1)",
          paymentLink: "javascript:alert(1)",
        },
        chain: {
          destination: "https://evil.example/pay",
          paymentLink: "https://evil.example/pay",
        },
      },
    ).request,
  });
  assert.deepEqual(data.methods, []);
});

test("one payment method per rail is kept in provider order", async () => {
  const { btcpayPayment } = await import("../src/lib/donations/providers.mjs");
  const request = async (path) =>
    path.endsWith("/payment-methods")
      ? {
          paymentMethods: [
            ...methodList(),
            {
              paymentMethodId: "BTC-LN",
              destination: "lnbcrt1secondduplicate",
              amount: "0.00010000",
              due: "0.00010000",
            },
          ],
        }
      : invoice();
  const data = await btcpayPayment(donation, { request });
  assert.equal(data.methods.filter((m) => m.kind === "lightning").length, 1);
  assert.equal(data.methods[0].uri, "lnbcrt1u1p3xyzqpp5examplebolt11invoice");
});

test("the QR payload normalises a BOLT11 invoice and keeps a BIP21 URI intact", async () => {
  const { paymentQrPayload } = await import("../src/lib/donations/payment-qr.mjs");
  assert.equal(
    paymentQrPayload("lnbcrt1u1p3xyzqpp5examplebolt11invoice"),
    "LNBCRT1U1P3XYZQPP5EXAMPLEBOLT11INVOICE",
  );
  assert.equal(
    paymentQrPayload("bitcoin:bcrt1qexample?amount=0.0001"),
    "bitcoin:bcrt1qexample?amount=0.0001",
  );
  assert.equal(paymentQrPayload("javascript:alert(1)"), null);
  assert.equal(paymentQrPayload("https://evil.example/invoice"), null);
  assert.equal(paymentQrPayload(""), null);
  assert.equal(paymentQrPayload("lnbcrt" + "q".repeat(3000)), null);
  assert.equal(paymentQrPayload(["lnbcrt1abc"]), null);
});

test("the server generates a self-contained, script-free QR SVG", async () => {
  const { paymentQr } = await import("../src/lib/donations/payment-qr.mjs");
  const svg = await paymentQr("lnbcrt1u1p3xyzqpp5examplebolt11invoice");
  assert.equal(typeof svg, "string");
  assert.match(svg, /^<svg /);
  assert.match(svg, /role="img"/);
  assert.match(svg, /aria-label="Bitcoin payment QR code"/);
  assert.match(svg, /viewBox="/);
  assert.doesNotMatch(svg, /<script/i);
  assert.doesNotMatch(svg, /javascript:/i);
  assert.doesNotMatch(svg, /\son[a-z]+=/i);
  assert.doesNotMatch(svg, /<image|<foreignObject|xlink:href|url\(/i);
  assert.ok(svg.length < 20000, `svg too long: ${svg.length}`);
  assert.equal(await paymentQr("javascript:alert(1)"), null);
  assert.equal(await paymentQr(undefined), null);
});

const paymentRequest = (invoiceOverrides = {}, methodOverrides = {}) => {
  const request = async (path) =>
    path.endsWith("/payment-methods")
      ? methods(methodOverrides)
      : invoice(invoiceOverrides);
  return request;
};

test("the payment route authenticates with the status bearer token only", async () => {
  const { paymentGETWith } = await import("../src/lib/donations/payment.mjs");
  const seen = [];
  const handler = paymentGETWith({
    lookup: async (id, token) => {
      seen.push([id, token]);
      return donation;
    },
    details: async (d) => ({ id: d.id, status: "pending" }),
  });
  const url = `https://vinteum.org/api/donations/payment?id=${donation.id}`;
  await assert.rejects(
    () => handler(new Request(url)),
    (error) => error.status === 401,
  );
  await assert.rejects(
    () => handler(new Request(url, { headers: { Authorization: "Basic abc" } })),
    (error) => error.status === 401,
  );
  await assert.rejects(
    () =>
      handler(
        new Request(`${url}&token=leaked`, {
          headers: { Authorization: `Bearer ${"a".repeat(43)}` },
        }),
      ),
    (error) => error.status === 400,
  );
  assert.deepEqual(seen, []);

  const response = await handler(
    new Request(url, { headers: { Authorization: `Bearer ${"b".repeat(43)}` } }),
  );
  assert.equal(response.status, 200);
  assert.deepEqual(seen, [[donation.id, "b".repeat(43)]]);
  assert.equal((await response.json()).status, "pending");
});

test("a token issued for another donation is not found and never reaches the provider", async () => {
  const { paymentGETWith } = await import("../src/lib/donations/payment.mjs");
  const { tokenHash } = await import("../src/lib/donations/core.mjs");
  const { DonationError } = await import("../src/lib/donations/core.mjs");
  let detailsCalls = 0;
  const handler = paymentGETWith({
    lookup: async (id, token) => {
      const row = {
        id: donation.id,
        status_token_hash: tokenHash("issued-for-this-donation"),
      };
      if (tokenHash(token) !== row.status_token_hash)
        throw new DonationError("Not found", 404);
      return { ...donation, ...row };
    },
    details: async (d) => {
      detailsCalls += 1;
      return { id: d.id };
    },
  });
  await assert.rejects(
    () =>
      handler(
        new Request(
          `https://vinteum.org/api/donations/payment?id=${donation.id}`,
          { headers: { Authorization: `Bearer ${"c".repeat(43)}` } },
        ),
      ),
    (error) => error.status === 404 && error.message === "Not found",
  );
  assert.equal(detailsCalls, 0);
});

test("a malformed donation id is refused before any lookup", async () => {
  const { paymentGETWith } = await import("../src/lib/donations/payment.mjs");
  let calls = 0;
  const handler = paymentGETWith({
    lookup: async () => {
      calls += 1;
      return donation;
    },
    details: async () => ({}),
  });
  await assert.rejects(
    () =>
      handler(
        new Request("https://vinteum.org/api/donations/payment?id=not-a-uuid", {
          headers: { Authorization: `Bearer ${"d".repeat(43)}` },
        }),
      ),
    (error) => error.status === 404,
  );
  assert.equal(calls, 0);
});

test("card donations never expose inline Bitcoin payment data", async () => {
  const { paymentDetails } = await import("../src/lib/donations/payment.mjs");
  let providerCalls = 0;
  const request = async () => {
    providerCalls += 1;
    return invoice();
  };
  for (const d of [
    { ...donation, provider: "stripe", provider_id: "cs_test_1" },
    { ...donation, provider: "btcpay", frequency: "weekly" },
  ]) {
    await assert.rejects(
      () => paymentDetails(d, { request }),
      (error) => error.status === 404,
    );
  }
  assert.equal(providerCalls, 0);
});

test("monthly payment data is the same inline shape, produced through the plan checkout", async () => {
  const { paymentDetails } = await import("../src/lib/donations/payment.mjs");
  const { request, calls } = planRequest();
  const data = await paymentDetails(monthlyDonation, {
    request,
    serialized: async (fn) => fn(),
  });
  assert.equal(data.id, monthlyDonation.id);
  assert.equal(data.status, "pending");
  assert.match(data.qr.lightning, /^<svg /);
  assert.match(data.qr.onchain, /^<svg /);
  assert.deepEqual(
    calls.filter(([, method]) => method === "POST"),
    [["/plan-checkout/plan-checkout-1", "POST"]],
  );
});

test("the payment response is an allowlisted shape with server-rendered QR codes", async () => {
  const { paymentDetails } = await import("../src/lib/donations/payment.mjs");
  const data = await paymentDetails(donation, { request: paymentRequest() });
  assert.deepEqual(Object.keys(data), [
    "id",
    "status",
    "expiresAt",
    "methods",
    "qr",
  ]);
  assert.deepEqual(Object.keys(data.qr), ["lightning", "onchain"]);
  assert.match(data.qr.lightning, /^<svg /);
  assert.match(data.qr.onchain, /^<svg /);
  const serialized = JSON.stringify(data);
  assert.equal(serialized.includes("metadata"), false);
  assert.equal(serialized.includes("Bearer"), false);
  assert.equal(serialized.includes("paymentMethods"), false);
});

test("a provider failure is reported as an unavailable payment, not a partial payload", async () => {
  const { paymentDetails } = await import("../src/lib/donations/payment.mjs");
  const { DonationError } = await import("../src/lib/donations/core.mjs");
  await assert.rejects(
    () =>
      paymentDetails(donation, {
        request: async () => {
          throw new DonationError("Bitcoin processor unavailable", 503);
        },
      }),
    (error) => error.status === 503,
  );
  await assert.rejects(
    () => paymentDetails(donation, { request: async () => null }),
    (error) => error.status === 503,
  );
});

const monthlyDonation = {
  ...donation,
  provider_id: "plan-checkout-1",
  frequency: "monthly",
  offering_id: "offering-1",
  plan_id: "plan-1",
  donor_email: "donor@example.org",
};
const monthlyPlan = {
  id: "plan-1",
  price: "25.00",
  currency: "BRL",
  recurringType: "Monthly",
  optimisticActivation: false,
  trialDays: 0,
  renewable: true,
  status: "Active",
};
const planCheckout = (overrides = {}) => ({
  id: "plan-checkout-1",
  metadata: { donationId: monthlyDonation.id },
  plan: monthlyPlan,
  isTrial: false,
  isExpired: false,
  invoiceId: null,
  subscriber: null,
  ...overrides,
});
const planInvoice = (overrides = {}) =>
  invoice({ id: "inv-plan-9", metadata: { orderId: monthlyDonation.id }, ...overrides });

function planRequest({ checkout, invoiceAfterProceed, postError } = {}) {
  const calls = [];
  let checkouts = 0;
  const request = async (path, options = {}) => {
    calls.push([path, options.method || "GET"]);
    if (path.endsWith("/payment-methods")) return methods();
    if (path.startsWith("/plan-checkout/") && options.method === "POST") {
      if (postError) throw postError;
      return checkout ?? planCheckout({ invoiceId: "inv-plan-9" });
    }
    if (path.startsWith("/plan-checkout/")) {
      checkouts += 1;
      return typeof checkout === "function"
        ? checkout(checkouts)
        : (checkout ?? planCheckout());
    }
    if (path.includes("/invoices/")) return invoiceAfterProceed ?? planInvoice();
    return null;
  };
  return { calls, request };
}

test("monthly Bitcoin proceeds the plan checkout once and renders its invoice inline", async () => {
  const { btcpayPlanPayment } = await import("../src/lib/donations/providers.mjs");
  const { request, calls } = planRequest();
  let locks = 0;
  const data = await btcpayPlanPayment(monthlyDonation, {
    request,
    serialized: async (fn) => {
      locks += 1;
      return fn();
    },
  });
  assert.equal(locks, 1);
  assert.deepEqual(
    calls.filter(([, method]) => method === "POST"),
    [["/plan-checkout/plan-checkout-1", "POST"]],
  );
  assert.equal(data.status, "pending");
  assert.equal(data.expiresAt, "2026-11-24T17:20:42.000Z");
  assert.deepEqual(
    data.methods.map((method) => method.kind),
    ["lightning", "onchain"],
  );
});

test("monthly never proceeds a checkout that already has an invoice", async () => {
  const { btcpayPlanPayment } = await import("../src/lib/donations/providers.mjs");
  const { request, calls } = planRequest({
    checkout: planCheckout({ invoiceId: "inv-plan-9" }),
  });
  let locks = 0;
  await btcpayPlanPayment(monthlyDonation, {
    request,
    serialized: async (fn) => {
      locks += 1;
      return fn();
    },
  });
  assert.equal(locks, 0);
  assert.equal(calls.some(([, method]) => method === "POST"), false);
  assert.equal(calls.some(([path]) => path.endsWith("/invoices/inv-plan-9")), true);
});

test("a concurrent second call re-reads under the lock instead of proceeding twice", async () => {
  const { btcpayPlanPayment } = await import("../src/lib/donations/providers.mjs");
  const { request, calls } = planRequest({
    checkout: (read) => planCheckout({ invoiceId: read === 1 ? null : "inv-plan-9" }),
  });
  const data = await btcpayPlanPayment(monthlyDonation, {
    request,
    serialized: async (fn) => fn(),
  });
  assert.equal(calls.some(([, method]) => method === "POST"), false);
  assert.equal(data.status, "pending");
});

test("monthly fails closed without a donor email and never proceeds the checkout", async () => {
  const { btcpayPlanPayment } = await import("../src/lib/donations/providers.mjs");
  const { request, calls } = planRequest();
  let locks = 0;
  await assert.rejects(
    () =>
      btcpayPlanPayment(
        { ...monthlyDonation, donor_email: null },
        {
          request,
          serialized: async (fn) => {
            locks += 1;
            return fn();
          },
        },
      ),
    (error) => error.status === 503,
  );
  assert.equal(locks, 0);
  assert.equal(calls.length, 0);
});

test("an expired plan checkout is refused instead of proceeding a payment", async () => {
  const { btcpayPlanPayment } = await import("../src/lib/donations/providers.mjs");
  const { request, calls } = planRequest({
    checkout: planCheckout({ isExpired: true }),
  });
  await assert.rejects(
    () => btcpayPlanPayment(monthlyDonation, { request }),
    (error) => error.status === 503,
  );
  assert.equal(calls.some(([, method]) => method === "POST"), false);
});

test("an invoice from another donation is refused for monthly too", async () => {
  const { btcpayPlanPayment } = await import("../src/lib/donations/providers.mjs");
  const { request } = planRequest({
    checkout: planCheckout({ invoiceId: "inv-plan-9" }),
    invoiceAfterProceed: planInvoice({ metadata: { orderId: "another-donation" } }),
  });
  await assert.rejects(
    () => btcpayPlanPayment(monthlyDonation, { request }),
    (error) => error.status === 503,
  );
});

test("a plan or subscriber mismatch stops the monthly payment", async () => {
  const { btcpayPlanPayment } = await import("../src/lib/donations/providers.mjs");
  for (const checkout of [
    planCheckout({ id: "another-checkout" }),
    planCheckout({ metadata: { donationId: "another-donation" } }),
    planCheckout({ plan: { ...monthlyPlan, price: "30.00" } }),
    planCheckout({ isTrial: true }),
  ]) {
    const { request } = planRequest({ checkout });
    await assert.rejects(
      () => btcpayPlanPayment(monthlyDonation, { serialized: async (fn) => fn(), request }),
      (error) => error.status === 503,
    );
  }
});

test("a provider invoice-creation error maps to 503 and is not retried", async () => {
  const { btcpayPlanPayment } = await import("../src/lib/donations/providers.mjs");
  const { DonationError } = await import("../src/lib/donations/core.mjs");
  let posts = 0;
  const request = async (path, options = {}) => {
    if (options.method === "POST") {
      posts += 1;
      throw new DonationError("Bitcoin processor unavailable", 503);
    }
    if (path.endsWith("/payment-methods")) return methods();
    if (path.startsWith("/plan-checkout/")) return planCheckout();
    return planInvoice();
  };
  await assert.rejects(
    () => btcpayPlanPayment(monthlyDonation, { request, serialized: async (fn) => fn() }),
    (error) => error.status === 503,
  );
  assert.equal(posts, 1);
});


test("payment methods accept the installed bare-array response and still accept the wrapped shape", async () => {
  const { btcpayPayment } = await import("../src/lib/donations/providers.mjs");
  for (const response of [methodList(), wrappedMethods()]) {
    const data = await btcpayPayment(donation, {
      request: async (path) => (path.endsWith("/payment-methods") ? response : invoice()),
    });
    assert.deepEqual(data.methods.map((m) => m.kind), ["lightning", "onchain"]);
    // Unix-seconds expiry is normalised, never echoed as a number.
    assert.equal(data.expiresAt, "2026-11-24T17:20:42.000Z");
  }
});

test("monthly payment methods are read from the proceeded invoice, never from the plan-checkout id", async () => {
  const { btcpayPlanPayment } = await import("../src/lib/donations/providers.mjs");
  const seen = [];
  const request = async (path, options = {}) => {
    seen.push(path);
    if (path.endsWith("/payment-methods")) return methodList();
    if (path.startsWith("/plan-checkout/") && options.method === "POST")
      return planCheckout({ invoiceId: "inv-plan-9" });
    if (path.startsWith("/plan-checkout/")) return planCheckout();
    if (path.includes("/invoices/")) return planInvoice();
    return null;
  };
  const data = await btcpayPlanPayment(monthlyDonation, {
    request,
    serialized: async (fn) => fn(),
  });
  assert.ok(seen.includes("/stores/test-store/invoices/inv-plan-9/payment-methods"), seen.join(","));
  assert.equal(seen.some((path) => path.includes("plan-checkout-1/payment-methods")), false);
  assert.equal(data.methods.length, 2);
});
