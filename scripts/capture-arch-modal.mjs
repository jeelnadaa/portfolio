import puppeteer from "puppeteer-core";
import path from "node:path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUT_DIR = path.resolve(process.cwd(), "brag-output/captures");

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);

  console.log("Navigating to PlantIQ case study...");
  await page.goto("http://localhost:3000/work/plantiq-capstone", { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 1000));

  // Find and click EXPAND & INTERACT button
  const clicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const expandBtn = btns.find((b) => b.textContent.includes("EXPAND & INTERACT"));
    if (expandBtn) {
      expandBtn.click();
      return true;
    }
    return false;
  });

  console.log("Clicked expand button:", clicked);
  await new Promise((r) => setTimeout(r, 1200));

  await page.screenshot({ path: path.join(OUT_DIR, "desktop-plantiq-architecture.png") });
  console.log("Saved expanded desktop-plantiq-architecture.png");

  await browser.close();
}

main().catch(console.error);
