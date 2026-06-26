"use client";

import Image from "next/image";
import type { ContentBlock } from "../../../lib/blog";

interface BlogPostContentProps {
    blocks: ContentBlock[];
}

export function BlogPostContent({ blocks }: BlogPostContentProps) {
    return (
        <article
            className="w-full max-w-2xl mx-auto flex flex-col gap-6"
            aria-label="Post content"
        >
            {blocks.map((block, i) => {
                switch (block.type) {
                    case "paragraph":
                        return (
                            <p
                                key={i}
                                className="font-poppins text-base text-foreground/80 leading-[1.8]"
                            >
                                {block.text}
                            </p>
                        );

                    case "heading":
                        if (block.level === 2) {
                            return (
                                <h2
                                    key={i}
                                    className="font-rethink-sans text-2xl md:text-3xl font-normal text-foreground leading-snug mt-4"
                                >
                                    {block.text}
                                </h2>
                            );
                        }
                        return (
                            <h3
                                key={i}
                                className="font-rethink-sans text-xl md:text-2xl font-normal text-foreground leading-snug mt-2"
                            >
                                {block.text}
                            </h3>
                        );

                    case "quote":
                        return (
                            <blockquote
                                key={i}
                                className="relative border-l-2 border-primary pl-6 py-2 my-2"
                            >
                                <p className="font-poppins text-base italic text-foreground/70 leading-relaxed">
                                    &ldquo;{block.text}&rdquo;
                                </p>
                                {block.author && (
                                    <footer className="mt-2 font-space-mono text-xs text-foreground/40">
                                        — {block.author}
                                    </footer>
                                )}
                            </blockquote>
                        );

                    case "image":
                        return (
                            <figure key={i} className="flex flex-col gap-2 my-2">
                                <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-primary/20">
                                    <Image
                                        src={block.src}
                                        alt={block.alt}
                                        fill
                                        loading="lazy"
                                        className="object-cover"
                                    />
                                </div>
                                {block.caption && (
                                    <figcaption className="font-poppins text-xs text-foreground/40 text-center">
                                        {block.caption}
                                    </figcaption>
                                )}
                            </figure>
                        );

                    case "list":
                        return (
                            <ul key={i} className="flex flex-col gap-2 pl-1">
                                {block.items.map((item, j) => (
                                    <li
                                        key={j}
                                        className="font-poppins text-base text-foreground/80 leading-relaxed flex items-start gap-3"
                                    >
                                        <span
                                            className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0"
                                            aria-hidden="true"
                                        />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        );

                    case "divider":
                        return (
                            <hr
                                key={i}
                                className="border-0 border-t border-primary/15 my-2"
                            />
                        );

                    default:
                        return null;
                }
            })}
        </article>
    );
}
