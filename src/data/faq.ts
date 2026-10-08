export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    id: "looking-for",
    question: "What opportunities are you looking for?",
    answer:
      "I am seeking Summer 2027 software engineering internships focused on distributed systems, backend infrastructure, concurrency, and high-performance API engineering. I want to contribute to production environments where low latency, reliable data persistence, and architectural rigor matter.",
  },
  {
    id: "tech-stack",
    question: "What technical stack and languages do you specialize in?",
    answer:
      "My core languages are Java (Core, Concurrency, TCP Sockets), Python (FastAPI, PyTorch), C, and SQL. In backend systems, I specialize in multi-threading, append-only commit logs, binary wire protocols, and event-driven architecture. For databases, I work with MySQL 8 (query optimization, ACID transactions) and SQLite. For AI/ML, I build with PyTorch (fine-tuned ResNet-50), 3-stage Hybrid RAG (BM25 + dense + Cross-Encoder reranking), and Conversational AI (Dialogflow/LLMs). For frontend & mobile, I use Next.js, WebGL shaders, Kotlin, and Capacitor 7.",
  },
  {
    id: "featured-systems",
    question: "What real production systems have you engineered?",
    answer:
      "I have built five standalone systems: (1) A pure Java Distributed Message Broker (Kafka clone) with raw TCP wire framing, append-only commit logs, and O(log N) binary offset indexing; (2) PlantIQ, a multimodal coffee agronomy platform with a fine-tuned ResNet-50 CNN (96.4% Top-1 accuracy at ~65ms CPU inference), 3-stage Hybrid RAG, and Kannada/Kanglish vernacular pre-routing; (3) Quacky, a 100% offline Android utility suite with 15+ tools and zero network permissions; (4) Moody Foody, an AI food ordering chatbot using FastAPI, Dialogflow, and normalized MySQL 8 with composite indexing; and (5) Solarquack, this Chiaroscuro marble portfolio with custom Three.js depth shaders and 24-hour Next.js ISR.",
  },
  {
    id: "education-coursework",
    question: "What is your academic background and coursework?",
    answer:
      "I am a third-year B.Tech Computer Science student at PES University in Bengaluru (CGPA: 8.43 / 10.0, class of 2027). Relevant coursework includes Data Structures and Algorithms, Object-Oriented Programming, Web Technologies, Database Management Systems, and Distributed Systems. Prior to university, I ranked among the top 1,700 students state-wide in the Gujarat Higher Secondary Certificate (HSC) examinations.",
  },
  {
    id: "extracurriculars-leadership",
    question: "What leadership and community roles do you hold?",
    answer:
      "I am a Core Member – Web Development at Nexus AWS Club in Bengaluru. I maintain the club's web platform, build event registration workflows, coordinate hackathons, review participant submissions for technical soundness, and mentor junior members during technical workshops. I also secured 2nd place in a university-wide team DSA treasure hunt competition.",
  },
  {
    id: "remote-collaboration",
    question: "Are you open to remote collaboration across time zones?",
    answer:
      "Yes. I am based in Bengaluru, India (UTC+5:30). I operate comfortably across distributed time zones through disciplined asynchronous communication, clean Git commit histories, detailed pull requests, and concise technical documentation.",
  },
  {
    id: "contact-response",
    question: "How can someone reach you and how fast do you reply?",
    answer:
      "I typically reply within 24 hours. Reach out directly via email at jeelnadaa@gmail.com, connect on LinkedIn (linkedin.com/in/jeelnada), or call +91 80000 50317.",
  },
];
