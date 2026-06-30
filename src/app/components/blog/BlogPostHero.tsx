"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatDate } from "@/lib/blog";
import type { GhostPost } from "@/lib/ghost";

interface BlogPostHeroProps {
    post: GhostPost;
}

export function BlogPostHero({ post }: BlogPostHeroProps) {
    const { t, locale } = useLanguage();

    return (
        <section className="relative w-full overflow-hidden">
            <Image
                src="/assets/backgrounds/hero-square.svg"
                alt=""
                fill
                priority
                className="object-cover object-center select-none pointer-events-none"
                aria-hidden="true"
            />
            <div
                className="absolute -top-[60px] left-1/2 -translate-x-1/2 w-[300px] h-[100px] rounded-[50%] bg-[#FFAE00]/60 blur-[60px] pointer-events-none select-none"
                aria-hidden="true"
            />

            <div className="relative z-10 max-w-4xl mx-auto px-8 md:px-14 lg:px-20 pt-24 pb-12 flex flex-col gap-6">
                {/* Breadcrumb */}
                <nav aria-label="breadcrumb">
                    <ol className="flex items-center flex-wrap gap-1.5 font-space-mono text-xs text-foreground/40">
                        <li>
                            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        </li>
                        <li className="flex items-center gap-1.5">
                            <span aria-hidden="true">/</span>
                            <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
                        </li>
                        <li className="flex items-center gap-1.5">
                            <span aria-hidden="true">/</span>
                            <span className="text-foreground/60" aria-current="page">
                                {post.title.length > 40 ? post.title.slice(0, 40) + "…" : post.title}
                            </span>
                        </li>
                    </ol>
                </nav>

                <h1 className="font-sk-concretica text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem] lg:text-[3.25rem] font-normal text-foreground uppercase leading-[0.95] tracking-tight">
                    {post.title}
                </h1>

                <p className="font-poppins text-foreground/70 text-base md:text-lg leading-relaxed max-w-2xl">
                    {post.custom_excerpt ?? post.excerpt}
                </p>

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                    <div className="flex items-center gap-2">
                        {(() => {
                            const author = post.primary_author ?? post.authors?.[0];
                            if (!author) return null;
                            return (
                                <>
                                    {author.profile_image ? (
                                        <div className="relative w-8 h-8 rounded-full overflow-hidden">
                                            <Image
                                                src={author.profile_image}
                                                alt={author.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                                            <span className="font-space-mono text-xs text-primary">
                                                {author.name.charAt(0)}
                                            </span>
                                        </div>
                                    )}
                                    <span className="font-poppins text-sm text-foreground">
                                        {author.name}
                                    </span>
                                </>
                            );
                        })()}
                    </div>

                    <div className="w-px h-4 bg-foreground/20" aria-hidden="true" />

                    <span className="font-space-mono text-xs text-foreground/50">
                        {t("blog.post.publishedOn")}{" "}
                        {formatDate(post.published_at, locale === "BR" ? "pt" : "en")}
                    </span>

                    <div className="w-px h-4 bg-foreground/20" aria-hidden="true" />

                    <span className="font-space-mono text-xs text-foreground/50">
                        {post.reading_time} {t("blog.readingTime")}
                    </span>
                </div>
            </div>

            {/* Cover image */}
            {post.feature_image && (
                <div className="relative z-10 max-w-4xl mx-auto px-8 md:px-14 lg:px-20 pb-0">
                    <div className="relative w-full aspect-[16/7] rounded-[24px] overflow-hidden border border-primary/20 shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
                        <Image
                            src={post.feature_image}
                            alt={post.feature_image_alt ?? post.title}
                            fill
                            priority
                            className="object-cover"
                            sizes="(max-width: 1280px) 100vw, 896px"
                        />
                    </div>
                </div>
            )}
        </section>
    );
}
