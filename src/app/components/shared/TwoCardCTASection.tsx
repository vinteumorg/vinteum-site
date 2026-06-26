"use client";

import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { CTAButton } from "./CTAButton";

type Props = {
    titleKey: string;
    imageSrc: string;
    imageAlt: string;
    ctaHref: string;
    ctaKey: string;
    secondaryCtaKey?: string;
    secondaryCtaHref?: string;
    bgImageSrc?: string;
    children: React.ReactNode;
};

export function TwoCardCTASection({
    titleKey,
    imageSrc,
    imageAlt,
    ctaHref,
    ctaKey,
    secondaryCtaKey,
    secondaryCtaHref,
    bgImageSrc,
    children,
}: Props) {
    const { t } = useLanguage();

    return (
        <section className="relative w-full pt-12 sm:pt-32 md:pt-40 pb-10 sm:pb-20 md:pb-28 overflow-hidden">
            {bgImageSrc && (
                <div className="absolute right-0 -bottom-[50px] w-[65%] h-full pointer-events-none select-none">
                    <Image
                        src={bgImageSrc}
                        alt=""
                        fill
                        className="object-contain object-right-bottom"
                        aria-hidden="true"
                    />
                </div>
            )}

            <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-14 lg:px-20">
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 lg:items-end">
                    {/* Card 1 — title + image */}
                    <div className="relative lg:w-[58%] rounded-[30px] border border-primary/20 overflow-hidden backdrop-blur-xsm bg-[rgba(49,66,45,0.12)] shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                        {/* Mobile/Tablet: title on top, image below */}
                        <div className="flex flex-col lg:hidden">
                            <div className="p-6 sm:p-8 md:p-10">
                                <h2 className="font-rethink-sans text-xl sm:text-2xl md:text-3xl font-medium text-foreground leading-[1.1] tracking-tight">
                                    {t(titleKey)}
                                </h2>
                            </div>
                            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10]">
                                <Image
                                    src={imageSrc}
                                    alt={imageAlt}
                                    fill
                                    className="object-cover rounded-[30px]"
                                />
                            </div>
                        </div>

                        {/* Desktop: absolute layout */}
                        <div className="hidden lg:block min-h-[500px]">
                            <div className="absolute inset-0 flex items-center p-12 max-w-[50%]">
                                <h2 className="font-rethink-sans text-4xl font-medium text-foreground leading-[1.1] tracking-tight">
                                    {t(titleKey)}
                                </h2>
                            </div>
                            <div className="absolute bottom-0 right-0 w-[55%] h-[90%]">
                                <div className="relative w-full h-full overflow-hidden">
                                    <Image
                                        src={imageSrc}
                                        alt={imageAlt}
                                        fill
                                        className="object-cover rounded-[30px]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 2 — text content + CTA */}
                    <div className="lg:w-[42%] rounded-[30px] border border-primary/20 overflow-hidden backdrop-blur-xsm bg-[rgba(49,66,45,0.12)] shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex flex-col p-5 sm:p-7 md:p-8 min-h-[280px] sm:min-h-[360px] md:min-h-[450px]">
                        <div className="flex-1">
                            {children}
                        </div>

                        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                            <CTAButton href={ctaHref}>
                                {t(ctaKey)}
                            </CTAButton>
                            {secondaryCtaKey && secondaryCtaHref && (
                                <a
                                    href={secondaryCtaHref}
                                    className="font-space-mono text-sm font-normal text-foreground hover:text-primary transition-colors"
                                >
                                    {t(secondaryCtaKey)}
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
