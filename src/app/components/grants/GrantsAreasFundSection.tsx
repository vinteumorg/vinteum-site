"use client";

import { CardGridSection } from "../shared/CardGridSection";

const CARD_KEYS = [
    "grants.areasFund.cards.card1",
    "grants.areasFund.cards.card2",
    "grants.areasFund.cards.card3",
    "grants.areasFund.cards.card4",
    "grants.areasFund.cards.card5",
    "grants.areasFund.cards.card6",
];

const FULL_WIDTH_KEYS = [
    "grants.areasFund.cards.card7",
];

export function GrantsAreasFundSection() {
    return (
        <div className="pt-20 md:pt-40">
            <CardGridSection
                titleKey="grants.areasFund.title"
                cardKeys={CARD_KEYS}
                fullWidthCardKeys={FULL_WIDTH_KEYS}
            />
        </div>
    );
}
