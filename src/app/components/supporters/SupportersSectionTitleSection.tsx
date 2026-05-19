"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { SectionTitle } from "../shared/SectionTitle";

export function SupportersSectionTitleSection() {
    const { t } = useLanguage();

    return (
        <section className="relative w-full pt-12 md:pt-28">
            {/* Green glow blob */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[140px] rounded-[50%] bg-primary/15 blur-[90px] pointer-events-none select-none"
                aria-hidden="true"
            />

            <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-14 lg:px-20 flex flex-col items-center text-center gap-4">
                <SectionTitle size="hero" className="bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
                    {t("about.supporters.title")}
                </SectionTitle>
                {/* Decorative accent line */}
                <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />
            </div>
        </section>
    );
}
