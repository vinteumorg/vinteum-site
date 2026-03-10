import Image from "next/image";
import { CTAButton } from "./CTAButton";
import { GlassCard } from "./GlassCard";
import { SectionTitle } from "./SectionTitle";
import type { ReactNode } from "react";

interface TextCardContent {
    variant: "text";
    title?: string;
    description: string[];
}

interface MediaCardContent {
    variant: "media";
    imageSrc: string;
    imageAlt: string;
    title: string;
    description: string[];
    readMoreLabel: string;
    readMoreHref: string;
}

type CardContent = TextCardContent | MediaCardContent;

interface PrimaryAction {
    label: string;
    href: string;
}


interface BackgroundImage {
    src: string;
}

export interface FeatureShowcaseProps {
    /** Section title (left side). Supports \n for line breaks. */
    title: string | ReactNode;
    /** Card content — text-only or media variant. */
    card: CardContent;
    /** Optional primary CTA button on the left side. */
    action?: PrimaryAction;
    /** Optional background image anchored to the bottom-left. */
    backgroundImage?: BackgroundImage;
    /** Show a decorative gradient blur behind the card area. */
    decorativeBlur?: boolean;
    /** Additional className for the outer section. */
    className?: string;
}

export function FeatureShowcase({
    title,
    card,
    action,
    backgroundImage,
    decorativeBlur = false,
    className = "",
}: FeatureShowcaseProps) {
    return (
        <section
            className={`relative w-full py-12 md:py-28 ${className}`}
        >
            {/* Background image — bottom-left, overflow naturally */}
            {backgroundImage && (
                <div className="absolute bottom-[-400px] left-0 w-[140%] h-[120%] pointer-events-none select-none">
                    <Image
                        src={backgroundImage.src}
                        alt=""
                        fill
                        className="object-contain object-left-bottom"
                        aria-hidden="true"
                    />
                </div>
            )}

            {/* Decorative gradient blur — center to top-right, leaks outside content */}
            {decorativeBlur && (
                <div
                    className="absolute top-[15%] right-[15%] w-[40%] h-[50%] pointer-events-none select-none z-[1] rounded-full opacity-40 blur-3xl gradient-blur-decorative"
                    aria-hidden="true"
                />
            )}

            <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-14 lg:px-20">
                <div className="flex flex-col lg:flex-row items-start gap-4 lg:gap-16">
                    {/* Left side — promotional area */}
                    <div className="flex flex-col items-start gap-6 lg:w-[30%] shrink-0 pt-2 order-1">
                        {typeof title === "string" ? (
                            <SectionTitle className="whitespace-pre-line">{title}</SectionTitle>
                        ) : (
                            title
                        )}

                        {action && (
                            <CTAButton href={action.href}>
                                {action.label}
                            </CTAButton>
                        )}
                    </div>

                    {/* Right side — Glass card */}
                    <div className="relative w-full lg:w-[70%] order-2">
                        {card.variant === "media" ? (
                            <GlassCard
                                variant="media"
                                imageSrc={card.imageSrc}
                                imageAlt={card.imageAlt}
                                title={card.title}
                                description={card.description}
                                readMoreLabel={card.readMoreLabel}
                                readMoreHref={card.readMoreHref}
                            />
                        ) : (
                            <GlassCard
                                variant="text"
                                title={card.title}
                                description={card.description}
                            />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
