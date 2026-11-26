import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

test('administrator copy comes from the existing paired locale JSON files, not a second dictionary', async () => {
  const root = new URL('../', import.meta.url);
  const en = JSON.parse(await readFile(new URL('src/i18n/locales/en.json', root), 'utf8'));
  const pt = JSON.parse(await readFile(new URL('src/i18n/locales/pt.json', root), 'utf8'));
  assert.ok(en.donations.admin);
  assert.deepEqual(Object.keys(en.donations.admin).sort(), Object.keys(pt.donations.admin).sort());
  assert.equal(en.donations.admin.login, 'Sign in');
  assert.equal(pt.donations.admin.login, 'Entrar');
  const source = await readFile(new URL('src/app/donate/admin/copy.ts', root), 'utf8');
  assert.match(source, /locales\/en\.json/);
  assert.match(source, /locales\/pt\.json/);
  assert.doesNotMatch(source, /Supporter review|Revisão de apoiadores/);
});
