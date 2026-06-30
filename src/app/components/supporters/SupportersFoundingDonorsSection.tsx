"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { SupporterCard } from "../shared/SupporterCard";
import { SectionTitle } from "../shared/SectionTitle";

const foundingDonors = [
    {
        image: "/assets/logos/donors/donor-1.jpg",
        nameKey: "supporters.foundingDonors.items.0.name",
    },
    {
        image: "/assets/logos/donors/donor-2.png",
        nameKey: "supporters.foundingDonors.items.1.name",
    },
    {
        image: "/assets/logos/donors/donor-3.png",
        nameKey: "supporters.foundingDonors.items.2.name",
    },
    {
        image: "/assets/logos/donors/donor-4.png",
        nameKey: "supporters.foundingDonors.items.3.name",
    },
    {
        image: "/assets/logos/donors/donor-5.png",
        nameKey: "supporters.foundingDonors.items.4.name",
    },
];

export function SupportersFoundingDonorsSection() {
    const { t } = useLanguage();

    return (
        <div className="relative z-[1]">
            <section className="w-full py-12 md:py-28">
                <div className="max-w-7xl mx-auto px-8 md:px-14 lg:px-20">
                    {/* Header — centered */}
                    <div className="flex flex-col items-center text-center gap-4 mb-12 md:mb-16">
                        <SectionTitle size="large">{t("supporters.foundingDonors.title")}</SectionTitle>
                        <p className="font-poppins text-base font-normal text-foreground/70 leading-[1.6] max-w-2xl">
                            {t("supporters.foundingDonors.subtitle")}
                        </p>
                    </div>

                    {/* Cards — flex wrap com justify-center para centralizar linhas incompletas */}
                    <div className="flex flex-wrap justify-center gap-5">
                        {foundingDonors.map((donor, index) => (
                            <div
                                key={index}
                                className="w-full sm:w-[calc(50%-10px)] md:w-[calc(33.333%-13.333px)] lg:w-[calc(20%-16px)]"
                            >
                                <SupporterCard
                                    image={donor.image}
                                    name={t(donor.nameKey)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            {/* Decorative blur — after section content, bleeds into next section */}
            <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[60%] w-[50%] h-[200px] rounded-full opacity-80 blur-[100px] gradient-blur-vertical pointer-events-none select-none"
                aria-hidden="true"
            />
        </div>
    );
}
