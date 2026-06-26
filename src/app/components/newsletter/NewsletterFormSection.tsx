"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SectionTitle } from "../shared/SectionTitle";

type FormState = "idle" | "sending" | "success" | "error";

const BENEFIT_KEYS = [
    "newsletter.benefits.item1",
    "newsletter.benefits.item2",
    "newsletter.benefits.item3",
    "newsletter.benefits.item4",
];

export function NewsletterFormSection() {
    const { t } = useLanguage();

    const [form, setForm] = useState({ name: "", email: "" });
    const [status, setStatus] = useState<FormState>("idle");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");
        // TODO: implement newsletter subscription
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setStatus("success");
            setForm({ name: "", email: "" });
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

                    <div className="lg:w-[45%] rounded-[30px] border border-primary/20 backdrop-blur-sm bg-[rgba(49,66,45,0.12)] shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-8 md:p-10 flex flex-col gap-8">

                        <div className="flex flex-col gap-4">
                            {BENEFIT_KEYS.map((key) => (
                                <div
                                    key={key}
                                    className="flex items-start gap-4 rounded-2xl border border-primary/20 bg-[rgba(49,66,45,0.12)] px-6 py-5"
                                >
                                    <span
                                        className="mt-0.5 shrink-0 w-5 h-5 rounded-full border border-primary flex items-center justify-center"
                                        aria-hidden="true"
                                    >
                                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                            <circle cx="5" cy="5" r="3" fill="#91FFAE" />
                                        </svg>
                                    </span>
                                    <p className="font-space-mono text-sm font-normal text-foreground leading-[1.7]">
                                        {t(key)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:w-[55%] rounded-[30px] border border-primary/20 backdrop-blur-sm bg-[rgba(49,66,45,0.12)] shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-8 md:p-10">
                        <div className="flex items-center justify-between mb-8">
                        </div>

                        <SectionTitle className="text-left mb-4">
                            {t("newsletter.form.title")}
                        </SectionTitle>

                        <p className="font-poppins text-sm text-foreground/60 leading-relaxed mb-10">
                            {t("newsletter.form.subtitle")}
                        </p>

                        {status === "success" ? (
                            <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                                <span className="w-14 h-14 rounded-full bg-primary/20 border border-primary flex items-center justify-center">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#91FFAE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 6L9 17l-5-5" />
                                    </svg>
                                </span>
                                <p className="font-poppins text-foreground text-base">{t("newsletter.form.success")}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div className="flex flex-col gap-2">
                                        <label className="font-poppins text-xs text-foreground/60 uppercase tracking-widest">
                                            {t("newsletter.form.name")}
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder={t("newsletter.form.namePlaceholder")}
                                            required
                                            className={inputClass}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="font-poppins text-xs text-foreground/60 uppercase tracking-widest">
                                            {t("newsletter.form.email")}
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder={t("newsletter.form.emailPlaceholder")}
                                            required
                                            className={inputClass}
                                        />
                                    </div>
                                </div>

                                {status === "error" && (
                                    <p className="font-poppins text-sm text-red-400">
                                        {t("newsletter.form.error")}
                                    </p>
                                )}

                                <div>
                                    <button
                                        type="submit"
                                        disabled={status === "sending"}
                                        className="inline-flex items-center gap-3 pl-6 pr-2 py-2 rounded-[10px] bg-[#91FFAE] hover:bg-primary-hover transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="font-poppins text-base font-medium text-[#172719] whitespace-nowrap">
                                            {status === "sending"
                                                ? t("newsletter.form.sending")
                                                : t("newsletter.form.cta")}
                                        </span>
                                        <span className="w-9 h-9 rounded-lg bg-[#59D279] flex items-center justify-center shrink-0">
                                            <svg
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="#172719"
                                                strokeWidth="2.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                aria-hidden="true"
                                            >
                                                <path d="M7 17L17 7M17 7H7M17 7v10" />
                                            </svg>
                                        </span>
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
}
