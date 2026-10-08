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
    role: "Distributed Systems & Mobile Engineer",
    organization: "Independent Open Source",
    location: "Bengaluru, IN",
    period: "2026 — Present",
    description:
      "Engineered a pure Java distributed message broker (Kafka clone) with raw TCP wire framing and append-only commit logs. Shipped Quacky, a 100% offline local-first Android utility suite.",
    badge: "CURRENT",
    skills: ["Java", "TCP Sockets", "Java NIO", "Kotlin", "Android Jetpack"],
  },
  {
    year: "2025",
    role: "Core Member – Web Development",
    organization: "Nexus AWS Club",
    location: "Bengaluru, India",
    period: "2025 – Present",
    description:
      "Maintained the club website and built event registration workflows. Assisted in organizing hackathons, reviewing participant project submissions for technical soundness, and mentoring junior members in web development and cloud tools.",
    badge: "LEADERSHIP",
    skills: ["Web Development", "Event Systems", "AWS", "Mentorship", "Hackathons"],
  },
  {
    year: "2025",
    role: "Multimodal AI & Agronomy Architect",
    organization: "PlantIQ (Academic Project)",
    location: "Bengaluru, IN",
    period: "2025 — 2026",
    description:
      "Architected precision coffee agronomy advisory platform: fine-tuned ResNet-50 CNN to 96.4% Top-1 accuracy at ~65ms CPU inference, engineered 3-stage Hybrid RAG eliminating dosage hallucinations, and shipped Kannada vernacular routing.",
    badge: "SYSTEMS",
    skills: ["PyTorch", "Hybrid RAG", "FastAPI", "Computer Vision", "Capacitor 7"],
  },
  {
    year: "2024",
    role: "Competitive DSA & Hackathon Contender",
    organization: "Collegiate Competitions",
    location: "Bengaluru, IN",
    period: "2024",
    description:
      "Secured 2nd place in collegiate treasure hunt solving complex Data Structures and Algorithms problems under checkpoint time constraints. Engineered Moody Foody conversational AI ordering backend using FastAPI and MySQL.",
    badge: "AWARD",
    skills: ["Data Structures", "Algorithms", "Python", "Dialogflow", "MySQL 8"],
  },
  {
    year: "2023",
    role: "B.Tech in Computer Science and Engineering",
    organization: "PES University",
    location: "Bengaluru, India",
    period: "Aug. 2023 – Present",
    description:
      "Bachelor of Technology in Computer Science (CGPA: 8.43 / 10.0). Coursework in Data Structures & Algorithms, Object-Oriented Programming, Web Technologies, Database Management Systems, and Distributed Systems. Ranked among top 1,700 students state-wide in Gujarat HSC.",
    badge: "EDUCATION",
    skills: ["Data Structures", "OOP", "DBMS", "Distributed Systems", "C"],
  },
];
