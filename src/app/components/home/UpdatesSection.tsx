"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { SectionTitle } from "../shared/SectionTitle";

interface Post {
    title: string;
    date: string;
    image: string;
    href: string;
}

const VISIBLE_COUNT = 4;

export function UpdatesSection() {
    const { t } = useLanguage();
    const [startIndex, setStartIndex] = useState(0);
    const [mobileIndex, setMobileIndex] = useState(0);
    const mobileRef = useRef<HTMLDivElement>(null);
    const snapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const posts: Post[] = [
        {
            title: "Nome da notícia",
            date: "01/09/2025",
            image: "/assets/images/blog/post-placeholder.png",
            href: "/blog/post-1",
        },
        {
            title: "Nome da notícia",
            date: "01/10/2025",
            image: "/assets/images/blog/post-placeholder.png",
            href: "/blog/post-2",
        },
        {
            title: "Nome da notícia",
            date: "01/11/2025",
            image: "/assets/images/blog/post-placeholder.png",
            href: "/blog/post-3",
        },
        {
            title: "Nome da notícia",
            date: "01/12/2025",
            image: "/assets/images/blog/post-placeholder.png",
            href: "/blog/post-4",
        },
    ];

    // Desktop navigation
    const maxIndex = Math.max(posts.length - VISIBLE_COUNT, 0);
    const canGoPrev = startIndex > 0;
    const canGoNext = startIndex < maxIndex;
    const goPrev = () => setStartIndex((i) => Math.max(i - 1, 0));
    const goNext = () => setStartIndex((i) => Math.min(i + 1, maxIndex));
    const visiblePosts = posts.slice(startIndex, startIndex + VISIBLE_COUNT);

    useEffect(() => {
        const el = mobileRef.current;
        if (!el) return;

        const updateActive = () => {
            const cardEls = el.querySelectorAll<HTMLElement>("[data-mc]");
            const center = el.scrollLeft + el.offsetWidth / 2;
            let best = 0;
            let bestDist = Infinity;
            cardEls.forEach((c, i) => {
                const dist = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center);
                if (dist < bestDist) { bestDist = dist; best = i; }
            });
            setMobileIndex(best);
        };

        const onScroll = () => {
            if (snapTimer.current) clearTimeout(snapTimer.current);
            snapTimer.current = setTimeout(updateActive, 50);
        };

        el.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            el.removeEventListener("scroll", onScroll);
            if (snapTimer.current) clearTimeout(snapTimer.current);
        };
    }, []);

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
                            key={startIndex + i}
                            href={post.href}
                            className="group border border-border rounded-2xl overflow-hidden bg-background-surface transition-colors hover:border-primary/40"
                        >
                            <div className="relative w-full aspect-[4/3] overflow-hidden">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <div className="p-5 flex flex-col gap-1.5">
                                <h3 className="font-space-mono text-base font-normal text-foreground leading-snug">
                                    {post.title}
                                </h3>
                                <span className="font-poppins text-foreground/50 text-sm">
                                    {post.date}
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
                    className="flex overflow-x-auto gap-4 px-[9%] pt-8 pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth"
                >
                    {posts.map((post, index) => {
                        const isActive = index === mobileIndex;
                        return (
                            <Link
                                key={post.href}
                                data-mc
                                href={post.href}
                                className={`snap-center w-[82vw] flex-shrink-0 group border border-border rounded-2xl overflow-hidden bg-background-surface transition-transform duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${isActive ? "-translate-y-6 scale-[1.02]" : "translate-y-0 scale-100"}`}
                            >
                                <div className="relative w-full aspect-[4/3] overflow-hidden">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="p-5 flex flex-col gap-1.5">
                                    <h3 className="font-space-mono text-base font-normal text-foreground leading-snug">
                                        {post.title}
                                    </h3>
                                    <span className="font-poppins text-foreground/50 text-sm">
                                        {post.date}
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <div className="flex justify-center gap-2 mt-4">
                    {posts.map((_, i) => (
                        <span
                            key={i}
                            className={`block rounded-full transition-all duration-300 ${i === mobileIndex
                                ? "w-5 h-2 bg-primary"
                                : "w-2 h-2 bg-foreground/20"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
