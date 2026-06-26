"use client";

import { BulletListWithTitleSection } from "../shared/BulletListWithTitleSection";

const ITEM_KEYS = [
    "fellowship.whatFellowsReceive.item1",
    "fellowship.whatFellowsReceive.item2",
    "fellowship.whatFellowsReceive.item3",
    "fellowship.whatFellowsReceive.item4",
];

export function FellowshipWhatFellowsReceiveSection() {
    return (
        <BulletListWithTitleSection
            titleKey="fellowship.whatFellowsReceive.title"
            itemKeys={ITEM_KEYS}
        />
    );
}
