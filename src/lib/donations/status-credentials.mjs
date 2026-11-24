import { check } from "./core.mjs";

/** Keep status capabilities out of request URLs, access logs and referrers. */
export function statusCredentials(request) {
  const query = new URL(request.url).searchParams;
  check(!query.has("token"), "Status credentials must not appear in URLs", 400);
  const authorization = request.headers.get("authorization") || "";
  const match = /^Bearer ([A-Za-z0-9_-]{32,100})$/.exec(authorization);
  check(match, "Status authorization required", 401);
  return { id: query.get("id"), token: match[1] };
}
