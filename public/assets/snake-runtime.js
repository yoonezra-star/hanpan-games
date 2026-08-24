(function () {
  const recordsKey = "hanpan-snake-records-v2";
  const prefsKey = "hanpan-snake-prefs-v2";
  const legacyBestKey = "hanpan-arcade-snake-garden";
  const size = 16;
  const cell = 26;
  const directions = {
    up: { row: -1, col: 0, opposite: "down" },
    down: { row: 1, col: 0, opposite: "up" },
    left: { row: 0, col: -1, opposite: "right" },
    right: { row: 0, col: 1, opposite: "left" }
  };
  const difficultyConfig = {
    easy: { label: "쉬움", delay: 190, stageStep: 5, comboWindow: 7000, bonusLife: 6200, rocksPerStage: 0 },
    normal: { label: "보통", delay: 145, stageStep: 6, comboWindow: 5200, bonusLife: 5000, rocksPerStage: 1 },
    hard: { label: "어려움", delay: 112, stageStep: 7, comboWindow: 3900, bonusLife: 3900, rocksPerStage: 2 }
  };
  const mapNames = { classic: "클래식 정원", hedge: "울타리 정원", pond: "연못 정원" };
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
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }

  function readLegacyBest() {
    try {
      const value = Number(localStorage.getItem(legacyBestKey));
      return Number.isFinite(value) && value > 0 ? value : 0;
    } catch (error) {
      return 0;
    }
  }

  function blankRecord() {
    return { plays: 0, bestScore: 0, bestLength: 3, bestStage: 1, bestCombo: 0 };
  }

  function readRecords() {
    const saved = readJson(recordsKey, {});
    const records = saved.records && typeof saved.records === "object" ? saved.records : {};
    const legacy = readLegacyBest();
    const legacyKey = "normal:classic";
    if (!records[legacyKey]) records[legacyKey] = blankRecord();
    if (legacy > records[legacyKey].bestScore) records[legacyKey].bestScore = legacy;
    return { version: 2, records: records };
  }

  function normalizeRecord(value) {
    const source = value && typeof value === "object" ? value : {};
    return {
      plays: Math.max(0, Number(source.plays) || 0),
      bestScore: Math.max(0, Number(source.bestScore) || 0),
      bestLength: Math.max(3, Number(source.bestLength) || 3),
      bestStage: Math.max(1, Number(source.bestStage) || 1),
      bestCombo: Math.max(0, Number(source.bestCombo) || 0)
    };
  }

  function addStyle() {
    if (styleAdded || document.getElementById("snake-runtime-style")) return;
    styleAdded = true;
    const style = document.createElement("style");
    style.id = "snake-runtime-style";
    style.textContent = `
      .snake-runtime-game { position: relative; }
      .snake-runtime-root { display: grid; gap: 10px; width: 100%; }
      .snake-runtime-settings {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
      }
      .snake-runtime-settings label {
        display: grid;
        gap: 5px;
        font-size: 12px;
        font-weight: 800;
      }
      .snake-runtime-settings select {
        width: 100%;
        min-height: 40px;
        border: 1px solid rgba(29, 36, 51, 0.18);
        border-radius: 10px;
        padding: 7px 9px;
        background: #fffdf7;
        color: inherit;
        font: inherit;
      }
      .snake-runtime-status {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 5px 12px;
        padding: 9px 11px;
        border: 1px solid rgba(29, 36, 51, 0.12);
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.58);
      }
      .snake-runtime-status strong { font-weight: 900; }
      .snake-runtime-status span { opacity: 0.78; font-size: 13px; }
      .snake-runtime-canvas {
        display: block;
        width: min(100%, 520px);
        height: auto;
        margin: 0 auto;
        border-radius: 14px;
        border: 1px solid rgba(29, 36, 51, 0.18);
        background: #eef6e7;
        touch-action: none;
        outline: none;
      }
      .snake-runtime-canvas:focus-visible { box-shadow: 0 0 0 3px rgba(38, 139, 98, 0.25); }
      .snake-runtime-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 7px;
        justify-content: center;
      }
      .snake-runtime-dpad {
        width: min(230px, 100%);
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-areas: ". up ." "left down right";
        gap: 6px;
      }
      .snake-runtime-dpad .button { min-height: 44px; font-size: 18px; }
      .snake-runtime-dpad [data-dir="up"] { grid-area: up; }
      .snake-runtime-dpad [data-dir="left"] { grid-area: left; }
      .snake-runtime-dpad [data-dir="down"] { grid-area: down; }
      .snake-runtime-dpad [data-dir="right"] { grid-area: right; }
      .snake-runtime-records {
        display: flex;
        flex-wrap: wrap;
        gap: 7px 14px;
        padding: 9px 11px;
        border-radius: 12px;
        background: rgba(37, 139, 98, 0.08);
        font-size: 12px;
      }
      .snake-runtime-records strong { font-weight: 900; }
      .snake-runtime-note { margin: 0; text-align: center; font-size: 12px; opacity: 0.76; }
      @media (max-width: 640px) {
        .snake-runtime-settings { grid-template-columns: 1fr; }
        .snake-runtime-actions {
          position: sticky;
          bottom: 8px;
          z-index: 22;
          padding: 8px;
          border-radius: 14px;
          background: rgba(255, 250, 240, 0.95);
          box-shadow: 0 8px 24px rgba(29, 36, 51, 0.16);
          backdrop-filter: blur(8px);
        }
        .snake-runtime-actions .button { min-height: 44px; }
      }
    `;
    document.head.appendChild(style);
  }

  function fixedRocks(map) {
    const cells = [];
    function add(row, col) {
      if (row >= 0 && row < size && col >= 0 && col < size) cells.push(row * size + col);
    }
    if (map === "hedge") {
      for (let row = 2; row <= 5; row += 1) { add(row, 4); add(row, 11); }
      for (let row = 10; row <= 13; row += 1) { add(row, 4); add(row, 11); }
      for (let col = 2; col <= 4; col += 1) { add(5, col); add(10, col); }
      for (let col = 11; col <= 13; col += 1) { add(5, col); add(10, col); }
    }
    if (map === "pond") {
      [[3, 3], [3, 12], [12, 3], [12, 12]].forEach(function (center) {
        for (let row = center[0] - 1; row <= center[0] + 1; row += 1) {
          for (let col = center[1] - 1; col <= center[1] + 1; col += 1) add(row, col);
        }
      });
    }
    return new Set(cells);
  }

  function createAudio() {
    let muted = false;
    let context = null;
    function ensure() {
      if (muted) return null;
      try {
        if (!context) context = new (window.AudioContext || window.webkitAudioContext)();
        if (context.state === "suspended") context.resume();
        return context;
      } catch (error) {
        return null;
      }
    }
    function tone(frequency, duration, type, volume, delay) {
      const ctx = ensure();
      if (!ctx) return;
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = type || "sine";
      oscillator.frequency.value = frequency;
      gain.gain.value = volume || 0.018;
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      const start = ctx.currentTime + (delay || 0);
      oscillator.start(start);
      gain.gain.setValueAtTime(volume || 0.018, start);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      oscillator.stop(start + duration + 0.02);
    }
    return {
      tone: tone,
      toggle: function (button) {
        muted = !muted;
        button.textContent = muted ? "소리 꺼짐" : "소리 켜짐";
        button.setAttribute("aria-pressed", String(!muted));
        if (!muted) tone(520, 0.08, "sine", 0.02);
      },
      close: function () {
        try { if (context) context.close(); } catch (error) { /* Optional audio. */ }
      }
    };
  }

  function setupSurface(surface) {
    if (!surface || surface.querySelector(".snake-runtime-root")) return false;
    const legacyGrid = surface.querySelector(".snake-grid");
    if (!legacyGrid) return false;

    addStyle();
    const prefs = readJson(prefsKey, {});
    let difficulty = ["easy", "normal", "hard"].includes(prefs.difficulty) ? prefs.difficulty : "normal";
    let map = ["classic", "hedge", "pond"].includes(prefs.map) ? prefs.map : "classic";
    let records = readRecords();
    let snake = [];
    let direction = "right";
    let queuedDirection = "right";
    let turnUsed = false;
    let food = null;
    let bonusFood = null;
    let bonusUntil = 0;
    let score = 0;
    let eaten = 0;
    let stage = 1;
    let combo = 0;
    let comboDeadline = 0;
    let dynamicRocks = new Set();
    let running = false;
    let started = false;
    let over = false;
    let timer = null;
    let swipeStart = null;
    let autoPaused = false;
    const audio = createAudio();

    surface.innerHTML = "";
    surface.classList.add("snake-runtime-game");

    const root = document.createElement("div");
    root.className = "snake-runtime-root";
    const hud = document.createElement("div");
    hud.className = "mini-score";
    const hudItems = ["점수", "길이", "단계", "콤보", "최고"].map(function (label) {
      const item = document.createElement("span");
      const value = document.createElement("b");
      const small = document.createElement("small");
      small.textContent = label;
      item.append(value, small);
      hud.appendChild(item);
      return value;
    });

    const settings = document.createElement("div");
    settings.className = "snake-runtime-settings";
    const difficultyLabel = document.createElement("label");
    difficultyLabel.textContent = "난이도";
    const difficultySelect = document.createElement("select");
    [["easy", "쉬움 · 여유 있는 속도"], ["normal", "보통 · 표준 속도"], ["hard", "어려움 · 빠른 속도"]].forEach(function (entry) {
      const option = document.createElement("option");
      option.value = entry[0];
      option.textContent = entry[1];
      difficultySelect.appendChild(option);
    });
    difficultyLabel.appendChild(difficultySelect);
    const mapLabel = document.createElement("label");
    mapLabel.textContent = "정원 맵";
    const mapSelect = document.createElement("select");
    [["classic", "클래식 정원"], ["hedge", "울타리 정원"], ["pond", "연못 정원"]].forEach(function (entry) {
      const option = document.createElement("option");
      option.value = entry[0];
      option.textContent = entry[1];
      mapSelect.appendChild(option);
    });
    mapLabel.appendChild(mapSelect);
    settings.append(difficultyLabel, mapLabel);

    const status = document.createElement("div");
    status.className = "snake-runtime-status";
    status.setAttribute("aria-live", "polite");
    const statusTitle = document.createElement("strong");
    const statusText = document.createElement("span");
    status.append(statusTitle, statusText);

    const canvas = document.createElement("canvas");
    canvas.className = "snake-runtime-canvas";
    canvas.width = size * cell;
    canvas.height = size * cell;
    canvas.tabIndex = 0;
    canvas.setAttribute("role", "application");
    canvas.setAttribute("aria-label", "뱀의 정원 게임판. 방향키 또는 W A S D로 움직이고, 모바일에서는 게임판을 스와이프할 수 있습니다. P 또는 Space로 일시정지합니다.");
    const ctx = canvas.getContext("2d");

    const actions = document.createElement("div");
    actions.className = "snake-runtime-actions";
    const startButton = document.createElement("button");
    startButton.type = "button";
    startButton.className = "button primary";
    startButton.textContent = "시작";
    const newButton = document.createElement("button");
    newButton.type = "button";
    newButton.className = "button secondary";
    newButton.textContent = "새 게임";
    const soundButton = document.createElement("button");
    soundButton.type = "button";
    soundButton.className = "button secondary sound-toggle";
    soundButton.textContent = "소리 켜짐";
    soundButton.setAttribute("aria-pressed", "true");
    actions.append(startButton, newButton, soundButton);

    const dpad = document.createElement("div");
    dpad.className = "snake-runtime-dpad";
    [["up", "↑", "위"], ["left", "←", "왼쪽"], ["down", "↓", "아래"], ["right", "→", "오른쪽"]].forEach(function (entry) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "button secondary";
      button.dataset.dir = entry[0];
      button.textContent = entry[1];
      button.setAttribute("aria-label", `${entry[2]}으로 이동`);
      button.addEventListener("click", function () { queueDirection(entry[0]); });
      dpad.appendChild(button);
    });

    const recordBox = document.createElement("div");
    recordBox.className = "snake-runtime-records";
    const note = document.createElement("p");
    note.className = "snake-runtime-note";
    note.textContent = "일반 먹이를 연속 시간 안에 먹으면 콤보가 올라갑니다. 별 먹이는 더 높은 점수를 주며, 탭을 벗어나면 자동으로 일시정지합니다.";
    root.append(hud, settings, status, canvas, actions, dpad, recordBox, note);
    surface.appendChild(root);

    function profileKey() {
      return `${difficulty}:${map}`;
    }

    function record() {
      const key = profileKey();
      if (!records.records[key]) records.records[key] = blankRecord();
      records.records[key] = normalizeRecord(records.records[key]);
      return records.records[key];
    }

    function storePrefs() {
      writeJson(prefsKey, { difficulty: difficulty, map: map });
    }

    function storeRecords() {
      writeJson(recordsKey, records);
    }

    function point(row, col) {
      return row * size + col;
    }

    function rowOf(index) {
      return Math.floor(index / size);
    }

    function colOf(index) {
      return index % size;
    }

    function allRocks() {
      const merged = fixedRocks(map);
      dynamicRocks.forEach(function (index) { merged.add(index); });
      return merged;
    }

    function emptyCells(extraExcluded) {
      const blocked = allRocks();
      snake.forEach(function (index) { blocked.add(index); });
      if (food !== null) blocked.add(food);
      if (bonusFood !== null) blocked.add(bonusFood);
      (extraExcluded || []).forEach(function (index) { blocked.add(index); });
      const empty = [];
      for (let index = 0; index < size * size; index += 1) if (!blocked.has(index)) empty.push(index);
      return empty;
    }

    function chooseEmpty(predicate) {
      const candidates = emptyCells().filter(predicate || function () { return true; });
      return candidates.length ? candidates[Math.floor(Math.random() * candidates.length)] : null;
    }

    function placeFood() {
      const next = chooseEmpty();
      if (next === null) {
        finish("정원을 가득 채웠습니다.");
        return;
      }
      food = next;
    }

    function placeBonus() {
      const next = chooseEmpty(function (index) {
        const head = snake[0];
        return Math.abs(rowOf(index) - rowOf(head)) + Math.abs(colOf(index) - colOf(head)) >= 4;
      });
      if (next === null) return;
      bonusFood = next;
      bonusUntil = Date.now() + difficultyConfig[difficulty].bonusLife;
      setStatus("별 먹이 등장", "사라지기 전에 먹으면 콤보 배율이 적용된 보너스 점수를 얻습니다.");
      audio.tone(690, 0.07, "sine", 0.02);
      audio.tone(910, 0.1, "sine", 0.018, 0.07);
    }

    function addDynamicRocks(count) {
      for (let amount = 0; amount < count; amount += 1) {
        const head = snake[0];
        const next = chooseEmpty(function (index) {
          const distance = Math.abs(rowOf(index) - rowOf(head)) + Math.abs(colOf(index) - colOf(head));
          return distance >= 4 && index !== food && index !== bonusFood;
        });
        if (next !== null) dynamicRocks.add(next);
      }
    }

    function speedDelay() {
      const config = difficultyConfig[difficulty];
      return Math.max(62, config.delay - (stage - 1) * config.stageStep);
    }

    function setStatus(title, text) {
      statusTitle.textContent = title;
      statusText.textContent = text;
      const result = document.getElementById("playResult");
      if (result) result.textContent = text;
    }

    function syncRecord() {
      const current = record();
      current.bestScore = Math.max(current.bestScore, score);
      current.bestLength = Math.max(current.bestLength, snake.length);
      current.bestStage = Math.max(current.bestStage, stage);
      current.bestCombo = Math.max(current.bestCombo, combo);
      storeRecords();
    }

    function updateHud() {
      const current = record();
      hudItems[0].textContent = String(score);
      hudItems[1].textContent = String(snake.length);
      hudItems[2].textContent = String(stage);
      hudItems[3].textContent = combo > 1 ? `x${Math.min(4, combo)}` : "-";
      hudItems[4].textContent = String(current.bestScore || "-");
      const bonusLeft = bonusFood !== null ? Math.max(0, (bonusUntil - Date.now()) / 1000) : 0;
      recordBox.innerHTML = `<strong>${difficultyConfig[difficulty].label} · ${mapNames[map]}</strong><span>도전 ${current.plays}회</span><span>최고 길이 ${current.bestLength}</span><span>최고 단계 ${current.bestStage}</span><span>최고 콤보 x${current.bestCombo || 0}</span>${bonusFood !== null ? `<span>별 ${bonusLeft.toFixed(1)}초</span>` : ""}`;
    }

    function resetComboIfExpired() {
      if (combo > 0 && Date.now() > comboDeadline) combo = 0;
    }

    function comboMultiplier() {
      return Math.min(4, Math.max(1, combo));
    }

    function registerFood(base) {
      const now = Date.now();
      if (now <= comboDeadline && combo > 0) combo += 1;
      else combo = 1;
      comboDeadline = now + difficultyConfig[difficulty].comboWindow;
      const gained = base * comboMultiplier();
      score += gained;
      syncRecord();
      return gained;
    }

    function schedule() {
      clearTimeout(timer);
      if (!running || over) return;
      timer = window.setTimeout(step, speedDelay());
    }

    function startRunning(message) {
      if (over) return;
      if (!started) {
        started = true;
        record().plays += 1;
        storeRecords();
      }
      running = true;
      autoPaused = false;
      startButton.textContent = "일시정지";
      setStatus("진행 중", message || "먹이를 먹되 다음 회전 공간을 남겨 두세요.");
      schedule();
      canvas.focus({ preventScroll: true });
    }

    function pause(message, automatic) {
      if (!running || over) return;
      running = false;
      autoPaused = Boolean(automatic);
      clearTimeout(timer);
      startButton.textContent = "계속";
      setStatus(automatic ? "자동 일시정지" : "일시정지", message || "P 또는 Space를 누르면 계속합니다.");
      draw();
    }

    function togglePause() {
      if (over) {
        resetGame();
        startRunning("새 판을 시작했습니다.");
        return;
      }
      if (running) pause("게임을 멈췄습니다. P 또는 Space로 계속할 수 있습니다.", false);
      else startRunning(started ? "게임을 이어서 진행합니다." : "먹이를 먹으며 길이를 늘리세요.");
    }

    function nextIndex(directionName) {
      const vector = directions[directionName];
      const head = snake[0];
      const row = rowOf(head) + vector.row;
      const col = colOf(head) + vector.col;
      if (row < 0 || row >= size || col < 0 || col >= size) return null;
      return point(row, col);
    }

    function queueDirection(nextDirection) {
      if (!(nextDirection in directions) || over) return;
      const baseDirection = turnUsed ? queuedDirection : direction;
      if (directions[baseDirection] && directions[baseDirection].opposite === nextDirection) return;
      if (turnUsed) return;
      queuedDirection = nextDirection;
      turnUsed = true;
      if (!running) startRunning(started ? "방향 입력으로 게임을 계속합니다." : "첫 방향을 정했습니다. 출발합니다.");
    }

    function advanceStageIfNeeded() {
      const targetStage = 1 + Math.floor(eaten / 5);
      if (targetStage <= stage) return;
      stage = targetStage;
      addDynamicRocks(difficultyConfig[difficulty].rocksPerStage);
      setStatus(`${stage}단계`, `${difficultyConfig[difficulty].label} 속도가 빨라졌습니다.${difficultyConfig[difficulty].rocksPerStage ? " 정원 돌도 추가됐습니다." : ""}`);
      audio.tone(520, 0.08, "sine", 0.022);
      audio.tone(760, 0.12, "sine", 0.02, 0.08);
      syncRecord();
    }

    function step() {
      if (!running || over) return;
      resetComboIfExpired();
      if (bonusFood !== null && Date.now() > bonusUntil) {
        bonusFood = null;
        bonusUntil = 0;
      }
      direction = queuedDirection;
      turnUsed = false;
      const next = nextIndex(direction);
      const rocks = allRocks();
      const growsRegular = next !== null && next === food;
      const growsBonus = next !== null && next === bonusFood;
      const grows = growsRegular || growsBonus;
      const body = grows ? snake : snake.slice(0, -1);
      if (next === null || rocks.has(next) || body.includes(next)) {
        finish(next === null ? "정원 벽에 닿았습니다." : rocks.has(next) ? "정원 장애물에 부딪혔습니다." : "자기 몸에 닿았습니다.");
        return;
      }
      snake.unshift(next);
      if (growsRegular) {
        eaten += 1;
        const gained = registerFood(10);
        food = null;
        audio.tone(430 + Math.min(combo, 5) * 45, 0.055, "sine", 0.018);
        advanceStageIfNeeded();
        placeFood();
        if (eaten % 3 === 0 && bonusFood === null) placeBonus();
        setStatus(`먹이 +${gained}`, combo > 1 ? `연속 획득 콤보 x${comboMultiplier()}입니다.` : "다음 먹이를 향하되 탈출 경로를 먼저 확인하세요.");
      } else if (growsBonus) {
        const gained = registerFood(30);
        bonusFood = null;
        bonusUntil = 0;
        audio.tone(760, 0.08, "sine", 0.024);
        audio.tone(1040, 0.12, "sine", 0.021, 0.08);
        setStatus(`별 먹이 +${gained}`, `보너스 획득. 콤보 x${comboMultiplier()}입니다.`);
      } else {
        snake.pop();
      }
      syncRecord();
      updateHud();
      draw();
      schedule();
    }

    function finish(message) {
      running = false;
      over = true;
      clearTimeout(timer);
      resetComboIfExpired();
      syncRecord();
      startButton.textContent = "다시 시작";
      setStatus("게임 종료", `${message} 최종 ${score}점, 길이 ${snake.length}, ${stage}단계입니다.`);
      audio.tone(170, 0.25, "sawtooth", 0.025);
      updateHud();
      draw();
    }

    function resetGame(message) {
      clearTimeout(timer);
      const centerRow = Math.floor(size / 2);
      snake = [point(centerRow, 8), point(centerRow, 7), point(centerRow, 6)];
      direction = "right";
      queuedDirection = "right";
      turnUsed = false;
      food = null;
      bonusFood = null;
      bonusUntil = 0;
      score = 0;
      eaten = 0;
      stage = 1;
      combo = 0;
      comboDeadline = 0;
      dynamicRocks = new Set();
      running = false;
      started = false;
      over = false;
      autoPaused = false;
      startButton.textContent = "시작";
      difficultySelect.value = difficulty;
      mapSelect.value = map;
      placeFood();
      updateHud();
      setStatus("플레이 준비", message || `${difficultyConfig[difficulty].label} · ${mapNames[map]}입니다. 방향을 입력하거나 시작을 누르세요.`);
      draw();
    }

    function drawStar(x, y, radius) {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = "#ffd84d";
      ctx.strokeStyle = "#7c5715";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let index = 0; index < 10; index += 1) {
        const angle = -Math.PI / 2 + index * Math.PI / 5;
        const r = index % 2 === 0 ? radius : radius * 0.45;
        const xPoint = Math.cos(angle) * r;
        const yPoint = Math.sin(angle) * r;
        if (index === 0) ctx.moveTo(xPoint, yPoint);
        else ctx.lineTo(xPoint, yPoint);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    function draw() {
      resetComboIfExpired();
      const rocks = allRocks();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = map === "pond" ? "#e9f4ec" : "#eff6e8";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(43, 94, 62, 0.09)";
      ctx.lineWidth = 1;
      for (let index = 0; index <= size; index += 1) {
        ctx.beginPath();
        ctx.moveTo(index * cell, 0);
        ctx.lineTo(index * cell, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, index * cell);
        ctx.lineTo(canvas.width, index * cell);
        ctx.stroke();
      }
      rocks.forEach(function (index) {
        const row = rowOf(index);
        const col = colOf(index);
        const x = col * cell;
        const y = row * cell;
        ctx.fillStyle = map === "pond" && fixedRocks(map).has(index) ? "#74b7c7" : map === "hedge" && fixedRocks(map).has(index) ? "#4f8d58" : "#8e8a78";
        ctx.fillRect(x + 3, y + 3, cell - 6, cell - 6);
        ctx.strokeStyle = "rgba(29,36,51,0.45)";
        ctx.strokeRect(x + 3, y + 3, cell - 6, cell - 6);
      });
      if (food !== null) {
        const x = colOf(food) * cell + cell / 2;
        const y = rowOf(food) * cell + cell / 2;
        ctx.fillStyle = "#ef5b4d";
        ctx.beginPath();
        ctx.arc(x, y, cell * 0.28, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#3d7b49";
        ctx.fillRect(x - 1, y - cell * 0.36, 3, 6);
      }
      if (bonusFood !== null && Date.now() <= bonusUntil) {
        drawStar(colOf(bonusFood) * cell + cell / 2, rowOf(bonusFood) * cell + cell / 2, cell * 0.34);
      }
      snake.forEach(function (index, snakeIndex) {
        const row = rowOf(index);
        const col = colOf(index);
        const x = col * cell;
        const y = row * cell;
        ctx.fillStyle = snakeIndex === 0 ? "#1c704d" : `hsl(${138 - Math.min(28, snakeIndex)}, 46%, ${42 + Math.min(12, snakeIndex * 0.6)}%)`;
        ctx.fillRect(x + 2, y + 2, cell - 4, cell - 4);
        if (snakeIndex === 0) {
          ctx.fillStyle = "#fff";
          const eyeOffset = direction === "left" || direction === "right" ? [[10, 7], [10, 17]] : [[7, 10], [17, 10]];
          eyeOffset.forEach(function (eye) {
            let ex = x + eye[0];
            let ey = y + eye[1];
            if (direction === "left") ex = x + cell - eye[0];
            if (direction === "up") ey = y + cell - eye[1];
            ctx.beginPath();
            ctx.arc(ex, ey, 2.4, 0, Math.PI * 2);
            ctx.fill();
          });
        }
      });
      if (!running) {
        ctx.fillStyle = "rgba(17, 35, 24, 0.64)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#fffdf7";
        ctx.font = "800 25px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(over ? "게임 종료" : started ? "일시정지" : "뱀의 정원", canvas.width / 2, canvas.height / 2 - 9);
        ctx.fillStyle = "#ffe178";
        ctx.font = "700 14px sans-serif";
        ctx.fillText(over ? `${score}점 · 길이 ${snake.length}` : autoPaused ? "탭을 벗어나 자동 정지됨" : "방향키 · WASD · 스와이프", canvas.width / 2, canvas.height / 2 + 22);
      }
      updateHud();
    }

    function onKey(event) {
      if (!root.isConnected) return;
      if (event.target && /^(SELECT|INPUT|TEXTAREA)$/.test(event.target.tagName)) return;
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      const mapKeys = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right", w: "up", s: "down", a: "left", d: "right" };
      if (!(key in mapKeys) && key !== "p" && key !== " ") return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (key === "p" || key === " ") {
        if (!event.repeat) togglePause();
        return;
      }
      queueDirection(mapKeys[key]);
    }

    function onVisibility() {
      if (document.hidden && running) pause("탭을 벗어나 게임을 자동으로 멈췄습니다. 돌아와서 계속을 눌러 주세요.", true);
    }

    difficultySelect.addEventListener("change", function () {
      difficulty = ["easy", "normal", "hard"].includes(difficultySelect.value) ? difficultySelect.value : "normal";
      storePrefs();
      resetGame(`${difficultyConfig[difficulty].label} 난이도로 새 판을 준비했습니다.`);
    });
    mapSelect.addEventListener("change", function () {
      map = ["classic", "hedge", "pond"].includes(mapSelect.value) ? mapSelect.value : "classic";
      storePrefs();
      resetGame(`${mapNames[map]}으로 새 판을 준비했습니다.`);
    });
    startButton.addEventListener("click", togglePause);
    newButton.addEventListener("click", function () { resetGame("새 게임을 준비했습니다."); });
    soundButton.addEventListener("click", function () { audio.toggle(soundButton); });
    canvas.addEventListener("pointerdown", function (event) {
      swipeStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
      try { canvas.setPointerCapture(event.pointerId); } catch (error) { /* Pointer capture is optional. */ }
      canvas.focus({ preventScroll: true });
    });
    canvas.addEventListener("pointerup", function (event) {
      if (!swipeStart) return;
      const dx = event.clientX - swipeStart.x;
      const dy = event.clientY - swipeStart.y;
      swipeStart = null;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 22) return;
      queueDirection(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up"));
    });
    canvas.addEventListener("pointercancel", function () { swipeStart = null; });
    window.addEventListener("keydown", onKey, true);
    document.addEventListener("visibilitychange", onVisibility);

    const cleanupObserver = new MutationObserver(function () {
      if (root.isConnected) return;
      clearTimeout(timer);
      window.removeEventListener("keydown", onKey, true);
      document.removeEventListener("visibilitychange", onVisibility);
      audio.close();
      surface.classList.remove("snake-runtime-game");
      cleanupObserver.disconnect();
    });
    cleanupObserver.observe(document.documentElement, { childList: true, subtree: true });

    resetGame();
    return true;
  }

  function scan() {
    document.querySelectorAll("#playSurface, .play-surface").forEach(function (surface) {
      if (surface.querySelector(".snake-grid")) setupSurface(surface);
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