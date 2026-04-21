"use client";

import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { Hero } from "../../components/shared/Hero";
import { FellowshipWhoItsForSection } from "../../components/fellowship/FellowshipWhoItsForSection";
import { FellowshipWhatFellowsReceiveSection } from "../../components/fellowship/FellowshipWhatFellowsReceiveSection";
import { FellowshipHowToApplySection } from "../../components/fellowship/FellowshipHowToApplySection";
import { FellowshipAlumniSection } from "../../components/fellowship/FellowshipAlumniSection";

export default function FellowshipPage() {
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
                        title={t("fellowship.hero.title")}
                        subtitle={t("fellowship.hero.subtitle")}
                    />
                </div>
                <FellowshipWhoItsForSection />
            </div>

            <FellowshipWhatFellowsReceiveSection />
            <FellowshipHowToApplySection />
            <FellowshipAlumniSection />
        </div>
    );
}
