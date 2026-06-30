"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { TeamMemberCard } from "../shared/TeamMemberCard";
import { SectionTitle } from "../shared/SectionTitle";
import { useScrollCarousel } from "@/hooks/useScrollCarousel";

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
    const { scrollRef, activeIndex, handleScroll, scrollToIndex } = useScrollCarousel("[data-mc]");

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

            {/* Faixa com scroll — mobile/tablet */}
            <div className="lg:hidden relative">
                <div className="absolute left-0 top-0 w-24 h-full bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 w-24 h-full bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
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

                <div className="flex justify-center gap-2 mt-4">
                    {TEAM_MEMBERS.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => scrollToIndex(i)}
                            aria-label={`Card ${i + 1}`}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                i === activeIndex ? "w-6 bg-[#91FFAE]" : "w-1.5 bg-white/30"
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* Desktop grid: 3 large + 4 small when 7 members, uniform otherwise */}
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
