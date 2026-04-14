"use client";

import Image from "next/image";
import { useRef, useState, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SectionTitle } from "../shared/SectionTitle";

type Card = {
    icon: string;
    titleKey: string;
    descKey: string;
};

const cards: Card[] = [
    {
        icon: "/assets/icons/ui/book.svg",
        titleKey: "launchpad.programStructure.cards.card1.title",
        descKey: "launchpad.programStructure.cards.card1.desc",
    },
    {
        icon: "/assets/icons/ui/link-external.svg",
        titleKey: "launchpad.programStructure.cards.card2.title",
        descKey: "launchpad.programStructure.cards.card2.desc",
    },
    {
        icon: "/assets/icons/ui/book-alt.svg",
        titleKey: "launchpad.programStructure.cards.card3.title",
        descKey: "launchpad.programStructure.cards.card3.desc",
    },
    {
        icon: "/assets/icons/ui/link-external-alt.svg",
        titleKey: "launchpad.programStructure.cards.card4.title",
        descKey: "launchpad.programStructure.cards.card4.desc",
    },
    {
        icon: "/assets/icons/ui/book.svg",
        titleKey: "launchpad.programStructure.cards.card5.title",
        descKey: "launchpad.programStructure.cards.card5.desc",
    },
];

export function LaunchpadProgramStructureSection() {
    const { t } = useLanguage();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        const items = Array.from(el.querySelectorAll<HTMLElement>("[data-sc]"));
        const origin = el.getBoundingClientRect().left;
        let nearest = 0;
        let nearestDist = Infinity;
        items.forEach((item, i) => {
            const dist = Math.abs(item.getBoundingClientRect().left - origin);
            if (dist < nearestDist) { nearestDist = dist; nearest = i; }
        });
        setActiveIndex(nearest);
    }, []);

    const scrollToCard = (i: number) => {
        const el = scrollRef.current;
        if (!el) return;
        const items = el.querySelectorAll<HTMLElement>("[data-sc]");
        const item = items[i];
        if (!item) return;
        el.scrollBy({ left: item.getBoundingClientRect().left - el.getBoundingClientRect().left, behavior: "smooth" });
    };

    const scroll = (direction: "left" | "right") => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollBy({ left: direction === "right" ? 320 : -320, behavior: "smooth" });
    };

    return (
        <section className="relative w-full py-12 md:py-28 overflow-hidden bg-background">
            <div className="max-w-7xl mx-auto px-8 md:px-14 lg:px-20">
                {/* Header */}
                <div className="flex flex-col items-center gap-4 mb-12">
                    <div className="relative w-full flex justify-center">
                        <SectionTitle className="text-center">{t("launchpad.programStructure.title")}</SectionTitle>
                        <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 gap-3">
                            <button
                                onClick={() => scroll("left")}
                                aria-label={t("launchpad.programStructure.prev")}
                                className="w-10 h-10 rounded-full flex items-center justify-center border border-border text-foreground hover:bg-white/5 transition-colors duration-200 cursor-pointer"
                            >
                                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                                    <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <button
                                onClick={() => scroll("right")}
                                aria-label={t("launchpad.programStructure.next")}
                                className="w-10 h-10 rounded-full flex items-center justify-center border border-border text-foreground hover:bg-white/5 transition-colors duration-200 cursor-pointer"
                            >
                                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                                    <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative">
                {/* Left fade gradient */}
                <div
                    className="absolute left-0 top-0 bottom-0 w-24 md:w-40 z-10 pointer-events-none bg-gradient-to-r from-[#0E0F0E] to-transparent"
                    aria-hidden="true"
                />
                {/* Right fade gradient */}
                <div
                    className="absolute right-0 top-0 bottom-0 w-24 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-[#0E0F0E] to-transparent"
                    aria-hidden="true"
                />

                {/* Scrollable row */}
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex gap-5 overflow-x-auto snap-x snap-mandatory md:snap-none scrollbar-hide pl-8 pr-8 md:pl-14 md:pr-14 lg:pl-20 lg:pr-20 xl:pl-[max(5rem,calc((100vw-80rem)/2+5rem))] xl:pr-[max(5rem,calc((100vw-80rem)/2+5rem))] pb-2 scroll-smooth"
                    style={{ scrollPaddingLeft: "2rem" }}
                >
                    {cards.map((card, i) => (
                        <div
                            key={i}
                            data-sc
                            className="relative flex-shrink-0 snap-start w-[calc(100vw-4rem)] md:w-[300px] min-h-[300px] md:min-h-[320px] rounded-2xl border border-[#91FFAE]/25 bg-[rgba(49,66,45,0.14)] p-8 flex flex-col items-start justify-center gap-6"
                        >
                            <Image
                                src={card.icon}
                                alt=""
                                width={72}
                                height={72}
                                aria-hidden="true"
                            />
                            <p className="font-space-mono text-xl font-normal text-foreground leading-[1.65] text-left">
                                {t(card.titleKey)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex md:hidden justify-center gap-2 mt-5">
                {cards.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => scrollToCard(i)}
                        aria-label={`Card ${i + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                            i === activeIndex ? "w-6 bg-[#91FFAE]" : "w-1.5 bg-white/30"
                        }`}
                    />
                ))}
            </div>
        </section>
    );
}
