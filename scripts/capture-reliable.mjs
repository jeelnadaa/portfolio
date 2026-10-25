import puppeteer from "puppeteer-core";
import path from "node:path";
import fs from "node:fs/promises";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUT_DIR = path.resolve(process.cwd(), "brag-output/captures");

async function setupPage(browser, width, height) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 2 });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  return page;
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu", "--hide-scrollbars"],
  });

  // 1. Desktop captures (1440x900)
  const page = await setupPage(browser, 1440, 900);

  console.log("Loading Home page...");
  await page.goto("http://localhost:3000", { waitUntil: "networkidle0", timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUT_DIR, "desktop-hero.png") });
  console.log("✓ Saved desktop-hero.png");

  // Scroll to Showroom / Projects
  await page.evaluate(() => {
    const el = document.getElementById("work") || document.querySelector("section#work");
    if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT_DIR, "desktop-showroom.png") });
  console.log("✓ Saved desktop-showroom.png");

  // Open modal for PlantIQ
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll("[data-cursor='VIEW']"));
    const plantIqCard = cards.find((c) => c.textContent.includes("PlantIQ") || c.textContent.includes("02"));
    if (plantIqCard) {
      plantIqCard.click();
    }
  });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(OUT_DIR, "desktop-modal-plantiq.png") });
  console.log("✓ Saved desktop-modal-plantiq.png");

  // Scroll to Armory
  await page.keyboard.press("Escape");
  await new Promise((r) => setTimeout(r, 500));
  await page.evaluate(() => {
    const armory = document.getElementById("armory") || document.querySelector("section#armory");
    if (armory) armory.scrollIntoView({ behavior: "instant", block: "start" });
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT_DIR, "desktop-armory.png") });
  console.log("✓ Saved desktop-armory.png");

  // 2. Case study page: PlantIQ
  console.log("Loading PlantIQ case study...");
  await page.goto("http://localhost:3000/work/plantiq-capstone", { waitUntil: "networkidle0", timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUT_DIR, "desktop-plantiq-hero.png") });
  console.log("✓ Saved desktop-plantiq-hero.png");

  // Scroll to Architecture Diagram
  await page.evaluate(() => {
    // Find heading or container for architecture
    const headings = Array.from(document.querySelectorAll("h2, h3, h4"));
    const archH = headings.find((h) => h.textContent.toLowerCase().includes("architecture"));
    if (archH) {
      archH.scrollIntoView({ behavior: "instant", block: "center" });
    } else {
      window.scrollBy({ top: 1600, behavior: "instant" });
    }
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUT_DIR, "desktop-plantiq-architecture.png") });
  console.log("✓ Saved desktop-plantiq-architecture.png");

  // 3. Mobile captures
  console.log("Loading Mobile viewports...");
  const mPage = await setupPage(browser, 390, 844);
  await mPage.goto("http://localhost:3000", { waitUntil: "networkidle0", timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1000));
  await mPage.screenshot({ path: path.join(OUT_DIR, "mobile-hero.png") });
  console.log("✓ Saved mobile-hero.png");

  await mPage.goto("http://localhost:3000/work/plantiq-capstone", { waitUntil: "networkidle0", timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1000));
  await mPage.screenshot({ path: path.join(OUT_DIR, "mobile-plantiq.png") });
  console.log("✓ Saved mobile-plantiq.png");

  await browser.close();
  console.log("All captures completed successfully!");
}

main().catch((err) => {
  console.error("Capture failed:", err);
  process.exit(1);
});
