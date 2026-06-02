"use client";

import { DonateHeroSection } from "../components/donate/DonateHeroSection";
import { DonateImpactSection } from "../components/donate/DonateImpactSection";

export default function DonatePage() {
    return (
        <div className="flex flex-col">
            <DonateHeroSection />
            <DonateImpactSection />
        </div>
    );
}
