"use client";

import { useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { SectionTitle } from "../shared/SectionTitle";
import { CTAButton } from "../shared/CTAButton";

// TODO: replace with real Vinteum Bitcoin addresses
const BITCOIN_ADDRESS = "bc1qvinteum000000000000000000000000000000000";
const LIGHTNING_ADDRESS = "vinteum@vinteum.com";

function CopyButton({ text, label, copiedLabel }: { text: string; label: string; copiedLabel: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 font-space-mono text-xs text-foreground/60 hover:text-primary transition-colors cursor-pointer"
            aria-label={label}
        >
            {copied ? (
                <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#91FFAE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span className="text-primary">{copiedLabel}</span>
                </>
            ) : (
                <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    <span>{label}</span>
                </>
            )}
        </button>
    );
}

export function DonateOptionsSection() {
    const { t } = useLanguage();

    return (
        <section className="relative w-full pb-12 md:pb-28" id="donate-bitcoin">
            <div className="max-w-7xl mx-auto px-8 md:px-14 lg:px-20">
                {/* Header */}
                <div className="flex flex-col items-center gap-5 mb-14 text-center">
                    <SectionTitle>{t("donate.options.title")}</SectionTitle>
                </div>

                {/* Cards */}
                <div className="flex flex-col lg:flex-row gap-5 lg:items-stretch">

                    {/* Bitcoin card */}
                    <div className="lg:w-[58%] rounded-[30px] border border-primary/20 backdrop-blur-sm bg-[rgba(49,66,45,0.12)] shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-8 md:p-10 flex flex-col gap-8">
                        {/* Label */}
                        <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                                <Image src="/assets/icons/system/menu.svg" alt="" width={16} height={16} aria-hidden="true" className="opacity-0 absolute" />
                                {/* Bitcoin ₿ symbol */}
                                <span className="font-space-mono text-sm text-primary font-bold">₿</span>
                            </span>
                            <span className="font-rethink-sans text-xl text-foreground">
                                {t("donate.options.bitcoin.label")}
                            </span>
                        </div>

                        <p className="font-poppins text-sm text-foreground/70 leading-relaxed">
                            {t("donate.options.bitcoin.description")}
                        </p>

                        {/* QR + addresses side by side */}
                        <div className="flex flex-col sm:flex-row gap-6 items-start">
                            {/* QR code placeholder */}
                            <div className="flex flex-col items-center gap-2 shrink-0">
                                <div className="w-36 h-36 rounded-2xl border border-primary/20 bg-[rgba(49,66,45,0.3)] flex items-center justify-center">
                                    {/* QR placeholder grid */}
                                    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-label={t("donate.options.bitcoin.qrHint")}>
                                        <rect x="2" y="2" width="28" height="28" rx="3" stroke="#91FFAE" strokeWidth="2" fill="none" />
                                        <rect x="10" y="10" width="12" height="12" rx="1" fill="#91FFAE" fillOpacity="0.5" />
                                        <rect x="50" y="2" width="28" height="28" rx="3" stroke="#91FFAE" strokeWidth="2" fill="none" />
                                        <rect x="58" y="10" width="12" height="12" rx="1" fill="#91FFAE" fillOpacity="0.5" />
                                        <rect x="2" y="50" width="28" height="28" rx="3" stroke="#91FFAE" strokeWidth="2" fill="none" />
                                        <rect x="10" y="58" width="12" height="12" rx="1" fill="#91FFAE" fillOpacity="0.5" />
                                        <rect x="40" y="40" width="6" height="6" rx="1" fill="#91FFAE" fillOpacity="0.4" />
                                        <rect x="50" y="40" width="6" height="6" rx="1" fill="#91FFAE" fillOpacity="0.4" />
                                        <rect x="60" y="40" width="6" height="6" rx="1" fill="#91FFAE" fillOpacity="0.4" />
                                        <rect x="70" y="40" width="6" height="6" rx="1" fill="#91FFAE" fillOpacity="0.4" />
                                        <rect x="40" y="50" width="6" height="6" rx="1" fill="#91FFAE" fillOpacity="0.4" />
                                        <rect x="60" y="50" width="6" height="6" rx="1" fill="#91FFAE" fillOpacity="0.4" />
                                        <rect x="40" y="60" width="6" height="6" rx="1" fill="#91FFAE" fillOpacity="0.4" />
                                        <rect x="50" y="60" width="6" height="6" rx="1" fill="#91FFAE" fillOpacity="0.4" />
                                        <rect x="60" y="70" width="6" height="6" rx="1" fill="#91FFAE" fillOpacity="0.4" />
                                        <rect x="70" y="70" width="6" height="6" rx="1" fill="#91FFAE" fillOpacity="0.4" />
                                    </svg>
                                </div>
                                <span className="font-poppins text-xs text-foreground/40">
                                    {t("donate.options.bitcoin.qrHint")}
                                </span>
                            </div>

                            {/* Addresses */}
                            <div className="flex flex-col gap-5 flex-1 min-w-0">
                                {/* On-chain */}
                                <div className="flex flex-col gap-2">
                                    <span className="font-poppins text-xs text-foreground/40 uppercase tracking-widest">
                                        {t("donate.options.bitcoin.addressLabel")}
                                    </span>
                                    <div className="rounded-xl border border-primary/20 bg-[rgba(49,66,45,0.2)] px-4 py-3 flex flex-col gap-2">
                                        <span className="font-space-mono text-xs text-foreground/80 break-all leading-relaxed">
                                            {BITCOIN_ADDRESS}
                                        </span>
                                        <CopyButton
                                            text={BITCOIN_ADDRESS}
                                            label={t("donate.options.bitcoin.copyAddress")}
                                            copiedLabel={t("donate.options.bitcoin.copied")}
                                        />
                                    </div>
                                </div>

                                {/* Lightning */}
                                <div className="flex flex-col gap-2" id="donate-lightning">
                                    <span className="font-poppins text-xs text-foreground/40 uppercase tracking-widest">
                                        {t("donate.options.bitcoin.lightningLabel")}
                                    </span>
                                    <div className="rounded-xl border border-primary/20 bg-[rgba(49,66,45,0.2)] px-4 py-3 flex flex-col gap-2">
                                        <span className="font-space-mono text-xs text-foreground/80 break-all">
                                            {LIGHTNING_ADDRESS}
                                        </span>
                                        <CopyButton
                                            text={LIGHTNING_ADDRESS}
                                            label={t("donate.options.bitcoin.copyAddress")}
                                            copiedLabel={t("donate.options.bitcoin.copied")}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Fiat card */}
                    <div
                        className="lg:w-[42%] rounded-[30px] border border-primary/20 backdrop-blur-sm bg-[rgba(49,66,45,0.12)] shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-8 md:p-10 flex flex-col justify-between gap-10"
                        id="donate-fiat"
                    >
                        <div className="flex flex-col gap-6">
                            {/* Label */}
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#91FFAE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <rect x="2" y="5" width="20" height="14" rx="2" />
                                        <path d="M2 10h20" />
                                    </svg>
                                </span>
                                <span className="font-rethink-sans text-xl text-foreground">
                                    {t("donate.options.fiat.label")}
                                </span>
                            </div>

                            <p className="font-poppins text-sm text-foreground/70 leading-relaxed">
                                {t("donate.options.fiat.description")}
                            </p>
                        </div>

                        <div>
                            <CTAButton
                                href=""
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {t("donate.options.fiat.cta")}
                            </CTAButton>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
