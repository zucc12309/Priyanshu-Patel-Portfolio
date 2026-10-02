import { Nav } from "@/components/site/nav";
import { HeroStage } from "@/components/site/hero-stage";
import { Work } from "@/components/site/work";
import { Projects } from "@/components/site/projects";
import { Contact } from "@/components/site/contact";
import { RevealObserver } from "@/components/site/reveal-observer";

export default function Page() {
  return (
    <>
      <a href="#projects" className="sr-only z-[80] rounded-full bg-ink px-4 py-2 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to projects
      </a>
      <Nav />
      <main id="top">
        <HeroStage />
        <Work />
        <Projects />
        <Contact />
      </main>
      <RevealObserver />
    </>
  );
}
