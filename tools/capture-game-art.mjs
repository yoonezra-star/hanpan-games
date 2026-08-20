import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const root = process.cwd();
const publicDir = path.join(root, "public");
const artDir = path.join(publicDir, "assets", "game-art");
const depsDir = process.env.CODEX_NODE_MODULES;

if (!depsDir) {
  throw new Error("Set CODEX_NODE_MODULES to the bundled Codex node_modules directory.");
}

const requireFromDeps = createRequire(path.join(depsDir, "package.json"));
const { chromium } = requireFromDeps("playwright");
const sharp = requireFromDeps("sharp");
const arcade = fs.readFileSync(path.join(publicDir, "assets", "arcade.js"), "utf8");
const allGameIds = [...arcade.matchAll(
  /\{ id: "([^"]+)", title: "([^"]+)", category: "([^"]+)", type: "([^"]+)", minutes: "([^"]+)", description: "([^"]+)" \}/g,
)].map((match) => match[1]);
const requestedIds = process.argv
  .find((argument) => argument.startsWith("--ids="))
  ?.slice("--ids=".length)
  .split(",")
  .filter(Boolean);
const force = process.argv.includes("--force");
const gameIds = (requestedIds?.length ? requestedIds : allGameIds).filter((id) => {
  return force || !fs.existsSync(path.join(artDir, `${id}.webp`));
});

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function serveFile(request, response) {
  const requestUrl = new URL(request.url || "/", "http://127.0.0.1");
  const cleanPath = decodeURIComponent(requestUrl.pathname).replace(/^\/+/, "");
  let filePath = path.resolve(publicDir, cleanPath);
  if (!filePath.startsWith(path.resolve(publicDir))) {
    response.writeHead(403).end("Forbidden");
    return;
  }
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }
  if (!fs.existsSync(filePath)) {
    response.writeHead(404).end("Not found");
    return;
  }
  response.writeHead(200, {
    "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream",
    "Cache-Control": "no-store",
  });
  fs.createReadStream(filePath).pipe(response);
}

fs.mkdirSync(artDir, { recursive: true });

const server = http.createServer(serveFile);
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const port = server.address().port;
const executablePath = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const browser = await chromium.launch({ executablePath, headless: true });
const context = await browser.newContext({
  viewport: { width: 900, height: 900 },
  deviceScaleFactor: 1,
  locale: "ko-KR",
  colorScheme: "light",
  reducedMotion: "reduce",
});
const page = await context.newPage();

try {
  for (const id of gameIds) {
    await page.goto(`http://127.0.0.1:${port}/games/${id}/`, { waitUntil: "networkidle" });
    const surface = page.locator("#playSurface");
    await surface.waitFor({ state: "visible" });
    await page.addStyleTag({
      content: `
        #playSurface {
          box-sizing: border-box !important;
          width: 760px !important;
          min-height: 430px !important;
          max-height: 430px !important;
          overflow: hidden !important;
        }
        #playSurface .play-guidance { display: none !important; }
      `,
    });

    const start = surface.locator("button.primary:not([disabled])").first();
    if (await start.count()) {
      await start.click().catch(() => {});
      await page.waitForTimeout(450);
    }

    if (id === "omok") {
      await page.getByRole("button", { name: "2인 대전", exact: true }).click();
      for (const index of [112, 97, 113, 98, 114, 99, 115]) {
        await surface.locator(".omok-cell").nth(index).click();
      }
    }

    if (id === "card-solitaire") {
      for (let draw = 0; draw < 3; draw += 1) {
        await surface.locator(".solitaire-stock-button").click();
      }
    }

    if (id === "mines") {
      await surface.locator(".mines-cell").nth(40).click();
      const closedCell = surface.locator(".mines-cell:not(.is-open)").first();
      if (await closedCell.count()) await closedCell.click({ button: "right" });
    }

    if (id === "twenty-48") {
      const board = surface.locator(".board-2048");
      for (const key of ["ArrowLeft", "ArrowDown", "ArrowLeft", "ArrowDown", "ArrowRight", "ArrowDown", "ArrowLeft", "ArrowDown", "ArrowLeft", "ArrowUp", "ArrowLeft", "ArrowDown"]) {
        await board.press(key);
      }
      await page.waitForTimeout(220);
    }

    if (id === "sudoku-mini") {
      const hintButton = surface.getByRole("button", { name: /힌트 3/ });
      await hintButton.click();
      await surface.getByRole("button", { name: /힌트 2/ }).click();
      const emptyCell = surface.locator(".sudoku-cell:not(.is-given):not(.is-hinted)").first();
      await emptyCell.click();
      await surface.getByRole("button", { name: "메모 꺼짐" }).click();
      await surface.getByRole("button", { name: "3 입력" }).click();
      await surface.getByRole("button", { name: "7 입력" }).click();
    }

    if (id === "bubble-shooter" || id === "omok" || id === "card-solitaire" || id === "freecell-classic" || id === "maze-chase" || id === "mines" || id === "twenty-48" || id === "sudoku-mini") {
      await page.addStyleTag({
        content: `
          #playSurface {
            min-height: 0 !important;
            max-height: none !important;
            overflow: visible !important;
          }
          #playSurface .mini-score,
          #playSurface .omok-settings,
          #playSurface .omok-status,
          #playSurface .solitaire-settings,
          #playSurface .solitaire-actions,
          #playSurface .freecell-settings,
          #playSurface .mines-settings,
          #playSurface .status-2048,
          #playSurface .sudoku-settings,
          #playSurface .sudoku-number-pad,
          #playSurface .sudoku-controls,
          #playSurface .maze-status,
          #playSurface .mini-controls,
          #playSurface .mini-note { display: none !important; }
        `,
      });
    }

    const captureTarget = id === "bubble-shooter"
      ? surface.locator("canvas")
      : id === "omok"
        ? surface.locator(".omok-board")
        : id === "card-solitaire"
          ? surface.locator(".solitaire-board")
          : id === "freecell-classic"
            ? surface.locator(".freecell-board")
          : id === "mines"
            ? surface.locator(".mines-board")
          : id === "twenty-48"
            ? surface.locator(".board-2048")
          : id === "sudoku-mini"
            ? surface.locator(".sudoku-board")
          : id === "maze-chase"
            ? surface.locator(".maze-canvas")
        : surface;
    const png = await captureTarget.screenshot({ animations: "disabled" });
    await sharp(png)
      .resize(640, 360, id === "twenty-48" || id === "sudoku-mini"
        ? { fit: "contain", background: "#202735" }
        : { fit: "cover", position: id === "maze-chase" ? "south" : "north" })
      .webp({ quality: 84, effort: 5 })
      .toFile(path.join(artDir, `${id}.webp`));
    console.log(`Captured ${id}.webp`);
  }
} finally {
  await page.close();
  await context.close();
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}

console.log(`Created ${gameIds.length} game thumbnails.`);
