import { check, config } from "./core.mjs";
import {
  stripeClient,
  assertBitcoinNetwork,
  btcpayRequest,
  storePath,
} from "./providers.mjs";

/** Operator allowlist intersects account country capabilities; country support alone
 * is not proof that a specific account has completed activation or currency testing.
 */
export async function verifiedStripeCurrencies(
  stripe = stripeClient(),
  env = process.env,
) {
  const configured = (env.STRIPE_DONATION_CURRENCIES || "")
    .split(",")
    .filter(Boolean);
  check(
    configured.length && configured.every((c) => ["USD", "BRL"].includes(c)),
    "Stripe currencies not verified",
    503,
  );
  const account = await stripe.accounts.retrieve();
  // Sandbox activation flags can remain false while test payments succeed.
  // Only an explicit test key bypasses the live activation gate; the operator's
  // tested currency allowlist and country support checks still apply.
  const sandbox = (env.STRIPE_SECRET_KEY || "").startsWith("sk_test_");
  check(
    account.country && (sandbox || account.charges_enabled),
    "Stripe account not ready",
    503,
  );
  const spec = await stripe.countrySpecs.retrieve(account.country);
  return configured.filter((c) =>
    spec.supported_payment_currencies?.includes(c.toLowerCase()),
  );
}
export async function assertStripeCurrency(currency, stripe) {
  check(
    (await verifiedStripeCurrencies(stripe)).includes(currency),
    "Currency unavailable for Stripe account",
    400,
  );
}
export async function verifiedConfig(cfg = config()) {
  let stripeCurrencies = [],
    bitcoinReady = false;
  if (cfg.stripeEnabled) {
    try {
      stripeCurrencies = await verifiedStripeCurrencies();
    } catch {
      /* Public configuration never advertises an unverified processor. */
    }
  }
  if (cfg.bitcoinEnabled) {
    try {
      await assertBitcoinNetwork();
      const methods = await btcpayRequest(`${storePath()}/payment-methods`);
      bitcoinReady =
        Array.isArray(methods) &&
        methods.some(
          (m) =>
            m.enabled === true &&
            ["BTC", "BTC-CHAIN", "BTC-LightningNetwork"].includes(
              m.paymentMethodId,
            ),
        );
    } catch {
      /* Fail closed. */
    }
  }
  const allowed = Object.keys(cfg.currencies).filter(
    (c) => bitcoinReady || stripeCurrencies.includes(c),
  );
  return {
    ...cfg,
    stripeEnabled: stripeCurrencies.length > 0,
    bitcoinEnabled: bitcoinReady,
    bitcoinMonthlyEnabled: bitcoinReady && cfg.bitcoinMonthlyEnabled,
    stripeCurrencies,
    currencies: Object.fromEntries(allowed.map((c) => [c, cfg.currencies[c]])),
  };
}
