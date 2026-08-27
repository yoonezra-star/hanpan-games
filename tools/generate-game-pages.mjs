import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const reactionPagePath = path.join(root, "public", "games", "reaction-speed", "index.html");
const arcadePath = path.join(root, "public", "assets", "arcade.js");

if (!fs.existsSync(reactionPagePath)) {
  throw new Error("Expected custom reaction-speed detail page before generation.");
}

const customReactionPage = fs.readFileSync(reactionPagePath, "utf8");
const arcadeSource = fs.readFileSync(arcadePath, "utf8");
const staleReactionCatalog = '{ id: "reaction-speed", title: "반응속도 체크", category: "skill", type: "reaction", minutes: "15초", description: "초록 신호가 켜지는 순간을 누르는 반응속도 게임입니다." }';
const currentReactionCatalog = '{ id: "reaction-speed", title: "반응속도 체크", category: "skill", type: "reaction", minutes: "5~10회 측정", description: "초록 신호 뒤 반응시간을 5회 또는 10회 측정해 평균·중앙값·일관성을 확인합니다." }';

if (arcadeSource.includes(staleReactionCatalog)) {
  fs.writeFileSync(arcadePath, arcadeSource.replace(staleReactionCatalog, currentReactionCatalog), "utf8");
} else if (!arcadeSource.includes(currentReactionCatalog)) {
  throw new Error("reaction-speed catalog metadata changed unexpectedly; review the generator safeguard.");
}

try {
  await import("./generate-game-pages-core.mjs");
} finally {
  fs.writeFileSync(reactionPagePath, customReactionPage, "utf8");
}

console.log("Preserved custom reaction-speed detail page and verified reaction catalog metadata.");
