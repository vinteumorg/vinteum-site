"use client";

import { useLanguage } from "@/contexts/LanguageContext";

interface BlogPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function BlogPagination({ currentPage, totalPages, onPageChange }: BlogPaginationProps) {
    const { t } = useLanguage();

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2 mt-12" role="navigation" aria-label="Pagination">
            <button
                type="button"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label={t("blog.pagination.prev")}
                className="w-10 h-10 rounded-full border border-border-subtle flex items-center justify-center text-foreground/50 hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-border-subtle disabled:hover:text-foreground/50"
            >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                    key={page}
                    type="button"
                    onClick={() => onPageChange(page)}
                    aria-label={`${t("blog.pagination.page")} ${page}`}
                    aria-current={page === currentPage ? "page" : undefined}
                    className={`w-10 h-10 rounded-full font-space-mono text-sm transition-all ${page === currentPage
                            ? "bg-primary text-[#172719] border border-primary"
                            : "border border-border-subtle text-foreground/50 hover:border-primary hover:text-primary"
                        }`}
                >
                    {page}
                </button>
            ))}

            <button
                type="button"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label={t("blog.pagination.next")}
                className="w-10 h-10 rounded-full border border-primary flex items-center justify-center text-primary hover:bg-primary/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
        </div>
    );
}
