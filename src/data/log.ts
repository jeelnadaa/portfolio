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
    id: "log-telemetry",
    date: "2026-10-08",
    monthYear: "October 2026",
    version: "v1.4.0",
    title: "Interactive GitHub Telemetry Sync & 24h ISR",
    body: "Shipped dynamic GitHub GraphQL telemetry integration. Added client-side fetch buttons in Hero HUD and Section 05, cross-component custom event synchronization, spinning indicators, count-up re-triggering, and 24-hour ISR revalidation (86,400s).",
    tags: ["Telemetry", "GraphQL", "ISR", "Next.js"],
  },
  {
    id: "log-shaders",
    date: "2026-10-08",
    monthYear: "October 2026",
    version: "v1.3.0",
    title: "Hercules GLSL Depth Shader & Responsive Zoom",
    body: "Refined the WebGL depth-parallax shader for the central Hercules statue: applied zero-tolerance alpha thresholding to discard dark outlines, smoothed dither grain across marble surfaces, and engineered responsive zoom scaling.",
    tags: ["WebGL", "Three.js", "GLSL", "Shaders"],
  },
  {
    id: "log-preloader",
    date: "2026-10-08",
    monthYear: "October 2026",
    version: "v1.2.0",
    title: "Click-to-Initiate Preloader & Web Audio Slicing",
    body: "Solved browser audio autoplay restrictions by implementing a click-to-enter ritual with real-time procedural metal slicing sound synthesized via Web Audio API. Enhanced in-place Greek letter scrambling on the Solarquack brandmark.",
    tags: ["Audio", "Web Audio API", "Preloader", "GSAP"],
  },
  {
    id: "log-typography-dossier",
    date: "2026-10-08",
    monthYear: "October 2026",
    version: "v1.1.0",
    title: "Dark Chiaroscuro System & Typographic Readability",
    body: "Standardized on the dark Chiaroscuro palette, increased font sizing across all editorial sections for legibility, fitted the 52-week GitHub activity matrix, and integrated dedicated Resume and Contact dossier routes.",
    tags: ["Design System", "Typography", "Tailwind CSS"],
  },
  {
    id: "log-launch",
    date: "2026-10-08",
    monthYear: "October 2026",
    version: "v1.0.0",
    title: "Solarquack Marble Dossier Portfolio Launched",
    body: "Initial deployment of the classical antiquity marble dossier. Custom orthographic Three.js canvas, Bayer 8x8 dithering, Fraunces variable font, Didot Greek inscriptions, Command Palette (Cmd+K), and dynamic MDX project engine.",
    tags: ["Launch", "Creative Tech", "Next.js 14", "Architecture"],
  },
];
