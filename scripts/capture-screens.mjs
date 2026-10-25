import puppeteer from "puppeteer-core";
import path from "node:path";
import fs from "node:fs/promises";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUT_DIR = path.resolve(process.cwd(), "brag-output/captures");

async function dismissPreloader(page) {
  try {
    // Try clicking the enter prompt or button
    const btn = await page.$("button, [data-cursor='ENTER'], [class*='handleInitiate']");
    if (btn) {
      await btn.click();
    } else {
      await page.mouse.click(720, 450);
    }
  } catch (e) {
    await page.mouse.click(720, 450);
  }
  await new Promise((r) => setTimeout(r, 1200));

  // Ensure preloader element is hidden
  await page.evaluate(() => {
    const preloader = document.querySelector("[class*='z-[99999]']") || document.querySelector("[class*='fixed inset-0 z-']");
    if (preloader && preloader.textContent?.includes("CLICK TO ENTER")) {
      preloader.remove();
    }
  });
  await new Promise((r) => setTimeout(r, 600));
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu", "--hide-scrollbars"],
  });

  console.log("Browser launched.");

  // 1. Desktop Page
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  // Navigate to Home
  console.log("Navigating to http://localhost:3000 ...");
  await page.goto("http://localhost:3000", { waitUntil: "networkidle0", timeout: 30000 });
  await dismissPreloader(page);

  // Capture Hero
  await page.screenshot({ path: path.join(OUT_DIR, "desktop-hero.png") });
  console.log("✓ Captured desktop-hero.png");

  // Scroll to Work Showroom
  await page.evaluate(() => {
    const el = document.getElementById("work");
    if (el) el.scrollIntoView({ behavior: "instant" });
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT_DIR, "desktop-showroom.png") });
  console.log("✓ Captured desktop-showroom.png");

  // Scroll to Armory (Skills)
  await page.evaluate(() => {
    const el = document.getElementById("armory") || document.querySelector("section:nth-of-type(6)");
    if (el) el.scrollIntoView({ behavior: "instant" });
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT_DIR, "desktop-armory.png") });
  console.log("✓ Captured desktop-armory.png");

  // Navigate to PlantIQ Case Study
  console.log("Navigating to http://localhost:3000/work/plantiq-capstone ...");
  await page.goto("http://localhost:3000/work/plantiq-capstone", { waitUntil: "networkidle0", timeout: 30000 });
  await dismissPreloader(page);

  // Capture PlantIQ Hero with Video Player & Cover Plate
  await page.screenshot({ path: path.join(OUT_DIR, "desktop-plantiq-hero.png") });
  console.log("✓ Captured desktop-plantiq-hero.png");

  // Scroll to PlantIQ Architecture Diagram
  await page.evaluate(() => {
    // Scroll specifically down to the architecture diagram
    const diagSection = document.querySelector("#architecture") || document.querySelector("[class*='diagram']") || document.querySelector("svg");
    if (diagSection) {
      diagSection.scrollIntoView({ behavior: "instant", block: "center" });
    } else {
      window.scrollBy({ top: 1200, behavior: "instant" });
    }
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUT_DIR, "desktop-plantiq-architecture.png") });
  console.log("✓ Captured desktop-plantiq-architecture.png");

  // 2. Mobile Android Viewport (412x915 Pixel 7)
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 412, height: 915, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });

  await mobilePage.goto("http://localhost:3000", { waitUntil: "networkidle0", timeout: 30000 });
  await dismissPreloader(mobilePage);
  await mobilePage.screenshot({ path: path.join(OUT_DIR, "mobile-hero.png") });
  console.log("✓ Captured mobile-hero.png");

  await mobilePage.goto("http://localhost:3000/work/plantiq-capstone", { waitUntil: "networkidle0", timeout: 30000 });
  await dismissPreloader(mobilePage);
  await mobilePage.screenshot({ path: path.join(OUT_DIR, "mobile-plantiq.png") });
  console.log("✓ Captured mobile-plantiq.png");

  await browser.close();
  console.log("All screenshots captured cleanly without preloader.");
}

main().catch((err) => {
  console.error("Error capturing screens:", err);
  process.exit(1);
});
