"use client";

import { useState } from "react";
import Image from "next/image";

interface SupporterCardProps {
    image: string;
    name: string;
}

export function SupporterCard({ image, name }: SupporterCardProps) {
    const [imgError, setImgError] = useState(false);

    return (
        <div className="rounded-2xl border border-[#31422D] bg-[#161814] p-3 flex flex-col gap-4 h-full">
            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl">
                {imgError || !image ? (
                    <div className="w-full h-full bg-[#31422D]" />
                ) : (
                    <Image
                        src={image}
                        alt={name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        onError={() => setImgError(true)}
                    />
                )}
            </div>
            <div className="px-1 pb-2">
                <h3 className="font-space-mono text-lg font-normal text-foreground leading-tight">
                    {name}
                </h3>
            </div>
        </div>
    );
}
