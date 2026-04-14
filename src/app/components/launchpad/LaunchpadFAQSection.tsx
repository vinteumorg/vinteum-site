"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SectionTitle } from "../shared/SectionTitle";

const ITEM_KEYS = [
    "launchpad.faq.items.item1",
    "launchpad.faq.items.item2",
    "launchpad.faq.items.item3",
    "launchpad.faq.items.item4",
    "launchpad.faq.items.item5",
];

export function LaunchpadFAQSection() {
    const { t } = useLanguage();
    const [openSet, setOpenSet] = useState<Set<number>>(new Set());

    const toggle = (i: number) => {
        setOpenSet((prev) => {
            const next = new Set(prev);
            if (next.has(i)) next.delete(i);
            else next.add(i);
            return next;
        });
    };

    return (
        <section className="relative w-full py-12 md:py-28 bg-background">
            <div className="max-w-5xl mx-auto px-8 md:px-14 lg:px-20">
                {/* Header */}
                <div className="flex flex-col items-center text-center gap-4 mb-14">
                    <SectionTitle>{t("launchpad.faq.title")}</SectionTitle>
                </div>

                <div className="flex flex-col">
                    {ITEM_KEYS.map((key, i) => {
                        const isOpen = openSet.has(i);
                        return (
                            <div key={key}>
                                <button
                                    onClick={() => toggle(i)}
                                    className="w-full flex items-start justify-between gap-6 py-7 text-left cursor-pointer"
                                >
                                    <div className="flex flex-col gap-3">
                                        <p className="font-space-mono text-base md:text-lg font-normal text-foreground leading-[1.4]">
                                            {i + 1}. {t(`${key}.question`)}
                                        </p>
                                        {isOpen && (
                                            <p className="font-space-mono text-sm font-normal text-foreground/50 leading-[1.7]">
                                                {t(`${key}.answer`)}
                                            </p>
                                        )}
                                    </div>
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        className={`shrink-0 mt-1 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
                                        aria-hidden="true"
                                    >
                                        <path d="M7.5 5L12.5 10L7.5 15" stroke="#91FFAE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                                {i < ITEM_KEYS.length - 1 && (
                                    <div className="h-px bg-[#91FFAE]/20" aria-hidden="true" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
