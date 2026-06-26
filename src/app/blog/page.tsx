"use client";

import { useState } from "react";
import { BlogHeroSection } from "../components/blog/BlogHeroSection";
import { BlogPostGrid } from "../components/blog/BlogPostGrid";

export default function BlogPage() {
    const [search, setSearch] = useState("");

    return (
        <div className="flex flex-col">
            <BlogHeroSection search={search} onSearchChange={setSearch} />
            <BlogPostGrid search={search} />
        </div>
    );
}
