"use client";

import { useEffect } from "react";
import { Poppins, Space_Mono, Barlow_Condensed } from "next/font/google";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";

const barlowCondensed = Barlow_Condensed({
    variable: "--font-barlow-condensed",
    subsets: ["latin"],
    weight: ["600", "700", "800"],
});

const poppins = Poppins({
    variable: "--font-poppins",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
    variable: "--font-space-mono",
    subsets: ["latin"],
    weight: ["400", "700"],
});

interface GlobalErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

function GlobalErrorContent({ error, reset }: GlobalErrorProps) {
    const { t } = useLanguage();

    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden px-8 bg-[#0E0F0E]">
            {/* Glow */}
            <div
                className="absolute -top-[60px] left-1/2 -translate-x-1/2 w-[300px] h-[100px] rounded-[50%] bg-[#FFAE00]/60 blur-[60px] pointer-events-none select-none"
                aria-hidden="true"
            />

            <div className="relative z-10 flex flex-col items-center justify-center text-center gap-6 max-w-xl">
                <span className="font-sk-concretica text-[6rem] sm:text-[8rem] md:text-[10rem] leading-none text-[#91FFAE] select-none">
                    {t("serverError.code")}
                </span>

                <h1 className="font-sk-concretica text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem] font-normal text-white uppercase leading-tight tracking-tight">
                    {t("serverError.title")}
                </h1>

                <p className="font-poppins text-white/70 text-base md:text-lg leading-relaxed">
                    {t("serverError.subtitle")}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
                    <button
                        type="button"
                        onClick={reset}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-space-mono text-sm font-normal transition-all duration-200 cursor-pointer bg-white/10 text-white hover:opacity-90"
                    >
                        {t("serverError.retry")}
                    </button>
                    {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- global-error has no router context */}
                    <a
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-space-mono text-sm font-normal transition-all duration-200 cursor-pointer bg-[#91FFAE] text-black hover:bg-[#7de89a]"
                    >
                        {t("serverError.cta")}
                    </a>
                </div>
            </div>
        </section>
    );
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
    return (
        <html lang="pt-BR">
            <body
                className={`${poppins.variable} ${spaceMono.variable} ${barlowCondensed.variable} antialiased`}
            >
                <LanguageProvider>
                    <GlobalErrorContent error={error} reset={reset} />
                </LanguageProvider>
            </body>
        </html>
    );
}
