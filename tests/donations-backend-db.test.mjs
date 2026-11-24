import test from "node:test";
import assert from "node:assert/strict";
import {
  pool,
  transaction,
  migrate,
  rateLimit,
} from "../src/lib/donations/db.mjs";
process.env.DATABASE_URL ||= process.env.DONATIONS_DATABASE_URL;
test(
  "database migration is repeatable and rate limits persist across transactions",
  { skip: !process.env.DATABASE_URL },
  async () => {
    await migrate();
    await migrate();
    const key = `test:${crypto.randomUUID()}`;
    await rateLimit(key, 2, 60);
    await rateLimit(key, 2, 60);
    await assert.rejects(
      () => rateLimit(key, 2, 60),
      (e) => e.status === 429,
    );
    const r = await pool().query(
      "select hits from donation_rate_limits where key=$1",
      [(await import("../src/lib/donations/core.mjs")).tokenHash(key)],
    );
    assert.equal(r.rows[0].hits, 3);
  },
);
test(
  "transaction rolls back writes on failure",
  { skip: !process.env.DATABASE_URL },
  async () => {
    const id = crypto.randomUUID();
    await assert.rejects(() =>
      transaction(async (db) => {
        await db.query(
          "insert into donation_rate_limits(key,hits,window_start) values ($1,1,now())",
          [id],
        );
        throw new Error("rollback");
      }),
    );
    assert.equal(
      (
        await pool().query("select * from donation_rate_limits where key=$1", [
          id,
        ])
      ).rowCount,
      0,
    );
  },
);
test.after(async () => {
  if (process.env.DATABASE_URL) await pool().end();
});
