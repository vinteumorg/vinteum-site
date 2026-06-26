"use client";

import { NewsletterHeroSection } from "../components/newsletter/NewsletterHeroSection";
import { NewsletterFormSection } from "../components/newsletter/NewsletterFormSection";

export default function NewsletterPage() {
    return (
        <div className="flex flex-col">
            <NewsletterHeroSection />
            <NewsletterFormSection />
        </div>
    );
}
