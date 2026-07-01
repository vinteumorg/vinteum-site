import crypto from "node:crypto";
import { spawn } from "node:child_process";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEPLOY_SCRIPT = "/home/exedev/vinteum-site/scripts/deploy-main.sh";
const DEPLOY_REF = "refs/heads/main";

function timingSafeEqual(a: string, b: string) {
    const aBuffer = Buffer.from(a);
    const bBuffer = Buffer.from(b);

    if (aBuffer.length !== bBuffer.length) {
        return false;
    }

    return crypto.timingSafeEqual(aBuffer, bBuffer);
}

function verifySignature(payload: string, signature: string | null) {
    const secret = process.env.GITHUB_WEBHOOK_SECRET;

    if (!secret || !signature?.startsWith("sha256=")) {
        return false;
    }

    const expectedSignature = `sha256=${crypto
        .createHmac("sha256", secret)
        .update(payload)
        .digest("hex")}`;

    return timingSafeEqual(signature, expectedSignature);
}

function runDeploy() {
    console.log("deploy webhook: starting deploy script");

    const child = spawn(DEPLOY_SCRIPT, {
        detached: true,
        stdio: "ignore",
    });

    child.unref();
}

function parseGitHubPayload(payload: string, contentType: string | null) {
    if (contentType?.includes("application/x-www-form-urlencoded")) {
        const form = new URLSearchParams(payload);
        const formPayload = form.get("payload");

        if (!formPayload) {
            throw new Error("missing form payload");
        }

        return JSON.parse(formPayload) as { ref?: string; deleted?: boolean };
    }

    return JSON.parse(payload) as { ref?: string; deleted?: boolean };
}

export async function GET() {
    return NextResponse.json({ ok: true, route: "deploy" });
}

export async function POST(request: NextRequest) {
    const payload = await request.text();
    const signature = request.headers.get("x-hub-signature-256");
    const event = request.headers.get("x-github-event");
    const contentType = request.headers.get("content-type");

    if (!verifySignature(payload, signature)) {
        console.warn("deploy webhook: invalid signature", { event, contentType });
        return NextResponse.json({ ok: false, error: "invalid signature" }, { status: 401 });
    }

    if (event === "ping") {
        console.log("deploy webhook: ping received", { contentType });
        return NextResponse.json({ ok: true, event: "ping" });
    }

    if (event !== "push") {
        console.log("deploy webhook: ignored unsupported event", { event, contentType });
        return NextResponse.json({ ok: true, ignored: true, reason: "unsupported event" });
    }

    let body: { ref?: string; deleted?: boolean };

    try {
        body = parseGitHubPayload(payload, contentType);
    } catch (error) {
        console.warn("deploy webhook: invalid payload", {
            contentType,
            error: error instanceof Error ? error.message : String(error),
        });
        return NextResponse.json({ ok: false, error: "invalid payload" }, { status: 400 });
    }

    if (body.ref !== DEPLOY_REF || body.deleted) {
        console.log("deploy webhook: ignored push", { ref: body.ref, deleted: body.deleted });
        return NextResponse.json({ ok: true, ignored: true, ref: body.ref, deleted: body.deleted });
    }

    console.log("deploy webhook: accepted push", { ref: body.ref });
    runDeploy();

    return NextResponse.json({ ok: true, deploying: true, ref: body.ref });
}
