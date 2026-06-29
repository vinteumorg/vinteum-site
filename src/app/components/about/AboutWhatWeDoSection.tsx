"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { FeatureShowcase } from "../shared/FeatureShowcase";

export function AboutWhatWeDoSection() {
    const { t } = useLanguage();

    return (
        <FeatureShowcase
            title={t("about.whatWeDo.title")}
            action={{
                label: t("about.whatWeDo.cta"),
                href: "/contact",
            }}
            backgroundImage={{
                src: "/assets/backgrounds/supporters-section.svg",
            }}
            decorativeBlur
            card={{
                variant: "text",
                description: [
                    <strong key="intro" className="font-poppins text-sm md:text-[15px] text-foreground font-semibold leading-relaxed">
                        {t("about.whatWeDo.intro")}
                    </strong>,
                    t("about.whatWeDo.desc1"),
                    t("about.whatWeDo.desc2"),
                    t("about.whatWeDo.desc3"),
                    t("about.whatWeDo.desc4"),
                ],
            }}
        />
    );
}
