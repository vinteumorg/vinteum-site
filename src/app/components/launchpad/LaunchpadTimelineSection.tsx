"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { SectionTitle } from "../shared/SectionTitle";

const weekKeys = [
    "launchpad.timeline.week1",
    "launchpad.timeline.week2",
    "launchpad.timeline.week3",
    "launchpad.timeline.week4",
    "launchpad.timeline.week5",
];

export function LaunchpadTimelineSection() {
    const { t } = useLanguage();

    return (
        <section className="relative w-full bg-background">
            <div className="max-w-7xl mx-auto px-8 md:px-14 lg:px-20 py-12 md:py-28">
                <div className="flex flex-col lg:flex-row lg:items-start gap-16 lg:gap-24">
                    {/* Left: week list */}
                    <div className="flex flex-col gap-3 lg:w-[55%]">
                        {weekKeys.map((key) => (
                            <p
                                key={key}
                                className="font-space-mono text-sm md:text-base font-normal text-foreground leading-[1.7]"
                            >
                                <span className="font-bold">{t(`${key}.title`)}: </span>
                                {t(`${key}.subtitle`)}
                            </p>
                        ))}
                    </div>

                    {/* Right: big title */}
                    <div className="lg:w-[45%]">
                        <SectionTitle className="text-left lg:text-right">{t("launchpad.timeline.title")}</SectionTitle>
                    </div>
                </div>
            </div>
        </section>
    );
}
