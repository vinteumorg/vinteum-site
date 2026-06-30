"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

type Submenu = "programs" | "community" | null;

interface MenuModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Offset for each submenu: index * item-height (2.5rem * 1.15 line-height + 0.5rem py ≈ 3.375rem)
// programs = index 3 → 3 * 3.375 = 10.125rem
// community = index 4 → 4 * 3.375 = 13.5rem
const submenuOffsetClass: Record<string, string> = {
    programs: "lg:pt-[10.125rem]",
    community: "lg:pt-[13.5rem]",
};

const programsLinks = [
    { key: "programsItems.mastering", href: "/programs/mastering-seminars" },
    { key: "programsItems.launchpad", href: "/programs/bitcoin-dev-launchpad" },
    { key: "programsItems.fellowship", href: "/programs/fellowship" },
    { key: "programsItems.grants", href: "/programs/grants" },
];

const communityLinks = [
    { key: "communityItems.discord", href: "https://discord.gg/vinteum" },
    { key: "communityItems.meetups", href: "/bitdevs" },
    { key: "communityItems.hackerhouse", href: "https://casa21.vinteum.org/" },
];

const mainItems = [
    { key: "home", href: "/", hasSubmenu: false },
    { key: "about", href: "/about", hasSubmenu: false },
    { key: "supporters", href: "/about#supporters", hasSubmenu: false },
    { key: "programs", href: null, hasSubmenu: true, submenu: "programs" as const },
    { key: "community", href: null, hasSubmenu: true, submenu: "community" as const },
    { key: "blog", href: "/blog", hasSubmenu: false },
    { key: "contact", href: "/contact", hasSubmenu: false },
    { key: "donate", href: "/donate", hasSubmenu: false },
];

export function MenuModal({ isOpen, onClose }: MenuModalProps) {
    const { t } = useLanguage();
    const pathname = usePathname();
    const [activeSubmenu, setActiveSubmenu] = useState<Submenu>(null);

    const handleClose = useCallback(() => {
        setActiveSubmenu(null);
        onClose();
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") handleClose();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [handleClose]);

    const isActive = (href: string) => pathname === href;

    const submenuLinks = activeSubmenu === "programs" ? programsLinks : communityLinks;

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-xl"
            role="dialog"
            aria-modal="true"
            aria-label={t("nav.openMenu")}
        >
            <div className="max-w-7xl mx-auto px-8 md:px-14 lg:px-20 pt-6">
                <button
                    onClick={handleClose}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-foreground/30 text-foreground font-space-mono text-sm hover:border-primary hover:text-primary transition-colors cursor-pointer"
                    aria-label={t("nav.closeMenu")}
                >
                    <span className="text-xs">✕</span>
                    <span>{t("menu.close")}</span>
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-8 md:px-14 lg:px-20 pt-6 lg:pt-10 flex flex-col lg:flex-row gap-6 lg:gap-24 overflow-y-auto max-h-[calc(100vh-7rem)]">
                {/* Left — Main items */}
                <nav className="flex flex-col">
                    {mainItems.map((item) => {
                        const label = t(`menu.${item.key}`);
                        const active = item.href
                            ? isActive(item.href)
                            : activeSubmenu === item.submenu;

                        if (item.hasSubmenu) {
                            const isExpanded = activeSubmenu === item.submenu;
                            const subLinks = item.submenu === "programs" ? programsLinks : communityLinks;
                            return (
                                <Fragment key={item.key}>
                                    <button
                                        onClick={() =>
                                            setActiveSubmenu(isExpanded ? null : (item.submenu ?? null))
                                        }
                                        className={`py-2.5 lg:py-0 lg:h-[3.375rem] flex items-center gap-3 font-space-mono text-left text-xl lg:text-[2.5rem] leading-[1.15] transition-colors cursor-pointer ${active
                                            ? "text-foreground font-bold"
                                            : "text-foreground/40 hover:text-foreground/80"
                                            }`}
                                    >
                                        {label}
                                        <span
                                            className={`text-2xl transition-all duration-200 ${isExpanded ? "translate-x-1 text-primary" : ""
                                                }`}
                                        >
                                            &gt;
                                        </span>
                                    </button>
                                    {isExpanded && (
                                        <div className="lg:hidden flex flex-col pl-4 border-l border-foreground/30 mb-1">
                                            {subLinks.map((link) => {
                                                const subLabel = t(`menu.${link.key}`);
                                                const external = link.href.startsWith("http");
                                                return (
                                                    <Link
                                                        key={link.key}
                                                        href={link.href}
                                                        onClick={handleClose}
                                                        target={external ? "_blank" : undefined}
                                                        rel={external ? "noopener noreferrer" : undefined}
                                                        className="py-2 flex items-center font-space-mono text-base leading-[1.15] text-foreground/80 hover:text-foreground transition-colors"
                                                    >
                                                        {subLabel}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </Fragment>
                            );
                        }

                        const external = item.href?.startsWith("http");
                        return (
                            <Link
                                key={item.key}
                                href={item.href!}
                                onClick={handleClose}
                                target={external ? "_blank" : undefined}
                                rel={external ? "noopener noreferrer" : undefined}
                                className={`py-2.5 lg:py-0 lg:h-[3.375rem] flex items-center font-space-mono text-xl lg:text-[2.5rem] leading-[1.15] transition-colors ${active
                                    ? "text-primary underline underline-offset-4 decoration-primary"
                                    : "text-foreground/40 hover:text-foreground/80"
                                    }`}
                            >
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right — Submenu aligned to its triggering item */}
                {activeSubmenu && (
                    <nav
                        className={`hidden lg:flex flex-col animate-in fade-in slide-in-from-left-2 duration-200 ${submenuOffsetClass[activeSubmenu]}`}
                    >
                        {submenuLinks.map((link) => {
                            const label = t(`menu.${link.key}`);
                            const external = link.href.startsWith("http");
                            return (
                                <Link
                                    key={link.key}
                                    href={link.href}
                                    onClick={handleClose}
                                    target={external ? "_blank" : undefined}
                                    rel={external ? "noopener noreferrer" : undefined}
                                    className="h-[3.375rem] flex items-center font-space-mono text-[2.5rem] leading-[1.15] text-foreground/80 hover:text-foreground transition-colors"
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </nav>
                )}
            </div>
        </div>
    );
}
