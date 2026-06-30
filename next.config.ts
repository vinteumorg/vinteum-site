import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
    images: {
        unoptimized: isDev,
        remotePatterns: [
            // Ghost local development
            { protocol: "http", hostname: "localhost", port: "2368" },
            // Ghost production
            { protocol: "https", hostname: "blog.vinteum.org" },
            { protocol: "https", hostname: "*.vinteum.org" },
            // Ghost default image sources
            { protocol: "https", hostname: "images.unsplash.com" },
            { protocol: "https", hostname: "static.ghost.org" },
        ],
    },
};

export default nextConfig;
