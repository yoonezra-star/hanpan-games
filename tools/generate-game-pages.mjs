import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const publicDir = path.join(root, "public");
const arcadePath = path.join(publicDir, "assets", "arcade.js");
const arcade = fs.readFileSync(arcadePath, "utf8");

const catalog = [...arcade.matchAll(/\{ id: "([^"]+)", title: "([^"]+)", category: "([^"]+)", type: "([^"]+)", minutes: "([^"]+)", description: "([^"]+)" \}/g)]
  .map((match) => ({
    id: match[1],
    title: match[2],
    category: match[3],
    type: match[4],
    minutes: match[5],
    description: match[6],
  }));

if (catalog.length < 30) {
  throw new Error(`Expected at least 30 games, found ${catalog.length}`);
}

const customPageIds = new Set(["tic-tac-toe"]);

const categoryNames = {
  arcade: "아케이드",
  puzzle: "퍼즐",
  board: "보드·전략",
  brain: "두뇌·기억",
  skill: "스킬",
  test: "테스트",
};

const tagClass = {
  arcade: "red",
  puzzle: "blue",
  board: "gold",
  brain: "green",
  skill: "red",
  test: "gold",
};

const typeGuides = {
  tetris: {
    how: "떨어지는 블록을 좌우로 옮기고 회전해 빈틈 없이 쌓는 게임입니다. 가로 한 줄이 꽉 차면 줄이 사라지고 점수가 오릅니다. 줄을 여러 개 동시에 지우면 더 높은 점수를 얻고, 레벨이 오를수록 블록이 더 빨리 내려옵니다.",
    tips: ["블록을 가운데에만 쌓지 말고 양쪽 높이를 고르게 유지합니다.", "긴 막대 블록을 기다릴 때는 한쪽 통로를 비워 둡니다.", "빠르게 내리기보다 다음 모양을 생각하며 회전 위치를 잡습니다."],
    faq: ["키보드로 할 수 있나요?", "네. 방향키와 스페이스바로 조작할 수 있고, 모바일에서는 화면 버튼을 사용하면 됩니다."],
  },
  pong: {
    how: "패들을 위아래로 움직여 공을 받아내는 랠리 게임입니다. 공을 놓치면 상대가 득점하고, 상대가 놓치면 내가 득점합니다. 패들의 어느 부분에 공이 닿는지에 따라 반사 각도가 달라집니다.",
    tips: ["공을 따라가기보다 공이 올 위치를 먼저 예측합니다.", "패들 끝에 맞히면 각도가 커져 상대가 받기 어려워집니다.", "랠리가 길어질수록 공이 빨라지므로 중앙으로 돌아오는 습관이 좋습니다."],
    faq: ["마우스로도 움직이나요?", "네. 캔버스 위에서 포인터를 움직이면 패들이 따라옵니다."],
  },
  space: {
    how: "좌우로 움직이며 탄을 쏘고 내려오는 적 편대를 막는 슈팅 게임입니다. 적이 방어선까지 내려오면 목숨을 잃고, 모든 적을 없애면 다음 웨이브로 넘어갑니다.",
    tips: ["한쪽부터 차근차근 줄이면 피할 공간이 넓어집니다.", "발사 버튼을 계속 누르기보다 적과 정렬될 때 쏘면 명중률이 높습니다.", "웨이브가 오를수록 적이 빨라지니 중앙을 기준으로 움직입니다."],
    faq: ["연속 발사가 되나요?", "너무 빠른 연사는 제한되어 있어 타이밍을 맞춰 쏘는 편이 유리합니다."],
  },
  flappy: {
    how: "점프 버튼을 짧게 눌러 캐릭터의 높이를 조절하고 기둥 사이를 통과하는 원버튼 게임입니다. 너무 많이 누르면 위로 튀고, 늦게 누르면 아래로 떨어집니다.",
    tips: ["기둥을 보는 것보다 다음 틈의 가운데를 보는 편이 안정적입니다.", "길게 누르기보다 짧게 여러 번 눌러 높이를 조절합니다.", "초반에는 점수보다 일정한 리듬을 만드는 데 집중합니다."],
    faq: ["모바일에서도 할 수 있나요?", "네. 점프 버튼이나 게임 화면을 터치하면 바로 점프합니다."],
  },
  chair: {
    how: "사무실 의자를 타고 목적지까지 가는 관성 레이스입니다. 좌우로 방향을 돌리고 앞으로 밀면 의자가 미끄러지듯 움직입니다. 책상과 벽에 부딪히면 속도를 잃으므로 코너 전에 미리 방향을 잡아야 합니다.",
    tips: ["속도가 붙은 뒤에는 바로 멈추지 않으니 코너 전에 미리 꺾습니다.", "벽에 가까운 지름길보다 넓은 통로로 부드럽게 도는 편이 빠를 수 있습니다.", "간식 아이템을 먹으면 잠깐 속도가 오르므로 직선 구간에서 활용합니다."],
    faq: ["멀티플레이인가요?", "현재 한판게임즈 버전은 혼자 기록에 도전하는 싱글 플레이입니다."],
  },
  typing: {
    how: "화면에 표시되는 역 이름을 정확히 입력하면 열차가 다음 역으로 이동하는 타자 레이스입니다. 입력이 맞으면 자동으로 다음 역이 나오고, 틀리면 입력창이 흔들리듯 표시됩니다.",
    tips: ["긴 이름은 한 글자씩 보지 말고 익숙한 단어 덩어리로 읽습니다.", "오타가 이어지면 Enter로 입력을 비우고 다시 시작합니다.", "처음에는 속도보다 정확도를 우선하면 최종 기록이 더 안정적입니다."],
    faq: ["한글 조합 중 오타가 날 수 있나요?", "브라우저 입력 방식에 따라 차이가 있을 수 있어, 꼬였을 때는 Enter로 현재 입력을 비우는 방식을 제공합니다."],
  },
  recipe: {
    how: "여러 병에 뒤섞인 향 노트를 옮겨 같은 향끼리 모으는 소트 퍼즐입니다. 맨 위에 있는 같은 향 묶음은 한 번에 이동하고, 빈 병이나 같은 향 위에만 부을 수 있습니다.",
    tips: ["빈 병은 작업 공간이므로 초반에 너무 빨리 채우지 않습니다.", "같은 향을 하나의 병으로 몰아 갈 순서를 먼저 생각합니다.", "막혔다면 되돌리기를 써서 한 수 전으로 돌아갑니다."],
    faq: ["색이 헷갈리면 어떻게 하나요?", "각 향 칸에는 첫 글자도 함께 표시해 색만으로 구분하기 어려운 상황을 줄였습니다."],
  },
  brick: {
    how: "패들을 움직여 공을 받아내고 벽돌을 깨는 고전 아케이드 게임입니다. 공을 놓치면 목숨이 줄고, 모든 벽돌을 깨면 다음 레벨로 넘어갑니다.",
    tips: ["패들의 가운데보다 가장자리에 맞히면 공의 각도를 바꿀 수 있습니다.", "공을 쫓기보다 떨어질 위치로 먼저 이동합니다.", "레벨이 오르면 공이 빨라지니 패들을 중앙에 두는 습관이 좋습니다."],
    faq: ["마우스로도 조작할 수 있나요?", "네. 캔버스 위에서 포인터를 움직이면 패들이 따라옵니다."],
  },
  snake: {
    how: "먹이를 먹으며 몸을 늘리는 그리드 게임입니다. 벽, 자신의 몸, 장애물에 닿으면 종료됩니다. 먹이를 먹을수록 속도가 오르고 장애물이 추가됩니다.",
    tips: ["가장자리로 몰리기보다 중앙에 회전 공간을 남깁니다.", "긴 몸을 만들수록 다음 회전 경로를 미리 생각합니다.", "속도가 오를 때는 무리하게 먹이를 쫓지 않는 편이 좋습니다."],
    faq: ["방향키를 지원하나요?", "네. 방향키와 화면 버튼을 모두 사용할 수 있습니다."],
  },
  mines: {
    how: "숫자 힌트를 보고 지뢰가 없는 칸을 여는 퍼즐입니다. 첫 클릭은 안전하게 시작하며, 의심되는 칸은 깃발 모드로 표시할 수 있습니다.",
    tips: ["숫자 주변의 닫힌 칸 개수를 먼저 세어 봅니다.", "확실한 칸부터 열고 애매한 칸은 깃발로 보류합니다.", "빈 구역이 열리면 새 숫자 경계선을 기준으로 다시 판단합니다."],
    faq: ["오른쪽 클릭을 쓸 수 있나요?", "네. PC에서는 우클릭으로도 깃발을 표시할 수 있습니다."],
  },
  sudoku: {
    how: "6x6 보드의 빈칸을 채워 각 행, 열, 2x3 박스에 같은 숫자가 겹치지 않게 만드는 논리 퍼즐입니다. 충돌하는 숫자는 화면에 표시됩니다.",
    tips: ["가장 후보가 적은 칸부터 채웁니다.", "행과 열만 보지 말고 2x3 박스 안의 남은 숫자를 함께 확인합니다.", "힌트는 막힌 구간을 여는 용도로 아껴 씁니다."],
    faq: ["힌트는 몇 번 쓸 수 있나요?", "한 판에 3번까지 사용할 수 있습니다."],
  },
  default: {
    how: "짧은 규칙을 읽고 바로 시작할 수 있는 브라우저 미니게임입니다. 화면의 점수판과 결과 안내를 보면서 한 판씩 기록을 갱신해 보세요.",
    tips: ["처음 한 판은 규칙을 익히는 데 사용합니다.", "결과 메시지를 보고 다음 판에서 줄일 실수를 정합니다.", "모바일에서는 화면 버튼을 천천히 눌러 조작감을 먼저 확인합니다."],
    faq: ["기록은 어디에 저장되나요?", "최고 기록은 가능한 경우 현재 브라우저 안에만 저장됩니다."],
  },
};

function htmlEscape(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function guideFor(game) {
  return typeGuides[game.type] || typeGuides.default;
}

function relatedFor(game) {
  const same = catalog.filter((item) => item.id !== game.id && item.category === game.category).slice(0, 3);
  return same.length >= 3 ? same : catalog.filter((item) => item.id !== game.id).slice(0, 3);
}

function pageHtml(game) {
  const guide = guideFor(game);
  const related = relatedFor(game);
  const category = categoryNames[game.category] || "게임";
  const url = `https://hanpan-games.pages.dev/games/${game.id}/`;
  const description = `${game.title}는 한판게임즈에서 설치 없이 바로 즐길 수 있는 ${category} 게임입니다. 플레이 방법, 공략 팁, 자주 묻는 질문을 확인하고 바로 플레이하세요.`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "VideoGame",
        "name": game.title,
        "url": url,
        "description": game.description,
        "applicationCategory": "Game",
        "operatingSystem": "Web Browser",
        "inLanguage": "ko-KR",
        "isAccessibleForFree": true,
        "publisher": { "@type": "Organization", "name": "한판게임즈" }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://hanpan-games.pages.dev/" },
          { "@type": "ListItem", "position": 2, "name": "게임", "item": "https://hanpan-games.pages.dev/games/" },
          { "@type": "ListItem", "position": 3, "name": game.title, "item": url }
        ]
      }
    ]
  };

  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${htmlEscape(game.title)} - 한판게임즈</title>
    <meta name="description" content="${htmlEscape(description)}">
    <link rel="canonical" href="${url}">
    <link rel="stylesheet" href="/assets/styles.css">
  </head>
  <body>
    <header class="site-header">
      <a class="brand" href="/" aria-label="한판게임즈 홈">
        <span class="brand-mark" aria-hidden="true">H</span>
        <span><strong>한판게임즈</strong><small>HANPAN GAMES</small></span>
      </a>
      <nav class="nav" aria-label="주요 메뉴">
        <a href="/games/" aria-current="page">게임</a>
        <a href="/guides/">가이드</a>
        <a href="/about/">소개</a>
        <a href="/help/">도움말</a>
        <a href="/contact/">문의</a>
      </nav>
    </header>

    <main class="subpage game-detail-page">
      <section class="page-title">
        <p class="eyebrow">${htmlEscape(category)} · ${htmlEscape(game.minutes)}</p>
        <h1 id="playTitle">${htmlEscape(game.title)}</h1>
        <p id="playDescription">${htmlEscape(game.description)}</p>
        <div class="link-row">
          <a class="button primary" href="#play-area">바로 플레이</a>
          <a class="button secondary" href="/games/">전체 게임 보기</a>
        </div>
        <ul class="toc-list" aria-label="페이지 목차">
          <li><a href="#how">게임 방법</a></li>
          <li><a href="#tips">공략 팁</a></li>
          <li><a href="#faq">자주 묻는 질문</a></li>
          <li><a href="#related">관련 게임</a></li>
        </ul>
      </section>

      <div class="game-detail-grid">
        <article class="article">
          <h2 id="how">게임 방법</h2>
          <p>${htmlEscape(guide.how)}</p>
          <p>${htmlEscape(game.title)}는 별도 앱 설치나 로그인이 필요 없습니다. 페이지 안의 플레이 영역에서 바로 시작할 수 있고, 가능한 기록은 현재 브라우저에만 저장됩니다.</p>

          <h2 id="tips">공략 팁</h2>
          <ul>
            ${guide.tips.map((tip) => `<li>${htmlEscape(tip)}</li>`).join("\n            ")}
          </ul>

          <h2>플레이 흐름</h2>
          <p>
            한 판을 시작하면 상단 점수판에서 현재 진행 상태를 확인할 수 있습니다.
            결과 메시지는 실수, 성공, 최고 기록 여부를 알려 주므로 다음 판에서 무엇을 바꿀지 바로 판단할 수 있습니다.
          </p>

          <h2 id="faq">자주 묻는 질문</h2>
          <h3>${htmlEscape(guide.faq[0])}</h3>
          <p>${htmlEscape(guide.faq[1])}</p>
          <h3>모바일에서도 플레이할 수 있나요?</h3>
          <p>네. 화면 버튼을 함께 제공하며, 작은 화면에서도 게임판과 결과 영역이 겹치지 않도록 구성했습니다.</p>
          <h3>기록이 사라질 수 있나요?</h3>
          <p>기록은 브라우저 로컬 저장소를 사용합니다. 브라우저 데이터를 삭제하거나 다른 기기에서 접속하면 기록이 이어지지 않을 수 있습니다.</p>

          <h2 id="related">관련 게임</h2>
          <p>
            ${related.map((item) => `<a href="/games/${item.id}/">${htmlEscape(item.title)}</a>`).join(", ")}도 함께 플레이해 보세요.
            전체 게임은 <a href="/games/">게임 목록</a>에서 장르별로 확인할 수 있습니다.
          </p>
        </article>

        <section class="inline-game-stage" id="play-area" aria-live="polite">
          <div class="stage-head">
            <div>
              <p class="eyebrow" id="playCategory">${htmlEscape(category)} · ${htmlEscape(game.minutes)}</p>
              <h2 id="stageTitle">${htmlEscape(game.title)}</h2>
            </div>
            <div class="stage-actions">
              <a class="button secondary" href="/play/?game=${game.id}">큰 화면</a>
              <button class="button primary" id="restartGame" type="button">다시 시작</button>
            </div>
          </div>
          <div class="play-surface" id="playSurface" data-game-id="${game.id}"></div>
          <p class="result-line" id="playResult">게임을 불러오는 중입니다.</p>
        </section>
      </div>
    </main>

    <footer class="site-footer">
      <div>
        <strong>한판게임즈</strong>
        <p>${htmlEscape(game.title)}와 함께 즐기는 무료 웹 미니게임.</p>
      </div>
      <nav aria-label="푸터 메뉴">
        <a href="/about/">소개</a>
        <a href="/help/">도움말</a>
        <a href="/updates/">업데이트</a>
        <a href="/privacy/">개인정보처리방침</a>
        <a href="/terms/">이용약관</a>
        <a href="/contact/">문의</a>
      </nav>
      <p class="copyright">© <span id="year"></span> Hanpan Games. All rights reserved.</p>
    </footer>
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
    <script src="/assets/app.js" defer></script>
    <script src="/assets/arcade.js" defer></script>
  </body>
</html>
`;
}

for (const game of catalog) {
  const dir = path.join(publicDir, "games", game.id);
  const outputPath = path.join(dir, "index.html");
  fs.mkdirSync(dir, { recursive: true });
  if (!customPageIds.has(game.id) || !fs.existsSync(outputPath)) {
    fs.writeFileSync(outputPath, pageHtml(game), "utf8");
  }
}

const staticUrls = [
  { loc: "https://hanpan-games.pages.dev/", priority: "1.0", changefreq: "weekly" },
  { loc: "https://hanpan-games.pages.dev/games/", priority: "0.9", changefreq: "weekly" },
  { loc: "https://hanpan-games.pages.dev/play/", priority: "0.9", changefreq: "weekly" },
  { loc: "https://hanpan-games.pages.dev/guides/", priority: "0.8", changefreq: "monthly" },
  { loc: "https://hanpan-games.pages.dev/help/", priority: "0.7", changefreq: "monthly" },
  { loc: "https://hanpan-games.pages.dev/updates/", priority: "0.6", changefreq: "monthly" },
  { loc: "https://hanpan-games.pages.dev/about/", priority: "0.6", changefreq: "monthly" },
  { loc: "https://hanpan-games.pages.dev/privacy/", priority: "0.5", changefreq: "yearly" },
  { loc: "https://hanpan-games.pages.dev/terms/", priority: "0.5", changefreq: "yearly" },
  { loc: "https://hanpan-games.pages.dev/contact/", priority: "0.5", changefreq: "yearly" },
];

const gameUrls = catalog.map((game) => ({
  loc: `https://hanpan-games.pages.dev/games/${game.id}/`,
  priority: "0.8",
  changefreq: "monthly",
}));

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls.concat(gameUrls).map((item) => `  <url>
    <loc>${item.loc}</loc>
    <lastmod>2026-07-20</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`).join("\n")}
</urlset>
`;

fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap, "utf8");
console.log(`Generated ${catalog.length} game pages and sitemap entries. Preserved ${customPageIds.size} custom page.`);
