"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { CTAButton } from "../shared/CTAButton";
import { SectionTitle } from "../shared/SectionTitle";

export function LaunchpadAboutSection() {
    const { t } = useLanguage();

    return (
        <section className="relative w-full pb-20 md:pb-40 launchpad-about-pt">
            <div className="max-w-7xl mx-auto px-8 md:px-14 lg:px-20">
                <div className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-16">
                    {/* Left: description text */}
                    <div className="lg:w-[55%]">
                        <p className="font-space-mono text-base md:text-lg font-normal text-foreground leading-[1.6] mb-6">
                            {t("launchpad.about.desc1")}
                        </p>
                        <p className="font-space-mono text-base md:text-lg font-normal text-foreground leading-[1.6]">
                            {t("launchpad.about.desc2")}
                        </p>
                    </div>

                    {/* Right: title + CTA */}
                    <div className="lg:w-[45%] flex flex-col items-start lg:items-end gap-8">
                        <SectionTitle className="text-left lg:text-right">{t("launchpad.about.title")}</SectionTitle>
                        <CTAButton href="https://jobs.vinteum.org/bitcoin-dev-launchpad-lista-de-espera/pt/apply" target="_blank" rel="noopener noreferrer">
                            {t("launchpad.about.cta")}
                        </CTAButton>
                    </div>
                </div>
            </div>
        </section>
    );
}
