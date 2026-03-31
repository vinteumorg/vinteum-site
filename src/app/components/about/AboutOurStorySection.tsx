"use client";

import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { SectionTitle } from "../shared/SectionTitle";
import { GlassCard } from "../shared/GlassCard";

export function AboutOurStorySection() {
    const { t } = useLanguage();

    return (
        <section className="relative w-full py-12 md:py-28">
            {/* Background image — bottom, overlapping into cards */}
            <div className="absolute inset-x-0 bottom-[-200px] h-[50%] pointer-events-none select-none z-0">
                <Image
                    src="/assets/backgrounds/section-divider.svg"
                    alt=""
                    fill
                    className="object-cover object-top"
                    aria-hidden="true"
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-14 lg:px-20">

                {/* Centered title */}
                <SectionTitle className="text-center mb-14">{t("about.ourStory.title")}</SectionTitle>

                {/* Two cards side by side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <GlassCard
                        variant="text"
                        description={[
                            t("about.ourStory.desc1"),
                            t("about.ourStory.desc2"),
                        ]}
                    />
                    <GlassCard
                        variant="image"
                        imageSrc="/assets/images/sections/about-preview.png"
                        imageAlt={t("about.ourStory.imageAlt")}
                    />
                </div>
            </div>
        </section>
    );
}
