import {
  randomBytes,
  createHash,
  createHmac,
  timingSafeEqual,
} from "node:crypto";
export class DonationError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}
export function check(condition, message, status = 400) {
  if (!condition) throw new DonationError(message, status);
}
export const newToken = () => randomBytes(32).toString("base64url");
export const tokenHash = (value) =>
  createHash("sha256")
    .update(Buffer.isBuffer(value) ? value : String(value))
    .digest("hex");
export function verifyHmac(raw, signature, secret) {
  if (
    !secret ||
    typeof signature !== "string" ||
    !/^sha256=[a-f0-9]{64}$/.test(signature)
  )
    return false;
  return timingSafeEqual(
    Buffer.from(signature.slice(7), "hex"),
    createHmac("sha256", secret).update(raw).digest(),
  );
}
export function text(v, max = 200, required = false) {
  check(v === undefined || v === null || typeof v === "string", "Invalid text");
  const s = (v || "").trim();
  check(
    s.length <= max &&
      (!required || s.length > 0) &&
      !/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(s),
    "Invalid text",
  );
  return s || null;
}
export function email(v) {
  const s = text(v, 254, true).toLowerCase();
  check(/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(s), "Invalid email");
  return s;
}
export function safeUrl(value) {
  if (!value) return null;
  let u;
  try {
    const raw = typeof value === "string" ? value.trim() : value;
    // Donors type "x.com/me"; an explicit scheme is still validated strictly.
    const candidate = /^[a-z][a-z0-9+.-]*:/i.test(raw) || raw.startsWith("//")
      ? raw
      : "https://" + raw;
    u = new URL(candidate);
  } catch {
    throw new DonationError("Invalid URL");
  }
  const h = u.hostname.toLowerCase();
  check(
    u.protocol === "https:" &&
      !u.username &&
      !u.password &&
      !u.port &&
      h.includes(".") &&
      !/^[\d.]+$/.test(h) &&
      !h.includes(":") &&
      !/(^|\.)(localhost|local|internal|test|invalid)$/.test(h) &&
      !h.endsWith(".local"),
    "Unsafe URL",
  );
  check(u.href.length <= 2048, "URL too long");
  return u.href;
}
export function config(env = process.env) {
  const enabled = env.DONATIONS_ENABLED === "true";
  const live = env.DONATIONS_ALLOW_LIVE === "true";
  if (env.STRIPE_SECRET_KEY)
    check(
      /^sk_test_/.test(env.STRIPE_SECRET_KEY) ||
        (live && /^sk_live_/.test(env.STRIPE_SECRET_KEY)),
      "Live Stripe disabled",
      503,
    );
  const origin = env.DONATIONS_ORIGIN || "";
  if (enabled) {
    check(
      typeof env.DONATIONS_TOKEN_SECRET === "string" &&
        env.DONATIONS_TOKEN_SECRET.length >= 32,
      "Capability encryption unavailable",
      503,
    );
    check(Boolean(env.DATABASE_URL), "Database unavailable", 503);
    check(
      /^https:\/\//.test(origin) ||
        /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin),
      "Origin not configured",
      503,
    );
    check(new URL(origin).origin === origin, "Invalid origin", 503);
  }
  const currencies = {};
  for (const c of ["USD", "BRL"]) {
    const min = Number(env[`DONATIONS_${c}_MIN`] || 500),
      max = Number(env[`DONATIONS_${c}_MAX`] || 10000000);
    check(
      Number.isSafeInteger(min) &&
        Number.isSafeInteger(max) &&
        min > 0 &&
        max >= min,
      "Invalid limits",
      503,
    );
    const SUGGESTED = {
      USD: { ONCE: "2500,5000,10000,25000", MONTHLY: "2500,5000,10000,25000" },
      BRL: { ONCE: "5000,10000,25000,50000", MONTHLY: "5000,10000,25000,50000" },
    };
    const suggestions = (kind) => {
      const list = (
        env[`DONATIONS_${c}_${kind}_SUGGESTED`] ||
        SUGGESTED[c][kind] ||
        "2500,5000,10000,25000"
      )
        .split(",")
        .map(Number);
      check(
        list.every((n) => Number.isSafeInteger(n) && n >= min && n <= max),
        "Invalid suggestions",
        503,
      );
      return list;
    };
    currencies[c] = {
      min,
      max,
      suggested: { once: suggestions("ONCE"), monthly: suggestions("MONTHLY") },
    };
  }
  return {
    enabled,
    origin,
    live,
    currencies,
    stripeEnabled:
      enabled &&
      Boolean(
        env.STRIPE_SECRET_KEY &&
        env.STRIPE_PUBLISHABLE_KEY &&
        env.STRIPE_WEBHOOK_SECRET,
      ),
    stripePublishableKey: env.STRIPE_PUBLISHABLE_KEY || null,
    bitcoinEnabled:
      enabled &&
      env.BTCPAY_ENABLED === "true" &&
      Boolean(
        env.BTCPAY_URL &&
        env.BTCPAY_API_KEY &&
        env.BTCPAY_STORE_ID &&
        env.BTCPAY_WEBHOOK_SECRET,
      ),
    bitcoinMonthlyEnabled:
      enabled &&
      env.BTCPAY_MANUAL_PLEDGES === "true" &&
      Boolean(env.BTCPAY_MONTHLY_OFFERING_ID || env.BTCPAY_MONTHLY_PLANS),
  };
}
export function validateCheckout(body, cfg = config()) {
  check(
    body && typeof body === "object" && !Array.isArray(body),
    "Invalid body",
  );
  const { provider, frequency, currency, amount } = body;
  check(["stripe", "btcpay"].includes(provider), "Invalid provider");
  check(["once", "monthly"].includes(frequency), "Invalid frequency");
  check(Object.hasOwn(cfg.currencies, currency), "Invalid currency");
  const limits = cfg.currencies[currency];
  check(
    Number.isSafeInteger(amount) &&
      amount >= limits.min &&
      amount <= limits.max,
    "Amount outside limits",
  );
  check(
    typeof body.idempotencyKey === "string" &&
      /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(
        body.idempotencyKey,
      ),
    "Invalid idempotency key",
  );
  for (const key of ["direct", "newsletterConsent", "publicConsent"])
    check(
      body[key] === undefined || typeof body[key] === "boolean",
      "Invalid consent",
    );
  const direct = body.direct === true;
  check(
    !direct || (provider === "btcpay" && frequency === "once"),
    "Invalid direct donation",
  );
  check(
    !body.publicConsent || frequency === "monthly",
    "Public recognition requires monthly donation",
  );
  check(
    !direct || (!body.publicConsent && !body.newsletterConsent),
    "Direct donation cannot enroll",
  );
  let publicProfile = null;
  if (body.publicConsent) {
    check(
      body.publicProfile && typeof body.publicProfile === "object",
      "Public profile required",
    );
    check(
      body.publicProfile.kind === undefined ||
        ["person", "org"].includes(body.publicProfile.kind),
      "Invalid public profile kind",
    );
    publicProfile = {
      name: text(body.publicProfile.name, 100, true),
      url: safeUrl(body.publicProfile.url),
      kind: body.publicProfile.kind || "person",
    };
  }
  return {
    provider,
    frequency,
    currency,
    amount,
    idempotencyKey: body.idempotencyKey,
    locale: body.locale === "pt" ? "pt" : "en",
    direct,
    firstName: direct ? null : text(body.firstName, 100),
    lastName: direct ? null : text(body.lastName, 100),
    email: direct ? null : email(body.email),
    organization: direct ? null : text(body.organization, 200),
    comment: direct ? null : text(body.comment, 2000),
    newsletterConsent: body.newsletterConsent === true,
    publicConsent: body.publicConsent === true,
    publicProfile,
  };
}
