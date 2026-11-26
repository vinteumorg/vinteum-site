import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import { issueSession, SESSION_COOKIE } from '../src/lib/donations-admin/security.ts';
const root = new URL('../src/lib/', import.meta.url);
const uuid = 'e97fbb64-a836-4f6d-854b-a1bcdb0b7f52';
const env = {DONATIONS_ADMIN_SESSION_SECRET:'test-only-key-'.repeat(5), DONATIONS_ADMIN_USERS:JSON.stringify([{username:'alice',salt:'12'.repeat(16),hash:'34'.repeat(64)}])};
const cookie = SESSION_COOKIE+'='+issueSession('alice',env);
const req = (path='', auth=true) => new Request('https://vinteum.org/api/donations/admin'+path,{headers:auth?{cookie}:{}});
async function handler(deps={}) {
  const source = await readFile(new URL('donations-admin/handler.ts',root),'utf8');
  const output = ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText.replaceAll("'./security'",JSON.stringify(new URL('donations-admin/security.ts',root).href));
  const {createAdminHandler} = await import('data:text/javascript;base64,'+Buffer.from(output).toString('base64'));
  return createAdminHandler({env,consumeLogin:async()=>true,list:async()=>[],moderate:async()=>{},...deps});
}
async function service(query) {
  const source = (await readFile(new URL('donations/admin.mjs',root),'utf8'))
    .replace('import { pool, transaction } from "./db.mjs";', 'const pool = () => globalThis.__reviewDetailsDb; const transaction = fn => fn(pool());')
    .replace('"./core.mjs"',JSON.stringify(new URL('donations/core.mjs',root).href));
  globalThis.__reviewDetailsDb={query};
  return import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
}

test('protected avatar preview returns original raster bytes, MIME and private security headers',async()=>{
  // Valid 1x1 PNG; service storage has already decoded/re-encoded uploaded images.
  const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl2nWQAAAAASUVORK5CYII=','base64');
  let calls=0;
  const app=await handler({getAvatar:async id=>{assert.equal(id,uuid);calls++;return png;}});
  const path=`/profiles/${uuid}/avatar`;
  assert.equal((await app(req(path,false))).status,401);assert.equal(calls,0);
  const response=await app(req(path));assert.equal(response.status,200);assert.equal(calls,1);
  assert.deepEqual(Buffer.from(await response.arrayBuffer()),png);
  assert.equal(response.headers.get('content-type'),'image/png');
  assert.match(response.headers.get('cache-control'),/private.*no-store/);
  assert.equal(response.headers.get('x-content-type-options'),'nosniff');
  assert.equal(response.headers.get('vary'),'Cookie');assert.equal(response.headers.get('location'),null);
});

test('admin avatar lookup binds exact profile and donor ownership without requiring public approval',async()=>{
  const image=Buffer.from('stored sanitized bytes');let calls=0;
  const admin=await service(async(sql,params)=>{
    calls++;assert.match(sql,/SELECT a\.data/);assert.match(sql,/p\.avatar_id\s*=\s*a\.id|a\.id\s*=\s*p\.avatar_id/);
    assert.match(sql,/a\.donation_id\s*=\s*p\.donation_id|p\.donation_id\s*=\s*a\.donation_id/);
    assert.match(sql,/p\.id\s*=\s*\$1/);assert.doesNotMatch(sql,/state\s*=|public_consent|paid_at/);
    assert.deepEqual(params,[uuid]);return {rows:[{data:image}]};
  });
  assert.equal(typeof admin.adminGetProfileAvatar,'function');
  assert.equal(await admin.adminGetProfileAvatar(uuid),image);assert.equal(calls,1);
  await assert.rejects(()=>admin.adminGetProfileAvatar('../'+uuid),{status:404});assert.equal(calls,1);
  const missing=await service(async()=>({rows:[]}));
  assert.equal(await missing.adminGetProfileAvatar(uuid),null);
});

test('private message listing uses cookie auth and an explicit minimal DTO including one-off nonpublic donors',async()=>{
  let calls=0;
  const row={id:uuid,name:'Private donor',email:'reply@example.org',message:'<b>Thank you</b>',status:'paid',frequency:'once',createdAt:'2026-11-24T10:00:00.123456Z',amount:100,organization:'private',manage_token_hash:'secret'};
  const app=await handler({listMessages:async cursor=>{assert.equal(cursor,undefined);calls++;return {messages:[row],nextCursor:null};}});
  assert.equal((await app(req('/messages',false))).status,401);assert.equal(calls,0);
  assert.equal((await app(req('/messages?token=not-a-session',false))).status,401);assert.equal(calls,0);
  const response=await app(req('/messages'));assert.equal(response.status,200);
  const minimal={id:uuid,name:'Private donor',email:'reply@example.org',message:'<b>Thank you</b>',status:'paid',frequency:'once',createdAt:'2026-11-24T10:00:00.123456Z'};
  assert.deepEqual(await response.json(),{messages:[minimal],nextCursor:null});
  assert.match(response.headers.get('cache-control'),/private.*no-store/);assert.equal(calls,1);
});

test('message query is bounded to 50 with a stable microsecond keyset cursor and no public-profile restriction',async()=>{
  const rows=Array.from({length:51},(_,i)=>({id:`00000000-0000-0000-0000-${String(100-i).padStart(12,'0')}`,name:null,email:'reply@example.org',message:'fixture',status:'pending',frequency:'once',createdAt:'2026-11-24T10:00:00.123456Z'}));
  let calls=0;
  const admin=await service(async(sql,params)=>{
    assert.match(sql,/donor_name AS "name"/);assert.match(sql,/donor_email AS "email"/);assert.match(sql,/comment AS "message"/);
    assert.doesNotMatch(sql,/SELECT \*|JOIN|public_consent|amount|organization|token|capability/);
    assert.match(sql,/comment IS NOT NULL/);assert.equal(sql.includes("comment ~ '[^[:space:]]'"),true);
    assert.match(sql,/ORDER BY created_at DESC,\s*id DESC LIMIT \$3/);
    assert.match(sql,/created_at,\s*id\) < \(\$1::timestamptz,\s*\$2::uuid\)/);
    assert.match(sql,/to_char\(created_at AT TIME ZONE 'UTC'/);
    assert.equal(params[2],51);
    if(calls++ === 0){assert.deepEqual(params,[null,null,51]);return {rows};}
    assert.deepEqual(params,[rows[49].createdAt,rows[49].id,51]);return {rows:[rows[50]]};
  });
  assert.equal(typeof admin.adminListMessages,'function');
  const page=await admin.adminListMessages();assert.deepEqual(page.messages,rows.slice(0,50));
  assert.equal(typeof page.nextCursor,'string');assert.match(page.nextCursor,/^[A-Za-z0-9_-]+$/);
  const last=await admin.adminListMessages(page.nextCursor);assert.deepEqual(last,{messages:[rows[50]],nextCursor:null});
});

test('message cursor rejects malformed input before querying and produces safe HTTP 400',async()=>{
  let calls=0;
  const admin=await service(async()=>{calls++;return {rows:[]};});
  const encode=value=>Buffer.from(JSON.stringify(value)).toString('base64url');
  for(const cursor of ['', '!', 'x'.repeat(257), encode({createdAt:'2026-11-24',id:uuid}), encode(['2026-02-30T10:00:00.123456Z',uuid]), encode(['2026-11-24T10:00:00.123456Z','../']), encode(['2026-11-24T10:00:00.123456Z',uuid,'extra'])]) {
    await assert.rejects(()=>admin.adminListMessages(cursor),{status:400});
  }
  assert.equal(calls,0);
  const app=await handler({listMessages:cursor=>admin.adminListMessages(cursor)});
  const response=await app(req('/messages?cursor=not-json'));
  assert.equal(response.status,400);assert.deepEqual(await response.json(),{error:'invalid_cursor'});assert.equal(calls,0);
  const down=await handler({listMessages:async()=>{throw new Error('private SQL/password');}});
  const failed=await down(req('/messages'));assert.equal(failed.status,503);assert.deepEqual(await failed.json(),{error:'unavailable'});
});

test('runtime composes authenticated preview and message operations from the canonical admin service',async()=>{
  const data=source=>'data:text/javascript;base64,'+Buffer.from(source).toString('base64');
  const adminModule=data('export const adminListProfiles=async()=>[]; export const adminModerateProfile=async()=>{}; export const adminGetProfileAvatar=async id=>id; export const adminListMessages=async cursor=>cursor;');
  const source=await readFile(new URL('donations-admin/runtime.ts',root),'utf8');
  const output=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText
    .replace("'@/lib/donations/admin.mjs'",JSON.stringify(adminModule))
    .replace("'@/lib/donations/db.mjs'",JSON.stringify(data('export const rateLimit=async()=>true;')))
    .replace("'./rate.mjs'",JSON.stringify(new URL('donations-admin/rate.mjs',root).href))
    .replace("'./handler'",JSON.stringify(data('export const createAdminHandler=deps=>deps;')));
  const {handleAdminRequest:deps}=await import(data(output));
  assert.equal(typeof deps.getAvatar,'function');assert.equal(await deps.getAvatar(uuid),uuid);
  assert.equal(typeof deps.listMessages,'function');assert.equal(await deps.listMessages('opaque-cursor'),'opaque-cursor');
});

test('preview serves JPEG/WebP with their own MIME and rejects absent, oversized or non-raster bytes',async()=>{
  const {default:sharp}=await import('sharp');
  for(const format of ['jpeg','webp']) {
    const data=await sharp({create:{width:1,height:1,channels:3,background:'white'}})[format]().toBuffer();
    const app=await handler({getAvatar:async()=>data});
    const response=await app(req(`/profiles/${uuid}/avatar`));
    assert.equal(response.status,200);assert.equal(response.headers.get('content-type'),'image/'+format);
    assert.deepEqual(Buffer.from(await response.arrayBuffer()),data);
  }
  for(const data of [null,Buffer.alloc(0),Buffer.alloc(524289),Buffer.from('<svg onload="steal()"/>')]) {
    const app=await handler({getAvatar:async()=>data});
    const response=await app(req(`/profiles/${uuid}/avatar`));
    assert.equal(response.status,404);assert.match(response.headers.get('cache-control'),/no-store/);
  }
});

test('preview paths reject traversal and query credentials never authenticate a private image',async()=>{
  let calls=0;const app=await handler({getAvatar:async()=>{calls++;return null;}});
  for(const path of ['/profiles/not-a-uuid/avatar',`/profiles/${uuid}/avatar/extra`,`/profiles/%2e%2e/avatar`,`/profiles/${uuid}%2fother/avatar`]) assert.equal((await app(req(path))).status,404);
  assert.equal((await app(req(`/profiles/${uuid}/avatar?token=not-a-session`,false))).status,401);
  assert.equal(calls,0);
  const down=await handler({getAvatar:async()=>{throw new Error('SQL private credentials');}});
  const response=await down(req(`/profiles/${uuid}/avatar`));assert.equal(response.status,503);assert.deepEqual(await response.json(),{error:'unavailable'});
});

test('empty message pages explicitly terminate pagination',async()=>{
  const admin=await service(async()=>({rows:[]}));
  assert.deepEqual(await admin.adminListMessages(),{messages:[],nextCursor:null});
});

test('existing avatar replacement requires reapproval and public retrieval excludes rejected or withdrawn images',async()=>{
  // Exercise existing management/moderation/public functions against an isolated query double;
  // the parent owns PostgreSQL integration coverage, never a human/staging database.
  const oldAvatar='10000000-0000-0000-0000-000000000001';
  const newAvatar='10000000-0000-0000-0000-000000000002';
  const donation={id:uuid,frequency:'monthly',public_consent:true,paid_at:new Date(),manage_token_hash:'fixture'};
  const profile={id:uuid,donation_id:uuid,state:'approved',avatar_id:oldAvatar};
  const image=Buffer.from('stored raster');
  const query=async(sql,params=[])=>{
    if(sql.startsWith('SELECT a.data')) {
      assert.match(sql,/p.state='approved'/);assert.match(sql,/d.public_consent/);assert.match(sql,/d.paid_at IS NOT NULL/);
      const allowed=profile.avatar_id===params[0] && profile.state==='approved' && donation.public_consent && donation.paid_at;
      return {rowCount:allowed?1:0,rows:allowed?[{data:image}]:[]};
    }
    if(sql.startsWith('SELECT * FROM donations')) return {rows:[donation]};
    if(sql.startsWith('SELECT id FROM donations')) return {rows:[{id:uuid}]};
    if(sql.startsWith('SELECT id FROM donation_avatars')) {assert.deepEqual(params,[newAvatar,uuid]);return {rowCount:1,rows:[{id:newAvatar}]};}
    if(sql.startsWith('UPDATE donation_profiles SET name=')) {
      assert.match(sql,/state=CASE WHEN \$5 THEN 'pending' ELSE 'awaiting_payment' END/);
      assert.equal(params[3],newAvatar);assert.equal(params[4],true);
      profile.avatar_id=params[3];profile.state=params[4]?'pending':'awaiting_payment';return {rows:[]};
    }
    if(sql.startsWith('SELECT donation_id')) return {rows:[{donation_id:uuid}]};
    if(sql.startsWith('SELECT * FROM donation_profiles')) return {rows:[profile]};
    if(sql.startsWith('UPDATE donation_profiles SET state=$2')) {profile.state=params[1];return {rows:[]};}
    if(sql.startsWith('UPDATE donations SET public_consent=false')) {donation.public_consent=false;return {rows:[]};}
    if(sql.startsWith("UPDATE donation_profiles SET state='removed'")) {profile.state='removed';return {rows:[]};}
    if(sql.startsWith('INSERT INTO donation_audit')) return {rows:[]};
    if(sql.startsWith('SELECT p.id')) return {rows:[profile]};
    assert.fail('Unexpected isolated query: '+sql);
  };
  const admin=await service(query);
  async function backend(file) {
    let source=await readFile(new URL('donations/'+file,root),'utf8');
    source=source.replace(/import \{ pool, transaction(?:, enqueue)? \} from "\.\/db\.mjs";/,'const pool=()=>globalThis.__reviewDetailsDb; const transaction=fn=>fn(pool()); const enqueue=()=>{throw new Error("unexpected outbox");};')
      .replace(/from "(\.\/[^\"]+)"/g,(_,path)=>'from '+JSON.stringify(new URL('donations/'+path,root).href))
      .replace('from "sharp"','from '+JSON.stringify(import.meta.resolve('sharp')));
    return import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
  }
  const management=await backend('service.mjs');const {publicAvatar}=await backend('images.mjs');
  assert.equal(await publicAvatar(oldAvatar),image);
  await management.manageDonation({id:uuid,token:'fixture',action:'update-public',profile:{name:'Updated',avatarId:newAvatar}});
  assert.equal(profile.state,'pending');
  await assert.rejects(()=>publicAvatar(oldAvatar),{status:404});await assert.rejects(()=>publicAvatar(newAvatar),{status:404});
  await admin.adminModerateProfile({profileId:uuid,action:'approve',actor:'alice'});
  assert.equal(await publicAvatar(newAvatar),image);
  await admin.adminModerateProfile({profileId:uuid,action:'reject',actor:'alice'});
  await assert.rejects(()=>publicAvatar(newAvatar),{status:404});
  profile.state='approved';
  await management.manageDonation({id:uuid,token:'fixture',action:'remove-public'});
  assert.equal(donation.public_consent,false);assert.equal(profile.state,'removed');
  await assert.rejects(()=>publicAvatar(newAvatar),{status:404});
});

test('profile review DTO adds only a relative profile-bound avatar URL when an avatar exists',async()=>{
  const base={id:uuid,name:'Example',url:null,state:'pending',activity:'active',createdAt:'2026-11-24'};
  const app=await handler({list:async()=>[{...base,avatarId:'private-blob-id',donationId:'private-donor',manage_token_hash:'secret'}, {...base,id:'2',avatarId:null}]});
  const response=await app(req());assert.equal(response.status,200);
  assert.deepEqual(await response.json(),{profiles:[{...base,avatarUrl:`/api/donations/admin/profiles/${uuid}/avatar`},{...base,id:'2'}]});
});
