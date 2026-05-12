"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export type CityPin = {
    id: string;
    name: string;
    href?: string;
    /** Position as % of image width/height */
    x: number;
    y: number;
};

type Props = {
    cities: CityPin[];
};

export function BrazilMap({ cities }: Props) {
    const [hovered, setHovered] = useState<string | null>(null);
    const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleEnter = (id: string) => {
        if (hideTimer.current) clearTimeout(hideTimer.current);
        setHovered(id);
    };

    const handleLeave = () => {
        hideTimer.current = setTimeout(() => setHovered(null), 120);
    };

    return (
        <div className="relative w-full max-w-[560px] select-none" style={{ aspectRatio: "560 / 480" }}>
            {/* Static map SVG */}
            <Image
                src="/assets/images/bitdevs/map-brazil.svg"
                alt="BitDevs cities map"
                fill
                className="object-contain opacity-50"
                aria-hidden="true"
            />

            {/* Interactive city dots */}
            {cities.map((city) => {
                const isActive = hovered === city.id;
                return (
                    <button
                        key={city.id}
                        onMouseEnter={() => handleEnter(city.id)}
                        onMouseLeave={handleLeave}
                        onFocus={() => handleEnter(city.id)}
                        onBlur={handleLeave}
                        aria-label={city.name}
                        className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                        style={{ left: `${city.x}%`, top: `${city.y}%` }}
                    >
                        {/* Outer glow ring */}
                        <span
                            className={`absolute inset-0 rounded-full transition-all duration-300 ${isActive
                                ? "scale-[3] opacity-30 bg-primary"
                                : "scale-[2] opacity-0 bg-primary group-hover:opacity-20"
                                }`}
                        />
                        {/* Dot */}
                        <span
                            className={`relative block rounded-full transition-all duration-200 ${isActive
                                ? "w-4 h-4 bg-primary shadow-[0_0_12px_4px_rgba(145,255,174,0.6)]"
                                : "w-3 h-3 bg-primary/80 shadow-[0_0_8px_2px_rgba(145,255,174,0.4)]"
                                }`}
                        />

                        {/* Tooltip */}
                        {isActive && (
                            <div
                                onMouseEnter={() => handleEnter(city.id)}
                                onMouseLeave={handleLeave}
                                className="absolute z-20 bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 w-52 rounded-xl border border-primary/20 bg-[#172719]/95 backdrop-blur-md px-4 py-3 text-left"
                                role="tooltip"
                            >
                                {/* Arrow */}
                                <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-primary/20" />
                                {city.href ? (
                                    <Link
                                        href={city.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-space-mono text-sm font-normal text-primary leading-tight underline underline-offset-2 hover:text-primary/80 transition-colors"
                                    >
                                        {city.name} ↗
                                    </Link>
                                ) : (
                                    <p className="font-space-mono text-sm font-normal text-primary leading-tight">
                                        {city.name}
                                    </p>
                                )}
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
