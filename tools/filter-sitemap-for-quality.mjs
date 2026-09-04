import fs from "node:fs";
import path from "node:path";
import {
  INDEXABLE_CATEGORY_IDS,
  INDEXABLE_GAME_IDS,
  INDEXABLE_GUIDE_IDS,
  gameCategoryIds,
  indexableGameIds,
  indexableGuideIds,
} from "./content-quality.mjs";

const sitemapPath = path.join(process.cwd(), "public", "sitemap.xml");
const sitemap = fs.readFileSync(sitemapPath, "utf8");
const urlBlocks = [...sitemap.matchAll(/\s*<url>[\s\S]*?<\/url>/g)].map((match) => match[0].trim());

function isApprovedLocation(location) {
  const url = new URL(location);
  const parts = url.pathname.split("/").filter(Boolean);

  if (parts[0] === "play") return false;
  if (parts[0] === "games" && parts.length === 2) {
    return indexableGameIds.has(parts[1]) || gameCategoryIds.has(parts[1]);
  }
  if (parts[0] === "guides" && parts.length === 2) {
    return indexableGuideIds.has(parts[1]);
  }
  return true;
}

const keptEntries = urlBlocks.flatMap((block) => {
  const location = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
  if (!location) throw new Error("A sitemap URL entry is missing its loc element.");
  return isApprovedLocation(location) ? [{ location, block }] : [];
});

const locationSet = new Set(keptEntries.map((entry) => entry.location));
const requiredLocations = [
  ...INDEXABLE_GAME_IDS.map((id) => `https://hanpangames.kr/games/${id}/`),
  ...INDEXABLE_CATEGORY_IDS.map((id) => `https://hanpangames.kr/games/${id}/`),
  ...INDEXABLE_GUIDE_IDS.map((id) => `https://hanpangames.kr/guides/${id}/`),
];

for (const location of requiredLocations) {
  if (!locationSet.has(location)) {
    keptEntries.push({ location, block: `<url><loc>${location}</loc></url>` });
    locationSet.add(location);
  }
}

const updatedLocations = new Set([
  "https://hanpangames.kr/updates/",
  "https://hanpangames.kr/games/mines/",
  "https://hanpangames.kr/games/card-solitaire/",
  "https://hanpangames.kr/games/sudoku-mini/",
  "https://hanpangames.kr/games/twenty-48/",
  "https://hanpangames.kr/games/block-drop-classic/",
  "https://hanpangames.kr/games/brick-break/",
  "https://hanpangames.kr/games/snake-garden/",
  "https://hanpangames.kr/games/freecell-classic/",
  "https://hanpangames.kr/games/tic-tac-toe/",
  "https://hanpangames.kr/games/connect-four/",
  "https://hanpangames.kr/games/maze-chase/",
  "https://hanpangames.kr/games/match-three/",
  "https://hanpangames.kr/games/sliding-puzzle/",
  "https://hanpangames.kr/games/hangman/",
  "https://hanpangames.kr/games/flappy-jump/",
  "https://hanpangames.kr/games/arcade/",
  "https://hanpangames.kr/games/board/",
  "https://hanpangames.kr/games/brain/",
  "https://hanpangames.kr/games/puzzle/",
  "https://hanpangames.kr/games/skill/",
  "https://hanpangames.kr/games/traditional/",
]);

function withLastModified(entry) {
  if (!updatedLocations.has(entry.location)) return entry.block;
  if (/<lastmod>[^<]+<\/lastmod>/.test(entry.block)) {
    return entry.block.replace(/<lastmod>[^<]+<\/lastmod>/, "<lastmod>2026-09-04</lastmod>");
  }
  return entry.block.replace("</url>", "<lastmod>2026-09-04</lastmod></url>");
}

const nextSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${keptEntries.map((entry) => `  ${withLastModified(entry)}`).join("\n")}
</urlset>
`;

fs.writeFileSync(sitemapPath, nextSitemap, "utf8");
console.log(`Filtered sitemap from ${urlBlocks.length} to ${keptEntries.length} quality-reviewed URLs.`);
