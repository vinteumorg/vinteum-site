import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

interface GlassCardTextVariant {
    variant: "text";
    title?: string;
    description: ReactNode[];
}

interface GlassCardMediaVariant {
    variant: "media";
    imageSrc: string;
    imageAlt: string;
    title: string;
    description: ReactNode[];
    readMoreLabel: string;
    readMoreHref: string;
}

interface GlassCardImageVariant {
    variant: "image";
    imageSrc: string;
    imageAlt: string;
}

type GlassCardProps = GlassCardTextVariant | GlassCardMediaVariant | GlassCardImageVariant;

export function GlassCard(props: GlassCardProps) {
    return (
        <div className="relative rounded-2xl p-3 md:p-5 border border-primary/20 overflow-hidden backdrop-blur-xsm bg-[rgba(49,66,45,0.12)] shadow-[0_8px_32px_rgba(0,0,0,0.3)] h-full">
            {props.variant === "image" ? (
                <div className="relative w-full h-full min-h-[300px] overflow-hidden rounded-xl">
                    <Image
                        src={props.imageSrc}
                        alt={props.imageAlt}
                        fill
                        className="object-cover w-full h-full"
                    />
                </div>
            ) : props.variant === "media" ? (
                <div className="flex flex-col h-full">
                    {/* Image */}
                    <div className="relative w-full aspect-[16/9] m-2 md:m-4 mb-0 overflow-hidden rounded-xl max-w-[calc(100%-1rem)] md:max-w-[calc(100%-2rem)]">
                        <Image
                            src={props.imageSrc}
                            alt={props.imageAlt}
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-3 pt-3 md:p-6 md:pt-5">
                        <h3 className="font-rethink-sans text-2xl md:text-3xl font-normal text-foreground leading-tight mb-3">
                            {props.title}
                        </h3>

                        <div className="flex-1">
                            {props.description.map((text, i) => (
                                <p
                                    key={i}
                                    className="font-poppins text-sm text-foreground-secondary leading-relaxed mb-3 text-justify"
                                >
                                    {text}
                                </p>
                            ))}
                        </div>

                        {/* Read more — bottom right */}
                        <div className="flex justify-end mt-4">
                            <Link
                                href={props.readMoreHref}
                                className="inline-flex items-center gap-2 font-poppins text-sm text-foreground-secondary hover:text-foreground transition-colors duration-200"
                            >
                                {props.readMoreLabel}
                                <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#172719"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <path d="M7 17L17 7M17 7H7M17 7v10" />
                                    </svg>
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col h-full">
                    {props.title && (
                        <h3 className="font-rethink-sans text-2xl md:text-3xl font-normal text-foreground leading-tight mb-4">
                            {props.title}
                        </h3>
                    )}

                    {props.description.map((text, i) => (
                        <p
                            key={i}
                            className="font-poppins text-sm md:text-[15px] text-foreground-secondary leading-relaxed mb-4 last:mb-0 text-justify"
                        >
                            {text}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
}
