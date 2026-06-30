"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Adds interactivity to Ghost Koenig cards that rely on JavaScript:
 *  - Toggle cards: click handler on .kg-toggle-heading toggles data-kg-toggle-state
 *  - Audio cards:  adds native `controls` attribute to <audio> (Ghost omits it)
 *  - Video cards:  adds native `controls` attribute to <video> (Ghost omits it)
 *  - Signup cards: intercepts form submit and redirects to /newsletter
 */
export function BlogPostInteractivePatch() {
    const router = useRouter();

    useEffect(() => {
        const content = document.querySelector<HTMLElement>(".ghost-content");
        if (!content) return;

        const cleanups: (() => void)[] = [];

        // ── Toggle cards ─────────────────────────────────────────────
        content.querySelectorAll<HTMLElement>(".kg-toggle-heading").forEach((heading) => {
            const card = heading.closest<HTMLElement>(".kg-toggle-card");
            if (!card) return;

            const handler = () => {
                const isOpen = card.getAttribute("data-kg-toggle-state") === "open";
                card.setAttribute("data-kg-toggle-state", isOpen ? "close" : "open");
            };

            heading.addEventListener("click", handler);
            cleanups.push(() => heading.removeEventListener("click", handler));
        });

        // ── Audio cards ───────────────────────────────────────────────
        content.querySelectorAll<HTMLAudioElement>(".kg-audio-card audio").forEach((audio) => {
            audio.controls = true;
        });

        // ── Video cards ───────────────────────────────────────────────
        content.querySelectorAll<HTMLVideoElement>(".kg-video-card video").forEach((video) => {
            video.controls = true;
        });

        // ── Signup cards ──────────────────────────────────────────────
        content.querySelectorAll<HTMLFormElement>(".kg-signup-card form").forEach((form) => {
            const handler = (e: Event) => {
                e.preventDefault();
                router.push("/newsletter");
            };
            form.addEventListener("submit", handler);
            cleanups.push(() => form.removeEventListener("submit", handler));
        });

        return () => cleanups.forEach((fn) => fn());
    }, [router]);

    return null;
}
