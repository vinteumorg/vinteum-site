"use client";

import Link from "next/link";

type Crumb = { label: string; href?: string };

interface BlogBreadcrumbProps {
    crumbs: Crumb[];
}

export function BlogBreadcrumb({ crumbs }: BlogBreadcrumbProps) {

    return (
        <nav aria-label="breadcrumb" className="w-full max-w-7xl mx-auto px-8 md:px-14 lg:px-20 pt-6 pb-2">
            <ol className="flex items-center flex-wrap gap-1.5 font-space-mono text-xs text-foreground/40">
                <li>
                    <Link href="/" className="hover:text-primary transition-colors">
                        Home
                    </Link>
                </li>
                {crumbs.map((crumb, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                        <span aria-hidden="true">/</span>
                        {crumb.href ? (
                            <Link href={crumb.href} className="hover:text-primary transition-colors">
                                {crumb.label}
                            </Link>
                        ) : (
                            <span className="text-foreground/70" aria-current="page">
                                {crumb.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
