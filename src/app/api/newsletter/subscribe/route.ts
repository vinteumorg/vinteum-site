import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";

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

async function ghostAdminFetch(
    url: string,
    token: string,
    options: RequestInit = {}
): Promise<Response> {
    return fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Ghost ${token}`,
            ...(options.headers as Record<string, string>),
        },
        cache: "no-store",
    });
}

export async function POST(req: NextRequest) {
    const ghostUrl = process.env.GHOST_URL;
    const adminApiKey = process.env.GHOST_ADMIN_API_KEY;

    if (!ghostUrl || !adminApiKey) {
        return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    let body: { name?: string; email?: string; newsletters?: string[] };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { name, email, newsletters = [] } = body;

    if (!email || typeof email !== "string") {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const token = ghostAdminToken(adminApiKey);
    const apiBase = `${ghostUrl}/ghost/api/admin`;

    // newsletters[] now contains Ghost newsletter IDs directly — no name mapping needed
    const newsletterIds = newsletters.map((id) => ({ id }));

    const memberPayload = {
        members: [
            {
                email,
                ...(name ? { name } : {}),
                newsletters: newsletterIds,
            },
        ],
    };

    const createRes = await ghostAdminFetch(
        `${apiBase}/members/`,
        token,
        { method: "POST", body: JSON.stringify(memberPayload) }
    );

    if (createRes.ok) {
        return NextResponse.json({ success: true });
    }

    // Member already exists — update their newsletters
    if (createRes.status === 422) {
        const encoded = encodeURIComponent(`email:'${email}'`);
        const findRes = await ghostAdminFetch(
            `${apiBase}/members/?filter=${encoded}`,
            token
        );

        if (!findRes.ok) {
            return NextResponse.json({ error: "Member lookup failed" }, { status: 500 });
        }

        const findData = (await findRes.json()) as { members: { id: string }[] };
        const existing = findData.members[0];

        if (!existing) {
            return NextResponse.json({ error: "Member not found" }, { status: 500 });
        }

        const updateRes = await ghostAdminFetch(
            `${apiBase}/members/${existing.id}/`,
            token,
            {
                method: "PUT",
                body: JSON.stringify({ members: [{ newsletters: newsletterIds }] }),
            }
        );

        if (updateRes.ok) {
            return NextResponse.json({ success: true, updated: true });
        }

        return NextResponse.json({ error: "Failed to update member" }, { status: 500 });
    }

    return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
}
