import Stripe from "stripe";
import { readFile } from "node:fs/promises";
import { check, config } from "./core.mjs";
import { transaction } from "./db.mjs";
import { monthlyPlan, validatePlan, decimalMinor } from "./plans.mjs";
/** Provider boundary: authenticated GETs, never redirects or webhook payloads, establish payment truth.
 * @typedef {{status:string,recurringStatus?:string|null,customerId?:string,subscriptionId?:string,cancellationScheduled?:boolean}} PaymentTruth
 */
export const stripeClient = () => {
  config();
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    timeout: 12000,
    maxNetworkRetries: 2,
  });
};
export async function stripeCreate(d, stripe = stripeClient()) {
  const price = {
    currency: d.currency.toLowerCase(),
    unit_amount: d.amount,
    product_data: { name: "Vinteum — unrestricted donation" },
    ...(d.frequency === "monthly" ? { recurring: { interval: "month" } } : {}),
  };
  const session = await stripe.checkout.sessions.create(
    {
      ui_mode: "embedded_page",
      mode: d.frequency === "monthly" ? "subscription" : "payment",
      line_items: [{ price_data: price, quantity: 1 }],
      customer_email: d.email,
      client_reference_id: d.id,
      metadata: { donationId: d.id },
      ...(d.frequency === "monthly"
        ? { subscription_data: { metadata: { donationId: d.id } } }
        : { payment_intent_data: { metadata: { donationId: d.id } } }),
      locale: d.locale === "pt" ? "pt-BR" : "en",
      redirect_on_completion: "never",
    },
    { idempotencyKey: `donation:${d.id}` },
  );
  return { providerId: session.id, clientSecret: session.client_secret };
}
export function stripeTruth(session, subscription, charge) {
  let status =
    session.payment_status === "paid"
      ? "paid"
      : session.status === "expired"
        ? "expired"
        : "pending";
  const recurringStatus = subscription
    ? subscription.status === "canceled"
      ? "cancelled"
      : subscription.status
    : null;
  const invoice = subscription?.latest_invoice;
  if (subscription) {
    if (subscription.status === "canceled") status = "cancelled";
    else if (
      ["past_due", "unpaid", "incomplete_expired", "paused"].includes(
        subscription.status,
      )
    )
      status = "failed";
    else if (
      invoice &&
      typeof invoice === "object" &&
      invoice.status !== "paid"
    )
      status = invoice.attempt_count > 0 ? "failed" : "pending";
    else if (subscription.status !== "active" || !invoice) status = "pending";
    else if (invoice.status === "paid") status = "paid";
  }
  if (charge && (charge.amount_refunded > 0 || charge.disputed))
    status = "failed";
  return {
    status,
    recurringStatus,
    cancellationScheduled: subscription?.cancel_at_period_end === true,
    customerId: objectId(session.customer),
    subscriptionId: objectId(session.subscription),
  };
}
const objectId = (value) => (typeof value === "string" ? value : value?.id);
export function bitcoinTruth(invoice) {
  const status =
    invoice.status === "Settled"
      ? "paid"
      : invoice.status === "Processing"
        ? "confirming"
        : invoice.additionalStatus === "PaidLate"
          ? "late"
          : invoice.additionalStatus === "PaidPartial"
            ? "partial"
            : invoice.status === "Expired"
              ? "expired"
              : invoice.status === "Invalid"
                ? "failed"
                : "pending";
  return { status, recurringStatus: null };
}
export async function btcpayRequest(path, options = {}) {
  const base = process.env.BTCPAY_URL;
  check(base && process.env.BTCPAY_API_KEY, "Bitcoin unavailable", 503);
  const u = new URL(base);
  check(
    !u.username && !u.password && u.pathname === "/" && !u.search && !u.hash,
    "Unsafe Bitcoin server",
    503,
  );
  check(
    u.protocol === "https:" ||
      (process.env.BTCPAY_TEST_NETWORK === "true" &&
        ["localhost", "127.0.0.1"].includes(u.hostname)),
    "Unsafe Bitcoin server",
    503,
  );
  check(
    process.env.BTCPAY_TEST_NETWORK === "true" ||
      process.env.DONATIONS_ALLOW_LIVE === "true",
    "Live Bitcoin disabled",
    503,
  );
  const r = await fetch(`${base.replace(/\/$/, "")}/api/v1${path}`, {
    method: options.method || "GET",
    headers: {
      Authorization: `token ${process.env.BTCPAY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    signal: AbortSignal.timeout(12000),
    cache: "no-store",
    redirect: "error",
  });
  check(r.ok, "Bitcoin processor unavailable", 503);
  return r.status === 204 ? null : r.json();
}
export const storePath = () =>
  `/stores/${encodeURIComponent(process.env.BTCPAY_STORE_ID || "")}`;
/** v2.4.7 server/info does NOT expose network. Require deployment evidence
 * from bitcoin getblockchaininfo and container config, pinned to origin/store/version.
 */
export async function assertBitcoinNetwork(request = btcpayRequest) {
  const info = await request("/server/info");
  check(info.version === "2.4.7", "Unverified Bitcoin server version", 503);
  if (
    process.env.DONATIONS_ALLOW_LIVE === "true" &&
    process.env.BTCPAY_TEST_NETWORK !== "true"
  )
    return;
  check(
    process.env.BTCPAY_TEST_NETWORK === "true" &&
      process.env.BTCPAY_NETWORK_ATTESTATION_FILE,
    "Bitcoin test network not verified",
    503,
  );
  let a;
  try {
    a = JSON.parse(
      await readFile(process.env.BTCPAY_NETWORK_ATTESTATION_FILE, "utf8"),
    );
  } catch {
    check(false, "Bitcoin network evidence unavailable", 503);
  }
  check(
    a.origin === new URL(process.env.BTCPAY_URL).origin &&
      a.storeId === process.env.BTCPAY_STORE_ID &&
      a.version === info.version &&
      ["regtest", "testnet", "signet"].includes(a.network) &&
      typeof a.evidence === "string" &&
      a.evidence.length > 20 &&
      Date.now() - Date.parse(a.verifiedAt) >= 0 &&
      Date.now() - Date.parse(a.verifiedAt) < 86400000,
    "Bitcoin network evidence mismatch or expired",
    503,
  );
}
export async function btcpayCreate(d, request = btcpayRequest, cfg = config()) {
  await assertBitcoinNetwork(request);
  if (d.frequency === "monthly") {
    check(cfg.bitcoinMonthlyEnabled, "Bitcoin monthly unavailable", 503);
    const selected = await monthlyPlan(d, request);
    validatePlan(selected.plan, d);
    const checkout = await request("/plan-checkout", {
      method: "POST",
      body: {
        storeId: process.env.BTCPAY_STORE_ID,
        offeringId: selected.offeringId,
        planId: selected.plan.id,
        durationMinutes: 30,
        isTrial: false,
        newSubscriberEmail: d.email,
        invoiceMetadata: { orderId: d.id },
        newSubscriberMetadata: { donationId: d.id },
        metadata: { donationId: d.id },
      },
    });
    return {
      providerId: checkout.id,
      checkoutUrl: providerUrl(checkout.url),
      offeringId: selected.offeringId,
      planId: selected.plan.id,
    };
  }
  const invoice = await request(`${storePath()}/invoices`, {
    method: "POST",
    body: {
      amount: (d.amount / 100).toFixed(2),
      currency: d.currency,
      metadata: { orderId: d.id, ...(d.email ? { buyerEmail: d.email } : {}) },
      checkout: { expirationMinutes: 30, redirectAutomatically: false },
    },
  });
  return {
    providerId: invoice.id,
    checkoutUrl: providerUrl(invoice.checkoutLink),
  };
}
export function providerUrl(url) {
  check(typeof url === "string", "Missing processor URL", 503);
  let u;
  try {
    u = new URL(url);
  } catch {
    check(false, "Invalid processor URL", 503);
  }
  check(!u.username && !u.password, "Unsafe processor URL", 503);
  if (process.env.BTCPAY_URL) {
    const base = new URL(process.env.BTCPAY_URL);
    check(u.origin === base.origin, "Unexpected processor origin", 503);
    check(
      u.protocol === "https:" ||
        (process.env.BTCPAY_TEST_NETWORK === "true" &&
          ["localhost", "127.0.0.1"].includes(u.hostname)),
      "Unsafe processor URL",
      503,
    );
  } else check(u.protocol === "https:", "Unsafe processor URL", 503);
  return u.href;
}
function validateBitcoinInvoice(invoice, d) {
  check(
    invoice.currency === d.currency &&
      decimalMinor(invoice.amount) === Number(d.amount) &&
      invoice.metadata?.orderId === d.id,
    "Bitcoin invoice identity mismatch",
    503,
  );
}
const BITCOIN_URI = /^(bitcoin:|lnbcrt|lnbc|lntb|lnsb)/i;
const BITCOIN_ADDRESS = /^[a-zA-HJ-NP-Z0-9]{14,90}$/;
const BTC_DECIMAL = /^\d{1,8}(\.\d{1,8})?$/;
const MAX_PAYMENT_URI = 2048;
/** One-off invoices expose their payment methods immediately; monthly plan checkouts
 * only after ProceedPlanCheckout. Return only the payment fields the panel renders,
 * never a vendor DTO, and never log payloads.
 */
export async function btcpayPayment(d, { request = btcpayRequest } = {}) {
  check(
    d.provider === "btcpay" &&
      d.frequency === "once" &&
      typeof d.provider_id === "string" &&
      d.provider_id.length > 0,
    "Bitcoin payment details unavailable",
    404,
  );
  const invoice = await request(
    `${storePath()}/invoices/${encodeURIComponent(d.provider_id)}`,
  );
  check(
    invoice?.id === d.provider_id,
    "Bitcoin invoice identity mismatch",
    503,
  );
  validateBitcoinInvoice(invoice, d);
  return paymentFromInvoice(d, invoice, request);
}
function validatePlanCheckout(c, d) {
  check(
    c?.id === d.provider_id &&
      c.metadata?.donationId === d.id &&
      c.plan?.id === d.plan_id &&
      !c.isTrial,
    "Bitcoin checkout identity mismatch",
    503,
  );
  validatePlan(c.plan, d);
  if (c.subscriber && typeof c.subscriber === "object" && c.subscriber.plan)
    check(
      c.subscriber.plan.id === d.plan_id,
      "Bitcoin subscriber identity mismatch",
      503,
    );
}
/** Monthly: a plan checkout carries no invoice until the server proceeds it.
 * ProceedPlanCheckout is called once, serialized per donation, and never for a
 * checkout that already has an invoice or has expired.
 */
export async function btcpayPlanPayment(
  d,
  { request = btcpayRequest, serialized } = {},
) {
  check(
    d.provider === "btcpay" &&
      d.frequency === "monthly" &&
      typeof d.provider_id === "string" &&
      d.provider_id.length > 0 &&
      typeof d.offering_id === "string" &&
      d.offering_id.length > 0,
    "Bitcoin payment details unavailable",
    404,
  );
  // A subscriber is never created without the email the donor already consented to.
  check(
    typeof d.donor_email === "string" && d.donor_email.includes("@"),
    "Bitcoin monthly needs a donor email",
    503,
  );
  const read = async () => {
    const c = await request(
      `/plan-checkout/${encodeURIComponent(d.provider_id)}`,
    );
    validatePlanCheckout(c, d);
    return c;
  };
  const checkout = await read();
  let invoiceId = checkout.invoiceId;
  if (!invoiceId) {
    check(!checkout.isExpired, "Bitcoin checkout expired", 503);
    const run =
      serialized ||
      ((fn) =>
        transaction(async (db) => {
          await db.query("SELECT pg_advisory_xact_lock(hashtextextended($1,0))", [
            `plan-proceed:${d.id}`,
          ]);
          return fn();
        }));
    invoiceId = await run(async () => {
      const current = await read();
      if (current.invoiceId) return current.invoiceId;
      check(!current.isExpired, "Bitcoin checkout expired", 503);
      const proceeded = await request(
        `/plan-checkout/${encodeURIComponent(d.provider_id)}`,
        { method: "POST" },
      );
      validatePlanCheckout(proceeded, d);
      check(
        typeof proceeded.invoiceId === "string" && proceeded.invoiceId.length > 0,
        "Bitcoin checkout has no invoice",
        503,
      );
      return proceeded.invoiceId;
    });
  }
  const invoice = await request(
    `${storePath()}/invoices/${encodeURIComponent(invoiceId)}`,
  );
  check(invoice?.id === invoiceId, "Bitcoin invoice identity mismatch", 503);
  validateBitcoinInvoice(invoice, d);
  return paymentFromInvoice(d, invoice, request);
}
async function paymentFromInvoice(d, invoice, request) {
  const { status } = bitcoinTruth(invoice);
  // Greenfield returns a unix timestamp (seconds); accept an ISO string too.
  const expiresAt =
    typeof invoice.expirationTime === "number" &&
    Number.isFinite(invoice.expirationTime)
      ? new Date(invoice.expirationTime * 1000).toISOString()
      : typeof invoice.expirationTime === "string" &&
          Number.isFinite(Date.parse(invoice.expirationTime))
        ? invoice.expirationTime
        : null;
  // The payment-methods endpoint answers with a bare array in 2.4.7; older
  // shapes wrap it. Address the invoice, never the plan-checkout id.
  const result = await request(
    `${storePath()}/invoices/${encodeURIComponent(invoice.id)}/payment-methods`,
  );
  const list = Array.isArray(result) ? result : result?.paymentMethods;
  check(Array.isArray(list), "Bitcoin payment methods unavailable", 503);
  const output = [];
  const seen = new Set();
  for (const method of list) {
    const kind =
      method?.paymentMethodId === "BTC-LN"
        ? "lightning"
        : method?.paymentMethodId === "BTC-CHAIN"
          ? "onchain"
          : null;
    if (!kind || seen.has(kind)) continue;
    // An invoice is created before the method is activated; no destination, no payment.
    const destination =
      typeof method.destination === "string" ? method.destination.trim() : "";
    if (!destination || destination.length > MAX_PAYMENT_URI) continue;
    const uri = (
      kind === "lightning"
        ? destination
        : typeof method.paymentLink === "string" &&
            method.paymentLink.startsWith("bitcoin:")
          ? method.paymentLink
          : `bitcoin:${destination}`
    ).trim();
    if (uri.length > MAX_PAYMENT_URI || !BITCOIN_URI.test(uri)) continue;
    const address =
      kind === "onchain" && BITCOIN_ADDRESS.test(destination)
        ? destination
        : null;
    if (kind === "onchain" && !address) continue;
    const btcAmount = [method.amount, method.due].find(
      (value) => typeof value === "string" && BTC_DECIMAL.test(value),
    );
    seen.add(kind);
    output.push({
      kind,
      uri,
      address,
      btcAmount: btcAmount ?? null,
      confirmed:
        status === "paid" &&
        [method.amount, method.due].some(
          (value) => typeof value === "string" && BTC_DECIMAL.test(value),
        ) &&
        Number(method.due) === 0 &&
        Number(method.amount) > 0,
    });
  }
  return { status, expiresAt, methods: output };
}
export async function providerTruth(
  d,
  { stripe, request = btcpayRequest } = {},
) {
  if (d.provider === "stripe") {
    stripe ||= stripeClient();
    const s = await stripe.checkout.sessions.retrieve(d.provider_id, {
      expand: ["payment_intent.latest_charge"],
    });
    check(
      s.id === d.provider_id &&
        s.amount_total === Number(d.amount) &&
        s.currency === d.currency.toLowerCase() &&
        s.client_reference_id === d.id &&
        s.metadata?.donationId === d.id,
      "Stripe checkout identity mismatch",
      503,
    );
    const subscription = s.subscription
      ? await stripe.subscriptions.retrieve(objectId(s.subscription), {
          expand: ["latest_invoice"],
        })
      : null;
    let charge = s.payment_intent?.latest_charge;
    if (subscription) {
      check(
        subscription.metadata?.donationId === d.id,
        "Stripe subscription identity mismatch",
        503,
      );
      const items = subscription.items?.data;
      check(
        items?.length === 1 &&
          items[0].price?.unit_amount === Number(d.amount) &&
          items[0].price?.currency === d.currency.toLowerCase() &&
          items[0].quantity === 1 &&
          items[0].price?.recurring?.interval === "month",
        "Stripe recurring price mismatch",
        503,
      );
      const invoice = subscription.latest_invoice;
      let paidChargeTotal = 0;
      if (invoice) {
        check(
          typeof invoice === "object" &&
            invoice.currency === d.currency.toLowerCase() &&
            invoice.amount_due === Number(d.amount),
          "Stripe recurring invoice mismatch",
          503,
        );
        const payments = await stripe.invoicePayments.list({
          invoice: invoice.id,
          limit: 100,
          expand: ["data.payment.payment_intent"],
        });
        check(!payments.has_more, "Ambiguous invoice payment history", 503);
        for (const p of payments.data) {
          const pi = p.payment?.payment_intent;
          if (pi) {
            const intent = await stripe.paymentIntents.retrieve(objectId(pi), {
              expand: ["latest_charge"],
            });
            const current = intent.latest_charge;
            if (current?.paid && current.captured !== false) {
              check(
                current.currency === d.currency.toLowerCase(),
                "Charge currency mismatch",
                503,
              );
              paidChargeTotal += current.amount;
            }
            if (current?.amount_refunded > 0 || current?.disputed)
              charge = current;
          }
        }
        if (invoice.status === "paid" && subscription.status === "active")
          check(
            invoice.amount_paid === Number(d.amount) &&
              paidChargeTotal === Number(d.amount),
            "Paid invoice missing matching processor charge",
            503,
          );
      }
    }
    if (!subscription && s.payment_status === "paid")
      check(
        charge?.paid &&
          charge.captured !== false &&
          charge.amount === Number(d.amount) &&
          charge.currency === d.currency.toLowerCase(),
        "Paid session missing matching processor charge",
        503,
      );
    return stripeTruth(s, subscription, charge);
  }
  if (d.frequency === "monthly") {
    const c = await request(
      `/plan-checkout/${encodeURIComponent(d.provider_id)}`,
    );
    check(
      c.id === d.provider_id &&
        c.metadata?.donationId === d.id &&
        c.plan?.id === d.plan_id &&
        !c.isTrial,
      "Bitcoin checkout identity mismatch",
      503,
    );
    validatePlan(c.plan, d);
    const invoice = c.invoiceId
      ? await request(
          `${storePath()}/invoices/${encodeURIComponent(c.invoiceId)}`,
        )
      : null;
    if (invoice) validateBitcoinInvoice(invoice, d);
    const sub = c.subscriber?.customer?.id
      ? await request(
          `${storePath()}/offerings/${encodeURIComponent(d.offering_id)}/subscribers/${encodeURIComponent(c.subscriber.customer.id)}`,
        )
      : null;
    if (sub) {
      check(
        sub.metadata?.donationId === d.id && sub.offering?.id === d.offering_id,
        "Bitcoin subscriber identity mismatch",
        503,
      );
      validatePlan(sub.plan, d);
    }
    const truth = invoice
      ? bitcoinTruth(invoice)
      : { status: c.isExpired ? "expired" : "pending" };
    // BTCPay active includes grace/trial; neither qualifies as a paid current month.
    const recurringStatus = sub
      ? sub.isSuspended
        ? "cancelled"
        : sub.isActive && sub.phase === "Normal"
          ? "active"
          : "past_due"
      : null;
    if (sub?.isSuspended) truth.status = "cancelled";
    else if (sub && recurringStatus === "past_due") truth.status = "failed";
    return {
      ...truth,
      recurringStatus,
      customerId: sub?.customer?.id,
      invoiceId: c.invoiceId,
    };
  }
  const invoice = await request(
    `${storePath()}/invoices/${encodeURIComponent(d.provider_id)}`,
  );
  validateBitcoinInvoice(invoice, d);
  return bitcoinTruth(invoice);
}
