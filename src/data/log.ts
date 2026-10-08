export interface LogEntry {
  id: string;
  date: string; // ISO date string or formatted date
  monthYear: string;
  version?: string;
  title: string;
  body: string;
  tags: string[];
}

export const logEntries: LogEntry[] = [
  {
    id: "log-1",
    date: "2026-10-08",
    monthYear: "October 2026",
    version: "v1.0.0",
    title: "Portfolio v1.0 launched (Marble Dossier)",
    body: "Shipped the complete portfolio system. Custom GLSL depth-parallax hero with cursor torch lighting, Bayer 8x8 dither pipeline, Greek glyph typography, dynamic project case study engine, and dossier design system.",
    tags: ["Release", "Design", "WebGL", "Next.js"],
  },
  {
    id: "log-2",
    date: "2026-09-15",
    monthYear: "September 2026",
    version: "v0.9.0",
    title: "Benchmarking SIMD Vector Distance Calculations",
    body: "Tested AVX2 vectorized cosine distance implementations against naive loops in C++. Achieved a 4.2x speedup on 128-dimensional embedding vectors.",
    tags: ["Systems", "C++", "Performance"],
  },
  {
    id: "log-3",
    date: "2026-08-01",
    monthYear: "August 2026",
    version: "v0.8.0",
    title: "Exploration: Ordered Bayer Dithering in GLSL",
    body: "Prototyped cross-fading dither dissolve shaders. Compared Bayer 4x4 vs 8x8 matrices for rendering classical marble sculpture cutouts on pure black backgrounds.",
    tags: ["Shaders", "GLSL", "Experiments"],
  },
];
