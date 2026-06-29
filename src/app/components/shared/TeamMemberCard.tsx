"use client";

import { useState } from "react";
import Image from "next/image";

export interface SocialLinks {
    github?: string;
    website?: string;
    twitter?: string;
    nostr?: string;
    youtube?: string;
    linkedin?: string;
    blog?: string;
    discord?: string;
    instagram?: string;
    keybase?: string;
    email?: string;
}

const SOCIAL_ICON_MAP: { key: keyof SocialLinks; src: string; label: string }[] = [
    { key: "github", src: "/assets/icons/social/github.svg", label: "GitHub" },
    { key: "website", src: "/assets/icons/social/blog.svg", label: "Website" },
    { key: "twitter", src: "/assets/icons/social/twitter.svg", label: "Twitter / X" },
    { key: "nostr", src: "/assets/icons/social/nostr.svg", label: "Nostr" },
    { key: "youtube", src: "/assets/icons/social/youtube.svg", label: "YouTube" },
    { key: "linkedin", src: "/assets/icons/social/linkedin.svg", label: "LinkedIn" },
    { key: "blog", src: "/assets/icons/social/blog.svg", label: "Blog" },
    { key: "discord", src: "/assets/icons/social/discord.svg", label: "Discord" },
    { key: "instagram", src: "/assets/icons/social/instagram.svg", label: "Instagram" },
    { key: "keybase", src: "/assets/icons/social/keybase.svg", label: "Keybase" },
    { key: "email", src: "/assets/icons/social/email.svg", label: "Email" },
];

interface TeamMemberCardProps {
    image: string;
    name: string;
    role: string;
    isBoardMember?: boolean;
    links?: SocialLinks;
    fundedBy?: string;
}

export function TeamMemberCard({ image, name, role, isBoardMember, links, fundedBy }: TeamMemberCardProps) {
    const [imgError, setImgError] = useState(false);

    const hasLinks = links && Object.values(links).some(Boolean);

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
                {fundedBy && (
                    <p className="font-poppins text-[11px] text-foreground/40 leading-relaxed">
                        Funded by <span className="text-primary/70 font-medium">{fundedBy}</span>
                    </p>
                )}
                {hasLinks && (
                    <div className="flex gap-2.5 flex-wrap mt-1.5">
                        {SOCIAL_ICON_MAP.map(({ key, src, label }) => {
                            const href = links![key];
                            if (!href) return null;
                            return (
                                <a
                                    key={key}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="opacity-40 hover:opacity-100 transition-opacity duration-200"
                                    aria-label={label}
                                >
                                    <Image
                                        src={src}
                                        alt={label}
                                        width={18}
                                        height={18}
                                        unoptimized
                                    />
                                </a>
                            );
                        })}
                    </div>
                )}
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
