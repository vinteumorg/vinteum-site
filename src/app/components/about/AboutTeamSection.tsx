"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { TeamMemberCard } from "../shared/TeamMemberCard";
import { SectionTitle } from "../shared/SectionTitle";

const TEAM_MEMBERS = [
    { image: "/assets/images/people/team/lucas.png", nameKey: "about.team.members.lucas.name", roleKey: "about.team.members.lucas.role", isBoardMember: true },
    { image: "/assets/images/people/team/andre.png", nameKey: "about.team.members.andre.name", roleKey: "about.team.members.andre.role", isBoardMember: true },
    { image: "/assets/images/people/team/bruno.png", nameKey: "about.team.members.bruno.name", roleKey: "about.team.members.bruno.role", isBoardMember: true },
    { image: "/assets/images/people/team/edil.png", nameKey: "about.team.members.edil.name", roleKey: "about.team.members.edil.role" },
    { image: "/assets/images/people/team/thaiz.png", nameKey: "about.team.members.thaiz.name", roleKey: "about.team.members.thaiz.role" },
    { image: "/assets/images/people/team/jao.png", nameKey: "about.team.members.jao.name", roleKey: "about.team.members.jao.role" },
    { image: "/assets/images/people/team/lorenzo.png", nameKey: "about.team.members.lorenzo.name", roleKey: "about.team.members.lorenzo.role" },
];

export function AboutTeamSection() {
    const { t } = useLanguage();
    const [mobileIndex, setMobileIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);
    const snapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const updateActive = () => {
            const cardEls = el.querySelectorAll<HTMLElement>("[data-mc]");
            const center = el.scrollLeft + el.offsetWidth / 2;
            let best = 0;
            let bestDist = Infinity;
            cardEls.forEach((c, i) => {
                const dist = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center);
                if (dist < bestDist) { bestDist = dist; best = i; }
            });
            setMobileIndex(best);
        };

        const onScroll = () => {
            if (snapTimer.current) clearTimeout(snapTimer.current);
            snapTimer.current = setTimeout(updateActive, 50);
        };

        el.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            el.removeEventListener("scroll", onScroll);
            if (snapTimer.current) clearTimeout(snapTimer.current);
        };
    }, []);

    return (
        <section className="relative w-full py-12 md:py-28 overflow-hidden">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-8 md:px-14 lg:px-20 mb-14">
                <div className="flex flex-col items-center text-center gap-5">
                    <SectionTitle>{t("about.team.title")}</SectionTitle>
                    <p className="font-poppins text-sm text-foreground-secondary leading-relaxed">
                        {t("about.team.subtitle")}
                    </p>
                </div>
            </div>

            {/* Faixa com scroll infinito — mobile/tablet */}
            <div className="lg:hidden relative">
                <div className="absolute left-0 top-0 w-24 h-full bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 w-24 h-full bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-4 px-[9%] pt-8 pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth"
                >
                    {TEAM_MEMBERS.map((member, index) => (
                        <div
                            key={`${member.nameKey}-${index}`}
                            data-mc
                            className="snap-center w-[82vw] flex-shrink-0"
                        >
                            <TeamMemberCard
                                image={member.image}
                                name={t(member.nameKey)}
                                role={t(member.roleKey)}
                                isBoardMember={member.isBoardMember}
                            />
                        </div>
                    ))}
                </div>

                {/* Dots indicadores */}
                <div className="flex justify-center gap-2 mt-4">
                    {TEAM_MEMBERS.map((_, i) => (
                        <span
                            key={i}
                            className={`block rounded-full transition-all duration-300 ${i === mobileIndex
                                ? "w-5 h-2 bg-primary"
                                : "w-2 h-2 bg-foreground/20"
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Grid — desktop: 3 grandes + 4 pequenas se 7 membros, senão todos iguais */}
            <div className="hidden lg:block max-w-7xl mx-auto px-20">
                {TEAM_MEMBERS.length === 7 ? (
                    <>
                        <div className="grid grid-cols-3 gap-5 mb-5">
                            {TEAM_MEMBERS.slice(0, 3).map((member) => (
                                <TeamMemberCard
                                    key={member.nameKey}
                                    image={member.image}
                                    name={t(member.nameKey)}
                                    role={t(member.roleKey)}
                                    isBoardMember={member.isBoardMember}
                                />
                            ))}
                        </div>
                        <div className="grid grid-cols-4 gap-5">
                            {TEAM_MEMBERS.slice(3).map((member) => (
                                <TeamMemberCard
                                    key={member.nameKey}
                                    image={member.image}
                                    name={t(member.nameKey)}
                                    role={t(member.roleKey)}
                                    isBoardMember={member.isBoardMember}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="grid grid-cols-3 gap-5">
                        {TEAM_MEMBERS.map((member) => (
                            <TeamMemberCard
                                key={member.nameKey}
                                image={member.image}
                                name={t(member.nameKey)}
                                role={t(member.roleKey)}
                                isBoardMember={member.isBoardMember}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
