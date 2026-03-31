"use client";

import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { CTAButton } from "../shared/CTAButton";

export function AboutSupportSection() {
    const { t } = useLanguage();

    return (
        <section className="relative w-full pt-12 md:pt-28 pb-60 md:pb-80">
            {/* Background image — bottom decorative globe */}
            <div className="absolute inset-x-0 bottom-0 h-[60%] pointer-events-none select-none z-0">
                <Image
                    src="/assets/backgrounds/section-divider.svg"
                    alt=""
                    fill
                    className="object-cover object-top"
                    aria-hidden="true"
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-14 lg:px-20">
                {/* Header — text */}
                <div className="mb-10">
                    {/* Left: main text */}
                    <div>
                        <p className="font-space-mono text-base md:text-lg lg:text-xl font-normal text-foreground leading-[1.6] tracking-normal">
                            {t("about.support.text")}
                        </p>
                    </div>
                </div>

                {/* CTA button */}
                <CTAButton href="/supporters">
                    {t("about.support.cta")}
                </CTAButton>
            </div>

            {/* Bottom subtitle — over/below the background */}
            <div className="relative z-10 max-w-4xl mx-auto px-8 md:px-14 lg:px-20 mt-72 md:mt-96">
                <p className="font-space-mono text-sm md:text-base font-normal text-foreground-secondary leading-relaxed text-center">
                    {t("about.support.subtitle")}
                </p>
            </div>
        </section>
    );
}
