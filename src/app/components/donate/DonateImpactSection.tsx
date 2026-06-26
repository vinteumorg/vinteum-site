"use client";

import { useLanguage } from "@/contexts/LanguageContext";

const ITEM_KEYS = [
    "donate.impact.item1",
    "donate.impact.item2",
    "donate.impact.item3",
    "donate.impact.item4",
    "donate.impact.item5",
];

export function DonateImpactSection() {
    const { t } = useLanguage();

    return (
        <section className="relative w-full py-12 md:py-28 bg-[#111110]">
            <div className="max-w-7xl mx-auto px-8 md:px-14 lg:px-20">
                <div className="flex flex-col-reverse lg:flex-row lg:items-stretch gap-16 lg:gap-24">
                    {/* Left: bullet items */}
                    <div className="flex flex-col gap-4 lg:gap-0 lg:justify-between lg:w-[55%]">
                        {ITEM_KEYS.map((key) => (
                            <div
                                key={key}
                                className="flex items-start gap-4 rounded-2xl border border-primary/20 bg-[rgba(49,66,45,0.12)] px-6 py-5"
                            >
                                <span
                                    className="mt-0.5 shrink-0 w-5 h-5 rounded-full border border-primary flex items-center justify-center"
                                    aria-hidden="true"
                                >
                                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                        <circle cx="5" cy="5" r="3" fill="#91FFAE" />
                                    </svg>
                                </span>
                                <p className="font-space-mono text-sm md:text-base font-normal text-foreground leading-[1.7]">
                                    {t(key)}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="w-full max-w-[500px] mx-auto lg:max-w-none lg:w-[45%] flex flex-col lg:sticky lg:top-28">
                        <iframe
                            src="https://geyser.fund/widget/project/vinteum/contribution?view=full&colorMode=dark"
                            title="Geyser Project Contribution Widget"
                            style={{
                                width: '100%',
                                minHeight: '620px',
                            }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
