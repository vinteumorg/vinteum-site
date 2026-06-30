export interface GhostAuthor {
    id: string;
    name: string;
    slug: string;
    profile_image: string | null;
    bio: string | null;
    url: string;
}

export interface GhostTag {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    feature_image: string | null;
    visibility: "public" | "internal";
    url: string;
}

export interface GhostPost {
    id: string;
    uuid: string;
    title: string;
    slug: string;
    html: string;
    feature_image: string | null;
    feature_image_alt: string | null;
    feature_image_caption: string | null;
    featured: boolean;
    visibility: "public" | "members" | "paid";
    created_at: string;
    updated_at: string;
    published_at: string;
    custom_excerpt: string | null;
    excerpt: string;
    reading_time: number;
    url: string;
    canonical_url: string | null;
    og_image: string | null;
    og_title: string | null;
    og_description: string | null;
    meta_title: string | null;
    meta_description: string | null;
    authors: GhostAuthor[];
    tags: GhostTag[];
    primary_author: GhostAuthor;
    primary_tag: GhostTag | null;
}

export interface GhostPagination {
    page: number;
    limit: number;
    pages: number;
    total: number;
    next: number | null;
    prev: number | null;
}

export interface GhostPostsResponse {
    posts: GhostPost[];
    meta: { pagination: GhostPagination };
}

export interface GhostTagsResponse {
    tags: GhostTag[];
    meta: { pagination: GhostPagination };
}

export interface GhostNewsletter {
    id: string;
    name: string;
    slug: string;
    status: "active" | "archived";
}

export interface GhostNewslettersResponse {
    newsletters: GhostNewsletter[];
}
