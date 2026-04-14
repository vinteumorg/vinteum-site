"use client";

import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { Hero } from "../../components/shared/Hero";
import { LaunchpadAboutSection } from "../../components/launchpad/LaunchpadAboutSection";
import { LaunchpadProgramStructureSection } from "../../components/launchpad/LaunchpadProgramStructureSection";
import { LaunchpadWhoItsForSection } from "../../components/launchpad/LaunchpadWhoItsForSection";
import { LaunchpadFAQSection } from "../../components/launchpad/LaunchpadFAQSection";
import { LaunchpadAlumniSection } from "../../components/launchpad/LaunchpadAlumniSection";
import { LaunchpadTestimonialsSection } from "../../components/launchpad/LaunchpadTestimonialsSection";

export default function BitcoinDevLaunchpadPage() {
    const { t } = useLanguage();

    return (
        <div className="flex flex-col">
            <div className="relative overflow-hidden">
                {/* Primary background — base layer */}
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

                {/* Hero content — above background */}
                <div className="relative z-10">
                    <Hero
                        variant="simple"
                        title={t("launchpad.hero.title")}
                        subtitle={t("launchpad.hero.subtitle")}
                    />
                </div>

                {/* About section — above background */}
                <div className="relative z-10">
                    <LaunchpadAboutSection />
                </div>
            </div>
            <LaunchpadProgramStructureSection />
            <LaunchpadTestimonialsSection />
            <LaunchpadWhoItsForSection />
            <LaunchpadFAQSection />
            <LaunchpadAlumniSection />
        </div>
    );
}
