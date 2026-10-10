import { getAllProjects } from "@/lib/projects";
import { WorkArchive } from "@/components/project/WorkArchive";

export const revalidate = 86400; // ISR 24 hours

export default async function WorkPage() {
  const projects = await getAllProjects();

  return <WorkArchive projects={projects} />;
}
