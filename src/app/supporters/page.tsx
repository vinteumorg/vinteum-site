"use client";

import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { Hero } from "../components/shared/Hero";
import { SupportersIntroSection } from "../components/supporters/SupportersIntroSection";
import { SupportersOperationsMaintainerSection } from "../components/supporters/SupportersOperationsMaintainerSection";
import { SupportersProgramSupportersSection } from "../components/supporters/SupportersProgramSupportersSection";
import { SupportersFoundingDonorsSection } from "../components/supporters/SupportersFoundingDonorsSection";
import { SupportersSupportUsSection } from "../components/supporters/SupportersSupportUsSection";
import { SupportersGlobeSection } from "../components/supporters/SupportersGlobeSection";

export default function SupportersPage() {
    const { t } = useLanguage();

    return (
        <div className="flex flex-col">
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none select-none z-0">
                    <Image
                        src="/assets/backgrounds/hero-programs.svg"
                        alt=""
                        fill
                        priority
                        className="object-cover object-top"
                        aria-hidden="true"
                    />
                </div>

                <div className="relative z-10">
                    <Hero
                        variant="simple"
                        title={t("supporters.hero.title")}
                        subtitle={t("supporters.hero.subtitle")}
                    />
                </div>
                <SupportersIntroSection />
            </div>

            <SupportersOperationsMaintainerSection />

            <SupportersFoundingDonorsSection />

            <SupportersProgramSupportersSection />

            <SupportersSupportUsSection />

            <SupportersGlobeSection />

        </div>
    );
}
