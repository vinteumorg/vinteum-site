"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { SectionTitle } from "../shared/SectionTitle";

type Testimonial = {
    quoteKey: string;
    nameKey: string;
    cohortKey: string;
    image: string;
};

const TESTIMONIALS: Testimonial[] = [
    {
        quoteKey: "launchpad.testimonials.items.item1.quote",
        nameKey: "launchpad.testimonials.items.item1.name",
        cohortKey: "launchpad.testimonials.items.item1.cohort",
        image: "/assets/images/people/fellows/caio.jpg",
    },
    {
        quoteKey: "launchpad.testimonials.items.item2.quote",
        nameKey: "launchpad.testimonials.items.item2.name",
        cohortKey: "launchpad.testimonials.items.item2.cohort",
        image: "/assets/images/people/fellows/erickcestari.jpg",
    },
    {
        quoteKey: "launchpad.testimonials.items.item3.quote",
        nameKey: "launchpad.testimonials.items.item3.name",
        cohortKey: "launchpad.testimonials.items.item3.cohort",
        image: "/assets/images/people/fellows/moisespompilio.jpg",
    },
    {
        quoteKey: "launchpad.testimonials.items.item4.quote",
        nameKey: "launchpad.testimonials.items.item4.name",
        cohortKey: "launchpad.testimonials.items.item4.cohort",
        image: "/assets/images/people/fellows/lucasbalieiro.jpg",
    },
];

export function LaunchpadTestimonialsSection() {
    const { t } = useLanguage();
    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState<"left" | "right">("right");
    const mobileScrollRef = useRef<HTMLDivElement>(null);

    const canGoPrev = index > 0;
    const canGoNext = index < TESTIMONIALS.length - 1;

    const goPrev = () => { setDirection("left"); setIndex((i) => Math.max(i - 1, 0)); };
    const goNext = () => { setDirection("right"); setIndex((i) => Math.min(i + 1, TESTIMONIALS.length - 1)); };

    const current = TESTIMONIALS[index];
    const peek = index < TESTIMONIALS.length - 1 ? TESTIMONIALS[index + 1] : null;

    const handleMobileScroll = useCallback(() => {
        const el = mobileScrollRef.current;
        if (!el) return;
        const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-card]"));
        const origin = el.getBoundingClientRect().left;
        let nearest = 0;
        let nearestDist = Infinity;
        cards.forEach((card, i) => {
            const dist = Math.abs(card.getBoundingClientRect().left - origin);
            if (dist < nearestDist) { nearestDist = dist; nearest = i; }
        });
        setIndex(nearest);
    }, []);

    const scrollMobileTo = (i: number) => {
        const el = mobileScrollRef.current;
        if (!el) return;
        const cards = el.querySelectorAll<HTMLElement>("[data-card]");
        const card = cards[i];
        if (!card) return;
        el.scrollBy({ left: card.getBoundingClientRect().left - el.getBoundingClientRect().left, behavior: "smooth" });
    };

    return (
        <section className="relative w-full py-12 md:py-28">
            {/* Gradient blur decoration — center */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full blur-[140px] opacity-25 pointer-events-none testimonials-blur"
                aria-hidden="true"
            />

            <div className="hidden md:block">
                <div className="relative z-10 w-full flex flex-col md:flex-row items-start gap-10 md:gap-16 pl-6 md:pl-[max(3rem,calc((100vw-80rem)/2+3rem))] lg:pl-[max(4rem,calc((100vw-80rem)/2+4rem))] pr-0">

                    <div className="w-full md:w-[35%] shrink-0 flex flex-col justify-between md:self-stretch">
                        <SectionTitle>{t("launchpad.testimonials.title")}</SectionTitle>

                        {/* Arrows */}
                        <div className="flex gap-3 mt-10 md:mt-0">
                            <button
                                onClick={goPrev}
                                disabled={!canGoPrev}
                                aria-label={t("launchpad.testimonials.prev")}
                                className="w-10 h-10 rounded-full flex items-center justify-center border border-[#91FFAE]/60 text-foreground hover:bg-white/5 transition-colors duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                            >
                                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                                    <path d="M12.5 15L7.5 10L12.5 5" stroke="#91FFAE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <button
                                onClick={goNext}
                                disabled={!canGoNext}
                                aria-label={t("launchpad.testimonials.next")}
                                className="w-10 h-10 rounded-full flex items-center justify-center border border-[#91FFAE] text-foreground hover:bg-[#91FFAE]/10 transition-colors duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                            >
                                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                                    <path d="M7.5 5L12.5 10L7.5 15" stroke="#91FFAE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="w-full md:flex-1 min-w-0 overflow-hidden">
                        <div
                            key={`${index}-${direction}`}
                            className={`flex gap-5 ${direction === "right" ? "alumni-enter-right" : "alumni-enter-left"}`}
                        >
                            {/* Current card */}
                            <div className="min-w-[90%] md:min-w-[78%]">
                                <TestimonialCard
                                    quote={t(current.quoteKey)}
                                    name={t(current.nameKey)}
                                    cohort={t(current.cohortKey)}
                                    image={current.image}
                                />
                            </div>

                            {peek ? (
                                <div className="min-w-[90%] md:min-w-[78%] opacity-40 pointer-events-none select-none">
                                    <TestimonialCard
                                        quote={t(peek.quoteKey)}
                                        name={t(peek.nameKey)}
                                        cohort={t(peek.cohortKey)}
                                        image={peek.image}
                                    />
                                </div>
                            ) : (
                                <div className="hidden md:block md:min-w-[5rem] shrink-0" aria-hidden="true" />
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* ── Mobile ── */}
            <div className="md:hidden relative z-10 w-full flex flex-col gap-6">
                <div className="pl-8">
                    <SectionTitle>{t("launchpad.testimonials.title")}</SectionTitle>
                </div>

                {/* Scrollable cards with snap */}
                <div
                    ref={mobileScrollRef}
                    onScroll={handleMobileScroll}
                    className="flex gap-4 overflow-x-auto snap-x snap-mandatory pl-8"
                    style={{ scrollbarWidth: "none", scrollPaddingLeft: "2rem" }}
                >
                    {TESTIMONIALS.map((item, i) => (
                        <div key={i} data-card className="w-[90%] shrink-0 snap-start">
                            <TestimonialCard
                                quote={t(item.quoteKey)}
                                name={t(item.nameKey)}
                                cohort={t(item.cohortKey)}
                                image={item.image}
                            />
                        </div>
                    ))}
                    <div className="min-w-8 shrink-0" aria-hidden="true" />
                </div>

                {/* Dot indicators */}
                <div className="flex gap-2 justify-center items-center">
                    {TESTIMONIALS.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => scrollMobileTo(i)}
                            aria-label={`Testimonial ${i + 1}`}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                i === index ? "w-6 bg-[#91FFAE]" : "w-1.5 bg-white/30"
                            }`}
                        />
                    ))}
                </div>
            </div>

        </section>
    );
}

function TestimonialCard({
    quote,
    name,
    cohort,
    image,
}: {
    quote: string;
    name: string;
    cohort: string;
    image: string;
}) {
    const [imgError, setImgError] = useState(false);
    const initials = name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase();

    return (
        <div className="rounded-2xl border border-[#31422D] bg-[#31422D]/[0.17] backdrop-blur-sm p-8 md:p-10 flex flex-col justify-between h-[400px]">
            <p className="font-space-mono text-base md:text-lg font-normal text-foreground leading-[1.7]">
                {quote}
            </p>
            <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 shrink-0 rounded-xl overflow-hidden border border-[#31422D]">
                    {imgError ? (
                        <div className="w-full h-full bg-primary flex items-center justify-center">
                            <span className="font-rethink text-background text-lg font-semibold select-none">
                                {initials}
                            </span>
                        </div>
                    ) : (
                        <Image
                            src={image}
                            alt={name}
                            fill
                            className="object-cover"
                            sizes="56px"
                            onError={() => setImgError(true)}
                        />
                    )}
                </div>
                <div className="flex flex-col gap-0.5">
                    <p className="font-inter text-base font-medium text-foreground leading-tight">
                        {name}
                    </p>
                    <p className="font-inter text-sm font-normal text-[#91FFAE] leading-tight">
                        {cohort}
                    </p>
                </div>
            </div>
        </div>
    );
}
