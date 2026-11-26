import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { config, validateCheckout } from "../src/lib/donations/core.mjs";
import { createCheckout } from "../src/lib/donations/service.mjs";
import { pool, migrate } from "../src/lib/donations/db.mjs";

process.env.DATABASE_URL ||= process.env.DONATIONS_DATABASE_URL;
const input = () => ({
  provider: "stripe",
  frequency: "once",
  currency: "USD",
  amount: 1000,
  email: "fixture@example.org",
  idempotencyKey: randomUUID(),
});
test("optional prototype name fields are validated without requiring extra identity data", () => {
  const normalized = validateCheckout(input(), config({}));
  assert.equal(normalized.firstName, null);
  assert.equal(normalized.lastName, null);
  assert.throws(() =>
    validateCheckout({ ...input(), firstName: { bad: "type" } }, config({})),
  );
});
test(
  "a donation without optional names persists null, not a fabricated null-null name",
  { skip: !process.env.DATABASE_URL },
  async () => {
    await migrate();
    const cfg = { ...config({}), enabled: true, stripeEnabled: true };
    const checkout = await createCheckout(
      input(),
      {
        create: async (d) => ({
          providerId: "cs_fixture_" + d.id,
          clientSecret: "test-only-secret",
        }),
      },
      cfg,
    );
    try {
      const row = (
        await pool().query("SELECT donor_name FROM donations WHERE id=$1", [
          checkout.id,
        ])
      ).rows[0];
      assert.equal(row.donor_name, null);
    } finally {
      await pool().query("DELETE FROM donations WHERE id=$1", [checkout.id]);
    }
  },
);
test.after(async () => {
  if (process.env.DATABASE_URL) await pool().end();
});
