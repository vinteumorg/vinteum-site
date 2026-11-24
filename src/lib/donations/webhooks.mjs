import Stripe from "stripe";
import { check, verifyHmac } from "./core.mjs";
import { pool } from "./db.mjs";
import { processEvent } from "./service.mjs";
import { providerTruth, stripeClient } from "./providers.mjs";
export async function stripeWebhook(
  raw,
  signature,
  {
    secret = process.env.STRIPE_WEBHOOK_SECRET,
    truth = providerTruth,
    stripe,
  } = {},
) {
  check(secret && signature, "Invalid webhook signature");
  let event;
  try {
    event = Stripe.webhooks.constructEvent(raw, signature, secret);
  } catch {
    check(false, "Invalid webhook signature");
  }
  const supported = [
    "charge.refunded",
    "charge.dispute.created",
    "charge.dispute.updated",
    "charge.dispute.closed",
    "checkout.session.completed",
    "checkout.session.async_payment_succeeded",
    "checkout.session.async_payment_failed",
    "checkout.session.expired",
    "invoice.paid",
    "invoice.payment_failed",
    "invoice.payment_action_required",
    "customer.subscription.created",
    "customer.subscription.updated",
    "customer.subscription.deleted",
  ];
  if (!supported.includes(event.type)) return { ignored: true };
  const obj = event.data.object;
  if (event.type.startsWith("charge.")) {
    const client = stripe || stripeClient();
    let charge = obj;
    if (event.type.startsWith("charge.dispute."))
      charge = await client.charges.retrieve(
        typeof obj.charge === "string" ? obj.charge : obj.charge.id,
      );
    const pi = charge.payment_intent
      ? await client.paymentIntents.retrieve(
          typeof charge.payment_intent === "string"
            ? charge.payment_intent
            : charge.payment_intent.id,
        )
      : null;
    const target = pi?.metadata?.donationId;
    const customer =
      typeof charge.customer === "string"
        ? charge.customer
        : charge.customer?.id;
    // Invoice-payment intents may not inherit subscription metadata. Queue every
    // matching customer donation durably; do not infer which subscription was paid.
    if (customer)
      await pool().query(
        "UPDATE donations SET reconcile_after=now() WHERE provider='stripe' AND customer_id=$1",
        [customer],
      );
    if (!target) return { queued: !!customer };
    const found = (
      await pool().query(
        "SELECT id FROM donations WHERE provider='stripe' AND id::text=$1",
        [target],
      )
    ).rows[0];
    check(found, "Donation not yet available", 503);
    return processEvent("stripe", event.id, found.id, truth);
  }
  let subscriptionId = event.type.startsWith("customer.subscription.")
    ? obj.id
    : obj.parent?.subscription_details?.subscription || obj.subscription;
  subscriptionId =
    typeof subscriptionId === "object" ? subscriptionId?.id : subscriptionId;
  let donationId = obj.metadata?.donationId || obj.client_reference_id;
  let found = (
    await pool().query(
      "SELECT id FROM donations WHERE provider='stripe' AND (provider_id=$1 OR subscription_id=$2 OR id::text=$3) LIMIT 1",
      [obj.id, subscriptionId || null, donationId || null],
    )
  ).rows[0];
  if (!found && subscriptionId) {
    const s = await (stripe || stripeClient()).subscriptions.retrieve(
      subscriptionId,
    );
    donationId = s.metadata?.donationId;
    if (donationId)
      found = (
        await pool().query(
          "SELECT id FROM donations WHERE provider='stripe' AND id::text=$1",
          [donationId],
        )
      ).rows[0];
  }
  if (!found) {
    check(!donationId, "Donation not yet available", 503);
    return { ignored: true };
  }
  return processEvent("stripe", event.id, found.id, truth);
}
export async function bitcoinWebhook(
  raw,
  signature,
  {
    secret = process.env.BTCPAY_WEBHOOK_SECRET,
    storeId = process.env.BTCPAY_STORE_ID,
    truth = providerTruth,
  } = {},
) {
  check(verifyHmac(raw, signature, secret), "Invalid webhook signature");
  let event;
  try {
    event = JSON.parse(raw.toString("utf8"));
  } catch {
    check(false, "Invalid webhook body");
  }
  check(event.storeId === storeId, "Wrong webhook store");
  check(
    typeof event.deliveryId === "string" && event.deliveryId.length <= 200,
    "Invalid event id",
  );
  const customer = event.subscriber?.customer?.id;
  const donationId = event.subscriber?.metadata?.donationId;
  const found = (
    await pool().query(
      "SELECT id FROM donations WHERE provider='btcpay' AND (provider_id=$1 OR invoice_id=$1 OR (customer_id=$2 AND offering_id=$3) OR id::text=$4) LIMIT 1",
      [
        event.invoiceId || event.checkoutId || null,
        customer || null,
        event.subscriber?.offering?.id || null,
        donationId || null,
      ],
    )
  ).rows[0];
  if (!found) {
    check(!donationId, "Donation not yet available", 503);
    return { ignored: true };
  }
  return processEvent(
    "btcpay",
    event.originalDeliveryId || event.deliveryId,
    found.id,
    truth,
  );
}
