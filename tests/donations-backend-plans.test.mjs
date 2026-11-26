import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { pool, migrate } from "../src/lib/donations/db.mjs";
import {
  monthlyPlan,
  validatePlan,
  decimalMinor,
} from "../src/lib/donations/plans.mjs";
process.env.DATABASE_URL ||= process.env.DONATIONS_DATABASE_URL;
const enabled = !!process.env.DATABASE_URL;
test.before(async () => {
  if (enabled) await migrate();
});
test(
  "custom monthly BTC plan is created once, locked and re-fetched with exact money and safe flags",
  { skip: !enabled },
  async () => {
    const old = process.env.BTCPAY_MONTHLY_OFFERING_ID;
    process.env.BTCPAY_MONTHLY_OFFERING_ID = randomUUID();
    try {
      const d = { currency: "USD", amount: 1234 };
      let plans = [],
        posts = 0;
      const request = async (path, o) => {
        if (o?.method === "POST") {
          posts++;
          const plan = { ...o.body, id: randomUUID(), status: "Active" };
          plans.push(plan);
          return plan;
        }
        if (
          path.endsWith(`/offerings/${process.env.BTCPAY_MONTHLY_OFFERING_ID}`)
        )
          return { id: process.env.BTCPAY_MONTHLY_OFFERING_ID, plans };
        return plans.find((p) => path.endsWith(p.id));
      };
      const [a, b] = await Promise.all([
        monthlyPlan(d, request),
        monthlyPlan(d, request),
      ]);
      assert.equal(a.plan.id, b.plan.id);
      assert.equal(posts, 1);
      assert.equal(a.plan.price, "12.34");
      assert.equal(a.plan.optimisticActivation, false);
      assert.equal(a.plan.trialDays, 0);
      assert.throws(() => validatePlan({ ...a.plan, trialDays: 7 }, d));
      assert.equal(decimalMinor("12.3400"), 1234);
      assert.throws(() => decimalMinor("12.345"));
    } finally {
      if (old) process.env.BTCPAY_MONTHLY_OFFERING_ID = old;
      else delete process.env.BTCPAY_MONTHLY_OFFERING_ID;
    }
  },
);
test(
  "ambiguous native plan create reconciles metadata instead of creating another plan",
  { skip: !enabled },
  async () => {
    process.env.BTCPAY_MONTHLY_OFFERING_ID = randomUUID();
    const d = { currency: "BRL", amount: 5678 };
    let plans = [],
      posts = 0;
    const request = async (path, o) => {
      if (o?.method === "POST") {
        posts++;
        plans.push({ ...o.body, id: randomUUID(), status: "Active" });
        throw Error("connection lost");
      }
      if (path.endsWith(`/offerings/${process.env.BTCPAY_MONTHLY_OFFERING_ID}`))
        return { id: process.env.BTCPAY_MONTHLY_OFFERING_ID, plans };
      return plans[0];
    };
    await assert.rejects(() => monthlyPlan(d, request));
    const resolved = await monthlyPlan(d, request);
    assert.equal(resolved.plan.price, "56.78");
    assert.equal(posts, 1);
  },
);
test.after(async () => {
  if (enabled) await pool().end();
});
