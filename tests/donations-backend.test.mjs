import test from "node:test";
import assert from "node:assert/strict";
import {
  validateCheckout,
  config,
  safeUrl,
  newToken,
  tokenHash,
  verifyHmac,
} from "../src/lib/donations/core.mjs";

test("checkout validates server money, privacy, and independent consent", () => {
  const input = {
    provider: "stripe",
    frequency: "monthly",
    currency: "USD",
    amount: 1000,
    email: "alice@example.org",
    firstName: "Alice",
    lastName: "Doe",
    idempotencyKey: "8a345b6a-9c24-44e0-93f4-77ae69116df8",
  };
  assert.equal(validateCheckout(input).newsletterConsent, false);
  assert.equal(validateCheckout(input).publicConsent, false);
  for (const amount of [0, 1, 100000001, NaN, 1.5, "1000"])
    assert.throws(() => validateCheckout({ ...input, amount }));
  assert.throws(() => validateCheckout({ ...input, currency: "EUR" }));
  assert.throws(() =>
    validateCheckout({
      ...input,
      frequency: "once",
      publicConsent: true,
      publicProfile: { name: "Alice" },
    }),
  );
  assert.throws(() => validateCheckout({ ...input, publicConsent: "yes" }));
  assert.equal(
    validateCheckout({
      ...input,
      provider: "btcpay",
      frequency: "once",
      direct: true,
      email: undefined,
      firstName: undefined,
      lastName: undefined,
    }).email,
    null,
  );
  assert.throws(() => validateCheckout({ ...input, direct: true }));
});
test("URL policy rejects script schemes, credentials, localhost and private hosts", () => {
  for (const url of [
    "javascript:alert(1)",
    "http://example.org",
    "https://user:pass@example.org",
    "https://localhost",
    "https://127.0.0.1",
    "https://10.2.3.4",
    "https://[::1]",
  ])
    assert.throws(() => safeUrl(url));
  assert.equal(
    safeUrl("https://example.org/alice"),
    "https://example.org/alice",
  );
});
test("capability tokens are random, hashed, signatures authenticate exact bytes", () => {
  const a = newToken(),
    b = newToken();
  assert.notEqual(a, b);
  assert.equal(a.length, 43);
  assert.equal(tokenHash(a).length, 64);
  assert.equal(verifyHmac("hello", "sha256=000", "secret"), false);
});
test("payment config fails closed without explicit flags and valid origin", () => {
  const c = config({});
  assert.equal(c.enabled, false);
  assert.equal(c.stripeEnabled, false);
  assert.throws(() =>
    config({
      DONATIONS_ENABLED: "true",
      DATABASE_URL: "postgres://x",
      DONATIONS_ORIGIN: "https://example.org",
      STRIPE_SECRET_KEY: "sk_live_fake",
    }),
  );
});
