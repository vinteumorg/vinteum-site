"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { Hero } from "../shared/Hero";
import { CTAButton } from "../shared/CTAButton";
import { Button } from "../shared/Button";
import { SectionTitle } from "../shared/SectionTitle";

const REPORT_URL = "/assets/files/Vinteum-Year-Four-Report-2026.pdf";
const WHATSAPP_NUMBER = "5511967333301";
const focus = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";
const eyebrow = "mb-5 block font-space-mono text-xs uppercase tracking-widest text-primary";

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
                cta={{ label: text("results"), href: "#relatorio" }}
                backgroundImage="/assets/backgrounds/hero-home.svg"
            />
            <div className="mx-auto -mt-10 mb-16 flex max-w-3xl flex-col items-center gap-5 px-6 text-center relative z-10">
                <Button href="#apoie" variant="secondary" className={focus}>{text("supportLink")}</Button>
                <p className="font-space-mono text-xs text-foreground-secondary">{text("note")}</p>
            </div>
            <div className="mx-auto max-w-7xl px-6 md:px-14 lg:px-20">
                <section aria-labelledby="oranje-why" className="grid gap-8 border-b border-border-subtle py-12 md:grid-cols-2 md:gap-16 md:py-20">
                    <div>
                        <span className={eyebrow}>{text("whyLabel")}</span>
                        <div id="oranje-why"><SectionTitle>{text("whyTitle")}</SectionTitle></div>
                    </div>
                    <div className="space-y-6 leading-relaxed text-foreground-secondary">
                        <p>{text("whyBody")}</p>
                        <p className="border-l-2 border-primary pl-6 text-xl text-foreground">{text("quote")}</p>
                    </div>
                </section>
                <section aria-labelledby="oranje-work" className="py-12 md:py-20">
                    <div className="mb-12 grid gap-8 md:grid-cols-2 md:gap-16">
                        <div>
                            <span className={eyebrow}>{text("workLabel")}</span>
                            <div id="oranje-work"><SectionTitle>{text("workTitle")}</SectionTitle></div>
                        </div>
                        <p className="self-end leading-relaxed text-foreground-secondary">{text("workBody")}</p>
                    </div>
                    <div className="grid gap-8 md:grid-cols-3">
                        {(["security", "infra", "education"] as const).map((topic) => (
                            <article key={topic} className="border-t border-border pt-6">
                                <span className={eyebrow}>{text(`${topic}Label`)}</span>
                                <h3 className="mb-4 text-xl text-foreground">{text(`${topic}Title`)}</h3>
                                <p className="mb-6 text-sm leading-relaxed text-foreground-secondary">{text(`${topic}Body`)}</p>
                                {topic === "education" ? (
                                    <Link href="/programs/bitcoin-dev-launchpad" className={`${eyebrow} ${focus} underline underline-offset-4`}>{text(`${topic}Project`)}</Link>
                                ) : <span className={eyebrow}>{text(`${topic}Project`)}</span>}
                            </article>
                        ))}
                    </div>
                </section>
                <section id="relatorio" aria-labelledby="oranje-report" className="scroll-mt-24 grid items-center gap-10 rounded-3xl border border-border bg-background-secondary p-6 md:grid-cols-2 md:p-12">
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
                    <p className="mb-4 mt-10 text-sm leading-relaxed text-foreground-secondary">{text("casaBody")}</p>
                    <a href="https://casa21.vinteum.org/" target="_blank" rel="noopener noreferrer" className={`text-sm text-primary underline underline-offset-4 ${focus}`}>{text("casaLink")}</a>
                </section>
            </div>
        </div>
    );
}
