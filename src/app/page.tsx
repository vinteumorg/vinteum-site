import { HeroSection } from "./components/home/HeroSection";
import { CommunitySection } from "./components/home/CommunitySection";
import { ProgramsSection } from "./components/home/ProgramsSection";
import { UpdatesSection } from "./components/home/UpdatesSection";

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <ProgramsSection />
      <CommunitySection />
      <UpdatesSection />
    </div>
  );
}
