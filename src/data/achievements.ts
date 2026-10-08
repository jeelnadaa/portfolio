export interface Achievement {
  title: string;
  year: string;
  organization: string;
  description: string;
}

export const achievements: Achievement[] = [
  {
    title: "State-Wide Academic Excellence (Top 1,700)",
    year: "2023",
    organization: "Gujarat HSC Examinations",
    description: "Ranked among the top 1,700 students state-wide in the Gujarat Higher Secondary Certificate examinations.",
  },
  {
    title: "2nd Place — DSA Treasure Hunt Competition",
    year: "2024",
    organization: "PES University",
    description: "Secured second place in a team-based treasure hunt, solving algorithmic DSA challenges under time pressure to unlock checkpoint clues.",
  },
  {
    title: "Technical Mentorship & Hackathon Organization",
    year: "2025",
    organization: "Nexus AWS Club",
    description: "Organized collegiate hackathons, evaluated participant submissions for architectural soundness, and conducted technical debugging workshops for junior peers.",
  },
];
