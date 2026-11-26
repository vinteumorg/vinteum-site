import { isIP } from "node:net";
import { check, config, DonationError } from "./core.mjs";
import { rateLimit } from "./db.mjs";
export function assertOrigin(request, cfg = config()) {
  check(
    request.headers.get("origin") === cfg.origin && !!cfg.origin,
    "Origin forbidden",
    403,
  );
  const site = request.headers.get("sec-fetch-site");
  check(
    !site || ["same-origin", "none"].includes(site),
    "Cross-site request forbidden",
    403,
  );
}
export async function boundedBody(request, max = 65536) {
  const length = request.headers.get("content-length");
  check(
    !length || (/^\d+$/.test(length) && Number(length) <= max),
    "Request too large",
    413,
  );
  check(request.body, "Request body required");
  const reader = request.body.getReader();
  const chunks = [];
  let total = 0;
  const timer = setTimeout(() => reader.cancel().catch(() => {}), 15000);
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > max) {
        await reader.cancel();
        check(false, "Request too large", 413);
      }
      chunks.push(Buffer.from(value));
    }
    return Buffer.concat(chunks);
  } finally {
    clearTimeout(timer);
    reader.releaseLock();
  }
}
export async function jsonBody(request, max = 65536) {
  check(
    request.headers.get("content-type")?.split(";")[0] === "application/json",
    "JSON required",
    415,
  );
  try {
    return JSON.parse((await boundedBody(request, max)).toString("utf8"));
  } catch (e) {
    if (e instanceof DonationError) throw e;
    throw new DonationError("Invalid JSON");
  }
}
export function frontendCheckout(body, request) {
  check(body && typeof body === "object", "Invalid body");
  check(
    typeof body.amount === "number" &&
      Number.isFinite(body.amount) &&
      Math.abs(body.amount * 100 - Math.round(body.amount * 100)) < 0.0000001,
    "Invalid amount precision",
  );
  const d = body.donor || {};
  const recognition = body.publicRecognition;
  return {
    provider: body.provider,
    frequency: body.frequency,
    currency: body.currency,
    amount: Math.round(body.amount * 100),
    locale: body.locale === "BR" || body.locale === "pt" ? "pt" : "en",
    direct: body.direct,
    firstName: d.firstName,
    lastName: d.lastName,
    email: d.email,
    organization: d.organization,
    comment: d.message,
    newsletterConsent: body.newsletterConsent,
    publicConsent: recognition?.consent,
    publicProfile: recognition?.consent
      ? {
          name: recognition.name,
          url: recognition.link,
          kind: recognition.kind,
        }
      : undefined,
    idempotencyKey: request.headers.get("Idempotency-Key"),
  };
}
export function publicConfig(cfg = config()) {
  return {
    enabled: cfg.enabled,
    mode: !cfg.enabled ? "unconfigured" : cfg.live ? "live" : "test",
    stripe: {
      enabled: cfg.stripeEnabled,
      currencies: cfg.stripeCurrencies || [],
      publishableKey: cfg.stripeEnabled ? cfg.stripePublishableKey : undefined,
    },
    btcpay: {
      enabled: cfg.bitcoinEnabled,
      monthlyEnabled: cfg.bitcoinEnabled && cfg.bitcoinMonthlyEnabled,
    },
    currencies: Object.keys(cfg.currencies),
    presets: Object.fromEntries(
      Object.entries(cfg.currencies).map(([k, v]) => [
        k,
        {
          once: v.suggested.once.map((n) => n / 100),
          monthly: v.suggested.monthly.map((n) => n / 100),
        },
      ]),
    ),
    limits: Object.fromEntries(
      Object.entries(cfg.currencies).map(([k, v]) => [
        k,
        { min: v.min / 100, max: v.max / 100 },
      ]),
    ),
  };
}
export function response(body, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
/** Trust only an edge-overwritten single-IP header with the app inaccessible directly.
 * x-forwarded-for first-hop parsing permits attacker-controlled rate-limit bypass.
 */
export function rateIdentity(request, env = process.env) {
  if (
    env.DONATIONS_TRUST_PROXY !== "true" ||
    env.DONATIONS_PROXY_IP_HEADER !== "x-real-ip"
  )
    return "global";
  const ip = request.headers.get("x-real-ip")?.trim();
  return ip && isIP(ip) ? ip : "global";
}
export function route(
  handler,
  { write = false, limit = 30, enabled = true, operational = false } = {},
) {
  return async (request, ...rest) => {
    try {
      const cfg = config();
      if (enabled) check(cfg.enabled, "Donations unavailable", 503);
      if (write) assertOrigin(request, cfg);
      if (enabled || operational) {
        check(process.env.DATABASE_URL, "Database unavailable", 503);
        const ip = rateIdentity(request);
        await rateLimit(`${new URL(request.url).pathname}:${ip}`, limit, 60);
      }
      return await handler(request, ...rest);
    } catch (e) {
      if (e instanceof DonationError)
        return response({ error: e.message }, e.status);
      console.error("donations_operation_failed", {
        code: typeof e?.code === "string" ? e.code : "internal",
      });
      return response(
        { error: "Donation service temporarily unavailable" },
        503,
      );
    }
  };
}
