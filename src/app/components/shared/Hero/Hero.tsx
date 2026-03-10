"use client";

import type { HeroProps } from "./types";
import { HeroBackground } from "./HeroBackground";
import { HeroContent } from "./HeroContent";
import { SponsorsCarousel } from "./SponsorsCarousel";

export function Hero({
    variant,
    title,
    subtitle,
    subtitleNode,
    cta,
    backgroundImage,
    secondaryBackgroundImage,
    sponsors,
    className = "",
}: HeroProps) {
    const showGlow = variant !== "sponsors";
    const showSubtitle = variant === "default" || variant === "dual-background" || variant === "simple";
    const showCta = variant === "default";

    return (
        <section
            className={`relative w-full overflow-hidden flex flex-col items-center justify-center ${className}`}
        >
            <HeroBackground
                primaryImage={backgroundImage}
                secondaryImage={variant === "dual-background" ? secondaryBackgroundImage : undefined}
                showGlow={showGlow}
            />

            <HeroContent
                title={title}
                subtitle={showSubtitle ? subtitle : undefined}
                subtitleNode={showSubtitle ? subtitleNode : undefined}
                cta={showCta ? cta : undefined}
            />

            {variant === "sponsors" && sponsors && (
                <SponsorsCarousel
                    title={sponsors.title}
                    logos={sponsors.logos}
                />
            )}
        </section>
    );
}
