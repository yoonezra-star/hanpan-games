(function () {
  const STATS_KEY = "hanpan-rps-survival-v2";
  const PREFS_KEY = "hanpan-rps-prefs-v2";
  const choices = ["rock", "paper", "scissors"];
  const labels = { rock: "바위", paper: "보", scissors: "가위" };
  const icons = { rock: "✊", paper: "✋", scissors: "✌" };
  const beats = { rock: "scissors", paper: "rock", scissors: "paper" };
  const counters = { rock: "paper", paper: "scissors", scissors: "rock" };
  const levels = {
    easy: { label: "쉬움", adaptiveChance: 0.12 },
    normal: { label: "보통", adaptiveChance: 0.46 },
    hard: { label: "어려움", adaptiveChance: 0.72 }
  };
  let styled = false;

  function readJson(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "null");
      return value && typeof value === "object" ? value : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (error) { /* Local records are optional. */ }
  }

  function blankRecord() {
    return { runs: 0, wins: 0, losses: 0, draws: 0, bestScore: 0, bestStreak: 0, bestRound: 0 };
  }

  function normalizeRecord(value) {
    const source = value && typeof value === "object" ? value : {};
    return {
      runs: Math.max(0, Number(source.runs) || 0),
      wins: Math.max(0, Number(source.wins) || 0),
      losses: Math.max(0, Number(source.losses) || 0),
      draws: Math.max(0, Number(source.draws) || 0),
      bestScore: Math.max(0, Number(source.bestScore) || 0),
      bestStreak: Math.max(0, Number(source.bestStreak) || 0),
      bestRound: Math.max(0, Number(source.bestRound) || 0)
    };
  }

  function loadStats() {
    const saved = readJson(STATS_KEY, {});
    const result = { version: 2, records: {} };
    ["easy", "normal", "hard"].forEach(function (level) {
      result.records[level] = normalizeRecord(saved.records && saved.records[level]);
    });
    try {
      const legacy = Number(localStorage.getItem("hanpan-arcade-rps-survival"));
      if (Number.isFinite(legacy)) result.records.normal.bestStreak = Math.max(result.records.normal.bestStreak, legacy);
    } catch (error) { /* Legacy migration is optional. */ }
    return result;
  }

  function addStyles() {
    if (styled || document.getElementById("rps-runtime-style")) return;
    styled = true;
    const style = document.createElement("style");
    style.id = "rps-runtime-style";
    style.textContent = `
      .rps-runtime-root{display:grid;gap:12px;width:100%}
      .rps-settings{display:flex;flex-wrap:wrap;gap:8px;align-items:end;justify-content:space-between}
      .rps-settings label{display:grid;gap:5px;font-size:12px;font-weight:800;min-width:180px}
      .rps-settings select{min-height:40px;border:1px solid rgba(29,36,51,.18);border-radius:10px;padding:7px 10px;background:#fffdf7;color:inherit;font:inherit}
      .rps-status{display:grid;gap:4px;padding:10px 12px;border:1px solid rgba(29,36,51,.12);border-radius:12px;background:rgba(255,255,255,.62)}
      .rps-status strong{font-size:15px;font-weight:900}.rps-status span{font-size:13px;opacity:.8}
      .rps-arena{display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:center}
      .rps-hand-card{display:grid;place-items:center;gap:5px;min-height:118px;border:1px solid rgba(29,36,51,.14);border-radius:16px;background:#fffaf0;text-align:center}
      .rps-hand-card b{font-size:46px;line-height:1}.rps-hand-card span{font-weight:900}.rps-vs{font-weight:1000;opacity:.48}
      .rps-choice-row{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.rps-choice{display:grid;place-items:center;gap:4px;min-height:78px;font-weight:900}.rps-choice b{font-size:28px;line-height:1}.rps-choice small{font-size:12px}
      .rps-history{display:flex;gap:6px;overflow-x:auto;padding:2px 0 5px;min-height:32px}.rps-history span{flex:0 0 auto;padding:5px 8px;border-radius:999px;background:rgba(29,36,51,.07);font-size:11px;font-weight:800}.rps-history .win{background:rgba(37,139,98,.14)}.rps-history .loss{background:rgba(223,75,56,.14)}.rps-history .draw{background:rgba(246,200,95,.2)}
      .rps-insight{padding:9px 11px;border-radius:12px;background:rgba(49,86,184,.08);font-size:12px;line-height:1.55}.rps-records{display:flex;flex-wrap:wrap;gap:7px 14px;padding:9px 11px;border-radius:12px;background:rgba(37,139,98,.08);font-size:12px}.rps-records strong{font-weight:900}.rps-actions{display:flex;flex-wrap:wrap;justify-content:center;gap:7px}
      @media(max-width:640px){.rps-arena{grid-template-columns:1fr 34px 1fr}.rps-hand-card{min-height:100px}.rps-choice-row{gap:6px}.rps-choice{min-height:72px}.rps-actions{position:sticky;bottom:8px;z-index:22;padding:8px;border-radius:14px;background:rgba(255,250,240,.95);box-shadow:0 8px 24px rgba(29,36,51,.14);backdrop-filter:blur(8px)}}
    `;
    document.head.appendChild(style);
  }

  function setup(surface) {
    if (!surface || surface.querySelector(".rps-runtime-root") || !surface.querySelector(".choice-row")) return false;
    addStyles();

    const prefs = readJson(PREFS_KEY, {});
    let difficulty = ["easy", "normal", "hard"].includes(prefs.difficulty) ? prefs.difficulty : "normal";
    let stats = loadStats();
    let lives = 3;
    let round = 0;
    let score = 0;
    let streak = 0;
    let bestRunStreak = 0;
    let started = false;
    let gameOver = false;
    let previousPlayer = null;
    let displayPlayer = null;
    let displayEnemy = null;
    let displayOutcome = null;
    let playerHistory = [];
    let recentResults = [];
    let transitions = freshTransitions();

    function freshTransitions() {
      return { rock: { rock: 0, paper: 0, scissors: 0 }, paper: { rock: 0, paper: 0, scissors: 0 }, scissors: { rock: 0, paper: 0, scissors: 0 } };
    }

    surface.innerHTML = "";
    surface.classList.add("rps-runtime-game");
    const root = document.createElement("div");
    root.className = "rps-runtime-root";

    const hud = document.createElement("div");
    hud.className = "mini-score";
    const hudValues = ["점수", "목숨", "라운드", "연승", "최고 연승"].map(function (label) {
      const box = document.createElement("span");
      const value = document.createElement("b");
      const small = document.createElement("small");
      small.textContent = label;
      box.append(value, small);
      hud.appendChild(box);
      return value;
    });

    const settings = document.createElement("div");
    settings.className = "rps-settings";
    const difficultyLabel = document.createElement("label");
    difficultyLabel.textContent = "상대 난이도";
    const difficultySelect = document.createElement("select");
    [["easy", "쉬움 · 거의 무작위"], ["normal", "보통 · 최근 패턴 일부 분석"], ["hard", "어려움 · 패턴 분석 비중 높음"]].forEach(function (entry) {
      const option = document.createElement("option"); option.value = entry[0]; option.textContent = entry[1]; difficultySelect.appendChild(option);
    });
    difficultyLabel.appendChild(difficultySelect);
    const rule = document.createElement("span");
    rule.className = "mini-note";
    rule.textContent = "3목숨 · 패배 시 1목숨 감소 · 비김은 연승 유지";
    settings.append(difficultyLabel, rule);

    const status = document.createElement("div");
    status.className = "rps-status";
    status.setAttribute("aria-live", "polite");
    const statusTitle = document.createElement("strong");
    const statusText = document.createElement("span");
    status.append(statusTitle, statusText);

    const arena = document.createElement("div");
    arena.className = "rps-arena";
    const playerCard = document.createElement("div"); playerCard.className = "rps-hand-card";
    const playerIcon = document.createElement("b"); const playerCaption = document.createElement("span"); playerCaption.textContent = "내 선택"; playerCard.append(playerIcon, playerCaption);
    const vs = document.createElement("div"); vs.className = "rps-vs"; vs.textContent = "VS";
    const enemyCard = document.createElement("div"); enemyCard.className = "rps-hand-card";
    const enemyIcon = document.createElement("b"); const enemyCaption = document.createElement("span"); enemyCaption.textContent = "상대 선택"; enemyCard.append(enemyIcon, enemyCaption);
    arena.append(playerCard, vs, enemyCard);

    const choiceRow = document.createElement("div");
    choiceRow.className = "rps-choice-row";
    [["scissors", "✌", "가위 · 1"], ["rock", "✊", "바위 · 2"], ["paper", "✋", "보 · 3"]].forEach(function (entry) {
      const button = document.createElement("button"); button.type = "button"; button.className = "button secondary rps-choice"; button.dataset.choice = entry[0];
      const icon = document.createElement("b"); icon.textContent = entry[1]; const text = document.createElement("small"); text.textContent = entry[2]; button.append(icon, text);
      button.addEventListener("click", function () { play(entry[0]); }); choiceRow.appendChild(button);
    });

    const history = document.createElement("div"); history.className = "rps-history"; history.setAttribute("aria-label", "최근 라운드 결과");
    const insight = document.createElement("div"); insight.className = "rps-insight";
    const recordsBox = document.createElement("div"); recordsBox.className = "rps-records";
    const actions = document.createElement("div"); actions.className = "rps-actions";
    const newRun = document.createElement("button"); newRun.type = "button"; newRun.className = "button primary"; newRun.textContent = "새 서바이벌";
    const resetPattern = document.createElement("button"); resetPattern.type = "button"; resetPattern.className = "button secondary"; resetPattern.textContent = "패턴 분석 초기화";
    actions.append(newRun, resetPattern);
    root.append(hud, settings, status, arena, choiceRow, history, insight, recordsBox, actions);
    surface.appendChild(root);

    function record() {
      stats.records[difficulty] = normalizeRecord(stats.records[difficulty]);
      return stats.records[difficulty];
    }

    function announce(title, text) {
      statusTitle.textContent = title;
      statusText.textContent = text;
      const result = document.getElementById("playResult");
      if (result) result.textContent = text;
    }

    function frequencyPrediction() {
      const recent = playerHistory.slice(-8);
      if (!recent.length) return null;
      const counts = { rock: 0, paper: 0, scissors: 0 };
      recent.forEach(function (choice) { counts[choice] += 1; });
      return choices.slice().sort(function (a, b) { return counts[b] - counts[a]; })[0];
    }

    function transitionPrediction() {
      if (!previousPlayer) return null;
      const row = transitions[previousPlayer];
      const total = row.rock + row.paper + row.scissors;
      if (!total) return null;
      return choices.slice().sort(function (a, b) { return row[b] - row[a]; })[0];
    }

    function predictPlayer() {
      const transition = transitionPrediction();
      const frequency = frequencyPrediction();
      if (transition && Math.random() < 0.62) return transition;
      return frequency;
    }

    function chooseEnemy() {
      const prediction = predictPlayer();
      if (prediction && Math.random() < levels[difficulty].adaptiveChance) return counters[prediction];
      return choices[Math.floor(Math.random() * choices.length)];
    }

    function resultFor(player, enemy) {
      if (player === enemy) return "draw";
      return beats[player] === enemy ? "win" : "loss";
    }

    function learn(player) {
      if (previousPlayer) transitions[previousPlayer][player] += 1;
      playerHistory.push(player);
      if (playerHistory.length > 40) playerHistory.shift();
      previousPlayer = player;
    }

    function patternMessage() {
      const recent = playerHistory.slice(-12);
      if (recent.length < 4) return "패턴 분석: 아직 데이터가 적습니다. 세 손을 섞어 선택해 보세요.";
      const counts = { rock: 0, paper: 0, scissors: 0 };
      recent.forEach(function (choice) { counts[choice] += 1; });
      const sorted = choices.slice().sort(function (a, b) { return counts[b] - counts[a]; });
      if (counts[sorted[0]] >= counts[sorted[1]] + 3) return `패턴 분석: 최근 ${labels[sorted[0]]} 선택이 ${counts[sorted[0]]}회로 치우쳤습니다.`;
      const transition = transitionPrediction();
      if (transition && previousPlayer) return `패턴 분석: ${labels[previousPlayer]} 다음에 ${labels[transition]}을 내는 경향이 기록돼 있습니다.`;
      return "패턴 분석: 최근 선택 비율은 비교적 고릅니다. 같은 순서 반복도 확인해 보세요.";
    }

    function updateHistory() {
      history.innerHTML = "";
      if (!recentResults.length) {
        const chip = document.createElement("span"); chip.textContent = "최근 결과 없음"; history.appendChild(chip); return;
      }
      recentResults.slice(-8).forEach(function (item) {
        const chip = document.createElement("span"); chip.className = item.result;
        chip.textContent = `${item.result === "win" ? "승" : item.result === "loss" ? "패" : "무"} ${icons[item.player]}:${icons[item.enemy]}`;
        history.appendChild(chip);
      });
    }

    function saveProgress() {
      const current = record();
      current.bestScore = Math.max(current.bestScore, score);
      current.bestStreak = Math.max(current.bestStreak, streak, bestRunStreak);
      current.bestRound = Math.max(current.bestRound, round);
      writeJson(STATS_KEY, stats);
    }

    function sync() {
      const current = record();
      const total = current.wins + current.losses + current.draws;
      const winRate = total ? Math.round(current.wins / total * 100) : 0;
      hudValues[0].textContent = String(score);
      hudValues[1].textContent = "♥".repeat(Math.max(0, lives)) || "0";
      hudValues[2].textContent = String(round);
      hudValues[3].textContent = String(streak);
      hudValues[4].textContent = String(current.bestStreak || "-");
      playerIcon.textContent = displayPlayer ? icons[displayPlayer] : "?";
      enemyIcon.textContent = displayEnemy ? icons[displayEnemy] : "?";
      Array.from(choiceRow.querySelectorAll("button")).forEach(function (button) { button.disabled = gameOver; });
      difficultySelect.value = difficulty;
      insight.textContent = patternMessage();
      recordsBox.innerHTML = `<strong>${levels[difficulty].label}</strong><span>도전 ${current.runs}회</span><span>승률 ${winRate}%</span><span>최고 점수 ${current.bestScore}</span><span>최고 연승 ${current.bestStreak}</span><span>최고 라운드 ${current.bestRound}</span>`;
      updateHistory();
    }

    function finish() {
      gameOver = true;
      saveProgress();
      announce("서바이벌 종료", `${round}라운드에서 종료했습니다. 최종 ${score}점, 최고 연승 ${bestRunStreak}입니다.`);
      sync();
    }

    function play(player) {
      if (gameOver) return;
      if (!started) { started = true; record().runs += 1; }

      // The opponent decides before the current player choice is added to any history.
      const enemy = chooseEnemy();
      const outcome = resultFor(player, enemy);
      round += 1;
      displayPlayer = player;
      displayEnemy = enemy;
      displayOutcome = outcome;
      learn(player);
      recentResults.push({ result: outcome, player: player, enemy: enemy });
      if (recentResults.length > 12) recentResults.shift();

      const current = record();
      if (outcome === "win") {
        streak += 1;
        bestRunStreak = Math.max(bestRunStreak, streak);
        const multiplier = Math.min(4, 1 + Math.floor((streak - 1) / 3));
        const gained = 10 * multiplier;
        score += gained;
        current.wins += 1;
        announce(`승리 · 연승 ${streak}`, `상대는 ${labels[enemy]}. ${gained}점을 얻었습니다${multiplier > 1 ? ` (x${multiplier})` : ""}.`);
      } else if (outcome === "draw") {
        current.draws += 1;
        score += 2;
        announce("무승부", `상대도 ${labels[enemy]}입니다. 연승 ${streak}은 유지되고 2점을 얻습니다.`);
      } else {
        current.losses += 1;
        lives -= 1;
        streak = 0;
        announce("패배", `상대는 ${labels[enemy]}. 목숨이 ${Math.max(0, lives)}개 남았습니다.`);
      }
      saveProgress();
      sync();
      if (lives <= 0) finish();
    }

    function resetRun(message, clearLearning) {
      lives = 3; round = 0; score = 0; streak = 0; bestRunStreak = 0; started = false; gameOver = false;
      displayPlayer = null; displayEnemy = null; displayOutcome = null; recentResults = [];
      if (clearLearning) { previousPlayer = null; playerHistory = []; transitions = freshTransitions(); }
      announce("서바이벌 준비", message || `${levels[difficulty].label} 상대입니다. 가위·바위·보 중 하나를 선택하세요.`);
      sync();
    }

    function onKey(event) {
      if (!root.isConnected || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.target && /^(SELECT|INPUT|TEXTAREA)$/.test(event.target.tagName)) return;
      const map = { "1": "scissors", "2": "rock", "3": "paper" };
      if (!(event.key in map) && event.key.toLowerCase() !== "n") return;
      event.preventDefault();
      if (event.key.toLowerCase() === "n") resetRun("키보드로 새 서바이벌을 시작했습니다.", false);
      else play(map[event.key]);
    }

    difficultySelect.addEventListener("change", function () {
      difficulty = ["easy", "normal", "hard"].includes(difficultySelect.value) ? difficultySelect.value : "normal";
      writeJson(PREFS_KEY, { difficulty: difficulty });
      resetRun(`${levels[difficulty].label} 상대와 새 서바이벌을 준비했습니다.`, true);
    });
    newRun.addEventListener("click", function () { resetRun("새 서바이벌을 준비했습니다.", false); });
    resetPattern.addEventListener("click", function () { resetRun("상대의 패턴 분석 데이터를 초기화했습니다.", true); });
    document.addEventListener("keydown", onKey);

    const cleanupObserver = new MutationObserver(function () {
      if (root.isConnected) return;
      document.removeEventListener("keydown", onKey);
      surface.classList.remove("rps-runtime-game");
      cleanupObserver.disconnect();
    });
    cleanupObserver.observe(document.documentElement, { childList: true, subtree: true });

    resetRun();
    return true;
  }

  function scan() {
    document.querySelectorAll("#playSurface, .play-surface").forEach(function (surface) {
      if (surface.querySelector(".choice-row")) setup(surface);
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