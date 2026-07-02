"use client";

import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { BlogSearchInput } from "./BlogSearchInput";

interface BlogHeroSectionProps {
    search: string;
    onSearchChange: (value: string) => void;
}

export function BlogHeroSection({ search, onSearchChange }: BlogHeroSectionProps) {
    const { t } = useLanguage();

    return (
        <section className="relative w-full overflow-hidden flex flex-col items-center justify-center">
            {/* Background */}
            <Image
                src="/assets/backgrounds/hero-square.svg"
                alt=""
                fill
                priority
                className="object-cover object-center select-none pointer-events-none"
                aria-hidden="true"
            />

            {/* Glow */}
            <div
                className="absolute -top-[60px] left-1/2 -translate-x-1/2 w-[300px] h-[100px] rounded-[50%] bg-[#FFAE00]/60 blur-[60px] pointer-events-none select-none"
                aria-hidden="true"
            />

            <div className="relative z-10 flex flex-col items-center justify-center text-center px-8 md:px-14 lg:px-20 pt-52 pb-20 w-full max-w-7xl mx-auto gap-5">
                <h1 className="font-sk-concretica text-[2rem] sm:text-[2.75rem] md:text-[3.5rem] lg:text-[4rem] font-normal text-foreground uppercase leading-[0.9] tracking-[0.05em]">
                    {t("blog.hero.title")}
                </h1>

                <p className="font-poppins text-foreground/65 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
                    {t("blog.hero.subtitle")}
                </p>

                <BlogSearchInput value={search} onChange={onSearchChange} />
            </div>
        </section>
    );
}
