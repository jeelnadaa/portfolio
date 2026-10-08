export interface ArmorySkill {
  name: string;
  description: string;
  usedInSlug?: string;
  usedInName?: string;
}

export interface ArmoryGroup {
  id: string;
  badge: string; // Greek numeral Α, Β, Γ, Δ, Ε, Ζ
  title: string;
  pathKey: string;
  skills: ArmorySkill[];
}

export const armoryGroups: ArmoryGroup[] = [
  {
    id: "languages",
    badge: "Α",
    title: "Languages",
    pathKey: "system/skills/languages",
    skills: [
      { name: "TypeScript", description: "Strict static typing for scalable web apps", usedInSlug: "project-alpha", usedInName: "Project Alpha" },
      { name: "Python", description: "Data manipulation, PyTorch scripts, and backend automation", usedInSlug: "project-beta", usedInName: "Project Beta" },
      { name: "C / C++", description: "Systems programming, memory management, and coursework algos" },
      { name: "JavaScript (ESNext)", description: "Core browser APIs, WebGL bindings, and DOM runtime" },
      { name: "SQL", description: "Relational queries, index profiling, and schema migrations" },
      { name: "HTML / CSS3", description: "Semantic markup, modern layout models, and CSS custom properties" },
    ],
  },
  {
    id: "web",
    badge: "Β",
    title: "Web & Frontend",
    pathKey: "system/skills/web",
    skills: [
      { name: "Next.js (App Router)", description: "Server components, ISR, streaming routes, and edge runtime", usedInSlug: "project-alpha", usedInName: "Project Alpha" },
      { name: "React 18+", description: "Component state architecture, hooks, and suspense boundaries", usedInSlug: "project-gamma", usedInName: "Project Gamma" },
      { name: "Tailwind CSS", description: "Utility-first design tokens and responsive layout systems" },
      { name: "GSAP & ScrollTrigger", description: "High-performance timeline choreography and scroll scrub" },
      { name: "Three.js / WebGL", description: "Custom GLSL shaders, orthographic meshes, and Bayer dither" },
      { name: "Lenis", description: "Smooth virtual scroll normalized with GSAP ticker" },
    ],
  },
  {
    id: "backend",
    badge: "Γ",
    title: "Backend & Databases",
    pathKey: "system/skills/backend",
    skills: [
      { name: "Node.js / Express", description: "RESTful services, streaming responses, and middleware pipelines" },
      { name: "PostgreSQL", description: "ACID transactions, relational modeling, and connection pooling", usedInSlug: "project-delta", usedInName: "Project Delta" },
      { name: "Redis", description: "In-memory caching, pub/sub channels, and rate limiting" },
      { name: "Prisma / Drizzle", description: "Type-safe database access and automated migrations" },
      { name: "FastAPI", description: "Asynchronous Python REST APIs with automatic OpenAPI specs", usedInSlug: "project-beta", usedInName: "Project Beta" },
    ],
  },
  {
    id: "aiml",
    badge: "Δ",
    title: "AI & Machine Learning",
    pathKey: "system/skills/ai-ml",
    skills: [
      { name: "PyTorch", description: "Neural network architectures and tensor computation graphs", usedInSlug: "project-beta", usedInName: "Project Beta" },
      { name: "NumPy & Pandas", description: "Vectorized mathematics and large tabular dataset analysis" },
      { name: "Scikit-Learn", description: "Classical regression, clustering, and decision trees" },
      { name: "Hugging Face Transformers", description: "Tokenization, fine-tuning, and embedding extraction" },
    ],
  },
  {
    id: "tools",
    badge: "Ε",
    title: "Tools & DevOps",
    pathKey: "system/skills/tools-devops",
    skills: [
      { name: "Git & GitHub", description: "Branching strategies, bisect debugging, and CI/CD actions" },
      { name: "Docker", description: "Containerized reproducible build and development environments", usedInSlug: "project-epsilon", usedInName: "Project Epsilon" },
      { name: "Linux / Bash", description: "Shell scripting, process management, and POSIX tooling" },
      { name: "Vercel / Cloudflare", description: "Edge DNS, edge middleware, and serverless deployment" },
      { name: "Postman", description: "API testing suites and collection automation" },
    ],
  },
  {
    id: "cs",
    badge: "Ζ",
    title: "CS Fundamentals",
    pathKey: "system/skills/fundamentals",
    skills: [
      { name: "Data Structures & Algos", description: "Trees, graphs, dynamic programming, and asymptotic bounds" },
      { name: "Computer Architecture", description: "Instruction sets, memory hierarchies, and cache coherence" },
      { name: "Operating Systems", description: "Processes, threads, virtualization, and file systems" },
      { name: "Database Systems", description: "Indexing internals, isolation levels, and concurrency control" },
      { name: "Computer Networks", description: "TCP/IP, HTTP/2 & 3, sockets, and congestion avoidance" },
    ],
  },
];

export const armoryStats = {
  languagesCount: 6,
  frameworksCount: 11,
  shippedProjectsCount: 4, // Excludes placeholder projects per prompt rules
};
