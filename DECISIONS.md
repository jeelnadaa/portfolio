# ARCHITECTURAL & ARTISTIC DECISIONS (DECISIONS.md)

This log documents all technical, aesthetic, and architectural choices made during the creation of the **solarquack** (Jeel Nada) "Marble Dossier" portfolio.

---

### 1. Framework & Runtime: Next.js 14 App Router
- **Choice:** Next.js 14 with App Router, TypeScript strict mode, and React 18.
- **Rationale:** Provides optimal server-side generation (SSG) for static dossier pages, ISR for GitHub repo tracking (1-hour revalidation), and standard dynamic route capabilities for project case studies.

### 2. Design Tokens & Zero-Flash Theming
- **Choice:** CSS Variables (`--bg`, `--surface`, `--bone`, `--muted`, `--rule`, `--sun`, `--gold`) bound to `data-theme="dark"` and `data-theme="bone"`.
- **Implementation:** An inline `<script>` in the document `<head>` verifies `localStorage` and `prefers-color-scheme` prior to DOM paint to guarantee 0ms flash of unstyled content.

### 3. Typography Stack
- **Display:** `Fraunces` variable font with axes `opsz: 144`, `SOFT: 100`, `WONK: 1`, `wght: 300..900`.
- **Greek & Inscriptions:** `GFS Didot` (authentic Greek typography for ghost letters and dossier category markers).
- **Body:** `Geist` (clean technical readability, max 62ch width).
- **Mono:** `JetBrains Mono` (dossier spec keys/values, numbers, keyboard shortcuts, code).
- **Fallback:** Robust sans/serif system stacks with `display: swap`.

### 4. 3D Hero Shader & Performance Budget
- **Choice:** React Three Fiber + Drei custom orthographic shader mesh.
- **LCP Protection:** The 3D scene is client-lazy (`ssr: false`) and renders a `<BoneImage>` poster initially. Once mounted, the canvas fades in cleanly.
- **Shader Features:**
  - Bayer 8x8 ordered dither thresholding in GLSL.
  - Interactive "Torch" spotlight at cursor UV coordinates revealing un-dithered continuous tone marble with a warm `--sun` rim light.
  - Smooth Lissajous curve drift when idle (2.5s timeout) or on touch devices.
  - Periodic sword glint sweep every 6 seconds along the blade.
  - Frame loop set to demand when hidden or scrolled out of view.

### 5. Motion Orchestration
- **Libraries:** GSAP (ScrollTrigger, Flip, Draggable) + Lenis for virtual smooth scrolling + Framer Motion for route transition circles.
- **Ticker Integration:** Lenis scroll loop is synchronized directly to `gsap.ticker` to eliminate frame judder.
- **Accessibility:** Full `prefers-reduced-motion` compliance. Parallax, WebGL torch, preloader, and marquee animation are completely disabled under reduced motion in favor of gentle 0.2s opacity fades.

### 6. Asset Processing Pipeline
- **Sharp Node Pipeline (`scripts/process-assets.mjs`):**
  - Edge flood-fill alpha masking with luminance threshold (< 26) to cleanly excise the soft art border glow without erasing interior shadows.
  - 1px morphological alpha erosion + 1.5px feathering.
  - 8x8 Bayer matrix ordered dither to two tones: Bone (`#E9E3D2`) on transparent.
  - Gold seam preservation on `bust-fractured.png` mapped to `--gold`.
  - Depth map normalization: dilated silhouette mask multiplication, remapped range 0.15-1.0, 2px Gaussian blur.
  - Auto-generated `manifest.json` ensuring zero runtime guessing.
