"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { TwoCardCTASection } from "../shared/TwoCardCTASection";

export function BitDevsStartSection() {
    const { t } = useLanguage();

    return (
        <TwoCardCTASection
            titleKey="bitdevs.startInYourCity.title"
            imageSrc="/assets/images/bitdevs/in-your-city.png"
            imageAlt="BitDevs meetup"
            ctaHref="/contact"
            ctaKey="bitdevs.startInYourCity.cta"
            bgImageSrc="/assets/backgrounds/bitdevs-section.svg"
        >
            <p className="font-space-mono text-sm text-foreground leading-[1.7] mb-5">
                {t("bitdevs.startInYourCity.desc1")}
            </p>
        </TwoCardCTASection>
    );
}
