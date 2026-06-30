import { BlogPageClient } from "../components/blog/BlogPageClient";
import { getPosts, getFeaturedPost } from "@/lib/ghost";

export const revalidate = 60;

export default async function BlogPage() {
    const [postsData, featuredPost] = await Promise.all([
        getPosts({ limit: "all" }),
        getFeaturedPost(),
    ]);

    return (
        <div className="flex flex-col">
            <BlogPageClient posts={postsData.posts} featuredPost={featuredPost} />
        </div>
    );
}
