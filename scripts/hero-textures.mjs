import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const OUT_DIR = path.resolve(process.cwd(), "public/art");

// The WebGL hero never draws the statue wider than ~1000 CSS px, so the full
// 3388px source only costs download time and GPU memory. Depth and mask are
// blurred and sampled softly, so they can be smaller still.
const TEXTURES = [
  { from: "hero-hercules.color.webp", to: "hero-hercules.color.tex.webp", width: 1600, webp: { quality: 85 } },
  { from: "hero-hercules.depth.png", to: "hero-hercules.depth.tex.webp", width: 1024, webp: { quality: 85 } },
];

const MASK = { to: "hero-hercules.mask.tex.webp", width: 1024 };

// hero-hercules.mask.png does not match the colour statue (it is a looser blob
// from another pose), and the shader paints its overhang as a black halo. So the
// texture mask is cut from the colour image itself: marble on a black background.
// sharp applies each operation once per pipeline, hence one pass per step.
async function buildMaskTexture() {
  const pass = (input, fn) => fn(sharp(input)).toBuffer();
  let mask = await pass(path.join(OUT_DIR, TEXTURES[0].from), (img) =>
    img.resize({ width: MASK.width }).greyscale().threshold(48)
  );
  mask = await pass(mask, (img) => img.blur(8)); // spread into small dark gaps...
  mask = await pass(mask, (img) => img.threshold(60)); // ...and close them
  const info = await sharp(mask)
    .blur(0.8) // soft outline instead of jagged pixels
    .toColourspace("srgb")
    .webp({ lossless: true })
    .toFile(path.join(OUT_DIR, MASK.to));
  console.log(`✓ ${MASK.to} (${info.width}x${info.height}, ${Math.round(info.size / 1024)} KB)`);
}

export async function buildHeroTextures() {
  for (const t of TEXTURES) {
    const info = await sharp(path.join(OUT_DIR, t.from))
      .resize({ width: t.width })
      .webp(t.webp)
      .toFile(path.join(OUT_DIR, t.to));
    console.log(`✓ ${t.to} (${info.width}x${info.height}, ${Math.round(info.size / 1024)} KB)`);
  }
  await buildMaskTexture();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  buildHeroTextures().catch((err) => {
    console.error("Error building hero textures:", err);
    process.exit(1);
  });
}
