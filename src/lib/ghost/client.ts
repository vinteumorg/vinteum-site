import type {
    GhostPost,
    GhostPostsResponse,
    GhostTag,
    GhostTagsResponse,
} from "./types";

const POST_FIELDS = [
    "id", "slug", "title", "html",
    "feature_image", "feature_image_alt", "feature_image_caption",
    "featured", "visibility",
    "published_at", "updated_at", "created_at",
    "reading_time", "custom_excerpt", "excerpt",
    "url", "canonical_url",
    "og_image", "og_title", "og_description",
    "meta_title", "meta_description",
].join(",");

function getConfig(): { url: string; key: string } | null {
    const url = process.env.GHOST_URL;
    const key = process.env.GHOST_CONTENT_API_KEY;
    if (!url || !key) return null;
    return { url, key };
}

function buildUrl(
    base: string,
    key: string,
    endpoint: string,
    params: Record<string, string>
): string {
    const url = new URL(`${base}/ghost/api/content/${endpoint}/`);
    url.searchParams.set("key", key);
    for (const [k, v] of Object.entries(params)) {
        url.searchParams.set(k, v);
    }
    return url.toString();
}

const EMPTY_POSTS_RESPONSE: GhostPostsResponse = {
    posts: [],
    meta: { pagination: { page: 1, limit: 15, pages: 0, total: 0, next: null, prev: null } },
};

const REVALIDATE = 60; // seconds

async function ghostFetch<T>(url: string): Promise<T> {
    const res = await fetch(url, { next: { revalidate: REVALIDATE } });
    if (!res.ok) {
        throw new Error(`Ghost API error ${res.status}: ${res.statusText} — ${url}`);
    }
    return res.json() as Promise<T>;
}

export interface GetPostsOptions {
    page?: number;
    limit?: number | "all";
    tag?: string;
    featured?: boolean;
}

export async function getPosts(options: GetPostsOptions = {}): Promise<GhostPostsResponse> {
    const config = getConfig();
    if (!config) return EMPTY_POSTS_RESPONSE;

    const { url, key } = config;
    const { page = 1, limit = 6, tag, featured = undefined } = options;

    const filters = ["visibility:public"];
    if (tag) filters.push(`tag:${tag}`);
    if (featured !== undefined) filters.push(`featured:${featured}`);

    return ghostFetch<GhostPostsResponse>(
        buildUrl(url, key, "posts", {
            include: "authors,tags",
            fields: POST_FIELDS,
            filter: filters.join("+"),
            order: "published_at desc",
            page: String(page),
            limit: String(limit ?? 6),
        })
    );
}

export async function getPostBySlug(slug: string): Promise<GhostPost | null> {
    const config = getConfig();
    if (!config) return null;

    const { url, key } = config;

    const apiUrl = buildUrl(url, key, `posts/slug/${slug}`, {
        include: "authors,tags",
        fields: POST_FIELDS,
    });

    const res = await fetch(apiUrl, { next: { revalidate: REVALIDATE } });

    if (res.status === 404) return null;
    if (!res.ok) {
        throw new Error(`Ghost API error ${res.status}: ${res.statusText}`);
    }

    const data = (await res.json()) as GhostPostsResponse;
    return data.posts[0] ?? null;
}

export async function getRelatedPosts(
    tagSlugs: string[],
    excludeSlug: string,
    limit = 3
): Promise<GhostPost[]> {
    if (tagSlugs.length === 0) return [];

    const config = getConfig();
    if (!config) return [];

    const { url, key } = config;
    const tagFilter = tagSlugs.map((t) => `tag:${t}`).join(",");

    const data = await ghostFetch<GhostPostsResponse>(
        buildUrl(url, key, "posts", {
            include: "authors,tags",
            fields: POST_FIELDS,
            filter: `(${tagFilter})+slug:-${excludeSlug}+visibility:public`,
            order: "published_at desc",
            limit: String(limit),
        })
    );

    return data.posts;
}

export async function getAllTags(): Promise<GhostTag[]> {
    const config = getConfig();
    if (!config) return [];

    const { url, key } = config;

    const data = await ghostFetch<GhostTagsResponse>(
        buildUrl(url, key, "tags", {
            limit: "all",
            filter: "visibility:public",
            fields: "id,name,slug,description,url",
            order: "name asc",
        })
    );

    return data.tags;
}

export async function getFeaturedPost(): Promise<GhostPost | null> {
    const config = getConfig();
    if (!config) return null;

    const { url, key } = config;

    const data = await ghostFetch<GhostPostsResponse>(
        buildUrl(url, key, "posts", {
            include: "authors,tags",
            fields: POST_FIELDS,
            filter: "featured:true+visibility:public",
            order: "published_at desc",
            limit: "1",
        })
    );

    return data.posts[0] ?? null;
}
