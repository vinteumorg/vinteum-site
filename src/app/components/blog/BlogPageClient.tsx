"use client";

import { useState } from "react";
import { BlogHeroSection } from "./BlogHeroSection";
import { BlogPostGrid } from "./BlogPostGrid";
import type { GhostPost } from "@/lib/ghost";

interface BlogPageClientProps {
    posts: GhostPost[];
    featuredPost: GhostPost | null;
}

export function BlogPageClient({ posts, featuredPost }: BlogPageClientProps) {
    const [search, setSearch] = useState("");

    return (
        <>
            <BlogHeroSection search={search} onSearchChange={setSearch} />
            <BlogPostGrid posts={posts} featuredPost={featuredPost} search={search} />
        </>
    );
}
