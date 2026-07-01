"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { SectionTitle } from "../shared/SectionTitle";
import { useScrollCarousel } from "@/hooks/useScrollCarousel";

export function CommunitySection() {
    const { t } = useLanguage();
    const { scrollRef, activeIndex, handleScroll, scrollToIndex } = useScrollCarousel("[data-mc]");

    const cards = [
        {
            titleKey: "community.cards.bitdevs.title",
            descKey: "community.cards.bitdevs.desc",
            href: "/bitdevs",
            target: "_self",
        },
        {
            titleKey: "community.cards.discord.title",
            descKey: "community.cards.discord.desc",
            href: "https://discord.com/invite/vinteum",
            target: "_blank",
        },
        {
            titleKey: "community.cards.casa21.title",
            descKey: "community.cards.casa21.desc",
            href: "https://casa21.vinteum.org/",
            target: "_self",
        },
    ];

    return (
        <section className="w-full py-12 md:py-28 overflow-hidden">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-8 md:px-14 lg:px-20 mb-16">
                <div className="flex flex-col items-center text-center gap-5">
                    <SectionTitle>{t("community.title")}</SectionTitle>
                    <p className="font-poppins text-foreground-secondary text-base md:text-lg">
                        {t("community.subtitle")}
                    </p>
                </div>
            </div>

            <div className="lg:hidden relative">
                <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex overflow-x-auto gap-4 px-[9%] pt-8 pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth"
                >
                    {cards.map((card, index) => {
                        const isActive = index === activeIndex;
                        return (
                            <div
                                key={card.titleKey}
                                data-mc
                                className={`snap-center flex flex-col justify-between border border-border rounded-2xl p-5 min-h-[380px] w-[82vw] flex-shrink-0 transition-transform duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${isActive ? "-translate-y-6 scale-[1.02]" : "translate-y-0 scale-100"}`}
                            >
                                <div className="flex flex-col gap-6">
                                    <h3 className="font-space-mono text-[1.4rem] font-normal text-foreground leading-snug">
                                        {t(card.titleKey)}
                                    </h3>
                                    <p className="font-poppins text-base leading-relaxed text-foreground/50">
                                        {t(card.descKey)}
                                    </p>
                                </div>
                                <Link
                                    href={card.href}
                                    target={card.target}
                                    rel={card.target === "_blank" ? "noopener noreferrer" : undefined}
                                    className="font-poppins text-primary text-base font-medium underline mt-8 inline-block"
                                >
                                    {t("community.learnMore")}
                                </Link>
                            </div>
                        );
                    })}
                </div>

                <div className="flex justify-center gap-2 mt-4">
                    {cards.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => scrollToIndex(i)}
                            aria-label={`Card ${i + 1}`}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                i === activeIndex ? "w-6 bg-[#91FFAE]" : "w-1.5 bg-white/30"
                            }`}
                        />
                    ))}
                </div>
            </div>

            <div className="hidden lg:flex max-w-7xl mx-auto px-20 gap-4 items-stretch">
                {cards.map((card, index) => {
                    const isCenter = index === 1;
                    return (
                        <div
                            key={card.titleKey}
                            className={`flex flex-col justify-between border border-border rounded-2xl p-8 min-h-[400px] flex-1 ${isCenter
                                ? "bg-background-surface shadow-[0_0_60px_-5px_rgba(145,255,174,0.18)]"
                                : "shadow-[0_24px_50px_-12px_rgba(0,0,0,0.6)]"
                                }`}
                        >
                            <div className="flex flex-col gap-6">
                                <h3 className="font-space-mono text-[1.4rem] font-normal text-foreground leading-snug">
                                    {t(card.titleKey)}
                                </h3>
                                <p className={`font-poppins text-base leading-relaxed ${isCenter ? "text-foreground/70" : "text-foreground/50"
                                    }`}>
                                    {t(card.descKey)}
                                </p>
                            </div>
                            <Link
                                href={card.href}
                                target={card.target}
                                rel={card.target === "_blank" ? "noopener noreferrer" : undefined}
                                className="font-poppins text-primary text-base font-medium underline mt-8 inline-block"
                            >
                                {t("community.learnMore")}
                            </Link>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
