import test from 'node:test';
import assert from 'node:assert/strict';
import { scryptSync } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const path = new URL('../src/lib/donations-admin/security.ts', import.meta.url);
async function security() { return import(path.href); }
const salt = 'c72c8aab4e5d190e1020304050607080';
const hash = scryptSync('test-only-password', Buffer.from(salt,'hex'), 64).toString('hex');
const env = { DONATIONS_ADMIN_USERS: JSON.stringify([{username:'alice',salt,hash}]), DONATIONS_ADMIN_SESSION_SECRET:'test-only-session-key-'.repeat(3), DONATIONS_ADMIN_ORIGIN:'https://vinteum.org' };

test('admin page reads the secure server cookie, is dynamic and never passes review records',async()=>{
  const source=await readFile(new URL('../src/app/donate/admin/page.tsx',import.meta.url),'utf8');
  assert.match(source,/validateSession/);assert.match(source,/cookies/);assert.match(source,/force-dynamic/);assert.match(source,/index: false/);assert.equal(source.includes('adminListProfiles'),false);
});

test('named allowlisted administrators verify scrypt hashes without accepting unknown users', async () => {
  const s = await security();
  assert.equal(await s.authenticate('alice','test-only-password',env),'alice');
  assert.equal(await s.authenticate('alice','wrong',env),null);
  assert.equal(await s.authenticate('mallory','test-only-password',env),null);
  assert.equal(await s.authenticate('alice','test-only-password',{}),null);
});

test('every mutation requires an exact configured Origin, rejects cross-site fetches and bounded JSON', async () => {
  const s = await security();
  const request = (origin, body='{}', extra={}) => new Request('https://vinteum.org/api/donations/admin',{method:'POST',headers:{origin,'content-type':'application/json',...extra},body});
  assert.equal(s.validMutationOrigin(request('https://vinteum.org'),env),true);
  // Next builds Request.url from its internal bind host behind a TLS proxy.
  assert.equal(s.validMutationOrigin(new Request('http://127.0.0.1:3000/api/donations/admin',{method:'POST',headers:{origin:'https://vinteum.org'}}),env),true);
  assert.equal(s.validMutationOrigin(request('https://evil.test','{}',{'x-forwarded-host':'vinteum.org','x-forwarded-proto':'https'}),env),false);
  for (const origin of ['https://evil.test','https://vinteum.org.evil.test','null','https://vinteum.org/']) assert.equal(s.validMutationOrigin(request(origin),env),false);
  assert.equal(s.validMutationOrigin(request('https://vinteum.org','{}',{'sec-fetch-site':'cross-site'}),env),false);
  assert.equal(s.validMutationOrigin(request('https://vinteum.org'),{}),false);
  assert.equal(s.validMutationOrigin(new Request('https://vinteum.org/api/donations/admin',{method:'POST'}),env),false);
  assert.deepEqual(await s.readBoundedJson(request('https://vinteum.org','{"action":"approve"}')),{action:'approve'});
  await assert.rejects(s.readBoundedJson(request('https://vinteum.org','x'.repeat(9000))), /large/i);
  await assert.rejects(s.readBoundedJson(request('https://vinteum.org','[]')), /object/i);
  await assert.rejects(s.readBoundedJson(request('https://vinteum.org','{}',{'content-type':'text/plain'})), /JSON/i);
});
test('sessions expire, reject tampering, and revoke when password hash or allowlist changes', async () => {
  const s = await security();
  const token = s.issueSession('alice',env,1000);
  assert.equal(s.validateSession(token,env,1001)?.username,'alice');
  assert.equal(s.validateSession(token,env,1000 + s.SESSION_SECONDS),null);
  assert.equal(s.validateSession(token+'x',env,1001),null);
  assert.equal(s.validateSession(token,{...env,DONATIONS_ADMIN_USERS:'[]'},1001),null);
  assert.equal(s.validateSession(token,{...env,DONATIONS_ADMIN_USERS:JSON.stringify([{username:'alice',salt,hash:'f'.repeat(128)}])},1001),null);
  assert.equal(s.validateSession(token,env,999),null);
  assert.throws(() => s.issueSession('alice',{...env,DONATIONS_ADMIN_SESSION_SECRET:'short'},1000));
  assert.match(s.sessionCookie(token),/HttpOnly; Secure; SameSite=Strict/);
  assert.match(s.sessionCookie(token),/__Host-vinteum-admin=/);
});
