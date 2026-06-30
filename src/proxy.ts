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

    // Strip the /blog prefix with a redirect so URLs stay clean.
    // Next.js Link components generate hrefs like /blog/cc even on the
    // subdomain; this redirect normalises them to /cc.
    //   blog.localhost:3000/blog/cc  → 308 → blog.localhost:3000/cc
    //   blog.localhost:3000/blog     → 308 → blog.localhost:3000/
    if (pathname.startsWith("/blog")) {
        const clean = pathname.slice("/blog".length) || "/";
        const url = request.nextUrl.clone();
        url.pathname = clean;
        return NextResponse.redirect(url, 308);
    }

    // Rewrite the clean path to the internal /blog/* Next.js route.
    //   /     → /blog         (listing page)
    //   /cc   → /blog/cc      (post page)
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
