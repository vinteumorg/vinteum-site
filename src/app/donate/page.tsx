import { DonateHeroSection } from "../components/donate/DonateHeroSection";
import { DonateImpactSection } from "../components/donate/DonateImpactSection";
import { DonationsExperience } from "../components/donate/DonationsExperience";

// Rollout is server-only. The existing Geyser experience remains the default.
export const dynamic = "force-dynamic";
export default function DonatePage() {
    if (process.env.DONATIONS_ENABLED === "true") return <DonationsExperience />;
    return (
        <div className="flex flex-col">
            <DonateHeroSection />
            <DonateImpactSection />
        </div>
    );
}
