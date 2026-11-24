import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {scryptSync,timingSafeEqual} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {mkdtempSync,writeFileSync,openSync,closeSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const script=fileURLToPath(new URL('../scripts/donations-admin-user.mjs',import.meta.url));
function run(args,input=''){return spawnSync(process.execPath,[script,...args],{input,encoding:'utf8',env:{PATH:process.env.PATH}});}

test('admin user generator reads password only from explicit fd and emits a compatible randomly salted JSON record',()=>{
  const password='test-only-password-at-least-16';
  const result=run(['alice','--password-fd','0'],password+'\n');
  assert.equal(result.status,0,result.stderr);assert.equal(result.stderr,'');assert.equal(result.stdout.includes(password),false);
  const user=JSON.parse(result.stdout);assert.deepEqual(Object.keys(user).sort(),['hash','salt','username']);assert.equal(user.username,'alice');
  assert.match(user.salt,/^[a-f0-9]{64}$/);assert.match(user.hash,/^[a-f0-9]{128}$/);
  assert(timingSafeEqual(scryptSync(password,Buffer.from(user.salt,'hex'),64),Buffer.from(user.hash,'hex')));
  const again=JSON.parse(run(['alice','--password-fd','0'],password).stdout);assert.notEqual(again.salt,user.salt);assert.notEqual(again.hash,user.hash);
});

test('admin user generator rejects invalid names, missing fd and passwords outside 16–256 without disclosing inputs',()=>{
  const cases=[{args:['bad user','--password-fd','0'],input:'a'.repeat(16)},{args:['alice'],input:'a'.repeat(16)},{args:['alice','--password','not-accepted'],input:''},{args:['alice','--password-fd','1'],input:'a'.repeat(16)},{args:['alice','--password-fd','0'],input:'short-secret'},{args:['alice','--password-fd','0'],input:'x'.repeat(257)},{args:['alice','--password-fd','0'],input:'x'.repeat(2000)}];
  for(const item of cases){const result=run(item.args,item.input);assert.notEqual(result.status,0);assert.equal(result.stdout,'');assert.equal(result.stderr.includes(item.input||'not-accepted'),false);}
});

test('documented fd 3 provisioning produces a record accepted by the real administrator authenticator',async()=>{
  const dir=mkdtempSync(join(tmpdir(),'admin-user-test-'));let fd;
  const password='test-only-fd-password-32-characters';
  try{
    const file=join(dir,'input');writeFileSync(file,password+'\r\n',{mode:0o600});fd=openSync(file,'r');
    const result=spawnSync(process.execPath,[script,'fd-admin','--password-fd','3'],{encoding:'utf8',stdio:['ignore','pipe','pipe',fd],env:{PATH:process.env.PATH}});
    assert.equal(result.status,0,result.stderr);const user=JSON.parse(result.stdout);
    const {authenticate}=await import('../src/lib/donations-admin/security.ts');
    assert.equal(await authenticate('fd-admin',password,{DONATIONS_ADMIN_USERS:JSON.stringify([user])}),'fd-admin');
    assert.equal(result.stderr,'');assert.equal(result.stdout.includes(password),false);
  }finally{if(fd!==undefined)closeSync(fd);rmSync(dir,{recursive:true,force:true});}
});

test('admin user generator preserves unicode passwords and exact accepted boundary lengths',()=>{
  for(const password of ['x'.repeat(16),'x'.repeat(256),'coração-seguro-🧡-only-test']){
    const result=run(['alice.admin@example.org','--password-fd','0'],password);assert.equal(result.status,0,result.stderr);
    const user=JSON.parse(result.stdout);assert.equal(scryptSync(password,Buffer.from(user.salt,'hex'),64).toString('hex'),user.hash);
  }
});
