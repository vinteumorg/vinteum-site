import { NextRequest, NextResponse } from "next/server";
import { subscribeMember } from "@/lib/ghost/members";
import { verifyConfirmation } from "@/lib/newsletter/confirm-token";

const siteUrl = () => (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.vinteum.org").replace(/\/+$/, "");

// The link in the confirmation email points here. Opening it is what adds the
// address to the newsletter, so a forged signup never reaches the list.
export async function GET(req: NextRequest) {
    const token = req.nextUrl.searchParams.get("token") ?? "";
    const base = siteUrl();

    const confirmation = verifyConfirmation(token);
    if (!confirmation) {
        return NextResponse.redirect(`${base}/newsletter/confirmed?status=invalid`, 303);
    }

    const subscribed = await subscribeMember(confirmation.memberId, confirmation.newsletters);

    return NextResponse.redirect(
        `${base}/newsletter/confirmed?status=${subscribed ? "ok" : "error"}`,
        303
    );
}
