"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { SectionTitle } from "./SectionTitle";

type Props = {
    titleKey: string;
    itemKeys: string[];
};

export function BulletListWithTitleSection({ titleKey, itemKeys }: Props) {
    const { t } = useLanguage();

    return (
        <section className="relative w-full bg-background">
            <div className="max-w-7xl mx-auto px-8 md:px-14 lg:px-20 py-12 md:py-28">
                <div className="flex flex-col-reverse lg:flex-row lg:items-start gap-8 lg:gap-24">
                    {/* Left: bullet list */}
                    <div className="flex flex-col gap-3 lg:w-[55%]">
                        {itemKeys.map((key) => (
                            <p
                                key={key}
                                className="font-space-mono text-sm md:text-base font-normal text-foreground leading-[1.7] flex items-start gap-2"
                            >
                                <span aria-hidden="true">•</span>
                                <span>{t(key)}</span>
                            </p>
                        ))}
                    </div>

                    {/* Right: big title */}
                    <div className="lg:w-[45%]">
                        <SectionTitle className="text-left lg:text-right">{t(titleKey)}</SectionTitle>
                    </div>
                </div>
            </div>
        </section>
    );
}
