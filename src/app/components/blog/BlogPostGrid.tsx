"use client";

import { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { BlogPostCard } from "./BlogPostCard";
import { BlogCategoryFilter } from "./BlogCategoryFilter";
import { BlogPagination } from "./BlogPagination";
import { BlogSidebar } from "./BlogSidebar";
import { filterPosts, getPaginatedPosts } from "@/lib/blog";
import type { GhostPost } from "@/lib/ghost";

const PER_PAGE = 6;

interface BlogPostGridProps {
    posts: GhostPost[];
    featuredPost: GhostPost | null;
    search: string;
}

export function BlogPostGrid({ posts, featuredPost, search }: BlogPostGridProps) {
    const { t } = useLanguage();

    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const categories = useMemo(
        () =>
            [...new Set(posts.flatMap((p) => p.tags.filter((t) => t.visibility === "public").map((t) => t.name)))].sort(),
        [posts]
    );

    const recentPosts = useMemo(() => posts.slice(0, 4), [posts]);

    const filteredPosts = useMemo(
        () => filterPosts(posts, activeCategory, search),
        [posts, activeCategory, search]
    );

    const { posts: pagePosts, totalPages } = useMemo(
        () => getPaginatedPosts(filteredPosts, currentPage, PER_PAGE),
        [filteredPosts, currentPage]
    );

    const showFeatured = !search && !activeCategory && featuredPost;

    const handleCategoryChange = (cat: string | null) => {
        setActiveCategory(cat);
        setCurrentPage(1);
    };

    return (
        <section className="w-full py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-8 md:px-14 lg:px-20">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10">
                    <BlogCategoryFilter
                        categories={categories}
                        active={activeCategory}
                        onChange={handleCategoryChange}
                    />
                </div>

                <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 lg:items-start">
                    <div className="flex-1 min-w-0">
                        {showFeatured && (
                            <div className="mb-6">
                                <BlogPostCard post={featuredPost!} featured />
                            </div>
                        )}

                        {pagePosts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                                {pagePosts
                                    .filter((p) => p.slug !== featuredPost?.slug)
                                    .map((post) => (
                                        <BlogPostCard key={post.slug} post={post} />
                                    ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                                <span className="font-poppins text-foreground/50 text-base">
                                    {t("blog.empty")}
                                </span>
                            </div>
                        )}

                        <BlogPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(page) => {
                                setCurrentPage(page);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                        />
                    </div>

                    <aside className="hidden lg:block w-72 shrink-0">
                        <BlogSidebar
                            categories={categories}
                            activeCategory={activeCategory}
                            onCategoryChange={handleCategoryChange}
                            recentPosts={recentPosts}
                        />
                    </aside>
                </div>
            </div>
        </section>
    );
}
