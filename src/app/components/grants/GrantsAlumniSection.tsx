"use client";

import { useState, useEffect, startTransition } from "react";
import { AlumniCarouselSection, type AlumniMember } from "../shared/AlumniCarouselSection";

function shuffled<T>(arr: T[]): T[] {
    const out = [...arr];
    for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
}

const GRANTEES: AlumniMember[] = [
    {
        nameKey: "grants.grantees.members.leonardoLima.name",
        roleKey: "grants.grantees.members.leonardoLima.role",
        image: "/assets/images/people/grantees/leonardolima.jpg",
        status: "current",
    },
    {
        nameKey: "grants.grantees.members.davidsonSouza.name",
        roleKey: "grants.grantees.members.davidsonSouza.role",
        image: "/assets/images/people/grantees/davidsonsouza.jpg",
        status: "current",
    },
    {
        nameKey: "grants.grantees.members.plebhash.name",
        roleKey: "grants.grantees.members.plebhash.role",
        image: "/assets/images/people/grantees/plebhash.png",
        status: "current",
    },
    {
        nameKey: "grants.grantees.members.pins.name",
        roleKey: "grants.grantees.members.pins.role",
        image: "/assets/images/people/grantees/pins.jpg",
        status: "current",
    },
    {
        nameKey: "grants.grantees.members.chrisG.name",
        roleKey: "grants.grantees.members.chrisG.role",
        image: "/assets/images/people/fellows/chrisg.jpg",
        status: "current",
    },
    {
        nameKey: "grants.grantees.members.johnnySantos.name",
        roleKey: "grants.grantees.members.johnnySantos.role",
        image: "/assets/images/people/fellows/johnnysantos.jpg",
        status: "current",
    },
    {
        nameKey: "grants.grantees.members.erickCestari.name",
        roleKey: "grants.grantees.members.erickCestari.role",
        image: "/assets/images/people/fellows/erickcestari.jpg",
        status: "current",
    },
    {
        nameKey: "grants.grantees.members.thgOO.name",
        roleKey: "grants.grantees.members.thgOO.role",
        image: "/assets/images/people/fellows/thgoo.jpg",
        status: "current",
    },
];

export function GrantsAlumniSection() {
    const [members, setMembers] = useState(GRANTEES);

    useEffect(() => {
        const current = GRANTEES.filter((m) => m.status === "current");
        const past = GRANTEES.filter((m) => m.status === "past");
        startTransition(() => setMembers([...shuffled(current), ...shuffled(past)]));
    }, []);

    return (
        <div className="relative z-[1]">
            <AlumniCarouselSection
                titleKey="grants.grantees.title"
                members={members}
                showFilter={true}
                filterCurrentKey="grants.grantees.filterCurrent"
                filterPastKey="grants.grantees.filterPast"
                initialFilter="current"
                showMoreKey="grants.grantees.showMore"
                showLessKey="grants.grantees.showLess"
            />
            {/* remove */}
            {/* <div
                className="absolute bottom-20 left-1/2 -translate-x-1/2 translate-y-[60%] w-[50%] h-[200px] rounded-full opacity-80 blur-[100px] gradient-blur-vertical pointer-events-none select-none"
                aria-hidden="true"
            /> */}
        </div>
    );
}
