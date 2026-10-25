import puppeteer from "puppeteer-core";
import path from "node:path";
import fs from "node:fs/promises";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUT_DIR = path.resolve(process.cwd(), "brag-output/captures_trailer");

async function setupPage(browser, width = 1920, height = 1080) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 2 });
  return page;
}

async function dismissPreloader(page) {
  try {
    await page.evaluate(() => {
      const preloader = document.querySelector("[class*='z-[100000]']") || document.querySelector("[class*='z-[99999]']");
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
    args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
  });

  console.log("=== 1. CAPTURING GATE / PRELOADER ===");
  const gatePage = await setupPage(browser);
  await gatePage.goto("http://localhost:3000", { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 400));
  await gatePage.screenshot({ path: path.join(OUT_DIR, "01_gate_prompt.png") });
  console.log("✓ Saved 01_gate_prompt.png");

  // Trigger slice cut animation
  await gatePage.evaluate(() => {
    const btn = document.querySelector("[class*='z-[100000]']") || document.body;
    btn.click();
  });
  await new Promise((r) => setTimeout(r, 220)); // capture mid-slice
  await gatePage.screenshot({ path: path.join(OUT_DIR, "01_gate_sliced.png") });
  console.log("✓ Saved 01_gate_sliced.png");
  await gatePage.close();

  // Create standard page for main site sections
  const page = await setupPage(browser);
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
  await dismissPreloader(page);
  await new Promise((r) => setTimeout(r, 1200));

  console.log("=== 2. CAPTURING HERO & SYSTEM SPECS ===");
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT_DIR, "02_hero_full.png") });
  console.log("✓ Saved 02_hero_full.png");

  // Hero specs detail
  const specsBbox = await page.evaluate(() => {
    const el = document.querySelector("[class*='tracking-dossier']")?.closest(".border") || document.querySelector("section");
    const rect = el.getBoundingClientRect();
    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
  });
  await page.screenshot({ path: path.join(OUT_DIR, "02_hero_specs.png") });
  console.log("✓ Saved 02_hero_specs.png");

  console.log("=== 3. CAPTURING FOUNDATIONS (STRENGTH & CRAFT) ===");
  await page.evaluate(() => {
    const foundations = Array.from(document.querySelectorAll("section")).find(s => s.textContent.includes("FOUNDATIONS"));
    if (foundations) foundations.scrollIntoView({ behavior: "instant", block: "start" });
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT_DIR, "03_foundations_bone.png") });
  console.log("✓ Saved 03_foundations_bone.png");

  // Hover over Strength (left sculpture)
  await page.evaluate(() => {
    const strength = Array.from(document.querySelectorAll("div")).find(d => d.textContent.includes("01 // STRENGTH") && d.classList.contains("border"));
    if (strength) {
      strength.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    }
  });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUT_DIR, "03_foundations_strength_hover.png") });
  console.log("✓ Saved 03_foundations_strength_hover.png");

  // Hover over Craft (right sculpture)
  await page.evaluate(() => {
    const craft = Array.from(document.querySelectorAll("div")).find(d => d.textContent.includes("02 // CRAFT") && d.classList.contains("border"));
    if (craft) {
      craft.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    }
  });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUT_DIR, "03_foundations_craft_hover.png") });
  console.log("✓ Saved 03_foundations_craft_hover.png");

  console.log("=== 4. CAPTURING WORK SHOWROOM ===");
  await page.evaluate(() => {
    const el = document.getElementById("work") || Array.from(document.querySelectorAll("section")).find(s => s.textContent.includes("WORK SHOWROOM"));
    if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT_DIR, "04_work_grid.png") });
  console.log("✓ Saved 04_work_grid.png");

  // Toggle to LIST
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const listBtn = btns.find(b => b.textContent.trim() === "LIST");
    if (listBtn) listBtn.click();
  });
  await new Promise((r) => setTimeout(r, 700));
  await page.screenshot({ path: path.join(OUT_DIR, "04_work_list.png") });
  console.log("✓ Saved 04_work_list.png");

  // Switch back to GRID
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const gridBtn = btns.find(b => b.textContent.trim() === "GRID");
    if (gridBtn) gridBtn.click();
  });
  await new Promise((r) => setTimeout(r, 400));

  console.log("=== 5. CAPTURING ARMORY ===");
  await page.evaluate(() => {
    const el = document.getElementById("armory") || Array.from(document.querySelectorAll("section")).find(s => s.textContent.includes("ARMORY MANIFEST"));
    if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT_DIR, "05_armory_overview.png") });
  console.log("✓ Saved 05_armory_overview.png");

  // Type filter into search input
  await page.evaluate(() => {
    const input = document.querySelector("input[placeholder*='Filter armory']");
    if (input) {
      input.focus();
      input.value = "JAVA";
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }
  });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUT_DIR, "05_armory_filtered.png") });
  console.log("✓ Saved 05_armory_filtered.png");

  console.log("=== 6. CAPTURING GITHUB TELEMETRY ===");
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll("section")).find(s => s.textContent.includes("Code in the open") || s.textContent.includes("GITHUB TELEMETRY"));
    if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT_DIR, "06_github_telemetry.png") });
  console.log("✓ Saved 06_github_telemetry.png");

  console.log("=== 7. CAPTURING PATH TIMELINE ===");
  await page.evaluate(() => {
    const el = document.getElementById("path") || Array.from(document.querySelectorAll("section")).find(s => s.textContent.includes("The trajectory") || s.textContent.includes("PATH"));
    if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT_DIR, "07_path_timeline.png") });
  console.log("✓ Saved 07_path_timeline.png");

  console.log("=== 8. CAPTURING HONEST STATUS ===");
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll("section")).find(s => s.textContent.includes("Honest status") || s.textContent.includes("STATUS REPORT"));
    if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT_DIR, "08_honest_status.png") });
  console.log("✓ Saved 08_honest_status.png");

  console.log("=== 9. CAPTURING SUBPAGES ===");
  // /about
  await page.goto("http://localhost:3000/about", { waitUntil: "networkidle0" });
  await dismissPreloader(page);
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT_DIR, "09_page_about.png") });
  console.log("✓ Saved 09_page_about.png");

  // /work/kafka-clone (project deep dive)
  await page.goto("http://localhost:3000/work/kafka-clone", { waitUntil: "networkidle0" });
  await dismissPreloader(page);
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT_DIR, "04_project_kafka.png") });
  console.log("✓ Saved 04_project_kafka.png");

  // /log
  await page.goto("http://localhost:3000/log", { waitUntil: "networkidle0" });
  await dismissPreloader(page);
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT_DIR, "09_page_log.png") });
  console.log("✓ Saved 09_page_log.png");

  // /resume
  await page.goto("http://localhost:3000/resume", { waitUntil: "networkidle0" });
  await dismissPreloader(page);
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT_DIR, "09_page_resume.png") });
  console.log("✓ Saved 09_page_resume.png");

  // /contact
  await page.goto("http://localhost:3000/contact", { waitUntil: "networkidle0" });
  await dismissPreloader(page);
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT_DIR, "09_page_contact.png") });
  console.log("✓ Saved 09_page_contact.png");

  await browser.close();
  console.log("=== ALL TRAILER SECTION CAPTURES COMPLETED! ===");
}

main().catch((err) => {
  console.error("Capture failed:", err);
  process.exit(1);
});
