"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { SupporterCard } from "../shared/SupporterCard";
import { SectionTitle } from "../shared/SectionTitle";

const programSupporters = [
    {
        image: "/assets/logos/supporters/supporter-1.png",
        nameKey: "supporters.programSupporters.items.0.name",
    },
    {
        image: "/assets/logos/supporters/supporter-2.png",
        nameKey: "supporters.programSupporters.items.1.name",
    },
    {
        image: "/assets/logos/supporters/supporter-3.png",
        nameKey: "supporters.programSupporters.items.2.name",
    },
    {
        image: "/assets/logos/supporters/supporter-4.png",
        nameKey: "supporters.programSupporters.items.3.name",
    }
];

export function SupportersProgramSupportersSection() {
    const { t } = useLanguage();

    return (
        <section className="w-full py-12 md:py-28">
            <div className="max-w-7xl mx-auto px-8 md:px-14 lg:px-20">
                {/* Header — centered */}
                <div className="flex flex-col items-center text-center gap-4 mb-12 md:mb-16">
                    <SectionTitle size="large">{t("supporters.programSupporters.title")}</SectionTitle>
                    <p className="font-poppins text-base font-normal text-foreground/70 leading-[1.6] max-w-2xl">
                        {t("supporters.programSupporters.subtitle")}
                    </p>
                </div>

                {/* Cards — flex wrap com justify-center para centralizar linhas incompletas */}
                <div className="flex flex-wrap justify-center gap-5">
                    {programSupporters.map((supporter, index) => (
                        <div
                            key={index}
                            className="w-full sm:w-[calc(50%-10px)] md:w-[calc(33.333%-13.333px)] lg:w-[calc(20%-16px)]"
                        >
                            <SupporterCard
                                image={supporter.image}
                                name={t(supporter.nameKey)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
