"use client";

import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "./components/shared/Button";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
    const { t } = useLanguage();

    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <section className="relative w-full min-h-[calc(100vh-80px)] flex flex-col items-center justify-center overflow-hidden px-8">
            {/* Glow */}
            <div
                className="absolute -top-[60px] left-1/2 -translate-x-1/2 w-[300px] h-[100px] rounded-[50%] bg-[#FFAE00]/60 blur-[60px] pointer-events-none select-none"
                aria-hidden="true"
            />

            <div className="relative z-10 flex flex-col items-center justify-center text-center gap-6 max-w-xl">
                <span className="font-sk-concretica text-[6rem] sm:text-[8rem] md:text-[10rem] leading-none text-primary select-none">
                    {t("serverError.code")}
                </span>

                <h1 className="font-sk-concretica text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem] font-normal text-foreground uppercase leading-tight tracking-tight">
                    {t("serverError.title")}
                </h1>

                <p className="font-poppins text-foreground/70 text-base md:text-lg leading-relaxed">
                    {t("serverError.subtitle")}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
                    <Button variant="secondary" onClick={reset}>
                        {t("serverError.retry")}
                    </Button>
                    <Button href="/" variant="primary">
                        {t("serverError.cta")}
                    </Button>
                </div>
            </div>
        </section>
    );
}
