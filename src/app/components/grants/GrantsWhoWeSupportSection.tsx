"use client";

import { BulletListWithTitleSection } from "../shared/BulletListWithTitleSection";

const ITEM_KEYS = [
    "grants.whoWeSupport.item1",
    "grants.whoWeSupport.item2",
    "grants.whoWeSupport.item3",
    "grants.whoWeSupport.item4",
    "grants.whoWeSupport.item5",
];

export function GrantsWhoWeSupportSection() {
    return (
        <BulletListWithTitleSection
            titleKey="grants.whoWeSupport.title"
            itemKeys={ITEM_KEYS}
        />
    );
}
