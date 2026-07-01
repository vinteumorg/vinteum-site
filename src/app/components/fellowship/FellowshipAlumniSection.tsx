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

const FELLOWS: AlumniMember[] = [
    // Current fellows — 2nd cohort
    {
        nameKey: "fellowship.fellows.members.viniciusCestari.name",
        roleKey: "fellowship.fellows.members.viniciusCestari.role",
        image: "/assets/images/people/fellows/viniciuscestari.jpg",
        status: "current",
        links: {
            github: "https://github.com/viniciusCestarii",
            twitter: "https://x.com/VCestarii",
            website: "https://viniciuscestari.dev/",
        },
    },
    {
        nameKey: "fellowship.fellows.members.bc1cindy.name",
        roleKey: "fellowship.fellows.members.bc1cindy.role",
        image: "/assets/images/people/fellows/bc1cindy.jpg",
        status: "current",
        links: {
            github: "https://github.com/bc1cindy",
            twitter: "https://twitter.com/bc1cindy",
            youtube: "https://www.youtube.com/@CindyBTC",
            website: "https://linktr.ee/CindyBTC",
        },
    },
    {
        nameKey: "fellowship.fellows.members.caioUeda.name",
        roleKey: "fellowship.fellows.members.caioUeda.role",
        image: "/assets/images/people/fellows/caioueda.jpg",
        status: "current",
        links: {
            github: "https://github.com/KY-U",
            twitter: "https://x.com/KYU2029255",
            linkedin: "https://www.linkedin.com/in/caio-ueda-sampaio-23511b253/",
        },
    },
    {
        nameKey: "fellowship.fellows.members.allocz.name",
        roleKey: "fellowship.fellows.members.allocz.role",
        image: "/assets/images/people/fellows/allocz.jpg",
        status: "current",
        links: {
            github: "https://github.com/allocz",
        },
    },
    {
        nameKey: "fellowship.fellows.members.octavioLucca.name",
        roleKey: "fellowship.fellows.members.octavioLucca.role",
        image: "/assets/images/people/fellows/octaviolucca.jpg",
        status: "current",
        links: {
            website: "https://octavio.xyz/",
            github: "https://github.com/octaviolucca",
            twitter: "https://x.com/octavio_lucca",
        },
    },
    {
        nameKey: "fellowship.fellows.members.victorAndre.name",
        roleKey: "fellowship.fellows.members.victorAndre.role",
        image: "/assets/images/people/fellows/victorandre.jpg",
        status: "current",
        links: {
            github: "https://github.com/victorandre957",
            blog: "https://victorandre957.github.io/personal_blog/",
        },
    },
    {
        nameKey: "fellowship.fellows.members.isaqueFranklin.name",
        roleKey: "fellowship.fellows.members.isaqueFranklin.role",
        image: "/assets/images/people/fellows/isaquefranklin.jpg",
        status: "current",
        links: {
            github: "https://github.com/IsaqueFranklin",
            twitter: "https://x.com/IsaqueFranklin0",
            website: "https://www.harlock.xyz/",
        },
    },
    {
        nameKey: "fellowship.fellows.members.lucasLima.name",
        roleKey: "fellowship.fellows.members.lucasLima.role",
        image: "/assets/images/people/fellows/lucaslima.jpg",
        status: "current",
        links: {
            github: "https://github.com/lucasdbr05",
            twitter: "https://x.com/Lucaslgol05",
        },
    },
    {
        nameKey: "fellowship.fellows.members.renatoBritto.name",
        roleKey: "fellowship.fellows.members.renatoBritto.role",
        image: "/assets/images/people/fellows/renatobritto.jpg",
        status: "current",
        easterEggImage: "/assets/images/people/fellows/bukele.jpg",
        links: {
            github: "https://github.com/satsfy",
            twitter: "https://x.com/0xsatsfy",
            website: "https://satsfy.xyz/",
        },
    },
    {
        nameKey: "fellowship.fellows.members.m4ycon.name",
        roleKey: "fellowship.fellows.members.m4ycon.role",
        image: "/assets/images/people/fellows/m4ycon.jpg",
        status: "current",
        links: {
            github: "https://github.com/m4ycon",
        },
    },
    {
        nameKey: "fellowship.fellows.members.jayrMotta.name",
        roleKey: "fellowship.fellows.members.jayrMotta.role",
        image: "/assets/images/people/fellows/jayrmotta.jpg",
        status: "current",
        links: {
            github: "https://github.com/jayrmotta",
            twitter: "https://x.com/jayrmotta",
        },
    },
    {
        nameKey: "fellowship.fellows.members.yan.name",
        roleKey: "fellowship.fellows.members.yan.role",
        image: "/assets/images/people/fellows/yan.jpeg",
        status: "current",
        links: {
            github: "https://github.com/yan-pi",
            twitter: "https://x.com/yamigake",
            website: "https://indianboy.sh/",
        },
    },
    // Past fellows — 1st cohort
    {
        nameKey: "fellowship.fellows.members.lucasBalieiro.name",
        roleKey: "fellowship.fellows.members.lucasBalieiro.role",
        image: "/assets/images/people/fellows/lucasbalieiro.jpg",
        status: "past",
        links: {
            github: "https://github.com/lucasbalieiro",
        },
    },
    {
        nameKey: "fellowship.fellows.members.joao.name",
        roleKey: "fellowship.fellows.members.joao.role",
        image: "/assets/images/people/fellows/joao.jpg",
        status: "past",
        links: {
            github: "https://github.com/jaoleal",
        },
    },
    {
        nameKey: "fellowship.fellows.members.luis.name",
        roleKey: "fellowship.fellows.members.luis.role",
        image: "/assets/images/people/fellows/luis.png",
        status: "past",
    },
    {
        nameKey: "fellowship.fellows.members.luca0x46.name",
        roleKey: "fellowship.fellows.members.luca0x46.role",
        image: "/assets/images/people/fellows/luca0x46.jpg",
        status: "past",
        links: {
            website: "https://luca0x46.com/",
            github: "https://github.com/luca0x46",
            twitter: "https://x.com/luca0x46",
        },
    },
    {
        nameKey: "fellowship.fellows.members.gustavoStingelin.name",
        roleKey: "fellowship.fellows.members.gustavoStingelin.role",
        image: "/assets/images/people/fellows/gustavostingelin.jpg",
        status: "past",
        links: {
            github: "https://github.com/GustavoStingelin",
            twitter: "https://x.com/gustingelin",
        },
    },
    {
        nameKey: "fellowship.fellows.members.moisePompilio.name",
        roleKey: "fellowship.fellows.members.moisePompilio.role",
        image: "/assets/images/people/fellows/moisespompilio.jpg",
        status: "past",
        links: {
            github: "https://github.com/moisesPompilio",
            twitter: "https://x.com/maicomjt",
        },
    },
    {
        nameKey: "fellowship.fellows.members.erickCestari.name",
        roleKey: "fellowship.fellows.members.erickCestari.role",
        image: "/assets/images/people/fellows/erickcestari.jpg",
        status: "past",
        links: {
            website: "https://erickcestari.dev/",
            github: "https://github.com/erickcestari",
            twitter: "https://x.com/iamflops",
        },
    },
    {
        nameKey: "fellowship.fellows.members.guilhermeMartins.name",
        roleKey: "fellowship.fellows.members.guilhermeMartins.role",
        image: "/assets/images/people/fellows/guilhermemartins.jpg",
        status: "past",
        links: {
            github: "https://github.com/qlrd",
        },
    },
    {
        nameKey: "fellowship.fellows.members.theMhv.name",
        roleKey: "fellowship.fellows.members.theMhv.role",
        image: "/assets/images/people/fellows/themhv.jpg",
        status: "past",
        links: {
            github: "https://github.com/TheMhv",
            twitter: "https://x.com/TheMhv",
        },
    },
    {
        nameKey: "fellowship.fellows.members.joaozinho.name",
        roleKey: "fellowship.fellows.members.joaozinho.role",
        image: "/assets/images/people/fellows/joaozinho.jpg",
        status: "past",
        links: {
            github: "https://github.com/joaozinhom",
            nostr: "https://primal.net/p/nprofile1qqs0xwjg3fwjrqm3anxlgq0t48wg8n9zp8007ryl034nckyljdaktmqm4mmyv",
        },
    },
    {
        nameKey: "fellowship.fellows.members.caio.name",
        roleKey: "fellowship.fellows.members.caio.role",
        image: "/assets/images/people/fellows/caio.jpg",
        status: "past",
        links: {
            github: "https://github.com/kiocos",
        },
    },
    {
        nameKey: "fellowship.fellows.members.lang.name",
        roleKey: "fellowship.fellows.members.lang.role",
        image: "/assets/images/people/fellows/lang.jpg",
        status: "past",
        links: {
            github: "https://github.com/gusttav-lang",
        },
    },
    {
        nameKey: "fellowship.fellows.members.thgOO.name",
        roleKey: "fellowship.fellows.members.thgOO.role",
        image: "/assets/images/people/fellows/thgoo.jpg",
        status: "past",
        links: {
            github: "https://github.com/thgO-O",
            twitter: "https://x.com/thgO_O",
        },
    },
];

export function FellowshipAlumniSection() {
    const [members, setMembers] = useState(FELLOWS);

    useEffect(() => {
        const current = FELLOWS.filter((m) => m.status === "current");
        const past = FELLOWS.filter((m) => m.status === "past");
        startTransition(() => setMembers([...shuffled(current), ...shuffled(past)]));
    }, []);

    return (
        <AlumniCarouselSection
            titleKey="fellowship.fellows.title"
            members={members}
            showFilter={true}
            filterCurrentKey="fellowship.fellows.filterCurrent"
            filterPastKey="fellowship.fellows.filterPast"
            initialFilter="current"
            showMoreKey="fellowship.fellows.showMore"
            showLessKey="fellowship.fellows.showLess"
        />
    );
}
