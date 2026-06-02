"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Hero } from "../shared/Hero";

export function DonateHeroSection() {
    const { t } = useLanguage();

    return (
        <Hero
            variant="simple"
            title={t("donate.hero.title")}
            subtitle={t("donate.hero.subtitle")}
            backgroundImage="/assets/backgrounds/hero-square.svg"
        />
    );
}
