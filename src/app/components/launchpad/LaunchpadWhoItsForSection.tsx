"use client";

import { CardGridSection } from "../shared/CardGridSection";

const CARD_KEYS = [
    "launchpad.whoItsFor.cards.card1",
    "launchpad.whoItsFor.cards.card2",
    "launchpad.whoItsFor.cards.card3",
    "launchpad.whoItsFor.cards.card4",
];

export function LaunchpadWhoItsForSection() {
    return (
        <CardGridSection
            titleKey="launchpad.whoItsFor.title"
            cardKeys={CARD_KEYS}
        />
    );
}
