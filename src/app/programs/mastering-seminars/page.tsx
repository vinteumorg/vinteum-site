"use client";

import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { Hero } from "../../components/shared/Hero";
import { MasteringOverviewSection } from "../../components/mastering/MasteringOverviewSection";
import { MasteringHowItWorksSection } from "../../components/mastering/MasteringHowItWorksSection";
import { MasteringWhoCanJoinSection } from "../../components/mastering/MasteringWhoCanJoinSection";

const MASTERING_BITCOIN_URL = "https://github.com/bitcoinbook/bitcoinbook";
const MASTERING_LIGHTNING_URL = "https://github.com/lnbook/lnbook";

export default function MasteringSeminarsPage() {
    const { t, locale } = useLanguage();

    const subtitleNode = locale === "BR" ? (
        <span>
            Os Mastering Seminars são grupos de estudo semanais baseados em discussão, construídos em torno dos livros{" "}
            <a
                href={MASTERING_BITCOIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
                Mastering Bitcoin
            </a>
            {" "}e{" "}
            <a
                href={MASTERING_LIGHTNING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
                Mastering the Lightning Network
            </a>
            .
        </span>
    ) : (
        <span>
            Mastering Seminars are weekly discussion-based study groups built around{" "}
            <a
                href={MASTERING_BITCOIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
                Mastering Bitcoin
            </a>
            {" "}and{" "}
            <a
                href={MASTERING_LIGHTNING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
                Mastering the Lightning Network
            </a>
            .
        </span>
    );

    return (
        <div className="flex flex-col">
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none select-none z-0">
                    <Image
                        src="/assets/backgrounds/hero-programs.svg"
                        alt=""
                        fill
                        priority
                        className="object-cover object-top opacity-60"
                        aria-hidden="true"
                    />
                </div>

                <div className="relative z-10">
                    <Hero
                        variant="simple"
                        title={t("mastering.hero.title")}
                        subtitleNode={subtitleNode}
                    />
                </div>
                <MasteringOverviewSection />
            </div>
            <MasteringHowItWorksSection />
            <MasteringWhoCanJoinSection />

        </div>
    );
}
