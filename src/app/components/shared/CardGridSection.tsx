"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { SectionTitle } from "./SectionTitle";

type Props = {
    titleKey: string;
    cardKeys: string[];
    fullWidthCardKeys?: string[];
};

export function CardGridSection({ titleKey, cardKeys, fullWidthCardKeys }: Props) {
    const { t } = useLanguage();

    return (
        <section className="relative w-full py-12 md:py-28">
            <div className="max-w-7xl mx-auto px-8 md:px-14 lg:px-20">
                {/* Header — centered badge + title */}
                <div className="flex flex-col items-center text-center gap-4 mb-14">
                    <SectionTitle>{t(titleKey)}</SectionTitle>
                </div>

                {/* 2-col grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {cardKeys.map((key) => (
                        <div
                            key={key}
                            className="rounded-2xl border border-[#31422D] bg-[#31422D]/[0.17] p-8 md:p-10 flex items-center min-h-[180px]"
                        >
                            <p className="font-space-mono text-lg md:text-xl lg:text-2xl font-normal text-foreground leading-[1.4]">
                                {t(key)}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Full-width cards */}
                {fullWidthCardKeys && fullWidthCardKeys.length > 0 && (
                    <div className="flex flex-col gap-5 mt-5">
                        {fullWidthCardKeys.map((key) => (
                            <div
                                key={key}
                                className="rounded-2xl border border-[#31422D] bg-[#31422D]/[0.17] p-8 md:p-10 flex items-center min-h-[180px]"
                            >
                                <p className="font-space-mono text-lg md:text-xl lg:text-2xl font-normal text-foreground leading-[1.4]">
                                    {t(key)}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
