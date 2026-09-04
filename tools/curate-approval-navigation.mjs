import fs from "node:fs";
import path from "node:path";
import {
  FLAGSHIP_GAME_IDS,
  INDEXABLE_GAME_IDS,
  indexableGameIds,
  indexableGuideIds,
} from "./content-quality.mjs";

const root = process.cwd();
const publicDir = path.join(root, "public");

function updateFile(relativePath, transform) {
  const filePath = path.join(publicDir, relativePath);
  const before = fs.readFileSync(filePath, "utf8");
  const after = transform(before);
  if (before !== after) fs.writeFileSync(filePath, after, "utf8");
}

function filterLinkedBlocks(html, pattern, allowedIds) {
  return html.replace(pattern, (block, id) => allowedIds.has(id) ? block : "");
}

const flagshipEditorialSections = {
  "mines": {
    intro: "지뢰찾기 기록은 단순히 빨리 누른 시간이 아니라 확실한 근거를 얼마나 연속으로 찾았는지 보여 줍니다. 이번 판 도전은 열린 안전 칸의 비율을 기준으로 현재 진행을 세 단계로 나눕니다.",
    tiers: ["25% · 첫 숫자 경계를 만든 뒤 닫힌 칸과 깃발 수를 비교합니다.", "60% · 한쪽 구역을 마무리하고 남은 숫자 경계를 다시 훑습니다.", "100% · 힌트 없이 모든 안전 칸을 열면 난이도별 최고 시간 비교 대상이 됩니다."],
    reading: "진행이 오래 멈춘다면 판 전체를 보지 말고 닫힌 칸과 맞닿은 숫자만 따라가세요. 남은 지뢰 수가 빠르게 줄어도 잘못된 깃발이 섞이면 연쇄 열기에서 실패할 수 있으므로, 속도보다 깃발의 근거가 우선입니다."
  },
  "card-solitaire": {
    intro: "솔리테어의 정리 수치는 네 기초 더미에 올라간 카드 수입니다. 이동 횟수만 줄이는 것보다 뒤집힌 카드를 공개하고 기초 더미로 보낼 통로를 만드는 과정이 완주 가능성을 더 잘 보여 줍니다.",
    tiers: ["13장 · 한 무늬 분량을 정리하며 낮은 카드의 이동 경로를 확보합니다.", "26장 · 카드 절반을 기초 더미로 옮기고 남은 숨은 카드 수를 확인합니다.", "52장 · 네 무늬를 A부터 K까지 완성하면 완주 시간 기록이 저장됩니다."],
    reading: "정리 수가 늘지 않는데 이동만 많아지면 기초 더미를 너무 빨리 올렸거나 빈 열을 쓸 K 묶음이 막힌 경우가 많습니다. 숨은 카드 수가 줄어드는 이동을 먼저 찾고, 힌트는 막힌 원인을 확인하는 용도로 사용하세요."
  },
  "sudoku-mini": {
    intro: "스도쿠의 입력 수치는 처음 비어 있던 칸 가운데 확정 숫자를 채운 개수입니다. 후보 메모는 입력 수에 포함하지 않으므로, 메모를 많이 남기는 것보다 후보를 실제 확정으로 바꾸는 흐름을 확인할 수 있습니다.",
    tiers: ["15칸 · 단서가 많은 행과 박스부터 확정 숫자를 채웁니다.", "35칸 · 후보 쌍과 박스·행 교차를 사용해 후반 선택지를 줄입니다.", "51칸 · 모든 빈칸을 맞히고 힌트가 없다면 난이도별 최고 시간을 비교합니다."],
    reading: "입력 수가 멈추면 후보가 적은 칸 하나만 오래 보기보다 특정 숫자가 들어갈 수 있는 위치가 한 곳뿐인 행·열·박스를 찾으세요. 실수 수가 늘면 최근 입력을 되돌리고 그 숫자가 같은 박스와 열에 이미 있었는지부터 확인하는 편이 빠릅니다."
  },
  "twenty-48": {
    intro: "2048의 최대 타일은 한 번의 큰 합치기보다 보드 운영이 얼마나 오래 유지됐는지를 보여 줍니다. 이번 판 도전은 128, 512, 2048을 기준으로 큰 타일과 빈칸 관리가 안정되는 구간을 나눕니다.",
    tiers: ["128 · 가장 큰 타일을 한 모서리에 고정하는 기본 대형을 만듭니다.", "512 · 큰 타일 옆에 절반 크기 타일을 계단처럼 연결합니다.", "2048 · 빈칸을 유지하며 마지막 두 1024 타일의 합칠 방향을 확보합니다."],
    reading: "최대 타일은 높지만 점수가 더 오르지 않으면 큰 타일 주변에 낮은 숫자가 흩어진 상태일 가능성이 큽니다. 이동 뒤 빈칸이 세 칸 이하라면 당장 큰 숫자를 만드는 수보다 낮은 타일 두 개를 정리하는 수를 먼저 검토하세요."
  },
  "block-drop-classic": {
    intro: "블록 드롭의 삭제 줄은 점수보다 쉽게 비교할 수 있는 생존 지표입니다. 두 줄은 기본 조작, 열 줄은 보드 높이 관리, 서른 줄은 다음 블록과 홀드를 함께 읽는 안정성을 확인하는 기준입니다.",
    tiers: ["2줄 · 회전과 즉시 낙하를 익히며 첫 빈틈 없는 바닥을 만듭니다.", "10줄 · 높은 기둥을 줄이고 긴 블록용 세로 통로를 유지합니다.", "30줄 · 속도가 오른 뒤에도 홀드와 다음 블록 3개로 위험 배치를 피합니다."],
    reading: "삭제 줄이 늘지 않는데 보드만 높아지면 한 번에 네 줄을 노리느라 깊은 구멍을 만든 경우가 많습니다. 구멍 위를 덮는 블록을 피하고, 최고점이 좌우로 급격히 달라지면 한 줄 삭제라도 먼저 만들어 높이를 낮추세요."
  }
};

function flagshipEditorialHtml(section) {
  return `<!-- FLAGSHIP_RECORD_GUIDE_START -->
          <div class="flagship-record-guide" id="record-challenges">
            <h2>기록 도전과 판세 읽기</h2>
            <p>${section.intro}</p>
            <ul class="strategy-list">
              ${section.tiers.map((tier) => `<li>${tier}</li>`).join("\n              ")}
            </ul>
            <h3>현재 기록을 해석하는 기준</h3>
            <p>${section.reading}</p>
          </div>
          <!-- FLAGSHIP_RECORD_GUIDE_END -->`;
}

updateFile(path.join("assets", "arcade.js"), (html) => {
  const visibleIds = INDEXABLE_GAME_IDS.map((id) => `"${id}"`).join(", ");
  const flagshipIds = FLAGSHIP_GAME_IDS.map((id) => `"${id}"`).join(", ");
  let next = html.replace(
    /const approval(?:Visible|Hidden)GameIds[\s\S]*?const publicCatalog = [\s\S]*?\n  \}\);/,
    `const approvalVisibleGameIds = new Set([${visibleIds}]);\n  const approvalHiddenGameIds = new Set(catalog\n    .filter(function (game) { return !approvalVisibleGameIds.has(game.id); })\n    .map(function (game) { return game.id; }));\n  const gameById = new Map(catalog.map(function (game) { return [game.id, game]; }));\n  const flagshipGameIds = new Set([${flagshipIds}]);\n  const publicCatalog = [${visibleIds}]\n    .map(function (id) { return gameById.get(id); })\n    .filter(Boolean);`,
  );
  next = next.replace(
    "publicCatalog.forEach(function (game) {\n      const option = document.createElement(\"option\");",
    `const currentGame = catalog.find(function (game) { return game.id === current; });\n    const pickerCatalog = currentGame && approvalHiddenGameIds.has(current)\n      ? [currentGame].concat(publicCatalog)\n      : publicCatalog;\n\n    pickerCatalog.forEach(function (game) {\n      const option = document.createElement(\"option\");`,
  );
  return next;
});

FLAGSHIP_GAME_IDS.forEach((id) => {
  updateFile(path.join("games", id, "index.html"), (html) => {
    let next = html.replace(
      /<main class="([^"]*\bgame-detail-page\b[^"]*)">/,
      (match, classes) => classes.includes("flagship-game-page")
        ? match
        : `<main class="${classes} flagship-game-page">`,
    );
    next = next.replace(/\s*<!-- FLAGSHIP_RECORD_GUIDE_START -->[\s\S]*?<!-- FLAGSHIP_RECORD_GUIDE_END -->\s*/g, "\n\n          ");
    next = next.replace(/\s*<li><a href="#record-challenges">기록 도전<\/a><\/li>/g, "");
    next = next.replace('<li><a href="#faq">FAQ</a></li>', '<li><a href="#record-challenges">기록 도전</a></li>\n            <li><a href="#faq">FAQ</a></li>');
    return next.replace('<h2 id="faq">', `${flagshipEditorialHtml(flagshipEditorialSections[id])}\n\n          <h2 id="faq">`);
  });
});

const flagshipUpdateEntry = `<!-- FLAGSHIP_CHALLENGE_UPDATE_START -->
        <h2>2026년 9월 4일</h2>
        <h3>대표 게임 기록 도전과 모바일 플레이 개선</h3>
        <p>
          <a href="/games/mines/">지뢰찾기</a>, <a href="/games/card-solitaire/">카드 솔리테어</a>,
          <a href="/games/sudoku-mini/">스도쿠</a>, <a href="/games/twenty-48/">2048</a>,
          <a href="/games/block-drop-classic/">블록 드롭</a>에 현재 점수판을 읽는 3단계 도전 목표를 추가했습니다.
          모바일에서는 점수와 게임판이 먼저 보이도록 선택기와 조작 영역을 압축하고, 각 페이지 본문에 기록을 해석하는 기준과 상황별 목표를 보강했습니다.
        </p>
        <!-- FLAGSHIP_CHALLENGE_UPDATE_END -->`;

updateFile(path.join("updates", "index.html"), (html) => {
  const next = html.replace(/\s*<!-- FLAGSHIP_CHALLENGE_UPDATE_START -->[\s\S]*?<!-- FLAGSHIP_CHALLENGE_UPDATE_END -->\s*/g, "\n        ");
  return next.replace('<article class="article timeline">', `<article class="article timeline">\n        ${flagshipUpdateEntry}`);
});

const homeGuideCards = [
  ["mines-beginner-guide", "지뢰찾기 기본 규칙", "숫자 힌트로 안전한 칸과 지뢰 후보를 구분합니다."],
  ["sudoku-classic-guide", "스도쿠 입문 공략", "후보 메모와 행·열·박스 교차로 확정 숫자를 찾습니다."],
  ["twenty-48-strategy", "2048 초보 전략", "큰 타일을 모서리에 고정하고 빈칸을 관리합니다."],
  ["brick-break-strategy", "벽돌깨기 초보 공략", "패들 위치와 반사각으로 공을 오래 유지합니다."],
  ["block-drop-beginner", "블록 드롭 초보 가이드", "홀드와 다음 블록을 읽고 보드를 낮게 유지합니다."],
  ["snake-garden-guide", "스네이크 공략", "먹이보다 탈출 공간을 먼저 확인하는 경로 판단을 정리합니다."],
].map(([id, title, text]) => `    <a class="featured-link" href="/guides/${id}/"><strong>${title}</strong><span>${text}</span></a>`).join("\n");

const homeGameCards = [
  ["mines", "blue", "퍼즐", "5분", "지뢰찾기 클래식", "숫자 단서와 깃발을 이용해 지뢰를 피하고 모든 안전 칸을 여세요."],
  ["card-solitaire", "gold", "보드·전략", "8분", "카드 솔리테어", "숨은 카드를 열고 네 개의 완성 탑에 52장을 차례로 정리하세요."],
  ["sudoku-mini", "blue", "퍼즐", "8분", "스도쿠 클래식", "후보 메모와 힌트를 활용해 세 가지 난이도의 9×9 퍼즐을 푸세요."],
  ["twenty-48", "blue", "퍼즐", "3분", "2048 한판", "스와이프와 실행 취소를 활용해 2048 이후의 타일까지 도전하세요."],
  ["block-drop-classic", "blue", "퍼즐", "4분", "블록 드롭 클래식", "홀드와 다음 블록 3개를 활용해 줄 삭제·백투백 기록에 도전합니다."],
  ["brick-break", "red", "고전 오락실", "2분", "벽돌깨기 미니", "패들 위치와 반사각을 조절해 벽돌을 깨고 높은 스테이지에 도전합니다."],
].map(([id, tag, category, minutes, title, text]) => `    <article class="featured-game-card"><a href="/games/${id}/"><img src="/assets/game-art/${id}.webp" width="640" height="360" loading="lazy" alt="${title} 플레이 화면"><div class="featured-game-body"><div class="game-meta"><span class="tag ${tag}">${category}</span><span>${minutes}</span></div><h3>${title}</h3><p>${text}</p><strong>바로 시작</strong></div></a></article>`).join("\n");

const homeHero = `<section class="hero">
    <div class="hero-copy"><p class="eyebrow">15 CLASSIC BROWSER GAMES</p><h1>한판게임</h1><p class="hero-kicker">아는 게임부터, 바로 한 판.</p><p class="lead">지뢰찾기, 솔리테어, 스도쿠, 2048과 블록 드롭을 모바일과 데스크톱에서 설치 없이 즐기세요.</p><div class="hero-actions"><a class="button primary" href="/games/">대표 게임 보기</a><a class="button secondary" href="/games/mines/#play-area">지뢰찾기 시작</a></div></div>
    <div class="hero-game-preview" aria-label="인기 게임 바로가기"><a href="/games/mines/"><img src="/assets/game-art/mines.webp" width="640" height="360" alt="지뢰찾기 클래식 플레이 화면"><span><strong>지뢰찾기</strong><small>숫자 단서 퍼즐</small></span></a><a href="/games/card-solitaire/"><img src="/assets/game-art/card-solitaire.webp" width="640" height="360" alt="카드 솔리테어 플레이 화면"><span><strong>솔리테어</strong><small>클론다이크 카드</small></span></a><a href="/games/sudoku-mini/"><img src="/assets/game-art/sudoku-mini.webp" width="640" height="360" alt="스도쿠 클래식 플레이 화면"><span><strong>스도쿠</strong><small>9×9 논리 퍼즐</small></span></a></div>
  </section>`;

updateFile("index.html", (html) => {
  let next = html.replace(/<section class="hero">[\s\S]*?<\/section>/, homeHero);
  next = filterLinkedBlocks(
    next,
    /\s*<article class="featured-game-card"><a href="\/games\/([^/]+)\/">[\s\S]*?<\/article>/g,
    indexableGameIds,
  );
  next = next.replace(/\s*<section class="section" aria-labelledby="traditionalGamesTitle">[\s\S]*?<\/section>/, "");
  next = next.replace(/\s*<section class="section quick-games-section">[\s\S]*?<\/section>/, "");
  next = next.replace(/\s*<section class="section" aria-labelledby="homeCategoryTitle">[\s\S]*?<\/section>/, "");
  next = next.replace(
    /(<section id="popular-games"[\s\S]*?<div class="featured-game-grid">)[\s\S]*?(<\/div><div class="section-action">)/,
    `$1\n${homeGameCards}\n  $2`,
  );
  next = next.replace(
    /<section class="section"><div class="section-heading"><p class="eyebrow">64 Guides<\/p>[\s\S]*?<\/div><\/section>/,
    `<section class="section"><div class="section-heading"><p class="eyebrow">11 Guides</p><h2>게임 공략과 플레이 기준</h2><p>대표 게임의 실패 원인과 기록 개선 방법을 실제 규칙에 맞춰 정리했습니다.</p></div><div class="featured-link-grid">\n${homeGuideCards}\n    <a class="featured-link" href="/guides/"><strong>핵심 가이드 전체 보기</strong><span>퍼즐·아케이드 공략과 모바일 조작 기준을 한곳에서 확인하세요.</span></a>\n  </div></section>`,
  );
  return next
    .replace("한판게임 - 설치 없이 즐기는 무료 웹게임 45개", "한판게임 - 설치 없이 즐기는 클래식 웹게임")
    .replace("고전 오락실, 퍼즐, 보드, 두뇌, 순발력, 한국 전통놀이까지 무료 웹게임 45개를 설치와 로그인 없이 즐기세요. 64개 공략·선택 가이드와 모바일 조작 안내를 함께 제공합니다.", "지뢰찾기, 스도쿠, 2048, 솔리테어, 벽돌깨기를 설치와 로그인 없이 즐기고 게임별 조작법과 공략을 함께 확인하세요.")
    .replace("한판게임 - 무료 웹게임 45개", "한판게임 - 클래식 웹게임")
    .replace("45개 무료 브라우저 게임과 64개 공략·선택 가이드를 한곳에서 즐기세요.", "엄선한 클래식 브라우저 게임과 실제 플레이 공략을 한곳에서 확인하세요.")
    .replace("45 FREE BROWSER GAMES", "15 CLASSIC BROWSER GAMES")
    .replace("버블 슈터, 오목, 프리셀, 벽돌깨기, 스네이크부터 제기차기와 투호까지. 설치와 로그인 없이 45개 게임을 모바일과 데스크톱에서 무료로 즐기세요.", "지뢰찾기, 스도쿠, 2048, 프리셀, 벽돌깨기, 스네이크를 모바일과 데스크톱에서 설치 없이 즐기세요.")
    .replace("45개 게임 보기", "15개 대표 게임 보기")
    .replace("45 games · 64 guides", "15 games · 11 guides")
    .replace('<span class="tile cool">45</span>', '<span class="tile cool">15</span>')
    .replace('<section class="section stats-band" aria-label="사이트 요약"><div><strong>45</strong><span>즉시 플레이 게임</span></div><div><strong>6</strong><span>게임 카테고리</span></div><div><strong>64</strong><span>공략·선택 가이드</span></div><div><strong>0원</strong><span>설치·로그인 없음</span></div></section>', '<section class="section stats-band" aria-label="사이트 요약"><div><strong>15</strong><span>대표 게임</span></div><div><strong>4</strong><span>핵심 장르</span></div><div><strong>11</strong><span>플레이 가이드</span></div><div><strong>0원</strong><span>설치·로그인 없음</span></div></section>')
    .replace("전체 45개 게임 보기", "대표 게임 전체 보기")
    .replace("무료 웹게임 45개와 플레이 가이드", "클래식 웹게임과 플레이 가이드")
    .replace("무료 웹게임 45개와 플레이 공략을 제공하는", "클래식 웹게임과 플레이 공략을 제공하는")
    .replace("한판게임은 45개 게임을 단순히 나열하지 않고", "한판게임은 규칙과 기록 구조가 분명한 대표 게임을 우선하고")
    .replace(/한판게임은 규칙과 기록 구조가 분명한 대표 게임을 [^.]+./, "한판게임은 규칙과 기록 구조가 분명한 대표 게임을 4개 핵심 장르로 나누어 소개합니다.");
});

const coreGameCards = homeGameCards;

const gamesSchema = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      name: "한판게임 대표 클래식 웹게임",
      url: "https://hanpangames.kr/games/",
      description: "설치 없이 즐기는 대표 클래식 웹게임 15개",
      inLanguage: "ko-KR",
    },
    {
      "@type": "ItemList",
      name: "한판게임 대표 게임",
      numberOfItems: INDEXABLE_GAME_IDS.length,
      itemListElement: INDEXABLE_GAME_IDS.map((id, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://hanpangames.kr/games/${id}/`,
      })),
    },
  ],
});

updateFile(path.join("games", "index.html"), (html) => {
  let next = filterLinkedBlocks(
    html,
    /\s*<a class="featured-link" href="\/games\/([^/]+)\/">[\s\S]*?<\/a>/g,
    indexableGameIds,
  );
  next = next.replace(
    /<section class="featured-games" aria-label="대표 심화 게임">[\s\S]*?<\/section>/,
    `<section class="featured-games" aria-label="인기 대표 게임"><div class="section-heading"><p class="eyebrow">Popular classics</p><h2>많이 찾는 게임부터 시작하기</h2><p>규칙이 익숙하고 반복해서 기록에 도전하기 좋은 대표 게임입니다.</p></div><div class="featured-game-grid">\n${coreGameCards}\n  </div></section>`,
  );
  next = next.replace(/\s*<section class="section"><div class="section-heading"><p class="eyebrow">Quick picks<\/p>[\s\S]*?<\/section>/, "");
  next = next.replace(
    /<section class="section" aria-labelledby="categoryTitle">[\s\S]*?<\/section>/,
    `<section class="section library-category-section" aria-labelledby="categoryTitle"><div class="section-heading"><p class="eyebrow">Categories</p><h2 id="categoryTitle">4개 핵심 장르로 찾기</h2><p>아케이드, 퍼즐, 보드·전략, 두뇌 게임을 필터로 빠르게 고를 수 있습니다.</p></div><div class="category-showcase"><a class="category-jump" style="--category-color:#df4b38" href="#game-library" data-arcade-jump="arcade"><i aria-hidden="true">오</i><span><strong>고전 오락실</strong>벽돌·미로·스네이크 4개</span></a><a class="category-jump" style="--category-color:#2877b9" href="#game-library" data-arcade-jump="puzzle"><i aria-hidden="true">퍼</i><span><strong>퍼즐</strong>논리·배치·연쇄 6개</span></a><a class="category-jump" style="--category-color:#c88b19" href="#game-library" data-arcade-jump="board"><i aria-hidden="true">보</i><span><strong>보드·전략</strong>카드·대전 4개</span></a><a class="category-jump" style="--category-color:#258b62" href="#game-library" data-arcade-jump="brain"><i aria-hidden="true">두</i><span><strong>두뇌·단어</strong>단어 추리 1개</span></a></div></section>`,
  );
  next = next.replace(
    /(<section class="section library-category-section"[\s\S]*?<\/section>)\s*(<section class="featured-games"[\s\S]*?<\/section>)/,
    `$2\n\n  $1`,
  );
  next = next.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script type="application/ld+json">${gamesSchema}</script>`,
  );
  return next
    .replace("한판게임의 무료 웹게임 45개 전체 목록입니다. 한국 전통놀이 4개, 고전 오락실 12개, 퍼즐 11개, 보드·전략 6개, 두뇌·기억 6개, 순발력·기록 6개를 확인하세요.", "한판게임이 엄선한 클래식 웹게임 15개입니다. 아케이드, 퍼즐, 보드·전략, 두뇌 장르를 설치 없이 즐기세요.")
    .replace("무료 웹게임 45개 전체 목록 - 한판게임", "클래식 웹게임 15개 - 한판게임")
    .replace("45개 무료 브라우저 게임을 6개 장르로 나눠 검색하고 바로 플레이하세요.", "15개 대표 브라우저 게임을 4개 핵심 장르로 나눠 검색하고 바로 플레이하세요.")
    .replace("무료 웹게임 45개 전체 목록", "대표 클래식 웹게임 15개")
    .replace("검색과 필터로 빠르게 고르거나, 아래 6개 카테고리 전용 페이지에서 장르별 게임과 추천 기준을 먼저 확인하세요.", "검색과 필터로 게임을 빠르게 고르고 각 상세 페이지에서 조작법과 점수 기준을 확인하세요.")
    .replace("설치 없이 바로 즐기는 설치 없이 바로 즐기는 클래식 웹게임.", "설치 없이 바로 즐기는 클래식 웹게임.")
    .replace('<button type="button" class="filter" data-arcade-filter="traditional">한국 전통놀이</button>', "")
    .replace('<button type="button" class="filter" data-arcade-filter="skill">순발력·기록</button>', "")
    .replace('"description":"무료 웹게임 45개 전체 목록"', '"description":"엄선한 클래식 웹게임 15개"')
    .replace(/45개 게임/g, "15개 대표 게임")
    .replace("전체 게임 목록", "대표 게임 목록")
    .replace("무료 웹게임 45개 전체 목록", "엄선한 클래식 웹게임 목록")
    .replace("무료 웹게임 45개.", "설치 없이 바로 즐기는 클래식 웹게임.")
    .replace("45개 게임을 고르는 기준", "대표 게임을 고르는 기준")
    .replace("49개 가이드", "핵심 가이드");
});

const ticTacToeExtraContent = `<h2>한 판을 시작하는 순서</h2><p>처음에는 AI 대전 또는 2인 대전을 고르고, AI 대전이라면 난이도와 선공을 선택합니다. 설정을 바꾸면 새 매치가 시작되며 X와 O의 매치 점수는 0으로 돌아갑니다. 내가 선공을 선택하면 첫 수를 바로 둘 수 있고, 상대 선공을 선택하면 AI가 먼저 둔 뒤 내 차례가 됩니다. 현재 차례와 내가 맡은 기호는 보드 위 상태표에서 확인할 수 있습니다.</p><h2>보드 위치 읽기</h2><p>숫자키는 키패드가 아니라 읽기 순서대로 배치됩니다. 1·2·3은 위쪽 줄, 4·5·6은 가운데 줄, 7·8·9는 아래쪽 줄입니다. 중앙 5번은 가로·세로·두 대각선에 모두 참여하므로 가장 많은 승리 경로를 가집니다. 네 모서리는 각각 세 개의 승리 경로에 참여하고, 변의 가운데 칸은 두 개의 경로에 참여합니다. 빈 칸 버튼에는 위치가 음성으로 안내되어 화면 읽기 프로그램으로도 현재 보드를 탐색할 수 있습니다.</p><h2>선공과 후공 운영</h2><p>선공이라면 중앙이나 모서리에서 시작해 서로 다른 두 줄에 동시에 참여할 수 있는 기반을 만드는 것이 안정적입니다. 후공인데 상대가 중앙을 차지했다면 모서리로 대응하고, 상대가 모서리에서 시작했다면 중앙을 확보하는 방식이 기본입니다. 다만 정해진 첫 수만 반복하기보다 매 차례 즉시 승리할 칸과 상대가 다음 수에 완성할 칸을 먼저 확인해야 합니다.</p><h2>포크를 찾는 실제 순서</h2><p>포크는 다음 차례에 완성할 수 있는 두 줄을 동시에 만드는 배치입니다. 먼저 내 돌 두 개로 즉시 완성되는 줄이 있는지 보고, 없다면 상대의 즉시 승리를 막습니다. 그 다음 내가 한 수로 두 개의 위협을 만들 수 있는 칸을 찾고, 상대에게 같은 기회가 생기는지도 확인합니다. 공격 모양만 따라가다가 상대의 한 줄 완성을 놓치는 경우가 가장 흔하므로 이 확인 순서를 매번 유지하는 편이 좋습니다.</p><h2>난이도별 연습 목표</h2><p>쉬움에서는 여러 첫 수를 시험하며 가로·세로·대각선 모양을 익힐 수 있습니다. 보통은 유리한 수를 계산하지만 선택에 변동성이 있어 포크와 차단을 연습하기 좋습니다. 어려움은 가능한 후속 수를 끝까지 평가하므로 실수하지 않으면 무승부에 도달합니다. 어려움에서 연속 무승부를 기록했다면 기본 방어 순서가 안정됐다는 뜻이며, 쉬움과 보통에서 승리 기회를 더 빠르게 찾는 연습으로 이어갈 수 있습니다.</p><h2>기록을 읽는 방법</h2><p>승·무·패는 선택한 모드와 난이도별로 따로 쌓입니다. 한 번의 매치에는 여러 판이 포함되므로 게임 수와 매치 수는 서로 다를 수 있습니다. 단판 승률만 보기보다 어려움에서 패배 없이 마친 판의 비율, 보통에서 3승에 도달하기까지 치른 판 수, 선후공을 바꿨을 때의 체감 차이를 함께 확인하면 실력이 어떻게 변하는지 더 분명하게 볼 수 있습니다.</p><h2>모바일과 키보드 플레이</h2><p>모바일에서는 화면을 세로 또는 가로로 돌려도 보드 비율이 유지됩니다. 빈 칸을 한 번 터치하면 착수하며 빠르게 여러 번 눌러도 이미 채워진 칸에는 다시 둘 수 없습니다. 데스크톱에서는 숫자키 1부터 9까지로 원하는 칸을 선택할 수 있고, N 키로 새 매치를 시작합니다. 한 판이 끝났지만 아직 어느 쪽도 3승에 도달하지 않았다면 Enter 키로 다음 판을 시작할 수 있습니다.</p>`;

updateFile(path.join("games", "tic-tac-toe", "index.html"), (html) => {
  if (html.includes("한 판을 시작하는 순서")) return html;
  return html.replace(
    "<h2>업데이트</h2><p>2026년 8월 27일 실제 런타임 기준으로 3선승 표시, AI 설명, 숫자키와 기록 안내를 교정했습니다.</p>",
    `${ticTacToeExtraContent}<h2>업데이트</h2><p>2026년 8월 27일 실제 런타임 기준으로 3선승 표시, AI 설명, 숫자키와 기록 안내를 교정했습니다. 2026년 9월 4일에는 선후공 운영, 보드 위치, 포크 확인 순서와 기록 해석 설명을 보강했습니다.</p>`,
  );
});

updateFile(path.join("guides", "index.html"), (html) => {
  const next = filterLinkedBlocks(
    html,
    /\s*<a class="featured-link" href="\/guides\/([^/]+)\/">[\s\S]*?<\/a>/g,
    indexableGuideIds,
  );
  return next
    .replace("한판게임의 64개 게임 공략·플레이 가이드입니다. 무료·클래식·간단 조작·키보드·마우스·터치 웹게임 추천부터 숫자·수학, 논리·추리, 기억력, 집중력·주의력, 단어, 아케이드, 한국 전통놀이, 보드·카드, 퍼즐, 반응속도, 두뇌 게임 추천과 개별 전략을 안내합니다.", "한판게임의 11개 핵심 플레이 가이드입니다. 지뢰찾기, 스도쿠, 2048, 벽돌깨기, 블록 드롭, 스네이크의 규칙과 실패 원인을 정리합니다.")
    .replace(/64개 가이드/g, "11개 핵심 가이드")
    .replace("실제 플레이 규칙, 기록 방식과 실패 원인을 기준으로 정리한 독립 공략과 장르별 선택 가이드입니다.", "대표 게임의 실제 규칙, 기록 방식과 실패 원인을 기준으로 정리한 핵심 공략입니다.")
    .replace(/<article class="article">[\s\S]*?<\/article>/, '<article class="article"><h2>퍼즐은 실패한 순간을 복기합니다</h2><p>지뢰찾기는 숫자 단서를 잘못 읽은 칸, 2048은 큰 타일이 모서리에서 빠져나온 수, 스도쿠는 후보를 제거하지 못한 구간을 찾으면 다음 판의 판단을 바꿀 수 있습니다.</p><h2>아케이드는 다음 위치를 먼저 봅니다</h2><p>벽돌깨기는 패들의 현재 위치보다 공이 내려올 지점을 예측하고, 스네이크는 먹이보다 몸이 돌아나갈 공간을 먼저 확인하면 기록을 안정적으로 늘릴 수 있습니다.</p></article>');
});

console.log("Curated approval navigation around the reviewed games and guides.");
