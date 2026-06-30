"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { SectionTitle } from "../shared/SectionTitle";
import { useScrollCarousel } from "@/hooks/useScrollCarousel";

interface Program {
    titleKey: string;
    descKey: string;
    image: string;
    link: string;
}

const programs: Program[] = [
    {
        titleKey: "programs.cards.mastering.title",
        descKey: "programs.cards.mastering.desc",
        image: "/assets/images/programs/mastering.png",
        link: "/programs/mastering-seminars",
    },
    {
        titleKey: "programs.cards.launchpad.title",
        descKey: "programs.cards.launchpad.desc",
        image: "/assets/images/programs/launchpad.png",
        link: "/programs/bitcoin-dev-launchpad",
    },
    {
        titleKey: "programs.cards.fellowship.title",
        descKey: "programs.cards.fellowship.desc",
        image: "/assets/images/programs/fellowship.png",
        link: "/programs/fellowship",
    },
    {
        titleKey: "programs.cards.grants.title",
        descKey: "programs.cards.grants.desc",
        image: "/assets/images/programs/grants.png",
        link: "/programs/grants",
    },
];


export function ProgramsSection() {
    const { t } = useLanguage();

    const [currentIndex, setCurrentIndex] = useState(1);

    // Desktop: native scroll carousel — browser handles trackpad gestures naturally
    const desktopScrollRef = useRef<HTMLDivElement>(null);

    const handleDesktopScroll = useCallback(() => {
        const el = desktopScrollRef.current;
        if (!el) return;
        const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-dc]"));
        const center = el.scrollLeft + el.clientWidth / 2;
        let nearest = 0, nearestDist = Infinity;
        cards.forEach((card, i) => {
            const dist = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
            if (dist < nearestDist) { nearestDist = dist; nearest = i; }
        });
        setCurrentIndex(nearest);
    }, []);

    const scrollDesktopTo = useCallback((i: number) => {
        const el = desktopScrollRef.current;
        if (!el) return;
        const cards = el.querySelectorAll<HTMLElement>("[data-dc]");
        const card = cards[i];
        if (!card) return;
        el.scrollTo({ left: card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2, behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollDesktopTo(1);
    }, [scrollDesktopTo]);

    // Mobile: snap-scroll carousel
    const { scrollRef: mobileRef, activeIndex: mobileIndex, handleScroll: handleMobileScroll, scrollToIndex: scrollMobileTo } = useScrollCarousel("[data-mc]");

    return (
        <section className="w-full py-12 md:py-28">
            {/* Header */}
            <div className="flex flex-col items-center px-8 md:px-14 lg:px-20 max-w-7xl mx-auto">
                <SectionTitle className="text-center">{t("programs.title")}</SectionTitle>
            </div>

            {/* ── Mobile ── */}
            <div className="md:hidden relative mt-10">
                <div className="absolute left-0 top-0 w-16 h-full bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 w-16 h-full bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

                <div
                    ref={mobileRef}
                    onScroll={handleMobileScroll}
                    className="flex overflow-x-auto gap-4 px-[9%] pt-8 pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth"
                >
                    {programs.map((program, index) => {
                        const isActive = index === mobileIndex;
                        return (
                            <div
                                key={program.titleKey}
                                data-mc
                                className={`snap-center w-[82vw] flex-shrink-0 h-[480px] rounded-[30px] overflow-hidden relative transition-transform duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${isActive ? "-translate-y-6 scale-[1.02]" : "translate-y-0 scale-100"
                                    }`}
                            >
                                <Image src={program.image} alt={t(program.titleKey)} fill className="object-cover z-[1]" />
                                <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-gradient-to-t from-background via-background/80 to-transparent z-[2]" />
                                <div className="absolute bottom-0 left-0 right-0 p-6 z-[3]">
                                    <h3 className="font-sk-concretica text-xl text-white mb-3">{t(program.titleKey)}</h3>
                                    <p className="font-poppins text-sm leading-relaxed text-gray-300 mb-4">{t(program.descKey)}</p>
                                    <a href={program.link} className="font-poppins inline-block text-sm font-semibold no-underline transition-colors duration-200 text-[#91FFAE] hover:text-[#a8ffbf]">
                                        {t("programs.learnMore")} →
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex justify-center gap-2 mt-4">
                    {programs.map((_, i) => (
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

            {/* ── Desktop ── */}
            <div className="hidden md:block relative mt-14">
                <div className="absolute inset-0 h-[620px] pointer-events-none select-none overflow-hidden">
                    <Image src="/assets/backgrounds/programs-section.svg" alt="" fill className="object-cover object-top" aria-hidden="true" />
                </div>

                <div className="relative z-10">
                    {/* Navigation buttons */}
                    <div className="flex justify-center gap-3 pb-8">
                        <button
                            onClick={() => scrollDesktopTo(currentIndex - 1)}
                            disabled={currentIndex === 0}
                            aria-label={t("programs.prev")}
                            className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 backdrop-blur-sm hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 bg-[rgba(27,50,35,0.8)] border-2 border-[rgba(145,255,174,0.3)] text-[#91FFAE] hover:bg-[rgba(27,50,35,1)] hover:border-[#91FFAE]"
                        >
                            <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                                <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <button
                            onClick={() => scrollDesktopTo(currentIndex + 1)}
                            disabled={currentIndex === programs.length - 1}
                            aria-label={t("programs.next")}
                            className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 backdrop-blur-sm hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 bg-[rgba(27,50,35,0.8)] border-2 border-[rgba(145,255,174,0.3)] text-[#91FFAE] hover:bg-[rgba(27,50,35,1)] hover:border-[#91FFAE]"
                        >
                            <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                                <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>

                    <div className="relative h-[560px]">
                        <div className="absolute left-0 top-0 w-40 h-full bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                        <div className="absolute right-0 top-0 w-40 h-full bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

                        <div
                            ref={desktopScrollRef}
                            onScroll={handleDesktopScroll}
                            className="flex gap-6 overflow-x-auto scrollbar-hide h-full items-start pt-8"
                            style={{ paddingLeft: "calc(50% - 210px)", paddingRight: "calc(50% - 210px)" }}
                        >
                            {programs.map((program, index) => {
                                const isActive = index === currentIndex;
                                return (
                                    <div
                                        key={index}
                                        data-dc
                                        className={`flex-shrink-0 w-[420px] h-[500px] rounded-[30px] overflow-hidden relative transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isActive ? "scale-100 opacity-100 -translate-y-8" : "scale-[0.9] opacity-60 translate-y-0"
                                            }`}
                                    >
                                        <Image src={program.image} alt={t(program.titleKey)} fill className="object-cover z-[1]" />
                                        <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-gradient-to-t from-background via-background/80 to-transparent z-[2]" />
                                        <div className="absolute bottom-0 left-0 right-0 p-6 z-[3]">
                                            <h3 className="font-sk-concretica text-2xl text-white mb-3">{t(program.titleKey)}</h3>
                                            <p className="font-poppins text-sm leading-relaxed text-gray-300 mb-4">{t(program.descKey)}</p>
                                            <a href={program.link} className="font-poppins inline-block text-sm font-semibold no-underline transition-colors duration-200 text-[#91FFAE] hover:text-[#a8ffbf]">
                                                {t("programs.learnMore")} →
                                            </a>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
