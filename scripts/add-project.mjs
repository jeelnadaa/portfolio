import fs from "node:fs/promises";
import path from "node:path";
import prompts from "prompts";
import matter from "gray-matter";
import sharp from "sharp";
import { z } from "zod";

const ProjectFrontmatterSchema = z.object({
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
  metrics: z.array(z.object({ label: z.string(), value: z.string(), suffix: z.string().optional() })).default([]),
  featured: z.boolean().default(false),
  glyph: z.string(),
});

const PROJECTS_DIR = path.resolve(process.cwd(), "src/content/projects");
const GREEK_NUMERALS = ["Α", "Β", "Γ", "Δ", "Ε", "Ζ", "Η", "Θ", "Ι"];

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

async function getExistingProjects() {
  const files = await fs.readdir(PROJECTS_DIR);
  const projects = [];
  for (const f of files) {
    if (f.endsWith(".mdx") || f.endsWith(".md")) {
      const content = await fs.readFile(path.join(PROJECTS_DIR, f), "utf8");
      const { data } = matter(content);
      projects.push({ filename: f, ...data });
    }
  }
  return projects.sort((a, b) => a.order - b.order);
}

async function main() {
  const args = process.argv.slice(2);
  let projectData = {};

  if (args.includes("--help") || args.includes("-h")) {
    console.log(`Usage: node scripts/add-project.mjs [options]
Options:
  --json <file-or-string>   Pass project details as a JSON file path or inline JSON string
  --help, -h               Show this help message`);
    process.exit(0);
  }

  const jsonIndex = args.indexOf("--json");
  if (jsonIndex !== -1 && args[jsonIndex + 1]) {
    const rawArg = args[jsonIndex + 1];
    if (rawArg.trim().startsWith("{")) {
      projectData = JSON.parse(rawArg);
    } else {
      const jsonPath = path.resolve(process.cwd(), rawArg);
      const rawJson = await fs.readFile(jsonPath, "utf8");
      projectData = JSON.parse(rawJson);
    }
  } else {
    // Interactive prompt
    const response = await prompts([
      {
        type: "text",
        name: "title",
        message: "Project Title:",
        validate: (v) => (v.length > 0 ? true : "Title cannot be empty"),
      },
      {
        type: "text",
        name: "tagline",
        message: "One-line Tagline:",
        validate: (v) => (v.length > 0 ? true : "Tagline cannot be empty"),
      },
      {
        type: "text",
        name: "summary",
        message: "Summary (What it is in 1-2 sentences):",
        validate: (v) => (v.length > 0 ? true : "Summary cannot be empty"),
      },
      {
        type: "text",
        name: "role",
        message: "Your Role (e.g. Lead Developer):",
        initial: "Developer",
      },
      {
        type: "text",
        name: "year",
        message: "Year:",
        initial: new Date().getFullYear().toString(),
      },
      {
        type: "text",
        name: "duration",
        message: "Duration (e.g. 3 weeks):",
        initial: "2 weeks",
      },
      {
        type: "select",
        name: "status",
        message: "Project Status:",
        choices: [
          { title: "Live", value: "live" },
          { title: "Building", value: "building" },
          { title: "Archived", value: "archived" },
        ],
        initial: 0,
      },
      {
        type: "text",
        name: "stack",
        message: "Stack (comma separated):",
        initial: "TypeScript, Next.js, Tailwind",
      },
      {
        type: "text",
        name: "tags",
        message: "Tags (comma separated):",
        initial: "Web, Systems",
      },
      {
        type: "text",
        name: "github",
        message: "GitHub URL (optional):",
      },
      {
        type: "text",
        name: "live",
        message: "Live URL (optional):",
      },
      {
        type: "text",
        name: "demo_video",
        message: "Demo Video URL (optional):",
      },
      {
        type: "confirm",
        name: "featured",
        message: "Feature this project on home showroom?",
        initial: true,
      },
      {
        type: "text",
        name: "cover",
        message: "Cover Image File Path (optional):",
      },
    ]);

    if (!response.title) {
      console.log("Cancelled.");
      return;
    }
    projectData = response;
  }

  // Normalize fields
  const slug = projectData.slug || slugify(projectData.title);
  const stack = Array.isArray(projectData.stack)
    ? projectData.stack
    : (projectData.stack || "").split(",").map((s) => s.trim()).filter(Boolean);
  const tags = Array.isArray(projectData.tags)
    ? projectData.tags
    : (projectData.tags || "").split(",").map((s) => s.trim()).filter(Boolean);

  const existing = await getExistingProjects();

  // Find oldest placeholder if any exist
  const placeholders = existing.filter((p) => p.status === "placeholder");
  let replacedOrder = existing.length + 1;
  let assignedGlyph = GREEK_NUMERALS[(existing.length) % GREEK_NUMERALS.length];

  if (placeholders.length > 0) {
    const oldest = placeholders[0];
    let confirmReplace = true;
    if (jsonIndex === -1) {
      const confirmResp = await prompts({
        type: "confirm",
        name: "ok",
        message: `Replace oldest placeholder project "${oldest.title}" (order ${oldest.order})?`,
        initial: true,
      });
      confirmReplace = confirmResp.ok;
    }

    if (confirmReplace) {
      replacedOrder = oldest.order;
      assignedGlyph = oldest.glyph || assignedGlyph;
      // Delete old placeholder file
      await fs.unlink(path.join(PROJECTS_DIR, oldest.filename));
      console.log(`✓ Removed placeholder ${oldest.filename}`);
    }
  }

  // Cover image handling if supplied
  let coverRelPath = null;
  if (projectData.cover) {
    try {
      const coverOutDir = path.resolve(process.cwd(), `public/projects/${slug}`);
      await fs.mkdir(coverOutDir, { recursive: true });
      const coverDest = path.join(coverOutDir, "cover.webp");
      await sharp(projectData.cover).webp({ quality: 90 }).toFile(coverDest);
      coverRelPath = `/projects/${slug}/cover.webp`;
      console.log(`✓ Processed and saved cover to ${coverRelPath}`);
    } catch (err) {
      console.warn("Could not process cover image:", err.message);
    }
  }

  const frontmatter = {
    title: projectData.title,
    slug,
    order: replacedOrder,
    year: projectData.year || new Date().getFullYear().toString(),
    role: projectData.role || "Developer",
    duration: projectData.duration || "2 weeks",
    status: projectData.status || "live",
    summary: projectData.summary || "",
    tagline: projectData.tagline || "",
    stack,
    tags,
    github: projectData.github || null,
    live: projectData.live || null,
    demo_video: projectData.demo_video || null,
    cover: coverRelPath,
    gallery: projectData.gallery || [],
    metrics: projectData.metrics || [],
    featured: Boolean(projectData.featured),
    glyph: assignedGlyph,
  };

  const bodyContent = `
## 01 // PROBLEM
${projectData.problemStatement || "The core technical challenge and latency constraints."}

## 02 // APPROACH
${projectData.approach || "Architecture strategy, tradeoffs evaluated, and technical design."}

## 03 // BUILD
${projectData.build || "Implementation details and system components."}

## 04 // LEARNED
${projectData.learned || "What broke, performance discoveries, and post-launch observations."}
`;

  const mdxFileContent = matter.stringify(bodyContent.trim(), frontmatter);
  const targetFile = path.join(PROJECTS_DIR, `${slug}.mdx`);
  await fs.writeFile(targetFile, mdxFileContent, "utf8");

  console.log(`\n✓ Successfully created new project dossier:`);
  console.log(`  File: src/content/projects/${slug}.mdx`);
  console.log(`  URL: /work/${slug}`);
  console.log(`  Order: ${replacedOrder} | Glyph: ${assignedGlyph}`);
}

main().catch((err) => {
  console.error("Error adding project:", err);
  process.exit(1);
});
