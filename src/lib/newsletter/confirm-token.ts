import crypto from "node:crypto";

export interface NewsletterConfirmation {
    memberId: string;
    email: string;
    newsletters: string[];
    expiresAt: number;
}

const TTL_MS = 48 * 60 * 60 * 1000;

function secret(): string {
    const value = process.env.NEWSLETTER_CONFIRM_SECRET;
    if (!value || value.length < 32) {
        throw new Error("NEWSLETTER_CONFIRM_SECRET is missing or too short");
    }
    return value;
}

function sign(payload: string): string {
    return crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function confirmationTtlMs(): number {
    return TTL_MS;
}

/**
 * Builds a signed, self-contained confirmation token. Nothing is stored server
 * side, so a link keeps working across restarts and across the two machines
 * (site and Ghost) involved in the signup.
 */
export function signConfirmation(input: Omit<NewsletterConfirmation, "expiresAt">): string {
    const payload = Buffer.from(
        JSON.stringify({ ...input, expiresAt: Date.now() + TTL_MS }),
        "utf8"
    ).toString("base64url");

    return `${payload}.${sign(payload)}`;
}

export function verifyConfirmation(token: string): NewsletterConfirmation | null {
    const [payload, signature] = token.split(".");
    if (!payload || !signature) return null;

    const expected = sign(payload);
    const given = Buffer.from(signature);
    const want = Buffer.from(expected);
    if (given.length !== want.length || !crypto.timingSafeEqual(given, want)) return null;

    let data: NewsletterConfirmation;
    try {
        data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    } catch {
        return null;
    }

    if (
        !data ||
        typeof data.memberId !== "string" ||
        !/^[a-f0-9]{24}$/i.test(data.memberId) ||
        typeof data.email !== "string" ||
        typeof data.expiresAt !== "number" ||
        data.expiresAt < Date.now() ||
        !Array.isArray(data.newsletters) ||
        data.newsletters.some((id) => typeof id !== "string" || !/^[a-f0-9]{24}$/i.test(id))
    ) {
        return null;
    }

    return data;
}
