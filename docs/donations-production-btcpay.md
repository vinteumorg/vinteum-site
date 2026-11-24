# Wiring the production BTCPay store

The production instance is `https://pay.vinteum.org`, BTCPay 2.4.7 on mainnet, with one
store named **Donations** (`CACCZjm2Cd9bXcXf3EBxHAKoSAtHCuTQsS5AoYE5MpeM`). Nothing in
this document is code: the application reads everything from its environment.

## 1. Store-scoped API key

Store **Donations** → API Keys → Generate Key.

- Label: `vinteum-site-donations` (scoped, no spending).
- Permissions, scoped to this store only:
  - `btcpay.store.canviewinvoices`
  - `btcpay.store.cancreateinvoice`
  - `btcpay.store.canviewstoresettings`
  - `btcpay.store.canviewofferings`
  - `btcpay.store.canmodifyofferings`
  - `btcpay.store.canmanagesubscribers`
- No wallet, payout or withdrawal permission. The site never moves funds.
- The key is shown once. Hand it over through the private channel, never in chat
  or the repository.

## 2. Webhook

Store **Donations** → Webhooks → Create.

- Payload URL: `https://www.vinteum.org/api/donations/webhooks/btcpay`
- Secret: let BTCPay generate it and copy it.
- Authorized events (specific, not "everything"):
  `InvoiceCreated`, `InvoiceReceivedPayment`, `InvoiceProcessing`, `InvoiceExpired`,
  `InvoiceSettled`, `InvoiceInvalid`, `InvoicePaymentSettled`, `SubscriberCreated`,
  `SubscriberActivated`, `SubscriberPhaseChanged`, `SubscriberDisabled`, `PlanStarted`,
  `PaymentReminder`
- Automatic redelivery: on.

## 3. Monthly offering (only for Bitcoin monthly in production)

Store **Donations** → Offerings → Create, name it for donors (for example
`Vinteum monthly`). The site creates and repairs the per-currency plans inside an
existing offering; it does not create offerings.

Note the offering id from its page. Leave `BTCPAY_MONTHLY_PLANS` empty unless a plan
must be pinned; the site reads the offering, validates money and currency, and only
rewrites the currency of a plan it created itself and that nobody has used.

## 4. Environment

In the environment file used by `vinteum-site.service`:

```text
BTCPAY_ENABLED=true
BTCPAY_URL=https://pay.vinteum.org
BTCPAY_API_KEY=<scoped key>
BTCPAY_STORE_ID=CACCZjm2Cd9bXcXf3EBxHAKoSAtHCuTQsS5AoYE5MpeM
BTCPAY_WEBHOOK_SECRET=<webhook secret>
BTCPAY_TEST_NETWORK=false
BTCPAY_NETWORK_ATTESTATION_FILE=
BTCPAY_MANUAL_PLEDGES=true
BTCPAY_MONTHLY_OFFERING_ID=<offering id>
DONATIONS_ALLOW_LIVE=false
```

`DONATIONS_ALLOW_LIVE=false` keeps the app in a guarded posture: the network assertion
only skips the test attestation when live payment is explicitly authorized, so with the
flag off Bitcoin stays unavailable rather than quietly charging a mainnet store. Bitcoin
cannot be rehearsed on mainnet, so it goes live in one step, after the owner authorizes
real payments.

## 5. Reminders

BTCPay sends the renewal reminder for manual monthly plans itself, from its own SMTP
settings (Server → Email). Use `smtp.resend.com`, port 465, user `resend`, password equal
to the Resend API key, sender `donations@mail.vinteum.org`, then send a test message.
Without this, a Bitcoin monthly donor is never reminded and the plan simply lapses.

## 6. Verify before announcing

1. Restart the service and read `GET /api/donations/config`: `btcpay.enabled` true and
   `btcpay.monthlyEnabled` matching the offering you configured.
2. Send one small real donation of each kind you intend to offer and confirm the
   donation row, the signed webhook delivery and the confirmation e-mail.
3. Only then set `DONATIONS_ENABLED=true` (the page switch) and, when authorized,
   `DONATIONS_ALLOW_LIVE=true`.

Everything here is mainnet: any payment used to verify spends real money.
