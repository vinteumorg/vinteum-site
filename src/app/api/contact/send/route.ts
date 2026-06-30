import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const toEmail = process.env.RESEND_TO_EMAIL;

    if (!apiKey || !fromEmail || !toEmail) {
        return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    let body: { name?: string; email?: string; subject?: string; message?: string };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
        return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
        from: fromEmail,
        to: toEmail,
        replyTo: email,
        subject: `[Vinteum Contact] ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
        html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p><hr/><p>${message.replace(/\n/g, "<br/>")}</p>`,
    });

    if (error) {
        return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
