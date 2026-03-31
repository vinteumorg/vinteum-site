"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Hero } from "../components/shared/Hero";
import { AboutWhatWeDoSection } from "../components/about/AboutWhatWeDoSection";
import { AboutOurStorySection } from "../components/about/AboutOurStorySection";
import { AboutValuesSection } from "../components/about/AboutValuesSection";
import { AboutTeamSection } from "../components/about/AboutTeamSection";
import { SupportersOperationsMaintainerSection } from "../components/supporters/SupportersOperationsMaintainerSection";
import { SupportersGlobeSection } from "../components/supporters/SupportersGlobeSection";
import { SupportersSupportUsSection } from "../components/supporters/SupportersSupportUsSection";
import { SupportersProgramSupportersSection } from "../components/supporters/SupportersProgramSupportersSection";
import { SupportersFoundingDonorsSection } from "../components/supporters/SupportersFoundingDonorsSection";
import { SupportersSectionTitleSection } from "../components/supporters/SupportersSectionTitleSection";

export default function AboutPage() {
    const { t } = useLanguage();

    return (
        <div className="flex flex-col">
            <Hero
                variant="default"
                title={t("about.hero.title")}
                subtitle={t("about.hero.subtitle")}
                backgroundImage="/assets/backgrounds/hero-square.svg"
            />
            <AboutWhatWeDoSection />
            <AboutOurStorySection />
            <AboutValuesSection />
            <AboutTeamSection />

            {/* Our Supporters — title */}
            <div id="supporters">
                <SupportersSectionTitleSection />
            </div>

            <SupportersOperationsMaintainerSection />

            <SupportersFoundingDonorsSection />

            <SupportersProgramSupportersSection />

            <SupportersSupportUsSection />

            <SupportersGlobeSection />
        </div>
    );
}
