"use client";

import { useMemo } from "react";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

/** Card data is collected exclusively by the official Stripe-hosted component. */
export function StripeDonationCheckout({
  publishableKey,
  clientSecret,
  onComplete,
}: {
  publishableKey: string;
  clientSecret: string;
  onComplete: () => void;
}) {
  const stripe = useMemo(() => loadStripe(publishableKey), [publishableKey]);
  return (
    <EmbeddedCheckoutProvider
      stripe={stripe}
      options={{ clientSecret, onComplete }}
    >
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
}
