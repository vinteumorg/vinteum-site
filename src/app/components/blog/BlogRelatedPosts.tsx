"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { BlogPostCard } from "./BlogPostCard";
import type { GhostPost } from "@/lib/ghost";

interface BlogRelatedPostsProps {
    posts: GhostPost[];
}

export function BlogRelatedPosts({ posts }: BlogRelatedPostsProps) {
    const { t } = useLanguage();

    if (posts.length === 0) return null;

    return (
        <section className="w-full py-16 md:py-20 border-t border-primary/15">
            <div className="max-w-4xl mx-auto px-8 md:px-14 lg:px-20">
                <h2 className="font-rethink-sans text-2xl md:text-3xl font-normal text-foreground mb-8">
                    {t("blog.post.relatedTitle")}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {posts.map((post) => (
                        <BlogPostCard key={post.slug} post={post} />
                    ))}
                </div>
            </div>
        </section>
    );
}
