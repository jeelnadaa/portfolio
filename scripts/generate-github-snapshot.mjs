import fs from "node:fs/promises";
import path from "node:path";

const existing = JSON.parse(
  await fs.readFile(path.resolve("src/data/github-snapshot.json"), "utf8")
);

const weeks = [];
const today = new Date("2026-10-08T00:00:00Z");

// Generate 52 weeks
for (let w = 51; w >= 0; w--) {
  const days = [];
  for (let d = 0; d < 7; d++) {
    const dayDate = new Date(today);
    dayDate.setDate(today.getDate() - (w * 7 + (6 - d)));

    // Deterministic pseudo-random count based on date
    const seed = (dayDate.getFullYear() * 365 + dayDate.getMonth() * 31 + dayDate.getDate()) % 17;
    let count = 0;
    let level = 0;

    if (seed > 14) {
      count = 8 + (seed % 5);
      level = 4; // sun accent
    } else if (seed > 10) {
      count = 4 + (seed % 4);
      level = 3;
    } else if (seed > 6) {
      count = 2 + (seed % 3);
      level = 2;
    } else if (seed > 3) {
      count = 1;
      level = 1;
    } else {
      count = 0;
      level = 0;
    }

    days.push({
      date: dayDate.toISOString().split("T")[0],
      count,
      level, // 0 to 4
    });
  }
  weeks.push({ days });
}

existing.contributionWeeks = weeks;

await fs.writeFile(
  path.resolve("src/data/github-snapshot.json"),
  JSON.stringify(existing, null, 2),
  "utf8"
);
console.log("✓ Updated github-snapshot.json with 52 contribution weeks");
