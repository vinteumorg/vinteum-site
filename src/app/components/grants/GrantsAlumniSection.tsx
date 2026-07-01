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
        links: {
            github: "https://github.com/oleonardolima",
            twitter: "https://x.com/_oleonardolima",
            nostr: "https://primal.net/p/npub1ez8efu9rjxu64g0lalty2ffmr2tgkzjz92rkafyfyz5463wr8ars8zls5t",
        },
    },
    {
        nameKey: "grants.grantees.members.davidsonSouza.name",
        roleKey: "grants.grantees.members.davidsonSouza.role",
        image: "/assets/images/people/grantees/davidsonsouza.jpg",
        status: "current",
        links: {
            github: "https://github.com/Davidson-Souza",
            twitter: "https://x.com/Erik17192799",
            nostr: "https://primal.net/p/nprofile1qqswpna42jwnea7mfcnnd78phjz0vfyx4aayz22ase7x5vf5tyzz22qjdj9cx",
            blog: "https://blog.dlsouza.lol",
        },
    },
    {
        nameKey: "grants.grantees.members.plebhash.name",
        roleKey: "grants.grantees.members.plebhash.role",
        image: "/assets/images/people/grantees/plebhash.png",
        status: "current",
        links: {
            github: "https://github.com/plebhash",
            twitter: "https://x.com/plebhash",
            website: "https://plebhash.github.io",
        },
    },
    {
        nameKey: "grants.grantees.members.pins.name",
        roleKey: "grants.grantees.members.pins.role",
        image: "/assets/images/people/grantees/pins.jpg",
        status: "current",
        links: {
            github: "https://github.com/MPins",
            twitter: "https://x.com/pins_btc",
        },
    },
    {
        nameKey: "grants.grantees.members.chrisG.name",
        roleKey: "grants.grantees.members.chrisG.role",
        image: "/assets/images/people/grantees/chrisg.jpg",
        status: "current",
        links: {
            github: "https://github.com/csgui",
            twitter: "https://x.com/csgui",
            website: "https://imchris.me/",
        },
    },
    {
        nameKey: "grants.grantees.members.johnnySantos.name",
        roleKey: "grants.grantees.members.johnnySantos.role",
        image: "/assets/images/people/grantees/johnnysantos.jpg",
        status: "current",
        links: {
            github: "https://github.com/johnnyasantoss",
            twitter: "https://twitter.com/johnnyasantos",
            nostr: "https://njump.me/npub1j0nyf54ndc6keq80xfyeqfumn2l23e3k79f33x5jsqxnut6a8dyqp74mu0",
            website: "https://johnnyasantos.com/",
        },
    },
    {
        nameKey: "grants.grantees.members.erickCestari.name",
        roleKey: "grants.grantees.members.erickCestari.role",
        image: "/assets/images/people/fellows/erickcestari.jpg",
        status: "current",
        links: {
            website: "https://erickcestari.dev/",
            github: "https://github.com/erickcestari",
            twitter: "https://x.com/iamflops",
        },
    },
    {
        nameKey: "grants.grantees.members.thgOO.name",
        roleKey: "grants.grantees.members.thgOO.role",
        image: "/assets/images/people/fellows/thgoo.jpg",
        status: "current",
        links: {
            github: "https://github.com/thgO-O",
            twitter: "https://x.com/thgO_O",
        },
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
        </div>
    );
}
