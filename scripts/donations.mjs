#!/usr/bin/env node
/** Operator-only CLI. Never run migrations automatically from a public route. */
import { migrate, pool } from "../src/lib/donations/db.mjs";
import { runJobs, reconcile, drainOutbox } from "../src/lib/donations/jobs.mjs";
process.env.DATABASE_URL ||= process.env.DONATIONS_DATABASE_URL;
const action = process.argv[2];
if (!["migrate", "jobs", "reconcile", "outbox"].includes(action)) {
  console.error(
    "Usage: node scripts/donations.mjs migrate|jobs|reconcile|outbox",
  );
  process.exitCode = 2;
} else {
  try {
    const result =
      action === "migrate"
        ? (await migrate(), { migrated: true })
        : action === "jobs"
          ? await runJobs()
          : action === "reconcile"
            ? await reconcile()
            : await drainOutbox();
    console.log(JSON.stringify(result));
  } catch {
    console.error("donations_command_failed");
    process.exitCode = 1;
  } finally {
    if (process.env.DATABASE_URL) await pool().end();
  }
}
