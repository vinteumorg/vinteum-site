import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getRelatedPosts, getPosts } from "@/lib/ghost";
import { BlogPostHero } from "../../components/blog/BlogPostHero";
import { BlogPostContent } from "../../components/blog/BlogPostContent";
import { BlogShareButtons } from "../../components/blog/BlogShareButtons";
import { BlogRelatedPosts } from "../../components/blog/BlogRelatedPosts";

export const revalidate = 60;

type PageProps = {
    params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
    try {
        const data = await getPosts({ limit: "all" });
        return data.posts.map((post) => ({ slug: post.slug }));
    } catch {
        return [];
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) return { title: "Post not found" };

    const title = post.meta_title ?? post.title;
    const description = post.meta_description ?? post.custom_excerpt ?? post.excerpt;
    const image = post.og_image ?? post.feature_image;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vinteum.org";
    const postUrl = `${siteUrl}/blog/${slug}`;

    return {
        title: `${title} | Vinteum`,
        description,
        alternates: { canonical: post.canonical_url ?? postUrl },
        openGraph: {
            type: "article",
            title: post.og_title ?? title,
            description: post.og_description ?? description,
            url: postUrl,
            publishedTime: post.published_at,
            modifiedTime: post.updated_at,
            authors: [post.primary_author?.name ?? post.authors?.[0]?.name ?? "Vinteum"],
            tags: post.tags.map((t) => t.name),
            ...(image && { images: [{ url: image }] }),
        },
        twitter: {
            card: "summary_large_image",
            title: post.og_title ?? title,
            description: post.og_description ?? description,
            ...(image && { images: [image] }),
        },
    };
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) notFound();

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vinteum.org";
    const postUrl = `${siteUrl}/blog/${slug}`;

    const relatedPosts = await getRelatedPosts(
        post.tags.map((t) => t.slug),
        slug
    );

    return (
        <div className="flex flex-col">
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
