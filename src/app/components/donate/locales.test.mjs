import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const root=new URL('../../../',import.meta.url);
const en=JSON.parse(readFileSync(new URL('i18n/locales/en.json',root),'utf8')).donations;
const pt=JSON.parse(readFileSync(new URL('i18n/locales/pt.json',root),'utf8')).donations;
function flatten(value,prefix='') {return Object.fromEntries(Object.entries(value).flatMap(([key,item])=>typeof item==='string'?[[prefix+key,item]]:Object.entries(flatten(item,prefix+key+'.'))));}
const english=flatten(en),portuguese=flatten(pt);
test('donations EN and PT have identical complete non-empty copy including interpolated states',()=>{
 assert.deepEqual(Object.keys(english).sort(),Object.keys(portuguese).sort());
 for(const [key,text] of Object.entries(english)){
  assert.ok(text.trim(),key);assert.ok(portuguese[key].trim(),key);
  assert.deepEqual([...text.matchAll(/\{(\w+)\}/g)].map(x=>x[1]).sort(),[...portuguese[key].matchAll(/\{(\w+)\}/g)].map(x=>x[1]).sort(),key);
 }
});
test('all literal frontend translation references resolve in both locales',()=>{
 for(const filename of ['DonationsExperience.tsx','DonationManagement.tsx','StripeDonationCheckout.tsx']){
  const source=readFileSync(new URL(filename,import.meta.url),'utf8');
  for(const match of source.matchAll(/(?:\bt\(|\?\s*|:\s*)['"]((?:manage|validation|details|ui|amount|modal|hero|panel|direct|pay|done|wallp|wall|sum|card|btc|btn|step|freq|nudge|faq|programs)\.[\w.]+)['"]/g)){
   assert.equal(typeof english[match[1]],'string',filename+': '+match[1]);
   assert.equal(typeof portuguese[match[1]],'string',filename+': '+match[1]);
  }
 }
});
test('direct Bitcoin copy does not promise anonymity or unconditional wallet availability',()=>{
 assert.match(english['faq.a2'],/not guarantee anonymity/);
 assert.match(portuguese['faq.a2'],/não garante anonimato/);
 assert.match(english['pay.cardSub'],/available/);
 assert.match(portuguese['pay.cardSub'],/disponíveis/);
});

test('profile removal and cancellation copy distinguish consent from payment commitments',()=>{
 assert.match(english['manage.confirmRemove'],/does not cancel/);
 assert.match(english['manage.confirmCancel'],/does not remove/);
 assert.match(portuguese['manage.confirmRemove'],/não cancela/);
 assert.match(portuguese['manage.confirmCancel'],/não remove/);
});
