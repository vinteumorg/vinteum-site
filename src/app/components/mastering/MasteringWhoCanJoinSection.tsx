"use client";

import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { CTAButton } from "../shared/CTAButton";
import { SectionTitle } from "../shared/SectionTitle";

export function MasteringWhoCanJoinSection() {
    const { t } = useLanguage();

    const bullets = [
        t("mastering.whoCanJoin.bullet1"),
        t("mastering.whoCanJoin.bullet2"),
        t("mastering.whoCanJoin.bullet3"),
    ];

    return (
        <section className="relative w-full pt-12 md:pt-28 pb-40 md:pb-56 overflow-hidden">
            {/* Background globe */}
            <div className="absolute inset-x-0 bottom-0 h-[100%] pointer-events-none select-none z-0">
                <Image
                    src="/assets/backgrounds/section-divider.svg"
                    alt=""
                    fill
                    className="object-cover object-top"
                    aria-hidden="true"
                />
            </div>

            {/* Content row */}
            <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-14 lg:px-20">
                <div className="flex flex-col-reverse lg:flex-row lg:items-start lg:justify-between gap-12 mt-40 md:mt-56">
                    {/* Left: bullet points */}
                    <ul className="flex flex-col gap-4 lg:w-[55%]">
                        {bullets.map((b) => (
                            <li
                                key={b}
                                className="font-space-mono text-base md:text-lg font-normal text-foreground leading-[1.6] flex items-start gap-2"
                            >
                                <span aria-hidden="true">•</span>
                                <span>{b}</span>
                            </li>
                        ))}
                    </ul>

                    {/* Right: title + CTA */}
                    <div className="flex flex-col items-start lg:items-end gap-6 lg:w-[40%]">
                        <SectionTitle className="lg:text-right">{t("mastering.whoCanJoin.title")}</SectionTitle>
                        <CTAButton href="https://jobs.vinteum.org/mastering-seminars-lista-de-espera/pt/apply" target="_blank" rel="noopener noreferrer">
                            {t("mastering.whoCanJoin.cta")}
                        </CTAButton>
                    </div>
                </div>
            </div>
        </section>
    );
}
