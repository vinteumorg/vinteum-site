"use client";

import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { Hero } from "../../components/shared/Hero";
import { GrantsAreasFundSection } from "../../components/grants/GrantsAreasFundSection";
import { GrantsWhoWeSupportSection } from "../../components/grants/GrantsWhoWeSupportSection";
import { GrantsAlumniSection } from "../../components/grants/GrantsAlumniSection";
import { GrantsApplySection } from "../../components/grants/GrantsApplySection";

export default function GrantsPage() {
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
                        className="object-cover object-top opacity-60"
                        aria-hidden="true"
                    />
                </div>

                <div className="relative z-10">
                    <Hero
                        variant="simple"
                        title={t("grants.hero.title")}
                        subtitle={t("grants.hero.subtitle")}
                    />
                </div>
                <GrantsAreasFundSection />
            </div>

            <GrantsWhoWeSupportSection />
            <GrantsAlumniSection />
            <GrantsApplySection />
        </div>
    );
}
