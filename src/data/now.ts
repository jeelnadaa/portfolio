export interface HonestStatusItem {
  category: string;
  detail: string;
  status: "building" | "learning" | "investigating" | "open";
}

export const honestStatus = {
  lastUpdated: "October 2026",
  version: "1.4.0",
  items: [
    {
      category: "BUILDING",
      detail: "Hardening pure Java distributed message broker (Kafka clone) commit log segments and fine-tuning coffee agronomy hybrid RAG pipelines.",
      status: "building",
    },
    {
      category: "LEARNING",
      detail: "Distributed consensus protocols (Raft), advanced Java memory model semantics, and high-throughput network I/O optimizations.",
      status: "learning",
    },
    {
      category: "BROKEN",
      detail: "Sparse binary index offset floor lookup edge cases during rapid segment file rotation under heavy concurrency; adding stress testing harness.",
      status: "investigating",
    },
    {
      category: "LOOKING FOR",
      detail: "Open to software engineering, backend systems, and distributed platforms internships for Summer 2027.",
      status: "open",
    },
  ] as HonestStatusItem[],
  nowReading: "Designing Data-Intensive Applications by Martin Kleppmann",
  nowListening: "Dark ambient drone & procedural electronic audio while writing systems code",
};
