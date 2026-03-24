"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { FeatureShowcase } from "../shared/FeatureShowcase";

export function SupportsSection() {
    const { t } = useLanguage();

    return (
        <FeatureShowcase
            title={t("supports.title")}
            action={{
                label: t("supports.cta"),
                href: "/contact",
            }}
            backgroundImage={{
                src: "/assets/backgrounds/supporters-section.svg",
            }}
            decorativeBlur
            card={{
                variant: "media",
                imageSrc: "/assets/images/sections/home-preview.png",
                imageAlt: t("supports.mediaCard.imageAlt"),
                title: t("supports.mediaCard.title"),
                description: [
                    t("supports.mediaCard.desc1"),
                    t("supports.mediaCard.desc2"),
                ],
                readMoreLabel: t("supports.readMore"),
                readMoreHref: "/about",
            }}
        />
    );
}
