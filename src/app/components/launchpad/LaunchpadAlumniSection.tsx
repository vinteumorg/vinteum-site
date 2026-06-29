"use client";

import { useState, useEffect, startTransition } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SocialLinks, TeamMemberCard } from "../shared/TeamMemberCard";
import { SectionTitle } from "../shared/SectionTitle";

function shuffled<T>(arr: T[]): T[] {
    const out = [...arr];
    for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
}

interface AlumniEntry {
    nameKey: string;
    roleKey: string;
    image: string;
    fundedBy?: string;
    links?: SocialLinks;
}

const COHORT_1: AlumniEntry[] = [
    {
        nameKey: "fellowship.fellows.members.lucasBalieiro.name",
        roleKey: "fellowship.fellows.members.lucasBalieiro.role",
        image: "/assets/images/people/fellows/lucasbalieiro.jpg",
        fundedBy: "OpenSats",
        links: {
            github: "https://github.com/lucasbalieiro",
        },
    },
    {
        nameKey: "fellowship.fellows.members.joao.name",
        roleKey: "fellowship.fellows.members.joao.role",
        image: "/assets/images/people/fellows/joao.jpg",
        fundedBy: "OpenSats",
        links: {
            github: "https://github.com/jaoleal",
        },
    },
    {
        nameKey: "fellowship.fellows.members.luis.name",
        roleKey: "fellowship.fellows.members.luis.role",
        image: "/assets/images/people/fellows/luis.png",
        fundedBy: "BDK Foundation",
    },
    {
        nameKey: "fellowship.fellows.members.luca0x46.name",
        roleKey: "fellowship.fellows.members.luca0x46.role",
        image: "/assets/images/people/fellows/luca0x46.jpg",
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
        links: {
            github: "https://github.com/GustavoStingelin",
            twitter: "https://x.com/gustingelin",
        },
    },
    {
        nameKey: "fellowship.fellows.members.moisePompilio.name",
        roleKey: "fellowship.fellows.members.moisePompilio.role",
        image: "/assets/images/people/fellows/moisespompilio.jpg",
        fundedBy: "OpenSats",
        links: {
            github: "https://github.com/moisesPompilio",
            twitter: "https://x.com/maicomjt",
        },
    },
    {
        nameKey: "fellowship.fellows.members.erickCestari.name",
        roleKey: "fellowship.fellows.members.erickCestari.role",
        image: "/assets/images/people/fellows/erickcestari.jpg",
        fundedBy: "Vinteum",
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
        fundedBy: "OpenSats",
        links: {
            github: "https://github.com/qlrd",
        },
    },
    {
        nameKey: "fellowship.fellows.members.theMhv.name",
        roleKey: "fellowship.fellows.members.theMhv.role",
        image: "/assets/images/people/fellows/themhv.jpg",
        fundedBy: "Vinteum",
        links: {
            github: "https://github.com/TheMhv",
            twitter: "https://x.com/TheMhv",
        },
    },
    {
        nameKey: "fellowship.fellows.members.joaozinho.name",
        roleKey: "fellowship.fellows.members.joaozinho.role",
        image: "/assets/images/people/fellows/joaozinho.jpg",
        fundedBy: "OpenSats",
        links: {
            github: "https://github.com/joaozinhom",
            nostr: "https://primal.net/p/nprofile1qqs0xwjg3fwjrqm3anxlgq0t48wg8n9zp8007ryl034nckyljdaktmqm4mmyv",
        },
    },
    {
        nameKey: "fellowship.fellows.members.caio.name",
        roleKey: "fellowship.fellows.members.caio.role",
        image: "/assets/images/people/fellows/caio.jpg",
        links: {
            github: "https://github.com/kiocos",
        },
    },
    {
        nameKey: "fellowship.fellows.members.lang.name",
        roleKey: "fellowship.fellows.members.lang.role",
        image: "/assets/images/people/fellows/lang.jpg",
        links: {
            github: "https://github.com/gusttav-lang",
        },
    },
    {
        nameKey: "fellowship.fellows.members.thgOO.name",
        roleKey: "fellowship.fellows.members.thgOO.role",
        image: "/assets/images/people/fellows/thgoo.jpg",
        fundedBy: "Vinteum",
        links: {
            github: "https://github.com/thgO-O",
            twitter: "https://x.com/thgO_O",
        },
    },
];

const COHORT_2: AlumniEntry[] = [
    {
        nameKey: "fellowship.fellows.members.viniciusCestari.name",
        roleKey: "fellowship.fellows.members.viniciusCestari.role",
        image: "/assets/images/people/fellows/viniciuscestari.jpg",
        fundedBy: "Vinteum",
        links: {
            github: "https://github.com/viniciusCestarii",
            twitter: "https://x.com/VCestarii",
            website: "https://viniciuscestari.dev/",
        },
    },
    {
        nameKey: "fellowship.fellows.members.chrisG.name",
        roleKey: "fellowship.fellows.members.chrisG.role",
        image: "/assets/images/people/fellows/chrisg.jpg",
        fundedBy: "Vinteum",
        links: {
            github: "https://github.com/csgui",
            twitter: "https://x.com/csgui",
            website: "https://imchris.me/",
        },
    },
    {
        nameKey: "fellowship.fellows.members.johnnySantos.name",
        roleKey: "fellowship.fellows.members.johnnySantos.role",
        image: "/assets/images/people/fellows/johnnysantos.jpg",
        fundedBy: "Vinteum",
        links: {
            github: "https://github.com/johnnyasantoss",
            twitter: "https://twitter.com/johnnyasantos",
            nostr: "https://njump.me/npub1j0nyf54ndc6keq80xfyeqfumn2l23e3k79f33x5jsqxnut6a8dyqp74mu0",
            website: "https://johnnyasantos.com/",
        },
    },
    {
        nameKey: "fellowship.fellows.members.bc1cindy.name",
        roleKey: "fellowship.fellows.members.bc1cindy.role",
        image: "/assets/images/people/fellows/bc1cindy.jpg",
        fundedBy: "Vinteum",
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
        fundedBy: "Vinteum",
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
        fundedBy: "Vinteum",
        links: {
            github: "https://github.com/allocz",
        },
    },
    {
        nameKey: "fellowship.fellows.members.octavioLucca.name",
        roleKey: "fellowship.fellows.members.octavioLucca.role",
        image: "/assets/images/people/fellows/octaviolucca.jpg",
        fundedBy: "Vinteum",
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
        fundedBy: "Vinteum",
        links: {
            github: "https://github.com/victorandre957",
            blog: "https://victorandre957.github.io/personal_blog/",
        },
    },
    {
        nameKey: "fellowship.fellows.members.isaqueFranklin.name",
        roleKey: "fellowship.fellows.members.isaqueFranklin.role",
        image: "/assets/images/people/fellows/isaquefranklin.jpg",
        fundedBy: "Vinteum",
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
        fundedBy: "Vinteum",
        links: {
            github: "https://github.com/lucasdbr05",
            twitter: "https://x.com/Lucaslgol05",
        },
    },
    {
        nameKey: "fellowship.fellows.members.renatoBritto.name",
        roleKey: "fellowship.fellows.members.renatoBritto.role",
        image: "/assets/images/people/fellows/renatobritto.jpg",
        fundedBy: "Vinteum",
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
        fundedBy: "Vinteum",
        links: {
            github: "https://github.com/m4ycon",
        },
    },
    {
        nameKey: "fellowship.fellows.members.jayrMotta.name",
        roleKey: "fellowship.fellows.members.jayrMotta.role",
        image: "/assets/images/people/fellows/jayrmotta.jpg",
        fundedBy: "Vinteum",
        links: {
            github: "https://github.com/jayrmotta",
            twitter: "https://x.com/jayrmotta",
        },
    },
];

function CohortGrid({ members }: { members: AlumniEntry[] }) {
    const { t } = useLanguage();
    return (
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {members.map((m) => (
                <div
                    key={m.nameKey}
                    className="w-full sm:w-[calc(50%-8px)] md:w-[calc(33.333%-10.667px)] lg:w-[calc(25%-18px)]"
                >
                    <TeamMemberCard
                        image={m.image}
                        name={t(m.nameKey)}
                        role={t(m.roleKey)}
                        fundedBy={m.fundedBy}
                        links={m.links}
                    />
                </div>
            ))}
        </div>
    );
}

export function LaunchpadAlumniSection() {
    const { t } = useLanguage();
    const [cohort1, setCohort1] = useState(COHORT_1);
    const [cohort2, setCohort2] = useState(COHORT_2);

    useEffect(() => {
        startTransition(() => {
            setCohort1(shuffled(COHORT_1));
            setCohort2(shuffled(COHORT_2));
        });
    }, []);

    return (
        <section className="relative w-full py-10 md:py-24 lg:py-28">
            <div className="max-w-7xl mx-auto px-8 md:px-14 lg:px-20">
                <div className="flex flex-col items-center text-center mb-12 md:mb-16">
                    <SectionTitle>{t("launchpad.alumni.title")}</SectionTitle>
                </div>

                <p className="font-space-mono text-sm text-foreground/50 uppercase tracking-widest mb-8">
                    {t("launchpad.alumni.cohort1")}
                </p>
                <CohortGrid members={cohort1} />

                <p className="font-space-mono text-sm text-foreground/50 uppercase tracking-widest mt-16 mb-8">
                    {t("launchpad.alumni.cohort2")}
                </p>
                <CohortGrid members={cohort2} />
            </div>
        </section>
    );
}
