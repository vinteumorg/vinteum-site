"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatDate } from "@/lib/blog";
import type { GhostPost } from "@/lib/ghost";

interface BlogPostCardProps {
    post: GhostPost;
    featured?: boolean;
}

export function BlogPostCard({ post, featured = false }: BlogPostCardProps) {
    const { t, locale } = useLanguage();
    const excerpt = post.custom_excerpt ?? post.excerpt ?? "";


    return (
        <Link
            href={`/blog/${post.slug}`}
            className="group flex flex-col rounded-[24px] border border-primary/20 overflow-hidden bg-[rgba(49,66,45,0.12)] backdrop-blur-sm shadow-[0_4px_24px_rgba(0,0,0,0.25)] hover:border-primary/50 hover:shadow-[0_8px_32px_rgba(145,255,174,0.08)] transition-all duration-300 h-full"
        >
            {/* Cover image */}
            <div className={`relative w-full overflow-hidden shrink-0 ${featured ? "aspect-[16/7]" : "aspect-[16/9]"}`}>
                {post.feature_image ? (
                    <Image
                        src={post.feature_image}
                        alt={post.feature_image_alt ?? post.title}
                        fill
                        loading="lazy"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-[rgba(49,66,45,0.3)] to-background flex items-center justify-center">
                        <span
                            className="font-sk-concretica text-primary/15 text-4xl md:text-5xl tracking-tight uppercase select-none"
                            aria-hidden="true"
                        >
                            Vinteum
                        </span>
                    </div>
                )}

                {post.primary_tag && (
                    <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm border border-primary/30 font-poppins text-xs text-primary">
                            {post.primary_tag.name}
                        </span>
                    </div>
                )}

                {post.featured && (
                    <div className="absolute top-4 right-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/20 border border-primary/40 font-poppins text-xs text-primary">
                            {t("blog.featured")}
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-6 gap-3">
                <span className="font-space-mono text-xs text-foreground/40">
                    {formatDate(post.published_at, locale === "BR" ? "pt" : "en")}
                </span>

                <h3 className={`font-rethink-sans font-normal text-foreground leading-[1.2] group-hover:text-primary transition-colors ${featured ? "text-2xl md:text-3xl" : "text-lg md:text-xl"}`}>
                    {post.title}
                </h3>

                <p className="font-poppins text-sm text-foreground/60 leading-relaxed flex-1">
                    {excerpt.length > 120 ? excerpt.slice(0, 120).trimEnd() + "…" : excerpt}
                </p>
            </div>
        </Link>
    );
}
