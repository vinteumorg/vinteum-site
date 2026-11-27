import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { ensureMember } from "@/lib/ghost/members";
import { signConfirmation } from "@/lib/newsletter/confirm-token";
import { allowHit } from "@/lib/rate-limit";

// Newsletter signup creates a member record only; the subscription starts when
// the address owner opens the link we mail. A public endpoint that subscribes on
// request lets anyone add someone else's address to the list.
const LIMITS = { name: 120, email: 254, newsletters: 5 };

// Deliberately permissive: rejects only what is obviously not an address.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NEWSLETTER_ID = /^[a-f0-9]{24}$/i;

const IP_WINDOW_MS = 15 * 60 * 1000;
const IP_MAX = 5;
// A confirmation mail is sent before anyone proves they own the address, so the
// per-address cap is what keeps the form from being used to mail-bomb a person.
const EMAIL_WINDOW_MS = 24 * 60 * 60 * 1000;
const EMAIL_MAX = 3;

const asText = (value: unknown, max: number) =>
    typeof value === "string" ? value.replace(/[\r\n]+/g, " ").trim().slice(0, max) : "";

const escapeHtml = (value: string) =>
    value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

function clientIp(req: NextRequest): string {
    const forwarded = req.headers.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0].trim();
    return req.headers.get("x-real-ip")?.trim() || "unknown";
}

export async function POST(req: NextRequest) {
    const ghostUrl = process.env.GHOST_URL;
    const adminApiKey = process.env.GHOST_ADMIN_API_KEY;
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const confirmSecret = process.env.NEWSLETTER_CONFIRM_SECRET;

    if (!ghostUrl || !adminApiKey || !resendApiKey || !fromEmail || !confirmSecret) {
        return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    let body: Record<string, unknown>;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    // Honeypot: rendered off-screen and never filled by a human. Answer with
    // success so a bot cannot probe for the rule and retry without the field.
    if (asText(body.company, 1) !== "") {
        return NextResponse.json({ success: true });
    }

    if (!allowHit(`newsletter:ip:${clientIp(req)}`, IP_MAX, IP_WINDOW_MS)) {
        return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const email = asText(body.email, LIMITS.email).toLowerCase();
    const name = asText(body.name, LIMITS.name);

    if (!EMAIL.test(email)) {
        return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const requested = Array.isArray(body.newsletters) ? body.newsletters : [];
    const newsletters = [
        ...new Set(
            requested.filter(
                (id): id is string => typeof id === "string" && NEWSLETTER_ID.test(id)
            )
        ),
    ].slice(0, LIMITS.newsletters);

    if (newsletters.length === 0) {
        return NextResponse.json({ error: "No newsletter selected" }, { status: 400 });
    }

    // Silently accept instead of reporting the cap: telling a caller that an
    // address is throttled also tells them the address reached us before.
    if (!allowHit(`newsletter:email:${email}`, EMAIL_MAX, EMAIL_WINDOW_MS)) {
        return NextResponse.json({ success: true, pendingConfirmation: true });
    }

    const member = await ensureMember(email, name);
    if (!member) {
        return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
    }

    const token = signConfirmation({ memberId: member.id, email, newsletters });
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.vinteum.org").replace(/\/+$/, "");
    const confirmUrl = `${siteUrl}/api/newsletter/confirm?token=${encodeURIComponent(token)}`;

    const resend = new Resend(resendApiKey);
    const { error } = await resend.emails.send({
        from: fromEmail,
        to: email,
        replyTo: "newsletter@vinteum.org",
        subject: "Confirme sua inscrição na newsletter da Vinteum",
        text: [
            "Falta um passo para você receber a newsletter da Vinteum.",
            "",
            "Confirme sua inscrição abrindo este link:",
            confirmUrl,
            "",
            "Se você não pediu essa inscrição, ignore este e-mail: o endereço não será adicionado à lista.",
            "",
            "---",
            "",
            "One step left to receive the Vinteum newsletter.",
            "",
            "Confirm your subscription by opening this link:",
            confirmUrl,
            "",
            "If you did not request this, ignore this email and the address will not be added to the list.",
        ].join("\n"),
        html: [
            "<p>Falta um passo para você receber a newsletter da Vinteum.</p>",
            `<p><a href="${escapeHtml(confirmUrl)}">Confirmar inscrição</a></p>`,
            '<p style="color:#666">Se você não pediu essa inscrição, ignore este e-mail: o endereço não será adicionado à lista.</p>',
            "<hr/>",
            "<p>One step left to receive the Vinteum newsletter.</p>",
            `<p><a href="${escapeHtml(confirmUrl)}">Confirm subscription</a></p>`,
            '<p style="color:#666">If you did not request this, ignore this email and the address will not be added to the list.</p>',
        ].join(""),
    });

    if (error) {
        return NextResponse.json({ error: "Failed to send confirmation" }, { status: 500 });
    }

    return NextResponse.json({ success: true, pendingConfirmation: true });
}
