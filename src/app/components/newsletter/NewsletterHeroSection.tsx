"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Hero } from "../shared/Hero";

export function NewsletterHeroSection() {
    const { t } = useLanguage();

    return (
        <Hero
            variant="simple"
            title={t("newsletter.hero.title")}
            subtitle={t("newsletter.hero.subtitle")}
            backgroundImage="/assets/backgrounds/hero-square.svg"
        />
    );
}
