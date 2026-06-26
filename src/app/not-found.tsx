"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "./components/shared/Button";

export default function NotFound() {
    const { t } = useLanguage();

    return (
        <section className="relative w-full min-h-[calc(100vh-80px)] flex flex-col items-center justify-center overflow-hidden px-8">
            {/* Glow */}
            <div
                className="absolute -top-[60px] left-1/2 -translate-x-1/2 w-[300px] h-[100px] rounded-[50%] bg-[#FFAE00]/60 blur-[60px] pointer-events-none select-none"
                aria-hidden="true"
            />

            <div className="relative z-10 flex flex-col items-center justify-center text-center gap-6 max-w-xl">
                <span className="font-sk-concretica text-[6rem] sm:text-[8rem] md:text-[10rem] leading-none text-primary select-none">
                    {t("notFound.code")}
                </span>

                <h1 className="font-sk-concretica text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem] font-normal text-foreground uppercase leading-tight tracking-tight">
                    {t("notFound.title")}
                </h1>

                <p className="font-poppins text-foreground/70 text-base md:text-lg leading-relaxed">
                    {t("notFound.subtitle")}
                </p>

                <Button href="/" variant="primary" className="mt-2">
                    {t("notFound.cta")}
                </Button>
            </div>
        </section>
    );
}
