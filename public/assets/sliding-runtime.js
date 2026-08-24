(function () {
  const PREFS_KEY = "hanpan-sliding-prefs-v2";
  const RECORDS_KEY = "hanpan-sliding-records-v2";
  const LEGACY_BEST_KEY = "hanpan-arcade-sliding-puzzle";
  let styleAdded = false;

  function readJson(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "null");
      return value && typeof value === "object" ? value : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (error) { /* Storage is optional. */ }
  }

  function saveKey(size) { return `hanpan-sliding-save-v2-${size}`; }

  function freshRecord() {
    return { attempts: 0, completions: 0, bestMoves: null, bestTime: null };
  }

  function loadRecords() {
    const raw = readJson(RECORDS_KEY, {});
    const records = {
      3: Object.assign(freshRecord(), raw[3] || raw["3"] || {}),
      4: Object.assign(freshRecord(), raw[4] || raw["4"] || {})
    };
    try {
      const legacy = Number(localStorage.getItem(LEGACY_BEST_KEY));
      if (Number.isFinite(legacy) && legacy > 0 && !records[3].bestMoves) records[3].bestMoves = legacy;
    } catch (error) { /* Ignore legacy read failures. */ }
    return records;
  }

  function solvedBoard(size) {
    return Array.from({ length: size * size }, function (_, index) {
      return index === size * size - 1 ? 0 : index + 1;
    });
  }

  function inversionCount(board) {
    const values = board.filter(Boolean);
    let inversions = 0;
    for (let i = 0; i < values.length; i += 1) {
      for (let j = i + 1; j < values.length; j += 1) if (values[i] > values[j]) inversions += 1;
    }
    return inversions;
  }

  function isSolvable(board, size) {
    const inversions = inversionCount(board);
    if (size % 2 === 1) return inversions % 2 === 0;
    const emptyIndex = board.indexOf(0);
    const rowFromBottom = size - Math.floor(emptyIndex / size);
    return (inversions + rowFromBottom) % 2 === 1;
  }

  function isValidBoard(board, size) {
    if (!Array.isArray(board) || board.length !== size * size) return false;
    const sorted = board.slice().sort(function (a, b) { return a - b; });
    if (!sorted.every(function (value, index) { return value === index; })) return false;
    return isSolvable(board, size);
  }

  function isSolved(board, size) {
    const goal = solvedBoard(size);
    return goal.every(function (value, index) { return board[index] === value; });
  }

  function legalTileIndexes(board, size) {
    const empty = board.indexOf(0);
    const row = Math.floor(empty / size);
    const col = empty % size;
    const items = [];
    if (row > 0) items.push(empty - size);
    if (row < size - 1) items.push(empty + size);
    if (col > 0) items.push(empty - 1);
    if (col < size - 1) items.push(empty + 1);
    return items;
  }

  function shuffledBoard(size) {
    const board = solvedBoard(size);
    let previousEmpty = -1;
    const steps = size === 3 ? 110 : 320;
    for (let step = 0; step < steps; step += 1) {
      const empty = board.indexOf(0);
      let choices = legalTileIndexes(board, size).filter(function (index) { return index !== previousEmpty; });
      if (!choices.length) choices = legalTileIndexes(board, size);
      const tileIndex = choices[Math.floor(Math.random() * choices.length)];
      board[empty] = board[tileIndex];
      board[tileIndex] = 0;
      previousEmpty = empty;
    }
    if (isSolved(board, size)) {
      const tileIndex = legalTileIndexes(board, size)[0];
      const empty = board.indexOf(0);
      board[empty] = board[tileIndex];
      board[tileIndex] = 0;
    }
    return board;
  }

  function formatTime(seconds) {
    seconds = Math.max(0, Math.floor(seconds || 0));
    const minutes = Math.floor(seconds / 60);
    const rest = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
  }

  function manhattan(board, size) {
    return board.reduce(function (total, value, index) {
      if (!value) return total;
      const goal = value - 1;
      return total + Math.abs(Math.floor(index / size) - Math.floor(goal / size)) + Math.abs(index % size - goal % size);
    }, 0);
  }

  function addStyle() {
    if (styleAdded) return;
    styleAdded = true;
    const style = document.createElement("style");
    style.textContent = `
      .sliding-runtime-game{--sliding-accent:#2877b9}
      .sliding-runtime-root{display:grid;gap:14px;max-width:760px;margin:0 auto}
      .sliding-settings,.sliding-actions,.sliding-records{display:flex;gap:10px;flex-wrap:wrap;align-items:center;justify-content:center}
      .sliding-settings label{display:grid;gap:5px;font-weight:700;min-width:150px}
      .sliding-settings select{min-height:42px;border:1px solid rgba(29,36,51,.22);border-radius:10px;padding:0 12px;background:#fffdf7;font:inherit}
      .sliding-status{display:grid;gap:2px;text-align:center;padding:10px 12px;border-radius:12px;background:rgba(40,119,185,.08)}
      .sliding-status strong{font-size:1rem}.sliding-status span{font-size:.9rem;opacity:.78}
      .sliding-board{--sliding-size:3;display:grid;grid-template-columns:repeat(var(--sliding-size),1fr);gap:7px;width:min(100%,430px);aspect-ratio:1;margin:0 auto;padding:8px;border:2px solid rgba(29,36,51,.2);border-radius:16px;background:#e9e1d0;touch-action:none;user-select:none}
      .sliding-tile{min-width:0;min-height:0;border:1px solid rgba(29,36,51,.38);border-radius:12px;background:#fffaf0;color:#1d2433;font:800 clamp(1.15rem,5vw,2rem)/1 system-ui,sans-serif;box-shadow:0 3px 0 rgba(29,36,51,.16);cursor:pointer}
      .sliding-tile:hover:not(:disabled){transform:translateY(-1px)}
      .sliding-tile:focus-visible{outline:3px solid #2877b9;outline-offset:2px}
      .sliding-tile.is-empty{visibility:hidden;pointer-events:none}
      .sliding-tile.is-correct{background:#eef8ec;border-color:#6ca76a}
      .sliding-tile.is-hint{animation:slidingHint .75s ease-in-out 2;outline:4px solid #ffcf5d;outline-offset:-4px}
      .sliding-board.is-complete .sliding-tile:not(.is-empty){background:#e9f7e8;border-color:#4c965a}
      .sliding-records{font-size:.88rem}.sliding-records span,.sliding-records strong{padding:6px 9px;border-radius:999px;background:rgba(29,36,51,.06)}
      .sliding-note{text-align:center;margin:0}
      @keyframes slidingHint{50%{transform:scale(1.06)}}
      @media(max-width:760px){.sliding-runtime-root{gap:11px}.sliding-board{width:min(100%,360px);gap:5px;padding:6px}.sliding-actions{position:sticky;bottom:8px;z-index:6;padding:8px;border-radius:14px;background:rgba(255,253,247,.94);box-shadow:0 8px 24px rgba(29,36,51,.14)}.sliding-actions .button{min-height:44px;flex:1 1 115px}.sliding-settings{align-items:stretch}.sliding-settings label{flex:1 1 130px}}
      @media(prefers-reduced-motion:reduce){.sliding-tile{transition:none}.sliding-tile.is-hint{animation:none}}
    `;
    document.head.appendChild(style);
  }

  function setup(surface) {
    if (surface.querySelector(".sliding-runtime-root")) return false;
    addStyle();
    surface.classList.add("sliding-runtime-game");
    surface.innerHTML = "";

    const prefs = readJson(PREFS_KEY, { size: 3 });
    let size = Number(prefs.size) === 4 ? 4 : 3;
    let records = loadRecords();
    let board = [];
    let moves = 0;
    let hintsUsed = 0;
    let started = false;
    let attemptCounted = false;
    let finished = false;
    let elapsedBase = 0;
    let runStartedAt = 0;
    let hintTimer = null;
    let swipeStart = null;

    const root = document.createElement("div");
    root.className = "sliding-runtime-root";

    const stats = document.createElement("div");
    stats.className = "mini-score";
    const statLabels = ["이동", "시간", "제자리", "힌트", "최고"];
    const statValues = statLabels.map(function (label) {
      const box = document.createElement("span");
      const value = document.createElement("b"); value.textContent = "-";
      const small = document.createElement("small"); small.textContent = label;
      box.append(value, small); stats.appendChild(box); return value;
    });

    const settings = document.createElement("div");
    settings.className = "sliding-settings";
    const sizeLabel = document.createElement("label");
    sizeLabel.innerHTML = "<span>보드 크기</span>";
    const sizeSelect = document.createElement("select");
    sizeSelect.setAttribute("aria-label", "슬라이딩 퍼즐 보드 크기");
    [[3, "3×3 · 8퍼즐"], [4, "4×4 · 15퍼즐"]].forEach(function (entry) {
      const option = document.createElement("option"); option.value = String(entry[0]); option.textContent = entry[1]; sizeSelect.appendChild(option);
    });
    sizeLabel.appendChild(sizeSelect); settings.appendChild(sizeLabel);

    const status = document.createElement("div");
    status.className = "sliding-status";
    status.setAttribute("aria-live", "polite");
    const statusTitle = document.createElement("strong");
    const statusText = document.createElement("span");
    status.append(statusTitle, statusText);

    const gameBoard = document.createElement("div");
    gameBoard.className = "sliding-board";
    gameBoard.tabIndex = 0;
    gameBoard.setAttribute("role", "grid");
    gameBoard.setAttribute("aria-label", "슬라이딩 퍼즐 게임판. 방향키는 빈칸을 해당 방향으로 이동합니다.");

    const actions = document.createElement("div");
    actions.className = "sliding-actions mini-controls";
    const newButton = document.createElement("button"); newButton.type = "button"; newButton.className = "button primary"; newButton.textContent = "새 퍼즐";
    const hintButton = document.createElement("button"); hintButton.type = "button"; hintButton.className = "button secondary"; hintButton.textContent = "거리 힌트";
    actions.append(newButton, hintButton);

    const recordsBox = document.createElement("div");
    recordsBox.className = "sliding-records";

    const note = document.createElement("p");
    note.className = "mini-note sliding-note";
    note.textContent = "타일 탭 · 방향키/WASD는 빈칸 이동 · 모바일 스와이프 · H 힌트 · N 새 퍼즐. 진행 중 판은 자동 저장됩니다.";

    root.append(stats, settings, status, gameBoard, actions, recordsBox, note);
    surface.appendChild(root);

    function announce(title, text) {
      statusTitle.textContent = title;
      statusText.textContent = text;
      const result = document.querySelector("#playResult");
      if (result) result.textContent = `${title}. ${text}`;
    }

    function currentElapsedMs() {
      return elapsedBase + (runStartedAt ? Date.now() - runStartedAt : 0);
    }

    function currentSeconds() { return Math.floor(currentElapsedMs() / 1000); }

    function record() { return records[size] || records[String(size)]; }

    function saveRecords() { writeJson(RECORDS_KEY, records); }

    function correctCount() {
      return board.reduce(function (total, value, index) {
        if (index === board.length - 1) return total;
        return total + (value === index + 1 ? 1 : 0);
      }, 0);
    }

    function saveState() {
      if (finished) return;
      writeJson(saveKey(size), {
        version: 2,
        size: size,
        board: board,
        moves: moves,
        hintsUsed: hintsUsed,
        started: started,
        attemptCounted: attemptCounted,
        elapsedMs: currentElapsedMs()
      });
    }

    function clearState(targetSize) {
      try { localStorage.removeItem(saveKey(targetSize || size)); } catch (error) { /* Ignore. */ }
    }

    function updateRecords() {
      const current = record();
      const rate = current.attempts ? Math.round(current.completions / current.attempts * 100) : 0;
      recordsBox.innerHTML = `<strong>${size}×${size}</strong><span>완주 ${current.completions}/${current.attempts}</span><span>완주율 ${rate}%</span><span>최소 이동 ${current.bestMoves || "-"}</span><span>최단 ${current.bestTime === null ? "-" : formatTime(current.bestTime)}</span>`;
    }

    function updateHud() {
      const current = record();
      statValues[0].textContent = String(moves);
      statValues[1].textContent = formatTime(currentSeconds());
      statValues[2].textContent = `${correctCount()}/${size * size - 1}`;
      statValues[3].textContent = String(hintsUsed);
      statValues[4].textContent = current.bestMoves ? `${current.bestMoves}수` : "-";
      sizeSelect.value = String(size);
      gameBoard.style.setProperty("--sliding-size", String(size));
      gameBoard.classList.toggle("is-complete", finished);
      updateRecords();
    }

    function adjacent(index, empty) {
      const row = Math.floor(index / size), col = index % size;
      const erow = Math.floor(empty / size), ecol = empty % size;
      return Math.abs(row - erow) + Math.abs(col - ecol) === 1;
    }

    function draw() {
      gameBoard.innerHTML = "";
      board.forEach(function (value, index) {
        const tile = document.createElement("button");
        tile.type = "button";
        tile.className = "sliding-tile";
        tile.dataset.index = String(index);
        tile.dataset.value = String(value);
        tile.setAttribute("role", "gridcell");
        if (!value) {
          tile.classList.add("is-empty");
          tile.tabIndex = -1;
          tile.setAttribute("aria-label", "빈칸");
        } else {
          tile.textContent = String(value);
          tile.classList.toggle("is-correct", value === index + 1);
          tile.disabled = finished || !adjacent(index, board.indexOf(0));
          tile.setAttribute("aria-label", `${value}번 타일${tile.disabled ? "" : ", 빈칸으로 이동 가능"}`);
          tile.addEventListener("click", function () { moveTile(index); });
        }
        gameBoard.appendChild(tile);
      });
      updateHud();
    }

    function beginIfNeeded() {
      if (!started) {
        started = true;
        runStartedAt = Date.now();
      } else if (!runStartedAt && !finished && !document.hidden) {
        runStartedAt = Date.now();
      }
      if (!attemptCounted) {
        attemptCounted = true;
        record().attempts += 1;
        saveRecords();
      }
    }

    function completeIfSolved() {
      if (!isSolved(board, size)) return false;
      if (runStartedAt) { elapsedBase += Date.now() - runStartedAt; runStartedAt = 0; }
      finished = true;
      const seconds = Math.floor(elapsedBase / 1000);
      const current = record();
      current.completions += 1;
      let newRecord = false;
      if (hintsUsed === 0) {
        if (current.bestMoves === null || moves < current.bestMoves) { current.bestMoves = moves; newRecord = true; }
        if (current.bestTime === null || seconds < current.bestTime) { current.bestTime = seconds; newRecord = true; }
      }
      saveRecords();
      clearState(size);
      announce("퍼즐 완성", `${moves}수 · ${formatTime(seconds)}${hintsUsed ? ` · 힌트 ${hintsUsed}회` : newRecord ? " · 새 기록" : ""}입니다.`);
      draw();
      return true;
    }

    function moveTile(index) {
      if (finished) return false;
      const empty = board.indexOf(0);
      if (!adjacent(index, empty)) return false;
      beginIfNeeded();
      board[empty] = board[index];
      board[index] = 0;
      moves += 1;
      if (!completeIfSolved()) {
        announce("이동 완료", `${moves}수째입니다. 맞춘 타일 ${correctCount()}/${size * size - 1}.`);
        draw();
        saveState();
      }
      return true;
    }

    function moveBlank(direction) {
      if (finished) return;
      const empty = board.indexOf(0);
      const row = Math.floor(empty / size), col = empty % size;
      let tileIndex = -1;
      if (direction === "up" && row > 0) tileIndex = empty - size;
      if (direction === "down" && row < size - 1) tileIndex = empty + size;
      if (direction === "left" && col > 0) tileIndex = empty - 1;
      if (direction === "right" && col < size - 1) tileIndex = empty + 1;
      if (tileIndex >= 0) moveTile(tileIndex);
    }

    function hint() {
      if (finished) return;
      clearTimeout(hintTimer);
      const legal = legalTileIndexes(board, size);
      let best = null;
      legal.forEach(function (index) {
        const copy = board.slice();
        const empty = copy.indexOf(0);
        copy[empty] = copy[index]; copy[index] = 0;
        const distance = manhattan(copy, size);
        if (!best || distance < best.distance || (distance === best.distance && Math.random() < 0.5)) best = { index: index, value: board[index], distance: distance };
      });
      if (!best) return;
      hintsUsed += 1;
      announce("거리 힌트", `${best.value}번 타일을 빈칸으로 옮기면 현재 맨해튼 거리가 ${best.distance}이 됩니다. 최적해를 보장하는 힌트는 아닙니다.`);
      draw();
      const tile = gameBoard.querySelector(`[data-value="${best.value}"]`);
      if (tile) {
        tile.classList.add("is-hint");
        hintTimer = setTimeout(function () { if (tile.isConnected) tile.classList.remove("is-hint"); }, 1600);
      }
      saveState();
    }

    function newPuzzle(message) {
      clearTimeout(hintTimer);
      clearState(size);
      board = shuffledBoard(size);
      moves = 0;
      hintsUsed = 0;
      started = false;
      attemptCounted = false;
      finished = false;
      elapsedBase = 0;
      runStartedAt = 0;
      announce("새 퍼즐", message || `${size}×${size} 풀 수 있는 배열을 새로 섞었습니다.`);
      draw();
      saveState();
    }

    function restoreOrNew(targetSize) {
      size = targetSize;
      const saved = readJson(saveKey(size), null);
      if (saved && Number(saved.size) === size && isValidBoard(saved.board, size) && !isSolved(saved.board, size)) {
        board = saved.board.slice();
        moves = Math.max(0, Number(saved.moves) || 0);
        hintsUsed = Math.max(0, Number(saved.hintsUsed) || 0);
        started = Boolean(saved.started);
        attemptCounted = Boolean(saved.attemptCounted);
        finished = false;
        elapsedBase = Math.max(0, Number(saved.elapsedMs) || 0);
        runStartedAt = started && !document.hidden ? Date.now() : 0;
        announce("이어하기", `${size}×${size} 저장된 퍼즐을 불러왔습니다. ${moves}수째부터 이어갑니다.`);
        draw();
        return;
      }
      board = shuffledBoard(size);
      moves = 0; hintsUsed = 0; started = false; attemptCounted = false; finished = false; elapsedBase = 0; runStartedAt = 0;
      announce("플레이 준비", `${size}×${size} 풀 수 있는 배열입니다. 첫 타일을 움직이면 시간이 시작됩니다.`);
      draw();
      saveState();
    }

    function onKey(event) {
      if (!root.isConnected || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.target && /^(SELECT|INPUT|TEXTAREA)$/.test(event.target.tagName)) return;
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      const map = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right", w: "up", s: "down", a: "left", d: "right" };
      if (!(key in map) && key !== "h" && key !== "n") return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (key === "h") hint();
      else if (key === "n") newPuzzle("키보드로 새 퍼즐을 만들었습니다.");
      else moveBlank(map[key]);
    }

    function onVisibility() {
      if (document.hidden && runStartedAt) {
        elapsedBase += Date.now() - runStartedAt;
        runStartedAt = 0;
        saveState();
        announce("자동 일시정지", "다른 탭에 있는 동안 기록 시간이 늘어나지 않습니다.");
      } else if (!document.hidden && started && !finished && !runStartedAt) {
        runStartedAt = Date.now();
        announce("이어하기", "퍼즐 시간이 다시 흐릅니다.");
      }
      updateHud();
    }

    sizeSelect.addEventListener("change", function () {
      if (runStartedAt) { elapsedBase += Date.now() - runStartedAt; runStartedAt = 0; saveState(); }
      size = Number(sizeSelect.value) === 4 ? 4 : 3;
      writeJson(PREFS_KEY, { size: size });
      restoreOrNew(size);
    });
    newButton.addEventListener("click", function () { newPuzzle(); });
    hintButton.addEventListener("click", hint);
    gameBoard.addEventListener("pointerdown", function (event) {
      swipeStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
      try { gameBoard.setPointerCapture(event.pointerId); } catch (error) { /* optional */ }
      gameBoard.focus({ preventScroll: true });
    });
    gameBoard.addEventListener("pointerup", function (event) {
      if (!swipeStart) return;
      const dx = event.clientX - swipeStart.x, dy = event.clientY - swipeStart.y;
      swipeStart = null;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
      moveBlank(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up"));
    });
    gameBoard.addEventListener("pointercancel", function () { swipeStart = null; });
    window.addEventListener("keydown", onKey, true);
    document.addEventListener("visibilitychange", onVisibility);

    const externalRestart = document.querySelector("#restartGame");
    function onExternalRestart() { if (root.isConnected) clearState(size); }
    if (externalRestart) externalRestart.addEventListener("click", onExternalRestart, true);

    const ticker = setInterval(function () {
      if (!root.isConnected) return;
      updateHud();
      if (started && !finished) saveState();
    }, 1000);

    const cleanupObserver = new MutationObserver(function () {
      if (root.isConnected) return;
      clearInterval(ticker);
      clearTimeout(hintTimer);
      window.removeEventListener("keydown", onKey, true);
      document.removeEventListener("visibilitychange", onVisibility);
      if (externalRestart) externalRestart.removeEventListener("click", onExternalRestart, true);
      surface.classList.remove("sliding-runtime-game");
      cleanupObserver.disconnect();
    });
    cleanupObserver.observe(document.documentElement, { childList: true, subtree: true });

    restoreOrNew(size);
    return true;
  }

  function isTarget(surface) {
    if (surface.dataset.gameId === "sliding-puzzle") return true;
    if (location.pathname.indexOf("/games/sliding-puzzle/") >= 0) return true;
    return surface.id === "playSurface" && new URLSearchParams(location.search).get("game") === "sliding-puzzle";
  }

  function scan() {
    document.querySelectorAll("#playSurface, .play-surface").forEach(function (surface) {
      if (isTarget(surface) && !surface.querySelector(".sliding-runtime-root")) setup(surface);
    });
  }

  function boot() {
    scan();
    const observer = new MutationObserver(scan);
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();