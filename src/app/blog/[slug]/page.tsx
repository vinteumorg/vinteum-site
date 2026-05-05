"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { use } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getPostBySlug, getRelatedPosts } from "../../../lib/blog";
import { BlogPostHero } from "../../components/blog/BlogPostHero";
import { BlogPostContent } from "../../components/blog/BlogPostContent";
import { BlogShareButtons } from "../../components/blog/BlogShareButtons";
import { BlogRelatedPosts } from "../../components/blog/BlogRelatedPosts";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default function BlogPostPage({ params }: PageProps) {
    const { slug } = use(params);
    const { t } = useLanguage();

    const post = getPostBySlug(slug);
    if (!post) notFound();

    const relatedPosts = getRelatedPosts(post);
    const postUrl = typeof window !== "undefined" ? window.location.href : `/blog/${slug}`;

    return (
        <div className="flex flex-col">
            {/* Hero with cover + breadcrumb */}
            <BlogPostHero post={post} />

            {/* Article body */}
            <div className="w-full py-14 md:py-20">
                <div className="max-w-4xl mx-auto px-8 md:px-14 lg:px-20 flex flex-col gap-12">
                    {/* Content */}
                    <BlogPostContent blocks={post.content} />

                    {/* Tags */}
                    {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-4 border-t border-primary/15">
                            {post.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center px-3 py-1 rounded-full bg-badge-bg border border-primary/20 font-space-mono text-xs text-primary"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Share */}
                    <BlogShareButtons title={post.title} url={postUrl} />

                    {/* Back to blog */}
                    <div className="pt-2">
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 font-space-mono text-sm text-foreground/50 hover:text-primary transition-colors"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            {t("blog.post.backToBlog")}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Related posts */}
            <BlogRelatedPosts posts={relatedPosts} />
        </div>
    );
}
