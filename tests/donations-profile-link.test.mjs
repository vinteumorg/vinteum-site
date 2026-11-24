
import test from 'node:test';
import assert from 'node:assert/strict';

test('profile links accept a bare domain and normalise it to https', async () => {
  const { safeUrl } = await import('../src/lib/donations/core.mjs');
  assert.equal(safeUrl('x.com/lucasdcf'), 'https://x.com/lucasdcf');
  assert.equal(safeUrl('  exemplo.com.br  '), 'https://exemplo.com.br/');
  assert.equal(safeUrl('https://github.com/lucasdcf'), 'https://github.com/lucasdcf');
  // an explicit insecure scheme is refused rather than silently rewritten
  assert.throws(() => safeUrl('http://exemplo.com/voce'), /Unsafe URL|Invalid URL/);
  assert.equal(safeUrl(''), null);
  assert.equal(safeUrl(null), null);
});

test('profile links still refuse unsafe or non-web targets', async () => {
  const { safeUrl } = await import('../src/lib/donations/core.mjs');
  for (const value of ['javascript:alert(1)', 'data:text/html,x', 'ftp://exemplo.com/x',
    '//exemplo.com/x', 'localhost:3000', 'http://127.0.0.1/x', 'exemplo', 'exemplo.com:8080/x',
    'https://user:pass@exemplo.com/x']) {
    assert.throws(() => safeUrl(value), /Invalid URL|Unsafe URL/, value);
  }
});
