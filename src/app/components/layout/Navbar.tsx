"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../shared/Button";
import { useLanguage } from "@/contexts/LanguageContext";
import { MenuModal } from "./MenuModal";

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { locale, setLocale, t } = useLanguage();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        // Check position immediately on mount (handles page refresh mid-scroll)
        handleScroll();

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? "bg-background/70 backdrop-blur-md"
                    : "bg-transparent"
                    }`}
            >
                <nav className="max-w-7xl mx-auto px-8 md:px-14 lg:px-20 h-16 flex items-center justify-between">
                    {/* Left — Menu */}
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-space-mono text-sm cursor-pointer"
                        aria-label={t("nav.openMenu")}
                    >
                        <span>{t("nav.menu")}</span>
                        <Image
                            src="/assets/icons/system/menu.svg"
                            alt="Menu"
                            width={20}
                            height={20}
                        />
                    </button>

                    {/* Center — Logo */}
                    <Link
                        href="/"
                        className="absolute left-1/2 -translate-x-1/2 hover:opacity-80 transition-opacity"
                        aria-label="Vinteum"
                    >
                        <Image
                            src="/assets/logos/vinteum.svg"
                            alt="Vinteum"
                            width={130}
                            height={34}
                            priority
                        />
                    </Link>

                    {/* Right — Actions */}
                    <div className="flex items-center gap-3">
                        {/* Buttons — hidden on mobile */}
                        <div className="hidden lg:flex items-center gap-3">
                            <Button variant="secondary" href="/contact">
                                {t("nav.contact")}
                            </Button>
                            <Button
                                variant="primary"
                                href="/donate"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {t("nav.support")}
                            </Button>
                        </div>

                        {/* Language Toggle — always visible */}
                        <div className="flex items-center font-space-mono text-sm ml-2">
                            <button
                                onClick={() => setLocale("EN")}
                                className={`px-1 transition-colors cursor-pointer ${locale === "EN"
                                    ? "text-primary font-bold"
                                    : "text-foreground-secondary hover:text-foreground"
                                    }`}
                            >
                                EN
                            </button>
                            <span className="text-foreground-secondary select-none">|</span>
                            <button
                                onClick={() => setLocale("BR")}
                                className={`px-1 transition-colors cursor-pointer ${locale === "BR"
                                    ? "text-primary font-bold"
                                    : "text-foreground-secondary hover:text-foreground"
                                    }`}
                            >
                                BR
                            </button>
                        </div>
                    </div>
                </nav>
            </header>

            <MenuModal isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </>
    );
}

