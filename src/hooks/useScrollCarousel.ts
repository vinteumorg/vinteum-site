import { useRef, useState, useCallback } from "react";

export function useScrollCarousel(selector: string) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        const items = Array.from(el.querySelectorAll<HTMLElement>(selector));
        const origin = el.getBoundingClientRect().left;
        let nearest = 0;
        let nearestDist = Infinity;
        items.forEach((item, i) => {
            const dist = Math.abs(item.getBoundingClientRect().left - origin);
            if (dist < nearestDist) { nearestDist = dist; nearest = i; }
        });
        setActiveIndex(nearest);
    }, [selector]);

    const scrollToIndex = useCallback((i: number) => {
        const el = scrollRef.current;
        if (!el) return;
        const items = el.querySelectorAll<HTMLElement>(selector);
        const item = items[i];
        if (!item) return;
        el.scrollBy({
            left: item.getBoundingClientRect().left - el.getBoundingClientRect().left,
            behavior: "smooth",
        });
    }, [selector]);

    return { scrollRef, activeIndex, handleScroll, scrollToIndex };
}
