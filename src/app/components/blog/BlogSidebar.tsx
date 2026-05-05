"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatDate } from "../../../lib/blog";
import type { BlogPost } from "../../../lib/blog";

interface BlogSidebarProps {
    categories: string[];
    activeCategory: string | null;
    onCategoryChange: (cat: string | null) => void;
    recentPosts: BlogPost[];
}

export function BlogSidebar({
    categories,
    activeCategory,
    onCategoryChange,
    recentPosts,
}: BlogSidebarProps) {
    const { t, locale } = useLanguage();

    return (
        <aside className="flex flex-col gap-6 w-full">
            {/* Categories */}
            <div className="rounded-2xl border border-primary/20 bg-[rgba(49,66,45,0.12)] backdrop-blur-sm p-5">
                <h3 className="font-rethink-sans text-base font-normal text-foreground mb-4">
                    {t("blog.sidebar.categories")}
                </h3>
                <ul className="flex flex-col gap-1">
                    {[null, ...categories].map((cat) => {
                        const isActive = activeCategory === cat;
                        return (
                            <li key={cat ?? "__all__"}>
                                <button
                                    type="button"
                                    onClick={() => onCategoryChange(cat)}
                                    className={`w-full text-left px-3 py-2 rounded-lg font-poppins text-sm transition-colors cursor-pointer ${isActive
                                            ? "bg-primary/15 text-primary"
                                            : "text-foreground/60 hover:text-foreground hover:bg-primary/5"
                                        }`}
                                >
                                    {cat ?? t("blog.allCategories")}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Recent Posts */}
            <div className="rounded-2xl border border-primary/20 bg-[rgba(49,66,45,0.12)] backdrop-blur-sm p-5">
                <h3 className="font-rethink-sans text-base font-normal text-foreground mb-4">
                    {t("blog.sidebar.recentPosts")}
                </h3>
                <ul className="flex flex-col gap-4">
                    {recentPosts.map((post) => (
                        <li key={post.slug}>
                            <Link
                                href={`/blog/${post.slug}`}
                                className="flex items-start gap-3 group"
                            >
                                <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
                                    <Image
                                        src={post.coverImage}
                                        alt={post.title}
                                        fill
                                        loading="lazy"
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="flex flex-col gap-1 min-w-0">
                                    <span className="font-poppins text-xs text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                                        {post.title}
                                    </span>
                                    <span className="font-space-mono text-xs text-foreground/40">
                                        {formatDate(post.date, locale === "BR" ? "pt" : "en")}
                                    </span>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}
