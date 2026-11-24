import test from 'node:test';
import assert from 'node:assert/strict';

test('payment status credentials use an Authorization header, never a URL query', async () => {
  const { statusCredentials } = await import('../src/lib/donations/status-credentials.mjs');
  const request = new Request('https://example.org/api/donations/status?id=donation', {headers:{Authorization:'Bearer '+ 'x'.repeat(43)}});
  assert.deepEqual(statusCredentials(request), {id:'donation',token:'x'.repeat(43)});
  assert.throws(() => statusCredentials(new Request('https://example.org/api/donations/status?id=donation&token=secret')), error => error.status===400);
  assert.throws(() => statusCredentials(new Request('https://example.org/api/donations/status?id=donation')), error => error.status===401);
  assert.throws(() => statusCredentials(new Request('https://example.org/api/donations/status?id=donation',{headers:{Authorization:'Basic secret'}})), error => error.status===401);
});
