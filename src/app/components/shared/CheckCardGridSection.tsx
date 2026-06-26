"use client";

import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { SectionTitle } from "./SectionTitle";

export type CheckCardItem = {
    labelKey: string;
    valueKey?: string;
    subtitleKey?: string;
};

type CheckCardGridSectionProps = {
    titleKey: string;
    items: CheckCardItem[];
    iconSrc?: string;
};

export function CheckCardGridSection({
    titleKey,
    items,
    iconSrc = "/assets/icons/ui/circle-check.svg",
}: CheckCardGridSectionProps) {
    const { t } = useLanguage();

    return (
        <section className="relative w-full py-12 md:py-28">
            <div className="max-w-7xl mx-auto px-8 md:px-14 lg:px-20">
                {/* Badge + Title */}
                <div className="flex flex-col items-center gap-5 mb-14">
                    <SectionTitle className="text-center">{t(titleKey)}</SectionTitle>
                </div>

                {/* 2x2 Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {items.map((item) => (
                        <div
                            key={item.labelKey}
                            className="flex flex-col justify-center gap-2 rounded-2xl border border-border bg-background-secondary px-8 py-8"
                        >
                            <div className="flex items-center gap-4">
                                <Image
                                    src={iconSrc}
                                    alt=""
                                    width={40}
                                    height={40}
                                    aria-hidden="true"
                                />
                                {item.valueKey ? (
                                    <span className="font-rethink text-5xl md:text-6xl font-normal text-foreground leading-none">
                                        {item.valueKey}
                                    </span>
                                ) : (
                                    <span className="font-space-mono text-xl md:text-2xl font-normal text-foreground leading-snug">
                                        {t(item.labelKey)}
                                    </span>
                                )}
                            </div>
                            {item.valueKey && (
                                <p className="font-space-mono text-base font-normal text-foreground/70 pl-[56px]">
                                    {t(item.labelKey)}
                                </p>
                            )}
                            {item.subtitleKey && (
                                <p className="font-space-mono text-sm font-normal text-foreground/50 pl-[56px]">
                                    {t(item.subtitleKey)}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
