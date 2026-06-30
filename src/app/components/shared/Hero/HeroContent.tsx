import type { ReactNode } from "react";
import { CTAButton } from "../CTAButton";

type HeroContentProps = {
    title: string;
    subtitle?: string;
    subtitleNode?: ReactNode;
    cta?: {
        label: string;
        href: string;
    };
};

export function HeroContent({ title, subtitle, subtitleNode, cta }: HeroContentProps) {
    return (
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-8 md:px-14 lg:px-20 pt-52 pb-24 w-full max-w-7xl mx-auto">
            <h1 className="font-sk-concretica text-[2rem] sm:text-[2.75rem] md:text-[3.5rem] lg:text-[4rem] font-normal text-foreground uppercase leading-[0.9] tracking-tight mb-8 w-full max-w-3xl">
                {title}
            </h1>

            {subtitleNode ? (
                <div className="font-poppins text-foreground/70 text-base md:text-lg w-full max-w-2xl mx-auto mb-10 leading-relaxed">
                    {subtitleNode}
                </div>
            ) : subtitle && (
                <p className="font-poppins text-foreground/70 text-base md:text-lg w-full max-w-2xl mx-auto mb-10 leading-relaxed">
                    {subtitle}
                </p>
            )}

            {cta && (
                <CTAButton href={cta.href}>
                    {cta.label}
                </CTAButton>
            )}
        </div>
    );
}
