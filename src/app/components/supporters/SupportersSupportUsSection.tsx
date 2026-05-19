"use client";

import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { CTAButton } from "../shared/CTAButton";
import { SectionTitle } from "../shared/SectionTitle";

export function SupportersSupportUsSection() {
    const { t } = useLanguage();

    return (
        <section className="w-full py-12 md:py-20 lg:py-28">
            <div className="max-w-7xl mx-auto px-8 md:px-14 lg:px-20">
                <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 lg:items-center">
                    {/* Left — title */}
                    <div className="lg:w-[40%] flex flex-col gap-5">
                        <SectionTitle size="large">{t("supporters.supportUs.title")}</SectionTitle>
                    </div>

                    {/* Right — glass card */}
                    <div className="lg:w-[60%]">
                        <div className="rounded-[30px] border border-[#31422D] bg-[rgba(23,39,25,0.30)] p-3 md:p-4 lg:p-5">
                            {/* Image */}
                            <div className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl">
                                <Image
                                    src="/assets/images/sections/support-cta.png"
                                    alt={t("supporters.supportUs.imageAlt")}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            {/* Content */}
                            <div className="px-3 pt-5 pb-3 md:px-4 md:pt-6 md:pb-4 lg:px-6 lg:pt-8 lg:pb-5">
                                <p className="font-poppins text-base font-normal text-foreground/70 leading-[1.6] mb-8">
                                    {t("supporters.supportUs.description")}
                                </p>

                                <div className="flex items-center flex-wrap gap-4">
                                    <CTAButton href="/donate">
                                        {t("supporters.supportUs.donateBitcoin")}
                                    </CTAButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
