"use client";

import { ContactHeroSection } from "../components/contact/ContactHeroSection";
import { ContactFormSection } from "../components/contact/ContactFormSection";

export default function ContatoPage() {
    return (
        <div className="flex flex-col">
            <ContactHeroSection />
            <ContactFormSection />
        </div>
    );
}
