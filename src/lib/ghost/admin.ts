import crypto from "node:crypto";
import type { GhostNewsletter } from "./types";

function ghostAdminToken(adminApiKey: string): string {
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
