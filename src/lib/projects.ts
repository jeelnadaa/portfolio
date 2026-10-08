import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { type Project, ProjectFrontmatterSchema } from "./schema";

const PROJECTS_DIR = path.resolve(process.cwd(), "src/content/projects");

export async function getAllProjects(): Promise<Project[]> {
  try {
    const files = await fs.readdir(PROJECTS_DIR);
    const mdxFiles = files.filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

    const projects: Project[] = [];

    for (const filename of mdxFiles) {
      const filePath = path.join(PROJECTS_DIR, filename);
      const rawContent = await fs.readFile(filePath, "utf8");
      const { data, content } = matter(rawContent);

      const parsed = ProjectFrontmatterSchema.safeParse(data);
      if (!parsed.success) {
        console.warn(`Validation warning for project ${filename}:`, parsed.error.format());
        continue;
      }

      projects.push({
        ...parsed.data,
        content,
      });
    }

    // Sort by order ascending
    return projects.sort((a, b) => a.order - b.order);
  } catch (err) {
    console.error("Error reading projects directory:", err);
    return [];
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const all = await getAllProjects();
  return all.filter((p) => p.featured).slice(0, 6);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const all = await getAllProjects();
  return all.find((p) => p.slug === slug) || null;
}

export async function getNextProject(currentSlug: string): Promise<Project | null> {
  const all = await getAllProjects();
  if (all.length === 0) return null;
  const currentIndex = all.findIndex((p) => p.slug === currentSlug);
  if (currentIndex === -1) return all[0];
  const nextIndex = (currentIndex + 1) % all.length;
  return all[nextIndex];
}
