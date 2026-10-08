export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    id: "looking-for",
    question: "What are you looking for?",
    answer:
      "Software engineering and creative systems internships where I can write real code that ships to production. I like working on backend infra, performance optimization, and frontends with high-fidelity interaction.",
  },
  {
    id: "tech-stack",
    question: "What do you work with?",
    answer:
      "TypeScript, Next.js, and Node.js for web systems; Python and PyTorch for ML pipelines; C/C++ for low-level systems coursework and data structures. I pick tools based on the constraint, not hype.",
  },
  {
    id: "remote-work",
    question: "Can you work remotely?",
    answer:
      "Yes. I am based in Bengaluru (UTC+5:30) and have worked with distributed teams across European and US time zones. Asynchronous communication with clear written updates is my default.",
  },
  {
    id: "response-time",
    question: "How fast do you reply?",
    answer:
      "Usually within 24 to 48 hours via email (jeelnadaa@gmail.com). If it is urgent, reach out on LinkedIn.",
  },
  {
    id: "current-build",
    question: "What are you building now?",
    answer:
      "Studying operating systems and computer architecture at PES University while writing custom shaders and small systems utilities in my free time.",
  },
];
