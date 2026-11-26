import test from 'node:test';
import assert from 'node:assert/strict';
import { createDraft, effectiveCurrency, checkoutPayload, validateDraft, paymentState, safeLink, publicSupporters, managementCredentials } from './flow.ts';
import * as flow from './flow.ts';

test('unconfigured preview keeps visual currencies but cannot enable a processor', () => {
  const config={mode:'test',currencies:[],stripe:{enabled:false,currencies:[]},btcpay:{enabled:false}};
  assert.deepEqual(flow.displayCurrencies(config),['USD','BRL']);
  assert.equal(flow.providerAvailable(config,'stripe','USD','once'),false);
  assert.equal(flow.providerAvailable(config,'btcpay','BRL','once'),false);
});
test('payment controls respect per-provider currency and monthly capability', () => {
  const config={mode:'test',currencies:['USD','BRL'],stripe:{enabled:true,currencies:['BRL']},btcpay:{enabled:true,monthlyEnabled:false}};
  assert.equal(flow.providerAvailable(config,'stripe','USD','once'),false);
  assert.equal(flow.providerAvailable(config,'stripe','BRL','monthly'),true);
  assert.equal(flow.providerAvailable(config,'btcpay','USD','once'),true);
  assert.equal(flow.providerAvailable(config,'btcpay','USD','monthly'),false);
});

test('direct Bitcoin view uses one-time defaults without destroying saved monthly selection', () => {
  const draft={...createDraft(),frequency:'monthly'};
  assert.deepEqual(flow.donationSelection(draft,'EN',true),{currency:'USD',frequency:'once',amount:50});
  assert.deepEqual(flow.donationSelection(draft,'EN',false),{currency:'USD',frequency:'monthly',amount:25});
});

test('avatar constraints reject unsupported, oversized and invalid dimension files', () => {
  assert.equal(flow.validAvatar('image/png', 100, 32, 4096), true);
  for (const args of [['image/svg+xml', 100, 32, 32], ['image/png', 2097153, 32, 32], ['image/png', 0, 32, 32], ['image/png', 100, 31, 32], ['image/png', 100, 32, 4097]]) assert.equal(flow.validAvatar(...args), false);
});

test('management payload validates public names and URLs and preserves omitted avatars', () => {
  const credentials={id:'donation',token:'private'};
  assert.equal(flow.managementPayload(credentials, 'update-public', {name:' ',url:''}), null);
  assert.equal(flow.managementPayload(credentials, 'update-public', {name:'nym',url:'javascript:x'}), null);
  assert.deepEqual(flow.managementPayload(credentials, 'update-public', {name:' nym ',url:'https://example.com'}), {...credentials,action:'update-public',profile:{name:'nym',url:'https://example.com/'}});
  assert.deepEqual(flow.managementPayload(credentials, 'update-public', {name:'nym',url:'',avatarId:null}).profile,{name:'nym',url:'',avatarId:null});
});

test('management avatar upload sends raw bytes with private management credential, never status token', async () => {
  const body=new Blob(['image'],{type:'image/png'});let sent;
  const avatarId=await flow.uploadRecognitionAvatar({id:'donation',token:'manage-only'},body,async (...args)=>{sent=args;return Response.json({avatarId:'stored-image'});});
  assert.equal(avatarId,'stored-image');assert.equal(sent[0],'/api/donations/upload');assert.equal(sent[1].headers['x-donation-token'],'manage-only');assert.equal(sent[1].headers['x-donation-id'],'donation');assert.equal(sent[1].headers['Content-Type'],'image/png');assert.equal(sent[1].body,body);
  await assert.rejects(flow.uploadRecognitionAvatar({id:'d',token:'m'},body,async()=>new Response('',{status:413})));
});
test('management credentials accept valid private links, reject malformed tokens', () => {
  const id='00000000-0000-4000-8000-000000000000', token='x'.repeat(43);
  assert.deepEqual(managementCredentials('#id='+id+'&token='+token),{id,token});
  assert.equal(managementCredentials('#id=bad&token=123'),null);
});

test('validation rejects invalid amount, unsafe profile URL, missing email', () => {
  assert.equal(validateDraft({...createDraft(),amount:0}, 'amount', 'EN'), 'amount.error');
  assert.equal(validateDraft({...createDraft(),email:'bad'}, 'details', 'EN'), 'details.emailError');
  assert.equal(validateDraft({...createDraft(),email:'a@b.com',frequency:'monthly',recognition:true,publicName:'nym',link:'javascript:alert(1)'}, 'details', 'EN'), 'details.linkError');
  assert.equal(validateDraft({...createDraft(),email:'a@b.com'}, 'details', 'EN'), null);
  assert.equal(safeLink('https://user:password@example.com'), '');
});
test('success requires server paid; partial, expired, cancelled never succeed', () => {
  assert.equal(paymentState('paid'), 'success');
  for (const value of ['partial','confirming','late','pending','processing','unknown']) assert.equal(paymentState(value),'waiting');
  for (const value of ['expired','cancelled','failed']) assert.equal(paymentState(value),'failed');
});
test('public wall excludes unapproved profiles and financial/private properties', () => {
  assert.deepEqual(publicSupporters([{id:'1',name:'nym',kind:'person',status:'approved',email:'secret',amount:100},{id:'2',name:'pending',status:'pending'}]),[{id:'1',name:'nym',kind:'person',link:'',avatar:'',activity:'active'}]);
});

test('fractional donations accept valid decimal cents without floating point errors', () => {
  assert.equal(validateDraft({...createDraft(), amount:0.29}, 'amount', 'EN', {min:0.01,max:100}), null);
  assert.equal(validateDraft({...createDraft(), amount:1.001}, 'amount', 'EN'), 'amount.error');
});
test('profile links require HTTPS without credentials or private hosts', () => {
  for (const url of ['http://example.com','https://localhost','https://127.0.0.1','https://x.local','https://user:pass@example.com']) assert.equal(safeLink(url),'');
  assert.equal(safeLink('https://example.com'), 'https://example.com/');
});

test('locale defaults are BRL and USD, manual currency wins', () => {
  const draft = createDraft();
  assert.equal(effectiveCurrency(draft, 'BR'), 'BRL');
  assert.equal(effectiveCurrency(draft, 'EN'), 'USD');
  assert.equal(effectiveCurrency({...draft, currency: 'USD'}, 'BR'), 'USD');
});
test('direct bitcoin payload contains no identifying data or consent', () => {
  const draft = {...createDraft(), firstName: 'Private', email: 'a@b.com', newsletter: true, recognition: true};
  const payload = checkoutPayload(draft, 'BR', 'btcpay', true);
  assert.equal(payload.direct, true);
  assert.equal(payload.frequency, 'once');
  assert.equal(payload.newsletterConsent, false);
  assert.equal(payload.donor, undefined);
  assert.equal(payload.publicRecognition, undefined);
});
test('consents default off; recognition only accompanies monthly explicit opt-in', () => {
  const draft = createDraft();
  assert.equal(draft.newsletter, false);
  assert.equal(draft.recognition, false);
  assert.equal(checkoutPayload({...draft, recognition:true}, 'EN', 'stripe').publicRecognition, undefined);
  assert.equal(checkoutPayload({...draft, frequency:'monthly', recognition:true, publicName:'nym'}, 'EN', 'stripe').publicRecognition.name, 'nym');
});

test('link field normalises a bare domain instead of demanding https:// from the donor', async () => {
  const { normalizeLink, safeLink } = await import('./flow.ts');
  assert.equal(normalizeLink('x.com/lucasdcf'), 'https://x.com/lucasdcf');
  assert.equal(normalizeLink(' https://exemplo.com '), 'https://exemplo.com/');
  assert.equal(normalizeLink('exemplo.com.br'), 'https://exemplo.com.br/');
  assert.equal(normalizeLink('http://exemplo.com/x'), '');
  assert.equal(normalizeLink(''), '');
  for (const bad of ['javascript:alert(1)', 'data:text/html,x', 'ftp://exemplo.com', 'http://exemplo.com/x', '//exemplo.com', 'exemplo', 'http://127.0.0.1/x', 'exemplo.com:8080']) {
    assert.equal(normalizeLink(bad), '', bad);
    assert.equal(safeLink(bad), '', bad);
  }
  // safeLink renders an existing stored value; it never guesses a scheme.
  assert.equal(safeLink('x.com/lucasdcf'), '');
});

test('wall cards only badge a real distinction, not "supporter" on the supporters wall', async () => {
  const { supporterBadge } = await import('./flow.ts');
  assert.equal(supporterBadge({ kind: 'person', activity: 'active' }), null);
  assert.equal(supporterBadge({ kind: 'person' }), null);
  assert.equal(supporterBadge({ kind: 'org', activity: 'active' }), 'wallp.org');
  assert.equal(supporterBadge({ kind: 'org', activity: 'past' }), 'ui.past');
  assert.equal(supporterBadge({ kind: 'person', activity: 'past' }), 'ui.past');
});

test('BRL starts at 50 as a suggested one-off amount', async () => {
  const { PRESETS, DEFAULTS } = await import('./flow.ts');
  assert.equal(DEFAULTS.BRL.once, 50);
  assert.ok(PRESETS.BRL.once.includes(50), PRESETS.BRL.once.join(','));
  assert.equal(PRESETS.BRL.once[0], 50);
  // untouched: USD and the monthly ladders keep their own suggestions
  assert.equal(DEFAULTS.USD.once, 50);
  assert.equal(DEFAULTS.BRL.monthly, 100);
});

