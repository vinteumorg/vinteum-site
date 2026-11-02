"use client";

import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { Hero } from "../shared/Hero";
import { CTAButton } from "../shared/CTAButton";
import { Button } from "../shared/Button";
import { SectionTitle } from "../shared/SectionTitle";

const REPORT_URL = "/assets/files/Vinteum-Year-Four-Report-2026.pdf";
const WHATSAPP_NUMBER = "5511967333301";
const focus = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";
const eyebrow = "mb-5 block font-space-mono text-xs uppercase tracking-widest text-primary";

const STATS = ["stat1", "stat2", "stat3", "stat4"] as const;
const PEOPLE = ["p1", "p2", "p3", "p4"] as const;

export function OranjeLanding() {
    const { t, locale } = useLanguage();
    const text = (key: string) => t(`oranje.${key}`);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text("whatsappMessage"))}`;

    return (
        <div lang={locale === "BR" ? "pt-BR" : "en"} className="font-poppins">
            <Hero
                variant="default"
                title={text("title")}
                subtitleNode={<><span className={eyebrow}>{text("eyebrow")}</span>{text("lead")}</>}
                cta={{ label: text("results"), href: "#resultados" }}
                backgroundImage="/assets/backgrounds/hero-home.svg"
            />
            <div className="mx-auto -mt-10 mb-16 flex max-w-3xl flex-col items-center gap-5 px-6 text-center relative z-10">
                <Button href="#apoie" variant="secondary" className={focus}>{text("supportLink")}</Button>
            </div>
            <div className="mx-auto max-w-7xl px-6 md:px-14 lg:px-20">
                <section id="resultados" aria-labelledby="oranje-results" className="scroll-mt-24 border-b border-border-subtle py-12 md:py-20">
                    <div className="mb-12 grid gap-8 md:grid-cols-2 md:gap-16">
                        <div>
                            <span className={eyebrow}>{text("resultsLabel")}</span>
                            <div id="oranje-results"><SectionTitle>{text("resultsTitle")}</SectionTitle></div>
                        </div>
                        <p className="self-end leading-relaxed text-foreground-secondary">{text("resultsBody")}</p>
                    </div>
                    <dl className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                        {STATS.map((stat) => (
                            <div key={stat} className="border-t border-border pt-6">
                                <dt className="text-5xl text-primary">{text(`${stat}Value`)}</dt>
                                <dd className="mt-3 text-sm leading-relaxed text-foreground-secondary">{text(`${stat}Body`)}</dd>
                            </div>
                        ))}
                    </dl>
                    <p className="mt-10 font-space-mono text-xs text-foreground-secondary">{text("resultsSource")}</p>
                </section>
                <section aria-labelledby="oranje-people" className="grid gap-8 border-b border-border-subtle py-12 md:grid-cols-2 md:gap-16 md:py-20">
                    <div>
                        <span className={eyebrow}>{text("peopleLabel")}</span>
                        <div id="oranje-people"><SectionTitle>{text("peopleTitle")}</SectionTitle></div>
                        <p className="mt-6 leading-relaxed text-foreground-secondary">{text("peopleBody")}</p>
                    </div>
                    <ul className="divide-y divide-border-subtle">
                        {PEOPLE.map((person) => (
                            <li key={person} className="flex flex-col gap-1 py-4 first:pt-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                                <span className="text-foreground">{text(`${person}Name`)}</span>
                                <span className="font-space-mono text-xs text-foreground-secondary">{text(`${person}Project`)}</span>
                            </li>
                        ))}
                    </ul>
                </section>
                <section id="relatorio" aria-labelledby="oranje-report" className="scroll-mt-24 my-12 grid items-center gap-10 rounded-3xl border border-border bg-background-secondary p-6 md:my-20 md:grid-cols-2 md:p-12">
                    <a href={REPORT_URL} target="_blank" rel="noopener noreferrer" className={`mx-auto ${focus}`}>
                        <Image src="/assets/images/oranje-report-cover.png" alt={text("reportAlt")} width={745} height={1053} className="h-auto w-full max-w-[245px] -rotate-3 rounded-sm shadow-xl" />
                    </a>
                    <div>
                        <span className={eyebrow}>{text("reportLabel")}</span>
                        <div id="oranje-report"><SectionTitle>{text("reportTitle")}</SectionTitle></div>
                        <p className="my-6 leading-relaxed text-foreground-secondary">{text("reportBody")}</p>
                        <CTAButton href={REPORT_URL} target="_blank" rel="noopener noreferrer" className={focus}>{text("reportCta")}</CTAButton>
                        <p className="mt-4 text-xs text-foreground-secondary">{text("reportNote")}</p>
                    </div>
                </section>
                <section id="apoie" aria-labelledby="oranje-support" className="mx-auto max-w-3xl scroll-mt-24 py-16 text-center md:py-24">
                    <span className={eyebrow}>{text("supportLabel")}</span>
                    <div id="oranje-support"><SectionTitle>{text("supportTitle")}</SectionTitle></div>
                    <p className="my-8 leading-relaxed text-foreground-secondary">{text("supportBody")}</p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <CTAButton href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={focus}>{text("whatsapp")}</CTAButton>
                        <Button href="/donate" variant="secondary" className={focus}>{text("donate")}</Button>
                    </div>
                </section>
            </div>
        </div>
    );
}
