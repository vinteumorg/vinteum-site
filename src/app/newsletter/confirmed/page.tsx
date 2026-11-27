"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

// Landing page for the double opt-in link. The status comes from the confirm
// route: "ok" (now subscribed), "invalid" (expired or tampered link) or "error"
// (Ghost refused the update).
export default function NewsletterConfirmedPage() {
    const { t } = useLanguage();

    return (
        <section className="relative w-full min-h-[calc(100vh-80px)] flex items-center justify-center px-8 md:px-14 lg:px-20 py-24">
            <div className="max-w-xl w-full rounded-[30px] border border-primary/20 backdrop-blur-sm bg-[rgba(49,66,45,0.12)] shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-8 md:p-12 flex flex-col gap-6 text-center">
                <h1 className="font-rethink text-2xl md:text-3xl text-foreground">
                    {t("newsletter.confirmed.title")}
                </h1>
                <p className="font-poppins text-sm text-foreground/70 leading-relaxed">
                    {t("newsletter.confirmed.body")}
                </p>
                <Link
                    href="/blog"
                    className="inline-flex items-center justify-center gap-2 self-center px-5 py-2.5 rounded-full font-space-mono text-sm bg-primary text-btn-primary-text hover:bg-primary-hover transition-colors"
                >
                    {t("newsletter.confirmed.back")}
                </Link>
            </div>
        </section>
    );
}
