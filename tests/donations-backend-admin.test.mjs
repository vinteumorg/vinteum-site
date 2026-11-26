import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { pool, migrate } from "../src/lib/donations/db.mjs";
import {
  createCheckout,
  refreshDonation,
  listSupporters,
} from "../src/lib/donations/service.mjs";
import {
  adminListProfiles,
  adminModerateProfile,
  adminAuditLog,
} from "../src/lib/donations/admin.mjs";
process.env.DATABASE_URL ||= process.env.DONATIONS_DATABASE_URL;
const enabled = !!process.env.DATABASE_URL;
test(
  "moderation requires paid monthly consent; approval readback is public-safe; removal audited",
  { skip: !enabled },
  async () => {
    await migrate();
    const cfg = {
      enabled: true,
      stripeEnabled: true,
      currencies: { USD: { min: 500, max: 10000 } },
    };
    const d = await createCheckout(
      {
        idempotencyKey: randomUUID(),
        provider: "stripe",
        frequency: "monthly",
        currency: "USD",
        amount: 1000,
        email: "a@example.org",
        firstName: "A",
        lastName: "B",
        publicConsent: true,
        publicProfile: { name: "Public only" },
      },
      { create: async (d) => ({ providerId: `cs_${d.id}` }) },
      cfg,
    );
    const profile = (
      await pool().query(
        "select id from donation_profiles where donation_id=$1",
        [d.id],
      )
    ).rows[0];
    await assert.rejects(
      () =>
        adminModerateProfile({
          profileId: profile.id,
          action: "approve",
          actor: "admin@example.org",
        }),
      (e) => e.status === 409,
    );
    await refreshDonation(d.id, async () => ({
      status: "paid",
      recurringStatus: "active",
    }));
    const list = await adminListProfiles("pending");
    assert(list.some((p) => p.id === profile.id));
    await adminModerateProfile({
      profileId: profile.id,
      action: "approve",
      actor: "admin@example.org",
    });
    const item = (await listSupporters()).find((p) => p.id === profile.id);
    assert.equal(item.name, "Public only");
    assert.equal(item.donor_email, undefined);
    assert.equal(item.amount, undefined);
    await adminModerateProfile({
      profileId: profile.id,
      action: "remove",
      actor: "admin@example.org",
      reason: "requested",
    });
    assert(!(await listSupporters()).some((p) => p.id === profile.id));
    assert(
      (await adminAuditLog()).some(
        (a) => a.profileId === profile.id && a.actor === "admin@example.org",
      ),
    );
  },
);
test.after(async () => {
  if (enabled) await pool().end();
});
