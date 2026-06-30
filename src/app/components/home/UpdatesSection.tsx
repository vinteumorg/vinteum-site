"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { SectionTitle } from "../shared/SectionTitle";
import { useScrollCarousel } from "@/hooks/useScrollCarousel";
import { formatDate } from "@/lib/blog";
import type { GhostPost } from "@/lib/ghost";

interface UpdatesSectionProps {
    posts: GhostPost[];
}

const VISIBLE_COUNT = 4;

export function UpdatesSection({ posts }: UpdatesSectionProps) {
    const { t, locale } = useLanguage();

    // Desktop navigation
    const [startIndex, setStartIndex] = useState(0);
    const maxIndex = Math.max(posts.length - VISIBLE_COUNT, 0);
    const canGoPrev = startIndex > 0;
    const canGoNext = startIndex < maxIndex;
    const goPrev = () => setStartIndex((i) => Math.max(i - 1, 0));
    const goNext = () => setStartIndex((i) => Math.min(i + 1, maxIndex));
    const visiblePosts = posts.slice(startIndex, startIndex + VISIBLE_COUNT);

    // Mobile scroll
    const { scrollRef: mobileRef, activeIndex: mobileIndex, handleScroll: handleMobileScroll, scrollToIndex: scrollMobileTo } = useScrollCarousel("[data-mc]");

    if (posts.length === 0) return null;

    return (
        <section className="relative z-10 w-full py-12 md:py-28 overflow-hidden">
            <div className="max-w-7xl mx-auto px-8 md:px-14 lg:px-20">
                <div className="flex items-center justify-between gap-4 mb-10 md:mb-12">
                    <SectionTitle>{t("updates.title")}</SectionTitle>

                    <div className="hidden md:flex gap-3 shrink-0">
                        <button
                            onClick={goPrev}
                            disabled={!canGoPrev}
                            aria-label={t("updates.prev")}
                            className="w-12 h-12 rounded-full border border-border-subtle flex items-center justify-center text-foreground/50 hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-border-subtle disabled:hover:text-foreground/50"
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <button
                            onClick={goNext}
                            disabled={!canGoNext}
                            aria-label={t("updates.next")}
                            className="w-12 h-12 rounded-full border border-primary flex items-center justify-center text-primary hover:bg-primary/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="hidden md:grid md:grid-cols-4 gap-4 w-full">
                    {visiblePosts.map((post, i) => (
                        <Link
                            key={post.id}
                            href={`/blog/${post.slug}`}
                            className="group border border-border rounded-2xl overflow-hidden bg-background-surface transition-colors hover:border-primary/40"
                        >
                            <div className="relative w-full aspect-[4/3] overflow-hidden bg-badge-bg">
                                {post.feature_image ? (
                                    <Image
                                        src={post.feature_image}
                                        alt={post.feature_image_alt ?? post.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        sizes="(max-width: 1280px) 25vw, 280px"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                                        <span className="font-space-mono text-primary/30 text-xs uppercase tracking-widest">Vinteum</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-5 flex flex-col gap-1.5">
                                <h3 className="font-space-mono text-base font-normal text-foreground leading-snug line-clamp-2">
                                    {post.title}
                                </h3>
                                <span className="font-poppins text-foreground/50 text-sm">
                                    {formatDate(post.published_at, locale === "BR" ? "pt" : "en")}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="md:hidden relative mt-10">
                <div className="absolute left-0 top-0 w-16 h-full bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 w-16 h-full bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

                <div
                    ref={mobileRef}
                    onScroll={handleMobileScroll}
                    className="flex overflow-x-auto gap-4 px-[9%] pt-8 pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth"
                >
                    {posts.map((post, index) => {
                        const isActive = index === mobileIndex;
                        return (
                            <Link
                                key={post.id}
                                data-mc
                                href={`/blog/${post.slug}`}
                                className={`snap-center w-[82vw] flex-shrink-0 group border border-border rounded-2xl overflow-hidden bg-background-surface transition-transform duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${isActive ? "-translate-y-6 scale-[1.02]" : "translate-y-0 scale-100"}`}
                            >
                                <div className="relative w-full aspect-[4/3] overflow-hidden bg-badge-bg">
                                    {post.feature_image ? (
                                        <Image
                                            src={post.feature_image}
                                            alt={post.feature_image_alt ?? post.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            sizes="82vw"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                                            <span className="font-space-mono text-primary/30 text-xs uppercase tracking-widest">Vinteum</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-5 flex flex-col gap-1.5">
                                    <h3 className="font-space-mono text-base font-normal text-foreground leading-snug line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <span className="font-poppins text-foreground/50 text-sm">
                                        {formatDate(post.published_at, locale === "BR" ? "pt" : "en")}
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <div className="flex justify-center gap-2 mt-4">
                    {posts.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => scrollMobileTo(i)}
                            aria-label={`Card ${i + 1}`}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                i === mobileIndex ? "w-6 bg-[#91FFAE]" : "w-1.5 bg-white/30"
                            }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
