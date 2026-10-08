import { z } from "zod";

export const ProjectMetricSchema = z.object({
  label: z.string(),
  value: z.string(),
  suffix: z.string().optional(),
});

export const ProjectArchitectureSchema = z.object({
  nodes: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      type: z.enum(["client", "service", "storage", "worker"]).default("service"),
    })
  ),
  edges: z.array(
    z.object({
      from: z.string(),
      to: z.string(),
      label: z.string().optional(),
    })
  ),
});

export const ProjectStackItemSchema = z.object({
  tool: z.string(),
  reason: z.string(),
});

export const ProjectFrontmatterSchema = z.object({
  title: z.string(),
  slug: z.string(),
  order: z.number().int(),
  year: z.string(),
  role: z.string(),
  duration: z.string(),
  status: z.enum(["live", "building", "archived", "placeholder"]),
  summary: z.string(),
  tagline: z.string(),
  stack: z.array(z.string()),
  tags: z.array(z.string()),
  github: z.string().nullable().optional(),
  live: z.string().nullable().optional(),
  demo_video: z.string().nullable().optional(),
  cover: z.string().nullable().optional(),
  gallery: z.array(z.string()).default([]),
  metrics: z.array(ProjectMetricSchema).default([]),
  featured: z.boolean().default(false),
  glyph: z.string(), // Α-Ω
  stackReasons: z.array(ProjectStackItemSchema).optional().default([]),
  architecture: ProjectArchitectureSchema.optional(),
  problemStatement: z.string().optional(),
  repoStats: z
    .object({
      stars: z.number().default(0),
      forks: z.number().default(0),
      lastCommit: z.string().default("Recently"),
    })
    .optional(),
});

export type ProjectFrontmatter = z.infer<typeof ProjectFrontmatterSchema>;

export interface Project extends ProjectFrontmatter {
  content: string; // Markdown body
}
