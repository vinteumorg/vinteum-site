"use client";

import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { SectionTitle } from "../shared/SectionTitle";

export function SupportersOperationsMaintainerSection() {
    const { t } = useLanguage();

    return (
        <section className="w-full py-12 md:py-28">
            <div className="max-w-7xl mx-auto px-8 md:px-14 lg:px-20">
                {/* Outer card */}
                <div className="rounded-[30px] border border-[#31422D] bg-[rgba(23,39,25,0.30)] p-4 md:p-5">
                    <div className="flex flex-col lg:flex-row gap-4 md:gap-5">
                        {/* Left panel — badge, title, subtitle */}
                        <div className="w-full lg:w-[55%] flex flex-col justify-center gap-6 px-4 py-6 md:px-10 md:py-10">
                            <div className="flex flex-col items-center lg:items-start gap-5 mt-2 text-center lg:text-left">
                                <SectionTitle size="large">{t("supporters.operationsMaintainer.title")}</SectionTitle>
                                <p className="font-poppins text-base font-normal text-foreground/70 leading-[1.6] max-w-lg">
                                    {t("supporters.operationsMaintainer.subtitle")}
                                </p>
                            </div>
                        </div>

                        {/* Right panel — inner card with logo */}
                        <div className="w-full lg:w-[45%] rounded-[19px] border border-[#31422D] bg-[rgba(26,167,47,0.03)] flex items-center justify-center p-10 min-h-[260px] lg:min-h-[340px]">
                            <div className="relative w-full max-w-[360px] h-[90px]">
                                <Image
                                    src="/assets/logos/operations-maintainer.svg"
                                    alt="Operations Maintainer logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
