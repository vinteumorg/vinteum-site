"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Hero } from "../shared/Hero";

export function HeroSection() {
    const { t } = useLanguage();

    return (
        <Hero
            variant="default"
            title={t("hero.title")}
            subtitle={t("hero.subtitle")}
            cta={{ label: t("hero.cta"), href: "/about" }}
            backgroundImage="/assets/backgrounds/hero-home.svg"
        />
    );
}
