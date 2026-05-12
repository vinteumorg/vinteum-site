"use client";

import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { Hero } from "../components/shared/Hero";
import { BitDevsCitiesSection } from "../components/bitdevs/BitDevsCitiesSection";
import { BitDevsWhatToExpectSection } from "../components/bitdevs/BitDevsWhatToExpectSection";
import { BitDevsCodeOfConductSection } from "../components/bitdevs/BitDevsCodeOfConductSection";
import { BitDevsPrivacySection } from "../components/bitdevs/BitDevsPrivacySection";
import { BitDevsStartSection } from "../components/bitdevs/BitDevsStartSection";

export default function BitDevsPage() {
    const { t } = useLanguage();

    return (
        <div className="flex flex-col">
            <div className="relative overflow-hidden">
                {/* Primary background — base layer */}
                <div className="absolute inset-0 pointer-events-none select-none z-0">
                    <Image
                        src="/assets/backgrounds/bitcoin-background.svg"
                        alt=""
                        fill
                        priority
                        className="object-cover object-center opacity-60"
                        aria-hidden="true"
                    />
                </div>

                {/* Hero content — above backgrounds */}
                <div className="relative z-10">
                    <Hero
                        variant="simple"
                        title={t("bitdevs.hero.title")}
                        subtitle={t("bitdevs.hero.subtitle")}
                    />
                </div>

                {/* Cities section — above backgrounds */}
                <div className="relative z-10">
                    <BitDevsCitiesSection />
                </div>
            </div>
            <BitDevsWhatToExpectSection />
            <BitDevsCodeOfConductSection />
            <BitDevsPrivacySection />
            <BitDevsStartSection />
        </div>
    );
}
