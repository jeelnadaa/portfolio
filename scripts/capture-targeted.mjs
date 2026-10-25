import puppeteer from "puppeteer-core";
import path from "node:path";
import fs from "node:fs/promises";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUT_DIR = path.resolve(process.cwd(), "brag-output/captures");

async function dismissPreloader(page) {
  try {
    await page.evaluate(() => {
      const preloader = document.querySelector("[class*='z-[99999]']") || document.querySelector("[class*='fixed inset-0 z-']");
      if (preloader) preloader.remove();
    });
  } catch (e) {}
  await new Promise((r) => setTimeout(r, 600));
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu", "--hide-scrollbars"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  // 1. Capture Modal on Home
  console.log("Navigating to http://localhost:3000 ...");
  await page.goto("http://localhost:3000", { waitUntil: "networkidle0", timeout: 30000 });
  await dismissPreloader(page);

  // Click PlantIQ Card via evaluate
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll("[data-cursor='VIEW']"));
    const plantIqCard = cards.find(c => c.textContent.includes("PlantIQ") || c.textContent.includes("02"));
    if (plantIqCard) plantIqCard.click();
  });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(OUT_DIR, "desktop-modal-plantiq.png") });
  console.log("✓ Captured desktop-modal-plantiq.png");

  // 2. Navigate to PlantIQ case study page
  console.log("Navigating to http://localhost:3000/work/plantiq-capstone ...");
  await page.goto("http://localhost:3000/work/plantiq-capstone", { waitUntil: "networkidle0", timeout: 30000 });
  await dismissPreloader(page);

  // Scroll to Diagram
  await page.evaluate(() => {
    // Look for SVG containing nodes
    const allSvgs = Array.from(document.querySelectorAll("svg"));
    const diag = allSvgs.find(s => s.getAttribute("viewBox")?.includes("1320") || s.querySelector("rect"));
    if (diag) {
      diag.scrollIntoView({ behavior: "instant", block: "center" });
    } else {
      window.scrollBy({ top: 1800, behavior: "instant" });
    }
  });

  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(OUT_DIR, "desktop-plantiq-architecture.png") });
  console.log("✓ Captured desktop-plantiq-architecture.png");

  // 3. Capture Armory on Home
  await page.goto("http://localhost:3000", { waitUntil: "networkidle0", timeout: 30000 });
  await dismissPreloader(page);
  await page.evaluate(() => {
    const armory = document.getElementById("armory") || Array.from(document.querySelectorAll("section")).find(s => s.textContent.includes("ARMORY") || s.textContent.includes("ΟΠΛΟΘΗΚΗ"));
    if (armory) armory.scrollIntoView({ behavior: "instant", block: "start" });
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUT_DIR, "desktop-armory.png") });
  console.log("✓ Captured desktop-armory.png");

  await browser.close();
  console.log("All targeted screenshots captured successfully.");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
