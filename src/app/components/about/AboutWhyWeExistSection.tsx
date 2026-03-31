"use client";

import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { SectionTitle } from "../shared/SectionTitle";
import { GlassCard } from "../shared/GlassCard";

export function AboutWhyWeExistSection() {
    const { t } = useLanguage();

    return (
        <section className="relative w-full py-12 md:py-28">
            {/* Background image — bottom, overlapping into card */}
            <div className="absolute inset-x-0 bottom-[-120px] h-[50%] pointer-events-none select-none z-0">
                <Image
                    src="/assets/backgrounds/section-divider.svg"
                    alt=""
                    fill
                    className="object-cover object-top"
                    aria-hidden="true"
                />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-8 md:px-14 lg:px-20">
                {/* Centered title */}
                <SectionTitle className="text-center mb-10">{t("about.whyWeExist.title")}</SectionTitle>

                {/* Glass card with text */}
                <GlassCard
                    variant="text"
                    description={[
                        t("about.whyWeExist.desc1"),
                        t("about.whyWeExist.desc2"),
                        t("about.whyWeExist.desc3"),
                    ]}
                />
            </div>
        </section>
    );
}
