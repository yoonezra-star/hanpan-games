import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const arcadePath = path.join(root, "public", "assets", "arcade.js");
const customPageIds = ["reaction-speed", "aim-trainer"];
const customPages = customPageIds.map(function (id) {
  const pagePath = path.join(root, "public", "games", id, "index.html");
  if (!fs.existsSync(pagePath)) {
    throw new Error(`Expected custom ${id} detail page before generation.`);
  }
  return { id, pagePath, content: fs.readFileSync(pagePath, "utf8") };
});

const catalogReplacements = [
  {
    id: "reaction-speed",
    stale: '{ id: "reaction-speed", title: "반응속도 체크", category: "skill", type: "reaction", minutes: "15초", description: "초록 신호가 켜지는 순간을 누르는 반응속도 게임입니다." }',
    current: '{ id: "reaction-speed", title: "반응속도 체크", category: "skill", type: "reaction", minutes: "5~10회 측정", description: "초록 신호 뒤 반응시간을 5회 또는 10회 측정해 평균·중앙값·일관성을 확인합니다." }'
  },
  {
    id: "aim-trainer",
    stale: '{ id: "aim-trainer", title: "에임 트레이너", category: "skill", type: "target", minutes: "1분", description: "무작위 위치에 뜨는 표적을 빠르게 눌러 정확도를 올립니다." }',
    current: '{ id: "aim-trainer", title: "에임 트레이너", category: "skill", type: "target", minutes: "15~30개 타깃", description: "15~30개 타깃을 맞히며 평균 반응시간과 정확도를 측정합니다." }'
  }
];

const arcadeSource = fs.readFileSync(arcadePath, "utf8");
let nextArcadeSource = arcadeSource;

catalogReplacements.forEach(function (entry) {
  if (nextArcadeSource.includes(entry.stale)) {
    nextArcadeSource = nextArcadeSource.replace(entry.stale, entry.current);
  } else if (!nextArcadeSource.includes(entry.current)) {
    throw new Error(`${entry.id} catalog metadata changed unexpectedly; review the generator safeguard.`);
  }
});

if (nextArcadeSource !== arcadeSource) {
  fs.writeFileSync(arcadePath, nextArcadeSource, "utf8");
}

try {
  await import("./generate-game-pages-core.mjs");
} finally {
  customPages.forEach(function (page) {
    fs.writeFileSync(page.pagePath, page.content, "utf8");
  });
}

console.log("Preserved custom reaction-speed and aim-trainer detail pages and verified catalog metadata.");
