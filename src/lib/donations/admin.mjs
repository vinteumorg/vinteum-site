// INTERNAL SERVICE ONLY. Authenticate and authorize the caller BEFORE invoking.
import { pool, transaction } from "./db.mjs";
import { check, text } from "./core.mjs";
const projection = `p.id,p.donation_id AS "donationId",p.name,p.url,p.kind,p.avatar_id AS "avatarId",p.state,p.activity,p.created_at AS "createdAt",d.paid_at AS "paidAt"`;
const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;

export async function adminGetProfileAvatar(profileId) {
  check(typeof profileId === "string" && uuid.test(profileId), "Not found", 404);
  const result = await pool().query(
    "SELECT a.data FROM donation_profiles p JOIN donation_avatars a ON a.id=p.avatar_id AND a.donation_id=p.donation_id WHERE p.id=$1",
    [profileId],
  );
  return result.rows[0]?.data ?? null;
}

export async function adminListMessages(cursor) {
  let createdAt = null, id = null;
  if (cursor !== undefined) {
    let key;
    try {
      check(typeof cursor === "string" && cursor.length <= 256 && /^[A-Za-z0-9_-]+$/.test(cursor), "Invalid cursor");
      const decoded = Buffer.from(cursor, "base64url");
      check(decoded.toString("base64url") === cursor, "Invalid cursor");
      key = JSON.parse(decoded.toString("utf8"));
      check(Array.isArray(key) && key.length === 2 && typeof key[0] === "string" && typeof key[1] === "string", "Invalid cursor");
      check(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6}Z$/.test(key[0]) && uuid.test(key[1]), "Invalid cursor");
      check(new Date(key[0]).toISOString() === key[0].slice(0,23) + "Z", "Invalid cursor");
    } catch {
      check(false, "Invalid cursor", 400);
    }
    [createdAt, id] = key;
  }
  const { rows } = await pool().query(
    `SELECT id,donor_name AS "name",donor_email AS "email",comment AS "message",status,frequency,
      to_char(created_at AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS.US"Z"') AS "createdAt"
     FROM donations WHERE comment IS NOT NULL AND comment ~ '[^[:space:]]'
       AND ($1::timestamptz IS NULL OR (created_at,id) < ($1::timestamptz,$2::uuid))
     ORDER BY created_at DESC,id DESC LIMIT $3`,
    [createdAt, id, 51],
  );
  const messages = rows.slice(0,50);
  const last = messages[messages.length - 1];
  return {
    messages,
    nextCursor: rows.length > 50 ? Buffer.from(JSON.stringify([last.createdAt,last.id])).toString("base64url") : null,
  };
}

export async function adminListProfiles(state = "pending") {
  check(
    ["awaiting_payment", "pending", "approved", "rejected", "removed"].includes(
      state,
    ),
    "Invalid state",
  );
  return (
    await pool().query(
      `SELECT ${projection} FROM donation_profiles p JOIN donations d ON d.id=p.donation_id WHERE p.state=$1 ORDER BY p.created_at LIMIT 250`,
      [state],
    )
  ).rows;
}
export async function adminModerateProfile({
  profileId,
  action,
  actor,
  reason,
}) {
  check(["approve", "reject", "remove"].includes(action), "Invalid action");
  const author = text(actor, 254, true),
    note = text(reason, 1000);
  check(
    typeof profileId === "string" && /^[a-f0-9-]{36}$/i.test(profileId),
    "Invalid profile",
  );
  return transaction(async (db) => {
    // Lock donor first everywhere to avoid deadlocks against provider reconciliation.
    const match = (
      await db.query("SELECT donation_id FROM donation_profiles WHERE id=$1", [
        profileId,
      ])
    ).rows[0];
    check(match, "Not found", 404);
    const d = (
      await db.query("SELECT * FROM donations WHERE id=$1 FOR UPDATE", [
        match.donation_id,
      ])
    ).rows[0];
    const p = (
      await db.query("SELECT * FROM donation_profiles WHERE id=$1 FOR UPDATE", [
        profileId,
      ])
    ).rows[0];
    if (action === "approve")
      check(
        d.frequency === "monthly" &&
          d.public_consent &&
          d.paid_at &&
          ["pending", "approved"].includes(p.state),
        "Profile not eligible for publication",
        409,
      );
    const state = {
      approve: "approved",
      reject: "rejected",
      remove: "removed",
    }[action];
    await db.query(
      "UPDATE donation_profiles SET state=$2,updated_at=now() WHERE id=$1",
      [profileId, state],
    );
    await db.query(
      "INSERT INTO donation_audit(profile_id,actor,action,reason) VALUES($1,$2,$3,$4)",
      [profileId, author, action, note],
    );
    return (
      await db.query(
        `SELECT ${projection} FROM donation_profiles p JOIN donations d ON d.id=p.donation_id WHERE p.id=$1`,
        [profileId],
      )
    ).rows[0];
  });
}
export async function adminAuditLog(limit = 100) {
  check(
    Number.isSafeInteger(limit) && limit >= 1 && limit <= 500,
    "Invalid limit",
  );
  return (
    await pool().query(
      'SELECT id,profile_id AS "profileId",actor,action,reason,created_at AS "createdAt" FROM donation_audit ORDER BY id DESC LIMIT $1',
      [limit],
    )
  ).rows;
}
