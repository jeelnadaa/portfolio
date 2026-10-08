# AGENT PROMPT v2: Build the "solarquack" portfolio (Marble Hercules / Dossier theme)

You are a senior creative developer and art-directed designer. Build a complete, production-ready, motion-heavy portfolio website. Do not ask me questions. Every decision is in this document; where something is missing, choose the more distinctive and more performant option and record it in `DECISIONS.md`.

**The goal:** it must look hand-designed by a person with a point of view, never like AI output or a template. Every page, not only the landing page, has real motion, the custom cursor, the same typographic system, and the same marble-dossier visual language.

---

## 0. IDENTITY AND CONTENT

### 0.1 Names
- `brand` = **solarquack** (internet name; always lowercase). `legalName` = **Jeel Nada**.
- Store both in `src/data/site.ts`; import them everywhere, never type either inline in components.
- **Use `solarquack`:** hero giant text, preloader, nav logo, footer, tab titles, favicon, cursor labels, 404, command palette, transitions, copyright (`© 2026 solarquack`), GitHub/Instagram handles.
- **Use `Jeel Nada`:** `/resume` header and PDF filename (`Jeel-Nada-Resume.pdf`), first line of `/about` ("I'm Jeel Nada, online as solarquack."), the hero dossier line `Name: Jeel Nada`, JSON-LD `Person` (`name: Jeel Nada`, `alternateName: solarquack`), meta/OG description ("Portfolio of solarquack (Jeel Nada), CSE student and developer"), the contact form email signature, the LinkedIn row label. Home page `<title>`: `solarquack | Jeel Nada, CSE Student & Developer`; other pages `Page · solarquack`.
- Duck/quack wordplay: at most 2 subtle places (404 line, one easter egg). No cartoon duck, no puns in headings.

### 0.2 Details (all in `src/data/site.ts`)
```
ROLE:         CSE Student / Software Developer
COLLEGE:      PES University, B.Tech CSE, class of 2027, CGPA 8.43
LOCATION:     Bengaluru, India
EMAIL:        jeelnadaa@gmail.com
PHONE:        +91 80000 50317
GITHUB:       https://github.com/jeelnadaa   (TODO verify username)
LINKEDIN:     https://www.linkedin.com/in/jeelnada/  (label "Jeel Nada")
INSTAGRAM:    https://instagram.com/jeel_nada77   (TODO verify)
RESUME_PDF:   /resume.pdf  (placeholder PDF, I replace it later)
AVAILABLE_FROM: null  (ISO date; when set, the countdown in the hero appears; when null, show "Open to internships")
```
No lorem ipsum, no invented metrics, no fake companies or testimonials. Unknown facts are `TODO` markers in the data files. All copy follows section 11.

---

## 1. WHAT I AM REFERENCING (and what NOT to copy)

Reference: **https://ryoku.dev**. Study its *structure and attitude*, then make something original:
- Everything is marble statues and ruins **dithered to two tones ("bone" on black)**, so the whole site feels like one printed object.
- A "dossier" attitude: tags like `System dossier`, numbered labels `00 // BASE`, `01 // POWER`, spec rows (key / value), `ESC ✕` hints, live stat counters, a countdown.
- A giant glyph per section (it uses Japanese kanji). **We use Greek** instead (table in 2.5).
- One accent color (red sun). Everything else black and bone.
- Gallery images dimmed at rest, full color on hover; a "manifest" listing of everything included; an "honest status" block; FAQ; a footer with a big mark.
- Do NOT copy its text, artwork, layout pixel-for-pixel, logo, or code. Our version adds far more motion, a depth-parallax 3D hero, Greek glyph system, cursor-as-torch lighting, and a project system I can extend by command.

---

## 2. ART DIRECTION: "MARBLE DOSSIER"

### 2.1 Palette (CSS variables; dark is default)

| Token | Dark (default) | Bone mode (inverted, toggle) |
|---|---|---|
| `--bg` | `#070706` | `#E9E3D2` |
| `--surface` | `#0F0F0D` | `#DDD6C3` |
| `--bone` / ink | `#E9E3D2` | `#070706` |
| `--muted` | `#8C8778` | `#6A6557` |
| `--rule` | `rgba(233,227,210,.16)` | `rgba(7,7,6,.18)` |
| `--sun` (accent) | `#E5381B` | `#C8260B` |
| `--gold` (only for kintsugi seams / tiny highlights) | `#C9A24B` | `#9C7A2E` |

Accent `--sun` usage ≤ 5% of any screen: the sun disc, cursor details, active states, one highlighted word per section, link underline, countdown seconds. Never gradients except the sun disc's soft radial glow.

### 2.2 Typography (self-hosted via `next/font`; these are the "custom fonts")
- **Display (hero, headings):** `Fraunces` **variable** (axes `opsz`, `wght`, `SOFT`, `WONK`). Hero uses `opsz 144, SOFT 100, WONK 1, wght 300→900`. Tracking `-0.035em`, line-height `.86`. Italic cuts for accent words.
- **Greek glyph / inscription font:** `GFS Didot` (has Greek). Used for the giant ghost letters, Greek labels and Greek words. Always uppercase.
- **Body:** `Geist` (or `Hanken Grotesk`), 16-18px, line-height 1.6, max 62ch.
- **Mono (labels, dossier rows, numbers, buttons):** `JetBrains Mono` (has Greek), 11-13px, uppercase, `letter-spacing .08em`.
- Banned as visible fonts: Inter, Roboto, Arial, system-ui.
- Make sure every font has a fallback stack and `display: swap`; subset Latin + Greek.

### 2.3 Layout and components
- 12-column grid; page padding `clamp(16px,4vw,64px)`; hairline 1px rules; sharp corners (0-2px radius); no drop shadows, no glassmorphism, no glow cards.
- Section label pattern (used everywhere): `[mono] 01 // STRENGTH` + ghost Greek letter + hairline rule.
- Dossier spec rows: `KEY` (muted mono, left) … dotted leader … `VALUE` (bone mono, right).
- Buttons: rectangular, 1px bone border, mono uppercase label, hover = fills with bone from the bottom (clip-path), text inverts, arrow `↗` rotates. Primary button variant has the sun-red fill.
- Chips/tags: mono, 1px border, no fill.
- Keyboard hints rendered as `ESC ✕`, `⌘K`, `/` in small bordered boxes.

### 2.4 Image treatment ("bone dither")
All statue art is shown in **two states**:
- **Rest:** dithered, two-tone (bone on black), slightly dimmed (`opacity .55`).
- **Hover / in focus:** the original color/greyscale version cross-fades in via a **diagonal dither dissolve** (shader or CSS mask with a Bayer pattern), opacity 1.
Build `<BoneImage src hoverSrc>` for this. Asset pipeline in section 3.

### 2.5 Greek glyph system (the signature element)
A giant ghost Greek letter sits behind every section header at 6-8% opacity in GFS Didot (200-400px), slowly rotating `±4deg` and drifting with scroll (scrubbed). Greek section words appear as the large label; the English label sits next to it in mono.

| Place | Giant ghost letter | Greek word | English label |
|---|---|---|---|
| Hero | Ω | ΦΑΚΕΛΟΣ | System dossier |
| What it is | Ε | ΕΓΩ | About, short |
| Strength | Ι | ΙΣΧΥΣ | Strength |
| Craft | Τ | ΤΕΧΝΗ | Craft |
| Work | Ε | ΕΡΓΑ | Work |
| Skills | Ο | ΟΠΛΟΘΗΚΗ | Armory (skills) |
| GitHub | Κ | ΚΩΔΙΚΑΣ | Code |
| Experience | Π | ΠΟΡΕΙΑ | Path |
| Status | Κ | ΚΑΤΑΣΤΑΣΗ | Status |
| FAQ | Ε | ΕΡΩΤΗΣΕΙΣ | Questions |
| About page | Α | ΑΝΘΡΩΠΟΣ | Human |
| Resume | Β | ΒΙΟΣ | Life / résumé |
| Contact | Ε | ΕΠΑΦΗ | Contact |
| Log | Η | ΗΜΕΡΟΛΟΓΙΟ | Log |
| 404 | Α | ΑΝΥΠΑΡΚΤΟ | Not found |

Double-check every Greek spelling against the font's glyph coverage and add the table to `src/data/glyphs.ts`. Store Greek as real Unicode text, never as images.

### 2.6 Atmosphere layers (all pages)
- Static film grain via SVG `feTurbulence` data-URI, opacity `.06`, fixed, not animated.
- A faint ordered-dither overlay (Bayer 4x4 pattern PNG tiled, 3% opacity, `mix-blend-mode: overlay`).
- Four vertical 1px grid lines on the hero only, 4% opacity.
- Corner registration marks (`+`) at the 4 corners of the viewport on every page, 12px, muted. They shift 4px inward when scrolling.

### 2.7 Anti-slop rules (HARD)
1. No purple/blue/pink gradients, no gradient text, no aurora blobs.
2. No glassmorphism, no glow, no neon.
3. No emoji. Icons are inline SVG, 1.5px stroke, sharp joins.
4. Banned copy: "passionate", "seamless", "cutting-edge", "leverage", "innovative", "robust", "crafting digital experiences", "turning ideas into reality", "dive into", "unlock", "journey" (except nowhere). No em-dashes in generated copy.
5. No three-equal-feature-cards sections. No carousels for projects. No skill bars or percentages. No stock illustrations. No looping fake typing animation. No bouncing scroll chevron.
6. Every animation must have a job: reveal, guide the eye, or give feedback. If you cannot say why it exists, delete it.

---

## 3. ASSETS AND PIPELINE

### 3.1 Raw assets I provide (in `assets-raw/`, exact filenames)
`hero-hercules.png` (3:4), `hero-hercules-depth.png` (optional), `ruins-columns.png` (16:9), `fist-sword.png` (4:5), `hand-laurel.png` (4:5), `forge-anvil.png` (4:5), `bust-fractured.png` (1:1), and optional `sfx-slash.mp3`, `sfx-marble.mp3`, `ambient-wind.mp3`. All images are on a **pure black background**; `bust-fractured.png` may contain gold seams.

### 3.2 Build script `scripts/process-assets.mjs` (Node + `sharp`, run via `pnpm assets`)
For each image in `assets-raw/` produce into `public/art/`:
1. **`<name>.mask.png` / alpha:** flood-fill from the four edges through pixels with luminance < 26 (configurable via `--threshold`) and mark them transparent, then erode the alpha by 1px and feather 1.5px. The source art has a faint soft glow around the figures; this threshold and erosion must remove that glow so no light fringe remains around the cutout. Interior dark shadows stay opaque. Do NOT use plain luminance-to-alpha for the hero statue.
2. **`<name>.color.webp` and `.avif`** (greyscale-preserving original with alpha; for `bust-fractured`, keep gold).
3. **`<name>.bone.png`:** ordered **Bayer 8x8 dither** to two tones (bone `#E9E3D2` on transparent), dither scale 2px at 1x (render pixel size configurable `--px 2`). Keep gold seams in the bust as `--gold`.
4. Responsive widths 640 / 1280 / 2048 / full.
5. **Depth map cleanup (always run, even on a provided depth map):** the provided depth map has a grey haze and a bright gradient along the bottom edge outside the statue. Multiply it by the dilated (3px) statue mask so everything outside the silhouette becomes 0, remap the statue range to 0.15-1.0, apply a 2px blur, and resize it to exactly the hero image's pixel dimensions. Output `hero-hercules.depth.png`. If `hero-hercules-depth.png` is missing, synthesize one instead: blurred luminance (radius 12) multiplied by an elliptical vertical-gradient mask centered on the figure, normalized; write `hero-hercules.depth.png` and log a warning.
6. Write `public/art/manifest.json` with sizes, aspect ratios, and file paths; the app reads only this manifest.

### 3.3 Missing-asset behavior (the site must always build and look intentional)
If any art file is missing, render `<AssetPlaceholder name>`: a dithered noise plate (generated Bayer pattern on `--surface`) with a mono caption `ASSET PENDING // hero-hercules.png` in muted text. The build must not fail.

### 3.4 Generated-in-code visuals (no files needed)
Sun disc, embers, fog, grain, dither, ghost Greek letters, marquee, favicon (monogram `sq` in Fraunces inside a bone circle with a sun-red dot; also an inverted variant for light browser UIs), OG images (`next/og`, bone text on black with the dithered statue).

### 3.5 Placeholder portrait and project images
No portrait or project screenshot exists yet.
- **Portrait:** `<PortraitPlaceholder>` renders a dithered marble-bust silhouette (use `bust-fractured.bone.png` blurred and masked) captioned `PORTRAIT PENDING`. If `/public/me.jpg` exists, auto-process it through the bone dither pipeline and use it, color on hover.
- **Project covers:** `<ProjectPlaceholder seed={slug} />` is a **generative cover**: a 16:10 plate with a seeded Bayer-dithered gradient/noise pattern (different per slug), a big Greek numeral (Α, Β, Γ, Δ, Ε), the mono label `PROJECT 0X // PLACEHOLDER`, and a subtle slow animation (dither threshold drifting). Used in the work list, gallery, case-study hero, and OG image whenever `cover` is missing.


---

## 4. TECH STACK (fixed)

Next.js 14+ (App Router) · TypeScript strict · Tailwind (tokens from section 2) · **GSAP + ScrollTrigger + Flip + Draggable** · **Lenis** (synced via `gsap.ticker`) · **Framer Motion** (route transitions / presence only) · **React Three Fiber + drei + three** (hero depth shader only; lazy, `ssr:false`) · MDX (`@next/mdx` or `contentlayer`) · `shiki` · `cmdk` · Zod · `sharp` · pnpm · deploy Vercel. No UI kits (no shadcn/MUI/Chakra look).

---

## 5. GLOBAL SYSTEMS (on every page)

### 5.1 Custom cursor (fine pointers only)
- Core: 8px bone dot (exact position) + a 44px **reticle ring** with 4 tick marks (top/right/bottom/left) that lags behind (`gsap.quickTo`, `.45s`, `power3.out`) and slowly rotates (20s/rev). `mix-blend-mode: difference`.
- **States (via `data-cursor="..."`):**
  - links/buttons: ring scales to 72px, ticks retract, mono label inside: `OPEN`, `VIEW`, `COPY`, `PLAY`, `DRAG` (with Greek under it in 8px: ΑΝΟΙΓΜΑ / ΠΡΟΒΟΛΗ), arrow follows.
  - text: ring collapses to a 2px × 20px vertical bar.
  - **hero statue: the cursor becomes a "torch"**: a soft radial light (`--sun` tint, 320px, 20% opacity) that *lights the statue* in the shader (see 6.A) and fades the dither to full-detail inside the radius.
  - project rows/gallery tiles: label `VIEW` and the hovered image dissolves to color.
  - click anywhere: a thin `--sun` ring pulse (200ms) plus a 1-frame "slash" line segment (12px) in the direction of the last mouse movement; if SFX is on, play `sfx-slash.mp3` at 0.3 volume.
- Hidden on touch devices and under `prefers-reduced-motion`. Native cursor stays `auto` on form inputs.

### 5.2 Preloader (first visit per session only, max 2.4s, click to skip)
1. Black screen, top-left mono `SOLARQUACK // SYSTEM DOSSIER`, bottom-right counter `000 → 100` (GSAP, `power2.inOut`).
2. As the counter climbs, a **sun disc** (`--sun`, soft glow) rises from the bottom edge to center, scaling `.2 → 1`.
3. At 100: a single diagonal **slash** (a thin bone line drawn left-to-right with `stroke-dashoffset`, 0.25s, `sfx-slash` if on) cuts the screen; the two halves (clip-path polygon) slide apart along the slash line, revealing the hero. Hero entrance timeline starts at the slash's `onStart`.
4. Skipped entirely under reduced motion.

### 5.3 Page transitions
Click on an internal link: a **sun-red circle** expands from the click point (`clip-path: circle(0 at x y) → circle(150% at x y)`, `.7s`, `expo.inOut`) while the destination's Greek word (from the glyph table) appears huge in bone on the red; route swaps; circle contracts toward the center of the new page with the page elements revealing in their own entrance animations. Keyboard navigations originate from the viewport center. Reset scroll with `lenis.scrollTo(0,{immediate:true})`. Fallback to opacity fade under reduced motion.

### 5.4 Navigation (ryoku-style bar)
- Left: logo mark (`sq` monogram) + `solarquack`.
- Center: `Work · Armory · Path · About · Log` (text-roll hover, 1px underline draws left→right). Each shows its Greek numeral in 8px above on hover (Α Β Γ Δ Ε).
- Right: live local time `BLR 14:32` (mono), a GitHub chip `★ {stars} / {repos}` fetched at build (links to GitHub), `Resume` button (downloads PDF), theme toggle (dark ⇄ bone; icon morphs; the switch is a circular clip-path wipe from the toggle).
- Hides on scroll down, returns on scroll up. 2px sun-red scroll progress line along the very top.
- Mobile: `Menu` button → full-screen overlay, giant stacked links in Fraunces, each revealing line by line with its Greek word beside it; socials and email at the bottom; focus trap; `ESC ✕`.

### 5.5 Footer (every page)
Reference structure: big mark, tagline, link columns, contact, tiny credit.
- Giant `solarquack` spanning full width; letters react to the cursor with the **variable-font proximity effect** (as in hero, 6.A).
- Tagline in Fraunces italic: "Built with strength. Shipped with taste." plus Greek line `ΙΣΧΥΣ ΚΑΙ ΤΕΧΝΗ`.
- Columns: Explore (Work, Armory, Path, About, Log), Elsewhere (GitHub, LinkedIn, Instagram, Resume), Contact (email as giant row, phone `tel:`; click copies with a toast `COPIED ✓`).
- Bottom row: `© 2026 solarquack · Jeel Nada`, `Artwork dithered from AI-generated marble.`, `Last updated {build date}`, `Back to top ↑` (Lenis).

### 5.6 Command palette (`⌘K` / `Ctrl+K` / `/`)
`cmdk` modal, mono input, items: every page, every project, GitHub/LinkedIn/Instagram, copy email, download resume, toggle theme, toggle sound, "add project (docs)". Opens with scale `.96→1` + fade, backdrop dithers in.

### 5.7 Sound
Muted by default. Small speaker toggle in nav. When on: `ambient-wind.mp3` loops quietly on the hero (volume .15), `sfx-marble.mp3` on project-row hover (volume .2, throttled to 1 per 400ms), `sfx-slash.mp3` on click pulse and preloader. If files are missing, the toggle is hidden.

### 5.8 Easter eggs
Konami code → inverts to bone mode and plays the slash; `console.log` with ASCII `solarquack` and "Reading the source? Say hi:" + email; 404 has its own (see 7).

---

## 6. HOME `/` (THE SHOWPIECE)

### 6.A Hero: "ΦΑΚΕΛΟΣ" (100vh, min 720px)
**Layer stack (back to front):**
1. `ruins-columns` (bone-dithered), `opacity .5`, parallax `±1.2%` with mouse, slow zoom `1 → 1.06` scrubbed on scroll.
2. **Sun disc** (`--sun`, 62vmin) centered behind the statue's head. It breathes (scale `1 → 1.03`, 6s sine). Soft radial glow only. Slowly rises/sets with scroll (`yPercent: 0 → 25`).
3. **Giant name `solarquack`** in Fraunces (see below), bone, across the full width, sitting behind the statue.
4. **Hercules statue** in a React Three Fiber plane with the depth shader (below).
5. Foreground **embers** (canvas 2D or instanced points in the same R3F scene): 60 tiny bone/sun specks drifting up with noise, parallax faster than the statue; slow under reduced motion (or none).
6. Light fog layers (2 large soft PNG-less gradients in CSS, bone at 4% opacity, drifting horizontally).

**Depth-parallax shader (R3F, orthographic, `frameloop="demand"` when offscreen / tab hidden, `dpr={[1,1.5]}`):**
- Textures: `hero-hercules.color`, `hero-hercules.depth`, mask (alpha).
- Uniforms: `uTime, uMouse (lerped .06), uRes, uTorch (mouse position in uv), uTorchRadius, uTorchStrength, uScroll, uSun (vec3), uBone (vec3), uDitherScale`.
- UV displacement: `uv += (uMouse - .5) * depth * 0.035` (near parts move more). On scroll the statue also scales `1 → 1.08` and `y -4%`.
- **Dither post in shader:** compute luminance, compare with an 8x8 Bayer threshold at `uDitherScale` pixels → output bone or transparent. Inside the **torch** (distance < radius, smoothstep) blend toward the continuous-tone version (full marble detail) and add a warm `--sun` rim tint on lit edges (dot with direction to cursor). Outside the torch the statue stays dithered and slightly dim. Idle (no mouse for 2.5s): torch drifts in a slow Lissajous path so mobile and idle states still show life.
- **Sword glint:** every 5-7s a thin white-sun diagonal highlight band sweeps along the blade (mask the blade region with a hand-authored polygon in `src/data/hero.ts` that can be tuned; fall back to a band across the lower-center third).
- Mobile/touch: no mouse; use device tilt if permitted (`DeviceOrientationEvent`) else the idle path. Pause when `document.hidden`.
- Fallback (no WebGL / reduced motion): static `<BoneImage>` with CSS `translate3d` parallax only.

**Giant name (the "custom fonts" moment):**
- `solarquack` in Fraunces `opsz 144, SOFT 100, WONK 1`, size `clamp(5rem, 18vw, 22rem)`, one line on desktop (wraps to `solar` / `quack` on mobile). Letters are individual spans with `aria-label="solarquack"` on the parent.
- **Entrance (after preloader):** each letter first cycles quickly through random Greek capitals in GFS Didot (4-6 flips, 60ms each, staggered `.05`) then settles into its Latin Fraunces glyph with `yPercent 100 → 0` in a mask. Total ≈ 1.4s.
- **Cursor proximity (variable font axes):** per letter, distance to the cursor controls `font-variation-settings`: `wght 300 → 900`, `SOFT 0 → 100`, and `opsz`; plus `scaleY 1 → 1.06`. Use `gsap.quickTo` per letter or a single rAF loop; throttle to 60fps; disable on touch. The letters nearest the sword's blade tip do not change (so the statue reads cleanly).
- Idle: a slow wave of weight runs left to right every 8s.
- Scroll-out: the name splits: odd letters `yPercent -20`, even `+20`, `opacity → 0`, scrubbed.

**Dossier HUD (around the statue, mono):**
- Top-left tag: `● SYSTEM DOSSIER` with a pulsing 6px `--sun` dot, below it `Jeel Nada // solarquack`.
- Left column spec rows (leader dots): `Role` CSE Student / Developer · `Base` Bengaluru, IN · `College` [TODO] · `Stack` [top 4 from data] · `Status` Open to internships · `Open source` {n repos}. Rows reveal one by one with a small scramble-text effect (random Greek/Latin chars resolving to the final text in 600ms).
- Right column stat counters (count up on load): `Repos`, `Stars`, `Projects`, `Commits (yr)` from GitHub data, with a `tracked live from GitHub` link.
- **Countdown (only if `AVAILABLE_FROM` set):** `Available in` and `--days --hrs --min --sec` flip digits (each digit in a 1px-bordered cell, rolling vertical animation; seconds in `--sun`). If null, show `Open to internships` with a pulsing dot.
- Bottom-left: positioning line (section 11) and CTAs `[ View work ↗ ]` (primary sun) and `[ Source ↗ ]` (GitHub), both magnetic; beside them `★ {stars} stars / {forks} forks`.
- Bottom-right: custom scroll cue: a 1px vertical line with a 6px sun dot traveling down it + mono `SCROLL ΚΑΤΩ`.
- Mobile layout: statue centered 70vh; name above in two lines; HUD collapses to 3 spec rows and two stats; CTAs stacked.

**Marquee strip below hero:** full-width, bone background, black text, mono uppercase, rotated `-1.2deg`: `ΙΣΧΥΣ ✦ ΤΕΧΝΗ ✦ [real skills] ✦ ΕΡΓΑ ✦ ...` (mix Greek words with the actual skills from data). Speed `~70px/s`, **reverses and accelerates with scroll velocity** (Lenis). Pause on hover.

### 6.B "ΕΓΩ" what it is (`00 // BASE`)
- Ghost Ε. Label `00 // SOLAR-BASE`.
- Heading (Fraunces, `clamp(2.2rem,5vw,5rem)`): one 2-sentence statement about what I build (section 11). Words reveal with **scroll-scrubbed opacity** (`.15 → 1` word by word).
- Beside it, the `ruins-columns` or `bust` art in `<BoneImage>` with clip-path reveal and a caption `ΒΑΣΗ // BASE` + small rotating Greek text on a circle (`textPath`).
- Under it, a one-line italic serif pull-quote in the margin: `*the repo is the portfolio.*` (only if true for the site; it is, since all content is data-driven).

### 6.C "ΙΣΧΥΣ" and "ΤΕΧΝΗ" twin panels (`01 // STRENGTH`, `02 // CRAFT`)
- Two full-height panels side by side (stacked on mobile). Left: `fist-sword.bone`; right: `hand-laurel.bone`. Large Fraunces `Strength.` and `Craft.` below each, with a 2-line description (what I'm strong in technically; how I care about details).
- **Interaction:** hovering a panel dissolves its art to color (diagonal dither dissolve), expands that panel `flex 1 → 1.35` (GSAP Flip), and dims the other to `.5`.
- On scroll, each image pans slowly inside its frame (±6%), and the two giant glyphs Ι and Τ rotate `±6deg` scrubbed.
- Below each panel: a mini spec list (3 rows) of real strengths from data.

### 6.D "ΕΡΓΑ" Work showroom (`03 // WORK`) (the most important section)
Reference: ryoku's "See it running" gallery (six tiles, dimmed until hovered, ESC to close lightbox).
- Header `See it running.` plus a one-line caption. Count `(N)`.
- **Gallery of 6 tiles** (top featured projects; placeholders until real): 3-column asymmetric grid (rows offset), tiles have a big index `01`, project name, tagline, `↗`.
- **Rest state:** tile image dithered + dimmed + slightly desaturated. **Hover:** diagonal dither-dissolve to full color, tile lifts `translateY -6px`, cursor label `VIEW`, `sfx-marble` if on, and other tiles dim.
- **Click:** opens a **lightbox** (Flip from the tile's rect to center) showing the cover large with title, one-line description, stack chips, buttons `Open case study`, `GitHub ↗`, `Live ↗`. `ESC ✕` closes; arrow keys move between projects; focus trapped.
- A "list view" toggle swaps to an index list (number · title huge · tags · year) with the **floating cursor-following preview image** (inertia, rotation by velocity ±8deg).
- Under it: `See all work (N) →`.
- Tiles enter with `ScrollTrigger.batch`: mask-up + stagger `.08`; the rule above draws in.

### 6.E "ΟΠΛΟΘΗΚΗ" Armory (`04 // ARMORY`) (the "Included" manifest)
Reference: ryoku's "Everything, already installed" package manifest.
- Header `Everything I reach for.` Three big stats on the left (count-up): `{n} languages`, `{n} frameworks`, `{n} projects shipped` (real counts from data).
- A **package-manifest list** in grouped blocks (Languages, Web, Backend & DB, AI/ML, Tools & DevOps, CS fundamentals). Each group has a Greek letter badge (Α Β Γ Δ Ε Ζ) and rows formatted like package entries: `name` (bone mono) + muted description + optional `used in: ProjectX` linking to the project. Footer line of each block: `system/skills/{group}`.
- Interaction: rows reveal with a mask; hovering a row highlights it with a sun-red left marker and dims others; clicking a `used in` link goes to that project. Search/filter input at the top (`/` focuses it; filters live with Flip). `ESC ✕` clears.
- **No logos cloud, no percentages.**

### 6.F "ΚΩΔΙΚΑΣ" GitHub live (`05 // CODE`)
- Build-time fetch (ISR 3600s) of user, repos, stars, languages; contributions via GraphQL if `GITHUB_TOKEN` exists, else `src/data/github-snapshot.json`; never show an error.
- **Contribution heatmap** as a custom SVG of 11px squares in 5 bone tints (level 4 = `--sun`). Entrance: diagonal wave from the center. Hover shows `{n} contributions on {date}` in a mono tooltip following the cursor.
- Language bar (flat bone shades), 4 latest non-fork repos as rows (name, language, stars, `updated 3d ago`, arrow).
- Big mono counters `Repos / Stars / Followers / Commits (yr)` with count-up.

### 6.G "ΠΟΡΕΙΑ" Path (`06 // PATH`)
Education, internships, achievements as a vertical timeline with a **scroll-drawn line** (SVG path scrubbed), nodes that pop in (square nodes, not circles), entries sliding from alternating sides on desktop, left-aligned on mobile. Years in Fraunces italic. Links to `/resume`.

### 6.H "ΚΑΤΑΣΤΑΣΗ" Honest status (`07 // STATUS`)
Reference: ryoku's honest-beta block.
- Left: `bust-fractured` (bone, gold seams in `--gold` that **slowly pulse** like light running through the cracks, 4s).
- Right: header `Honest status.` and 3-4 real lines: what I'm currently building, what I'm learning, what's broken or unfinished, what I'm looking for (`Open to internships from {date}`) — all from `src/data/now.ts`. A chip `BETA · portfolio v{package version}` that links to the repo. Rows appear with scramble-text.

### 6.I About teaser with forge art
`forge-anvil.bone` large; on scroll the art wipes in and tiny spark particles (canvas) burst at the hammer-contact point when the image is 60% in view. Copy: 3 plain sentences + button `More about me →`.

### 6.J "ΕΡΩΤΗΣΕΙΣ" FAQ (`08 // QUESTIONS`)
Accordion (GSAP height animation): "What are you looking for?", "What do you work with?", "Can you work remotely?", "How fast do you reply?", "What are you building now?". Each answer from `src/data/faq.ts` (TODO placeholders). Plus/minus morphs; ghost Greek letter rotates on open.

### 6.K Contact CTA
Giant line "Let's build something." (Fraunces, accent word *something* in italic sun) followed by the footer (5.5). Email as the biggest row.

---

## 7. OTHER PAGES (each with motion, cursor, glyphs)

### 7.1 `/work` (showroom)
- Header: giant `Work.` + `(N)`, ghost Ε, Greek `ΕΡΓΑ`.
- Filters (tags from data; `Flip` animates reorder; stored in `?tag=`) and a Grid/List toggle (Flip). Sort: Featured / Newest.
- Tile behavior = 6.D. Status badges: `LIVE`, `BUILDING`, `ARCHIVED`, `PLACEHOLDER` (muted).
- Empty-filter state: the fractured bust small with `Nothing here yet.`

### 7.2 `/work/[slug]` (case-study dossier)
Frontmatter validated by Zod: `title, slug, order, year, role, duration, status ("live"|"building"|"archived"|"placeholder"), summary, tagline, stack[], tags[], github, live, demo_video, cover, gallery[], metrics[], featured, glyph (Α-Ω letter), repoStats (auto)`.
Sections in order:
1. **Hero:** `PROJECT 0X // {GREEK NUMERAL}` label, title in giant Fraunces (letters reveal with the Greek-scramble from 6.A), spec rows (Role / Year / Duration / Stack / Status / Author: Jeel Nada (solarquack)), buttons `Open code ↗`, `Live ↗`, `Video ↗`.
2. **Cover:** full-bleed `<BoneImage>` or generative placeholder; clip-path expand `inset(8%) → 0` on scroll; hover dissolves to color.
3. **Overview:** sticky left label + right text (Problem in 3-4 plain sentences).
4. `01 // PROBLEM`, `02 // APPROACH`, `03 // BUILD`, `04 // LEARNED`: sticky left heading, right prose (62ch), `shiki` code blocks with filename label and copy button (`COPY` cursor).
5. **Architecture:** reusable `<Diagram nodes edges>` SVG where edges draw in on scroll and nodes light up in sequence.
6. **Gallery:** pinned horizontal scroll (ScrollTrigger pin, scrub 1); mobile = vertical stack. Items dim at rest, color on hover.
7. **Metrics** (only if real data): mono numbers count up; hide if empty.
8. **Stack with reasons:** row per tool + one line why.
9. **Repo block:** live stars/forks/last commit from the GitHub API with fallback.
10. **Next project:** full-width block with next title in giant text; on hover it fills `--sun`; at scroll end it expands to full screen (scrubbed) and transitions.
Also: `generateStaticParams`, per-project OG image (`next/og`, dithered cover), metadata, JSON-LD `SoftwareSourceCode`.

### 7.3 `/about` (ΑΝΘΡΩΠΟΣ)
- Opening line: "I'm Jeel Nada, online as solarquack." as a huge scroll-revealed sentence.
- Sticky `<PortraitPlaceholder>` (or processed `me.jpg`) left; right: three short paragraphs (education path, what got me into code, what I'm into now) from data.
- Full-width `forge-anvil` band with parallax and sparks.
- **Now block:** `Building / Learning / Reading / Listening` spec rows with an `Updated {date}` stamp.
- **Beyond code:** horizontally draggable (Draggable + inertia, cursor `DRAG`) row of small placeholder plates (dithered noise with captions) that I will fill later.
- Pinned scroll **timeline of years** (school → college → first project → hackathon → internship), text swapping scrubbed.
- CTA to `/resume` and `/contact`.

### 7.4 `/resume` (ΒΙΟΣ)
- Toggle: `Web` / `PDF`. Web view is a typographic dossier: header `Jeel Nada` (large) + `a.k.a. solarquack` (mono) + contact row; sections: Summary, Education, Experience, Projects (top 4, linked), Skills (grouped), Achievements, Leadership. Mono dates in the left column, content right, 1px rules, mask reveals on scroll; `hand-laurel.bone` as a decorative side art that sticky-follows.
- Sticky action bar: `Download PDF` (file `Jeel-Nada-Resume.pdf`), `Copy email`, `LinkedIn`.
- `@media print`: clean single-page A4, black on white, hides cursor/nav/grain/art.
- PDF view: `<object>` embed with a fallback link. `Last updated {date}` stamp. JSON-LD `Person`.

### 7.5 `/contact` (ΕΠΑΦΗ)
- Header `Say hello.` over a darkened `ruins-columns`; a small sun disc slowly rotates a Greek ring text.
- Contact methods as huge rows (Email, Phone, LinkedIn Jeel Nada, GitHub solarquack, Instagram solarquack). Hover: bone fill sweeps left to right, text inverts, arrow rotates `↗ → →`. Email/phone rows copy on click (toast `COPIED ✓`), a secondary icon uses `mailto:`/`tel:`.
- Form (fields Name, Email, Message, honeypot): underline inputs, floating mono labels, Zod validation, char count; **Resend** route handler `app/api/contact/route.ts` (env `RESEND_API_KEY`, `CONTACT_TO_EMAIL`), simple rate limit; success: form collapses and a `MESSAGE SENT // ΕΣΤΑΛΗ` dossier card animates in; if env missing, fall back to `mailto:` with prefilled body signed "Jeel Nada".
- Sidebar: local time, response expectation "within 48 hours", availability dot (sun, pulsing).

### 7.6 `/log` (ΗΜΕΡΟΛΟΓΙΟ)
A changelog-style page (reference: ryoku's changelog): entries from `src/data/log.ts` `{date, version?, title, body, tags}` (learning milestones, shipped features, hackathons, certificates). Newest first, sticky month headers, entries reveal with mask, filter chips, and a "v{n}" counter. Seed with 3 TODO entries including `Portfolio v1.0 launched`.

### 7.7 `/not-found` (ΑΝΥΠΑΡΚΤΟ)
Fractured bust large, its gold seams pulsing; giant `404`; line: "This page doesn't exist. The work does." with button home. Cursor torch lights the bust (reuse the shader as a simple 2D version). One quack easter egg (hover bottom-left corner shows a tiny mono `quack.`).

---

## 8. PROJECT SYSTEM (so I can add projects later by command)

### 8.1 Seed with 6 placeholder projects
Create 6 entries with `status: "placeholder"`, Greek numeral glyphs Α-Ζ, titles like `Project Alpha`…, summaries `TODO`, and the generative `<ProjectPlaceholder>` cover. Each has an MDX file with the full case-study skeleton (all sections with `TODO` text) so the page renders fully. Mark them clearly with a `PLACEHOLDER` badge. Placeholders never count in the displayed "projects shipped" stat.

### 8.2 Single source of truth
`src/content/projects/{slug}.mdx` (frontmatter + body). Everything else (home gallery, work page, armory `used in`, counters, sitemap, OG, command palette, next-project links, resume projects) derives from this folder via `getAllProjects()` in `src/lib/projects.ts`. Never duplicate project data.

### 8.3 CLI: `pnpm add-project`
Interactive script (`scripts/add-project.mjs`, `prompts` package) that asks: title, slug (auto), tagline, summary, role, year, duration, status, stack (comma), tags (comma), GitHub URL, live URL, video URL, featured (y/n), cover image path (optional), gallery image paths (optional). It then: creates the MDX from the skeleton, copies images to `public/projects/{slug}/`, runs the bone-dither pipeline for each, sets `order`, **removes/replaces the oldest `placeholder` entry** (asks to confirm), fetches repo stats if a GitHub URL is given, runs `tsc` + `next build --dry` style validation (Zod), and prints the new URL.
Also supports non-interactive: `pnpm add-project --json path/to/project.json`.

### 8.4 `AGENTS.md` (create in repo root; you or any future agent follows it)
```
# Adding a project (when the owner says "add this project: ...")
1. Parse the details the owner gave: title, what it is, why built, hardest part, result (only real), stack, links (GitHub/live/video), images.
2. Run `pnpm add-project --json` with those fields (never invent metrics or links; use TODO for anything missing and tell the owner exactly what is missing).
3. If images were provided, put them in assets-raw/projects/{slug}/ and run `pnpm assets`.
4. Write the case-study body in the owner's voice using the rules in section 11 of the prompt (plain, specific, first person, no banned words).
5. Replace the oldest placeholder if any remain; keep featured projects to at most 6, ordered by `order`.
6. Run `pnpm lint && pnpm build`. Report the URL, what was added, and any TODOs.

# Editing content
All content is in src/data and src/content. Do not hardcode text in components.
```

### 8.5 Intake template (also generate `PROJECT_TEMPLATE.md` for me)
```
Title:
One-line tagline:
What it is (1 line):
Why I built it (1 line):
Hardest part (1 line):
Result (real numbers only, or skip):
Stack:
Links: GitHub / Live / Video
Images: (paths or drop into assets-raw/projects/{slug}/)
Status: live | building | archived
Featured: yes/no
```

---

## 9. MOTION SYSTEM RULES

- `src/lib/motion.ts` exports eases (`expo.out`, `expo.inOut`, `power3.out`), durations (`fast .3`, `base .7`, `slow 1.2`) and helpers: `revealLines`, `revealChars`, `scrambleText` (Greek/Latin), `maskUp`, `drawLine`, `countUp`, `magnetic`, `parallax`, `ditherDissolve`, `flipFilter`.
- One `useGsap` hook wrapping `gsap.context()` with `ctx.revert()` cleanup; register plugins once in a client provider; `ScrollTrigger.refresh()` after `document.fonts.ready` and `load`.
- Animate only `transform`, `opacity`, `clip-path`, and font-variation-settings on the hero name. No scroll-linked `width/height/top/left/box-shadow/blur`.
- `will-change` only during animation.
- `gsap.matchMedia()` for all breakpoints and for `prefers-reduced-motion: reduce`: no Lenis, no parallax, no preloader, no WebGL, no marquee motion, no cursor; elements fade in at `.2s`. The site must remain fully usable and still look good.
- Touch: disable cursor, hover previews, magnetic; keep reveals and pinned sections where performant.
- **Performance budgets:** Lighthouse mobile Performance ≥ 90 (the R3F hero must not block LCP: render a `<BoneImage>` poster first, then swap to WebGL after idle), LCP < 2.5s, CLS < 0.05, TBT < 200ms, first-load JS < 200KB gzip excluding the lazy R3F chunk, images AVIF/WebP via `next/image` with `sizes`, fonts subset.

---

## 10. FOLDER STRUCTURE (follow exactly)

```
/assets-raw             (my generated art; see section 3)
/scripts                (process-assets.mjs, add-project.mjs)
/public/art             (processed art + manifest.json)  /public/projects  /public/audio  /public/resume.pdf
/src
  /app  layout.tsx page.tsx globals.css
        /work (page.tsx, /[slug]/page.tsx)  /about  /resume  /contact  /log
        /api/contact/route.ts  not-found.tsx  sitemap.ts  robots.ts  opengraph-image.tsx
  /components
    /ui        Button Magnetic TextRoll Cursor Marquee Tag Rule Toast SpecRow GhostGlyph BoneImage AssetPlaceholder PortraitPlaceholder ProjectPlaceholder Countdown Scramble
    /layout    Nav MobileMenu Footer PageTransition Preloader Grain CornerMarks SoundToggle
    /sections  Hero Marquee WhatItIs TwinPanels WorkShowroom Armory GithubBlock Path Status About Faq ContactCta
    /three     HeroScene.tsx shaders/hero.frag.glsl shaders/hero.vert.glsl Embers.tsx
    /project   Lightbox Diagram Gallery CodeBlock NextProject MetaTable
    /command   CommandPalette
  /content/projects/*.mdx
  /data  site.ts glyphs.ts hero.ts now.ts faq.ts skills.ts experience.ts education.ts achievements.ts log.ts github-snapshot.json
  /lib   motion.ts gsap.ts lenis.tsx github.ts projects.ts schema.ts utils.ts
  /hooks useGsap.ts useMedia.ts useMouse.ts useTime.ts useSound.ts
AGENTS.md  PROJECT_TEMPLATE.md  DECISIONS.md  README.md  .env.example
```

---

## 11. COPY RULES (the voice)

I'm a student; honesty beats hype. First person, plain, specific, a little dry. Short sentences. Say what I built, with what, and what broke. No adjectives about myself.
- Bad: "I'm a passionate full-stack developer crafting seamless experiences."
- Good: "I'm a CSE student in Bengaluru. I build web apps and small ML tools, and I like fixing the bug nobody else wants to open."
- Positioning line (hero): max 18 words, specific, no buzzwords.
- Project text pattern: What it is → Why I built it → Hardest part → Result (real, or omitted).
- Buttons are verbs: `View work`, `Open code`, `Copy email`, `Download PDF`.
- Leave `TODO` markers wherever you would have to invent a fact, and list them in the final report.

---

## 12. ACCESSIBILITY, SEO, QUALITY

- Semantic HTML, one `h1` per page, skip link, visible `:focus-visible` (2px `--sun`, 3px offset); everything keyboard reachable; custom cursor never replaces focus styles.
- AA contrast (bone on black passes; text on `--sun` is `#070706`).
- Letter-split text keeps `aria-label` on the parent and `aria-hidden` on the spans; scrambled Greek glyphs are `aria-hidden`.
- Decorative art `alt=""`; meaningful images have real `alt`.
- Do not break native keyboard scroll, anchors, or Find-in-page; hash links use `lenis.scrollTo`.
- Metadata per page, canonical, OG/Twitter, sitemap, robots, JSON-LD (`Person`, `SoftwareSourceCode`), SVG favicon with dark/light variants, `theme-color`.
- `tsc --noEmit` and `eslint` clean; `next build` passes; zero console errors/warnings.
- Test at 360, 390, 768, 1024, 1280, 1440, 1920; no horizontal scroll at any width; hero works at 360px.

---

## 13. WORK ORDER (commit after each step)

1. Scaffold, deps, Tailwind tokens, fonts (Fraunces variable, GFS Didot, Geist, JetBrains Mono), globals, grain, corner marks, theme toggle (no flash).
2. `motion.ts`, GSAP/Lenis providers, `useGsap`, reduced-motion handling.
3. `scripts/process-assets.mjs` + `AssetPlaceholder` + `manifest.json`; test with zero assets and with sample assets.
4. Layout shell: Nav, MobileMenu, Footer, Cursor, Preloader, PageTransition, Sound, CommandPalette.
5. Data files with Zod and seed content; project system (8.1-8.5) and 6 placeholders.
6. Home: Hero (shader, name, HUD, marquee) first and get it perfect; then 6.B through 6.K.
7. `/work`, `/work/[slug]`, then `/about`, `/resume` (+ print CSS), `/contact` (+ API), `/log`, 404.
8. SEO, OG images, sitemap, JSON-LD.
9. QA: anti-slop checklist (2.7), a11y (12), performance (9), every hover state, every breakpoint, reduced motion, bone mode, missing-asset mode, with-asset mode.
10. Write `README.md` (edit data, run `pnpm assets`, `pnpm add-project`, env vars, deploy) and `DECISIONS.md`.

## 14. DEFINITION OF DONE

- `pnpm assets`, `pnpm lint`, `pnpm build` all pass; Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO 100.
- Every page has: custom cursor, glyph system, entrance motion, and its own scroll motion.
- I can change content only through `src/data`, `src/content`, and `pnpm add-project`.
- With no art files the site builds and looks intentional; with art files the hero shows the dithered Hercules reacting to the cursor torch.
- All links work; external links use `rel="noopener noreferrer" target="_blank"`.
- Nothing visible is placeholder text except deliberate `TODO`/`PLACEHOLDER` markers.
- If any section looks like a generic template, redesign it before reporting done.

**Final report format:** (1) what you built, (2) every `TODO` I must fill, (3) the commands to run locally and deploy, (4) any asset that was missing or looked wrong.
