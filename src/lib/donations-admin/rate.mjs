import {createHmac} from 'node:crypto';

/** Persistent atomic reservations. No process-memory/IP-header fallback. */
export function createLoginLimiter(rateLimit,env=process.env) {
  return async username => {
    const key=env.DONATIONS_ADMIN_SESSION_SECRET;
    if(!key || Buffer.byteLength(key)<32)throw new Error('Administrator login is not configured');
    const digest=value=>createHmac('sha256',key).update(value).digest('hex');
    try {
      // Bound total KDF work and unique account buckets, including unknown names.
      await rateLimit('admin-login:global:'+digest('global'),100,900);
      await rateLimit('admin-login:account:'+digest(username),5,900);
      return true;
    } catch(error) {
      if(error?.status===429)return false;
      throw error; // A missing database never disables the limiter.
    }
  };
}
