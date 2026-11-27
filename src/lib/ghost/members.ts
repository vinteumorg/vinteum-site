import "server-only";
import { ghostAdminToken } from "./admin";

export interface GhostMemberRef {
    id: string;
    email: string;
}

interface MembersResponse {
    members?: { id: string; email: string }[];
}

function adminConfig(): { url: string; token: string } | null {
    const url = process.env.GHOST_URL;
    const key = process.env.GHOST_ADMIN_API_KEY;
    if (!url || !key) return null;
    return { url: `${url}/ghost/api/admin`, token: ghostAdminToken(key) };
}

async function ghostFetch(path: string, init: RequestInit = {}): Promise<Response> {
    const config = adminConfig();
    if (!config) throw new Error("Ghost Admin API is not configured");

    return fetch(`${config.url}${path}`, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Ghost ${config.token}`,
            ...(init.headers as Record<string, string> | undefined),
        },
        cache: "no-store",
    });
}

/**
 * Returns the member for `email`, creating a placeholder record when absent.
 * The member is created *without* any newsletter: being on the list only starts
 * after the address owner clicks the confirmation link.
 */
export async function ensureMember(email: string, name: string): Promise<GhostMemberRef | null> {
    const create = await ghostFetch("/members/", {
        method: "POST",
        body: JSON.stringify({ members: [{ email, ...(name ? { name } : {}) }] }),
    });

    if (create.ok) {
        const data = (await create.json()) as MembersResponse;
        const member = data.members?.[0];
        return member ? { id: member.id, email: member.email } : null;
    }

    // 422 is Ghost's "member already exists"; look it up instead of failing.
    if (create.status === 422) {
        const find = await ghostFetch(
            `/members/?filter=${encodeURIComponent(`email:'${email}'`)}`
        );
        if (!find.ok) return null;
        const data = (await find.json()) as MembersResponse;
        const member = data.members?.[0];
        return member ? { id: member.id, email: member.email } : null;
    }

    return null;
}

/**
 * Adds the member to the given newsletters. Ghost stores the subscription as a
 * relation, so repeating the call is idempotent.
 */
export async function subscribeMember(memberId: string, newsletterIds: string[]): Promise<boolean> {
    if (!/^[a-f0-9]{24}$/i.test(memberId)) return false;

    const res = await ghostFetch(`/members/${memberId}/`, {
        method: "PUT",
        body: JSON.stringify({
            members: [{ newsletters: newsletterIds.map((id) => ({ id })) }],
        }),
    });

    return res.ok;
}
