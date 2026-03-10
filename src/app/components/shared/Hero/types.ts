import type { ReactNode } from "react";

export type HeroVariant = "default" | "simple" | "dual-background" | "sponsors";

export type HeroProps = {
    variant: HeroVariant;
    title: string;
    subtitle?: string;
    subtitleNode?: ReactNode;
    cta?: {
        label: string;
        href: string;
    };
    backgroundImage?: string;
    secondaryBackgroundImage?: string;
    sponsors?: {
        title: string;
        logos: { src: string; alt: string }[];
    };
    className?: string;
    children?: ReactNode;
};
