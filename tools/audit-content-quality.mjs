import fs from "node:fs";
import path from "node:path";
import {
  gameCategoryIds,
  indexableGamePageIds,
  indexableGuideIds,
} from "./content-quality.mjs";

const root = process.cwd();
const publicDir = path.join(root, "public");
const reportDir = path.join(root, "reports");

function textContent(html) {
  const article = html.match(/<article[\s\S]*?<\/article>/i)?.[0] || html;
  return article
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>/gi, " ")
    .replace(/&[a-z0-9#]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function readSection(section, indexableIds) {
  const sectionDir = path.join(publicDir, section);
  return fs.readdirSync(sectionDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const pagePath = path.join(sectionDir, entry.name, "index.html");
      if (!fs.existsSync(pagePath)) return null;
      const html = fs.readFileSync(pagePath, "utf8");
      const title = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]
        ?.replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim() || entry.name;
      return {
        id: entry.name,
        title,
        words: textContent(html).split(/\s+/).filter(Boolean).length,
        indexable: indexableIds.has(entry.name),
        hasNoindex: /<meta name="robots" content="noindex, follow">/.test(html),
        hasAdsense: /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/.test(html),
      };
    })
    .filter(Boolean);
}

function table(rows) {
  return [
    "| 상태 | ID | 페이지 | 단어 수 | 색인 | AdSense |",
    "| --- | --- | --- | ---: | --- | --- |",
    ...rows.map((row) => `| ${row.indexable ? "유지" : "보강 대기"} | ${row.id} | ${row.title} | ${row.words} | ${row.hasNoindex ? "noindex" : "index"} | ${row.hasAdsense ? "있음" : "없음"} |`),
  ].join("\n");
}

const gameSectionRows = readSection("games", indexableGamePageIds);
const categoryHubs = gameSectionRows.filter((row) => gameCategoryIds.has(row.id));
const games = gameSectionRows.filter((row) => !gameCategoryIds.has(row.id));
const guides = readSection("guides", indexableGuideIds);
const policyErrors = [...games, ...categoryHubs, ...guides].filter((row) => (
  row.indexable ? (row.hasNoindex || !row.hasAdsense) : (!row.hasNoindex || row.hasAdsense)
));

const report = `# AdSense 콘텐츠 품질 감사

- 기준일: ${new Date().toISOString().slice(0, 10)}
- 대표 게임: ${games.filter((row) => row.indexable).length}개
- 보강 대기 게임: ${games.filter((row) => !row.indexable).length}개
- 핵심 가이드: ${guides.filter((row) => row.indexable).length}개
- 통합·보강 검토 가이드: ${guides.filter((row) => !row.indexable).length}개
- 색인 카테고리 허브: ${categoryHubs.filter((row) => row.indexable).length}개
- 색인/광고 정책 오류: ${policyErrors.length}개

## 게임 페이지

${table(games.sort((a, b) => Number(b.indexable) - Number(a.indexable) || b.words - a.words))}

## 카테고리 허브

${table(categoryHubs.sort((a, b) => b.words - a.words))}

## 가이드 페이지

${table(guides.sort((a, b) => Number(b.indexable) - Number(a.indexable) || b.words - a.words))}
`;

fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(path.join(reportDir, "adsense-content-audit.md"), report, "utf8");

if (policyErrors.length) {
  console.error(`Found ${policyErrors.length} content quality policy errors.`);
  process.exitCode = 1;
} else {
  console.log(`Audited ${games.length} games, ${categoryHubs.length} category hubs, and ${guides.length} guides with no policy errors.`);
}
