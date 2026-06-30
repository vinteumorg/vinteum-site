import { NewsletterHeroSection } from "../components/newsletter/NewsletterHeroSection";
import { NewsletterFormSection } from "../components/newsletter/NewsletterFormSection";
import { getNewsletters } from "@/lib/ghost/admin";

export default async function NewsletterPage() {
    const newsletters = await getNewsletters().catch(() => []);

    return (
        <div className="flex flex-col">
            <NewsletterHeroSection />
            <NewsletterFormSection newsletters={newsletters} />
        </div>
    );
}
