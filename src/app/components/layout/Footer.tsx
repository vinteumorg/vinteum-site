"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

export function Footer() {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { t } = useLanguage();

    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // TODO: Implement newsletter subscription
        console.log("Newsletter subscription:", email);
        setTimeout(() => {
            setIsSubmitting(false);
            setEmail("");
        }, 1000);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="bg-background-sheet text-foreground py-12 px-8 md:px-14 lg:px-20 font-poppins">
            <div className="max-w-7xl mx-auto">
                {/* Desktop Layout */}
                <div className="hidden lg:grid lg:grid-cols-[400px_1fr_auto] gap-12 items-stretch">
                    {/* Newsletter Box */}
                    <div className="bg-badge-bg border border-primary rounded-[32px] p-8 flex flex-col">
                        <h3 className="text-2xl font-normal mb-8 whitespace-pre-line font-rethink">
                            {t("footer.newsletter.title")}
                        </h3>
                        <form onSubmit={handleNewsletterSubmit} className="relative mt-auto">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t("footer.newsletter.placeholder")}
                                required
                                className="w-full bg-transparent border-b border-foreground-secondary text-foreground placeholder:text-foreground-secondary pb-2 pr-10 focus:outline-none focus:border-primary transition-colors"
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="absolute right-0 bottom-2 text-primary hover:text-primary-hover transition-colors"
                                aria-label={t("footer.newsletter.submit")}
                            >
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </button>
                        </form>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex flex-col gap-8">
                        {/* Top Links */}
                        <div className="flex gap-4 text-foreground-secondary text-sm">
                            <Link
                                href="/contact"
                                className="hover:text-primary transition-colors"
                            >
                                {t("footer.contact")}
                            </Link>
                            <span className="text-primary">/</span>
                            <Link
                                href="/brandkit"
                                className="hover:text-primary transition-colors"
                            >
                                {t("footer.brandkit")}
                            </Link>
                        </div>

                        {/* Two Column Links */}
                        <div className="grid grid-cols-2 gap-12">
                            {/* HOME Column */}
                            <div>
                                <ul className="space-y-3">
                                    <li>
                                        <Link
                                            href="/"
                                            className="text-foreground hover:text-primary transition-colors text-lg"
                                        >
                                            {t("footer.home.title")}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/about"
                                            className="text-foreground hover:text-primary transition-colors text-lg"
                                        >
                                            {t("footer.home.about")}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/about#supporters"
                                            className="text-foreground hover:text-primary transition-colors text-lg"
                                        >
                                            {t("footer.home.supporters")}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/donate"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-foreground hover:text-primary transition-colors inline-flex items-center gap-2 text-lg"
                                        >
                                            {t("footer.home.support")}
                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="text-primary"
                                            >
                                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                                <polyline points="15 3 21 3 21 9" />
                                                <line x1="10" y1="14" x2="21" y2="3" />
                                            </svg>
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            {/* PROGRAMS Column */}
                            <div>
                                <h4 className="text-primary font-semibold mb-4 text-sm tracking-wider">
                                    {t("footer.programs.title")}
                                </h4>
                                <ul className="space-y-3">
                                    <li>
                                        <Link
                                            href="/programs/mastering-seminars"
                                            className="text-foreground hover:text-primary transition-colors text-lg"
                                        >
                                            {t("footer.programs.mastering")}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/programs/bitcoin-dev-launchpad"
                                            className="text-foreground hover:text-primary transition-colors text-lg"
                                        >
                                            {t("footer.programs.launchpad")}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/programs/fellowship"
                                            className="text-foreground hover:text-primary transition-colors text-lg"
                                        >
                                            {t("footer.programs.fellowship")}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/programs/grants"
                                            className="text-foreground hover:text-primary transition-colors text-lg"
                                        >
                                            {t("footer.programs.grants")}
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Social Icons */}
                        <div className="flex gap-4 mt-4">
                            <a
                                href="https://twitter.com/vinteum_org"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:opacity-70 transition-opacity"
                                aria-label="Twitter/X"
                            >
                                <Image
                                    src="/assets/icons/social/twitter.svg"
                                    alt="Twitter"
                                    width={48}
                                    height={48}
                                />
                            </a>
                            <a
                                href="https://linkedin.com/company/vinteum"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:opacity-70 transition-opacity"
                                aria-label="LinkedIn"
                            >
                                <Image
                                    src="/assets/icons/social/linkedin.svg"
                                    alt="LinkedIn"
                                    width={48}
                                    height={48}
                                />
                            </a>
                            <a
                                href="https://discord.gg/vinteum"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:opacity-70 transition-opacity"
                                aria-label="Discord"
                            >
                                <Image
                                    src="/assets/icons/social/discord.svg"
                                    alt="Discord"
                                    width={48}
                                    height={48}
                                />
                            </a>
                            <a
                                href="https://instagram.com/vinteum_org"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:opacity-70 transition-opacity"
                                aria-label="Instagram"
                            >
                                <Image
                                    src="/assets/icons/social/instagram.svg"
                                    alt="Instagram"
                                    width={48}
                                    height={48}
                                />
                            </a>
                            <a
                                href="https://njump.me/npub13s0kzccx2g7pnwwt5mjuwttl3m74t9qxyr6q7f9978e98tyjrw3qvx5g70 "
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:opacity-70 transition-opacity"
                                aria-label="Nostr"
                            >
                                <Image
                                    src="/assets/icons/social/nostr.svg"
                                    alt="Nostr"
                                    width={48}
                                    height={48}
                                />
                            </a>
                        </div>
                    </div>

                    {/* Logo + Scroll to Top */}
                    <div className="flex flex-col items-end justify-between">
                        <Link href="/" className="hover:opacity-80 transition-opacity">
                            <Image
                                src="/assets/logos/vinteum.svg"
                                alt="Vinteum"
                                width={150}
                                height={40}
                                priority
                            />
                        </Link>
                        <button
                            onClick={scrollToTop}
                            className="w-16 h-16 rounded-full border border-primary flex items-center justify-center hover:bg-primary/10 transition-colors text-primary"
                            aria-label={t("footer.scrollTop")}
                        >
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M12 19V5M5 12l7-7 7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Layout */}
                <div className="lg:hidden flex flex-col gap-6">
                    {/* Logo */}
                    <Link href="/" className="hover:opacity-80 transition-opacity">
                        <Image
                            src="/assets/logos/vinteum.svg"
                            alt="Vinteum"
                            width={120}
                            height={32}
                            priority
                        />
                    </Link>

                    {/* Newsletter Box — 100% width */}
                    <div className="bg-badge-bg border border-primary rounded-3xl p-6 w-full">
                        <h3 className="text-xl font-normal mb-6 whitespace-pre-line font-rethink">
                            {t("footer.newsletter.title")}
                        </h3>
                        <form onSubmit={handleNewsletterSubmit} className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t("footer.newsletter.placeholder")}
                                required
                                className="w-full bg-transparent border-b border-foreground-secondary text-foreground placeholder:text-foreground-secondary pb-2 pr-10 focus:outline-none focus:border-primary transition-colors"
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="absolute right-0 bottom-2 text-primary hover:text-primary-hover transition-colors"
                                aria-label={t("footer.newsletter.submit")}
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </button>
                        </form>
                    </div>

                    {/* Social Icons and Scroll to Top */}
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                            <a href="https://twitter.com/vinteum_org" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity" aria-label="Twitter/X">
                                <Image src="/assets/icons/social/twitter.svg" alt="Twitter" width={36} height={36} />
                            </a>
                            <a href="https://linkedin.com/company/vinteum" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity" aria-label="LinkedIn">
                                <Image src="/assets/icons/social/linkedin.svg" alt="LinkedIn" width={36} height={36} />
                            </a>
                            <a href="https://discord.gg/vinteum" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity" aria-label="Discord">
                                <Image src="/assets/icons/social/discord.svg" alt="Discord" width={36} height={36} />
                            </a>
                            <a href="https://instagram.com/vinteum_org" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity" aria-label="Instagram">
                                <Image src="/assets/icons/social/instagram.svg" alt="Instagram" width={36} height={36} />
                            </a>
                            <a href="https://nostr.com/vinteum" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity" aria-label="Nostr">
                                <Image src="/assets/icons/social/nostr.svg" alt="Nostr" width={36} height={36} />
                            </a>
                        </div>

                        {/* Scroll to Top Button */}
                        <button
                            onClick={scrollToTop}
                            className="w-12 h-12 rounded-full border border-primary flex items-center justify-center hover:bg-primary/10 transition-colors text-primary"
                            aria-label={t("footer.scrollTop")}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 19V5M5 12l7-7 7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
