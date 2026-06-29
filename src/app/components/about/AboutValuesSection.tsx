"use client";

import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { SectionTitle } from "../shared/SectionTitle";
import { useScrollCarousel } from "@/hooks/useScrollCarousel";

const VALUE_CARDS = [
    {
        icon: "/assets/icons/values/path.svg",
        titleKey: "about.values.cards.openSource.title",
        descKey: "about.values.cards.openSource.desc",
    },
    {
        icon: "/assets/icons/values/brain.svg",
        titleKey: "about.values.cards.longTerm.title",
        descKey: "about.values.cards.longTerm.desc",
    },
    {
        icon: "/assets/icons/values/bitcoin-refresh.svg",
        titleKey: "about.values.cards.bitcoinOnly.title",
        descKey: "about.values.cards.bitcoinOnly.desc",
    },
    {
        icon: "/assets/icons/values/globe.svg",
        titleKey: "about.values.cards.localEmpowerment.title",
        descKey: "about.values.cards.localEmpowerment.desc",
    },
    {
        icon: "/assets/icons/values/group.svg",
        titleKey: "about.values.cards.collaboration.title",
        descKey: "about.values.cards.collaboration.desc",
    },
];

export function AboutValuesSection() {
    const { t } = useLanguage();
    const { scrollRef, activeIndex, handleScroll, scrollToIndex } = useScrollCarousel("[data-mc]");

    return (
        <section className="relative w-full py-12 md:py-28 overflow-hidden">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-8 md:px-14 lg:px-20 mb-14">
                <div className="flex flex-col items-center text-center gap-5">
                    <SectionTitle>{t("about.values.title")}</SectionTitle>
                    <p className="font-poppins text-sm text-foreground-secondary leading-relaxed">
                        {t("about.values.subtitle")}
                    </p>
                </div>
            </div>

            {/* Cards — mobile/tablet: scroll horizontal com snap */}
            <div className="lg:hidden relative">
                <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex overflow-x-auto gap-4 px-[9%] pt-8 pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth"
                >
                    {VALUE_CARDS.map((card, index) => (
                        <div
                            key={`${card.titleKey}-${index}`}
                            data-mc
                            className="snap-center flex flex-col gap-6 border border-[#31422D] bg-transparent rounded-2xl p-6 min-h-[280px] w-[82vw] flex-shrink-0"
                        >
                            <div className="w-12 h-12 relative">
                                <Image
                                    src={card.icon}
                                    alt=""
                                    width={48}
                                    height={48}
                                    className="object-contain"
                                    aria-hidden="true"
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <h3 className="font-space-mono text-xl font-normal text-foreground">
                                    {t(card.titleKey)}
                                </h3>
                                <p className="font-poppins text-sm font-normal leading-relaxed text-foreground-secondary">
                                    {t(card.descKey)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center gap-2 mt-4">
                    {VALUE_CARDS.map((_, i) => (
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

            {/* Cards — desktop: linha 3 + linha 2 centralizados */}
            <div className="hidden lg:block max-w-7xl mx-auto px-20">
                <div className="grid grid-cols-3 gap-5">
                    {VALUE_CARDS.slice(0, 3).map((card) => (
                        <div
                            key={card.titleKey}
                            className="flex flex-col gap-6 border border-[#31422D] bg-transparent rounded-2xl p-6 min-h-[300px]"
                        >
                            <div className="w-12 h-12 relative">
                                <Image src={card.icon} alt="" width={48} height={48} className="object-contain" aria-hidden="true" />
                            </div>
                            <div className="flex flex-col gap-3">
                                <h3 className="font-space-mono text-xl font-normal text-foreground">{t(card.titleKey)}</h3>
                                <p className="font-poppins text-sm font-normal leading-relaxed text-foreground-secondary">{t(card.descKey)}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center gap-5 mt-5">
                    {VALUE_CARDS.slice(3).map((card) => (
                        <div
                            key={card.titleKey}
                            className="flex flex-col gap-6 border border-[#31422D] bg-transparent rounded-2xl p-6 min-h-[300px] w-[calc((100%-2.5rem)/3)]"
                        >
                            <div className="w-12 h-12 relative">
                                <Image src={card.icon} alt="" width={48} height={48} className="object-contain" aria-hidden="true" />
                            </div>
                            <div className="flex flex-col gap-3">
                                <h3 className="font-space-mono text-xl font-normal text-foreground">{t(card.titleKey)}</h3>
                                <p className="font-poppins text-sm font-normal leading-relaxed text-foreground-secondary">{t(card.descKey)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
