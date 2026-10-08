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
      { name: "Java (Core & Concurrency)", description: "Thread safety, Java NIO FileChannels, ServerSockets, and memory visibility", usedInSlug: "kafka-clone", usedInName: "Kafka Clone" },
      { name: "Python", description: "Asynchronous backend services, PyTorch deep learning, and RAG pipelines", usedInSlug: "plantiq-capstone", usedInName: "PlantIQ" },
      { name: "Kotlin", description: "Coroutines, Clean Architecture, and Android Jetpack utilities", usedInSlug: "quacky", usedInName: "Quacky" },
      { name: "TypeScript / JavaScript", description: "Strict static typing, App Router server components, and WebGL bindings", usedInSlug: "portfolio", usedInName: "Solarquack Portfolio" },
      { name: "C / C++", description: "Low-level memory management, systems programming, and algorithmic problem solving" },
      { name: "SQL", description: "Relational modeling, composite indexing, query plans, and transaction isolation", usedInSlug: "moody-foody", usedInName: "Moody Foody" },
    ],
  },
  {
    id: "concurrency",
    badge: "Β",
    title: "Concurrency & Systems",
    pathKey: "system/skills/systems",
    skills: [
      { name: "Append-Only Commit Logs", description: "Sequential disk writes via Java NIO FileChannel achieving O(1) write performance", usedInSlug: "kafka-clone", usedInName: "Kafka Clone" },
      { name: "TCP Sockets & Wire Protocols", description: "Binary wire framing, length-prefixed protocol design, and socket connection pools", usedInSlug: "kafka-clone", usedInName: "Kafka Clone" },
      { name: "Multi-Threading & Locks", description: "Thread-safe producer-consumer pipelines, atomic watermarks, and rebalance logic", usedInSlug: "kafka-clone", usedInName: "Kafka Clone" },
      { name: "Binary Offset Indexing", description: "Sparse binary index files (.index) enabling O(log N) floor offset lookups", usedInSlug: "kafka-clone", usedInName: "Kafka Clone" },
      { name: "Event-Driven Architecture", description: "Partitioned message routing, offset tracking, and crash recovery mechanics", usedInSlug: "kafka-clone", usedInName: "Kafka Clone" },
    ],
  },
  {
    id: "backend",
    badge: "Γ",
    title: "Backend & Databases",
    pathKey: "system/skills/backend",
    skills: [
      { name: "FastAPI", description: "Asynchronous ASGI endpoints, Pydantic schemas, and OpenAPI generation", usedInSlug: "plantiq-capstone", usedInName: "PlantIQ" },
      { name: "MySQL 8", description: "ACID transactions, foreign key cascading, and composite order indexing", usedInSlug: "moody-foody", usedInName: "Moody Foody" },
      { name: "SQLite & Room", description: "Embedded on-device relational storage with one-tap nuclear wipe capabilities", usedInSlug: "quacky", usedInName: "Quacky" },
      { name: "RESTful API Design", description: "Versioned endpoints (/api/v1/), error propagation, and idempotent handlers", usedInSlug: "moody-foody", usedInName: "Moody Foody" },
      { name: "Asynchronous I/O", description: "Non-blocking event loops, coroutine concurrency, and stream buffering" },
    ],
  },
  {
    id: "aiml",
    badge: "Δ",
    title: "AI, ML & Retrieval",
    pathKey: "system/skills/ai-ml",
    skills: [
      { name: "PyTorch & Computer Vision", description: "Fine-tuning ResNet-50 CNNs with weighted cross-entropy and cosine annealing", usedInSlug: "plantiq-capstone", usedInName: "PlantIQ" },
      { name: "3-Stage Hybrid RAG", description: "BGE dense vectors, BM25Okapi sparse retrieval, and Cross-Encoder reranking", usedInSlug: "plantiq-capstone", usedInName: "PlantIQ" },
      { name: "Dialogflow & Conversational AI", description: "Intent classification, slot extraction, and structured food ordering loops", usedInSlug: "moody-foody", usedInName: "Moody Foody" },
      { name: "Vernacular Pre-Routing", description: "Sub-millisecond language detection for Kannada/Kanglish agricultural queries", usedInSlug: "plantiq-capstone", usedInName: "PlantIQ" },
      { name: "LLM Orchestration", description: "Gemini 2.5 Flash, Groq failover, and strict JSON output schemas", usedInSlug: "plantiq-capstone", usedInName: "PlantIQ" },
    ],
  },
  {
    id: "mobile-web",
    badge: "Ε",
    title: "Mobile, Web & Graphics",
    pathKey: "system/skills/mobile-web",
    skills: [
      { name: "Android Jetpack & CameraX", description: "100% offline local-first tool suite with zero internet permission", usedInSlug: "quacky", usedInName: "Quacky" },
      { name: "Capacitor 7", description: "Cross-platform mobile compilation and native camera bridge", usedInSlug: "plantiq-capstone", usedInName: "PlantIQ" },
      { name: "Next.js 14 (App Router & ISR)", description: "Hybrid static-dynamic rendering with 24-hour revalidation and GraphQL sync", usedInSlug: "portfolio", usedInName: "Solarquack Portfolio" },
      { name: "WebGL & GLSL Shaders", description: "Orthographic depth-parallax, Bayer 8x8 matrix dithering, and torch lighting", usedInSlug: "portfolio", usedInName: "Solarquack Portfolio" },
      { name: "GSAP & Virtual Scroll", description: "High-performance scroll-driven timelines, reticle cursors, and layout choreography", usedInSlug: "portfolio", usedInName: "Solarquack Portfolio" },
    ],
  },
  {
    id: "cs",
    badge: "Ζ",
    title: "CS Fundamentals & Tools",
    pathKey: "system/skills/fundamentals",
    skills: [
      { name: "Data Structures & Algos", description: "Trees, graphs, dynamic programming, asymptotic analysis, and competitive DSA" },
      { name: "Git & GitHub", description: "Interactive rebasing, bisect debugging, GraphQL API integrations, and GitHub Actions" },
      { name: "Object-Oriented Programming", description: "Design patterns, encapsulation, polymorphism, and clean interface boundaries" },
      { name: "Linux & Bash", description: "POSIX process management, shell automation, and system diagnostics" },
      { name: "Distributed Systems Concepts", description: "Log-structured storage, partitioning, watermarks, replication, and consumer offsets" },
    ],
  },
];

export const armoryStats = {
  languagesCount: 6,
  frameworksCount: 14,
  shippedProjectsCount: 5,
};
