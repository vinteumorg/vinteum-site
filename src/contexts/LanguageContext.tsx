"use client";

import { createContext, useContext, useState, useEffect, useCallback, startTransition, ReactNode } from "react";
import pt from "@/i18n/locales/pt.json";
import en from "@/i18n/locales/en.json";

export type Locale = "BR" | "EN";

type Translations = Record<string, unknown>;

const STORAGE_KEY = "vinteum-locale";
const SUPPORTED_LOCALES: Locale[] = ["BR", "EN"];

const locales: Record<Locale, Translations> = { BR: pt as Translations, EN: en as Translations };

function getNestedValue(obj: Translations, path: string): string {
    const keys = path.split(".");
    let current: unknown = obj;
    for (const key of keys) {
        if (typeof current !== "object" || current === null) return path;
        current = (current as Record<string, unknown>)[key];
    }
    return typeof current === "string" ? current : path;
}

function detectLocale(): Locale {
    try {
        const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
        if (saved && SUPPORTED_LOCALES.includes(saved)) return saved;

        const browserLang = navigator.language || "";
        if (browserLang.toLowerCase().startsWith("pt")) return "BR";
    } catch {
        // localStorage or navigator unavailable
    }
    return "EN";
}

interface LanguageContextValue {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>("EN");

    useEffect(() => {
        startTransition(() => setLocaleState(detectLocale()));
    }, []);

    const setLocale = useCallback((next: Locale) => {
        try {
            localStorage.setItem(STORAGE_KEY, next);
        } catch {
            // localStorage unavailable
        }
        setLocaleState(next);
    }, []);

    const t = useCallback(
        (key: string) => getNestedValue(locales[locale], key),
        [locale]
    );

    return (
        <LanguageContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>");
    return ctx;
}
