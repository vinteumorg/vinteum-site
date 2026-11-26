import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';

const configured=Boolean(process.env.DONATIONS_DATABASE_URL || process.env.DATABASE_URL);
test('persistent administrator login limit is shared across instances and denies after five attempts', {skip:!configured}, async()=>{
  const {createLoginLimiter}=await import('../src/lib/donations-admin/rate.mjs');
  const {rateLimit,migrate,pool}=await import('../src/lib/donations/db.mjs');
  await migrate();
  const env={DONATIONS_ADMIN_SESSION_SECRET:randomUUID()+randomUUID()};
  const a=createLoginLimiter(rateLimit,env),b=createLoginLimiter(rateLimit,env);
  const username='test-'+randomUUID();
  for(let i=0;i<5;i++)assert.equal(await (i%2?a:b)(username),true);
  assert.equal(await b(username),false);
  assert.equal(await a(username),false);
  const missing=createLoginLimiter(async()=>{throw new Error('database offline');},env);
  await assert.rejects(missing('alice'),/offline/);
  await assert.rejects(createLoginLimiter(rateLimit,{})('alice'),/configured/i);
  await pool().end();
});
