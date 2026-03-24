"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export function SubHeroSection() {
    const { t } = useLanguage();

    return (
        <section className="w-full py-12 md:py-28">
            <div className="max-w-7xl mx-auto px-8 md:px-14 lg:px-20">
                <p className="font-space-mono text-foreground text-base md:text-lg leading-relaxed text-justify">
                    {t("subhero.text")}
                </p>
            </div>
        </section>
    );
}
