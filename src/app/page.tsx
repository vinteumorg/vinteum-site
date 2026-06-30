import { HeroSection } from "./components/home/HeroSection";
import { CommunitySection } from "./components/home/CommunitySection";
import { ProgramsSection } from "./components/home/ProgramsSection";
import { UpdatesSection } from "./components/home/UpdatesSection";
import { getPosts } from "@/lib/ghost";

export const revalidate = 60;

export default async function Home() {
  const { posts } = await getPosts({ limit: 12 }).catch(() => ({ posts: [] }));

  return (
    <div className="flex flex-col">
      <HeroSection />
      <ProgramsSection />
      <CommunitySection />
      <UpdatesSection posts={posts} />
    </div>
  );
}
