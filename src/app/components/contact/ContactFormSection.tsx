"use client";

import { useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { CTAButton } from "../shared/CTAButton";
import { SectionTitle } from "../shared/SectionTitle";

const SOCIAL_LINKS = [
    { icon: "/assets/icons/social/twitter.svg", alt: "Twitter / X", href: "https://twitter.com/vinteumorg" },
    { icon: "/assets/icons/social/nostr.svg", alt: "Nostr", href: "https://njump.me/npub1vinteum" },
    { icon: "/assets/icons/social/discord.svg", alt: "Discord", href: "https://discord.gg/vinteum" },
    { icon: "/assets/icons/social/instagram.svg", alt: "Instagram", href: "https://instagram.com/vinteum" },
    { icon: "/assets/icons/social/linkedin.svg", alt: "LinkedIn", href: "https://linkedin.com/company/vinteum" },
];

type FormState = "idle" | "sending" | "success" | "error";

export function ContactFormSection() {
    const { t } = useLanguage();

    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [status, setStatus] = useState<FormState>("idle");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");
        // TODO: implement form submission
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setStatus("success");
            setForm({ name: "", email: "", subject: "", message: "" });
        } catch {
            setStatus("error");
        }
    };

    const inputClass =
        "w-full bg-transparent border-b border-foreground/20 text-foreground placeholder:text-foreground/40 pb-2 focus:outline-none focus:border-primary transition-colors font-poppins text-sm";

    return (
        <section className="relative w-full py-12 md:py-28">
            <div className="max-w-7xl mx-auto px-8 md:px-14 lg:px-20">
                <div className="flex flex-col lg:flex-row gap-5 lg:items-start">

                    {/* Card esquerdo — formulário */}
                    <div className="lg:w-[62%] rounded-[30px] border border-primary/20 backdrop-blur-sm bg-[rgba(49,66,45,0.12)] shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-8 md:p-10">
                        <SectionTitle className="mb-10">{t("contact.form.title")}</SectionTitle>

                        {status === "success" ? (
                            <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                                <span className="w-14 h-14 rounded-full bg-primary/20 border border-primary flex items-center justify-center">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#91FFAE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 6L9 17l-5-5" />
                                    </svg>
                                </span>
                                <p className="font-poppins text-foreground text-base">{t("contact.form.success")}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div className="flex flex-col gap-2">
                                        <label className="font-poppins text-xs text-foreground/60 uppercase tracking-widest">
                                            {t("contact.form.name")}
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder={t("contact.form.namePlaceholder")}
                                            required
                                            className={inputClass}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="font-poppins text-xs text-foreground/60 uppercase tracking-widest">
                                            {t("contact.form.email")}
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder={t("contact.form.emailPlaceholder")}
                                            required
                                            className={inputClass}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="font-poppins text-xs text-foreground/60 uppercase tracking-widest">
                                        {t("contact.form.subject")}
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={form.subject}
                                        onChange={handleChange}
                                        placeholder={t("contact.form.subjectPlaceholder")}
                                        required
                                        className={inputClass}
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="font-poppins text-xs text-foreground/60 uppercase tracking-widest">
                                        {t("contact.form.message")}
                                    </label>
                                    <textarea
                                        name="message"
                                        value={form.message}
                                        onChange={handleChange}
                                        placeholder={t("contact.form.messagePlaceholder")}
                                        required
                                        rows={5}
                                        className={`${inputClass} resize-none`}
                                    />
                                </div>

                                {status === "error" && (
                                    <p className="font-poppins text-sm text-red-400">{t("contact.form.error")}</p>
                                )}

                                <div className="flex justify-start mt-2">
                                    <CTAButton type="submit" disabled={status === "sending"}>
                                        {status === "sending" ? t("contact.form.sending") : t("contact.form.submit")}
                                    </CTAButton>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Card direito — email e redes sociais */}
                    <div className="lg:w-[38%] rounded-[30px] border border-primary/20 backdrop-blur-sm bg-[rgba(49,66,45,0.12)] shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-8 md:p-10 flex flex-col gap-10">
                        {/* Email */}
                        <div className="flex flex-col gap-3">
                            <span className="font-poppins text-xs text-foreground/60 uppercase tracking-widest">
                                {t("contact.social.emailLabel")}
                            </span>
                            <a
                                href={`mailto:${t("contact.social.email")}`}
                                className="font-rethink-sans text-xl md:text-2xl text-primary hover:text-primary-hover transition-colors break-all"
                            >
                                {t("contact.social.email")}
                            </a>
                        </div>

                        {/* Divisor */}
                        <div className="w-full h-px bg-primary/20" />

                        {/* Redes sociais */}
                        <div className="flex flex-col gap-5">
                            <span className="font-poppins text-xs text-foreground/60 uppercase tracking-widest">
                                {t("contact.social.title")}
                            </span>
                            <div className="flex flex-wrap gap-4">
                                {SOCIAL_LINKS.map(({ icon, alt, href }) => (
                                    <a
                                        key={alt}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={alt}
                                        className="w-11 h-11 rounded-xl border border-primary/20 bg-[rgba(49,66,45,0.2)] flex items-center justify-center hover:border-primary hover:bg-primary/10 transition-all duration-200"
                                    >
                                        <Image src={icon} alt={alt} width={20} height={20} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
