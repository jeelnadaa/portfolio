export interface PathMilestone {
  year: string;
  role: string;
  organization: string;
  location: string;
  period: string;
  description: string;
  badge?: string;
  skills: string[];
}

export const pathMilestones: PathMilestone[] = [
  {
    year: "2026",
    role: "Open Source Contributor & Systems Explorer",
    organization: "Independent",
    location: "Bengaluru, IN",
    period: "2026 — Present",
    description:
      "Experimenting with low-level vector search indexing, custom GLSL graphics pipelines, and reactive client state architectures.",
    badge: "CURRENT",
    skills: ["TypeScript", "C++", "WebGL", "Next.js"],
  },
  {
    year: "2025",
    role: "Full-Stack Development Intern",
    organization: "Tech Startup",
    location: "Bengaluru (Remote)",
    period: "Summer 2025",
    description:
      "Engineered authenticated API routes, optimized SQL query plans, and reduced page load times by 40% on customer-facing dashboards.",
    badge: "INTERNSHIP",
    skills: ["PostgreSQL", "Node.js", "Redis", "React"],
  },
  {
    year: "2024",
    role: "Hackathon Finalist & Core Builder",
    organization: "National Collegiate Hackathon",
    location: "Bengaluru, IN",
    period: "Fall 2024",
    description:
      "Built an offline-first distributed document synchronizer using CRDT concepts over WebSockets within 36 hours. Placed top 5 out of 120 teams.",
    badge: "AWARD",
    skills: ["WebSockets", "TypeScript", "CRDTs", "Python"],
  },
  {
    year: "2023",
    role: "B.Tech Computer Science Engineering",
    organization: "PES University",
    location: "Bengaluru, IN",
    period: "2023 — 2027",
    description:
      "Core coursework in data structures, algorithms, computer systems architecture, and database theory. Maintaining a cumulative 8.43 CGPA.",
    badge: "EDUCATION",
    skills: ["C", "C++", "Data Structures", "Algorithms", "OS"],
  },
];
