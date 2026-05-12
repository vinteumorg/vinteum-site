"use client";

import { CardGridSection } from "../shared/CardGridSection";

const CARD_KEYS = [
    "bitdevs.whatToExpect.cards.card1",
    "bitdevs.whatToExpect.cards.card2",
    "bitdevs.whatToExpect.cards.card3",
    "bitdevs.whatToExpect.cards.card4",
];

export function BitDevsWhatToExpectSection() {
    return (
        <CardGridSection
            titleKey="bitdevs.whatToExpect.title"
            cardKeys={CARD_KEYS}
        />
    );
}
