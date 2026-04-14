"use client";

import { CheckCardGridSection } from "../shared/CheckCardGridSection";

export function LaunchpadCohortSection() {
    const items = [
        { labelKey: "launchpad.cohort.applicants", valueKey: "620+" },
        { labelKey: "launchpad.cohort.trained", valueKey: "120" },
        { labelKey: "launchpad.cohort.graduated", valueKey: "22" },
        { labelKey: "launchpad.cohort.hired", valueKey: "9" },
    ];

    return (
        <CheckCardGridSection
            titleKey="launchpad.cohort.title"
            items={items}
        />
    );
}
