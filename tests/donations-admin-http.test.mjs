import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import { scryptSync } from 'node:crypto';
const root = new URL('../src/lib/donations-admin/',import.meta.url);
async function handler() {
  const source = await readFile(new URL('handler.ts',root),'utf8');
  const output = ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText.replaceAll("'./security'",JSON.stringify(new URL('security.ts',root).href));
  return (await import('data:text/javascript;base64,'+Buffer.from(output).toString('base64'))).createAdminHandler;
}
const salt='123456789012345678901234567890ab';
const env={DONATIONS_ADMIN_ORIGIN:'https://vinteum.org',DONATIONS_ADMIN_SESSION_SECRET:'only-a-test-signing-secret'.repeat(3),DONATIONS_ADMIN_USERS:JSON.stringify([{username:'alice',salt,hash:scryptSync('test-password',Buffer.from(salt,'hex'),64).toString('hex')}])};
const req=(path='', method='GET',body, cookie,origin='https://vinteum.org')=>new Request('https://vinteum.org/api/donations/admin'+path,{method,headers:{origin,'content-type':'application/json',...(cookie?{cookie}: {})},...(body?{body:JSON.stringify(body)}:{})});

test('all admin data and actions are denied before authentication without reaching storage',async()=>{
  const create = await handler();
  const app=create({env,list:()=>assert.fail('private read'),moderate:()=>assert.fail('private write'),consumeLogin:()=>assert.fail('unexpected login')});
  for(const r of [req(),req('','POST',{profileId:'x',action:'approve'}),req('/session'),req('/invented')]) {
    const response=await app(r); assert.equal(response.status,401); assert.match(response.headers.get('cache-control'),/no-store/);
  }
});

test('moderation uses the signed actor, minimizes review data, enforces CSRF and supports logout',async()=>{
  const create=await handler();let written;
  const row={id:'e97fbb64-a836-4f6d-854b-a1bcdb0b7f52',name:'Supporter',url:'https://example.org',state:'pending',activity:'active',createdAt:'2026-11-24',donorEmail:'private@example.org',amount:500,providerId:'secret'};
  const app=create({env,consumeLogin:async()=>true,list:async()=>[row],moderate:async input=>{written=input;return row;}});
  const login=await app(req('/login','POST',{username:'alice',password:'test-password'}));const cookie=login.headers.get('set-cookie').split(';')[0];
  const listing=await app(req('','GET',undefined,cookie));assert.equal(listing.status,200);
  const data=await listing.json();assert.equal(data.profiles[0].name,'Supporter');assert.equal(JSON.stringify(data).includes('private'),false);assert.equal(JSON.stringify(data).includes('secret'),false);assert.equal('amount' in data.profiles[0],false);
  const body={profileId:row.id,action:'approve',actor:'mallory',reason:'Reviewed'};
  assert.equal((await app(req('','POST',body,cookie,'https://evil.test'))).status,403);assert.equal(written,undefined);
  assert.equal((await app(req('','POST',body,cookie))).status,200);assert.deepEqual(written,{profileId:row.id,action:'approve',actor:'alice',reason:'Reviewed'});
  assert.equal((await app(req('','POST',{...body,action:'edit'},cookie))).status,400);
  assert.equal((await app(req('','POST',{...body,profileId:'bad-id'},cookie))).status,400);
  const logout=await app(req('/logout','POST',{},cookie));assert.equal(logout.status,200);assert.match(logout.headers.get('set-cookie'),/Max-Age=0/);
});

test('canonical moderation conflicts and missing profiles preserve safe HTTP status without leaking storage errors',async()=>{
  const create=await handler();
  for(const status of [404,409]) {
    const app=create({env,consumeLogin:async()=>true,list:async()=>[],moderate:async()=>{throw Object.assign(new Error('private storage details'),{status});}});
    const login=await app(req('/login','POST',{username:'alice',password:'test-password'}));
    const cookie=login.headers.get('set-cookie').split(';')[0];
    const response=await app(req('','POST',{profileId:'e97fbb64-a836-4f6d-854b-a1bcdb0b7f52',action:'approve'},cookie));
    assert.equal(response.status,status);assert.equal((await response.text()).includes('private'),false);
  }
});

test('login checks origin, reserves persistent limits before KDF and fails closed on storage failure',async()=>{
  const create=await handler(); let calls=0;
  const deps={env,list:async()=>[],moderate:async()=>{},consumeLogin:async()=>{calls++;return true;}};
  const app=create(deps);
  const bad=await app(req('/login','POST',{username:'alice',password:'test-password'},undefined,'https://evil.test'));
  assert.equal(bad.status,403);assert.equal(calls,0);
  const wrong=await app(req('/login','POST',{username:'alice',password:'wrong'}));assert.equal(wrong.status,401);
  const good=await app(req('/login','POST',{username:'alice',password:'test-password'}));assert.equal(good.status,200);assert.equal(calls,2);
  const cookie=good.headers.get('set-cookie');assert.match(cookie,/HttpOnly; Secure; SameSite=Strict/);
  assert.equal(JSON.stringify(await good.json()).includes('test-password'),false);
  const me=await app(req('/session','GET',undefined,cookie.split(';')[0]));assert.equal(me.status,200);assert.deepEqual(await me.json(),{username:'alice'});
  const blocked=create({...deps,consumeLogin:async()=>false});assert.equal((await blocked(req('/login','POST',{username:'alice',password:'test-password'}))).status,429);
  const down=create({...deps,consumeLogin:async()=>{throw new Error('secret DB connection');}});const unavailable=await down(req('/login','POST',{username:'alice',password:'test-password'}));assert.equal(unavailable.status,503);assert.equal((await unavailable.text()).includes('secret'),false);
});
