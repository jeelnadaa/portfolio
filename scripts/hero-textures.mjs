import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const OUT_DIR = path.resolve(process.cwd(), "public/art");

// The WebGL hero never draws the statue wider than ~1000 CSS px, so the full
// 3388px source only costs download time and GPU memory. Depth and mask are
// blurred and sampled softly, so they can be smaller still.
const TEXTURES = [
  { from: "hero-hercules.color.webp", to: "hero-hercules.color.tex.webp", width: 1600, webp: { quality: 85 } },
  { from: "hero-hercules.depth.png", to: "hero-hercules.depth.tex.webp", width: 1024, webp: { quality: 85 }, grey: true },
  { from: "hero-hercules.mask.png", to: "hero-hercules.mask.tex.webp", width: 1024, webp: { lossless: true }, grey: true },
];

export async function buildHeroTextures() {
  for (const t of TEXTURES) {
    let img = sharp(path.join(OUT_DIR, t.from)).resize({ width: t.width });
    if (t.grey) img = img.toColourspace("b-w");
    const info = await img.webp(t.webp).toFile(path.join(OUT_DIR, t.to));
    console.log(`✓ ${t.to} (${info.width}x${info.height}, ${Math.round(info.size / 1024)} KB)`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  buildHeroTextures().catch((err) => {
    console.error("Error building hero textures:", err);
    process.exit(1);
  });
}
