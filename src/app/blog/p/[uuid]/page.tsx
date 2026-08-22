import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostByUuidAdmin } from "@/lib/ghost/admin";
import { getRelatedPosts } from "@/lib/ghost";
import { BlogPostHero } from "../../../components/blog/BlogPostHero";
import { BlogPostContent } from "../../../components/blog/BlogPostContent";
import { BlogShareButtons } from "../../../components/blog/BlogShareButtons";
import { BlogRelatedPosts } from "../../../components/blog/BlogRelatedPosts";

// Matches the URL Ghost's own "Preview" button links to: `{siteUrl}/p/:uuid/`,
// which resolves to `/blog/p/:uuid` here since the site's `url` setting is
// `https://www.vinteum.org/blog`.
export const revalidate = 0;

type PageProps = {
    params: Promise<{ uuid: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { uuid } = await params;
    const post = await getPostByUuidAdmin(uuid);

    if (!post) return { title: "Post not found" };

    return {
        title: `${post.title} | Vinteum (preview)`,
        description: post.meta_description ?? post.custom_excerpt ?? post.excerpt,
        robots: { index: false, follow: false },
    };
}

export default async function BlogPostPreviewPage({ params }: PageProps) {
    const { uuid } = await params;
    const post = await getPostByUuidAdmin(uuid);

    if (!post) notFound();

    // Drafts have no published_at yet — fall back so the hero doesn't show
    // an epoch date (Jan 1, 1970).
    if (!post.published_at) {
        post.published_at = post.updated_at ?? post.created_at;
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vinteum.org";
    const postUrl = `${siteUrl}/blog/${post.slug}`;

    const relatedPosts = await getRelatedPosts(
        post.tags.map((t) => t.slug),
        post.slug
    );

    return (
        <div className="flex flex-col">
            <div className="w-full bg-primary/10 border-b border-primary/20 py-2 text-center font-space-mono text-xs text-primary">
                Preview — this post is not published yet
            </div>

            <BlogPostHero post={post} />

            <div className="w-full py-14 md:py-20">
                <div className="max-w-4xl mx-auto px-8 md:px-14 lg:px-20 flex flex-col gap-12">
                    <BlogPostContent html={post.html} />

                    {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-4 border-t border-primary/15">
                            {post.tags.map((tag) => (
                                <span
                                    key={tag.id}
                                    className="inline-flex items-center px-3 py-1 rounded-full bg-badge-bg border border-primary/20 font-space-mono text-xs text-primary"
                                >
                                    #{tag.name}
                                </span>
                            ))}
                        </div>
                    )}

                    <BlogShareButtons title={post.title} url={postUrl} />

                    <div className="pt-2">
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 font-space-mono text-sm text-foreground/50 hover:text-primary transition-colors"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            Back to blog
                        </Link>
                    </div>
                </div>
            </div>

            <BlogRelatedPosts posts={relatedPosts} />
        </div>
    );
}
