-- Self-hosted PostgreSQL, no card data. All money integer minor units.
CREATE TABLE IF NOT EXISTS donations (
 id uuid PRIMARY KEY, idempotency_key uuid NOT NULL UNIQUE, request_hash text NOT NULL,
 provider text NOT NULL CHECK(provider IN ('stripe','btcpay')), frequency text NOT NULL CHECK(frequency IN ('once','monthly')),
 currency text NOT NULL CHECK(currency IN ('USD','BRL')), amount bigint NOT NULL CHECK(amount>0), locale text NOT NULL,
 donor_email text, donor_name text, organization text, comment text,
 newsletter_consent boolean NOT NULL DEFAULT false, public_consent boolean NOT NULL DEFAULT false,
 consent_version text NOT NULL DEFAULT 'donations-v1', consent_at timestamptz NOT NULL DEFAULT now(),
 status_token_hash text NOT NULL, manage_token_hash text NOT NULL,
 status text NOT NULL DEFAULT 'pending', recurring_status text,
 creation_state text NOT NULL DEFAULT 'new', provider_id text, subscription_id text, customer_id text, offering_id text, invoice_id text,
 checkout_url text, paid_at timestamptz, last_checked_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK(NOT public_consent OR frequency='monthly'), UNIQUE(provider,provider_id)
);
ALTER TABLE donations ADD COLUMN IF NOT EXISTS capability_ciphertext text;
ALTER TABLE donations ADD COLUMN IF NOT EXISTS checkout_ciphertext text;
ALTER TABLE donations ADD COLUMN IF NOT EXISTS plan_id text;
ALTER TABLE donations ADD COLUMN IF NOT EXISTS reconcile_after timestamptz NOT NULL DEFAULT now();
ALTER TABLE donations ADD COLUMN IF NOT EXISTS last_attempt_at timestamptz;
ALTER TABLE donations ADD COLUMN IF NOT EXISTS cancellation_scheduled boolean NOT NULL DEFAULT false;
CREATE TABLE IF NOT EXISTS donation_btcpay_plans (
 registry_key text PRIMARY KEY, offering_id text NOT NULL, currency text NOT NULL, amount bigint NOT NULL,
 plan_id text, state text NOT NULL DEFAULT 'creating', created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS donations_subscription ON donations(subscription_id);
CREATE TABLE IF NOT EXISTS donation_avatars (id uuid PRIMARY KEY, donation_id uuid NOT NULL REFERENCES donations(id) ON DELETE CASCADE, data bytea NOT NULL CHECK(octet_length(data)<=524288), created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS donation_profiles (
 id uuid PRIMARY KEY, donation_id uuid NOT NULL UNIQUE REFERENCES donations(id) ON DELETE CASCADE,
 name text NOT NULL, url text, kind text NOT NULL DEFAULT 'person', avatar_id uuid REFERENCES donation_avatars(id),
 state text NOT NULL DEFAULT 'awaiting_payment' CHECK(state IN ('awaiting_payment','pending','approved','rejected','removed')),
 activity text NOT NULL DEFAULT 'active' CHECK(activity IN ('active','past')),
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS donation_audit(id bigserial PRIMARY KEY, profile_id uuid, actor text NOT NULL, action text NOT NULL, reason text, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS donation_webhook_events (provider text NOT NULL, event_id text NOT NULL, donation_id uuid REFERENCES donations(id), created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(provider,event_id));
CREATE TABLE IF NOT EXISTS donation_rate_limits (key text PRIMARY KEY, hits integer NOT NULL, window_start timestamptz NOT NULL);
CREATE TABLE IF NOT EXISTS donation_outbox (
 id bigserial PRIMARY KEY, dedupe_key text NOT NULL UNIQUE, donation_id uuid REFERENCES donations(id) ON DELETE CASCADE,
 kind text NOT NULL, payload jsonb NOT NULL, attempts integer NOT NULL DEFAULT 0,
 available_at timestamptz NOT NULL DEFAULT now(), sent_at timestamptz, lease_until timestamptz, last_error text, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS donation_outbox_pending ON donation_outbox(available_at) WHERE sent_at IS NULL;
CREATE TABLE IF NOT EXISTS donation_major_gifts(id uuid PRIMARY KEY, request_hash text NOT NULL UNIQUE, created_at timestamptz NOT NULL DEFAULT now());
