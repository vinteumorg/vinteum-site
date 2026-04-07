"use client";

import { CardGridSection } from "../shared/CardGridSection";

const CARD_KEYS = [
    "mastering.howItWorks.card1",
    "mastering.howItWorks.card2",
    "mastering.howItWorks.card3",
    "mastering.howItWorks.card4",
];

const FULL_WIDTH_KEYS = ["mastering.howItWorks.card5"];

export function MasteringHowItWorksSection() {
    return (
        <CardGridSection
            titleKey="mastering.howItWorks.title"
            cardKeys={CARD_KEYS}
            fullWidthCardKeys={FULL_WIDTH_KEYS}
        />
    );
}
