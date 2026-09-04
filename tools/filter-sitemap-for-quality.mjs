import fs from "node:fs";
import path from "node:path";
import {
  INDEXABLE_GAME_IDS,
  INDEXABLE_GUIDE_IDS,
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
    return indexableGameIds.has(parts[1]);
  }
  if (parts[0] === "guides" && parts.length === 2) {
    return indexableGuideIds.has(parts[1]);
  }
  return true;
}

const keptLocations = urlBlocks.flatMap((block) => {
  const location = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
  if (!location) throw new Error("A sitemap URL entry is missing its loc element.");
  return isApprovedLocation(location) ? [location] : [];
});

const locationSet = new Set(keptLocations);
const requiredLocations = [
  ...INDEXABLE_GAME_IDS.map((id) => `https://hanpangames.kr/games/${id}/`),
  ...INDEXABLE_GUIDE_IDS.map((id) => `https://hanpangames.kr/guides/${id}/`),
];

for (const location of requiredLocations) {
  if (!locationSet.has(location)) {
    keptLocations.push(location);
    locationSet.add(location);
  }
}

const nextSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${keptLocations.map((location) => `  <url><loc>${location}</loc></url>`).join("\n")}
</urlset>
`;

fs.writeFileSync(sitemapPath, nextSitemap, "utf8");
console.log(`Filtered sitemap from ${urlBlocks.length} to ${keptLocations.length} quality-reviewed URLs.`);
