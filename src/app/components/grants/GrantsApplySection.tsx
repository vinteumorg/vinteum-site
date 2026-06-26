"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { TwoCardCTASection } from "../shared/TwoCardCTASection";

const bulletKeys = [
    "grants.apply.bullet1",
    "grants.apply.bullet2",
    "grants.apply.bullet3",
];

export function GrantsApplySection() {
    const { t } = useLanguage();

    return (
        <div className="relative z-[1] overflow-hidden">
            {/* Decorative blur — behind and slightly below the cards */}
            <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/3 w-[75%] h-[280px] rounded-full opacity-45 blur-[110px] gradient-blur-decorative pointer-events-none select-none z-0"
                aria-hidden="true"
            />
            <TwoCardCTASection
                titleKey="grants.apply.title"
                imageSrc="/assets/images/programs/fellowship.png"
                imageAlt="Bitcoin developer meetup"
                ctaHref="/contact"
                ctaKey="grants.apply.cta"
            >
                <p className="font-space-mono text-sm text-foreground leading-[1.7] mb-5">
                    {t("grants.apply.desc1")}
                </p>
                <ul className="flex flex-col gap-1 mb-5">
                    {bulletKeys.map((key) => (
                        <li
                            key={key}
                            className="font-space-mono text-sm text-foreground leading-[1.7] flex items-start gap-2"
                        >
                            <span aria-hidden="true">•</span>
                            <span>{t(key)}</span>
                        </li>
                    ))}
                </ul>
                <p className="font-space-mono text-sm text-foreground leading-[1.7]">
                    {t("grants.apply.desc2")}
                </p>
            </TwoCardCTASection>
        </div>
    );
}
