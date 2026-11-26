import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';

// Explicit opt-in only; point BOTH the app and this process at an isolated test DB.
const base=process.env.DONATIONS_ADMIN_TEST_URL;
const origin=process.env.DONATIONS_ADMIN_TEST_ORIGIN;
const configured=Boolean(base&&origin&&process.env.DONATIONS_ADMIN_TEST_USERNAME&&process.env.DONATIONS_ADMIN_TEST_PASSWORD&&process.env.DONATIONS_ADMIN_INTEGRATION==='true');
test('real Next routes enforce admin auth, origin, durable limits and canonical audited moderation',{skip:!configured,timeout:120000},async()=>{
  const {pool,migrate}=await import('../src/lib/donations/db.mjs');
  await migrate();const db=pool();const donationId=randomUUID(),profileId=randomUUID();
  const request=(path='',method='GET',body,cookie,extra={})=>fetch(base+'/api/donations/admin'+path,{method,headers:{origin,'x-forwarded-proto':'https','content-type':'application/json',...(cookie?{cookie}:{}),...extra},...(body?{body:JSON.stringify(body)}:{})});
  const action={profileId,action:'approve',actor:'forged-actor',reason:'Integration review'};
  try{
    const denied=await request();assert.equal(denied.status,401);assert.match(denied.headers.get('cache-control'),/no-store/);
    assert.equal((await request('','POST',action)).status,401);
    const credentials={username:process.env.DONATIONS_ADMIN_TEST_USERNAME,password:process.env.DONATIONS_ADMIN_TEST_PASSWORD};
    assert.equal((await request('/login','POST',credentials,undefined,{origin:'https://evil.invalid'})).status,403);
    const login=await request('/login','POST',credentials);assert.equal(login.status,200,await login.clone().text());
    const setCookie=login.headers.get('set-cookie');assert.match(setCookie,/HttpOnly/i);assert.match(setCookie,/Secure/i);assert.match(setCookie,/SameSite=Strict/i);
    const cookie=setCookie.split(';')[0];
    assert.equal((await (await request('/session','GET',undefined,cookie)).json()).username,credentials.username);
    assert.equal((await request('/unknown','GET',undefined,cookie)).status,404);
    await db.query(`INSERT INTO donations(id,idempotency_key,request_hash,provider,frequency,currency,amount,locale,donor_email,public_consent,status_token_hash,manage_token_hash) VALUES($1,$2,'admin-http-fixture','stripe','monthly','USD',1000,'en','private-admin-fixture@example.invalid',true,'fixture','fixture')`,[donationId,randomUUID()]);
    await db.query("INSERT INTO donation_profiles(id,donation_id,name,state) VALUES($1,$2,'Admin HTTP test supporter','pending')",[profileId,donationId]);
    const listing=await request('','GET',undefined,cookie);assert.equal(listing.status,200);
    const rows=await listing.json();assert(rows.profiles.some(row=>row.id===profileId));assert.equal(JSON.stringify(rows).includes('private-admin-fixture'),false);assert.equal(JSON.stringify(rows).includes('donationId'),false);
    assert.equal((await request('','POST',action,cookie,{'sec-fetch-site':'cross-site'})).status,403);
    assert.equal((await request('','POST',action,cookie)).status,409);
    assert.equal((await db.query('SELECT state FROM donation_profiles WHERE id=$1',[profileId])).rows[0].state,'pending');
    assert.equal((await db.query('SELECT * FROM donation_audit WHERE profile_id=$1',[profileId])).rowCount,0);
    await db.query("UPDATE donations SET paid_at=now(),status='paid' WHERE id=$1",[donationId]);
    assert.equal((await request('','POST',action,cookie)).status,200);
    assert.equal((await db.query('SELECT state FROM donation_profiles WHERE id=$1',[profileId])).rows[0].state,'approved');
    const audit=(await db.query('SELECT actor,action,reason FROM donation_audit WHERE profile_id=$1',[profileId])).rows;
    assert.deepEqual(audit,[{actor:credentials.username,action:'approve',reason:'Integration review'}]);
    assert.equal((await request('','POST',{profileId,action:'remove'},cookie)).status,200);
    assert.equal((await db.query('SELECT state FROM donation_profiles WHERE id=$1',[profileId])).rows[0].state,'removed');
    assert.equal((await db.query('SELECT * FROM donation_audit WHERE profile_id=$1',[profileId])).rowCount,2);
    const logout=await request('/logout','POST',{},cookie);assert.equal(logout.status,200);assert.match(logout.headers.get('set-cookie'),/Max-Age=0/);
    assert.equal((await request('/session','GET',undefined,logout.headers.get('set-cookie').split(';')[0])).status,401);
    const unknown='unknown-'+randomUUID();
    for(let i=0;i<6;i++)assert.equal((await request('/login','POST',{username:unknown,password:'wrong'},undefined,{'x-forwarded-for':'192.0.2.'+(i+1)})).status,i<5?401:429);
    const page=await fetch(base+'/donate/admin');assert.equal(page.status,200);const html=await page.text();assert.match(html,/type="password"/);assert.equal(html.includes('Admin HTTP test supporter'),false);assert.equal(html.includes(credentials.password),false);
  }finally{
    await db.query('DELETE FROM donation_audit WHERE profile_id=$1',[profileId]);
    await db.query('DELETE FROM donations WHERE id=$1',[donationId]);
    await db.end();
  }
});
