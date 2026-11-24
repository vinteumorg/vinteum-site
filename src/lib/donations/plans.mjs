import { check, tokenHash } from "./core.mjs";
import { pool } from "./db.mjs";

/** Decimal strings from BTCPay must represent exact minor units, not floats. */
export function decimalMinor(value) {
  const match = /^(\d+)(?:\.(\d+))?$/.exec(String(value));
  check(match, "Invalid processor amount", 503);
  const fraction = match[2] || "";
  check(!/[1-9]/.test(fraction.slice(2)), "Invalid processor precision", 503);
  const minor =
    Number(match[1]) * 100 + Number(fraction.slice(0, 2).padEnd(2, "0"));
  check(Number.isSafeInteger(minor), "Invalid processor amount", 503);
  return minor;
}
export function validatePlan(plan, d) {
  check(
    plan &&
      plan.currency === d.currency &&
      decimalMinor(plan.price) === Number(d.amount) &&
      plan.recurringType === "Monthly" &&
      plan.optimisticActivation === false &&
      plan.trialDays === 0 &&
      plan.renewable === true &&
      plan.status === "Active",
    "Bitcoin plan configuration mismatch",
    503,
  );
}
/** Custom amount registry. Session advisory lock spans provider I/O; the creating
 * marker is committed first. After an ambiguous POST only metadata reconciliation
 * is allowed, never a second POST. No subscriber credit or wallet auto-debit.
 */
export async function monthlyPlan(d, request) {
  let configured;
  try {
    configured = JSON.parse(process.env.BTCPAY_MONTHLY_PLANS || "{}")[
      `${d.currency}:${d.amount}`
    ];
  } catch {
    check(false, "Invalid Bitcoin plans", 503);
  }
  const offeringId =
    configured?.offeringId || process.env.BTCPAY_MONTHLY_OFFERING_ID;
  check(offeringId, "Bitcoin offering unavailable", 503);
  const path = `/stores/${encodeURIComponent(process.env.BTCPAY_STORE_ID || "")}/offerings/${encodeURIComponent(offeringId)}/plans`;
  if (configured?.planId) {
    const plan = await request(
      `${path}/${encodeURIComponent(configured.planId)}`,
    );
    check(
      plan?.id === configured.planId,
      "Bitcoin plan identity mismatch",
      503,
    );
    validatePlan(plan, d);
    return { offeringId, plan };
  }
  const registryKey = tokenHash(
    `${process.env.BTCPAY_URL}|${process.env.BTCPAY_STORE_ID}|${offeringId}|${d.currency}|${d.amount}`,
  );
  const db = await pool().connect();
  let locked = false;
  try {
    await db.query("SELECT pg_advisory_lock(hashtextextended($1,0))", [
      registryKey,
    ]);
    locked = true;
    const existing = (
      await db.query(
        "SELECT * FROM donation_btcpay_plans WHERE registry_key=$1",
        [registryKey],
      )
    ).rows[0];
    let plan;
    if (existing?.plan_id) {
      plan = await request(`${path}/${encodeURIComponent(existing.plan_id)}`);
      check(
        plan?.id === existing.plan_id &&
          plan.metadata?.vinteumPlanKey === registryKey,
        "Bitcoin plan identity mismatch",
        503,
      );
    } else {
      // Greenfield exposes plans on the offering, not a GET /plans route.
      const offering = await request(path.slice(0, -"/plans".length));
      check(
        offering?.id === offeringId,
        "Bitcoin offering identity mismatch",
        503,
      );
      const plans = offering?.plans;
      check(Array.isArray(plans), "Invalid Bitcoin plans response", 503);
      const matches = plans.filter(
        (p) => p.metadata?.vinteumPlanKey === registryKey,
      );
      check(matches.length <= 1, "Ambiguous Bitcoin plans", 503);
      plan = matches[0];
      if (!plan) {
        check(
          !existing,
          "Bitcoin plan creation uncertain; reconciliation required",
          503,
        );
        await db.query(
          "INSERT INTO donation_btcpay_plans(registry_key,offering_id,currency,amount) VALUES($1,$2,$3,$4)",
          [registryKey, offeringId, d.currency, d.amount],
        );
        plan = await request(path, {
          method: "POST",
          body: {
            name: `Vinteum ${d.currency} ${(d.amount / 100).toFixed(2)} monthly`,
            description:
              "Manual Bitcoin contribution. Each payment requires donor approval; no automatic wallet debit.",
            currency: d.currency,
            price: (d.amount / 100).toFixed(2),
            recurringType: "Monthly",
            optimisticActivation: false,
            trialDays: 0,
            gracePeriodDays: 0,
            renewable: true,
            features: [],
            metadata: { vinteumPlanKey: registryKey },
          },
        });
      }
      check(plan?.id, "Invalid Bitcoin plan response", 503);
      check(
        plan.metadata?.vinteumPlanKey === registryKey,
        "Bitcoin plan ownership mismatch",
        503,
      );
      if (plan.currency !== d.currency) {
        // v2.4.7 POST prefers the store default currency. Only an owned, unused
        // plan with otherwise exact terms is eligible; PUT changes currency only.
        check(
          plan.memberCount === 0 &&
            typeof plan.currency === "string" &&
            plan.currency.length > 0,
          "Bitcoin plan ownership mismatch",
          503,
        );
        // Check exact money and all safety flags against the returned currency
        // first; the desired currency must still pass after PUT and GET below.
        validatePlan(plan, { ...d, currency: plan.currency });
        const id = plan.id;
        const planPath = `${path}/${encodeURIComponent(id)}`;
        const updated = await request(planPath, {
          method: "PUT",
          body: { currency: d.currency },
        });
        check(
          updated?.id === id &&
            updated.metadata?.vinteumPlanKey === registryKey,
          "Bitcoin plan identity mismatch",
          503,
        );
        validatePlan(updated, d);
        plan = await request(planPath);
        check(
          plan?.id === id && plan.metadata?.vinteumPlanKey === registryKey,
          "Bitcoin plan identity mismatch",
          503,
        );
      }
      validatePlan(plan, d);
      await db.query(
        "INSERT INTO donation_btcpay_plans(registry_key,offering_id,currency,amount,plan_id,state) VALUES($1,$2,$3,$4,$5,'ready') ON CONFLICT(registry_key) DO UPDATE SET plan_id=$5,state='ready'",
        [registryKey, offeringId, d.currency, d.amount, plan.id],
      );
    }
    validatePlan(plan, d);
    return { offeringId, plan };
  } finally {
    try {
      if (locked)
        await db.query("SELECT pg_advisory_unlock(hashtextextended($1,0))", [
          registryKey,
        ]);
    } finally {
      db.release();
    }
  }
}
