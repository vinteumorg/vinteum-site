import pg from "pg";
import { readFile } from "node:fs/promises";
import { check, tokenHash } from "./core.mjs";
let connection;
export function pool() {
  const connectionString =
    process.env.DATABASE_URL || process.env.DONATIONS_DATABASE_URL;
  check(connectionString, "Database unavailable", 503);
  if (!connection)
    connection = new pg.Pool({
      connectionString,
      max: 8,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 10000,
      statement_timeout: 20000,
      application_name: "vinteum-donations",
    });
  return connection;
}
export async function transaction(fn) {
  const db = await pool().connect();
  try {
    await db.query("BEGIN");
    const result = await fn(db);
    await db.query("COMMIT");
    return result;
  } catch (e) {
    await db.query("ROLLBACK");
    throw e;
  } finally {
    db.release();
  }
}
export async function migrate() {
  const sql = await readFile(
    new URL("../../../migrations/001_donations.sql", import.meta.url),
    "utf8",
  );
  await transaction(async (db) => {
    await db.query("SELECT pg_advisory_xact_lock(76728341)");
    await db.query(sql);
  });
}
export async function rateLimit(key, limit = 15, windowSeconds = 60) {
  const result = await pool().query(
    `INSERT INTO donation_rate_limits(key,hits,window_start) VALUES($1,1,now()) ON CONFLICT(key) DO UPDATE SET hits=CASE WHEN donation_rate_limits.window_start<now()-($2*interval '1 second') THEN 1 ELSE donation_rate_limits.hits+1 END,window_start=CASE WHEN donation_rate_limits.window_start<now()-($2*interval '1 second') THEN now() ELSE donation_rate_limits.window_start END RETURNING hits`,
    [tokenHash(key), windowSeconds],
  );
  check(result.rows[0].hits <= limit, "Too many requests", 429);
}
export async function enqueue(db, kind, key, donationId, payload) {
  await db.query(
    "INSERT INTO donation_outbox(kind,dedupe_key,donation_id,payload) VALUES($1,$2,$3,$4) ON CONFLICT(dedupe_key) DO NOTHING",
    [kind, key, donationId, JSON.stringify(payload)],
  );
}
