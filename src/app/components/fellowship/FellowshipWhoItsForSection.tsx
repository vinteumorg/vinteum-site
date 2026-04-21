"use client";

import { CardGridSection } from "../shared/CardGridSection";

const CARD_KEYS = [
    "fellowship.whoItsFor.cards.card1",
    "fellowship.whoItsFor.cards.card2",
    "fellowship.whoItsFor.cards.card3",
    "fellowship.whoItsFor.cards.card4",
];

export function FellowshipWhoItsForSection() {
    return (
        <div className="pt-20 md:pt-40">
            <CardGridSection
                titleKey="fellowship.whoItsFor.title"
                cardKeys={CARD_KEYS}
            />
        </div>
    );
}
