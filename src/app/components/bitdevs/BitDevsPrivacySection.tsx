"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { SectionTitle } from "../shared/SectionTitle";

export function BitDevsPrivacySection() {
    const { t } = useLanguage();

    return (
        <section className="relative w-full py-12 md:py-28">
            <div className="max-w-7xl mx-auto px-8 md:px-14 lg:px-20">
                <SectionTitle className="text-center mb-10">{t("bitdevs.privacy.title")}</SectionTitle>
                <div className="flex flex-col items-center">
                    <div className="flex flex-col gap-6 text-center max-w-3xl">
                        <p className="font-space-mono text-sm md:text-base font-normal text-foreground leading-[1.7]">
                            {t("bitdevs.privacy.desc1")}
                        </p>
                        <p className="font-space-mono text-sm md:text-base font-normal text-foreground leading-[1.7]">
                            {t("bitdevs.privacy.desc2")}
                        </p>
                        <p className="font-space-mono text-sm md:text-base font-normal text-foreground leading-[1.7]">
                            {t("bitdevs.privacy.desc3")}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
