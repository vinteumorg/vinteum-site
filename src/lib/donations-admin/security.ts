import { createHash, createHmac, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

export type AdminEnvironment = Record<string, string | undefined>;
type Administrator = { username: string; salt: string; hash: string };
const derive = promisify(scrypt);
export const SESSION_SECONDS = 30 * 60;
export const SESSION_COOKIE = '__Host-vinteum-admin';
const USERNAME = /^[a-zA-Z0-9][a-zA-Z0-9_.@-]{0,99}$/;

function administrators(env: AdminEnvironment): Administrator[] {
  try {
    const value: unknown = JSON.parse(env.DONATIONS_ADMIN_USERS || '[]');
    if (!Array.isArray(value) || value.length > 50) return [];
    const users: Administrator[] = [];
    for (const item of value) {
      if (!item || typeof item.username !== 'string' || !USERNAME.test(item.username) ||
          typeof item.salt !== 'string' || !/^[a-f0-9]{32,128}$/.test(item.salt) || item.salt.length % 2 ||
          typeof item.hash !== 'string' || !/^[a-f0-9]{128}$/.test(item.hash) ||
          users.some(user => user.username === item.username)) return [];
      users.push({username:item.username, salt:item.salt, hash:item.hash});
    }
    return users;
  } catch { return []; }
}

export async function authenticate(username: string, password: string, env: AdminEnvironment = process.env): Promise<string | null> {
  if (typeof username !== 'string' || typeof password !== 'string' || username.length > 100 || password.length > 256) return null;
  const user = administrators(env).find(candidate => candidate.username === username);
  // Unknown users still pay the same KDF cost; no plaintext passwords are configured.
  const actual = await derive(password, Buffer.from(user?.salt ?? '0'.repeat(32), 'hex'), 64) as Buffer;
  const equal = timingSafeEqual(actual, Buffer.from(user?.hash ?? '0'.repeat(128), 'hex'));
  return user && equal ? user.username : null;
}

function sessionKey(env: AdminEnvironment): string {
  const key = env.DONATIONS_ADMIN_SESSION_SECRET;
  if (!key || Buffer.byteLength(key) < 32) throw new Error('Administrator sessions are not configured');
  return key;
}
function credentialVersion(user: Administrator): string {
  return createHash('sha256').update(JSON.stringify(user)).digest('hex');
}
export function issueSession(username: string, env: AdminEnvironment = process.env, now = Math.floor(Date.now()/1000)): string {
  const user = administrators(env).find(user => user.username === username);
  if (!user) throw new Error('Administrator is not authorized');
  const payload = Buffer.from(JSON.stringify({username, version:credentialVersion(user), iat:now, exp:now+SESSION_SECONDS, nonce:randomBytes(24).toString('hex')})).toString('base64url');
  return payload + '.' + createHmac('sha256',sessionKey(env)).update(payload).digest('base64url');
}
export function validateSession(token: string | null | undefined, env: AdminEnvironment = process.env, now = Math.floor(Date.now()/1000)): {username: string} | null {
  try {
    if (!token || token.length > 2048 || !/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]{43}$/.test(token)) return null;
    const [payload,signature] = token.split('.');
    const expected = createHmac('sha256',sessionKey(env)).update(payload).digest();
    const supplied = Buffer.from(signature,'base64url');
    if (supplied.length !== expected.length || !timingSafeEqual(supplied,expected)) return null;
    const value = JSON.parse(Buffer.from(payload,'base64url').toString('utf8'));
    const user = administrators(env).find(user => user.username === value.username);
    if (!user || value.version !== credentialVersion(user) || !Number.isInteger(value.iat) || !Number.isInteger(value.exp) ||
        value.iat > now || value.exp <= now || value.exp !== value.iat+SESSION_SECONDS) return null;
    return {username:user.username};
  } catch { return null; }
}
export function validMutationOrigin(request: Request, env: AdminEnvironment = process.env): boolean {
  try {
    const origin = env.DONATIONS_ADMIN_ORIGIN;
    if (!origin || new URL(origin).origin !== origin || !origin.startsWith('https://')) return false;
    const site = request.headers.get('sec-fetch-site');
    // Compare against server configuration, not Next's internal bind URL or attacker-supplied proxy headers.
    return request.headers.get('origin') === origin && (!site || site === 'same-origin');
  } catch { return false; }
}

export class AdminRequestError extends Error {
  status: number;
  constructor(message: string, status: number) { super(message); this.status = status; }
}

export async function readBoundedJson(request: Request, limit = 4096): Promise<Record<string, unknown>> {
  if (!/^application\/json(?:\s*;|$)/i.test(request.headers.get('content-type') || '')) throw new AdminRequestError('Expected JSON',415);
  const length = request.headers.get('content-length');
  if (length && (!/^\d+$/.test(length) || Number(length)>limit)) throw new AdminRequestError('Body too large',413);
  if (!request.body) throw new AdminRequestError('Expected JSON object',400);
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const {done,value} = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > limit) { await reader.cancel(); throw new AdminRequestError('Body too large',413); }
      chunks.push(value);
    }
    const value: unknown = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new AdminRequestError('Expected JSON object',400);
    return value as Record<string, unknown>;
  } catch (error) {
    if (error instanceof AdminRequestError) throw error;
    throw new AdminRequestError('Invalid JSON object',400);
  } finally { reader.releaseLock(); }
}

export function sessionCookie(token: string, clear = false): string {
  return `${SESSION_COOKIE}=${clear ? '' : token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${clear ? 0 : SESSION_SECONDS}`;
}
