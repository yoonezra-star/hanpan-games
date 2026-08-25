(function () {
  const SAVE_KEY = "hanpan-simon-save-v2";
  const RECORD_KEY = "hanpan-simon-records-v2";
  const PREF_KEY = "hanpan-simon-prefs-v2";
  const LEGACY_KEY = "hanpan-arcade-simon";
  const labels = ["빨강", "파랑", "초록", "노랑"];
  const tones = [261.63, 329.63, 392.0, 523.25];
  const levels = {
    easy: { label: "쉬움", lives: 3, on: 620, gap: 170, floor: 320, step: 18, score: 1 },
    normal: { label: "보통", lives: 2, on: 520, gap: 140, floor: 240, step: 20, score: 2 },
    hard: { label: "어려움", lives: 1, on: 420, gap: 110, floor: 175, step: 22, score: 3 }
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
  function freshRecord() { return { runs: 0, bestRound: 0, bestScore: 0, bestAccuracy: 0, bestPerfect: 0 }; }
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
  function clampDifficulty(value) { return levels[value] ? value : "normal"; }
  function accuracy(correct, total) { return total ? Math.round(correct / total * 100) : 100; }
  function randomPad(sequence) {
    let value = Math.floor(Math.random() * 4);
    if (sequence.length >= 2 && sequence[sequence.length - 1] === value && sequence[sequence.length - 2] === value) value = (value + 1 + Math.floor(Math.random() * 3)) % 4;
    return value;
  }
  function addStyle() {
    if (styleAdded) return;
    styleAdded = true;
    const style = document.createElement("style");
    style.textContent = `
      .simon-runtime-game{--simon-gap:12px}
      .simon-runtime-root{display:grid;gap:14px;max-width:720px;margin:0 auto}
      .simon-settings,.simon-actions,.simon-records{display:flex;gap:9px;flex-wrap:wrap;align-items:center;justify-content:center}
      .simon-settings label{display:grid;gap:5px;min-width:150px;font-weight:700}
      .simon-settings select{min-height:42px;border:1px solid rgba(29,36,51,.22);border-radius:10px;padding:0 12px;background:#fffdf7;font:inherit}
      .simon-status{display:grid;gap:3px;text-align:center;padding:10px 12px;border-radius:12px;background:rgba(74,111,185,.08)}
      .simon-status strong{font-size:1rem}.simon-status span{font-size:.9rem;opacity:.8}
      .simon-board{display:grid;grid-template-columns:repeat(2,1fr);gap:var(--simon-gap);width:min(100%,430px);aspect-ratio:1;margin:0 auto;touch-action:manipulation}
      .simon-pad{border:2px solid rgba(29,36,51,.28);border-radius:24px;min-width:0;min-height:0;cursor:pointer;box-shadow:inset 0 -7px 0 rgba(29,36,51,.14);transition:transform .1s ease,filter .1s ease,box-shadow .1s ease;position:relative}
      .simon-pad::after{content:attr(data-key);position:absolute;right:12px;bottom:10px;min-width:27px;height:27px;border-radius:999px;background:rgba(29,36,51,.72);color:#fff;display:grid;place-items:center;font:800 .8rem/1 system-ui,sans-serif}
      .simon-pad[data-pad="0"]{background:#e95d55}.simon-pad[data-pad="1"]{background:#4f86dc}.simon-pad[data-pad="2"]{background:#51aa70}.simon-pad[data-pad="3"]{background:#e4ba43}
      .simon-pad.is-lit,.simon-pad:active:not(:disabled){filter:brightness(1.42) saturate(1.25);transform:scale(.965);box-shadow:0 0 0 5px rgba(255,255,255,.85),0 0 28px rgba(86,123,190,.45)}
      .simon-pad:disabled{cursor:default}.simon-pad:focus-visible{outline:4px solid #1d2433;outline-offset:3px}
      .simon-progress{height:8px;border-radius:999px;background:rgba(29,36,51,.1);overflow:hidden;width:min(100%,430px);margin:0 auto}.simon-progress span{display:block;height:100%;width:0;background:#4a6fb9;transition:width .12s ease}
      .simon-records{font-size:.88rem}.simon-records span,.simon-records strong{padding:6px 9px;border-radius:999px;background:rgba(29,36,51,.06)}
      .simon-note{text-align:center;margin:0}
      @media(max-width:760px){.simon-runtime-root{gap:11px}.simon-board{width:min(100%,360px);gap:8px}.simon-pad{border-radius:18px}.simon-actions{position:sticky;bottom:8px;z-index:6;padding:8px;border-radius:14px;background:rgba(255,253,247,.95);box-shadow:0 8px 24px rgba(29,36,51,.14)}.simon-actions .button{min-height:44px;flex:1 1 110px}.simon-settings label{flex:1 1 140px}}
      @media(prefers-reduced-motion:reduce){.simon-pad,.simon-progress span{transition:none}}
    `;
    document.head.appendChild(style);
  }

  function setup(surface) {
    if (surface.querySelector(".simon-runtime-root")) return false;
    addStyle();
    surface.classList.add("simon-runtime-game");
    surface.innerHTML = "";

    const prefs = readJson(PREF_KEY, { difficulty: "normal", muted: false });
    let difficulty = clampDifficulty(prefs.difficulty);
    let muted = Boolean(prefs.muted);
    let records = loadRecords();
    let sequence = [];
    let inputIndex = 0;
    let lives = levels[difficulty].lives;
    let score = 0;
    let correctInputs = 0;
    let totalInputs = 0;
    let perfectStreak = 0;
    let runBestPerfect = 0;
    let started = false;
    let runCounted = false;
    let phase = "ready";
    let timers = [];
    let generation = 0;

    const root = document.createElement("div"); root.className = "simon-runtime-root";
    const hud = document.createElement("div"); hud.className = "mini-score";
    const hudLabels = ["라운드", "목숨", "입력", "정확도", "최고"];
    const hudValues = hudLabels.map(function (label) {
      const span = document.createElement("span"); const value = document.createElement("b"); value.textContent = "-"; const small = document.createElement("small"); small.textContent = label; span.append(value, small); hud.appendChild(span); return value;
    });
    const settings = document.createElement("div"); settings.className = "simon-settings";
    const difficultyLabel = document.createElement("label"); difficultyLabel.innerHTML = "<span>난이도</span>";
    const difficultySelect = document.createElement("select");
    difficultySelect.innerHTML = '<option value="easy">쉬움 · 목숨 3</option><option value="normal">보통 · 목숨 2</option><option value="hard">어려움 · 목숨 1</option>';
    difficultyLabel.appendChild(difficultySelect); settings.appendChild(difficultyLabel);
    const status = document.createElement("div"); status.className = "simon-status"; status.setAttribute("aria-live", "polite");
    const board = document.createElement("div"); board.className = "simon-board"; board.setAttribute("role", "group"); board.setAttribute("aria-label", "사이먼 색상 버튼 네 개");
    const pads = labels.map(function (label, index) {
      const button = document.createElement("button"); button.type = "button"; button.className = "simon-pad"; button.dataset.pad = String(index); button.dataset.key = String(index + 1); button.setAttribute("aria-label", `${index + 1}번 ${label}`); board.appendChild(button); return button;
    });
    const progress = document.createElement("div"); progress.className = "simon-progress"; progress.setAttribute("aria-hidden", "true"); const progressBar = document.createElement("span"); progress.appendChild(progressBar);
    const actions = document.createElement("div"); actions.className = "mini-controls simon-actions";
    const startButton = document.createElement("button"); startButton.type = "button"; startButton.className = "button primary"; startButton.textContent = "시작";
    const replayButton = document.createElement("button"); replayButton.type = "button"; replayButton.className = "button secondary"; replayButton.textContent = "패턴 다시 보기";
    const muteButton = document.createElement("button"); muteButton.type = "button"; muteButton.className = "button secondary";
    actions.append(startButton, replayButton, muteButton);
    const recordBox = document.createElement("div"); recordBox.className = "simon-records";
    const note = document.createElement("p"); note.className = "mini-note simon-note"; note.textContent = "숫자키 1~4로 입력할 수 있습니다. 라운드가 올라가면 표시 속도가 빨라집니다.";
    root.append(hud, settings, status, board, progress, actions, recordBox, note); surface.appendChild(root);

    function cfg() { return levels[difficulty]; }
    function currentRecord() { return records[difficulty]; }
    function saveRecords() { writeJson(RECORD_KEY, records); }
    function announce(title, text) { status.innerHTML = `<strong>${title}</strong><span>${text}</span>`; const out = document.querySelector("#playResult"); if (out) out.textContent = `${title} · ${text}`; }
    function tone(index, duration) {
      if (muted) return;
      try {
        audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
        if (audioContext.state === "suspended") audioContext.resume();
        const oscillator = audioContext.createOscillator(); const gain = audioContext.createGain();
        oscillator.type = "sine"; oscillator.frequency.value = tones[index]; gain.gain.value = 0.045;
        oscillator.connect(gain); gain.connect(audioContext.destination); oscillator.start(); gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + Math.max(.06, duration || .16)); oscillator.stop(audioContext.currentTime + Math.max(.07, duration || .17));
      } catch (error) { /* audio optional */ }
    }
    function clearTimers() { generation += 1; timers.forEach(clearTimeout); timers = []; pads.forEach(function (pad) { pad.classList.remove("is-lit"); }); }
    function schedule(fn, delay, token) { const id = setTimeout(function () { if (token === generation && root.isConnected) fn(); }, delay); timers.push(id); }
    function displayDuration() { return Math.max(cfg().floor, cfg().on - Math.max(0, sequence.length - 1) * cfg().step); }
    function saveGame() {
      if (!started || phase === "gameover") { if (phase === "gameover") removeKey(SAVE_KEY); return; }
      writeJson(SAVE_KEY, { version: 2, difficulty: difficulty, sequence: sequence, lives: lives, score: score, correctInputs: correctInputs, totalInputs: totalInputs, perfectStreak: perfectStreak, runBestPerfect: runBestPerfect, started: started, runCounted: runCounted });
    }
    function validSave(value) {
      return value && value.version === 2 && levels[value.difficulty] && Array.isArray(value.sequence) && value.sequence.length > 0 && value.sequence.length <= 200 && value.sequence.every(function (item) { return Number.isInteger(item) && item >= 0 && item < 4; }) && Number(value.lives) > 0;
    }
    function updateRecords() {
      const record = currentRecord();
      recordBox.innerHTML = `<strong>${cfg().label}</strong><span>도전 ${record.runs}</span><span>최고 라운드 ${record.bestRound}</span><span>최고 점수 ${record.bestScore}</span><span>최고 정확도 ${record.bestAccuracy}%</span><span>완벽 연속 ${record.bestPerfect}</span>`;
    }
    function updateHud() {
      const round = sequence.length;
      hudValues[0].textContent = String(round || 0);
      hudValues[1].textContent = "♥".repeat(Math.max(0, lives)) || "0";
      hudValues[2].textContent = round ? `${Math.min(inputIndex, round)}/${round}` : "0/0";
      hudValues[3].textContent = `${accuracy(correctInputs, totalInputs)}%`;
      hudValues[4].textContent = String(currentRecord().bestRound || "-");
      progressBar.style.width = round ? `${Math.min(100, inputIndex / round * 100)}%` : "0%";
      difficultySelect.value = difficulty;
      muteButton.textContent = muted ? "소리 켜기" : "소리 끄기";
      pads.forEach(function (pad) { pad.disabled = phase !== "input"; });
      replayButton.disabled = !started || phase === "showing" || phase === "gameover";
      startButton.textContent = started && phase !== "gameover" ? "새 도전" : "시작";
      updateRecords();
    }
    function light(index, duration) {
      const pad = pads[index]; if (!pad) return;
      pad.classList.add("is-lit"); tone(index, Math.max(.09, duration / 1000 * .75));
      const token = generation; schedule(function () { pad.classList.remove("is-lit"); }, duration, token);
    }
    function showSequence(message) {
      if (!started || !sequence.length) return;
      clearTimers(); phase = "showing"; inputIndex = 0; updateHud();
      announce("패턴 보기", message || `${sequence.length}개 순서를 기억하세요. 표시 중에는 입력할 수 없습니다.`);
      const token = generation; const on = displayDuration(); const gap = cfg().gap; let offset = 220;
      sequence.forEach(function (value) {
        schedule(function () { light(value, on); }, offset, token); offset += on + gap;
      });
      schedule(function () { phase = "input"; inputIndex = 0; announce("입력 시작", `${sequence.length}개 순서를 그대로 입력하세요.`); updateHud(); saveGame(); }, offset + 80, token);
    }
    function beginRun() {
      clearTimers(); sequence = [randomPad([])]; inputIndex = 0; lives = cfg().lives; score = 0; correctInputs = 0; totalInputs = 0; perfectStreak = 0; runBestPerfect = 0; started = true; runCounted = true; phase = "ready";
      currentRecord().runs += 1; saveRecords(); saveGame(); showSequence(`${cfg().label} 난이도입니다. 목숨 ${lives}개로 시작합니다.`);
    }
    function updateRecordAfterProgress() {
      const record = currentRecord();
      record.bestRound = Math.max(record.bestRound, sequence.length);
      record.bestScore = Math.max(record.bestScore, score);
      record.bestAccuracy = Math.max(record.bestAccuracy, accuracy(correctInputs, totalInputs));
      record.bestPerfect = Math.max(record.bestPerfect, runBestPerfect);
      saveRecords();
    }
    function finishRun() {
      clearTimers(); phase = "gameover"; started = false; updateRecordAfterProgress(); removeKey(SAVE_KEY);
      announce("도전 종료", `${sequence.length}라운드 · ${score}점 · 정확도 ${accuracy(correctInputs, totalInputs)}%입니다.`); updateHud();
    }
    function roundComplete() {
      perfectStreak += 1; runBestPerfect = Math.max(runBestPerfect, perfectStreak);
      const round = sequence.length; score += round * 10 * cfg().score + lives * 4; updateRecordAfterProgress();
      sequence.push(randomPad(sequence)); inputIndex = 0; phase = "ready"; saveGame(); updateHud();
      announce("라운드 성공", `${round}라운드를 통과했습니다. 다음은 ${sequence.length}개 순서입니다.`);
      const token = generation; schedule(function () { showSequence(); }, 650, token);
    }
    function wrongInput(expected, actual) {
      lives -= 1; perfectStreak = 0; phase = "ready"; updateRecordAfterProgress(); saveGame();
      if (lives <= 0) { finishRun(); return; }
      announce("순서 실수", `${labels[expected]} 차례에 ${labels[actual]}을 눌렀습니다. 목숨 ${lives}개가 남아 같은 패턴을 다시 보여줍니다.`); updateHud();
      const token = generation; schedule(function () { showSequence("실수한 라운드를 다시 확인하세요."); }, 800, token);
    }
    function press(index) {
      if (phase !== "input" || !started) return;
      totalInputs += 1; light(index, 150);
      const expected = sequence[inputIndex];
      if (index !== expected) { wrongInput(expected, index); return; }
      correctInputs += 1; inputIndex += 1; score += cfg().score; updateHud(); saveGame();
      if (inputIndex >= sequence.length) roundComplete();
      else announce("입력 중", `${inputIndex}/${sequence.length}개 맞았습니다.`);
    }
    function replay() {
      if (!started || phase === "showing" || phase === "gameover") return;
      score = Math.max(0, score - 15 * cfg().score); perfectStreak = 0; phase = "ready"; saveGame(); showSequence("패턴을 다시 봅니다. 점수가 일부 차감되고 완벽 연속 기록은 끊깁니다.");
    }
    function restore() {
      const saved = readJson(SAVE_KEY, null);
      if (!validSave(saved)) { announce("준비", "난이도를 고르고 시작을 누르세요. 숫자키 1~4도 사용할 수 있습니다."); updateHud(); return; }
      difficulty = clampDifficulty(saved.difficulty); sequence = saved.sequence.slice(); lives = Math.max(1, Math.min(levels[difficulty].lives, Number(saved.lives) || 1)); score = Math.max(0, Number(saved.score) || 0); correctInputs = Math.max(0, Number(saved.correctInputs) || 0); totalInputs = Math.max(correctInputs, Number(saved.totalInputs) || 0); perfectStreak = Math.max(0, Number(saved.perfectStreak) || 0); runBestPerfect = Math.max(perfectStreak, Number(saved.runBestPerfect) || 0); started = true; runCounted = Boolean(saved.runCounted); phase = "ready"; inputIndex = 0;
      announce("이어하기", `${cfg().label} ${sequence.length}라운드 저장 상태를 복구했습니다. 패턴을 다시 보여줍니다.`); updateHud();
      const token = generation; schedule(function () { showSequence(); }, 600, token);
    }
    function onVisibility() {
      if (document.hidden) {
        if (phase === "showing") { clearTimers(); phase = "paused-show"; announce("자동 일시정지", "패턴 재생을 멈췄습니다. 돌아오면 처음부터 다시 보여줍니다."); updateHud(); }
        else if (phase === "input") { phase = "paused-input"; announce("자동 일시정지", "입력을 잠시 멈췄습니다."); updateHud(); }
      } else if (phase === "paused-show") showSequence("다시 돌아와 현재 패턴을 처음부터 재생합니다.");
      else if (phase === "paused-input") { phase = "input"; announce("입력 재개", `${inputIndex}/${sequence.length}개까지 입력한 상태입니다.`); updateHud(); }
    }
    function onKey(event) {
      if (!root.isConnected || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.target && /^(INPUT|SELECT|TEXTAREA)$/.test(event.target.tagName)) return;
      const index = ["1", "2", "3", "4"].indexOf(event.key);
      if (index < 0 && event.key.toLowerCase() !== "n" && event.key.toLowerCase() !== "r") return;
      event.preventDefault(); event.stopImmediatePropagation();
      if (index >= 0) press(index); else if (event.key.toLowerCase() === "n") beginRun(); else replay();
    }

    pads.forEach(function (pad, index) { pad.addEventListener("click", function () { press(index); }); });
    startButton.addEventListener("click", beginRun);
    replayButton.addEventListener("click", replay);
    muteButton.addEventListener("click", function () { muted = !muted; writeJson(PREF_KEY, { difficulty: difficulty, muted: muted }); updateHud(); });
    difficultySelect.addEventListener("change", function () {
      difficulty = clampDifficulty(difficultySelect.value); writeJson(PREF_KEY, { difficulty: difficulty, muted: muted }); clearTimers(); removeKey(SAVE_KEY); sequence = []; inputIndex = 0; lives = cfg().lives; score = 0; correctInputs = 0; totalInputs = 0; perfectStreak = 0; runBestPerfect = 0; started = false; phase = "ready"; announce("난이도 변경", `${cfg().label} 모드입니다. 목숨 ${cfg().lives}개로 새 도전을 시작할 수 있습니다.`); updateHud();
    });
    window.addEventListener("keydown", onKey, true);
    document.addEventListener("visibilitychange", onVisibility);

    const externalRestart = document.querySelector("#restartGame");
    function onExternalRestart() { removeKey(SAVE_KEY); clearTimers(); }
    if (externalRestart) externalRestart.addEventListener("click", onExternalRestart, true);

    const cleanupObserver = new MutationObserver(function () {
      if (root.isConnected) return;
      clearTimers(); window.removeEventListener("keydown", onKey, true); document.removeEventListener("visibilitychange", onVisibility); if (externalRestart) externalRestart.removeEventListener("click", onExternalRestart, true); surface.classList.remove("simon-runtime-game"); cleanupObserver.disconnect();
    });
    cleanupObserver.observe(document.documentElement, { childList: true, subtree: true });

    updateHud(); restore(); return true;
  }

  function isTarget(surface) {
    if (surface.dataset.gameId === "simon") return true;
    if (location.pathname.indexOf("/games/simon/") >= 0) return true;
    return surface.id === "playSurface" && new URLSearchParams(location.search).get("game") === "simon";
  }
  function scan() { document.querySelectorAll("#playSurface, .play-surface").forEach(function (surface) { if (isTarget(surface) && !surface.querySelector(".simon-runtime-root")) setup(surface); }); }
  function boot() { scan(); const observer = new MutationObserver(scan); observer.observe(document.documentElement, { childList: true, subtree: true }); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true }); else boot();
})();