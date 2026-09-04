import fs from "node:fs";
import path from "node:path";
import {
  applyIndexingPolicy,
  indexableGameIds,
  indexableGuideIds,
} from "./content-quality.mjs";

const root = process.cwd();
const publicDir = path.join(root, "public");

function applyDirectoryPolicy(section, indexableIds) {
  const sectionDir = path.join(publicDir, section);
  let changed = 0;

  for (const entry of fs.readdirSync(sectionDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const pagePath = path.join(sectionDir, entry.name, "index.html");
    if (!fs.existsSync(pagePath)) continue;

    const before = fs.readFileSync(pagePath, "utf8");
    const after = applyIndexingPolicy(before, indexableIds.has(entry.name));
    if (before !== after) {
      fs.writeFileSync(pagePath, after, "utf8");
      changed += 1;
    }
  }

  return changed;
}

const gameChanges = applyDirectoryPolicy("games", indexableGameIds);
const guideChanges = applyDirectoryPolicy("guides", indexableGuideIds);
const playPagePath = path.join(publicDir, "play", "index.html");
const playPageBefore = fs.readFileSync(playPagePath, "utf8");
const playPageAfter = applyIndexingPolicy(playPageBefore, false);
if (playPageBefore !== playPageAfter) fs.writeFileSync(playPagePath, playPageAfter, "utf8");

console.log(`Applied content quality policy to ${gameChanges} game pages, ${guideChanges} guide pages, and the play hub.`);
