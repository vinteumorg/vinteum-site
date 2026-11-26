# Donations verification and remaining activation gates

This branch is a reviewable implementation, not an approved production payment rollout. The authorized isolated preview is configured for Stripe sandbox and Bitcoin REGTEST; live payments remain disabled.

## Executed checks

Verified on 2026-11-24:

- Next.js production build passed with all donation API, public, donor-management and administrator routes present.
- Current automated suite: **168 tests passed across 25 files, with zero failures or skips**. This includes a dedicated real PostgreSQL database, the opt-in production-Next administrator HTTP integration and the native plan-currency regressions. External processor/email transports in this automated suite are explicitly mocked; actual processor checks are listed separately below.
- Scoped ESLint, TypeScript and `git diff --check` passed. The earlier full-repository lint run identified existing issues in `BlogPostGrid.tsx:47` and `UpdatesSection.tsx:66`, outside this change.
- Earlier hydrated Chromium review passed 30 desktop/mobile assertions for the shared shell, noindex, currencies, PT/EN, unchecked consents, validation/focus, draft preservation, public-profile preview, unavailable processors, keyboard/dialog behavior, direct Bitcoin privacy text, an empty public wall and fragment-token management. That review did not simulate payment success.
- Real Stripe sandbox API checks in USD and BRL covered successful one-offs, declines, a `requires_action` 3DS result, monthly initial payment, successful renewal, failed renewal and genuine scheduled period-end cancellation. The 3DS challenge itself was not completed. Owned lifecycle-test resources were cleaned up and read back; all returned `livemode` fields were false.
- Actual website-created Stripe Embedded Checkout rendered for USD one-off and BRL monthly modes. Stripe-origin expiration webhooks reached the public endpoint and persisted state; authenticated status, duplicate-event handling and invalid-signature rejection passed. **A rendered or expired checkout is not a completed website payment.**
- Actual website-created Bitcoin invoices were paid over Lightning in USD and on-chain in BRL on the separate REGTEST stack. Processor settlement, signed webhook persistence, database paid state and the browser success screen were verified. The direct BRL path collected no donor contact details or marketing/public-recognition consent.
- Signed BTCPay duplicate fixtures, invalid HMAC and wrong-store rejection passed through public HTTPS without adding duplicate events.
- Separate direct-provider REGTEST checks covered unpaid expiry, partial/late payments, native monthly activation/manual renewal, subscriber portal and suspension/restoration. A native reminder reached isolated SMTP capture; this does not prove external inbox delivery or the website's whole monthly-management flow.
- Website-created monthly Bitcoin in BRL passed initial payment, the unchanged native portal's Pay Now renewal, processor/database active state and cancellation through the management UI's explicit confirmation. The renewal invoice was independently matched through authenticated checkout/customer/plan objects without adding an `orderId` to its metadata. Persisted webhook deliveries returned HTTP 200; browser polling also ran, so exclusive webhook causality is not claimed.
- An actual deployed-module/provider trace verified fresh BRL plan creation: GET offering, POST returning the upstream USD default, currency-only PUT, independent GET returning BRL, and reuse without a second POST. This was not server HTTP wire capture or UI request instrumentation.
- A real-browser regression reproduced an email-receipt promise after a no-email direct Bitcoin donation. The deployed correction passed the same browser check.
- The deployed candidate passed sandbox readiness, compiled HTTP/database routes, matching BuildID, preserved environment/security settings and read-only test-network attestation checks. No processor credentials, private checkout capabilities or session evidence are committed here.

## Reproduction

Use Node 22 and the repository's pnpm lockfile. Load a dedicated private test environment before running:

```sh
pnpm test:donations
pnpm build
```

For actual database coverage, set both `DATABASE_URL` and `DONATIONS_DATABASE_URL` to the isolated test database and configure a stable test-only `DONATIONS_TOKEN_SECRET`. Never point this suite at a preview/customer or production database: fixtures create and remove records. The command does not load a private environment file automatically. For deliberately DB-free tests, set both database variables explicitly to empty strings; omitted variables are not a substitute for that test setup.

The opt-in HTTP harness also requires its own administrator test origin, session secret, test account and application URL. See `src/lib/donations-admin/README.md`. A suite that skips this case is not the complete integration run reported above.

## Not yet verified end to end

- Website → Stripe Embedded Checkout → completed approved/declined/additional-authentication payment → actual signed payment webhook → database → receipt. The approved website checkouts require the manual sandbox checks; direct API results do not close this gate.
- Application handling of an actual website-created Stripe subscription through renewal/failure/cancellation, and donor portal UI, refund/dispute handling and completed 3DS challenge against the configured sandbox.

- External Resend inbox delivery, major-gift receipt and consented Ghost newsletter enrollment. SMTP capture is not external delivery.
- Actual wallet availability across supported browser/device/account combinations.
- Final designer comparison on tablet and a complete assistive-technology/accessibility audit. Checked keyboard/dialog behaviors are not a WCAG certification.

## Configuration and rollout boundary

- Inline Bitcoin monthly, verified end to end on REGTEST: the site created the plan checkout, the panel returned Lightning and on-chain destinations with a QR, that exact invoice was paid from the isolated regtest node, the signed webhook persisted four events, the donation moved to paid with `recurring_status=active`, and the BTCPay subscriber reported `isActive=true` on the BRL plan with a real period end. Evidence: `inline-monthly-e2e-evidence.json`. The earlier monthly run through the native checkout remains the reference for renewal and cancellation, because inline monthly still has no renewal invoice of its own.
- Cancellation timing, verified on the sandbox: `cancel_at_period_end` produced `customer.subscription.updated` and set `cancellation_scheduled=true` while the donation stayed paid and the profile stayed on the wall; ending the subscription produced `customer.subscription.deleted`, which flipped the donation to cancelled and dropped the profile from the public wall (count 2 -> 1) without manual intervention.
The hosted Stripe connector and website runtime are separate credentials/trust boundaries. The sandbox website now has its own privately installed test keys and signed webhook configuration; this is not a production credential installation. Stripe's test customer-portal configuration enables payment-method updates and scheduled cancellation, but a configured portal is not a verified donor portal UI flow.

Bitcoin uses a separate REGTEST store with functioning on-chain and Lightning backends and native subscription/email settings. The existing mainnet instance was not used for test payments. No live processor transaction was created for this branch.

Approve retention/privacy/fiscal wording and operational ownership before production. Obtain explicit owner authorization before enabling live-payment and production rollout flags. Geyser remains available while the production rollout flag is off; existing donor management, webhooks and reconciliation remain operational during rollback.

## Known implementation differences and limits

- Bitcoin uses BTCPay's genuine native checkout in a secure new tab instead of reproducing the prototype's inline fake QR/rail selector. No static prototype invoice or address is used. An in-site native modal remains a possible later UX improvement.
- Native schema support is pinned to BTCPay 2.4.7. Test-network deployment evidence expires after 24 hours and requires operator refresh from actual deployment/RPC evidence.
- The application's Bitcoin invoice pointer retains the initial invoice, not a complete renewal ledger. BTCPay remains authoritative for the distinct renewal invoices and subscriber history.
- Reconciliation sweeps recent terminal one-offs for 90 days; older backfills need an operator.
- Public-consent withdrawal is implemented. Complete privacy erasure, capability-key rotation tooling and legally approved retention automation are not implemented.
- Administrator logout clears the cookie; a copied session token expires within 30 minutes or on credential/allowlist/signing-key rotation, not through a per-token revocation database.
