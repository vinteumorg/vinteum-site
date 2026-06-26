"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { TwoCardCTASection } from "../shared/TwoCardCTASection";

const bulletKeys = [
    "fellowship.howToApply.bullet1",
    "fellowship.howToApply.bullet2",
    "fellowship.howToApply.bullet3",
    "fellowship.howToApply.bullet4",
];

export function FellowshipHowToApplySection() {
    const { t } = useLanguage();

    return (
        <div className="relative z-[1]">
            {/* Decorative blur — behind and slightly below the cards */}
            <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/3 w-[75%] h-[280px] rounded-full opacity-45 blur-[110px] gradient-blur-decorative pointer-events-none select-none z-0"
                aria-hidden="true"
            />
            <TwoCardCTASection
                titleKey="fellowship.howToApply.title"
                imageSrc="/assets/images/programs/fellowship.png"
                imageAlt="Fellowship program"
                ctaHref="/contact"
                ctaKey="fellowship.howToApply.cta"
            >
                <p className="font-space-mono text-sm text-foreground leading-[1.7] mb-5">
                    {t("fellowship.howToApply.desc1")}
                </p>
                <p className="font-space-mono text-sm text-foreground leading-[1.7] mb-3">
                    {t("fellowship.howToApply.desc2")}
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
                    {t("fellowship.howToApply.desc3")}
                </p>
            </TwoCardCTASection>
        </div>
    );
}
