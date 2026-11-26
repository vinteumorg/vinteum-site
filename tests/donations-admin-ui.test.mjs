import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import ts from 'typescript';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const require=createRequire(import.meta.url);
const root=new URL('../src/app/donate/admin/',import.meta.url);
function data(source){return 'data:text/javascript;base64,'+Buffer.from(source).toString('base64');}
function transpile(source){return ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;}
async function component(locale){
  const localeImports = {};
  for (const language of ['en', 'pt']) {
    localeImports['@/i18n/locales/' + language + '.json'] = data('export default ' + await readFile(new URL('../src/i18n/locales/' + language + '.json', import.meta.url), 'utf8'));
  }
  const copySource = transpile(await readFile(new URL('copy.ts',root),'utf8')).replace(/from (["'])([^"']+)\1/g,(all,quote,path)=>localeImports[path]?'from '+JSON.stringify(localeImports[path]):all);
  const copy=data(copySource);
  let source=transpile(await readFile(new URL('AdminConsole.tsx',root),'utf8'));
  const replacements={'react':pathToFileURL(require.resolve('react')).href,'react/jsx-runtime':pathToFileURL(require.resolve('react/jsx-runtime')).href,'@/contexts/LanguageContext':data(`export function useLanguage(){return {locale:${JSON.stringify(locale)}}}`),'./copy':copy,'./admin.module.css':data('export default {}')};
  source=source.replace(/from (["'])([^"']+)\1/g,(all,quote,path)=>replacements[path]?'from '+JSON.stringify(replacements[path]):all);
  return import(data(source));
}
test('authenticated console exposes filters and sign-out without embedding review rows in HTML',async()=>{
  const {default:Console}=await component('EN');
  const html=renderToStaticMarkup(React.createElement(Console,{initialUsername:'alice'}));
  assert.match(html,/Sign out/);assert.match(html,/Pending/);assert.match(html,/Approved/);assert.equal(html.includes('type="password"'),false);assert.equal(html.includes('data-profile-id'),false);
});

test('profile review renders localized actions, escapes names and refuses unsafe links',async()=>{
  for(const [locale,approve] of [['EN','Approve'],['BR','Aprovar']]) {
    const {ProfileReview}=await component(locale);
    const html=renderToStaticMarkup(React.createElement(ProfileReview,{profile:{id:'profile-test',name:'<script>alert(1)</script>',url:'javascript:alert(1)',state:'pending',activity:'active'},busy:false,onAction:()=>{}}));
    assert.match(html,new RegExp(approve));assert.equal(html.includes('href="javascript:'),false);assert.equal(html.includes('<script>'),false);assert.match(html,/&lt;script&gt;/);assert.match(html,/maxLength="500"/);
    const approved=renderToStaticMarkup(React.createElement(ProfileReview,{profile:{id:'other',name:'Alice',url:'https://example.org',state:'approved',activity:'past'},busy:false,onAction:()=>{}}));
    assert.match(approved,/rel="noopener noreferrer nofollow"/);assert.equal(approved.includes('value="approve"'),false);assert.match(approved,/value="remove"/);
  }
});

test('unauthenticated admin HTML has an accessible bilingual login and no review data',async()=>{
  for(const [locale,label] of [['EN','Username'],['BR','Usuário']]) {
    const {default:Console}=await component(locale);
    const html=renderToStaticMarkup(React.createElement(Console,{initialUsername:null}));
    assert.match(html,new RegExp(label));assert.match(html,/type="password"/);assert.match(html,/autoComplete="current-password"/);
    assert.equal(html.includes('data-profile-id'),false);assert.equal(html.includes('localStorage'),false);
  }
});

test('moderation card shows the uploaded avatar and refuses foreign image URLs', async () => {
  const {ProfileReview}=await component('EN');
  const id='00000000-0000-4000-8000-000000000000';
  const withAvatar=renderToStaticMarkup(React.createElement(ProfileReview,{profile:{id,name:'Alice',state:'pending',activity:'active',avatarUrl:'/api/donations/admin/profiles/'+id+'/avatar'},busy:false,onAction:()=>{}}));
  assert.match(withAvatar,new RegExp('/api/donations/admin/profiles/'+id+'/avatar'));
  assert.match(withAvatar,/loading="lazy"/);
  assert.match(withAvatar,/Sent image/);
  const withoutAvatar=renderToStaticMarkup(React.createElement(ProfileReview,{profile:{id,name:'Bob',state:'pending',activity:'active'},busy:false,onAction:()=>{}}));
  assert.equal(withoutAvatar.includes('/avatar'),false);
  assert.equal(withoutAvatar.includes('Sent image'),false);
  for (const hostile of ['https://evil.example/x.png','//evil.example/x.png','javascript:alert(1)','/api/donations/avatars/'+id]) {
    const html=renderToStaticMarkup(React.createElement(ProfileReview,{profile:{id,name:'Eve',state:'pending',activity:'active',avatarUrl:hostile},busy:false,onAction:()=>{}}));
    assert.equal(html.includes('evil.example'),false,hostile);
    assert.equal(html.includes('javascript:'),false,hostile);
    assert.equal(html.includes('src="/api/donations/avatars/'),false,hostile);
  }
});

test('private message list renders donor comments escaped, with reply address and no public exposure', async () => {
  const {MessageList}=await component('EN');
  const html=renderToStaticMarkup(React.createElement(MessageList,{messages:[{id:'m1',name:'<b>Ana</b>',email:'ana@example.org',message:'<script>alert(1)</script>',status:'paid',frequency:'monthly',createdAt:'2026-11-24T12:34:56.000000Z'}],nextCursor:'abc',loaded:true,busy:false,onMore:()=>{}}));
  assert.match(html,/&lt;script&gt;/);
  assert.equal(html.includes('<script>'),false);
  assert.equal(html.includes('<b>Ana</b>'),false);
  assert.match(html,/mailto:ana@example.org/);
  assert.match(html,/2026-11-24 12:34/);
  assert.match(html,/Load more/);
  assert.equal(html.includes('public wall'),false);
  const empty=renderToStaticMarkup(React.createElement(MessageList,{messages:[],nextCursor:null,loaded:true,busy:false,onMore:()=>{}}));
  assert.match(empty,/No messages/);
  assert.equal(empty.includes('Load more'),false);
});


test('message badges label the donation frequency, never supporter status', async () => {
  const {MessageList}=await component('EN');
  const base={id:'m1',name:'Ana',email:'ana@example.org',message:'Hello',status:'paid',createdAt:'2026-11-24T12:34:56.000000Z'};
  const once=renderToStaticMarkup(React.createElement(MessageList,{messages:[{...base,frequency:'once'}],nextCursor:null,loaded:true,busy:false,onMore:()=>{}}));
  assert.match(once,/One-time donation/);
  assert.equal(once.includes('Past monthly supporter'),false);
  assert.equal(once.includes('Active monthly supporter'),false);
  const monthly=renderToStaticMarkup(React.createElement(MessageList,{messages:[{...base,id:'m2',frequency:'monthly'}],nextCursor:null,loaded:true,busy:false,onMore:()=>{}}));
  assert.match(monthly,/Monthly donation/);
  assert.equal(monthly.includes('Active monthly supporter'),false);
  const pt=await component('BR');
  const oncept=renderToStaticMarkup(React.createElement(pt.MessageList,{messages:[{...base,frequency:'once'}],nextCursor:null,loaded:true,busy:false,onMore:()=>{}}));
  assert.match(oncept,/Doação única/);
  assert.equal(oncept.includes('Apoiador mensal anterior'),false);
});
