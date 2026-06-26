"use client";

import Image from "next/image";

export function SupportersGlobeSection() {

    return (
        <section className="relative w-full pt-8 md:pt-12 pb-20 md:pb-80 overflow-hidden">
            {/* Background globe */}
            <div className="absolute inset-x-0 bottom-0 h-[80%] pointer-events-none select-none z-0">
                <Image
                    src="/assets/backgrounds/section-divider.svg"
                    alt=""
                    fill
                    className="object-cover object-top"
                    aria-hidden="true"
                />
            </div>
        </section>
    );
}
