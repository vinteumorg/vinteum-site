"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface BlogShareButtonsProps {
    title: string;
    url: string;
}

export function BlogShareButtons({ title, url }: BlogShareButtonsProps) {
    const { t } = useLanguage();
    const [copied, setCopied] = useState(false);

    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareLinks = [
        {
            label: "Twitter",
            href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            ),
        },
        {
            label: "LinkedIn",
            href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" />
                </svg>
            ),
        },
        {
            label: "Nostr",
            href: `https://njump.me/?q=${encodedTitle}+${encodedUrl}`,
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" fill="none" stroke="currentColor" />
                    <path d="M8 12h8M12 8v8" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" />
                </svg>
            ),
        },
    ];

    return (
        <div className="flex flex-wrap items-center gap-3">
            <span className="font-space-mono text-xs text-foreground/40 uppercase tracking-widest">
                {t("blog.post.share")}
            </span>

            {shareLinks.map(({ label, href, icon }) => (
                <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${t("blog.post.shareOn")} ${label}`}
                    className="w-9 h-9 rounded-xl border border-primary/20 bg-[rgba(49,66,45,0.2)] flex items-center justify-center text-foreground/50 hover:border-primary hover:text-primary transition-all duration-200"
                >
                    {icon}
                </a>
            ))}

            {/* Copy link */}
            <button
                type="button"
                onClick={handleCopy}
                aria-label={t("blog.post.copyLink")}
                className="w-9 h-9 rounded-xl border border-primary/20 bg-[rgba(49,66,45,0.2)] flex items-center justify-center text-foreground/50 hover:border-primary hover:text-primary transition-all duration-200 relative"
            >
                {copied ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#91FFAE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                    </svg>
                ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                )}
            </button>

            {copied && (
                <span className="font-poppins text-xs text-primary animate-fade-in">
                    {t("blog.post.linkCopied")}
                </span>
            )}
        </div>
    );
}
