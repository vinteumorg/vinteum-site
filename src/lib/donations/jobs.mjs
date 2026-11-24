import { unseal } from "./secrets.mjs";
import { randomUUID, createHmac } from "node:crypto";
import { check, email, text, tokenHash } from "./core.mjs";
import { pool, transaction, enqueue } from "./db.mjs";
import { refreshDonation } from "./service.mjs";
export async function submitMajorGift(body) {
  check(body && typeof body === "object", "Invalid body");
  if (body.website) return { ok: true };
  const payload = {
    name: text(
      body.name || `${body.firstName || ""} ${body.lastName || ""}`,
      200,
      true,
    ),
    email: email(body.email),
    organization: text(body.organization, 200),
    message: text(body.message, 5000, true),
    locale: body.locale === "pt" || body.locale === "BR" ? "pt" : "en",
  };
  const hash = tokenHash(JSON.stringify(payload));
  await transaction(async (db) => {
    const row = await db.query(
      "INSERT INTO donation_major_gifts(id,request_hash) VALUES($1,$2) ON CONFLICT(request_hash) DO NOTHING RETURNING id",
      [randomUUID(), hash],
    );
    if (row.rowCount)
      await enqueue(db, "major-gift", `major:${hash}`, null, payload);
  });
  return { ok: true };
}
const copy = {
  en: {
    "cancellation-scheduled": [
      "Cancellation scheduled",
      "Your monthly contribution will stop at the end of the current paid period. It has not been cancelled immediately.",
    ],
    confirmation: [
      "Donation confirmed",
      "Thank you. Your payment has been confirmed by the payment processor. This message is not a tax receipt.",
    ],
    recognition: [
      "Recognition request received",
      "Your optional public profile is awaiting review. It will not be published without approval.",
    ],
    cancellation: [
      "Monthly contribution cancelled",
      "Your monthly contribution or manual Bitcoin commitment has been cancelled. Thank you for your support.",
    ],
  },
  pt: {
    "cancellation-scheduled": [
      "Cancelamento agendado",
      "Sua contribuição mensal será encerrada ao fim do período pago atual. O cancelamento não é imediato.",
    ],
    confirmation: [
      "Doação confirmada",
      "Obrigado. Seu pagamento foi confirmado pelo processador. Esta mensagem não é um recibo fiscal.",
    ],
    recognition: [
      "Solicitação de reconhecimento recebida",
      "Seu perfil público opcional está aguardando revisão. A publicação depende de aprovação.",
    ],
    cancellation: [
      "Contribuição mensal cancelada",
      "Sua contribuição mensal ou compromisso manual em Bitcoin foi cancelado. Obrigado pelo apoio.",
    ],
  },
};
export async function deliverOutbox(row) {
  if (row.kind === "newsletter") return subscribeNewsletter(row.payload);
  const p = row.payload;
  let subject, content, to, replyTo;
  if (row.kind === "major-gift") {
    subject =
      p.locale === "pt"
        ? "Vinteum — contato para grande doação"
        : "Vinteum — major gift enquiry";
    content = `Name: ${p.name}\nEmail: ${p.email}\nOrganization: ${p.organization || ""}\n\n${p.message}`;
    to = process.env.RESEND_TO_EMAIL;
    replyTo = p.email;
  } else {
    const localized = copy[p.locale] || copy.en;
    check(localized[row.kind], "Unknown email type", 503);
    [subject, content] = localized[row.kind];
    to = p.email;
  }
  if (row.donation_id) {
    const d = (
      await pool().query(
        "SELECT capability_ciphertext,manage_token_hash FROM donations WHERE id=$1",
        [row.donation_id],
      )
    ).rows[0];
    if (d?.capability_ciphertext) {
      const { manageToken } = unseal(d.capability_ciphertext);
      check(
        tokenHash(manageToken) === d.manage_token_hash,
        "Invalid management capability",
        503,
      );
      const origin = process.env.DONATIONS_ORIGIN;
      check(
        origin && new URL(origin).origin === origin,
        "Mail origin unavailable",
        503,
      );
      content += `\n\n${p.locale === "pt" ? "Gerenciar contribuição" : "Manage contribution"}: ${origin}/donate/manage#id=${row.donation_id}&token=${manageToken}`;
    }
  }
  check(
    process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL && to,
    "Email unavailable",
    503,
  );
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `donations/${row.dedupe_key}`,
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL,
      to: [to],
      subject,
      text: content,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
    signal: AbortSignal.timeout(12000),
  });
  check(r.ok, "Email delivery failed", 503);
}
/** True when delivery failed because the transport is not configured at all. */
export function isTransportGap(error) {
  const message = String(error?.message || error || "");
  return (
    message === "Email unavailable" ||
    message === "Newsletter unavailable"
  );
}
export async function drainOutbox({ send = deliverOutbox, limit = 25 } = {}) {
  check(
    Number.isSafeInteger(limit) && limit > 0 && limit <= 100,
    "Invalid batch",
  );
  let sent = 0,
    failed = 0;
  for (let i = 0; i < limit; i++) {
    const item = await transaction(async (db) => {
      const row = (
        await db.query(
          "SELECT * FROM donation_outbox WHERE sent_at IS NULL AND attempts<8 AND available_at<=now() AND (lease_until IS NULL OR lease_until<now()) ORDER BY id FOR UPDATE SKIP LOCKED LIMIT 1",
        )
      ).rows[0];
      if (!row) return null;
      await db.query(
        "UPDATE donation_outbox SET lease_until=now()+interval '2 minutes',attempts=attempts+1 WHERE id=$1",
        [row.id],
      );
      return row;
    });
    if (!item) break;
    try {
      await send(item);
      await pool().query(
        "UPDATE donation_outbox SET sent_at=now(),lease_until=NULL,last_error=NULL,payload=$2 WHERE id=$1",
        [item.id, JSON.stringify({ redacted: true })],
      );
      sent++;
    } catch (error) {
      // A missing transport is a configuration gap, not a bad message: park the
      // row without spending one of its eight attempts, so configuring e-mail
      // later still delivers what was queued instead of losing it.
      const parked = isTransportGap(error);
      await pool().query(
        "UPDATE donation_outbox SET lease_until=NULL,last_error=$3,attempts=attempts-$4,available_at=now()+($2*interval '1 second') WHERE id=$1",
        [
          item.id,
          parked ? 3600 : Math.min(3600, 30 * 2 ** item.attempts),
          parked ? "transport_unconfigured" : "delivery_failed",
          parked ? 1 : 0,
        ],
      );
      failed += parked ? 0 : 1;
    }
  }
  return { sent, failed };
}
/** Durable attempt scheduling prevents poison records starving the queue. Recent
 * terminal records are swept too: refunds and late BTC settlement can miss hooks.
 * Older than 90 days requires explicit operator backfill; monthly stays monitored.
 */
export async function reconcile({ truth, limit = 25 } = {}) {
  check(
    Number.isSafeInteger(limit) && limit > 0 && limit <= 100,
    "Invalid batch",
  );
  const rows = await transaction(
    async (db) =>
      (
        await db.query(
          `WITH selected AS (
 SELECT id FROM donations WHERE provider_id IS NOT NULL
 AND (frequency='monthly' OR created_at>now()-interval '90 days')
 AND reconcile_after<=now() ORDER BY reconcile_after,created_at
 FOR UPDATE SKIP LOCKED LIMIT $1
 ) UPDATE donations d SET last_attempt_at=now(),reconcile_after=now()+interval '10 minutes'
 FROM selected s WHERE d.id=s.id RETURNING d.id`,
          [limit],
        )
      ).rows,
  );
  let checked = 0,
    failed = 0;
  for (const row of rows) {
    try {
      const d = await refreshDonation(row.id, truth);
      const seconds =
        d.frequency === "monthly"
          ? 300
          : ["pending", "partial", "late", "confirming", "processing"].includes(
                d.status,
              )
            ? 60
            : 21600;
      await pool().query(
        "UPDATE donations SET reconcile_after=now()+($2*interval '1 second') WHERE id=$1",
        [row.id, seconds],
      );
      checked++;
    } catch {
      await pool().query(
        "UPDATE donations SET reconcile_after=now()+interval '5 minutes' WHERE id=$1",
        [row.id],
      );
      failed++;
    }
  }
  return { checked, failed };
}
export async function runJobs() {
  const reconciliation = await reconcile();
  const emails = await drainOutbox();
  await pool().query(
    "DELETE FROM donation_rate_limits WHERE window_start<now()-interval '2 days'",
  );
  return { reconciliation, emails };
}
export async function subscribeNewsletter({ email: address, name }) {
  // Same Ghost membership store as /api/newsletter/subscribe; preserve existing choices.
  const base = process.env.GHOST_URL,
    key = process.env.GHOST_ADMIN_API_KEY,
    newsletter = process.env.DONATIONS_GHOST_NEWSLETTER_ID;
  check(base && key && newsletter, "Newsletter unavailable", 503);
  const [kid, secret] = key.split(":");
  check(kid && /^[a-f0-9]+$/i.test(secret), "Newsletter unavailable", 503);
  const now = Math.floor(Date.now() / 1000),
    header = Buffer.from(
      JSON.stringify({ alg: "HS256", typ: "JWT", kid }),
    ).toString("base64url"),
    payload = Buffer.from(
      JSON.stringify({ iat: now, exp: now + 300, aud: "/admin/" }),
    ).toString("base64url"),
    token = `${header}.${payload}.${createHmac("sha256", Buffer.from(secret, "hex")).update(`${header}.${payload}`).digest("base64url")}`;
  const request = async (path, options = {}) => {
    const r = await fetch(`${base.replace(/\/$/, "")}/ghost/api/admin${path}`, {
      method: options.method || "GET",
      headers: {
        Authorization: `Ghost ${token}`,
        "Content-Type": "application/json",
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: AbortSignal.timeout(12000),
      redirect: "error",
    });
    check(r.ok, "Newsletter request failed", 503);
    return r.json();
  };
  const escaped = address.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
  const existing = (
    await request(
      `/members/?filter=${encodeURIComponent(`email:'${escaped}'`)}&include=newsletters`,
    )
  ).members?.[0];
  if (existing) {
    if (existing.subscribed === false) return;
    const ids = (existing.newsletters || []).map((n) => n.id);
    if (!ids.includes(newsletter))
      await request(`/members/${encodeURIComponent(existing.id)}/`, {
        method: "PUT",
        body: {
          members: [
            { newsletters: [...ids, newsletter].map((id) => ({ id })) },
          ],
        },
      });
    return;
  }
  await request("/members/", {
    method: "POST",
    body: {
      members: [
        {
          email: address,
          name,
          subscribed: true,
          newsletters: [{ id: newsletter }],
        },
      ],
    },
  });
}
