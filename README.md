# solarquack · Marble Dossier Portfolio

A high-fidelity creative developer portfolio website built for **solarquack** (**Jeel Nada**). Styled in the **Marble Dossier** visual language inspired by classical antiquity and raw system telemetry.

---

## Technical Architecture

- **Framework:** Next.js 14 (App Router, ISR, TypeScript strict mode)
- **Styling:** Tailwind CSS with CSS Variables (`--bg`, `--surface`, `--bone`, `--muted`, `--rule`, `--sun`, `--gold`)
- **3D & Shaders:** React Three Fiber, Drei, Three.js custom orthographic GLSL depth-parallax shader with Bayer 8x8 dithering and cursor torch illumination
- **Animation & Virtual Scroll:** GSAP (ScrollTrigger, Flip, Draggable), Lenis synced via `gsap.ticker`, Framer Motion
- **Asset Pipeline:** Node.js + Sharp for morphological alpha erosion, luminance thresholding, and Bayer 8x8 matrix dithering
- **Typography:** Fraunces variable display font, GFS Didot Greek inscriptions, Geist body, and JetBrains Mono dossier spec rows

---

## Local Development & Commands

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Process Raw Art Assets
Processes all classical sculptures from `assets-raw/` into two-tone bone dithered PNGs, alpha-cutout color WebP/AVIF images, and cleaned depth maps:
```bash
pnpm assets
```

### 3. Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Add a Project
Interactive CLI to create case study dossiers, process cover images, and replace placeholder slots:
```bash
pnpm add-project
```
Or non-interactive:
```bash
pnpm add-project --json path/to/project.json
```

### 5. Production Build & Lint
```bash
pnpm lint
pnpm build
```

---

## Content Editing Guide

All site content is decoupled from components. Edit the data files directly:
- **Identity & Contact:** `src/data/site.ts`
- **Hero Specs & Marquee:** `src/data/hero.ts`
- **Armory Skills:** `src/data/skills.ts`
- **Career Path & Education:** `src/data/experience.ts`, `src/data/education.ts`
- **Changelog:** `src/data/log.ts`
- **Honest Status:** `src/data/now.ts`
- **FAQ:** `src/data/faq.ts`
- **Project Case Studies:** `src/content/projects/*.mdx`

---

## Environment Variables

Copy `.env.example` to `.env.local`:
```env
# Optional GitHub token for live API contributions and repo telemetry
GITHUB_TOKEN=

# Optional Resend credentials for encrypted contact form dispatch
RESEND_API_KEY=
CONTACT_TO_EMAIL=jeelnadaa@gmail.com

# Canonical URL
NEXT_PUBLIC_SITE_URL=https://solarquack.dev
```

---

## License & Credits

- Code: © 2026 solarquack (Jeel Nada)
- Classical sculpture artworks dithered and curated for the dossier theme.
