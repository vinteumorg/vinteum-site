"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SocialLinks, TeamMemberCard } from "./TeamMemberCard";
import { SectionTitle } from "./SectionTitle";

export type AlumniMember = {
    nameKey: string;
    roleKey: string;
    image: string;
    status?: "current" | "past";
    links?: SocialLinks;
    easterEggImage?: string;
};

type Filter = "all" | "current" | "past";

type Props = {
    titleKey: string;
    members: AlumniMember[];
    /** Show Current / Past filter tabs */
    showFilter?: boolean;
    filterCurrentKey?: string;
    filterPastKey?: string;
    filterAllKey?: string;
    showMoreKey?: string;
    showLessKey?: string;
    /** How many cards to show before "see more" */
    initialVisible?: number;
    /** Default active filter */
    initialFilter?: Filter;
};

export function AlumniCarouselSection({
    titleKey,
    members,
    showFilter = false,
    filterCurrentKey,
    filterPastKey,
    filterAllKey,
    showMoreKey,
    showLessKey,
    initialVisible = 8,
    initialFilter = "all",
}: Props) {
    const { t } = useLanguage();
    const [filter, setFilter] = useState<Filter>(initialFilter);
    const [expanded, setExpanded] = useState(false);

    const filtered =
        showFilter && filter !== "all"
            ? members.filter((m) => m.status === filter)
            : members;

    const visible = expanded ? filtered : filtered.slice(0, initialVisible);
    const hasMore = filtered.length > initialVisible;

    const hasCurrentMembers = members.some((m) => m.status === "current");
    const hasPastMembers = members.some((m) => m.status === "past");

    const tabs: { value: Filter; labelKey?: string; fallback: string }[] = [
        ...(filterAllKey ? [{ value: "all" as Filter, labelKey: filterAllKey, fallback: "All" }] : []),
        ...(hasCurrentMembers ? [{ value: "current" as Filter, labelKey: filterCurrentKey, fallback: "Current Fellows" }] : []),
        ...(hasPastMembers ? [{ value: "past" as Filter, labelKey: filterPastKey, fallback: "Past Fellows" }] : []),
    ];

    return (
        <section className="relative w-full py-10 md:py-24 lg:py-28">
            <div className="max-w-7xl mx-auto px-8 md:px-14 lg:px-20">
                {/* Header */}
                <div className="flex flex-col items-center text-center gap-6 mb-10 md:mb-12">
                    <SectionTitle>{t(titleKey)}</SectionTitle>

                    {/* Filter tabs */}
                    {showFilter && filterCurrentKey && filterPastKey && (
                        <div className="flex gap-1 p-1 rounded-full border border-[#31422D] bg-[#31422D]/20">
                            {tabs.map(({ value, labelKey, fallback }) => (
                                <button
                                    key={value}
                                    onClick={() => {
                                        setFilter(value);
                                        setExpanded(false);
                                    }}
                                    className={`px-4 py-1.5 rounded-full text-sm font-poppins font-medium transition-all duration-200 cursor-pointer ${filter === value
                                        ? "bg-primary text-background"
                                        : "text-foreground/60 hover:text-foreground"
                                        }`}
                                >
                                    {labelKey ? t(labelKey) : fallback}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Cards grid */}
                <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                    {visible.map((member) => (
                        <div
                            key={member.nameKey}
                            className="w-full sm:w-[calc(50%-8px)] md:w-[calc(33.333%-10.667px)] lg:w-[calc(25%-18px)]"
                        >
                            <TeamMemberCard
                                image={member.image}
                                name={t(member.nameKey)}
                                role={t(member.roleKey)}
                                links={member.links}
                                easterEggImage={member.easterEggImage}
                            />
                        </div>
                    ))}
                </div>

                {/* Show more / less */}
                {hasMore && (
                    <div className="flex justify-center mt-8">
                        <button
                            onClick={() => setExpanded((e) => !e)}
                            className="font-poppins text-sm font-medium text-primary border border-primary/40 hover:border-primary hover:bg-primary/10 px-6 py-2.5 rounded-full transition-all duration-200 cursor-pointer"
                        >
                            {expanded
                                ? showLessKey ? t(showLessKey) : "Show less"
                                : showMoreKey ? t(showMoreKey) : "See more"}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}

