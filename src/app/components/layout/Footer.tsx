"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import type { GhostNewsletter } from "@/lib/ghost";

type FooterNewsletterStep = "email" | "newsletters" | "success" | "error";

interface FooterProps {
    newsletters: GhostNewsletter[];
}

export function Footer({ newsletters }: FooterProps) {
    const { t } = useLanguage();

    const [step, setStep] = useState<FooterNewsletterStep>("email");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [selected, setSelected] = useState<string[]>(() => newsletters.map((nl) => nl.id));
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isValidEmail = (value: string) =>
        /^[^\s@,]+@[^\s@,]+\.[a-zA-Z]{2,}$/.test(value.trim());

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValidEmail(email)) {
            setEmailError(t("footer.newsletter.emailInvalid"));
            return;
        }
        setEmailError("");
        setStep("newsletters");
    };

    const toggleNewsletter = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((k) => k !== id) : [...prev, id]
        );
    };

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selected.length === 0) return;
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/newsletter/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, newsletters: selected }),
            });
            setStep(res.ok ? "success" : "error");
        } catch {
            setStep("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const newsletterBox = (
        <div className="bg-badge-bg border border-primary rounded-[32px] p-8 flex flex-col">
            <h3 className="text-2xl font-normal mb-8 whitespace-pre-line font-rethink">
                {t("footer.newsletter.title")}
            </h3>

            {step === "success" && (
                <p className="font-poppins text-sm text-primary mt-auto">
                    {t("footer.newsletter.success")}
                </p>
            )}

            {step === "error" && (
                <p className="font-poppins text-sm text-red-400 mt-auto">
                    {t("footer.newsletter.error")}
                </p>
            )}

            {step === "email" && (
                <form onSubmit={handleEmailSubmit} className="relative mt-auto">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                        placeholder={t("footer.newsletter.placeholder")}
                        className={`w-full bg-transparent border-b text-foreground placeholder:text-foreground-secondary pb-2 pr-10 focus:outline-none transition-colors ${emailError ? "border-red-400" : "border-foreground-secondary focus:border-primary"}`}
                    />
                    {emailError && (
                        <p className="font-poppins text-xs text-red-400 mt-2">{emailError}</p>
                    )}
                    <button
                        type="submit"
                        className="absolute right-0 bottom-2 text-primary hover:text-primary-hover transition-colors"
                        aria-label={t("footer.newsletter.submit")}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>
                </form>
            )}

            {step === "newsletters" && (
                <form onSubmit={handleSubscribe} className="flex flex-col gap-5 mt-auto">
                    <div className="flex items-center gap-2">
                        <p className="font-poppins text-xs text-foreground/50 truncate">{email}</p>
                        <button
                            type="button"
                            onClick={() => { setStep("email"); setEmailError(""); }}
                            className="shrink-0 text-foreground/40 hover:text-primary transition-colors"
                            aria-label="Edit email"
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                        </button>
                    </div>

                    {newsletters.length > 0 && (
                        <div className="flex flex-col gap-2">
                            <span className="font-poppins text-xs text-foreground/50 uppercase tracking-widest">
                                {t("footer.newsletter.chooseLabel")}
                            </span>
                            {newsletters.map((nl) => (
                                <label key={nl.id} className="flex items-center gap-3 cursor-pointer group">
                                    <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${selected.includes(nl.id) ? "bg-primary border-primary" : "border-foreground/30 group-hover:border-primary/60"}`}>
                                        {selected.includes(nl.id) && (
                                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#172719" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M2 5l2 2 4-4" />
                                            </svg>
                                        )}
                                    </span>
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={selected.includes(nl.id)}
                                        onChange={() => toggleNewsletter(nl.id)}
                                    />
                                    <span className="font-poppins text-sm text-foreground/80">{nl.name}</span>
                                </label>
                            ))}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting || selected.length === 0}
                        className="self-start inline-flex items-center gap-3 pl-5 pr-2 py-2 rounded-[10px] bg-primary hover:bg-primary-hover transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="font-poppins text-sm font-medium text-[#172719]">
                            {isSubmitting ? "…" : t("footer.newsletter.subscribeBtn")}
                        </span>
                        <span className="w-7 h-7 rounded-lg bg-[#59D279] flex items-center justify-center shrink-0">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#172719" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M7 17L17 7M17 7H7M17 7v10" />
                            </svg>
                        </span>
                    </button>
                </form>
            )}
        </div>
    );

    return (
        <footer className="bg-background-sheet text-foreground py-12 px-8 md:px-14 lg:px-20 font-poppins">
            <div className="max-w-7xl mx-auto">
                {/* Desktop Layout */}
                <div className="hidden lg:grid lg:grid-cols-[400px_1fr_auto] gap-12 items-stretch">
                    {newsletterBox}

                    <div className="flex flex-col gap-8">
                        <div className="flex gap-4 text-foreground-secondary text-sm">
                            <Link href="/contact" className="hover:text-primary transition-colors">
                                {t("footer.contact")}
                            </Link>
                            <span className="text-primary">/</span>
                            <Link href="/brandkit" className="hover:text-primary transition-colors">
                                {t("footer.brandkit")}
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 gap-12">
                            <div>
                                <ul className="space-y-3">
                                    <li><Link href="/" className="text-foreground hover:text-primary transition-colors text-lg">{t("footer.home.title")}</Link></li>
                                    <li><Link href="/about" className="text-foreground hover:text-primary transition-colors text-lg">{t("footer.home.about")}</Link></li>
                                    <li><Link href="/about#supporters" className="text-foreground hover:text-primary transition-colors text-lg">{t("footer.home.supporters")}</Link></li>
                                    <li>
                                        <Link href="/donate" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors inline-flex items-center gap-2 text-lg">
                                            {t("footer.home.support")}
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                                <polyline points="15 3 21 3 21 9" />
                                                <line x1="10" y1="14" x2="21" y2="3" />
                                            </svg>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-primary font-semibold mb-4 text-sm tracking-wider">{t("footer.programs.title")}</h4>
                                <ul className="space-y-3">
                                    <li><Link href="/programs/mastering-seminars" className="text-foreground hover:text-primary transition-colors text-lg">{t("footer.programs.mastering")}</Link></li>
                                    <li><Link href="/programs/bitcoin-dev-launchpad" className="text-foreground hover:text-primary transition-colors text-lg">{t("footer.programs.launchpad")}</Link></li>
                                    <li><Link href="/programs/fellowship" className="text-foreground hover:text-primary transition-colors text-lg">{t("footer.programs.fellowship")}</Link></li>
                                    <li><Link href="/programs/grants" className="text-foreground hover:text-primary transition-colors text-lg">{t("footer.programs.grants")}</Link></li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-4">
                            {[
                                { href: "https://twitter.com/vinteum_org", src: "/assets/icons/social/twitter.svg", label: "Twitter/X" },
                                { href: "https://linkedin.com/company/vinteum", src: "/assets/icons/social/linkedin.svg", label: "LinkedIn" },
                                { href: "https://discord.gg/vinteum", src: "/assets/icons/social/discord.svg", label: "Discord" },
                                { href: "https://instagram.com/vinteum_org", src: "/assets/icons/social/instagram.svg", label: "Instagram" },
                                { href: "https://njump.me/npub13s0kzccx2g7pnwwt5mjuwttl3m74t9qxyr6q7f9978e98tyjrw3qvx5g70", src: "/assets/icons/social/nostr.svg", label: "Nostr" },
                            ].map(({ href, src, label }) => (
                                <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity" aria-label={label}>
                                    <Image src={src} alt={label} width={48} height={48} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                        <Link href="/" className="hover:opacity-80 transition-opacity">
                            <Image src="/assets/logos/vinteum.svg" alt="Vinteum" width={150} height={40} priority />
                        </Link>
                        <button
                            onClick={scrollToTop}
                            className="w-16 h-16 rounded-full border border-primary flex items-center justify-center hover:bg-primary/10 transition-colors text-primary"
                            aria-label={t("footer.scrollTop")}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 19V5M5 12l7-7 7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Layout */}
                <div className="lg:hidden flex flex-col gap-6">
                    <Link href="/" className="hover:opacity-80 transition-opacity">
                        <Image src="/assets/logos/vinteum.svg" alt="Vinteum" width={120} height={32} priority />
                    </Link>
                    <div className="w-full">
                        {newsletterBox}
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                            {[
                                { href: "https://twitter.com/vinteum_org", src: "/assets/icons/social/twitter.svg", label: "Twitter/X" },
                                { href: "https://linkedin.com/company/vinteum", src: "/assets/icons/social/linkedin.svg", label: "LinkedIn" },
                                { href: "https://discord.gg/vinteum", src: "/assets/icons/social/discord.svg", label: "Discord" },
                                { href: "https://instagram.com/vinteum_org", src: "/assets/icons/social/instagram.svg", label: "Instagram" },
                                { href: "https://njump.me/npub13s0kzccx2g7pnwwt5mjuwttl3m74t9qxyr6q7f9978e98tyjrw3qvx5g70", src: "/assets/icons/social/nostr.svg", label: "Nostr" },
                            ].map(({ href, src, label }) => (
                                <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity" aria-label={label}>
                                    <Image src={src} alt={label} width={36} height={36} />
                                </a>
                            ))}
                        </div>
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
