import type { GhostPost } from "./ghost";

export function formatDate(iso: string, locale: "pt" | "en" = "en"): string {
    const d = new Date(iso);
    return d.toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export function filterPosts(
    all: GhostPost[],
    tag: string | null,
    query: string
): GhostPost[] {
    let result = all;
    if (tag) {
        result = result.filter((p) =>
            p.tags.some((t) => t.name === tag)
        );
    }
    if (query.trim()) {
        const q = query.toLowerCase();
        result = result.filter(
            (p) =>
                p.title.toLowerCase().includes(q) ||
                (p.custom_excerpt ?? p.excerpt).toLowerCase().includes(q) ||
                p.tags.some((t) => t.name.toLowerCase().includes(q))
        );
    }
    return result;
}

export function getPaginatedPosts(
    posts: GhostPost[],
    page: number,
    perPage = 6
): { posts: GhostPost[]; totalPages: number } {
    const totalPages = Math.ceil(posts.length / perPage);
    const start = (page - 1) * perPage;
    return { posts: posts.slice(start, start + perPage), totalPages };
}
