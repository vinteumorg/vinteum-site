"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { TwoCardCTASection } from "../shared/TwoCardCTASection";

export function SupportersIntroSection() {
    const { t } = useLanguage();

    return (
        <div className="pt-20 md:pt-40">
            <TwoCardCTASection
                titleKey="supporters.hero.title"
                imageSrc="/assets/images/programs/mastering.png"
                imageAlt="Vinteum community meetup"
                ctaHref="/donate"
                ctaKey="supporters.intro.donateBitcoin"
                secondaryCtaKey="supporters.intro.donateFiat"
            >
                <div className="flex flex-col gap-5">
                    <p className="font-space-mono text-base md:text-lg font-normal text-foreground leading-[1.7]">
                        {t("supporters.intro.desc1")}
                    </p>
                    <p className="font-space-mono text-base md:text-lg font-normal text-foreground leading-[1.7]">
                        {t("supporters.intro.desc2")}
                    </p>
                </div>
            </TwoCardCTASection>
        </div>
    );
}
