// ──────────────────────────────────────────────
// Blog types & mock data
// TODO: replace mock data with a real CMS / API
// ──────────────────────────────────────────────

export type ContentBlock =
    | { type: "paragraph"; text: string }
    | { type: "heading"; level: 2 | 3; text: string }
    | { type: "quote"; text: string; author?: string }
    | { type: "image"; src: string; alt: string; caption?: string }
    | { type: "list"; items: string[] }
    | { type: "divider" };

export type BlogPost = {
    slug: string;
    title: string;
    excerpt: string;
    coverImage: string;
    author: {
        name: string;
        avatar?: string;
        role?: string;
    };
    date: string; // ISO 8601
    readingTime: number; // minutes
    categories: string[];
    tags: string[];
    content: ContentBlock[];
    featured?: boolean;
};

// ──────────────────────────────────────────────
// Mock posts — replace with CMS data
// ──────────────────────────────────────────────
export const MOCK_POSTS: BlogPost[] = [
    {
        slug: "bitcoin-core-contributions-2025",
        title: "How Vinteum developers are contributing to Bitcoin Core in 2025",
        excerpt:
            "A look at pull requests, code reviews, and protocol improvements our team shipped this year.",
        coverImage: "/assets/images/blog/post-placeholder.png",
        author: { name: "Lucas Ferreira", role: "Co-founder", avatar: undefined },
        date: "2025-11-15",
        readingTime: 6,
        categories: ["Bitcoin Core", "Development"],
        tags: ["open-source", "bitcoin-core", "contributions"],
        featured: true,
        content: [
            {
                type: "paragraph",
                text: "Bitcoin Core is the reference implementation of the Bitcoin protocol. Every improvement, bug fix, and new feature goes through a rigorous peer review process before being merged — and Vinteum's developers have been active participants in that process throughout 2025.",
            },
            {
                type: "heading",
                level: 2,
                text: "What our team shipped",
            },
            {
                type: "paragraph",
                text: "This year, our fellows and grantees merged over 30 pull requests spanning areas such as P2P networking, the mempool, wallet infrastructure, and the test framework. Each of these contributions required deep protocol knowledge, careful code review cycles, and sustained engagement with the global Bitcoin Core maintainer community.",
            },
            {
                type: "quote",
                text: "Contributing to Bitcoin Core taught me to think differently about software permanence. Every line you write may be running on millions of nodes for decades.",
                author: "João, Vinteum Fellow",
            },
            {
                type: "heading",
                level: 2,
                text: "Why this work matters",
            },
            {
                type: "paragraph",
                text: "Bitcoin's security and resilience depend on a diverse, distributed set of contributors. When that contributor base is concentrated in a handful of countries or companies, it creates fragility. Vinteum exists to change that — bringing Brazilian developers into the global Bitcoin technical community.",
            },
            {
                type: "list",
                items: [
                    "30+ pull requests merged to Bitcoin Core",
                    "12 code reviews on critical protocol changes",
                    "3 new contributors onboarded to the codebase",
                    "Participation in 2 Bitcoin Core developer meetings",
                ],
            },
            {
                type: "divider",
            },
            {
                type: "paragraph",
                text: "If you want to support this work, consider donating to Vinteum or reaching out about our fellowship and grants programs.",
            },
        ],
    },
    {
        slug: "lightning-network-research-brazil",
        title: "Lightning Network research: what our grantees discovered in Q3",
        excerpt:
            "Payment channel routing, liquidity management, and privacy improvements from our latest research.",
        coverImage: "/assets/images/blog/post-placeholder.png",
        author: { name: "André Neves", role: "Co-founder", avatar: undefined },
        date: "2025-10-02",
        readingTime: 8,
        categories: ["Lightning Network", "Research"],
        tags: ["lightning", "research", "privacy"],
        featured: false,
        content: [
            {
                type: "paragraph",
                text: "The Lightning Network continues to evolve rapidly. Our Q3 research cycle focused on three main areas: routing efficiency, channel liquidity, and privacy at the protocol layer.",
            },
            {
                type: "heading",
                level: 2,
                text: "Routing efficiency",
            },
            {
                type: "paragraph",
                text: "Finding the optimal path for a Lightning payment is a hard graph problem. Our grantees explored novel heuristics that reduce payment failure rates while keeping fees competitive.",
            },
        ],
    },
    {
        slug: "mastering-bitcoin-seminar-cohort-3",
        title: "Mastering Bitcoin Seminars — Cohort 3 recap",
        excerpt:
            "Eight weeks, 24 developers, deep dives into elliptic curve cryptography, Script, and Bitcoin.",
        coverImage: "/assets/images/blog/post-placeholder.png",
        author: { name: "Vinteum Team", role: "Education", avatar: undefined },
        date: "2025-09-10",
        readingTime: 5,
        categories: ["Education", "Mastering Seminars"],
        tags: ["education", "seminars", "cohort"],
        featured: false,
        content: [
            {
                type: "paragraph",
                text: "Cohort 3 of the Mastering Bitcoin Seminars wrapped up in August with strong results. Twenty-four developers completed the program, with six continuing into the Bitcoin Dev Launchpad.",
            },
        ],
    },
    {
        slug: "launchpad-cohort-2-graduates",
        title: "Bitcoin Dev Launchpad — Cohort 2 graduates are now contributing",
        excerpt:
            "Meet the developers from our second Launchpad cohort and the real-world impact they've already made.",
        coverImage: "/assets/images/blog/post-placeholder.png",
        author: { name: "Vinteum Team", role: "Programs", avatar: undefined },
        date: "2025-08-20",
        readingTime: 7,
        categories: ["Launchpad", "Community"],
        tags: ["launchpad", "contributors", "alumni"],
        featured: false,
        content: [
            {
                type: "paragraph",
                text: "The second cohort of the Bitcoin Dev Launchpad graduated in July. Here's a look at what they're working on now.",
            },
        ],
    },
    {
        slug: "vinteum-2025-annual-report",
        title: "Vinteum 2025 Annual Report: three years building Bitcoin's future",
        excerpt:
            "From a small experiment in 2022 to one of Latin America's most active Bitcoin development orgs.",
        coverImage: "/assets/images/blog/post-placeholder.png",
        author: { name: "Lucas Ferreira", role: "Co-founder", avatar: undefined },
        date: "2025-12-01",
        readingTime: 10,
        categories: ["Vinteum", "Annual Report"],
        tags: ["annual-report", "impact", "2025"],
        featured: false,
        content: [
            {
                type: "paragraph",
                text: "Three years ago, Vinteum was an idea — a bet that Brazil could become a meaningful contributor to Bitcoin's open-source ecosystem. Today, the results speak for themselves.",
            },
        ],
    },
    {
        slug: "bitcoin-privacy-tools-brazil",
        title: "Bitcoin privacy tooling for Brazilians: a practical guide",
        excerpt:
            "Coinjoin, payjoin, silent payments — a practical overview of privacy-preserving Bitcoin tools.",
        coverImage: "/assets/images/blog/post-placeholder.png",
        author: { name: "Vinteum Research", role: "Research", avatar: undefined },
        date: "2025-07-14",
        readingTime: 9,
        categories: ["Privacy", "Research"],
        tags: ["privacy", "coinjoin", "silent-payments"],
        featured: false,
        content: [
            {
                type: "paragraph",
                text: "Privacy on Bitcoin is not a luxury — it's a prerequisite for financial autonomy. This guide explores the current toolset available to Brazilian users.",
            },
        ],
    },
];

// ──────────────────────────────────────────────
// Helper functions
// ──────────────────────────────────────────────

/** All unique categories across all posts */
export function getAllCategories(): string[] {
    const set = new Set<string>();
    MOCK_POSTS.forEach((p) => p.categories.forEach((c) => set.add(c)));
    return Array.from(set).sort();
}

/** Find a post by slug */
export function getPostBySlug(slug: string): BlogPost | undefined {
    return MOCK_POSTS.find((p) => p.slug === slug);
}

/** Posts related to a given post (same category, excluding self) */
export function getRelatedPosts(post: BlogPost, limit = 3): BlogPost[] {
    return MOCK_POSTS.filter(
        (p) =>
            p.slug !== post.slug &&
            p.categories.some((c) => post.categories.includes(c))
    ).slice(0, limit);
}

/** Paginate posts */
export function getPaginatedPosts(
    posts: BlogPost[],
    page: number,
    perPage = 6
): { posts: BlogPost[]; totalPages: number } {
    const totalPages = Math.ceil(posts.length / perPage);
    const start = (page - 1) * perPage;
    return { posts: posts.slice(start, start + perPage), totalPages };
}

/** Filter posts by category and/or search query */
export function filterPosts(
    all: BlogPost[],
    category: string | null,
    query: string
): BlogPost[] {
    let result = all;
    if (category) {
        result = result.filter((p) => p.categories.includes(category));
    }
    if (query.trim()) {
        const q = query.toLowerCase();
        result = result.filter(
            (p) =>
                p.title.toLowerCase().includes(q) ||
                p.excerpt.toLowerCase().includes(q) ||
                p.tags.some((t) => t.includes(q))
        );
    }
    return result;
}

/** Format ISO date to display string */
export function formatDate(iso: string, locale: "pt" | "en" = "en"): string {
    const d = new Date(iso);
    return d.toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}
