import test from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import { decodeAvatar } from "../src/lib/donations/images.mjs";
import {
  boundedBody,
  assertOrigin,
  frontendCheckout,
  publicConfig,
  rateIdentity,
} from "../src/lib/donations/http.mjs";
test("rate identity ignores spoofed forwarding unless a single overwritten proxy header is explicitly trusted", () => {
  const r = new Request("https://example.org", {
    headers: {
      "x-forwarded-for": "1.2.3.4, 5.6.7.8",
      "x-real-ip": "192.0.2.1",
    },
  });
  assert.equal(rateIdentity(r, {}), "global");
  assert.equal(
    rateIdentity(r, {
      DONATIONS_TRUST_PROXY: "true",
      DONATIONS_PROXY_IP_HEADER: "x-real-ip",
    }),
    "192.0.2.1",
  );
  assert.equal(
    rateIdentity(r, {
      DONATIONS_TRUST_PROXY: "true",
      DONATIONS_PROXY_IP_HEADER: "x-forwarded-for",
    }),
    "global",
  );
});
const cfg = {
  origin: "https://example.org",
  enabled: true,
  stripeEnabled: false,
  bitcoinEnabled: false,
  bitcoinMonthlyEnabled: false,
  currencies: {
    USD: { min: 500, max: 10000, suggested: { once: [2500], monthly: [1000] } },
  },
};
test("origin protection and byte bounds reject cross-site and chunked oversized bodies", async () => {
  assert.throws(
    () =>
      assertOrigin(
        new Request("https://example.org/api", {
          method: "POST",
          headers: { origin: "https://evil.org" },
        }),
        cfg,
      ),
    (e) => e.status === 403,
  );
  assert.throws(() =>
    assertOrigin(
      new Request("https://example.org/api", { method: "POST" }),
      cfg,
    ),
  );
  const request = new Request("https://example.org", {
    method: "POST",
    body: "x".repeat(30),
  });
  await assert.rejects(
    () => boundedBody(request, 20),
    (e) => e.status === 413,
  );
});
test("frontend DTO uses major units but normalized values are integer minor units", () => {
  const r = new Request("https://example.org", {
    headers: { "Idempotency-Key": "8a345b6a-9c24-44e0-93f4-77ae69116df8" },
  });
  const normalized = frontendCheckout(
    {
      provider: "stripe",
      frequency: "monthly",
      currency: "USD",
      amount: 25.5,
      locale: "BR",
      donor: { firstName: "A", lastName: "B", email: "a@example.org" },
      publicRecognition: {
        consent: true,
        name: "Public",
        link: "https://example.org",
      },
    },
    r,
  );
  assert.equal(normalized.amount, 2550);
  assert.equal(normalized.locale, "pt");
  assert.equal(normalized.publicProfile.name, "Public");
  assert.throws(() => frontendCheckout({ amount: 1.005 }, r));
  assert.equal(publicConfig(cfg).limits.USD.min, 5);
});
test("uploads decode real magic and normalize raster; reject SVG, lies and pixel bombs", async () => {
  const png = await sharp({
    create: { width: 10, height: 10, channels: 3, background: "red" },
  })
    .png()
    .toBuffer();
  const out = await decodeAvatar(png, "image/png");
  assert.equal((await sharp(out).metadata()).format, "webp");
  await assert.rejects(() => decodeAvatar(png, "image/jpeg"));
  await assert.rejects(() =>
    decodeAvatar(Buffer.from("<svg/>"), "image/svg+xml"),
  );
  await assert.rejects(() =>
    decodeAvatar(Buffer.alloc(2 * 1024 * 1024 + 1), "image/png"),
  );
  const large = await sharp({
    create: { width: 5000, height: 1, channels: 3, background: "red" },
  })
    .png()
    .toBuffer();
  await assert.rejects(() => decodeAvatar(large, "image/png"));
});
