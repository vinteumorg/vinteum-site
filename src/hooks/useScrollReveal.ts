"use client";

import { useEffect, type RefObject } from "react";

type RevealOptions = {
    targets: string[];
    hiddenClass: string;
    visibleClass: string;
    resetKey?: string;
};

/**
 * Reveals elements as they scroll into view.
 *
 * The elements are visible in the server-rendered HTML, so the page still works
 * without JavaScript. Only elements below the fold are hidden, which keeps the
 * first screen from flashing during hydration.
 */
export function useScrollReveal(ref: RefObject<HTMLElement | null>, { targets, hiddenClass, visibleClass, resetKey }: RevealOptions) {
    useEffect(() => {
        const root = ref.current;
        if (!root || typeof window === "undefined") return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        if (typeof IntersectionObserver === "undefined") return;
        const elements = Array.from(new Set(targets.flatMap((selector) => Array.from(root.querySelectorAll<HTMLElement>(selector)))));
        if (!elements.length) return;

        const pending: HTMLElement[] = [];
        for (const element of elements) {
            if (element.getBoundingClientRect().top > window.innerHeight * 0.8) {
                element.classList.add(hiddenClass);
                pending.push(element);
            }
        }
        if (!pending.length) return;

        const reveal = (element: HTMLElement) => {
            element.classList.add(visibleClass);
            element.classList.remove(hiddenClass);
        };

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (!entry.isIntersecting) continue;
                    reveal(entry.target as HTMLElement);
                    observer.unobserve(entry.target);
                }
            },
            { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
        );

        pending.forEach((element, index) => {
            element.style.transitionDelay = `${Math.min(index % 4, 3) * 55}ms`;
            observer.observe(element);
        });

        return () => {
            observer.disconnect();
            for (const element of pending) {
                element.classList.remove(hiddenClass);
                element.style.transitionDelay = "";
            }
        };
    }, [ref, targets, hiddenClass, visibleClass, resetKey]);
}
