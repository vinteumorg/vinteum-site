"use client";

import { useLanguage } from "@/contexts/LanguageContext";

interface BlogCategoryFilterProps {
    categories: string[];
    active: string | null;
    onChange: (category: string | null) => void;
}

export function BlogCategoryFilter({ categories, active, onChange }: BlogCategoryFilterProps) {
    const { t } = useLanguage();

    const all = [null, ...categories];

    return (
        <div
            role="group"
            aria-label="Filter by category"
            className="flex items-center gap-2 flex-wrap"
        >
            {all.map((cat) => {
                const isActive = active === cat;
                return (
                    <button
                        key={cat ?? "__all__"}
                        type="button"
                        onClick={() => onChange(cat)}
                        className={`inline-flex items-center px-4 py-1.5 rounded-full font-poppins text-sm transition-all duration-200 cursor-pointer border ${isActive
                                ? "bg-primary text-[#172719] border-primary font-medium"
                                : "bg-transparent text-foreground/60 border-primary/20 hover:border-primary/60 hover:text-foreground"
                            }`}
                    >
                        {cat ?? t("blog.allCategories")}
                    </button>
                );
            })}
        </div>
    );
}
