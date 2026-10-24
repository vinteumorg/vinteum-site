import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Well above anything a real enquiry needs, low enough that the endpoint cannot
// be used to mail megabytes of text or to burn through the Resend quota.
const LIMITS = { name: 120, email: 254, subject: 200, message: 5000 };

// Deliberately permissive: rejects only what is obviously not an address.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Single-line fields go into the subject header and the mail framing, so CR/LF
// is stripped rather than kept — a newline in `subject` is header injection.
const asText = (value: unknown, max: number) =>
    typeof value === "string" ? value.replace(/[\r\n]+/g, " ").trim().slice(0, max) : "";

const escapeHtml = (value: string) =>
    value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

export async function POST(req: NextRequest) {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const toEmail = process.env.RESEND_TO_EMAIL;

    if (!apiKey || !fromEmail || !toEmail) {
        return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    let body: Record<string, unknown>;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    // Honeypot: the form renders this field off-screen and no human fills it.
    // Answer with success rather than an error, so a bot cannot probe for the
    // rule and retry without it.
    if (asText(body.company, 1) !== "") {
        return NextResponse.json({ success: true });
    }

    const name = asText(body.name, LIMITS.name);
    const email = asText(body.email, LIMITS.email);
    const subject = asText(body.subject, LIMITS.subject);
    const message =
        typeof body.message === "string" ? body.message.trim().slice(0, LIMITS.message) : "";

    if (!name || !email || !subject || !message) {
        return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (!EMAIL.test(email)) {
        return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
        from: fromEmail,
        to: toEmail,
        replyTo: email,
        subject: `[Vinteum Contact] ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
        html: [
            `<p><strong>Name:</strong> ${escapeHtml(name)}</p>`,
            `<p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>`,
            "<hr/>",
            `<p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>`,
        ].join(""),
    });

    if (error) {
        return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
