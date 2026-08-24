(function () {
  const preferenceKey = "hanpan-solitaire-draw-preference";
  const metricsKey = "hanpan-solitaire-metrics-v1";
  const enhancedBoards = new WeakSet();
  let styleAdded = false;

  function readJson(key, fallback) {
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || "null");
      return parsed && typeof parsed === "object" ? parsed : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (error) { /* Local records are optional. */ }
  }

  function readPreference() {
    try { return Number(localStorage.getItem(preferenceKey)) === 3 ? 3 : 1; } catch (error) { return 1; }
  }

  function writePreference(value) {
    try { localStorage.setItem(preferenceKey, String(value === 3 ? 3 : 1)); } catch (error) { /* Optional preference. */ }
  }

  function parseCard(element) {
    if (!element || !element.dataset.cardId) return null;
    const parts = element.dataset.cardId.split("-");
    const rank = Number(parts[1]);
    if (!parts[0] || !Number.isInteger(rank)) return null;
    return { suit: parts[0], rank: rank };
  }

  function addStyle() {
    if (styleAdded || document.getElementById("solitaire-runtime-style")) return;
    styleAdded = true;
    const style = document.createElement("style");
    style.id = "solitaire-runtime-style";
    style.textContent = `
      .solitaire-runtime-summary {
        display: flex;
        flex-wrap: wrap;
        gap: 8px 14px;
        align-items: center;
        margin: 10px 0 4px;
        padding: 10px 12px;
        border: 1px solid rgba(29, 36, 51, 0.14);
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.56);
        font-size: 13px;
        line-height: 1.45;
      }
      .solitaire-runtime-summary strong { font-weight: 800; }
      .solitaire-runtime-summary span { opacity: 0.78; }
      .solitaire-game .solitaire-board {
        overscroll-behavior: contain;
        -webkit-overflow-scrolling: touch;
      }
      .solitaire-game .solitaire-card,
      .solitaire-game .solitaire-empty-slot,
      .solitaire-game .solitaire-stock-button { touch-action: manipulation; }
      .solitaire-game .solitaire-safe-auto[aria-busy="true"] { opacity: 0.72; }
      @media (pointer: coarse) {
        .solitaire-game .solitaire-actions {
          position: sticky;
          bottom: 8px;
          z-index: 24;
          padding: 8px;
          border-radius: 14px;
          background: rgba(255, 250, 240, 0.94);
          box-shadow: 0 8px 24px rgba(29, 36, 51, 0.16);
          backdrop-filter: blur(8px);
        }
        .solitaire-game .solitaire-actions .button { min-height: 44px; }
      }
    `;
    document.head.appendChild(style);
  }

  function setupSurface(surface) {
    if (!surface || !surface.classList.contains("solitaire-game")) return false;
    const board = surface.querySelector(".solitaire-board");
    const actions = surface.querySelector(".solitaire-actions");
    const hud = surface.querySelector(".mini-score.game-score-hud, .mini-score");
    const status = surface.querySelector(".solitaire-status");
    if (!board || !actions || !hud || !status || enhancedBoards.has(board)) return false;

    enhancedBoards.add(board);
    addStyle();
    surface.classList.add("solitaire-runtime-enhanced");
    board.tabIndex = 0;
    board.setAttribute("role", "region");
    board.setAttribute("aria-label", "클론다이크 솔리테어 카드판. 카드를 선택한 뒤 목적지를 누르며, H는 힌트, Ctrl 또는 Command와 Z는 되돌리기입니다.");

    const hudItems = Array.from(hud.children);
    const moveValue = hudItems[0] && hudItems[0].querySelector("b");
    const scoreValue = hudItems[2] && hudItems[2].querySelector("b");

    const progressBox = document.createElement("span");
    progressBox.dataset.solitaireProgress = "";
    progressBox.innerHTML = "<b>0/52</b><small>정리</small>";
    const hiddenBox = document.createElement("span");
    hiddenBox.dataset.solitaireHidden = "";
    hiddenBox.innerHTML = "<b>21</b><small>숨은 카드</small>";
    hud.append(progressBox, hiddenBox);
    const progressValue = progressBox.querySelector("b");
    const hiddenValue = hiddenBox.querySelector("b");

    const summary = document.createElement("div");
    summary.className = "solitaire-runtime-summary";
    summary.setAttribute("role", "status");
    summary.setAttribute("aria-live", "polite");
    actions.parentNode.insertBefore(summary, actions);

    const buttons = Array.from(actions.querySelectorAll("button"));
    const newGame = buttons.find(function (item) { return item.textContent.trim() === "새 게임"; });
    const undo = buttons.find(function (item) { return item.textContent.trim().startsWith("되돌리기"); });
    const hint = buttons.find(function (item) { return item.textContent.trim().startsWith("힌트"); });
    const sound = buttons.find(function (item) { return item.classList.contains("sound-toggle"); });
    const safeAuto = document.createElement("button");
    safeAuto.type = "button";
    safeAuto.className = "button secondary solitaire-safe-auto";
    safeAuto.textContent = "안전 자동 정리";
    safeAuto.title = "확실히 안전한 기초 더미 이동만 자동으로 처리합니다.";
    safeAuto.setAttribute("aria-busy", "false");
    actions.insertBefore(safeAuto, sound || null);

    const drawButtons = Array.from(surface.querySelectorAll(".solitaire-segment-button"));
    const drawOne = drawButtons.find(function (item) { return item.textContent.trim().includes("한 장"); });
    const drawThree = drawButtons.find(function (item) { return item.textContent.trim().includes("세 장"); });

    function foundationRanks() {
      const ranks = { S: 0, H: 0, D: 0, C: 0 };
      surface.querySelectorAll(".solitaire-foundation-pile").forEach(function (pile) {
        const card = parseCard(pile.querySelector(".solitaire-card[data-card-id]"));
        if (card && card.suit in ranks) ranks[card.suit] = card.rank;
      });
      return ranks;
    }

    function foundationCount() {
      const ranks = foundationRanks();
      return ranks.S + ranks.H + ranks.D + ranks.C;
    }

    function hiddenCount() {
      return surface.querySelectorAll(".solitaire-tableau .solitaire-card.face-down").length;
    }

    function readMetrics() {
      const saved = readJson(metricsKey, {});
      return {
        completions: Math.max(0, Number(saved.completions) || 0),
        bestMoves: Number(saved.bestMoves) > 0 ? Number(saved.bestMoves) : null,
        bestScore: Number(saved.bestScore) > 0 ? Number(saved.bestScore) : null
      };
    }

    function recordCompletion() {
      if (!board.classList.contains("is-complete")) {
        delete board.dataset.completionRecorded;
        return;
      }
      if (board.dataset.completionRecorded === "true") return;
      board.dataset.completionRecorded = "true";
      const metrics = readMetrics();
      const moves = Number(moveValue && moveValue.textContent);
      const score = Number(scoreValue && scoreValue.textContent);
      metrics.completions += 1;
      if (Number.isFinite(moves) && moves > 0) metrics.bestMoves = metrics.bestMoves === null ? moves : Math.min(metrics.bestMoves, moves);
      if (Number.isFinite(score) && score > 0) metrics.bestScore = metrics.bestScore === null ? score : Math.max(metrics.bestScore, score);
      writeJson(metricsKey, metrics);
    }

    function renderSummary() {
      const metrics = readMetrics();
      summary.innerHTML = `<strong>완주 ${metrics.completions}회</strong><span>최소 이동 ${metrics.bestMoves === null ? "-" : `${metrics.bestMoves}회`}</span><span>최고 완주 점수 ${metrics.bestScore === null ? "-" : `${metrics.bestScore}점`}</span>`;
    }

    function sync() {
      const completed = foundationCount();
      const hidden = hiddenCount();
      progressValue.textContent = `${completed}/52`;
      hiddenValue.textContent = String(hidden);
      safeAuto.disabled = completed >= 52 || Boolean(surface.querySelector(".solitaire-safe-auto[aria-busy=\"true\"]"));
      recordCompletion();
      renderSummary();
    }

    function safeFoundationCandidate() {
      const ranks = foundationRanks();
      const candidates = [];
      const waste = surface.querySelector(".solitaire-waste-pile .solitaire-card:not(:disabled)[data-card-id]");
      if (waste) candidates.push(waste);
      surface.querySelectorAll(".solitaire-tableau-pile").forEach(function (pile) {
        const cards = Array.from(pile.querySelectorAll(".solitaire-card.face-up:not(:disabled)[data-card-id]"));
        if (cards.length) candidates.push(cards[cards.length - 1]);
      });
      return candidates.find(function (element) {
        const card = parseCard(element);
        if (!card || !(card.suit in ranks) || card.rank !== ranks[card.suit] + 1) return false;
        if (card.rank <= 2) return true;
        const opposite = card.suit === "H" || card.suit === "D" ? ["S", "C"] : ["H", "D"];
        return opposite.every(function (suit) { return ranks[suit] >= card.rank - 1; });
      }) || null;
    }

    function wait(milliseconds) {
      return new Promise(function (resolve) { window.setTimeout(resolve, milliseconds); });
    }

    async function moveCardToFoundation(element) {
      const key = element && element.dataset.sourceKey;
      if (!key) return false;
      element.click();
      await wait(0);
      const current = surface.querySelector(`[data-source-key="${key}"]`);
      if (!current) return false;
      current.click();
      await wait(38);
      return true;
    }

    async function autoMoveSafeCards() {
      if (safeAuto.getAttribute("aria-busy") === "true") return;
      safeAuto.setAttribute("aria-busy", "true");
      safeAuto.disabled = true;
      const result = document.getElementById("playResult");
      let moved = 0;
      try {
        for (let index = 0; index < 52; index += 1) {
          const candidate = safeFoundationCandidate();
          if (!candidate) break;
          const before = foundationCount();
          if (!await moveCardToFoundation(candidate)) break;
          const after = foundationCount();
          if (after <= before) break;
          moved += after - before;
        }
      } finally {
        safeAuto.setAttribute("aria-busy", "false");
        sync();
      }
      if (result) result.textContent = moved
        ? `확실히 안전한 카드 ${moved}장을 기초 더미로 자동 정리했습니다.`
        : "지금은 안전하게 자동 정리할 카드가 없습니다.";
    }

    function saveDrawPreference(event) {
      const button = event.currentTarget;
      writePreference(button === drawThree ? 3 : 1);
    }

    if (drawOne) drawOne.addEventListener("click", saveDrawPreference);
    if (drawThree) drawThree.addEventListener("click", saveDrawPreference);
    if (readPreference() === 3 && drawThree && !drawThree.classList.contains("active")) {
      drawThree.click();
    }

    safeAuto.addEventListener("click", autoMoveSafeCards);

    function onKeyDown(event) {
      if (!board.isConnected || !surface.classList.contains("solitaire-game")) return;
      if (event.target && /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName)) return;
      const key = event.key.toLowerCase();
      if ((event.ctrlKey || event.metaKey) && key === "z") {
        event.preventDefault();
        if (undo && !undo.disabled) undo.click();
        return;
      }
      if (!event.ctrlKey && !event.metaKey && !event.altKey && key === "h") {
        event.preventDefault();
        if (hint && !hint.disabled) hint.click();
        return;
      }
      if (event.key === "Escape") {
        const selected = surface.querySelector('.solitaire-card[aria-pressed="true"]');
        if (selected) {
          event.preventDefault();
          selected.click();
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);
    const observer = new MutationObserver(function () {
      window.requestAnimationFrame(sync);
    });
    observer.observe(board, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "aria-pressed"] });
    observer.observe(status, { childList: true, subtree: true });

    const cleanupObserver = new MutationObserver(function () {
      if (board.isConnected && surface.classList.contains("solitaire-game")) return;
      observer.disconnect();
      cleanupObserver.disconnect();
      document.removeEventListener("keydown", onKeyDown);
    });
    cleanupObserver.observe(document.documentElement, { childList: true, subtree: true });

    if (newGame) newGame.addEventListener("click", function () { window.requestAnimationFrame(sync); });
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
