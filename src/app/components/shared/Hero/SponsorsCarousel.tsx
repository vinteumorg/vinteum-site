"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

type SponsorsCarouselProps = {
    title: string;
    logos: { src: string; alt: string }[];
};

export function SponsorsCarousel({ title, logos }: SponsorsCarouselProps) {
    const trackRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        let animationId: number;
        let position = 0;
        const speed = 0.5; // px per frame

        function animate() {
            position -= speed;
            if (track) {
                const halfWidth = track.scrollWidth / 2;
                if (Math.abs(position) >= halfWidth) {
                    position = 0;
                }
                track.style.transform = `translateX(${position}px)`;
            }
            animationId = requestAnimationFrame(animate);
        }

        animationId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationId);
    }, []);

    // Duplicate logos for seamless infinite scroll
    const displayLogos = [...logos, ...logos];

    return (
        <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-14 lg:px-20 pt-16 pb-24">
            <h2 className="font-space-mono text-xl sm:text-2xl md:text-2xl font-normal text-foreground tracking-tight mb-10 text-center">
                {title}
            </h2>

            <div className="relative overflow-hidden">
                {/* Fade edges */}
                <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

                <div ref={trackRef} className="flex items-center gap-12 w-max will-change-transform">
                    {displayLogos.map((logo, i) => (
                        <div
                            key={`${logo.alt}-${i}`}
                            className="flex-shrink-0 flex items-center justify-center h-12 w-32 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300"
                        >
                            <Image
                                src={logo.src}
                                alt={logo.alt}
                                width={128}
                                height={48}
                                className="object-contain max-h-full max-w-full"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
