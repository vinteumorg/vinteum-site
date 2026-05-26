"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Hero } from "../shared/Hero";

export function ContactHeroSection() {
    const { t } = useLanguage();

    return (
        <Hero
            variant="simple"
            title={t("contact.hero.title")}
            subtitle={t("contact.hero.subtitle")}
            backgroundImage="/assets/backgrounds/hero-square.svg"
        />
    );
}
