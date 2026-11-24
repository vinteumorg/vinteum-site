# Donations administration

## Server configuration

- `DATABASE_URL` (or `DONATIONS_DATABASE_URL`): migrated persistent PostgreSQL database. The login limiter fails closed when storage is unavailable.
- `DONATIONS_ADMIN_ORIGIN`: exact public **HTTPS origin**, for example `https://vinteum.org`, without a trailing slash. This is independent of the internal HTTP address Next listens on behind the TLS proxy.
- `DONATIONS_ADMIN_SESSION_SECRET`: independent random secret, at least 32 bytes. Generate using `node -p "require('node:crypto').randomBytes(48).toString('hex')"`; keep it in server secret storage.
- `DONATIONS_ADMIN_USERS`: JSON array of explicitly authorized named users, each `{ "username": "…", "salt": "…", "hash": "…" }`. No default account/password exists. `salt` is 16–64 random bytes encoded as lowercase hex. `hash` is a 64-byte scrypt result encoded as lowercase hex, derived using Node's default scrypt parameters and the salt decoded from hex. Reject malformed or duplicate account definitions rather than partially enabling them.

Generate a per-user record with the stdlib-only helper:

```sh
node scripts/donations-admin-user.mjs alice --password-fd 3 3</secure/password-file
```

The input must be a non-TTY UTF-8 descriptor containing a unique 16–256 character password. FD 0 also supports piping directly from a password manager. One final LF/CRLF is ignored; embedded line breaks and NUL are rejected. The helper generates a fresh random 32-byte salt and a matching 64-byte scrypt hash and emits **only one JSON entry**. Merge this entry into the existing `DONATIONS_ADMIN_USERS` array; do not overwrite the array and accidentally revoke other administrators. Protect any input file (mode 0600) and remove it when no longer needed. Do not type the password in command arguments, shell history, or an environment variable. Only the resulting salt/hash record belongs in the app configuration. Provision credentials to the named administrator through an approved secret channel. These variables must never use the `NEXT_PUBLIC_` prefix.

## Operation

Open `/donate/admin` on the configured HTTPS origin. Sign in; pending profiles load only through the authenticated no-store API. Review the submitted name and external link before approval. Links are untrusted submissions, not an endorsement. Optional notes must not contain financial or unnecessary personal information. Approve/reject pending profiles; approved profiles can be removed. The backend revalidates paid initial donation, monthly frequency, explicit consent and profile state inside its transaction. Audit identity comes from the signed session, never the posted actor field. Audit rows are stored by the canonical donations backend, not a second implementation here.

Sessions use a 30-minute `__Host-vinteum-admin` cookie: HttpOnly, Secure, SameSite=Strict, Path=/, no Domain. Logout clears the browser cookie; it is not a server-side revocation list for stolen copies. Remove the allowlisted user or change their salt/hash to revoke all their existing sessions immediately, or rotate the session secret to revoke every session. Protect environment/configuration access as privileged access.

Every mutation, including login/logout, requires the configured exact Origin and rejects cross-site Fetch Metadata. It never trusts `X-Forwarded-For`, `X-Forwarded-Host` or `X-Forwarded-Proto` for authentication or login-rate buckets. The proxy must terminate HTTPS and overwrite forwarded headers, and the internal app port must not be publicly accessible. The application intentionally compares Origin with its explicit public configuration, not Next's internal bind URL, so normal TLS reverse proxying works without trusting client-provided host headers.

Persistent atomic limits: five login attempts per exact username per 15 minutes and 100 total attempts per 15 minutes, including unknown users. IP-header changes cannot reset these counters. Global limiting can temporarily block administrators under abuse; additional network-edge controls are recommended. No process-memory or missing-database bypass exists.

## Tests and boundaries

With the isolated test database configured, run `node --test tests/donations-admin.test.mjs tests/donations-admin-http.test.mjs tests/donations-admin-db.test.mjs tests/donations-admin-ui.test.mjs`. The DB test explicitly skips without configuration.

The opt-in real Next HTTP test is `tests/donations-admin-next.test.mjs`. Set `DONATIONS_ADMIN_INTEGRATION=true`, `DONATIONS_ADMIN_TEST_URL` (transport URL), `DONATIONS_ADMIN_TEST_ORIGIN` (configured public HTTPS origin), `DONATIONS_ADMIN_TEST_USERNAME` and `DONATIONS_ADMIN_TEST_PASSWORD`. The app and test process must use the same isolated database; the server must be configured with the corresponding test-only hashed account. This test creates and cleans up synthetic database fixtures, verifies signed actors/audit readback and spoofs XFF to prove it cannot evade the account limiter. It creates no processor payments. Do not point it at production. Its manual Cookie/Origin HTTP probes verify route behavior, not browser enforcement of Secure/SameSite cookies or browser accessibility.

Production browser interaction and rollout checks remain separate from these HTTP/component tests. No production credentials, payments or activation are supplied by this implementation.
