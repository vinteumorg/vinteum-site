# Donations: architecture and controlled rollout

## Release boundary

This feature is not permission to activate live payments. In production, keep `DONATIONS_ENABLED=false` and `DONATIONS_ALLOW_LIVE=false` until the processor integration checklist has been exercised with real **test** accounts and an owner explicitly approves the production rollout. An authorized isolated sandbox may enable donation intake with test credentials and a verified Bitcoin test network while keeping `DONATIONS_ALLOW_LIVE=false`. Pushing or merging this repository's `main` branch deploys the website; review and merge are separate from permission to process money.

- `/donate` retains the existing Geyser experience when the server flag is off.
- `/donate/preview` renders the new bilingual interface for review and is marked noindex. It does not fabricate payments when providers are unavailable.
- `/donate/supporters` reads only the approved public projection, never a demo donor roster. The projection requires `state='approved'` **and** `activity='active'`, so a cancelled supporter leaves the wall when the paid period ends, not when the cancellation is requested; the row stays in the database as history.
- `/donate/manage` is the donor's bearer-authorized management interface. Its access link uses a URL fragment, which is removed after reading. Do not put credentials in URL queries.
- `/donate/admin` and `/api/donations/admin` require named administrator authentication for private records and moderation. The prototype's public `#review` demo is not an administration API.

## Design integration

The supplied designer prototype is the visual and interaction reference. The implementation lives in the existing Next.js App Router project and uses its Navbar, Footer, fonts and `LanguageContext`. Donation copy is under the `donations` namespace in both locale JSON files. It does not add a second frontend framework or a separate donor application.

The amount, details and payment stages preserve draft state while navigating. English defaults to USD and Portuguese to BRL unless the donor explicitly chooses a currency. Newsletter and public recognition are independent, initially unchecked consents. Recognition is available only for monthly donors. Direct Bitcoin creates a fresh processor invoice without collecting donor identity; it is not a promise of absolute anonymity.

## Data ownership

Stripe and BTCPay remain authoritative for processor transactions, customer/subscription state and payment settlement. The site never receives card numbers, CVCs or wallet credentials. Stripe's official embedded component handles sensitive card entry; BTCPay's native checkout handles actual on-chain and Lightning destinations, QR codes and rail selection.

A dedicated PostgreSQL database stores only the records the site itself needs:

- Internal donation identifiers, processor identifiers and state required for reconciliation.
- Validated amount/currency and consent version/time.
- Optional donor contact information and comments supplied by the donor.
- Optional public profile, review state, image and active/past classification.
- Hashed bearer credentials, authenticated-encryption-protected capability replay, webhook deduplication records and persistent abuse limits.
- Transactional email outbox and moderation audit entries.

There is no file-based, localStorage or process-memory payment ledger. Browser state is a draft, not proof that a donation was paid. A success screen and the “I've sent the payment” action cannot settle a payment. Processor confirmation is required.

The schema is in `migrations/001_donations.sql`. Use a separate database and least-privilege application role; do not share tables or credentials with Outline, invoice processing or BTCPay. Back up and restore-test the database before production.

## Runtime dependencies

- Existing Next.js/React/TypeScript/Tailwind/pnpm runtime.
- Official Stripe server and browser SDKs.
- PostgreSQL through `pg`.
- Sharp for decoding and re-encoding uploaded avatars, with a persistent PostgreSQL image store. No image hosting subscription is required.
- Existing Resend account for transactional mail. `DONATIONS_FROM_EMAIL` sets the donation sender (`donations@mail.vinteum.org` in production) and falls back to `RESEND_FROM_EMAIL`, which stays the contact-form sender.
- Existing Ghost membership store for explicitly opted-in newsletter enrollment. This is not a new subscriber database.
- A scheduler invoking the authenticated donations jobs endpoint for reconciliation and outbox delivery. Nothing schedules it in staging today: webhooks are the primary path and a missed webhook is only repaired when something calls the endpoint.

`deploy/donations/` carries the pieces that live outside the repository: `run-jobs.sh`, the systemd unit and timer, and `install-jobs-timer.sh`, which installs them and runs one tick as a smoke test. On a host that already has the app environment file:

```bash
sudo ./deploy/donations/install-jobs-timer.sh /path/to/app.env https://www.vinteum.org
```

The timer runs every fifteen minutes. It is not what removes a cancelled supporter from the wall: webhooks do that at the event. The timer covers two slower paths, outbox delivery and repairing a webhook that never arrived, so a shorter interval buys nothing except faster receipts.

No new paid SaaS contract is required by this design. A production database still needs capacity, backups, monitoring and an assigned operator; allocating those resources is a rollout prerequisite, not a consequence of merging the code.

## Configuration

Start with `.env.donations.example`. All values are server-side unless a public publishable key is deliberately returned by the public configuration endpoint. Never expose `STRIPE_SECRET_KEY`, webhook secrets, BTCPay API keys, database credentials, administrator password hashes or signing keys through `NEXT_PUBLIC_*` variables.

`DONATIONS_ORIGIN` must exactly match the browser-visible origin. Monetary configuration is in integer minor units: `2500` means USD 25.00 or BRL 25.00, depending on the named currency. The HTTP frontend adapter accepts major units and normalizes them before applying server-side amount/currency limits. A symbol displayed in the browser does not choose the processor currency.

Keep `DONATIONS_TRUST_PROXY=false` unless the deployment sits behind a trusted reverse proxy that **replaces** `X-Real-IP`, blocks direct application access and sets `DONATIONS_PROXY_IP_HEADER=x-real-ip`. Arbitrary `X-Forwarded-For` is never trusted by the donations limiter. Do not log request bodies or Authorization/idempotency headers. Status polling sends its capability in `Authorization: Bearer`, not in the URL; query-token requests are rejected.

## Stripe setup

1. Use a Stripe test account or sandbox first. Configure matching test secret and publishable keys and a dedicated webhook signing secret.
2. Verify the account's actual supported presentment currencies, recurring-payment capabilities and available card/wallet methods. Do not infer USD/BRL, Pix or recurring Pix availability from the UI. No Pix capability is assumed.
3. Enable and configure the hosted customer portal for payment-method updates and cancellation before exposing a portal link.
4. Register the public HTTPS webhook target `/api/donations/webhooks/stripe`; forward the **raw** request body and `Stripe-Signature` unchanged.
5. Exercise signed duplicate and reordered events, subscription renewal failure and cancellation. Do not use a checkout redirect as payment evidence.
6. Configure processor email receipts and verify the site's transactional confirmations separately. A payment acknowledgement is not a tax-deductibility statement or fiscal receipt.

The endpoint handles checkout completion/expiration/asynchronous results, subscription lifecycle changes, invoice payment/failure and refund/dispute events. The installed Stripe SDK 23.2.0 pins API `2026-11-18.endive`; configure webhook payloads consistently. Its embedded Checkout mode is `embedded_page` (the older `embedded` string is not used). Set `STRIPE_DONATION_CURRENCIES` to an explicitly verified allowlist; it is intersected with account/country checks rather than treating both UI symbols as payment capability. The exact accepted events are enumerated in `src/lib/donations/webhooks.mjs`; configure against that source and the pinned Stripe SDK/API version rather than relying on an old dashboard screenshot.

In a sandbox, `charges_enabled` can remain false while genuine test payments succeed. Only an explicitly configured `sk_test_` key may bypass that live-account activation check; the operator's tested currency allowlist and country support checks still apply. Live keys continue to require account activation. A successful direct API test, an embedded form rendering, and a completed website payment are separate evidence and must be reported separately.

## BTCPay setup

1. Provision a separate test-network server/store with functioning on-chain and Lightning backends for integration QA. Do not turn a mainnet server into a “test” server by setting a frontend flag.
2. Use a store-scoped Greenfield API key with only the invoice, subscription/portal and read permissions required by the implemented endpoints. Do not configure withdrawal, payout or wallet-spending privileges.
3. Register `/api/donations/webhooks/btcpay`, subscribe to the relevant invoice and native subscriber events, and configure its HMAC secret. Preserve the raw request body and `BTCPay-Sig` header.
4. Confirm the public processor URL, store payment methods, exchange-rate support for the selected fiat amount and native checkout URL. Never copy the prototype's static Bitcoin address or Lightning invoice.
5. For monthly Bitcoin, configure `BTCPAY_MONTHLY_OFFERING_ID` for a native offering and test its subscriber portal and reminder delivery. Custom validated amounts create/reuse a plan under a database lock; ambiguous creation is reconciled by plan metadata rather than blindly repeated. `BTCPAY_MONTHLY_PLANS` optionally maps exact existing plans. Each payment is manual, not an automatic debit. The backend verifies native plan currency, price, monthly interval, renewal, zero trial and disabled optimistic activation.
6. Verify expiry, partial payment, late payment, on-chain confirmation and settlement on the actual configured server. Refreshing status is not settlement.

The native subscription adapter is validated against BTCPay **2.4.7** schemas. Plan discovery reads the offering's embedded plans; that version has no GET plans-collection route. Its plan POST can prefer the store's default currency over the requested currency. The adapter repairs only a uniquely metadata-owned, unused plan using a currency-only PUT followed by an independent GET and exact validation. Configured human plans and ready registry plans are never silently rewritten. A mainnet installation must not be used for test payments. `BTCPAY_TEST_NETWORK=true` also requires `BTCPAY_NETWORK_ATTESTATION_FILE`: private operator-verified deployment/RPC evidence bound to the configured origin, store and server version, with a verification timestamp less than 24 hours old. The 2.4.7 server-info response does not itself attest the Bitcoin network. This control requires an operator to refresh actual test-network evidence; it is not a claim of automatic live network detection. Upgrading BTCPay requires schema revalidation.

## Recognition policy

A monthly donor must explicitly opt in; the initial payment must be confirmed; an authorized administrator must then approve the profile. These checks apply on the server, not just in the review UI. Public output contains only the approved display name/pseudonym, optional processed avatar, validated external link and support classification, never a donor email or donation amount.

The simple display policy preserves an approved profile as **past support** when processor state says the monthly relationship is no longer active. It does not silently erase historical support. A donor's consent withdrawal removes the public profile immediately, regardless of payment history. Profile edits return through review before publication. Administrators can also reject or remove profiles, with actor/time/action audit records.

Images are uploaded as bytes rather than fetched from arbitrary external URLs. The backend validates file size, actual decodable image format and dimensions, re-encodes the result, and only serves approved avatars. Public profile links are validated HTTPS links; HTML is rendered as text rather than injected.

## Administrator operations

Configure a distinct named account per reviewer, using the scrypt salt/hash format supported by the authentication module. Generate credentials locally with `scripts/donations-admin-user.mjs`; do not paste administrator plaintext passwords into chat, command arguments or the repository. Merge new entries into `DONATIONS_ADMIN_USERS` without discarding other reviewers. Configure a strong independent `DONATIONS_ADMIN_SESSION_SECRET` and an exact HTTPS `DONATIONS_ADMIN_ORIGIN`. Detailed provisioning and revocation instructions are in `src/lib/donations-admin/README.md`.

Sessions are signed, expire, use Secure/HttpOnly/SameSite cookies and are checked server-side. Removing/changing a configured user's credentials invalidates that account's old session. An administrator's identity comes from the session, never the submitted action body. Review pending profiles only after login; approve, reject or remove using the protected controls. Never grant public access to a demo `#review` screen as a substitute.

## E-mail and jobs

Use a stable random `DONATIONS_TOKEN_SECRET` of at least 32 characters, stored and backed up outside the repository. It encrypts checkout replay and management capabilities with AES-GCM. Losing or casually replacing it prevents recovery of existing private links; key rotation needs a migration. A UUIDv4 checkout idempotency key also acts as an unguessable replay capability and must not be logged.

The durable outbox separates payment/webhook transactions from delivery. Schedule `POST /api/donations/jobs` with `Authorization: Bearer <DONATIONS_CRON_SECRET>` from a trusted scheduler. Use a secret manager or private environment file; do not put the token in a cron command URL, browser link or repository. Verify job execution, retry behavior and failed-delivery monitoring before production. A successful form submission means acceptance by the backend/outbox, not proof that the recipient's inbox received an email.

Transactional acknowledgements, recognition review notices and cancellation notices are distinct from newsletter enrollment. Newsletter jobs use the existing Ghost membership store and preserve existing subscription choices; a donation without explicit newsletter consent does not enqueue marketing enrollment. Native manual Bitcoin reminders must be configured and verified with BTCPay's actual email settings.

## Privacy and retention

- Do not collect card data, identity documents, bank details or a research designation in this general-use form.
- Recognition is optional and separately revocable. A pseudonym is acceptable.
- Financial/payment details are not public supporter-card fields.
- Donation/manage/admin events are suppressed from the existing analytics collector, including sensitive referrers after client-side navigation.
- Restrict database, backups and environment access to authorized operators. Moderation credentials do not grant direct database or processor access.
- Requests for access, correction or deletion should go to Vinteum through the existing contact channel. Verify the requester's authority before changing private records. Public removal via the authenticated donor link is not a deletion of legally required processor/accounting records.
- **Production gate:** approve a concrete retention schedule for donor contact data, failed/abandoned checkouts, webhook/audit metadata, images and backups with the organization's privacy/accounting owners. No fiscal retention period or tax status is invented here. Until that decision, do not enable an irreversible automatic purge of paid records.
- Document what is deleted in the site and what remains in Stripe, BTCPay, email delivery logs and backups. Removing one public profile does not retract recipients' copies or erase processor records.

This is an operational design, not a legal opinion or a claim that LGPD compliance has been certified.

## Activation checklist

- [ ] Review the current PR and its security/test findings.
- [ ] Approve the exact designer implementation on desktop, tablet and mobile, including keyboard navigation and PT/EN.
- [ ] Provision the production PostgreSQL role/database, migrations, backups and restore test.
- [ ] Install named administrator credentials, verify HTTPS login and review auditing.
- [ ] Configure actual Stripe/BTCPay test accounts and run every external integration case in the acceptance report.
- [ ] Verify USD/BRL and available methods against the actual Stripe account; verify BTCPay payment rails and rates.
- [ ] Verify monthly renewals/failure/cancellation and manual Bitcoin reminders/portal.
- [ ] Verify outbox delivery, newsletter consent and major-gift inbox receipt.
- [ ] Verify signed webhooks, duplicate/reordered deliveries, reconciliation and alerts under real deployment proxy headers.
- [ ] Approve privacy text, retention and any fiscal/receipt wording with the responsible people.
- [ ] Obtain explicit owner authorization to enable live payments and replace Geyser.
- [ ] Configure live credentials only on the authorized production host, then set the separate live gate and rollout flag.
- [ ] Run a controlled authorized production smoke test and verify processor records, database state and email delivery.
- [ ] Keep a rollback path: disable the new donation flag to restore Geyser; do not delete payment records, stop necessary reconciliation or discard webhook events during rollback.

## Verification evidence

Disabling `DONATIONS_ENABLED` stops new checkout and major-gift intake, not existing donor management, authenticated jobs or signed webhook processing. Retain the database, origins, encryption key and processor secrets during rollback. Reconciliation advances/leases attempts before provider network calls and backs off failures so a poisoned batch cannot starve later donations. Pending and monthly records are checked frequently; recent terminal one-offs are swept for up to 90 days to catch refunds and late settlement. Older records require an explicit operator backfill.

The final acceptance report must distinguish model/unit tests, actual PostgreSQL integration, signed webhook fixtures, browser interactions and real Stripe/BTCPay transactions. Mocked provider responses are not processor tests. Build/lint success is not a completed payment. Unavailable credentials or a store that has not been provisioned remain explicit rollout blockers.
