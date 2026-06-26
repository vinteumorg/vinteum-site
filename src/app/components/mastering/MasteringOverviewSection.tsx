"use client";

import { CheckCardGridSection } from "../shared/CheckCardGridSection";

const items = [
    { labelKey: "mastering.overview.item1" },
    { labelKey: "mastering.overview.item2" },
    { labelKey: "mastering.overview.item3" },
    { labelKey: "mastering.overview.item4", subtitleKey: "mastering.overview.item4Subtitle" },
];

export function MasteringOverviewSection() {
    return (
        <div className="pt-20 md:pt-40">
            <CheckCardGridSection
                titleKey="mastering.overview.title"
                items={items}
            />
        </div>
    );
}
