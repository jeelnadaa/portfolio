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
      {
        name: "Java (Core, Concurrency)",
        description: "Core runtime, multi-threading, Java NIO FileChannels, raw ServerSockets, and memory visibility",
        usedInSlug: "kafka-clone",
        usedInName: "Kafka Clone",
      },
      {
        name: "Python",
        description: "Asynchronous backend services, PyTorch deep learning, and hybrid RAG retrieval pipelines",
        usedInSlug: "plantiq-capstone",
        usedInName: "PlantIQ",
      },
      {
        name: "C",
        description: "Low-level memory management, pointers, and systems programming",
      },
      {
        name: "SQL",
        description: "Relational data modeling, composite indexing, query optimization, and ACID transaction isolation",
        usedInSlug: "moody-foody",
        usedInName: "Moody Foody",
      },
      {
        name: "Kotlin",
        description: "Coroutines, Clean Architecture, on-device text parsers, and Android Jetpack utilities",
        usedInSlug: "quacky",
        usedInName: "Quacky",
      },
      {
        name: "TypeScript / JavaScript",
        description: "Strict static typing, Next.js App Router, and custom WebGL Three.js shader bindings",
        usedInSlug: "portfolio",
        usedInName: "Solarquack Portfolio",
      },
    ],
  },
  {
    id: "backend-apis",
    badge: "Β",
    title: "Backend & APIs",
    pathKey: "system/skills/backend-apis",
    skills: [
      {
        name: "RESTful API Design",
        description: "Versioned endpoints (/api/v1/), error propagation, and idempotent request handling",
        usedInSlug: "moody-foody",
        usedInName: "Moody Foody",
      },
      {
        name: "FastAPI",
        description: "High-throughput asynchronous ASGI pipelines, Pydantic schemas, and OpenAPI generation",
        usedInSlug: "plantiq-capstone",
        usedInName: "PlantIQ",
      },
      {
        name: "Flask",
        description: "Lightweight WSGI services, modular blueprint routing, and microservice APIs",
      },
      {
        name: "TCP Sockets",
        description: "Raw ServerSockets, length-prefixed binary wire framing protocol, and connection pools",
        usedInSlug: "kafka-clone",
        usedInName: "Kafka Clone",
      },
      {
        name: "Asynchronous Programming",
        description: "Non-blocking event loops, coroutine concurrency, and stream buffering under high load",
        usedInSlug: "moody-foody",
        usedInName: "Moody Foody",
      },
    ],
  },
  {
    id: "concurrency-systems",
    badge: "Γ",
    title: "Concurrency & Systems",
    pathKey: "system/skills/concurrency-systems",
    skills: [
      {
        name: "Multi-Threading",
        description: "Worker pools, thread contention elimination, and synchronized task execution pipelines",
        usedInSlug: "kafka-clone",
        usedInName: "Kafka Clone",
      },
      {
        name: "Java Concurrency",
        description: "Atomic watermarks, synchronized blocks, and direct ByteBuffer allocation",
        usedInSlug: "kafka-clone",
        usedInName: "Kafka Clone",
      },
      {
        name: "Distributed Systems",
        description: "Append-only commit logs, partitioned message routing, consumer offsets, and crash recovery",
        usedInSlug: "kafka-clone",
        usedInName: "Kafka Clone",
      },
      {
        name: "Event-Driven Architecture",
        description: "Decoupled ingestion paths, write-ahead log flush queues, and offset-based event streaming",
        usedInSlug: "kafka-clone",
        usedInName: "Kafka Clone",
      },
      {
        name: "System Design",
        description: "Tradeoff analysis, latency profiling, high-availability architecture, and storage engine design",
        usedInSlug: "kafka-clone",
        usedInName: "Kafka Clone",
      },
      {
        name: "Design Patterns",
        description: "Producer-Consumer, Factory, Strategy, Observer, and Clean Layered Architecture",
        usedInSlug: "quacky",
        usedInName: "Quacky",
      },
    ],
  },
  {
    id: "databases",
    badge: "Δ",
    title: "Databases",
    pathKey: "system/skills/databases",
    skills: [
      {
        name: "MySQL",
        description: "ACID transactions, foreign key cascading, and atomic multi-table order commits",
        usedInSlug: "moody-foody",
        usedInName: "Moody Foody",
      },
      {
        name: "SQLite",
        description: "Embedded on-device relational storage, Room ORM, and zero-network privacy persistence",
        usedInSlug: "quacky",
        usedInName: "Quacky",
      },
      {
        name: "Query Optimization",
        description: "Composite indices (user_id, created_at DESC), EXPLAIN query plans, and table scan elimination",
        usedInSlug: "moody-foody",
        usedInName: "Moody Foody",
      },
      {
        name: "Relational Data Modeling",
        description: "3NF normalization, foreign key constraints, and relational schema mapping",
        usedInSlug: "moody-foody",
        usedInName: "Moody Foody",
      },
    ],
  },
  {
    id: "ai-ml",
    badge: "Ε",
    title: "AI / ML",
    pathKey: "system/skills/ai-ml",
    skills: [
      {
        name: "PyTorch",
        description: "Deep CNN fine-tuning with weighted cross-entropy and cosine annealing scheduling",
        usedInSlug: "plantiq-capstone",
        usedInName: "PlantIQ",
      },
      {
        name: "TensorFlow",
        description: "Deep learning models, computational graphs, tensor transformations, and training loops",
      },
      {
        name: "LLM Integration",
        description: "3-Stage Hybrid RAG (BGE Dense + BM25Okapi + Cross-Encoder), Gemini 2.5 Flash, and Groq failover",
        usedInSlug: "plantiq-capstone",
        usedInName: "PlantIQ",
      },
      {
        name: "Conversational AI (Dialogflow)",
        description: "Natural language intent extraction, entity classification, and automated food ordering workflows",
        usedInSlug: "moody-foody",
        usedInName: "Moody Foody",
      },
      {
        name: "Computer Vision",
        description: "ResNet-50 foliar disease classification achieving 96.4% Top-1 accuracy under complex field lighting",
        usedInSlug: "plantiq-capstone",
        usedInName: "PlantIQ",
      },
    ],
  },
  {
    id: "tools-practices",
    badge: "Ζ",
    title: "Tools & Practices",
    pathKey: "system/skills/tools-practices",
    skills: [
      {
        name: "Git",
        description: "Distributed version control, interactive rebase, branch workflows, and commit hygiene",
      },
      {
        name: "GitHub",
        description: "Remote repository management, automated workflows, and GraphQL telemetry synchronization",
        usedInSlug: "portfolio",
        usedInName: "Solarquack Portfolio",
      },
      {
        name: "VS Code",
        description: "Configured workspace environments, task automation, and debugger configurations",
      },
      {
        name: "Unit Testing",
        description: "Automated assertion testing, boundary condition verification, and regression prevention",
      },
      {
        name: "Object-Oriented Programming (OOP)",
        description: "Encapsulation, abstraction, inheritance, polymorphism, and modular domain modeling",
      },
      {
        name: "Data Structures & Algorithms",
        description: "Trees, graphs, dynamic programming, binary search, and asymptotic complexity analysis",
        usedInSlug: "kafka-clone",
        usedInName: "Kafka Clone",
      },
    ],
  },
];

export const armoryStats = {
  languagesCount: 6,
  frameworksCount: 16,
  shippedProjectsCount: 5,
};
