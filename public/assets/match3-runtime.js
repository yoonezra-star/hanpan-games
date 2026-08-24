(function () {
  const SAVE_KEY = "hanpan-match3-save-v2";
  const RECORD_KEY = "hanpan-match3-records-v2";
  const rows = 7;
  const cols = 7;
  const colorCount = 6;
  const symbols = ["●", "◆", "▲", "■", "★", "✦"];
  const stages = [
    { moves: 24, score: 1200, color: 0, colorGoal: 10 },
    { moves: 23, score: 1700, color: 1, colorGoal: 13 },
    { moves: 22, score: 2300, color: 2, colorGoal: 16 },
    { moves: 21, score: 3000, color: 3, colorGoal: 18 },
    { moves: 20, score: 3800, color: 4, colorGoal: 20 }
  ];
  let styleAdded = false;

  function readJson(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "null");
      return value && typeof value === "object" ? value : fallback;
    } catch (error) { return fallback; }
  }
  function writeJson(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (error) { /* optional */ } }
  function removeKey(key) { try { localStorage.removeItem(key); } catch (error) { /* optional */ } }
  function indexOf(row, col) { return row * cols + col; }
  function rowOf(index) { return Math.floor(index / cols); }
  function colOf(index) { return index % cols; }
  function adjacent(a, b) { return Math.abs(rowOf(a) - rowOf(b)) + Math.abs(colOf(a) - colOf(b)) === 1; }
  function randomColor() { return Math.floor(Math.random() * colorCount); }
  function tile(color, special) { return { c: color, s: special || null }; }
  function cloneBoard(board) { return board.map(function (item) { return tile(item.c, item.s); }); }

  function stageConfig(stage) {
    const base = stages[Math.min(stage - 1, stages.length - 1)];
    if (stage <= stages.length) return base;
    return {
      moves: Math.max(16, base.moves - Math.floor((stage - stages.length) / 2)),
      score: base.score + (stage - stages.length) * 900,
      color: (stage - 1) % colorCount,
      colorGoal: base.colorGoal + (stage - stages.length) * 3
    };
  }

  function findRuns(board) {
    const runs = [];
    for (let r = 0; r < rows; r += 1) {
      let start = 0;
      while (start < cols) {
        const first = board[indexOf(r, start)];
        if (!first || first.s === "rainbow") { start += 1; continue; }
        let end = start + 1;
        while (end < cols) {
          const next = board[indexOf(r, end)];
          if (!next || next.s === "rainbow" || next.c !== first.c) break;
          end += 1;
        }
        if (end - start >= 3) runs.push({ dir: "h", color: first.c, indexes: Array.from({ length: end - start }, function (_, i) { return indexOf(r, start + i); }) });
        start = end;
      }
    }
    for (let c = 0; c < cols; c += 1) {
      let start = 0;
      while (start < rows) {
        const first = board[indexOf(start, c)];
        if (!first || first.s === "rainbow") { start += 1; continue; }
        let end = start + 1;
        while (end < rows) {
          const next = board[indexOf(end, c)];
          if (!next || next.s === "rainbow" || next.c !== first.c) break;
          end += 1;
        }
        if (end - start >= 3) runs.push({ dir: "v", color: first.c, indexes: Array.from({ length: end - start }, function (_, i) { return indexOf(start + i, c); }) });
        start = end;
      }
    }
    return runs;
  }

  function hasMatch(board) { return findRuns(board).length > 0; }
  function swap(board, a, b) { const temp = board[a]; board[a] = board[b]; board[b] = temp; }
  function specialSwapWorks(board, a, b) { return Boolean(board[a] && board[b] && (board[a].s === "rainbow" || board[b].s === "rainbow")); }

  function isValidSwap(board, a, b) {
    if (!adjacent(a, b)) return false;
    if (specialSwapWorks(board, a, b)) return true;
    swap(board, a, b);
    const valid = hasMatch(board);
    swap(board, a, b);
    return valid;
  }

  function validMoves(board) {
    const moves = [];
    for (let i = 0; i < board.length; i += 1) {
      const r = rowOf(i), c = colOf(i);
      if (c + 1 < cols && isValidSwap(board, i, i + 1)) moves.push([i, i + 1]);
      if (r + 1 < rows && isValidSwap(board, i, i + cols)) moves.push([i, i + cols]);
    }
    return moves;
  }

  function makeBoardFallback() {
    const board = Array.from({ length: rows * cols }, function (_, index) { return tile((rowOf(index) * 2 + colOf(index)) % colorCount); });
    board[indexOf(3, 2)] = tile(0);
    board[indexOf(3, 3)] = tile(1);
    board[indexOf(3, 4)] = tile(0);
    board[indexOf(2, 3)] = tile(0);
    return board;
  }

  function makeBoard() {
    for (let attempt = 0; attempt < 80; attempt += 1) {
      const board = [];
      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          const banned = new Set();
          if (c >= 2) {
            const a = board[indexOf(r, c - 1)], b = board[indexOf(r, c - 2)];
            if (a && b && a.c === b.c) banned.add(a.c);
          }
          if (r >= 2) {
            const a = board[indexOf(r - 1, c)], b = board[indexOf(r - 2, c)];
            if (a && b && a.c === b.c) banned.add(a.c);
          }
          const choices = Array.from({ length: colorCount }, function (_, i) { return i; }).filter(function (value) { return !banned.has(value); });
          board.push(tile(choices[Math.floor(Math.random() * choices.length)]));
        }
      }
      if (!hasMatch(board) && validMoves(board).length) return board;
    }
    return makeBoardFallback();
  }

  function addStyle() {
    if (styleAdded) return;
    styleAdded = true;
    const style = document.createElement("style");
    style.textContent = `
      .match3-runtime-root{display:grid;gap:13px;max-width:820px;margin:0 auto}
      .match3-status{display:grid;gap:3px;text-align:center;padding:10px 12px;border-radius:12px;background:rgba(92,83,180,.08)}
      .match3-status strong{font-size:1rem}.match3-status span{font-size:.9rem;opacity:.8}
      .match3-goals,.match3-actions,.match3-records{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;align-items:center}
      .match3-goals span,.match3-goals strong,.match3-records span,.match3-records strong{padding:6px 9px;border-radius:999px;background:rgba(29,36,51,.06)}
      .match3-board{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;width:min(100%,500px);aspect-ratio:1;margin:0 auto;padding:8px;border:2px solid rgba(29,36,51,.18);border-radius:16px;background:#e9e2d4;touch-action:none;user-select:none}
      .match3-cell{position:relative;min-width:0;min-height:0;border:1px solid rgba(29,36,51,.22);border-radius:12px;background:#fffaf0;font:800 clamp(1rem,4.5vw,1.8rem)/1 system-ui,sans-serif;cursor:pointer;transition:transform .12s ease}
      .match3-cell[data-color="0"]{color:#db514b}.match3-cell[data-color="1"]{color:#3d78c4}.match3-cell[data-color="2"]{color:#3a9a62}.match3-cell[data-color="3"]{color:#8b62c8}.match3-cell[data-color="4"]{color:#d39125}.match3-cell[data-color="5"]{color:#328a98}
      .match3-cell.is-selected{outline:4px solid #ffcf5d;outline-offset:-4px;transform:scale(.94)}
      .match3-cell.is-hint{animation:m3Hint .7s ease-in-out 2;outline:4px solid #62a9e6;outline-offset:-4px}
      .match3-cell[data-special="h"]::after,.match3-cell[data-special="v"]::after,.match3-cell[data-special="rainbow"]::after{position:absolute;right:4px;bottom:3px;font-size:.68rem;padding:2px 4px;border-radius:999px;background:#1d2433;color:#fff}
      .match3-cell[data-special="h"]::after{content:"↔"}.match3-cell[data-special="v"]::after{content:"↕"}.match3-cell[data-special="rainbow"]::after{content:"◎"}
      .match3-cell[data-special="rainbow"]{background:conic-gradient(#ffe18c,#c8f1c9,#b7dfff,#e5c9ff,#ffd1cb,#ffe18c);color:#1d2433}
      .match3-note{text-align:center;margin:0}
      @keyframes m3Hint{50%{transform:scale(1.08)}}
      @media(max-width:760px){.match3-runtime-root{gap:10px}.match3-board{width:min(100%,390px);gap:4px;padding:5px}.match3-actions{position:sticky;bottom:8px;z-index:6;padding:8px;border-radius:14px;background:rgba(255,253,247,.95);box-shadow:0 8px 24px rgba(29,36,51,.14)}.match3-actions .button{min-height:44px;flex:1 1 110px}}
      @media(prefers-reduced-motion:reduce){.match3-cell{transition:none}.match3-cell.is-hint{animation:none}}
    `;
    document.head.appendChild(style);
  }

  function setup(surface) {
    if (surface.querySelector(".match3-runtime-root")) return false;
    addStyle();
    surface.classList.add("match3-runtime-game");
    surface.innerHTML = "";

    const saved = readJson(SAVE_KEY, null);
    const record = Object.assign({ bestScore: 0, bestStage: 1, clears: 0, bestCombo: 0 }, readJson(RECORD_KEY, {}));
    let stage = 1;
    let board = [];
    let score = 0;
    let movesLeft = 0;
    let colorCleared = 0;
    let comboBest = 0;
    let selected = null;
    let locked = false;
    let finished = false;
    let hintTimer = null;
    let swipeStart = null;

    const root = document.createElement("div"); root.className = "match3-runtime-root";
    const hud = document.createElement("div"); hud.className = "mini-score";
    const hudLabels = ["점수", "이동", "스테이지", "연쇄", "최고"];
    const hudValues = hudLabels.map(function (label) {
      const span = document.createElement("span"), b = document.createElement("b"), small = document.createElement("small");
      b.textContent = "-"; small.textContent = label; span.append(b, small); hud.appendChild(span); return b;
    });
    const goals = document.createElement("div"); goals.className = "match3-goals";
    const status = document.createElement("div"); status.className = "match3-status"; status.setAttribute("aria-live", "polite");
    const gameBoard = document.createElement("div"); gameBoard.className = "match3-board"; gameBoard.tabIndex = 0; gameBoard.setAttribute("role", "grid"); gameBoard.setAttribute("aria-label", "7 곱하기 7 매치3 퍼즐 보드");
    const actions = document.createElement("div"); actions.className = "mini-controls match3-actions";
    const newButton = document.createElement("button"); newButton.type = "button"; newButton.className = "button primary"; newButton.textContent = "새 도전";
    const hintButton = document.createElement("button"); hintButton.type = "button"; hintButton.className = "button secondary"; hintButton.textContent = "힌트";
    const shuffleButton = document.createElement("button"); shuffleButton.type = "button"; shuffleButton.className = "button secondary"; shuffleButton.textContent = "재셔플";
    actions.append(newButton, hintButton, shuffleButton);
    const records = document.createElement("div"); records.className = "match3-records";
    const note = document.createElement("p"); note.className = "mini-note match3-note"; note.textContent = "4개 매치는 줄폭탄, 5개 이상 매치는 컬러폭탄을 만듭니다. H=힌트, N=새 도전.";
    root.append(hud, goals, status, gameBoard, actions, records, note); surface.appendChild(root);

    function cfg() { return stageConfig(stage); }
    function announce(title, text) {
      status.innerHTML = `<strong>${title}</strong><span>${text}</span>`;
      const result = document.querySelector("#playResult"); if (result) result.textContent = `${title} · ${text}`;
    }
    function saveRecord() { writeJson(RECORD_KEY, record); }
    function saveGame() {
      if (!finished && !locked) writeJson(SAVE_KEY, { version: 2, stage: stage, board: board, score: score, movesLeft: movesLeft, colorCleared: colorCleared, comboBest: comboBest });
    }
    function validSaved(value) {
      return value && value.version === 2 && Number.isInteger(value.stage) && value.stage >= 1 && Array.isArray(value.board) && value.board.length === rows * cols && value.board.every(function (item) {
        return item && Number.isInteger(item.c) && item.c >= 0 && item.c < colorCount && [null, "h", "v", "rainbow"].includes(item.s || null);
      });
    }
    function goalDone() { return score >= cfg().score && colorCleared >= cfg().colorGoal; }
    function updateHud(chain) {
      hudValues[0].textContent = String(score);
      hudValues[1].textContent = String(movesLeft);
      hudValues[2].textContent = String(stage);
      hudValues[3].textContent = chain ? `x${chain}` : "-";
      hudValues[4].textContent = String(record.bestScore || "-");
      goals.innerHTML = `<strong>목표</strong><span>${score}/${cfg().score}점</span><span>${symbols[cfg().color]} ${colorCleared}/${cfg().colorGoal}</span>`;
      records.innerHTML = `<strong>기록</strong><span>최고 점수 ${record.bestScore}</span><span>최고 스테이지 ${record.bestStage}</span><span>클리어 ${record.clears}</span><span>최고 연쇄 x${record.bestCombo}</span>`;
    }
    function render(chain) {
      gameBoard.innerHTML = "";
      board.forEach(function (item, index) {
        const button = document.createElement("button");
        button.type = "button"; button.className = "match3-cell"; button.dataset.index = String(index); button.dataset.color = String(item.c); button.dataset.special = item.s || "";
        button.textContent = item.s === "rainbow" ? "◎" : symbols[item.c]; button.disabled = locked || finished; button.classList.toggle("is-selected", selected === index);
        button.setAttribute("role", "gridcell");
        button.setAttribute("aria-label", `${rowOf(index)+1}행 ${colOf(index)+1}열 ${item.s === "rainbow" ? "컬러폭탄" : symbols[item.c] + (item.s === "h" ? " 가로 줄폭탄" : item.s === "v" ? " 세로 줄폭탄" : " 타일")}`);
        button.addEventListener("click", function () { choose(index); }); gameBoard.appendChild(button);
      });
      updateHud(chain || 0);
    }

    function addSpecialClears(clearSet, index) {
      const item = board[index]; if (!item) return;
      if (item.s === "h") for (let c = 0; c < cols; c += 1) clearSet.add(indexOf(rowOf(index), c));
      if (item.s === "v") for (let r = 0; r < rows; r += 1) clearSet.add(indexOf(r, colOf(index)));
    }

    function expandSpecials(clearSet) {
      const queue = Array.from(clearSet), seen = new Set();
      while (queue.length) {
        const index = queue.shift(); if (seen.has(index)) continue; seen.add(index);
        const before = clearSet.size; addSpecialClears(clearSet, index);
        if (clearSet.size > before) Array.from(clearSet).forEach(function (value) { if (!seen.has(value)) queue.push(value); });
      }
    }

    function anchorFor(run, swapped) {
      if (swapped) {
        const preferred = swapped.find(function (index) { return run.indexes.includes(index); });
        if (preferred !== undefined) return preferred;
      }
      return run.indexes[Math.floor(run.indexes.length / 2)];
    }

    function dropAndFill() {
      for (let c = 0; c < cols; c += 1) {
        const stack = [];
        for (let r = rows - 1; r >= 0; r -= 1) { const item = board[indexOf(r, c)]; if (item) stack.push(item); }
        for (let r = rows - 1; r >= 0; r -= 1) board[indexOf(r, c)] = stack.length ? stack.shift() : tile(randomColor());
      }
    }

    function resolveRuns(runs, chain, swapped) {
      const clearSet = new Set(), creations = new Map();
      runs.forEach(function (run) {
        run.indexes.forEach(function (index) { clearSet.add(index); });
        if (run.indexes.length >= 5) creations.set(anchorFor(run, swapped), tile(run.color, "rainbow"));
        else if (run.indexes.length === 4) creations.set(anchorFor(run, swapped), tile(run.color, run.dir));
      });
      creations.forEach(function (_, index) { clearSet.delete(index); });
      expandSpecials(clearSet);
      let targetRemoved = 0;
      clearSet.forEach(function (index) { if (board[index] && board[index].c === cfg().color) targetRemoved += 1; });
      colorCleared += targetRemoved;
      const gained = clearSet.size * 12 * chain + creations.size * 20 * chain;
      score += gained; comboBest = Math.max(comboBest, chain); record.bestCombo = Math.max(record.bestCombo, comboBest);
      clearSet.forEach(function (index) { board[index] = null; });
      creations.forEach(function (value, index) { board[index] = value; });
      dropAndFill();
      return { removed: clearSet.size, gained: gained };
    }

    function activateRainbow(a, b) {
      const first = board[a], second = board[b], clearSet = new Set();
      if (first.s === "rainbow" && second.s === "rainbow") board.forEach(function (_, index) { clearSet.add(index); });
      else {
        const rainbowIndex = first.s === "rainbow" ? a : b;
        const other = board[first.s === "rainbow" ? b : a];
        board.forEach(function (item, index) { if (item && (index === rainbowIndex || item.c === other.c)) clearSet.add(index); });
      }
      expandSpecials(clearSet);
      let targetRemoved = 0;
      clearSet.forEach(function (index) { if (board[index] && board[index].c === cfg().color) targetRemoved += 1; });
      colorCleared += targetRemoved;
      const gained = clearSet.size * 16; score += gained;
      clearSet.forEach(function (index) { board[index] = null; }); dropAndFill();
      return { removed: clearSet.size, gained: gained };
    }

    function reshuffle(message) {
      board = makeBoard(); selected = null;
      announce("보드 재셔플", message || "가능한 교환이 없어 자동으로 보드를 다시 섞었습니다.");
      render(0); saveGame();
    }

    function afterStable(chain, total) {
      locked = false;
      record.bestScore = Math.max(record.bestScore, score); record.bestStage = Math.max(record.bestStage, stage); saveRecord();
      if (goalDone()) {
        record.clears += 1; record.bestStage = Math.max(record.bestStage, stage + 1); saveRecord();
        stage += 1; score += 300; movesLeft = stageConfig(stage).moves; colorCleared = 0; board = makeBoard(); selected = null;
        announce("스테이지 클리어", `${stage - 1}단계를 완료했습니다. 보너스 300점과 함께 ${stage}단계를 시작합니다.`); render(0); saveGame(); return;
      }
      if (movesLeft <= 0) {
        finished = true; removeKey(SAVE_KEY); record.bestScore = Math.max(record.bestScore, score); saveRecord();
        announce("도전 종료", `${stage}단계에서 종료했습니다. 최종 ${score}점, 최고 연쇄 x${comboBest}입니다.`); render(chain); return;
      }
      if (!validMoves(board).length) { reshuffle("연쇄가 끝난 뒤 가능한 교환이 없어 자동 재셔플했습니다."); return; }
      announce(chain > 1 ? `연쇄 x${chain}` : "매치 성공", `${total.removed}개 제거 · +${total.gained}점. 이동 ${movesLeft}회 남았습니다.`);
      render(chain); saveGame();
    }

    function resolveCascade(chain, total) {
      const runs = findRuns(board);
      if (!runs.length) { afterStable(Math.max(1, chain - 1), total); return; }
      const summary = resolveRuns(runs, chain, null);
      total.removed += summary.removed; total.gained += summary.gained;
      render(chain);
      setTimeout(function () { resolveCascade(chain + 1, total); }, 150);
    }

    function performSwap(a, b) {
      if (locked || finished || !adjacent(a, b)) return;
      locked = true; selected = null;
      const rainbow = specialSwapWorks(board, a, b);
      if (!rainbow) {
        swap(board, a, b);
        if (!hasMatch(board)) {
          swap(board, a, b); locked = false; announce("교환 취소", "매치가 생기지 않는 교환은 이동 수를 사용하지 않습니다."); render(0); return;
        }
      }
      movesLeft -= 1;
      const first = rainbow ? activateRainbow(a, b) : resolveRuns(findRuns(board), 1, [a, b]);
      render(1);
      setTimeout(function () { resolveCascade(2, { removed: first.removed, gained: first.gained }); }, 150);
    }

    function choose(index) {
      if (locked || finished) return;
      if (selected === null) { selected = index; announce("타일 선택", "인접한 타일을 하나 더 선택하세요."); render(0); return; }
      if (selected === index) { selected = null; render(0); return; }
      if (!adjacent(selected, index)) { selected = index; announce("타일 변경", "새 타일을 선택했습니다. 인접한 타일을 골라 교환하세요."); render(0); return; }
      performSwap(selected, index);
    }

    function hint() {
      if (locked || finished) return;
      clearTimeout(hintTimer);
      const moves = validMoves(board);
      if (!moves.length) { reshuffle(); return; }
      const choice = moves[Math.floor(Math.random() * moves.length)];
      announce("힌트", `${rowOf(choice[0])+1}행 ${colOf(choice[0])+1}열과 ${rowOf(choice[1])+1}행 ${colOf(choice[1])+1}열을 바꿔 보세요.`);
      render(0);
      choice.forEach(function (index) { const cell = gameBoard.querySelector(`[data-index="${index}"]`); if (cell) cell.classList.add("is-hint"); });
      hintTimer = setTimeout(function () { gameBoard.querySelectorAll(".is-hint").forEach(function (cell) { cell.classList.remove("is-hint"); }); }, 1500);
    }

    function newRun() {
      stage = 1; score = 0; movesLeft = stageConfig(1).moves; colorCleared = 0; comboBest = 0; selected = null; locked = false; finished = false; board = makeBoard();
      removeKey(SAVE_KEY); announce("새 도전", "1단계 새 보드를 만들었습니다. 아래쪽 매치와 4·5개 연결을 먼저 찾아보세요."); render(0); saveGame();
    }

    function restore() {
      if (validSaved(saved)) {
        stage = saved.stage; board = cloneBoard(saved.board); score = Math.max(0, Number(saved.score) || 0); movesLeft = Math.max(0, Number(saved.movesLeft) || 0); colorCleared = Math.max(0, Number(saved.colorCleared) || 0); comboBest = Math.max(0, Number(saved.comboBest) || 0);
        if (!hasMatch(board) && validMoves(board).length && movesLeft > 0) { announce("이어하기", `${stage}단계 저장된 판을 불러왔습니다. 이동 ${movesLeft}회 남았습니다.`); render(0); return; }
      }
      newRun();
    }

    function onKey(event) {
      if (!root.isConnected || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.target && /^(INPUT|SELECT|TEXTAREA)$/.test(event.target.tagName)) return;
      const key = event.key.toLowerCase(); if (key !== "h" && key !== "n") return;
      event.preventDefault(); event.stopImmediatePropagation(); if (key === "h") hint(); else newRun();
    }

    newButton.addEventListener("click", newRun);
    hintButton.addEventListener("click", hint);
    shuffleButton.addEventListener("click", function () { if (!locked && !finished) reshuffle("수동 재셔플했습니다. 이동 수는 줄지 않습니다."); });
    gameBoard.addEventListener("pointerdown", function (event) {
      const cell = event.target.closest(".match3-cell"); if (!cell) return;
      swipeStart = { x: event.clientX, y: event.clientY, index: Number(cell.dataset.index), id: event.pointerId };
      try { gameBoard.setPointerCapture(event.pointerId); } catch (error) { /* optional */ }
    });
    gameBoard.addEventListener("pointerup", function (event) {
      if (!swipeStart || locked || finished) return;
      const dx = event.clientX - swipeStart.x, dy = event.clientY - swipeStart.y, start = swipeStart.index; swipeStart = null;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
      const r = rowOf(start), c = colOf(start); let target = -1;
      if (Math.abs(dx) > Math.abs(dy)) target = dx > 0 && c < cols - 1 ? start + 1 : dx < 0 && c > 0 ? start - 1 : -1;
      else target = dy > 0 && r < rows - 1 ? start + cols : dy < 0 && r > 0 ? start - cols : -1;
      if (target >= 0) performSwap(start, target);
    });
    gameBoard.addEventListener("pointercancel", function () { swipeStart = null; });
    window.addEventListener("keydown", onKey, true);

    const externalRestart = document.querySelector("#restartGame");
    function onExternalRestart() { removeKey(SAVE_KEY); }
    if (externalRestart) externalRestart.addEventListener("click", onExternalRestart, true);

    const cleanupObserver = new MutationObserver(function () {
      if (root.isConnected) return;
      clearTimeout(hintTimer); window.removeEventListener("keydown", onKey, true);
      if (externalRestart) externalRestart.removeEventListener("click", onExternalRestart, true);
      surface.classList.remove("match3-runtime-game"); cleanupObserver.disconnect();
    });
    cleanupObserver.observe(document.documentElement, { childList: true, subtree: true });

    restore();
    return true;
  }

  function isTarget(surface) {
    if (surface.dataset.gameId === "match-three") return true;
    if (location.pathname.indexOf("/games/match-three/") >= 0) return true;
    return surface.id === "playSurface" && new URLSearchParams(location.search).get("game") === "match-three";
  }
  function scan() { document.querySelectorAll("#playSurface, .play-surface").forEach(function (surface) { if (isTarget(surface) && !surface.querySelector(".match3-runtime-root")) setup(surface); }); }
  function boot() { scan(); const observer = new MutationObserver(scan); observer.observe(document.documentElement, { childList: true, subtree: true }); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true }); else boot();
})();