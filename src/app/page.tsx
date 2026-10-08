import { getAllProjects } from "@/lib/projects";
import { getGithubData } from "@/lib/github";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/ui/Marquee";
import { WhatItIs } from "@/components/sections/WhatItIs";
import { TwinPanels } from "@/components/sections/TwinPanels";
import { WorkShowroom } from "@/components/sections/WorkShowroom";
import { Armory } from "@/components/sections/Armory";
import { GithubBlock } from "@/components/sections/GithubBlock";
import { Path } from "@/components/sections/Path";
import { Status } from "@/components/sections/Status";
import { AboutTeaser } from "@/components/sections/AboutTeaser";
import { Faq } from "@/components/sections/Faq";
import { ContactCta } from "@/components/sections/ContactCta";

export const revalidate = 3600; // ISR 1 hour

export default async function HomePage() {
  const [projects, githubData] = await Promise.all([
    getAllProjects(),
    getGithubData(),
  ]);

  const heroStats = {
    repos: githubData.user.public_repos,
    stars: githubData.user.totalStars,
    projects: projects.filter((p) => p.status !== "placeholder").length || 6,
    commits: githubData.user.totalCommits,
  };

  return (
    <main className="w-full min-h-screen bg-bg text-bone overflow-hidden">
      {/* 6.A Hero: ΦΑΚΕΛΟΣ */}
      <Hero stats={heroStats} />

      {/* Marquee Strip below Hero */}
      <Marquee />

      {/* 6.B What It Is: ΕΓΩ */}
      <WhatItIs />

      {/* 6.C Twin Panels: ΙΣΧΥΣ & ΤΕΧΝΗ */}
      <TwinPanels />

      {/* 6.D Work Showroom: ΕΡΓΑ */}
      <WorkShowroom projects={projects} />

      {/* 6.E Armory: ΟΠΛΟΘΗΚΗ */}
      <Armory />

      {/* 6.F GitHub Live: ΚΩΔΙΚΑΣ */}
      <GithubBlock data={githubData} />

      {/* 6.G Path Timeline: ΠΟΡΕΙΑ */}
      <Path />

      {/* 6.H Honest Status: ΚΑΤΑΣΤΑΣΗ */}
      <Status />

      {/* 6.I About Teaser with Forge Art */}
      <AboutTeaser />

      {/* 6.J Questions: ΕΡΩΤΗΣΕΙΣ */}
      <Faq />

      {/* 6.K Contact Transmission CTA */}
      <ContactCta />
    </main>
  );
}
