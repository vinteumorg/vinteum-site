"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { BrazilMap, type CityPin } from "./BrazilMap";

export function BitDevsCitiesSection() {
    const { t } = useLanguage();

    const cities: CityPin[] = [
        { id: "brasilia", name: t("bitdevs.cities.brasilia.name"), href: "", x: 66, y: 49 },
        { id: "belohorizonte", name: t("bitdevs.cities.belohorizonte.name"), href: "", x: 67.5, y: 55 },
        { id: "saopaulo", name: t("bitdevs.cities.saopaulo.name"), href: "", x: 73.5, y: 72 },
        { id: "curitiba", name: t("bitdevs.cities.curitiba.name"), href: "", x: 67, y: 77 },
        { id: "florianopolis", name: t("bitdevs.cities.florianopolis.name"), href: "", x: 66.5, y: 83 },
        { id: "portoalegre", name: t("bitdevs.cities.portoalegre.name"), href: "", x: 62.5, y: 90 },
    ];

    return (
        <section className="relative w-full pt-10 md:pt-16 pb-12 md:pb-28">
            <div className="max-w-7xl mx-auto px-8 md:px-14 lg:px-20">
                <div className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-16">
                    {/* Left: text */}
                    <div className="lg:w-[45%]">
                        <p className="font-space-mono text-base md:text-lg font-normal text-foreground leading-[1.6]">
                            {t("bitdevs.cities.text")}
                        </p>
                    </div>

                    {/* Right: interactive map */}
                    <div className="lg:w-[55%] flex justify-center lg:justify-end">
                        <BrazilMap cities={cities} />
                    </div>
                </div>
            </div>
        </section>
    );
}

