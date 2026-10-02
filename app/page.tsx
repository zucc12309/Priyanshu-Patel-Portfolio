import { Nav } from "@/components/site/nav";
import { HeroStage } from "@/components/site/hero-stage";
import { Work } from "@/components/site/work";
import { Projects } from "@/components/site/projects";
import { Skills } from "@/components/site/skills";
import { Assistant } from "@/components/site/assistant";
import { Contact } from "@/components/site/contact";
import { RevealObserver } from "@/components/site/reveal-observer";

export default function Page() {
  return (
    <>
      <a href="#work" className="sr-only z-[80] rounded-full bg-ink px-4 py-2 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <Nav />
      <main id="top" className="grain">
        <HeroStage />
        <Work />
        <Projects />
        <Skills />
        <Assistant />
        <Contact />
      </main>
      <RevealObserver />
    </>
  );
}
