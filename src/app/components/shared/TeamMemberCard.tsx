"use client";

import { useState } from "react";
import Image from "next/image";

interface TeamMemberCardProps {
    image: string;
    name: string;
    role: string;
    isBoardMember?: boolean;
}

export function TeamMemberCard({ image, name, role, isBoardMember }: TeamMemberCardProps) {
    const [imgError, setImgError] = useState(false);

    return (
        <div className="rounded-2xl border border-[#31422D] bg-[#161814] p-3 flex flex-col gap-4 h-full">
            <div className="relative w-full aspect-square overflow-hidden rounded-xl">
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
            <div className="flex flex-col gap-1 px-1 pb-2">
                <h3 className="font-space-mono text-lg font-normal text-foreground leading-tight">
                    {name}
                </h3>
                <p className="font-poppins text-xs font-normal text-foreground-secondary leading-relaxed">
                    {role}
                </p>
                {isBoardMember && (
                    <span className="mt-1 self-start inline-flex items-center gap-1 rounded-full bg-[#1a3a1a] border border-[#2d6a2d] px-2.5 py-0.5 text-[10px] font-poppins font-medium text-[#4caf50]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4caf50]" />
                        Board Member
                    </span>
                )}
            </div>
        </div>
    );
}
