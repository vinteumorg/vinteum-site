import crypto from "node:crypto";
import type { GhostNewsletter, GhostPost } from "./types";

export function ghostAdminToken(adminApiKey: string): string {
    const [id, secret] = adminApiKey.split(":");
    const header = Buffer.from(
        JSON.stringify({ alg: "HS256", typ: "JWT", kid: id })
    ).toString("base64url");
    const now = Math.floor(Date.now() / 1000);
    const payload = Buffer.from(
        JSON.stringify({ iat: now, exp: now + 300, aud: "/admin/" })
    ).toString("base64url");
    const signature = crypto
        .createHmac("sha256", Buffer.from(secret, "hex"))
        .update(`${header}.${payload}`)
        .digest("base64url");
    return `${header}.${payload}.${signature}`;
}

export async function getNewsletters(): Promise<GhostNewsletter[]> {
    const ghostUrl = process.env.GHOST_URL;
    const adminApiKey = process.env.GHOST_ADMIN_API_KEY;

    if (!ghostUrl || !adminApiKey) return [];

    const token = ghostAdminToken(adminApiKey);

    const res = await fetch(
        `${ghostUrl}/ghost/api/admin/newsletters/?limit=all&filter=status:active`,
        {
            headers: {
                Authorization: `Ghost ${token}`,
                "Content-Type": "application/json",
            },
            next: { revalidate: 300 },
        }
    );

    if (!res.ok) return [];

    const data = (await res.json()) as { newsletters: GhostNewsletter[] };
    return data.newsletters.filter((nl) => nl.status === "active");
}

// Ghost's "Preview" button in the editor links to `{siteUrl}/p/:uuid/` — the
// uuid is the only identifier it passes, and the Admin API has no
// `/posts/uuid/:uuid/` path endpoint, so we look it up via `filter` instead.
export async function getPostByUuidAdmin(uuid: string): Promise<GhostPost | null> {
    const ghostUrl = process.env.GHOST_URL;
    const adminApiKey = process.env.GHOST_ADMIN_API_KEY;

    if (!ghostUrl || !adminApiKey) return null;

    const token = ghostAdminToken(adminApiKey);

    const res = await fetch(
        `${ghostUrl}/ghost/api/admin/posts/?filter=${encodeURIComponent(`uuid:${uuid}`)}&include=authors,tags&formats=html`,
        {
            headers: {
                Authorization: `Ghost ${token}`,
                "Content-Type": "application/json",
            },
            next: { revalidate: 0 },
        }
    );

    if (!res.ok) throw new Error(`Ghost Admin API error ${res.status}: ${res.statusText}`);

    const data = await res.json();
    const post = data.posts?.[0] ?? null;
    return post;
}
