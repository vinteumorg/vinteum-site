"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { FeatureShowcase } from "../shared/FeatureShowcase";

export function BitDevsCodeOfConductSection() {
    const { t } = useLanguage();

    return (
        <FeatureShowcase
            title={t("bitdevs.codeOfConduct.title")}
            decorativeBlur
            card={{
                variant: "text",
                description: [
                    t("bitdevs.codeOfConduct.desc1"),
                    t("bitdevs.codeOfConduct.desc2"),
                    t("bitdevs.codeOfConduct.desc3"),
                ],
            }}
        />
    );
}
