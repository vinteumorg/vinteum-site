
import test from 'node:test';
import assert from 'node:assert/strict';

test('the public wall only lists supporters whose monthly support is still active', async () => {
  const { PUBLIC_SUPPORTERS_SQL } = await import('../src/lib/donations/service.mjs');
  const sql = PUBLIC_SUPPORTERS_SQL.replace(/\s+/g, ' ');
  assert.match(sql, /p\.state='approved'/);
  assert.match(sql, /d\.public_consent=true/);
  assert.match(sql, /d\.frequency='monthly'/);
  assert.match(sql, /p\.activity='active'/);
});

test('a profile whose paid period ended drops off the wall without losing its history', async () => {
  // activity is what the reconciliation writes: active while the recurring
  // support is paid and running, past once the paid period ends.
  const { supporterActivity } = await import('../src/lib/donations/service.mjs');
  assert.equal(supporterActivity({ recurringStatus: 'active', status: 'paid' }), 'active');
  assert.equal(supporterActivity({ recurringStatus: 'active', status: 'paid', cancellationScheduled: true }), 'active');
  assert.equal(supporterActivity({ recurringStatus: 'cancelled', status: 'paid' }), 'past');
  assert.equal(supporterActivity({ recurringStatus: 'failed', status: 'failed' }), 'past');
});

test('BRL suggests starting at 50 while USD keeps its own ladder', async () => {
  const { config } = await import('../src/lib/donations/core.mjs');
  const env = {
    DONATIONS_ENABLED: 'true',
    DONATIONS_ORIGIN: 'https://example.org',
    DONATIONS_TOKEN_SECRET: 'x'.repeat(40),
    DATABASE_URL: 'postgres://user:pass@127.0.0.1:5432/db',
  };
  const cfg = config(env);
  assert.deepEqual(cfg.currencies.BRL.suggested.once.map((n) => n / 100), [50, 100, 250, 500]);
  assert.deepEqual(cfg.currencies.BRL.suggested.monthly.map((n) => n / 100), [50, 100, 250, 500]);
  assert.deepEqual(cfg.currencies.USD.suggested.once.map((n) => n / 100), [25, 50, 100, 250]);
  const override = config({ ...env, DONATIONS_BRL_ONCE_SUGGESTED: '10000,20000' });
  assert.deepEqual(override.currencies.BRL.suggested.once.map((n) => n / 100), [100, 200]);
});

test('a missing e-mail transport parks the message instead of burning its attempts', async () => {
  const { isTransportGap } = await import('../src/lib/donations/jobs.mjs');
  assert.equal(isTransportGap(new Error('Email unavailable')), true);
  assert.equal(isTransportGap(new Error('Newsletter unavailable')), true);
  assert.equal(isTransportGap(new Error('Email delivery failed')), false);
  assert.equal(isTransportGap(new Error('Invalid management capability')), false);
});

test('donation mail keeps its own sender and falls back to the site sender', async () => {
  const { mailFrom } = await import('../src/lib/donations/jobs.mjs');
  assert.equal(mailFrom({ RESEND_FROM_EMAIL: 'site@vinteum.org', DONATIONS_FROM_EMAIL: 'donations@mail.vinteum.org' }), 'donations@mail.vinteum.org');
  assert.equal(mailFrom({ RESEND_FROM_EMAIL: 'site@vinteum.org' }), 'site@vinteum.org');
  assert.equal(mailFrom({}), '');
});
