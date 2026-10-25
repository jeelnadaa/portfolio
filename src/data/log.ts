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
    id: "log-home-content",
    date: "2026-10-25",
    monthYear: "October 2026",
    version: "v1.7.0",
    title: "Projects First, Plain Facts, Data-Driven Lists",
    body: "Moved the work showroom up to directly after the hero and put Sift first. The Path timeline now lives only on /path and the FAQ moved to /about. The hero shows plain facts (name, college, city, Summer 2027 internships) at every screen size and has a résumé download in place of the star count. Project cards show their top two results, open with the keyboard, and keep the play button visible on touch screens. The résumé page and command palette now read projects from the content files, and the hero h1 has a real accessible name.",
    tags: ["Content", "Accessibility", "Information Architecture"],
  },
  {
    id: "log-performance",
    date: "2026-10-25",
    monthYear: "October 2026",
    version: "v1.6.0",
    title: "Gate Fix & Lighter Pages",
    body: "The click-to-enter intro now plays once per tab, never on inner pages or shared project links, and enters on its own after 1.5 s (a click or key press still skips it and plays the sound). The WebGL hero now loads textures sized for the screen: about 163 KB instead of 1.8 MB, built by scripts/hero-textures.mjs during pnpm assets. Full-colour hover images load only on first hover. Project videos were re-encoded from 34 MB to 10.7 MB total, and a duplicate video was removed.",
    tags: ["Performance", "WebGL", "Preloader", "Video"],
  },
  {
    id: "log-sift",
    date: "2026-10-25",
    monthYear: "October 2026",
    version: "v1.5.0",
    title: "Sift Case Study",
    body: "Added Sift, my self-hosted Gmail assistant, with its demo video, architecture diagram and real measurements: under 1.5 s from server push to phone, 0 AI calls on bank mail, and 190+ backend tests.",
    tags: ["Projects", "Content"],
  },
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
