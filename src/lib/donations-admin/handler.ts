import { AdminRequestError, authenticate, issueSession, readBoundedJson, SESSION_COOKIE, sessionCookie, validMutationOrigin, validateSession } from './security';
import type { AdminEnvironment } from './security';

export type ProfileState = 'pending' | 'approved' | 'rejected' | 'removed';
export type ModerationAction = 'approve' | 'reject' | 'remove';
export type AdminDependencies = {
  env?: AdminEnvironment;
  consumeLogin: (username: string) => Promise<boolean>;
  list: (state: ProfileState) => Promise<unknown[]>;
  getAvatar?: (profileId: string) => Promise<Uint8Array | null>;
  listMessages?: (cursor?: string) => Promise<{messages: unknown[]; nextCursor: string | null}>;
  moderate: (input: {profileId: string; action: ModerationAction; actor: string; reason?: string}) => Promise<unknown>;
};
const headers = {'Cache-Control':'private, no-store, max-age=0','Pragma':'no-cache','Vary':'Cookie','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'};
function json(value: unknown, status = 200, extra: Record<string,string> = {}) {
  return Response.json(value,{status,headers:{...headers,...extra}});
}
function cookieValue(request: Request): string | null {
  const matches = (request.headers.get('cookie') || '').split(';').map(item => item.trim()).filter(item => item.startsWith(SESSION_COOKIE+'='));
  return matches.length === 1 ? matches[0].slice(SESSION_COOKIE.length+1) : null;
}

/** Every endpoint except the login operation crosses this server-side auth boundary. */
export function createAdminHandler(dependencies: AdminDependencies) {
  const env = dependencies.env ?? process.env;
  return async (request: Request): Promise<Response> => {
    try {
      const path = new URL(request.url).pathname.replace(/\/$/,'');
      if (request.method !== 'GET' && request.method !== 'HEAD' && !validMutationOrigin(request,env)) return json({error:'forbidden'},403);
      if (path === '/api/donations/admin/login' && request.method === 'POST') {
        const body = await readBoundedJson(request);
        if (typeof body.username !== 'string' || typeof body.password !== 'string' || body.username.length > 100 || body.password.length > 256 || !body.username || !body.password) return json({error:'invalid_login'},400);
        if (!await dependencies.consumeLogin(body.username)) return json({error:'rate_limited'},429,{'Retry-After':'900'});
        const username = await authenticate(body.username,body.password,env);
        if (!username) return json({error:'invalid_login'},401);
        return json({username},200,{'Set-Cookie':sessionCookie(issueSession(username,env))});
      }
      const session = validateSession(cookieValue(request),env);
      if (!session) return json({error:'unauthorized'},401);
      if (path === '/api/donations/admin/session' && request.method === 'GET') return json({username:session.username});
      if (path === '/api/donations/admin/logout' && request.method === 'POST') return json({ok:true},200,{'Set-Cookie':sessionCookie('',true)});
      if (path === '/api/donations/admin/messages' && request.method === 'GET' && dependencies.listMessages) {
        let page;
        try {
          page = await dependencies.listMessages(new URL(request.url).searchParams.get('cursor') ?? undefined);
        } catch (error) {
          if (error && typeof error === 'object' && 'status' in error && error.status === 400) return json({error:'invalid_cursor'},400);
          throw error;
        }
        return json({messages:page.messages.map(value => {
          const row = value as Record<string,unknown>;
          return {id:row.id,name:row.name,email:row.email,message:row.message,status:row.status,frequency:row.frequency,createdAt:row.createdAt};
        }),nextCursor:page.nextCursor});
      }
      const avatarPath = /^\/api\/donations\/admin\/profiles\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})\/avatar$/i.exec(path);
      if (avatarPath && request.method === 'GET' && dependencies.getAvatar) {
        const data = await dependencies.getAvatar(avatarPath[1]);
        // Immutable storage contains sanitized raster images, never URLs or redirects.
        if (!(data instanceof Uint8Array) || !data.length || data.length > 524288) return json({error:'not_found'},404);
        const bytes = Buffer.from(data);
        const mime = bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])) ? 'image/png'
          : bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255 ? 'image/jpeg'
          : bytes.toString('ascii',0,4) === 'RIFF' && bytes.toString('ascii',8,12) === 'WEBP' ? 'image/webp' : null;
        if (!mime) return json({error:'not_found'},404);
        return new Response(bytes,{headers:{...headers,'Content-Type':mime,'Content-Length':String(bytes.length)}});
      }
      if (path === '/api/donations/admin' && request.method === 'GET') {
        const state = new URL(request.url).searchParams.get('state') ?? 'pending';
        if (!['pending','approved','rejected','removed'].includes(state)) return json({error:'invalid_state'},400);
        const profiles = await dependencies.list(state as ProfileState);
        return json({profiles: profiles.map(value => {
          // Defense in depth: never serialize the storage object wholesale.
          const row = value as Record<string,unknown>;
          return {id:row.id,name:row.name,url:row.url,state:row.state,activity:row.activity,createdAt:row.createdAt,...(row.avatarId ? {avatarUrl:`/api/donations/admin/profiles/${row.id}/avatar`} : {})};
        })});
      }
      if (path === '/api/donations/admin' && request.method === 'POST') {
        const body = await readBoundedJson(request);
        if (typeof body.profileId !== 'string' || !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(body.profileId) ||
            typeof body.action !== 'string' || !['approve','reject','remove'].includes(body.action) ||
            (body.reason !== undefined && (typeof body.reason !== 'string' || body.reason.length > 500))) return json({error:'invalid_action'},400);
        await dependencies.moderate({profileId:body.profileId,action:body.action as ModerationAction,actor:session.username,...(typeof body.reason === 'string' ? {reason:body.reason.trim()} : {})});
        return json({ok:true});
      }
      return json({error:'not_found'},404);
    } catch (error) {
      if (error instanceof AdminRequestError) return json({error:error.message},error.status);
      // Canonical moderation owns eligibility; expose only its safe status, never storage text.
      if (error && typeof error === 'object' && 'status' in error) {
        if (error.status === 404) return json({error:'not_found'},404);
        if (error.status === 409) return json({error:'ineligible_profile'},409);
      }
      return json({error:'unavailable'},503);
    }
  };
}
