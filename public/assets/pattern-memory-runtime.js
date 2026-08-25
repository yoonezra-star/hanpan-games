(function () {
  const SAVE_KEY = "hanpan-pattern-memory-save-v2";
  const RECORD_KEY = "hanpan-pattern-memory-records-v2";
  const PREF_KEY = "hanpan-pattern-memory-prefs-v2";
  const LEGACY_KEY = "hanpan-arcade-pattern-memory";
  const configs = {
    easy: { label: "쉬움", size: 4, lives: 3, baseTargets: 4, show: 2700, floor: 1450, step: 90, score: 1 },
    normal: { label: "보통", size: 5, lives: 2, baseTargets: 5, show: 2250, floor: 950, step: 95, score: 2 },
    hard: { label: "어려움", size: 6, lives: 1, baseTargets: 6, show: 1850, floor: 650, step: 85, score: 3 }
  };
  let styleAdded = false;
  let audioContext = null;

  function readJson(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "null");
      return value && typeof value === "object" ? value : fallback;
    } catch (error) { return fallback; }
  }
  function writeJson(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (error) { /* optional */ } }
  function removeKey(key) { try { localStorage.removeItem(key); } catch (error) { /* optional */ } }
  function freshRecord() { return { runs: 0, bestRound: 0, bestScore: 0, bestAccuracy: 0, bestStreak: 0 }; }
  function loadRecords() {
    const raw = readJson(RECORD_KEY, {});
    const records = {
      easy: Object.assign(freshRecord(), raw.easy || {}),
      normal: Object.assign(freshRecord(), raw.normal || {}),
      hard: Object.assign(freshRecord(), raw.hard || {})
    };
    try {
      const legacy = Number(localStorage.getItem(LEGACY_KEY));
      if (Number.isFinite(legacy) && legacy > records.normal.bestRound) records.normal.bestRound = legacy;
    } catch (error) { /* optional */ }
    return records;
  }
  function clampDifficulty(value) { return configs[value] ? value : "normal"; }
  function accuracy(correct, total) { return total ? Math.round(correct / total * 100) : 100; }
  function shuffledIndexes(total) {
    const values = Array.from({ length: total }, function (_, index) { return index; });
    for (let i = values.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = values[i]; values[i] = values[j]; values[j] = temp;
    }
    return values;
  }

  function addStyle() {
    if (styleAdded) return;
    styleAdded = true;
    const style = document.createElement("style");
    style.textContent = `
      .pattern-memory-runtime-game{--pm-gap:7px}
      .pattern-memory-runtime-root{display:grid;gap:13px;max-width:760px;margin:0 auto}
      .pattern-memory-settings,.pattern-memory-actions,.pattern-memory-records{display:flex;gap:9px;flex-wrap:wrap;align-items:center;justify-content:center}
      .pattern-memory-settings label{display:grid;gap:5px;min-width:160px;font-weight:700}
      .pattern-memory-settings select{min-height:42px;border:1px solid rgba(29,36,51,.22);border-radius:10px;padding:0 12px;background:#fffdf7;font:inherit}
      .pattern-memory-status{display:grid;gap:3px;text-align:center;padding:10px 12px;border-radius:12px;background:rgba(86,123,190,.08)}
      .pattern-memory-status strong{font-size:1rem}.pattern-memory-status span{font-size:.9rem;opacity:.82}
      .pattern-memory-board{display:grid;gap:var(--pm-gap);width:min(100%,500px);aspect-ratio:1;margin:0 auto;padding:8px;border:2px solid rgba(29,36,51,.16);border-radius:17px;background:#eae4d8;touch-action:manipulation;user-select:none}
      .pattern-memory-cell{min-width:0;min-height:0;border:1px solid rgba(29,36,51,.2);border-radius:11px;background:#fffaf0;cursor:pointer;transition:transform .1s ease,background .12s ease,box-shadow .12s ease}
      .pattern-memory-cell.is-target{background:#5f8ed8;box-shadow:inset 0 0 0 3px rgba(255,255,255,.55)}
      .pattern-memory-cell.is-selected{background:#f1c65a;box-shadow:inset 0 0 0 3px rgba(255,255,255,.6)}
      .pattern-memory-cell.is-hit{background:#59ae78}.pattern-memory-cell.is-missed{background:#6f91d7}.pattern-memory-cell.is-wrong{background:#df6a61}
      .pattern-memory-cell:focus-visible{outline:4px solid #1d2433;outline-offset:2px}.pattern-memory-cell:active:not(:disabled){transform:scale(.94)}
      .pattern-memory-progress{height:8px;border-radius:999px;background:rgba(29,36,51,.1);overflow:hidden;width:min(100%,500px);margin:0 auto}.pattern-memory-progress span{display:block;height:100%;width:0;background:#4a6fb9;transition:width .12s ease}
      .pattern-memory-records{font-size:.88rem}.pattern-memory-records span,.pattern-memory-records strong{padding:6px 9px;border-radius:999px;background:rgba(29,36,51,.06)}
      .pattern-memory-note{text-align:center;margin:0}
      @media(max-width:760px){.pattern-memory-runtime-root{gap:10px}.pattern-memory-board{width:min(100%,390px);gap:5px;padding:6px}.pattern-memory-actions{position:sticky;bottom:8px;z-index:6;padding:8px;border-radius:14px;background:rgba(255,253,247,.95);box-shadow:0 8px 24px rgba(29,36,51,.14)}.pattern-memory-actions .button{min-height:44px;flex:1 1 110px}.pattern-memory-settings label{flex:1 1 150px}}
      @media(prefers-reduced-motion:reduce){.pattern-memory-cell,.pattern-memory-progress span{transition:none}}
    `;
    document.head.appendChild(style);
  }

  function setup(surface) {
    if (surface.querySelector(".pattern-memory-runtime-root")) return false;
    addStyle();
    surface.classList.add("pattern-memory-runtime-game");
    surface.innerHTML = "";

    const prefs = readJson(PREF_KEY, { difficulty: "normal", muted: false });
    let difficulty = clampDifficulty(prefs.difficulty);
    let muted = Boolean(prefs.muted);
    let records = loadRecords();
    let round = 0;
    let target = [];
    let selected = new Set();
    let lives = configs[difficulty].lives;
    let score = 0;
    let correctSelections = 0;
    let totalSelections = 0;
    let perfectStreak = 0;
    let runBestStreak = 0;
    let replays = 0;
    let started = false;
    let runCounted = false;
    let phase = "ready";
    let reviewHits = new Set();
    let reviewMissed = new Set();
    let reviewWrong = new Set();
    let timers = [];
    let generation = 0;
    let focusIndex = 0;

    const root = document.createElement("div"); root.className = "pattern-memory-runtime-root";
    const hud = document.createElement("div"); hud.className = "mini-score";
    const hudLabels = ["라운드", "목숨", "선택", "정확도", "최고"];
    const hudValues = hudLabels.map(function (label) {
      const span = document.createElement("span"); const value = document.createElement("b"); value.textContent = "-"; const small = document.createElement("small"); small.textContent = label; span.append(value, small); hud.appendChild(span); return value;
    });
    const settings = document.createElement("div"); settings.className = "pattern-memory-settings";
    const difficultyLabel = document.createElement("label"); difficultyLabel.innerHTML = "<span>난이도</span>";
    const difficultySelect = document.createElement("select"); difficultySelect.innerHTML = '<option value="easy">쉬움 · 4×4 · 목숨 3</option><option value="normal">보통 · 5×5 · 목숨 2</option><option value="hard">어려움 · 6×6 · 목숨 1</option>'; difficultyLabel.appendChild(difficultySelect); settings.appendChild(difficultyLabel);
    const status = document.createElement("div"); status.className = "pattern-memory-status"; status.setAttribute("aria-live", "polite");
    const board = document.createElement("div"); board.className = "pattern-memory-board"; board.setAttribute("role", "grid");
    const progress = document.createElement("div"); progress.className = "pattern-memory-progress"; progress.setAttribute("aria-hidden", "true"); const progressBar = document.createElement("span"); progress.appendChild(progressBar);
    const actions = document.createElement("div"); actions.className = "mini-controls pattern-memory-actions";
    const startButton = document.createElement("button"); startButton.type = "button"; startButton.className = "button primary"; startButton.textContent = "시작";
    const submitButton = document.createElement("button"); submitButton.type = "button"; submitButton.className = "button primary"; submitButton.textContent = "선택 확인";
    const replayButton = document.createElement("button"); replayButton.type = "button"; replayButton.className = "button secondary"; replayButton.textContent = "패턴 다시 보기";
    const muteButton = document.createElement("button"); muteButton.type = "button"; muteButton.className = "button secondary";
    actions.append(startButton, submitButton, replayButton, muteButton);
    const recordBox = document.createElement("div"); recordBox.className = "pattern-memory-records";
    const note = document.createElement("p"); note.className = "mini-note pattern-memory-note"; note.textContent = "방향키로 칸 이동 · Enter/Space 선택 · H 패턴 다시 보기 · N 새 도전";
    root.append(hud, settings, status, board, progress, actions, recordBox, note); surface.appendChild(root);

    function cfg() { return configs[difficulty]; }
    function currentRecord() { return records[difficulty]; }
    function targetCount() { return Math.min(cfg().size * cfg().size - 4, cfg().baseTargets + Math.floor(Math.max(0, round - 1) / 2)); }
    function displayDuration() { return Math.max(cfg().floor, cfg().show - Math.max(0, round - 1) * cfg().step); }
    function saveRecords() { writeJson(RECORD_KEY, records); }
    function announce(title, text) { status.innerHTML = `<strong>${title}</strong><span>${text}</span>`; const out = document.querySelector("#playResult"); if (out) out.textContent = `${title} · ${text}`; }
    function tone(freq, duration) {
      if (muted) return;
      try {
        audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
        if (audioContext.state === "suspended") audioContext.resume();
        const oscillator = audioContext.createOscillator(); const gain = audioContext.createGain();
        oscillator.type = "sine"; oscillator.frequency.value = freq; gain.gain.value = 0.035; oscillator.connect(gain); gain.connect(audioContext.destination); oscillator.start(); gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + Math.max(.06, duration || .13)); oscillator.stop(audioContext.currentTime + Math.max(.07, duration || .14));
      } catch (error) { /* optional */ }
    }
    function clearTimers() { generation += 1; timers.forEach(clearTimeout); timers = []; }
    function schedule(fn, delay, token) { const id = setTimeout(function () { if (token === generation && root.isConnected) fn(); }, delay); timers.push(id); }
    function validTarget(value, size) {
      if (!Array.isArray(value) || !value.length) return false;
      const unique = new Set(value);
      return unique.size === value.length && value.every(function (item) { return Number.isInteger(item) && item >= 0 && item < size * size; });
    }
    function saveGame() {
      if (!started || phase === "gameover") { if (phase === "gameover") removeKey(SAVE_KEY); return; }
      writeJson(SAVE_KEY, { version: 2, difficulty: difficulty, round: round, target: target, lives: lives, score: score, correctSelections: correctSelections, totalSelections: totalSelections, perfectStreak: perfectStreak, runBestStreak: runBestStreak, replays: replays, started: started, runCounted: runCounted });
    }
    function validSave(value) {
      if (!value || value.version !== 2 || !configs[value.difficulty]) return false;
      const size = configs[value.difficulty].size;
      return Number.isInteger(value.round) && value.round >= 1 && value.round <= 300 && validTarget(value.target, size) && Number(value.lives) > 0;
    }
    function updateRecordsBox() {
      const record = currentRecord();
      recordBox.innerHTML = `<strong>${cfg().label}</strong><span>도전 ${record.runs}</span><span>최고 라운드 ${record.bestRound}</span><span>최고 점수 ${record.bestScore}</span><span>최고 정확도 ${record.bestAccuracy}%</span><span>완벽 연속 ${record.bestStreak}</span>`;
    }
    function updateHud() {
      const needed = target.length || (round ? targetCount() : 0);
      hudValues[0].textContent = String(round || 0);
      hudValues[1].textContent = "♥".repeat(Math.max(0, lives)) || "0";
      hudValues[2].textContent = needed ? `${selected.size}/${needed}` : "0/0";
      hudValues[3].textContent = `${accuracy(correctSelections, totalSelections)}%`;
      hudValues[4].textContent = String(currentRecord().bestRound || "-");
      progressBar.style.width = needed ? `${Math.min(100, selected.size / needed * 100)}%` : "0%";
      difficultySelect.value = difficulty;
      muteButton.textContent = muted ? "소리 켜기" : "소리 끄기";
      submitButton.disabled = phase !== "input" || selected.size !== needed;
      replayButton.disabled = !started || phase === "showing" || phase === "review" || phase === "gameover";
      startButton.textContent = started && phase !== "gameover" ? "새 도전" : "시작";
      updateRecordsBox();
    }
    function renderBoard() {
      const size = cfg().size;
      board.style.gridTemplateColumns = `repeat(${size},1fr)`;
      board.setAttribute("aria-label", `${size} 곱하기 ${size} 패턴 기억 보드`);
      board.innerHTML = "";
      for (let index = 0; index < size * size; index += 1) {
        const cell = document.createElement("button"); cell.type = "button"; cell.className = "pattern-memory-cell"; cell.dataset.index = String(index); cell.setAttribute("role", "gridcell"); cell.setAttribute("aria-label", `${Math.floor(index / size) + 1}행 ${index % size + 1}열`);
        if (phase === "showing" && target.includes(index)) cell.classList.add("is-target");
        if ((phase === "input" || phase === "paused-input") && selected.has(index)) cell.classList.add("is-selected");
        if (phase === "review") {
          if (reviewHits.has(index)) cell.classList.add("is-hit");
          else if (reviewMissed.has(index)) cell.classList.add("is-missed");
          else if (reviewWrong.has(index)) cell.classList.add("is-wrong");
        }
        cell.disabled = phase !== "input";
        cell.tabIndex = index === focusIndex ? 0 : -1;
        cell.addEventListener("click", function () { toggleCell(index); });
        board.appendChild(cell);
      }
      updateHud();
    }
    function generateTarget() { target = shuffledIndexes(cfg().size * cfg().size).slice(0, targetCount()).sort(function (a, b) { return a - b; }); }
    function showPattern(message) {
      if (!started || !target.length) return;
      clearTimers(); phase = "showing"; selected.clear(); reviewHits.clear(); reviewMissed.clear(); reviewWrong.clear(); renderBoard();
      const duration = displayDuration();
      announce("패턴 보기", message || `${target.length}개 칸을 ${Math.max(.6, duration / 1000).toFixed(1)}초 동안 기억하세요.`); tone(520, .11);
      const token = generation; schedule(function () { phase = "input"; selected.clear(); announce("복원 시작", `${target.length}개 칸을 선택한 뒤 선택 확인을 누르세요.`); renderBoard(); saveGame(); focusCurrent(); }, duration, token);
    }
    function nextRound() {
      round += 1; generateTarget(); saveGame(); showPattern();
    }
    function beginRun() {
      clearTimers(); round = 1; lives = cfg().lives; score = 0; correctSelections = 0; totalSelections = 0; perfectStreak = 0; runBestStreak = 0; replays = 0; selected.clear(); started = true; phase = "ready"; focusIndex = 0;
      const record = currentRecord(); record.runs += 1; runCounted = true; saveRecords(); generateTarget(); saveGame(); showPattern(`${cfg().label} 모드를 시작합니다. 첫 패턴 ${target.length}개를 기억하세요.`);
    }
    function toggleCell(index) {
      if (phase !== "input") return;
      focusIndex = index;
      if (selected.has(index)) { selected.delete(index); tone(260, .06); }
      else if (selected.size < target.length) { selected.add(index); tone(420, .06); }
      else { announce("선택 한도", `${target.length}개만 선택할 수 있습니다. 기존 선택을 해제한 뒤 바꾸세요.`); }
      renderBoard(); focusCurrent();
    }
    function evaluate() {
      if (phase !== "input" || selected.size !== target.length) return;
      phase = "review"; reviewHits = new Set(); reviewMissed = new Set(); reviewWrong = new Set();
      const targetSet = new Set(target);
      selected.forEach(function (index) { if (targetSet.has(index)) reviewHits.add(index); else reviewWrong.add(index); });
      target.forEach(function (index) { if (!selected.has(index)) reviewMissed.add(index); });
      const hits = reviewHits.size; correctSelections += hits; totalSelections += selected.size;
      const perfect = hits === target.length;
      const record = currentRecord();
      if (perfect) {
        perfectStreak += 1; runBestStreak = Math.max(runBestStreak, perfectStreak); score += (100 + round * 25 + target.length * 8) * cfg().score;
        record.bestRound = Math.max(record.bestRound, round); record.bestScore = Math.max(record.bestScore, score); record.bestAccuracy = Math.max(record.bestAccuracy, accuracy(correctSelections, totalSelections)); record.bestStreak = Math.max(record.bestStreak, runBestStreak); saveRecords();
        announce("완벽 복원", `${target.length}개를 모두 맞혔습니다. 다음 라운드로 넘어갑니다.`); tone(760, .16); renderBoard(); saveGame();
        const token = generation; schedule(nextRound, 1100, token);
      } else {
        lives -= 1; perfectStreak = 0; score = Math.max(0, score - (target.length - hits) * 20 * cfg().score); record.bestScore = Math.max(record.bestScore, score); record.bestAccuracy = Math.max(record.bestAccuracy, accuracy(correctSelections, totalSelections)); saveRecords();
        announce("오답 복기", `정답 ${hits}/${target.length}. 초록=정답 선택, 파랑=빠뜨린 칸, 빨강=잘못 누른 칸입니다.`); tone(175, .22); renderBoard(); saveGame();
        const token = generation;
        if (lives <= 0) schedule(endRun, 2500, token); else schedule(function () { showPattern(`목숨 ${lives}개 남았습니다. 같은 ${round}라운드 패턴을 다시 확인하세요.`); }, 2500, token);
      }
    }
    function endRun() {
      clearTimers(); phase = "gameover"; started = false; selected.clear(); removeKey(SAVE_KEY);
      const record = currentRecord(); record.bestRound = Math.max(record.bestRound, Math.max(0, round - 1)); record.bestScore = Math.max(record.bestScore, score); record.bestAccuracy = Math.max(record.bestAccuracy, accuracy(correctSelections, totalSelections)); record.bestStreak = Math.max(record.bestStreak, runBestStreak); saveRecords();
      announce("도전 종료", `${cfg().label} ${round}라운드에서 종료했습니다. 점수 ${score}, 정확도 ${accuracy(correctSelections, totalSelections)}%입니다.`); renderBoard();
    }
    function replay() {
      if (!started || (phase !== "input" && phase !== "paused-input" && phase !== "ready")) return;
      replays += 1; score = Math.max(0, score - 20 * cfg().score); perfectStreak = 0; selected.clear(); saveGame(); showPattern("패턴을 다시 보여줍니다. 점수가 일부 차감되고 완벽 연속 기록은 끊깁니다.");
    }
    function restore() {
      const saved = readJson(SAVE_KEY, null);
      if (!validSave(saved)) { announce("준비", "난이도를 고르고 시작하세요. 패턴은 라운드가 오를수록 길어지고 더 빨리 사라집니다."); renderBoard(); return; }
      difficulty = clampDifficulty(saved.difficulty); round = saved.round; target = saved.target.slice(); lives = Math.max(1, Math.min(cfg().lives, Number(saved.lives) || 1)); score = Math.max(0, Number(saved.score) || 0); correctSelections = Math.max(0, Number(saved.correctSelections) || 0); totalSelections = Math.max(correctSelections, Number(saved.totalSelections) || 0); perfectStreak = Math.max(0, Number(saved.perfectStreak) || 0); runBestStreak = Math.max(perfectStreak, Number(saved.runBestStreak) || 0); replays = Math.max(0, Number(saved.replays) || 0); started = true; runCounted = Boolean(saved.runCounted); phase = "ready"; selected.clear(); focusIndex = 0;
      announce("이어하기", `${cfg().label} ${round}라운드를 복구했습니다. 안전하게 패턴부터 다시 보여줍니다.`); renderBoard();
      const token = generation; schedule(function () { showPattern(); }, 550, token);
    }
    function focusCurrent() { const cell = board.querySelector(`[data-index="${focusIndex}"]`); if (cell && phase === "input") cell.focus({ preventScroll: true }); }
    function moveFocus(key) {
      if (phase !== "input") return;
      const size = cfg().size; const row = Math.floor(focusIndex / size); const col = focusIndex % size; let next = focusIndex;
      if (key === "arrowleft" && col > 0) next -= 1;
      if (key === "arrowright" && col < size - 1) next += 1;
      if (key === "arrowup" && row > 0) next -= size;
      if (key === "arrowdown" && row < size - 1) next += size;
      focusIndex = next; renderBoard(); focusCurrent();
    }
    function onVisibility() {
      if (document.hidden) {
        if (phase === "showing") { clearTimers(); phase = "paused-show"; announce("자동 일시정지", "패턴 표시를 멈췄습니다. 돌아오면 처음부터 다시 보여줍니다."); renderBoard(); }
        else if (phase === "input") { phase = "paused-input"; announce("자동 일시정지", `선택 ${selected.size}/${target.length} 상태를 보존했습니다.`); renderBoard(); }
      } else if (phase === "paused-show") showPattern("다시 돌아와 현재 패턴을 처음부터 보여줍니다.");
      else if (phase === "paused-input") { phase = "input"; announce("입력 재개", `${selected.size}/${target.length}개 선택한 상태입니다.`); renderBoard(); focusCurrent(); }
    }
    function onKey(event) {
      if (!root.isConnected || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.target && /^(INPUT|SELECT|TEXTAREA)$/.test(event.target.tagName)) return;
      const key = event.key.toLowerCase();
      if (["arrowleft","arrowright","arrowup","arrowdown"].includes(key)) { event.preventDefault(); event.stopImmediatePropagation(); moveFocus(key); return; }
      if ((key === "enter" || key === " ") && phase === "input") { event.preventDefault(); event.stopImmediatePropagation(); toggleCell(focusIndex); return; }
      if (key !== "h" && key !== "n") return;
      event.preventDefault(); event.stopImmediatePropagation(); if (key === "h") replay(); else beginRun();
    }

    startButton.addEventListener("click", beginRun);
    submitButton.addEventListener("click", evaluate);
    replayButton.addEventListener("click", replay);
    muteButton.addEventListener("click", function () { muted = !muted; writeJson(PREF_KEY, { difficulty: difficulty, muted: muted }); updateHud(); });
    difficultySelect.addEventListener("change", function () {
      difficulty = clampDifficulty(difficultySelect.value); writeJson(PREF_KEY, { difficulty: difficulty, muted: muted }); clearTimers(); removeKey(SAVE_KEY); round = 0; target = []; selected.clear(); lives = cfg().lives; score = 0; correctSelections = 0; totalSelections = 0; perfectStreak = 0; runBestStreak = 0; replays = 0; started = false; phase = "ready"; focusIndex = 0; announce("난이도 변경", `${cfg().label} 모드: ${cfg().size}×${cfg().size}, 목숨 ${cfg().lives}개입니다.`); renderBoard();
    });
    window.addEventListener("keydown", onKey, true);
    document.addEventListener("visibilitychange", onVisibility);

    const externalRestart = document.querySelector("#restartGame");
    function onExternalRestart() { removeKey(SAVE_KEY); clearTimers(); }
    if (externalRestart) externalRestart.addEventListener("click", onExternalRestart, true);

    const cleanupObserver = new MutationObserver(function () {
      if (root.isConnected) return;
      clearTimers(); window.removeEventListener("keydown", onKey, true); document.removeEventListener("visibilitychange", onVisibility); if (externalRestart) externalRestart.removeEventListener("click", onExternalRestart, true); surface.classList.remove("pattern-memory-runtime-game"); cleanupObserver.disconnect();
    });
    cleanupObserver.observe(document.documentElement, { childList: true, subtree: true });

    restore(); return true;
  }

  function isTarget(surface) {
    if (surface.dataset.gameId === "pattern-memory") return true;
    if (location.pathname.indexOf("/games/pattern-memory/") >= 0) return true;
    return surface.id === "playSurface" && new URLSearchParams(location.search).get("game") === "pattern-memory";
  }
  function scan() { document.querySelectorAll("#playSurface, .play-surface").forEach(function (surface) { if (isTarget(surface) && !surface.querySelector(".pattern-memory-runtime-root")) setup(surface); }); }
  function boot() { scan(); const observer = new MutationObserver(scan); observer.observe(document.documentElement, { childList: true, subtree: true }); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true }); else boot();
})();