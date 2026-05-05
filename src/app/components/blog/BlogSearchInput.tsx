"use client";

import { useLanguage } from "@/contexts/LanguageContext";

interface BlogSearchInputProps {
    value: string;
    onChange: (value: string) => void;
}

export function BlogSearchInput({ value, onChange }: BlogSearchInputProps) {
    const { t } = useLanguage();

    return (
        <div className="relative w-full max-w-xs">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/40" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                </svg>
            </div>
            <input
                type="search"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={t("blog.hero.searchPlaceholder")}
                aria-label={t("blog.hero.searchPlaceholder")}
                className="w-full pl-9 pr-4 py-2 rounded-full border border-primary/20 bg-[rgba(49,66,45,0.15)] text-foreground placeholder:text-foreground/40 font-poppins text-sm focus:outline-none focus:border-primary transition-colors"
            />
        </div>
    );
}
