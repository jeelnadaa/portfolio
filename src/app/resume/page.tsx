import { getAllProjects } from "@/lib/projects";
import { ResumeView, type ResumeProject } from "./ResumeView";

export default async function ResumePage() {
  const all = await getAllProjects();
  const projects: ResumeProject[] = all
    .filter((p) => p.resume_blurb)
    .map((p) => ({ slug: p.slug, title: p.title, year: p.year, blurb: p.resume_blurb! }));

  return <ResumeView projects={projects} />;
}
