import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';

test('the privacy hook is installed before the tracker and selected by the tracker configuration', async () => {
  const layout = await readFile(new URL('../src/app/layout.tsx', import.meta.url), 'utf8');
  assert.match(layout, /strategy="beforeInteractive"/);
  assert.match(layout, /data-before-send="vinteumAnalyticsBeforeSend"/);
  assert.ok(layout.indexOf('analyticsPrivacyScript}') < layout.indexOf('src="https://analytics.vinteum.org/script.js"'));
});

async function hook(pathname = '/') {
  const { analyticsPrivacyScript } = await import('../src/lib/analytics-privacy.ts');
  const context = vm.createContext({ window: { location: { origin: 'https://vinteum.org', pathname } }, URL });
  vm.runInContext(analyticsPrivacyScript, context);
  return context.window.vinteumAnalyticsBeforeSend;
}

test('donation, management and admin events never reach the analytics collector', async () => {
  const beforeSend = await hook();
  for (const url of ['/donate', '/donate/preview', '/donate/manage#id=secret', '/donate/admin', '/api/donations/status?token=secret']) {
    assert.equal(beforeSend('event', { url }), null);
    assert.equal(beforeSend('error', { url }), null);
  }
});

test('the current sensitive route suppresses custom events even if a caller supplies a different URL', async () => {
  assert.equal((await hook('/donate/manage'))('event', { url: '/contact', secret: 'private' }), null);
});

test('ordinary analytics keep their payload while sensitive referrers are removed', async () => {
  const beforeSend = await hook();
  const input = { url: '/about', referrer: '/donate/manage#token=secret', tag: 'keep' };
  const result = beforeSend('event', input);
  assert.equal(result.url, '/about');
  assert.equal(result.referrer, '');
  assert.equal(result.tag, 'keep');
  assert.equal(input.referrer, '/donate/manage#token=secret');
  assert.equal(beforeSend('event', { url: '/blog', referrer: '/about' }).referrer, '/about');
});

test('malformed payloads and URLs fail closed rather than leaking', async () => {
  const beforeSend = await hook();
  assert.equal(beforeSend('event', null), null);
  assert.equal(beforeSend('event', { url: 'https://[' }), null);
});
