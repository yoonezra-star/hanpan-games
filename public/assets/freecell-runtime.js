(function () {
  const saveKey = "hanpan-freecell-save-freecell-classic";
  const streakKey = "hanpan-freecell-streak";
  const metricsKey = "hanpan-freecell-metrics-v2";
  const enhancedBoards = new WeakSet();
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

  function readStreak() {
    try {
      const value = Number(localStorage.getItem(streakKey));
      return Number.isFinite(value) && value > 0 ? value : 0;
    } catch (error) {
      return 0;
    }
  }

  function resetStreak() {
    try { localStorage.setItem(streakKey, "0"); } catch (error) { /* Local records are optional. */ }
  }

  function parseCard(element) {
    if (!element || !element.dataset.cardId) return null;
    const parts = element.dataset.cardId.split("-");
    const rank = Number(parts[1]);
    if (!parts[0] || !Number.isInteger(rank)) return null;
    return { suit: parts[0], rank: rank };
  }

  function addStyle() {
    if (styleAdded || document.getElementById("freecell-runtime-style")) return;
    styleAdded = true;
    const style = document.createElement("style");
    style.id = "freecell-runtime-style";
    style.textContent = `
      .freecell-runtime-panel {
        display: grid;
        grid-template-columns: minmax(0, 1.5fr) minmax(220px, 1fr);
        gap: 10px;
        margin: 10px 0;
      }
      .freecell-runtime-summary,
      .freecell-deal-tools {
        border: 1px solid rgba(29, 36, 51, 0.14);
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.58);
      }
      .freecell-runtime-summary {
        display: flex;
        flex-wrap: wrap;
        gap: 8px 14px;
        align-items: center;
        padding: 10px 12px;
        font-size: 13px;
        line-height: 1.45;
      }
      .freecell-runtime-summary strong { font-weight: 800; }
      .freecell-runtime-summary span { opacity: 0.8; }
      .freecell-deal-tools {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 7px;
        padding: 8px;
      }
      .freecell-deal-tools label {
        display: flex;
        flex: 1 1 132px;
        align-items: center;
        gap: 6px;
        min-width: 0;
        font-size: 12px;
        font-weight: 700;
      }
      .freecell-deal-tools input {
        min-width: 0;
        width: 100%;
        height: 38px;
        border: 1px solid rgba(29, 36, 51, 0.2);
        border-radius: 9px;
        padding: 0 9px;
        background: #fff;
        color: inherit;
        font: inherit;
      }
      .freecell-deal-tools .button { min-height: 38px; padding: 8px 10px; }
      .freecell-game .freecell-board {
        overscroll-behavior: contain;
        -webkit-overflow-scrolling: touch;
      }
      .freecell-game .solitaire-card,
      .freecell-game .solitaire-empty-slot { touch-action: manipulation; }
      @media (max-width: 760px) {
        .freecell-runtime-panel { grid-template-columns: 1fr; }
      }
      @media (pointer: coarse) {
        .freecell-game .freecell-actions {
          position: sticky;
          bottom: 8px;
          z-index: 24;
          padding: 8px;
          border-radius: 14px;
          background: rgba(255, 250, 240, 0.95);
          box-shadow: 0 8px 24px rgba(29, 36, 51, 0.16);
          backdrop-filter: blur(8px);
        }
        .freecell-game .freecell-actions .button { min-height: 44px; }
        .freecell-deal-tools .button { min-height: 42px; }
      }
    `;
    document.head.appendChild(style);
  }

  function readMetrics() {
    const saved = readJson(metricsKey, {});
    const activeDeal = Number(saved.activeDeal);
    return {
      attempts: Math.max(0, Number(saved.attempts) || 0),
      wins: Math.max(0, Number(saved.wins) || 0),
      bestMoves: Number(saved.bestMoves) > 0 ? Number(saved.bestMoves) : null,
      bestStreak: Math.max(0, Number(saved.bestStreak) || 0),
      activeDeal: Number.isInteger(activeDeal) && activeDeal > 0 ? activeDeal : null
    };
  }

  function storeMetrics(metrics) {
    writeJson(metricsKey, metrics);
  }

  function makeDealState(dealNumber) {
    const suits = ["S", "H", "D", "C"];
    const deck = [];
    suits.forEach(function (suit) {
      for (let rank = 1; rank <= 13; rank += 1) deck.push({ id: `${suit}-${rank}`, suit: suit, rank: rank });
    });
    let state = dealNumber >>> 0;
    function random() {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
      return state / 4294967296;
    }
    for (let index = deck.length - 1; index > 0; index -= 1) {
      const target = Math.floor(random() * (index + 1));
      const temporary = deck[index];
      deck[index] = deck[target];
      deck[target] = temporary;
    }
    const columns = Array.from({ length: 8 }, function () { return []; });
    deck.forEach(function (card, index) { columns[index % 8].push(card); });
    return {
      version: 1,
      columns: columns,
      freeCells: Array(4).fill(null),
      foundations: { S: [], H: [], D: [], C: [] },
      moves: 0,
      seconds: 0,
      started: false,
      dealNumber: dealNumber
    };
  }

  function setupSurface(surface) {
    if (!surface || !surface.classList.contains("freecell-game")) return false;
    const board = surface.querySelector(".freecell-board");
    const settings = surface.querySelector(".freecell-settings");
    const capacity = surface.querySelector(".freecell-capacity");
    const status = surface.querySelector(".freecell-status");
    const actions = surface.querySelector(".freecell-actions");
    const hud = surface.querySelector(".mini-score");
    if (!board || !settings || !capacity || !status || !actions || !hud || enhancedBoards.has(board)) return false;

    enhancedBoards.add(board);
    addStyle();
    surface.classList.add("freecell-runtime-enhanced");
    board.tabIndex = 0;
    board.setAttribute("role", "region");
    board.setAttribute("aria-label", "프리셀 카드판. 카드를 선택한 뒤 목적지를 누릅니다. H는 힌트, A는 안전 자동 정리, Ctrl 또는 Command와 Z는 되돌리기입니다.");

    const stats = Array.from(hud.querySelectorAll("b"));
    const moveValue = stats[0] || null;
    const foundationValue = stats[2] || null;

    const panel = document.createElement("div");
    panel.className = "freecell-runtime-panel";
    const summary = document.createElement("div");
    summary.className = "freecell-runtime-summary";
    summary.setAttribute("role", "status");
    summary.setAttribute("aria-live", "polite");

    const tools = document.createElement("form");
    tools.className = "freecell-deal-tools";
    tools.setAttribute("aria-label", "프리셀 게임 번호 도구");
    const label = document.createElement("label");
    label.innerHTML = "게임 번호 <input type=\"number\" min=\"1\" max=\"999999\" step=\"1\" inputmode=\"numeric\" aria-label=\"열 프리셀 게임 번호\">";
    const dealInput = label.querySelector("input");
    const openDeal = document.createElement("button");
    openDeal.type = "submit";
    openDeal.className = "button secondary";
    openDeal.textContent = "번호로 열기";
    const retryDeal = document.createElement("button");
    retryDeal.type = "button";
    retryDeal.className = "button secondary";
    retryDeal.textContent = "같은 번호 다시";
    const copyDeal = document.createElement("button");
    copyDeal.type = "button";
    copyDeal.className = "button secondary";
    copyDeal.textContent = "번호 복사";
    tools.append(label, openDeal, retryDeal, copyDeal);
    panel.append(summary, tools);
    settings.parentNode.insertBefore(panel, board);

    const actionButtons = Array.from(actions.querySelectorAll("button"));
    const newGame = actionButtons.find(function (item) { return item.textContent.trim() === "새 게임"; });
    const undo = actionButtons.find(function (item) { return item.textContent.trim().startsWith("되돌리기"); });
    const hint = actionButtons.find(function (item) { return item.textContent.trim().startsWith("힌트"); });
    const autoFinish = actionButtons.find(function (item) { return item.textContent.trim().startsWith("자동 정리"); });

    function currentDealNumber() {
      const match = capacity.textContent.match(/게임\s*#(\d+)/);
      if (match) return Number(match[1]);
      const saved = readJson(saveKey, null);
      return saved && Number(saved.dealNumber) > 0 ? Number(saved.dealNumber) : null;
    }

    function foundationCount() {
      if (foundationValue) {
        const match = String(foundationValue.textContent).match(/(\d+)\s*\/\s*52/);
        if (match) return Number(match[1]);
      }
      let total = 0;
      surface.querySelectorAll(".freecell-foundation-pile").forEach(function (pile) {
        const card = parseCard(pile.querySelector(".solitaire-card[data-card-id]"));
        if (card) total += card.rank;
      });
      return total;
    }

    function isStarted() {
      if (Number(moveValue && moveValue.textContent) > 0) return true;
      const saved = readJson(saveKey, null);
      const deal = currentDealNumber();
      return Boolean(saved && saved.started && Number(saved.dealNumber) === deal);
    }

    function markProgress() {
      const deal = currentDealNumber();
      if (!Number.isInteger(deal) || deal < 1) return;
      const complete = board.classList.contains("is-complete") || foundationCount() >= 52;
      const metrics = readMetrics();
      let changed = false;

      if (!complete) delete board.dataset.freecellMetricsComplete;

      if (!complete && isStarted() && metrics.activeDeal !== deal) {
        metrics.attempts += 1;
        metrics.activeDeal = deal;
        changed = true;
      }

      if (complete && board.dataset.freecellMetricsComplete !== "true") {
        board.dataset.freecellMetricsComplete = "true";
        if (metrics.activeDeal !== deal) {
          metrics.attempts += 1;
          metrics.activeDeal = deal;
        }
        metrics.wins += 1;
        const moves = Number(moveValue && moveValue.textContent);
        if (Number.isFinite(moves) && moves > 0) metrics.bestMoves = metrics.bestMoves === null ? moves : Math.min(metrics.bestMoves, moves);
        metrics.bestStreak = Math.max(metrics.bestStreak, readStreak());
        metrics.activeDeal = null;
        changed = true;
      }

      if (changed) storeMetrics(metrics);
    }

    function renderSummary() {
      const metrics = readMetrics();
      const winRate = metrics.attempts > 0 ? Math.round((metrics.wins / metrics.attempts) * 100) : null;
      const currentStreak = readStreak();
      const saved = readJson(saveKey, null);
      const deal = currentDealNumber();
      const saveLabel = saved && Number(saved.dealNumber) === deal && saved.started ? "이어하기 저장됨" : "새 판";
      summary.innerHTML = `<strong>완주 ${metrics.wins}/${metrics.attempts}</strong><span>완주율 ${winRate === null ? "-" : `${winRate}%`}</span><span>최소 이동 ${metrics.bestMoves === null ? "-" : `${metrics.bestMoves}회`}</span><span>연승 ${currentStreak} · 최고 ${metrics.bestStreak}</span><span>${saveLabel}</span>`;
    }

    function sync() {
      const deal = currentDealNumber();
      if (Number.isInteger(deal) && document.activeElement !== dealInput) dealInput.value = String(deal);
      retryDeal.disabled = !Number.isInteger(deal);
      copyDeal.disabled = !Number.isInteger(deal);
      markProgress();
      renderSummary();
    }

    function abandonCurrentIfNeeded() {
      markProgress();
      const deal = currentDealNumber();
      const complete = board.classList.contains("is-complete") || foundationCount() >= 52;
      if (isStarted() && !complete) resetStreak();
      const metrics = readMetrics();
      if (!complete && metrics.activeDeal === deal) {
        metrics.activeDeal = null;
        storeMetrics(metrics);
      }
    }

    function loadDealNumber(number) {
      const deal = Math.trunc(Number(number));
      if (!Number.isInteger(deal) || deal < 1 || deal > 999999) {
        dealInput.focus();
        dealInput.setCustomValidity("게임 번호는 1부터 999999 사이의 숫자를 입력해 주세요.");
        dealInput.reportValidity();
        return;
      }
      dealInput.setCustomValidity("");
      abandonCurrentIfNeeded();
      const state = makeDealState(deal);
      if (!writeJson(saveKey, state)) {
        const result = document.getElementById("playResult");
        if (result) result.textContent = "브라우저 저장소를 사용할 수 없어 게임 번호를 열지 못했습니다.";
        return;
      }
      window.location.reload();
    }

    tools.addEventListener("submit", function (event) {
      event.preventDefault();
      loadDealNumber(dealInput.value);
    });
    dealInput.addEventListener("input", function () { dealInput.setCustomValidity(""); });
    retryDeal.addEventListener("click", function () {
      const deal = currentDealNumber();
      if (deal) loadDealNumber(deal);
    });
    copyDeal.addEventListener("click", async function () {
      const deal = currentDealNumber();
      if (!deal) return;
      const text = String(deal);
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) await navigator.clipboard.writeText(text);
        else throw new Error("clipboard unavailable");
        copyDeal.textContent = "복사됨";
        window.setTimeout(function () { copyDeal.textContent = "번호 복사"; }, 1200);
      } catch (error) {
        dealInput.value = text;
        dealInput.focus();
        dealInput.select();
        const result = document.getElementById("playResult");
        if (result) result.textContent = `게임 번호 #${deal}을 선택했습니다. 직접 복사해 주세요.`;
      }
    });

    function onKeyDown(event) {
      if (!board.isConnected || !surface.classList.contains("freecell-game")) return;
      if (event.target && /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName)) return;
      if (!event.ctrlKey && !event.metaKey && !event.altKey && event.key.toLowerCase() === "a") {
        if (autoFinish && !autoFinish.disabled) {
          event.preventDefault();
          autoFinish.click();
        }
      }
    }
    document.addEventListener("keydown", onKeyDown);

    if (newGame) newGame.addEventListener("click", abandonCurrentIfNeeded, true);
    if (undo) undo.title = "최근 이동 되돌리기 · Ctrl/Command+Z";
    if (hint) hint.title = "가능한 이동 힌트 · H";
    if (autoFinish) autoFinish.title = "안전한 기초칸 이동 자동 처리 · A";

    const observer = new MutationObserver(function () {
      window.requestAnimationFrame(sync);
    });
    observer.observe(board, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "aria-pressed"] });
    observer.observe(status, { childList: true, subtree: true });
    observer.observe(capacity, { childList: true, subtree: true });
    observer.observe(hud, { childList: true, subtree: true, characterData: true });

    const cleanupObserver = new MutationObserver(function () {
      if (board.isConnected && surface.classList.contains("freecell-game")) return;
      observer.disconnect();
      cleanupObserver.disconnect();
      document.removeEventListener("keydown", onKeyDown);
    });
    cleanupObserver.observe(document.documentElement, { childList: true, subtree: true });

    sync();
    return true;
  }

  function scan() {
    document.querySelectorAll("#playSurface, .play-surface").forEach(function (surface) {
      setupSurface(surface);
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
