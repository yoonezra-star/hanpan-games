const adsensePattern = /\s*<script async src="https:\/\/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-[^"]+" crossorigin="anonymous"><\/script>/g;
const adsenseCheckPattern = /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/;
const noindexPattern = /\s*<meta name="robots" content="noindex, follow">/g;
const adsenseScript = '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6918910185244897" crossorigin="anonymous"></script>';

export const INDEXABLE_GAME_IDS = Object.freeze([
  "mines",
  "card-solitaire",
  "sudoku-mini",
  "twenty-48",
  "block-drop-classic",
  "brick-break",
  "snake-garden",
  "freecell-classic",
  "tic-tac-toe",
  "connect-four",
  "maze-chase",
  "match-three",
  "sliding-puzzle",
  "hangman",
  "flappy-jump",
  "omok",
  "bubble-shooter",
  "pong-rally",
  "simon",
  "reaction-speed",
]);

export const FLAGSHIP_GAME_IDS = Object.freeze([
  "mines",
  "card-solitaire",
  "sudoku-mini",
  "twenty-48",
  "block-drop-classic",
  "brick-break",
  "snake-garden",
  "freecell-classic",
  "tic-tac-toe",
  "connect-four",
  "maze-chase",
  "match-three",
  "sliding-puzzle",
  "hangman",
  "flappy-jump",
  "omok",
  "bubble-shooter",
  "pong-rally",
  "simon",
  "reaction-speed",
]);

export const INDEXABLE_GUIDE_IDS = Object.freeze([
  "block-drop-beginner",
  "brick-break-strategy",
  "browser-game-benefits",
  "memory-game-tips",
  "mines-beginner-guide",
  "mobile-browser-game-tips",
  "short-break-web-games",
  "snake-garden-guide",
  "sudoku-classic-guide",
  "tic-tac-toe-strategy",
  "twenty-48-strategy",
  "omok-strategy",
  "bubble-shooter-strategy",
  "pong-rally-strategy",
  "simon-strategy",
  "reaction-speed-guide",
]);

export const INDEXABLE_CATEGORY_IDS = Object.freeze([
  "arcade",
  "board",
  "brain",
  "puzzle",
  "skill",
  "traditional",
]);

export const indexableGameIds = new Set(INDEXABLE_GAME_IDS);
export const indexableGuideIds = new Set(INDEXABLE_GUIDE_IDS);
export const gameCategoryIds = new Set(INDEXABLE_CATEGORY_IDS);
export const indexableGamePageIds = new Set([...INDEXABLE_GAME_IDS, ...INDEXABLE_CATEGORY_IDS]);

export function applyIndexingPolicy(html, indexable) {
  let next = html.replace(noindexPattern, "");
  const marker = next.match(/<meta name="viewport" content="[^"]+">/i)?.[0];
  if (!marker) {
    throw new Error("Could not find the viewport meta tag while applying the content quality policy.");
  }

  if (indexable) {
    if (!adsenseCheckPattern.test(next)) {
      next = next.replace(marker, `${marker}\n    ${adsenseScript}`);
    }
    return next;
  }

  next = next.replace(adsensePattern, "");
  return next.replace(marker, `${marker}\n    <meta name="robots" content="noindex, follow">`);
}
