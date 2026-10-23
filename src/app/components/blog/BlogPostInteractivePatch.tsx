"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type MathRendererWindow = Window & {
    renderMathInElement?: (
        element: HTMLElement,
        options: {
            delimiters: Array<{ left: string; right: string; display: boolean }>;
            ignoredTags: string[];
            throwOnError: boolean;
        }
    ) => void;
};

const KATEX_VERSION = "0.16.22";

/** Does this HTML contain any delimiter KaTeX should act on? */
const HAS_MATH = /\\\(|\\\[|\$\$/;
let katexScriptPromise: Promise<void> | null = null;

function loadKatex(): Promise<void> {
    if (typeof window === "undefined") return Promise.resolve();
    if ((window as MathRendererWindow).renderMathInElement) return Promise.resolve();
    if (katexScriptPromise) return katexScriptPromise;

    if (!document.querySelector('link[data-katex-styles]')) {
        const stylesheet = document.createElement("link");
        stylesheet.rel = "stylesheet";
        stylesheet.href = `https://cdn.jsdelivr.net/npm/katex@${KATEX_VERSION}/dist/katex.min.css`;
        stylesheet.dataset.katexStyles = "true";
        document.head.appendChild(stylesheet);
    }

    const promise = new Promise<void>((resolve, reject) => {
        const loadScript = (src: string, marker: string, onload: () => void) => {
            const existing = document.querySelector<HTMLScriptElement>(`script[${marker}]`);
            if (existing?.dataset.loaded === "true") {
                onload();
                return;
            }

            const script = existing ?? document.createElement("script");
            script.src = src;
            script.async = true;
            script.setAttribute(marker, "true");
            script.addEventListener("load", () => {
                script.dataset.loaded = "true";
                onload();
            }, { once: true });
            script.addEventListener("error", () => {
                script.remove();
                reject(new Error(`Unable to load ${marker}`));
            }, { once: true });
            if (!existing) document.head.appendChild(script);
        };

        loadScript(
            `https://cdn.jsdelivr.net/npm/katex@${KATEX_VERSION}/dist/katex.min.js`,
            "data-katex-core",
            () => loadScript(
                `https://cdn.jsdelivr.net/npm/katex@${KATEX_VERSION}/dist/contrib/auto-render.min.js`,
                "data-katex-auto-render",
                () => resolve()
            )
        );
    }).catch((error: unknown) => {
        katexScriptPromise = null;
        throw error;
    });

    katexScriptPromise = promise;
    return promise;
}

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

        // Render LaTeX delimiters from Ghost's HTML with KaTeX, but only when the
        // post actually contains any. KaTeX is fetched from a CDN, so this keeps
        // the common case — a post with no math — free of a third-party request.
        let active = true;
        if (HAS_MATH.test(content.innerHTML)) {
            loadKatex()
                .then(() => {
                    if (!active) return;
                    (window as MathRendererWindow).renderMathInElement?.(content, {
                        delimiters: [
                            { left: "$$", right: "$$", display: true },
                            { left: "\\[", right: "\\]", display: true },
                            { left: "\\(", right: "\\)", display: false },
                            // A bare "$" delimiter is deliberately absent: this site
                            // writes money as US$ and R$, and enabling it would render
                            // whatever sits between two of them as mathematics.
                        ],
                        ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"],
                        throwOnError: false,
                    });
                })
                .catch((error: unknown) => console.error("KaTeX failed to render Ghost post math", error));
        }

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

        return () => {
            active = false;
            cleanups.forEach((fn) => fn());
        };
    }, [router]);

    return null;
}
