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
    const child = spawn(DEPLOY_SCRIPT, {
        detached: true,
        stdio: "ignore",
    });

    child.unref();
}

export async function GET() {
    return NextResponse.json({ ok: true, route: "deploy" });
}

export async function POST(request: NextRequest) {
    const payload = await request.text();
    const signature = request.headers.get("x-hub-signature-256");

    if (!verifySignature(payload, signature)) {
        return NextResponse.json({ ok: false, error: "invalid signature" }, { status: 401 });
    }

    const event = request.headers.get("x-github-event");

    if (event === "ping") {
        return NextResponse.json({ ok: true, event: "ping" });
    }

    if (event !== "push") {
        return NextResponse.json({ ok: true, ignored: true, reason: "unsupported event" });
    }

    let body: { ref?: string; deleted?: boolean };

    try {
        body = JSON.parse(payload);
    } catch {
        return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
    }

    if (body.ref !== DEPLOY_REF || body.deleted) {
        return NextResponse.json({ ok: true, ignored: true, ref: body.ref, deleted: body.deleted });
    }

    runDeploy();

    return NextResponse.json({ ok: true, deploying: true, ref: body.ref });
}
