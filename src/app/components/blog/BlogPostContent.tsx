import { BlogPostInteractivePatch } from "./BlogPostInteractivePatch";

interface BlogPostContentProps {
    html: string;
}

export function BlogPostContent({ html }: BlogPostContentProps) {
    return (
        <>
            <article
                className="w-full max-w-2xl mx-auto ghost-content"
                dangerouslySetInnerHTML={{ __html: html }}
                aria-label="Post content"
            />
            <BlogPostInteractivePatch />
        </>
    );
}
