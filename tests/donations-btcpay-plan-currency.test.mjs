import test from "node:test";
import assert from "node:assert/strict";
import pg from "pg";
import { tokenHash } from "../src/lib/donations/core.mjs";
import { monthlyPlan } from "../src/lib/donations/plans.mjs";

// Only the DB transport is replaced: exercise the real registry and plan logic.
// Greenfield routes and POST/PUT semantics follow the v2.4.7 controller.
function fixture(t, options = {}) {
  const env = {
    DATABASE_URL: "postgres://fixture.invalid/no-network",
    BTCPAY_URL: "https://btcpay.fixture.invalid",
    BTCPAY_STORE_ID: "store-fixture",
    BTCPAY_MONTHLY_OFFERING_ID: "offering-fixture",
    BTCPAY_MONTHLY_PLANS: "{}",
  };
  for (const [key, value] of Object.entries(env)) {
    const old = process.env[key];
    process.env[key] = value;
    t.after(() =>
      old === undefined ? delete process.env[key] : (process.env[key] = old),
    );
  }
  const d = { currency: options.currency || "BRL", amount: 3742 };
  const registryKey = tokenHash(
    `${env.BTCPAY_URL}|${env.BTCPAY_STORE_ID}|${env.BTCPAY_MONTHLY_OFFERING_ID}|${d.currency}|${d.amount}`,
  );
  const offeringPath = "/stores/store-fixture/offerings/offering-fixture";
  const planPath = `${offeringPath}/plans/plan-fixture`;
  let row = options.row;
  const queries = [];
  const db = {
    async query(sql, args) {
      queries.push(sql);
      if (sql.startsWith("SELECT *"))
        return { rows: row ? [structuredClone(row)] : [] };
      if (sql.startsWith("INSERT")) {
        row = {
          registry_key: args[0],
          offering_id: args[1],
          currency: args[2],
          amount: args[3],
          plan_id: args[4] || null,
          state: args[4] ? "ready" : "creating",
        };
      }
      return { rows: [] };
    },
    release() {},
  };
  const connect = t.mock.method(pg.Pool.prototype, "connect", async () => db);
  t.after(() => connect.mock.restore());
  const plans = options.plans ? options.plans(registryKey) : [];
  const calls = [];
  const request = async (path, init = {}) => {
    const method = init.method || "GET";
    calls.push({ method, path, body: structuredClone(init.body) });
    if (method === "GET" && path === offeringPath)
      return { id: "offering-fixture", plans: structuredClone(plans) };
    if (method === "GET" && path === `${offeringPath}/plans`)
      throw Error("404: no GET plans collection in Greenfield 2.4.7");
    if (method === "POST" && path === `${offeringPath}/plans`) {
      const plan = {
        ...structuredClone(init.body),
        id: "plan-fixture",
        status: "Active",
        memberCount: 0,
        currency: "USD",
      };
      Object.assign(plan, options.postOverride);
      plans.push(plan);
      if (options.losePost) throw Error("POST response lost after commit");
      return structuredClone(plan);
    }
    if (method === "PUT" && path === planPath) {
      if (!options.ignorePut)
        Object.assign(plans[0], structuredClone(init.body));
      return { ...structuredClone(plans[0]), ...options.putOverride };
    }
    if (method === "GET" && path === planPath)
      return { ...structuredClone(plans[0]), ...options.getOverride };
    throw Error(`Unexpected Greenfield request: ${method} ${path}`);
  };
  return {
    d,
    registryKey,
    request,
    calls,
    plans,
    queries,
    row: () => row,
    planPath,
  };
}

test("fresh BRL plan corrects the upstream USD default by PUT, GET readback, then reuse", async (t) => {
  const f = fixture(t);
  const first = await monthlyPlan(f.d, f.request);
  assert.equal(first.plan.currency, "BRL");
  assert.equal(
    f.plans[0].currency,
    "BRL",
    "currency must persist at processor",
  );
  assert.deepEqual(
    f.calls.map((c) => c.method),
    ["GET", "POST", "PUT", "GET"],
  );
  assert.deepEqual(
    f.calls[2].body,
    { currency: "BRL" },
    "repair only currency, preserve all other terms",
  );
  assert.equal(f.calls[2].path, f.planPath);
  assert.equal(f.calls[3].path, f.planPath);
  const reused = await monthlyPlan(f.d, f.request);
  assert.equal(reused.plan.id, first.plan.id);
  assert.deepEqual(
    f.calls.map((c) => c.method),
    ["GET", "POST", "PUT", "GET", "GET"],
  );
  assert.equal(f.row().state, "ready");
});

test("lost POST response recovers the unique owned wrong-currency plan without another POST", async (t) => {
  const f = fixture(t, { losePost: true });
  await assert.rejects(monthlyPlan(f.d, f.request), /POST response lost/);
  assert.equal(f.row().state, "creating");
  assert.equal(f.plans[0].currency, "USD");
  const result = await monthlyPlan(f.d, f.request);
  assert.equal(result.plan.currency, "BRL");
  assert.equal(f.calls.filter((c) => c.method === "POST").length, 1);
  assert.deepEqual(
    f.calls.map((c) => c.method),
    ["GET", "POST", "GET", "PUT", "GET"],
  );
  assert.equal(f.row().state, "ready");
});

test("POST response with another metadata owner is rejected even when currency is already correct", async (t) => {
  const f = fixture(t, {
    postOverride: {
      currency: "BRL",
      metadata: { vinteumPlanKey: "another-donation" },
    },
  });
  await assert.rejects(monthlyPlan(f.d, f.request), /ownership|identity/);
  assert.equal(f.row().state, "creating");
  assert.equal(f.calls.filter((c) => c.method === "PUT").length, 0);
});

function ownedPlan(key, overrides = {}) {
  return {
    id: "plan-fixture",
    currency: "BRL",
    price: "37.42",
    status: "Active",
    recurringType: "Monthly",
    optimisticActivation: false,
    trialDays: 0,
    renewable: true,
    memberCount: 0,
    metadata: { vinteumPlanKey: key },
    ...overrides,
  };
}

for (const [name, options] of [
  [
    "ready registry returns a different ID",
    {
      row: { state: "ready", plan_id: "plan-fixture" },
      plans: (key) => [ownedPlan(key)],
      getOverride: { id: "another-plan" },
    },
  ],
  [
    "ready registry has another metadata owner",
    {
      row: { state: "ready", plan_id: "plan-fixture" },
      plans: (key) => [
        ownedPlan(key, { metadata: { vinteumPlanKey: "another-donation" } }),
      ],
    },
  ],
]) {
  test(`rejects ${name}`, async (t) => {
    const f = fixture(t, options);
    await assert.rejects(monthlyPlan(f.d, f.request), /identity|ownership/);
    assert.equal(f.calls.filter((c) => c.method !== "GET").length, 0);
  });
}

test("configured human plan GET must return the configured ID", async (t) => {
  const f = fixture(t, {
    plans: (key) => [ownedPlan(key)],
    getOverride: { id: "another-plan" },
  });
  process.env.BTCPAY_MONTHLY_PLANS = JSON.stringify({
    "BRL:3742": { planId: "plan-fixture" },
  });
  await assert.rejects(monthlyPlan(f.d, f.request), /identity/);
  assert.equal(f.calls.filter((c) => c.method !== "GET").length, 0);
});

test("offering discovery rejects another offering ID before POST", async (t) => {
  const f = fixture(t);
  const request = async (path, init) => {
    const result = await f.request(path, init);
    return path.endsWith("offering-fixture")
      ? { ...result, id: "another-offering" }
      : result;
  };
  await assert.rejects(monthlyPlan(f.d, request), /identity/);
  assert.equal(f.calls.length, 1);
});

for (const [name, override] of [
  ["wrong price", { price: "37.43" }],
  ["fractional minor units", { price: "37.421" }],
  ["yearly schedule", { recurringType: "Yearly" }],
  ["trial", { trialDays: 1 }],
  ["optimistic activation", { optimisticActivation: true }],
  ["nonrenewable", { renewable: false }],
  ["retired plan", { status: "Retired" }],
  ["existing subscribers", { memberCount: 1 }],
  ["unknown member count", { memberCount: undefined }],
  ["unknown currency", { currency: null }],
  ["wrong metadata", { metadata: { vinteumPlanKey: "another-donation" } }],
]) {
  test(`currency repair refuses ${name} before PUT`, async (t) => {
    const f = fixture(t, { postOverride: override });
    await assert.rejects(monthlyPlan(f.d, f.request));
    assert.equal(f.calls.filter((c) => c.method === "PUT").length, 0);
    assert.equal(f.row().state, "creating");
  });
}

for (const boundary of ["putOverride", "getOverride"]) {
  for (const [name, override] of [
    ["wrong ID", { id: "another-plan" }],
    ["wrong metadata", { metadata: { vinteumPlanKey: "another-donation" } }],
    ["wrong currency", { currency: "USD" }],
    ["wrong price", { price: "37.43" }],
    ["unsafe activation", { optimisticActivation: true }],
  ]) {
    test(`repair rejects ${name} in ${boundary === "putOverride" ? "PUT response" : "GET readback"}`, async (t) => {
      const f = fixture(t, { [boundary]: override });
      await assert.rejects(monthlyPlan(f.d, f.request));
      assert.equal(f.calls.filter((c) => c.method === "POST").length, 1);
      assert.equal(f.row().state, "creating");
      assert.ok(
        f.queries.some((sql) => sql.startsWith("SELECT pg_advisory_unlock")),
      );
    });
  }
}

test("a successful-looking PUT cannot substitute for persistent GET readback", async (t) => {
  const f = fixture(t, { ignorePut: true, putOverride: { currency: "BRL" } });
  await assert.rejects(monthlyPlan(f.d, f.request), /configuration mismatch/);
  assert.equal(f.plans[0].currency, "USD");
  assert.deepEqual(
    f.calls.map((c) => c.method),
    ["GET", "POST", "PUT", "GET"],
  );
  assert.equal(f.row().state, "creating");
});

for (const [name, plans] of [
  [
    "duplicate owned keys across currencies",
    (key) => [
      ownedPlan(key),
      ownedPlan(key, { id: "another-plan", currency: "USD" }),
    ],
  ],
  ["no owned match", () => []],
  [
    "only another donation's plan",
    () => [ownedPlan("another-donation", { currency: "USD" })],
  ],
]) {
  test(`uncertain creation rejects ${name} without POST or PUT`, async (t) => {
    const f = fixture(t, { row: { state: "creating", plan_id: null }, plans });
    await assert.rejects(monthlyPlan(f.d, f.request), /Ambiguous|uncertain/);
    assert.equal(f.calls.filter((c) => c.method !== "GET").length, 0);
  });
}

test("unique owned wrong-currency metadata can be recovered without a local row", async (t) => {
  const f = fixture(t, {
    plans: (key) => [ownedPlan(key, { currency: "USD" })],
  });
  const result = await monthlyPlan(f.d, f.request);
  assert.equal(result.plan.currency, "BRL");
  assert.deepEqual(
    f.calls.map((c) => c.method),
    ["GET", "PUT", "GET"],
  );
});

test("a ready registry plan is not silently rewritten after currency drift", async (t) => {
  const f = fixture(t, {
    row: { state: "ready", plan_id: "plan-fixture" },
    plans: (key) => [ownedPlan(key, { currency: "USD" })],
  });
  await assert.rejects(monthlyPlan(f.d, f.request), /configuration mismatch/);
  assert.deepEqual(
    f.calls.map((c) => c.method),
    ["GET"],
  );
});

test("a configured human plan is never currency-repaired", async (t) => {
  const f = fixture(t, {
    plans: () => [ownedPlan("human-plan", { currency: "USD" })],
  });
  process.env.BTCPAY_MONTHLY_PLANS = JSON.stringify({
    "BRL:3742": { planId: "plan-fixture" },
  });
  await assert.rejects(monthlyPlan(f.d, f.request), /configuration mismatch/);
  assert.deepEqual(
    f.calls.map((c) => c.method),
    ["GET"],
  );
});

test("dynamic discovery uses the authentic offering GET with embedded plans", async (t) => {
  const f = fixture(t, { currency: "USD" });
  const result = await monthlyPlan(f.d, f.request);
  assert.equal(result.plan.currency, "USD");
  assert.equal(
    f.calls[0].path,
    "/stores/store-fixture/offerings/offering-fixture",
  );
  assert.equal(f.calls.filter((c) => c.method === "POST").length, 1);
  assert.equal(f.row().state, "ready");
});
