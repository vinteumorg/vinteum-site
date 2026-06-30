import { NextRequest, NextResponse } from "next/server";

const BLOG_SUBDOMAIN = "blog";

function getSubdomain(host: string): string | null {
    // Dev:  "blog.localhost:3000" → "blog"
    if (host.includes("localhost")) {
        const prefix = host.split(".localhost")[0];
        return prefix !== host ? prefix : null;
    }
    // Prod: "blog.vinteum.org" → "blog"
    //       "vinteum.org"      → null  (only 2 parts, no subdomain)
    const parts = host.split(".");
    return parts.length > 2 ? parts[0] : null;
}

export function proxy(request: NextRequest) {
    const host = request.headers.get("host") ?? "";
    const subdomain = getSubdomain(host);

    if (subdomain !== BLOG_SUBDOMAIN) {
        return NextResponse.next();
    }

    const { pathname } = request.nextUrl;

    // Next.js Link components still generate hrefs like /blog/[slug] even
    // when running on the subdomain, so those requests must pass through
    // as-is — the route already exists at that path.
    if (pathname.startsWith("/blog")) {
        return NextResponse.next();
    }

    // Rewrite all other paths:
    //   /          → /blog       (listing page)
    //   /my-post   → /blog/my-post  (clean post URLs if linked directly)
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? "/blog" : `/blog${pathname}`;
    return NextResponse.rewrite(url);
}

export const config = {
    matcher: [
        // Skip Next.js internals, static files and assets
        "/((?!_next/static|_next/image|favicon\\.svg|icon\\.svg|fonts|assets|api).*)",
    ],
};
