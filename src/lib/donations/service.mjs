import { randomUUID } from "node:crypto";
import {
  check,
  config,
  validateCheckout,
  newToken,
  tokenHash,
  text,
  safeUrl,
} from "./core.mjs";
import { pool, transaction, enqueue } from "./db.mjs";
import { assertStripeCurrency } from "./readiness.mjs";
import { seal, unseal } from "./secrets.mjs";
import {
  stripeCreate,
  btcpayCreate,
  providerTruth,
  stripeClient,
  btcpayRequest,
  storePath,
  providerUrl,
} from "./providers.mjs";
export async function createCheckout(body, providers = {}, cfg = config()) {
  check(cfg.enabled, "Donations unavailable", 503);
  const input = validateCheckout(body, cfg);
  check(
    input.provider === "stripe" ? cfg.stripeEnabled : cfg.bitcoinEnabled,
    "Processor unavailable",
    503,
  );
  if (input.provider === "stripe" && !providers.create)
    await assertStripeCurrency(input.currency);
  if (input.provider === "btcpay" && input.frequency === "monthly")
    check(cfg.bitcoinMonthlyEnabled, "Bitcoin monthly unavailable", 503);
  const hash = tokenHash(
    JSON.stringify({
      ...input,
      avatarDigest: providers.avatarData
        ? tokenHash(providers.avatarData)
        : null,
    }),
  );
  // A random UUIDv4 Idempotency-Key is a replay capability, never a public donation ID.
  // Bind it to the entire normalized request; encrypt replay secrets at rest.
  const attempt = await transaction(async (db) => {
    await db.query("SELECT pg_advisory_xact_lock(hashtextextended($1,0))", [
      input.idempotencyKey,
    ]);
    const prior = (
      await db.query(
        "SELECT * FROM donations WHERE idempotency_key=$1 FOR UPDATE",
        [input.idempotencyKey],
      )
    ).rows[0];
    if (prior) {
      check(
        prior.request_hash === hash,
        "Idempotency key reused with different input",
        409,
      );
      const credentials = unseal(prior.capability_ciphertext);
      if (prior.checkout_ciphertext)
        return { replay: unseal(prior.checkout_ciphertext) };
      if (
        prior.provider === "btcpay" ||
        Date.now() - new Date(prior.created_at).getTime() > 23 * 3600000
      )
        return {
          replay: {
            id: prior.id,
            ...credentials,
            provider: prior.provider,
            status: prior.status,
            creationState: "uncertain",
          },
        };
      return { id: prior.id, ...credentials };
    }
    const id = randomUUID(),
      token = newToken(),
      manageToken = newToken();
    await db.query(
      `INSERT INTO donations(id,idempotency_key,request_hash,provider,frequency,currency,amount,locale,donor_email,donor_name,organization,comment,newsletter_consent,public_consent,status_token_hash,manage_token_hash,capability_ciphertext,creation_state) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,'creating')`,
      [
        id,
        input.idempotencyKey,
        hash,
        input.provider,
        input.frequency,
        input.currency,
        input.amount,
        input.locale,
        input.email,
        input.direct
          ? null
          : [input.firstName, input.lastName].filter(Boolean).join(" ") || null,
        input.organization,
        input.comment,
        input.newsletterConsent,
        input.publicConsent,
        tokenHash(token),
        tokenHash(manageToken),
        seal({ token, manageToken }),
      ],
    );
    if (input.publicConsent) {
      let avatarId = null;
      if (providers.avatarData) {
        check(
          Buffer.isBuffer(providers.avatarData) &&
            providers.avatarData.length <= 524288,
          "Invalid processed avatar",
        );
        avatarId = randomUUID();
        await db.query(
          "INSERT INTO donation_avatars(id,donation_id,data) VALUES($1,$2,$3)",
          [avatarId, id, providers.avatarData],
        );
      }
      await db.query(
        "INSERT INTO donation_profiles(id,donation_id,name,url,kind,avatar_id) VALUES($1,$2,$3,$4,$5,$6)",
        [
          randomUUID(),
          id,
          input.publicProfile.name,
          input.publicProfile.url,
          input.publicProfile.kind || "person",
          avatarId,
        ],
      );
    }
    return { id, token, manageToken };
  });
  if (attempt.replay) return attempt.replay;
  const { id, token, manageToken } = attempt;
  // 'creating' is committed BEFORE the network call. A crash cannot blind-repeat BTC.
  try {
    const created = await (
      providers.create ||
      ((d) => (d.provider === "stripe" ? stripeCreate(d) : btcpayCreate(d)))
    )({ ...input, id });
    check(created?.providerId, "Processor returned invalid checkout", 503);
    const output = JSON.parse(
      JSON.stringify({
        id,
        token,
        manageToken,
        provider: input.provider,
        status: "pending",
        clientSecret: created.clientSecret,
        checkoutUrl: created.checkoutUrl,
      }),
    );
    await pool().query(
      "UPDATE donations SET creation_state='created',provider_id=$2,checkout_url=$3,offering_id=$4,plan_id=$5,checkout_ciphertext=$6,updated_at=now() WHERE id=$1",
      [
        id,
        created.providerId,
        created.checkoutUrl || null,
        created.offeringId || null,
        created.planId || null,
        seal(output),
      ],
    );
    return output;
  } catch {
    await pool().query(
      "UPDATE donations SET creation_state='uncertain',updated_at=now() WHERE id=$1 AND provider_id IS NULL",
      [id],
    );
    return {
      id,
      token,
      manageToken,
      provider: input.provider,
      status: "pending",
      creationState: "uncertain",
    };
  }
}
export async function getDonation(id, token, manage = false) {
  check(
    typeof id === "string" &&
      /^[a-f0-9-]{36}$/i.test(id) &&
      typeof token === "string" &&
      token.length <= 100,
    "Not found",
    404,
  );
  const row = (
    await pool().query(
      `SELECT * FROM donations WHERE id=$1 AND ${manage ? "manage_token_hash" : "status_token_hash"}=$2`,
      [id, tokenHash(token)],
    )
  ).rows[0];
  check(row, "Not found", 404);
  return row;
}
export async function applyTruth(db, d, truth) {
  check(
    [
      "pending",
      "paid",
      "expired",
      "failed",
      "cancelled",
      "partial",
      "late",
      "confirming",
      "processing",
    ].includes(truth.status),
    "Invalid processor state",
    503,
  );
  // Processor APIs are read under row lock, not event payloads or redirect parameters.
  await db.query(
    `UPDATE donations SET status=$2,recurring_status=$3,customer_id=COALESCE($4,customer_id),subscription_id=COALESCE($5,subscription_id),invoice_id=COALESCE($6,invoice_id),paid_at=CASE WHEN $2='paid' THEN COALESCE(paid_at,now()) ELSE paid_at END,cancellation_scheduled=$7,last_checked_at=now(),updated_at=now() WHERE id=$1`,
    [
      d.id,
      truth.status,
      truth.recurringStatus || null,
      truth.customerId || null,
      truth.subscriptionId || null,
      truth.invoiceId || null,
      truth.cancellationScheduled === true,
    ],
  );
  if (truth.status === "paid" && !d.paid_at) {
    if (d.donor_email)
      await enqueue(db, "confirmation", `paid:${d.id}`, d.id, {
        email: d.donor_email,
        locale: d.locale,
      });
    if (d.public_consent && d.frequency === "monthly") {
      await db.query(
        "UPDATE donation_profiles SET state='pending',updated_at=now() WHERE donation_id=$1 AND state='awaiting_payment'",
        [d.id],
      );
      if (d.donor_email)
        await enqueue(db, "recognition", `recognition:${d.id}`, d.id, {
          email: d.donor_email,
          locale: d.locale,
        });
    }
    if (d.newsletter_consent && d.donor_email)
      await enqueue(db, "newsletter", `newsletter:${d.id}`, d.id, {
        email: d.donor_email,
        name: d.donor_name,
        locale: d.locale,
      });
  }
  if (d.frequency === "monthly")
    await db.query(
      "UPDATE donation_profiles SET activity=$2,updated_at=now() WHERE donation_id=$1",
      [d.id, supporterActivity(truth)],
    );
  if (truth.cancellationScheduled && !d.cancellation_scheduled && d.donor_email)
    await enqueue(
      db,
      "cancellation-scheduled",
      `cancel-scheduled:${d.id}`,
      d.id,
      { email: d.donor_email, locale: d.locale },
    );
  if (
    truth.recurringStatus === "cancelled" &&
    d.recurring_status !== "cancelled" &&
    d.donor_email
  )
    await enqueue(db, "cancellation", `cancelled:${d.id}`, d.id, {
      email: d.donor_email,
      locale: d.locale,
    });
}
export async function refreshDonation(id, truthFn = providerTruth) {
  return transaction(async (db) => {
    const d = (
      await db.query("SELECT * FROM donations WHERE id=$1 FOR UPDATE", [id])
    ).rows[0];
    check(d, "Not found", 404);
    if (!d.provider_id) return d;
    const truth = await truthFn(d);
    await applyTruth(db, d, truth);
    return {
      ...d,
      status: truth.status,
      recurring_status: truth.recurringStatus,
      cancellation_scheduled: truth.cancellationScheduled === true,
    };
  });
}
export async function processEvent(
  provider,
  eventId,
  id,
  truthFn = providerTruth,
) {
  return transaction(async (db) => {
    const d = (
      await db.query(
        "SELECT * FROM donations WHERE id=$1 AND provider=$2 FOR UPDATE",
        [id, provider],
      )
    ).rows[0];
    check(d, "Donation not yet available", 503);
    const inserted = await db.query(
      "INSERT INTO donation_webhook_events(provider,event_id,donation_id) VALUES($1,$2,$3) ON CONFLICT DO NOTHING RETURNING event_id",
      [provider, eventId, id],
    );
    if (!inserted.rowCount) return { duplicate: true };
    check(d.provider_id, "Checkout not yet available", 503);
    await applyTruth(db, d, await truthFn(d));
    return { duplicate: false };
  });
}
export async function manageDonation(
  { id, token, action, profile },
  providers = {},
) {
  const d = await getDonation(id, token, true);
  if (action === "portal") {
    check(
      d.frequency === "monthly" && d.customer_id,
      "Subscription unavailable",
      409,
    );
    if (d.provider === "stripe") {
      const portal = await (
        providers.stripe || stripeClient()
      ).billingPortal.sessions.create({
        customer: d.customer_id,
        return_url: `${config().origin}/donate/preview`,
      });
      return { url: portal.url };
    }
    const portal = await (providers.btcpay || btcpayRequest)(
      "/subscriber-portal",
      {
        method: "POST",
        body: {
          storeId: process.env.BTCPAY_STORE_ID,
          offeringId: d.offering_id,
          customerSelector: d.customer_id,
          durationMinutes: 15,
        },
      },
    );
    return { url: providerUrl(portal.url) };
  }
  if (action === "cancel") {
    check(
      d.frequency === "monthly" && d.customer_id,
      "Subscription unavailable",
      409,
    );
    if (d.provider === "stripe")
      await (providers.stripe || stripeClient()).subscriptions.update(
        d.subscription_id,
        { cancel_at_period_end: true },
        { idempotencyKey: `cancel:${d.id}` },
      );
    else
      await (providers.btcpay || btcpayRequest)(
        `${storePath()}/offerings/${encodeURIComponent(d.offering_id)}/subscribers/${encodeURIComponent(d.customer_id)}/suspend`,
        { method: "POST", body: { reason: "Donor cancelled manual pledge" } },
      );
    await refreshDonation(d.id, providers.truth || providerTruth);
    return { status: "cancellation_requested" };
  }
  check(["remove-public", "update-public"].includes(action), "Invalid action");
  return transaction(async (db) => {
    await db.query("SELECT id FROM donations WHERE id=$1 FOR UPDATE", [id]);
    if (action === "remove-public") {
      await db.query(
        "UPDATE donations SET public_consent=false,updated_at=now() WHERE id=$1",
        [id],
      );
      await db.query(
        "UPDATE donation_profiles SET state='removed',updated_at=now() WHERE donation_id=$1",
        [id],
      );
      await db.query(
        "INSERT INTO donation_audit(profile_id,actor,action) SELECT id,$2,$3 FROM donation_profiles WHERE donation_id=$1",
        [id, `donor:${id}`, "withdraw-consent"],
      );
      return { status: "removed" };
    }
    check(
      d.frequency === "monthly" && d.public_consent,
      "Recognition not authorized",
      403,
    );
    const name = text(profile?.name, 100, true),
      url = safeUrl(profile?.url);
    let avatarId = profile?.avatarId || null;
    if (avatarId)
      check(
        (
          await db.query(
            "SELECT id FROM donation_avatars WHERE id=$1 AND donation_id=$2",
            [avatarId, id],
          )
        ).rowCount,
        "Invalid avatar",
      );
    await db.query(
      "UPDATE donation_profiles SET name=$2,url=$3,avatar_id=$4,state=CASE WHEN $5 THEN 'pending' ELSE 'awaiting_payment' END,updated_at=now() WHERE donation_id=$1",
      [id, name, url, avatarId, !!d.paid_at],
    );
    return { status: "pending" };
  });
}
/** The wall lists people while the monthly support they paid for is running.
 * A profile whose paid period ended stays in the database as history, not on
 * the public page.
 */
export const PUBLIC_SUPPORTERS_SQL =
  "SELECT p.id,p.name,p.kind,p.url AS link,CASE WHEN p.avatar_id IS NOT NULL THEN '/api/donations/avatars/'||p.avatar_id ELSE NULL END AS avatar,p.activity,'approved' AS status FROM donation_profiles p JOIN donations d ON d.id=p.donation_id WHERE p.state='approved' AND p.activity='active' AND d.public_consent=true AND d.frequency='monthly' AND d.paid_at IS NOT NULL ORDER BY p.created_at LIMIT 500";
export async function listSupporters() {
  return (await pool().query(PUBLIC_SUPPORTERS_SQL)).rows;
}
/** Cancelling schedules the exit; the profile leaves the wall when the paid
 * period actually ends, which is what the processor reports.
 */
export function supporterActivity(truth) {
  return truth.recurringStatus === "active" && truth.status === "paid"
    ? "active"
    : "past";
}
