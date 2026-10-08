export interface HonestStatusItem {
  category: string;
  detail: string;
  status: "building" | "learning" | "investigating" | "open";
}

export const honestStatus = {
  lastUpdated: "October 2026",
  version: "1.0.0",
  items: [
    {
      category: "BUILDING",
      detail: "Building a lightweight real-time vector indexer in C++ and a fast WebGL shader portfolio.",
      status: "building",
    },
    {
      category: "LEARNING",
      detail: "Distributed consensus algorithms (Raft), advanced GLSL post-processing pipelines, and CUDA kernels.",
      status: "learning",
    },
    {
      category: "BROKEN",
      detail: "WebGL depth shader glint calculation needs fine-tuning on high-DPI Safari; fallback works reliably.",
      status: "investigating",
    },
    {
      category: "LOOKING FOR",
      detail: "Open to software engineering and systems internships for Summer 2027.",
      status: "open",
    },
  ] as HonestStatusItem[],
  nowReading: "Designing Data-Intensive Applications by Martin Kleppmann",
  nowListening: "Dark ambient drone & synthwave while writing shaders",
};
