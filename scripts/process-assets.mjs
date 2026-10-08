import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const RAW_DIR = path.resolve(process.cwd(), "assets-raw");
const OUT_DIR = path.resolve(process.cwd(), "public/art");
const AUDIO_OUT_DIR = path.resolve(process.cwd(), "public/audio");

const BONE_RGB = [233, 227, 210]; // #E9E3D2
const GOLD_RGB = [201, 162, 75];  // #C9A24B

const BAYER_8X8 = [
   0, 32,  8, 40,  2, 34, 10, 42,
  48, 16, 56, 24, 50, 18, 58, 26,
  12, 44,  4, 36, 14, 46,  6, 38,
  60, 28, 52, 20, 62, 30, 54, 22,
   3, 35, 11, 43,  1, 33,  9, 41,
  51, 19, 59, 27, 49, 17, 57, 25,
  15, 47,  7, 39, 13, 45,  5, 37,
  63, 31, 55, 23, 61, 29, 53, 21,
].map((v) => (v + 0.5) / 64);

// Parse CLI flags
const args = process.argv.slice(2);
function getArg(flag, fallback) {
  const index = args.indexOf(flag);
  return index !== -1 && args[index + 1] ? args[index + 1] : fallback;
}
const thresholdVal = Number.parseInt(getArg("--threshold", "26"), 10);
const ditherScale = Number.parseInt(getArg("--px", "2"), 10);

async function ensureDirs() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.mkdir(AUDIO_OUT_DIR, { recursive: true });
  await fs.mkdir(path.resolve(process.cwd(), "public"), { recursive: true });

  // Copy Resume.pdf to public if exists
  const rootResume = path.resolve(process.cwd(), "Resume.pdf");
  try {
    await fs.access(rootResume);
    await fs.copyFile(rootResume, path.resolve(process.cwd(), "public/resume.pdf"));
    await fs.copyFile(rootResume, path.resolve(process.cwd(), "public/Jeel-Nada-Resume.pdf"));
    console.log("✓ Copied Resume.pdf to public/resume.pdf & public/Jeel-Nada-Resume.pdf");
  } catch {
    // Resume not in root
  }
}

function computeLuminance(r, g, b) {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function isGoldPixel(r, g, b) {
  return r > 120 && g > 80 && b < 100 && r > b * 1.3 && g > b * 1.05;
}

/**
 * Flood-fill from borders for dark background removal (< threshold)
 * Interior dark shadows stay intact.
 */
function createEdgeFloodFillMask(buffer, width, height, threshold) {
  const mask = new Uint8Array(width * height); // 1 = foreground (opaque), 0 = background (transparent)
  mask.fill(1);

  const visited = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let qHead = 0;
  let qTail = 0;

  function push(x, y) {
    const idx = y * width + x;
    if (visited[idx] === 0) {
      visited[idx] = 1;
      const pIdx = idx * 4;
      const lum = computeLuminance(buffer[pIdx], buffer[pIdx + 1], buffer[pIdx + 2]);
      if (lum < threshold) {
        mask[idx] = 0;
        queue[qTail++] = idx;
      }
    }
  }

  // Push all 4 outer edges
  for (let x = 0; x < width; x++) {
    push(x, 0);
    push(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    push(0, y);
    push(width - 1, y);
  }

  // BFS flood fill
  while (qHead < qTail) {
    const currIdx = queue[qHead++];
    const cx = currIdx % width;
    const cy = Math.floor(currIdx / width);

    // 4 neighbors
    const neighbors = [
      [cx + 1, cy],
      [cx - 1, cy],
      [cx, cy + 1],
      [cx, cy - 1],
    ];

    for (let i = 0; i < 4; i++) {
      const [nx, ny] = neighbors[i];
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIdx = ny * width + nx;
        if (visited[nIdx] === 0) {
          visited[nIdx] = 1;
          const pIdx = nIdx * 4;
          const lum = computeLuminance(buffer[pIdx], buffer[pIdx + 1], buffer[pIdx + 2]);
          if (lum < threshold) {
            mask[nIdx] = 0;
            queue[qTail++] = nIdx;
          }
        }
      }
    }
  }

  return mask;
}

/**
 * 1px Morphological erosion of the mask to remove soft fringe glow
 */
function erodeMask(mask, width, height) {
  const eroded = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (mask[idx] === 0) {
        eroded[idx] = 0;
        continue;
      }
      let borderFound = false;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || nx >= width || ny < 0 || ny >= height || mask[ny * width + nx] === 0) {
            borderFound = true;
            break;
          }
        }
        if (borderFound) break;
      }
      eroded[idx] = borderFound ? 0 : 1;
    }
  }
  return eroded;
}

/**
 * Dilation of mask by N pixels
 */
function dilateMask(mask, width, height, radius = 3) {
  const dilated = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let isOpaque = false;
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            if (mask[ny * width + nx] === 1) {
              isOpaque = true;
              break;
            }
          }
        }
        if (isOpaque) break;
      }
      dilated[y * width + x] = isOpaque ? 1 : 0;
    }
  }
  return dilated;
}

/**
 * Bayer 8x8 Dithering on RGBA buffer
 */
function applyBayerDither(rgbaBuffer, mask, width, height, scale, isBust = false) {
  const dithered = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    const by = Math.floor(y / scale) % 8;
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const pIdx = idx * 4;

      const r = rgbaBuffer[pIdx];
      const g = rgbaBuffer[pIdx + 1];
      const b = rgbaBuffer[pIdx + 2];

      // Preserve gold seams on bust
      if (isBust && isGoldPixel(r, g, b)) {
        dithered[pIdx] = GOLD_RGB[0];
        dithered[pIdx + 1] = GOLD_RGB[1];
        dithered[pIdx + 2] = GOLD_RGB[2];
        dithered[pIdx + 3] = 255;
        continue;
      }

      const lum = computeLuminance(r, g, b) / 255;
      const bx = Math.floor(x / scale) % 8;
      const threshold = BAYER_8X8[by * 8 + bx];

      if (lum > threshold) {
        dithered[pIdx] = BONE_RGB[0];
        dithered[pIdx + 1] = BONE_RGB[1];
        dithered[pIdx + 2] = BONE_RGB[2];
        dithered[pIdx + 3] = 255;
      } else {
        dithered[pIdx] = 14;
        dithered[pIdx + 1] = 13;
        dithered[pIdx + 2] = 11;
        dithered[pIdx + 3] = 255;
      }
    }
  }
  return dithered;
}

async function processSingleImage(fileName, baseName) {
  const rawPath = path.join(RAW_DIR, fileName);
  console.log(`Processing: ${fileName}...`);

  const image = sharp(rawPath);
  const metadata = await image.metadata();
  const width = metadata.width;
  const height = metadata.height;

  // Extract raw RGBA
  const { data: rawRgba } = await sharp(rawPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // 1. Flood-fill edge mask
  const rawMask = createEdgeFloodFillMask(rawRgba, width, height, thresholdVal);
  // Erode 1px
  const erodedMask = erodeMask(rawMask, width, height);

  // Create alpha-feathered color buffer
  const alphaBuffer = Buffer.alloc(width * height);
  for (let i = 0; i < width * height; i++) {
    alphaBuffer[i] = erodedMask[i] === 1 ? 255 : 0;
  }

  // Feather alpha by 1.5px using sharp blur
  const featheredAlpha = await sharp(alphaBuffer, {
    raw: { width, height, channels: 1 },
  })
    .blur(1.5)
    .toBuffer();

  // Combine raw RGB with feathered alpha
  const cutoutRgba = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const pIdx = i * 4;
    cutoutRgba[pIdx] = rawRgba[pIdx];
    cutoutRgba[pIdx + 1] = rawRgba[pIdx + 1];
    cutoutRgba[pIdx + 2] = rawRgba[pIdx + 2];
    cutoutRgba[pIdx + 3] = featheredAlpha[i];
  }

  // Output mask.png
  await sharp(featheredAlpha, { raw: { width, height, channels: 1 } })
    .png()
    .toFile(path.join(OUT_DIR, `${baseName}.mask.png`));

  // For continuous tone color images, export raw uncorrupted pixels with solid alpha
  // to prevent dark shadows on statues from getting cut out
  await sharp(rawRgba, { raw: { width, height, channels: 4 } })
    .webp({ quality: 90 })
    .toFile(path.join(OUT_DIR, `${baseName}.color.webp`));

  await sharp(rawRgba, { raw: { width, height, channels: 4 } })
    .avif({ quality: 85 })
    .toFile(path.join(OUT_DIR, `${baseName}.color.avif`));

  // Output .bone.png (Bayer 8x8 dithered on raw pixels)
  const isBust = baseName === "bust-fractured";
  const ditheredBuffer = applyBayerDither(rawRgba, rawMask, width, height, ditherScale, isBust);

  await sharp(ditheredBuffer, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT_DIR, `${baseName}.bone.png`));

  // Responsive widths from clean raw pixels
  const responsiveSizes = [640, 1280, 2048].filter((w) => w < width);
  for (const w of responsiveSizes) {
    await sharp(rawRgba, { raw: { width, height, channels: 4 } })
      .resize({ width: w })
      .webp({ quality: 85 })
      .toFile(path.join(OUT_DIR, `${baseName}-${w}.webp`));
  }

  console.log(`✓ Processed ${baseName} (mask, color.webp, color.avif, bone.png)`);

  return {
    width,
    height,
    aspectRatio: Number((width / height).toFixed(4)),
    erodedMask,
  };
}

async function processDepthMap(heroData) {
  const depthFile = "hero-hercules-depth.png";
  const rawDepthPath = path.join(RAW_DIR, depthFile);
  const outDepthPath = path.join(OUT_DIR, "hero-hercules.depth.png");

  let hasProvided = false;
  try {
    await fs.access(rawDepthPath);
    hasProvided = true;
  } catch {
    hasProvided = false;
  }

  const { width, height, erodedMask } = heroData;

  // Dilate statue mask by 3px
  const dilated = dilateMask(erodedMask, width, height, 3);

  let depthBuffer;

  if (hasProvided) {
    console.log("Processing provided depth map hero-hercules-depth.png...");
    // Resize depth to match hero dimensions exactly
    const resizedDepth = await sharp(rawDepthPath)
      .resize(width, height, { fit: "fill" })
      .toColourspace("b-w")
      .raw()
      .toBuffer();

    // Multiply by dilated mask and remap statue range to 0.15 - 1.0
    let minVal = 255;
    let maxVal = 0;
    for (let i = 0; i < width * height; i++) {
      if (dilated[i] === 1) {
        const v = resizedDepth[i];
        if (v < minVal) minVal = v;
        if (v > maxVal) maxVal = v;
      }
    }
    if (maxVal <= minVal) maxVal = 255;

    depthBuffer = Buffer.alloc(width * height);
    for (let i = 0; i < width * height; i++) {
      if (dilated[i] === 0) {
        depthBuffer[i] = 0;
      } else {
        const normalized = (resizedDepth[i] - minVal) / (maxVal - minVal);
        const remapped = 0.15 + 0.85 * normalized;
        depthBuffer[i] = Math.round(Math.min(255, Math.max(0, remapped * 255)));
      }
    }
  } else {
    console.warn("⚠️ hero-hercules-depth.png missing; synthesizing depth map...");
    depthBuffer = Buffer.alloc(width * height);
    const cx = width / 2;
    const cy = height * 0.45;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        if (dilated[idx] === 0) {
          depthBuffer[idx] = 0;
        } else {
          const dx = (x - cx) / (width * 0.4);
          const dy = (y - cy) / (height * 0.5);
          const dist = Math.sqrt(dx * dx + dy * dy);
          const val = Math.max(0, 1.0 - dist);
          const remapped = 0.15 + 0.85 * val;
          depthBuffer[idx] = Math.round(remapped * 255);
        }
      }
    }
  }

  // 2px Gaussian blur on depth map
  await sharp(depthBuffer, { raw: { width, height, channels: 1 } })
    .blur(2)
    .png()
    .toFile(outDepthPath);

  console.log("✓ Generated clean hero-hercules.depth.png");
}

async function main() {
  await ensureDirs();

  const manifest = {};

  let rawFiles = [];
  try {
    rawFiles = await fs.readdir(RAW_DIR);
  } catch (err) {
    console.error("Failed to read assets-raw directory:", err);
  }

  let heroData = null;

  for (const file of rawFiles) {
    if (file.endsWith(".mp3") || file.endsWith(".wav") || file.endsWith(".ogg")) {
      await fs.copyFile(path.join(RAW_DIR, file), path.join(AUDIO_OUT_DIR, file));
      console.log(`✓ Copied audio: ${file}`);
      continue;
    }

    if (!file.endsWith(".png") && !file.endsWith(".jpg") && !file.endsWith(".jpeg") && !file.endsWith(".webp")) {
      continue;
    }

    if (file === "hero-hercules-depth.png") {
      // Handled separately
      continue;
    }

    const baseName = file.replace(/\.(png|jpg|jpeg|webp)$/, "");
    try {
      const result = await processSingleImage(file, baseName);
      manifest[baseName] = {
        width: result.width,
        height: result.height,
        aspectRatio: result.aspectRatio,
        colorWebp: `/art/${baseName}.color.webp`,
        colorAvif: `/art/${baseName}.color.avif`,
        bonePng: `/art/${baseName}.bone.png`,
        maskPng: `/art/${baseName}.mask.png`,
      };

      if (baseName === "hero-hercules") {
        heroData = { ...result, baseName };
      }
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  }

  if (heroData) {
    await processDepthMap(heroData);
    manifest["hero-hercules"].depthPng = "/art/hero-hercules.depth.png";
  }

  // Write manifest.json
  const manifestPath = path.join(OUT_DIR, "manifest.json");
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), "utf8");
  console.log("✓ Manifest written to public/art/manifest.json");
}

main().catch((err) => {
  console.error("Error in process-assets:", err);
  process.exit(1);
});
