export interface Achievement {
  title: string;
  year: string;
  organization: string;
  description: string;
}

export const achievements: Achievement[] = [
  {
    title: "Dean's Honor List Recognition",
    year: "2024",
    organization: "PES University",
    description: "Academic excellence award for maintaining top percentile CGPA in CSE cohort.",
  },
  {
    title: "Hackathon Top 5 Finalist",
    year: "2024",
    organization: "Collegiate DevSprint",
    description: "Built real-time collaborative tool with peer-to-peer state synchronization.",
  },
  {
    title: "Open Source Contributor",
    year: "2025",
    organization: "GitHub Community",
    description: "Authored bug fixes and documentation improvements in developer tooling repositories.",
  },
];
