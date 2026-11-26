import test from "node:test";
import assert from "node:assert/strict";
import { verifiedStripeCurrencies } from "../src/lib/donations/readiness.mjs";

test("a verified sandbox can process payments even when the account activation flag is false", async () => {
  process.env.STRIPE_DONATION_CURRENCIES = "USD,BRL";
  const stripe = {
    accounts: {
      retrieve: async () => ({
        id: "acct_test",
        country: "BR",
        charges_enabled: false,
      }),
    },
    countrySpecs: {
      retrieve: async () => ({ supported_payment_currencies: ["brl", "usd"] }),
    },
  };
  const env = {
    STRIPE_SECRET_KEY: "sk_test_fixture",
    STRIPE_DONATION_CURRENCIES: "USD,BRL",
    STRIPE_EXPECTED_ACCOUNT_ID: "acct_test",
  };
  assert.deepEqual(await verifiedStripeCurrencies(stripe, env), ["USD", "BRL"]);
  await assert.rejects(() =>
    verifiedStripeCurrencies(stripe, {
      ...env,
      STRIPE_SECRET_KEY: "sk_live_fixture",
    }),
  );
});
test("Stripe currency availability checks live account charges and supported presentment intersection", async () => {
  process.env.STRIPE_DONATION_CURRENCIES = "USD,BRL";
  const stripe = {
    accounts: {
      retrieve: async () => ({ country: "US", charges_enabled: true }),
    },
    countrySpecs: {
      retrieve: async () => ({ supported_payment_currencies: ["usd"] }),
    },
  };
  assert.deepEqual(await verifiedStripeCurrencies(stripe), ["USD"]);
  stripe.accounts.retrieve = async () => ({
    country: "US",
    charges_enabled: false,
  });
  await assert.rejects(() => verifiedStripeCurrencies(stripe));
});
