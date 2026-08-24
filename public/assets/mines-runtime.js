(function () {
  const runtime = {
    manualPaused: false,
    visibilityPaused: false,
    get paused() {
      return this.manualPaused || this.visibilityPaused;
    }
  };

  const nativeSetInterval = window.setInterval.bind(window);
  window.__hanpanMinesRuntime = runtime;
  window.setInterval = function (handler, delay) {
    const args = Array.prototype.slice.call(arguments, 2);
    if (typeof handler !== "function") return nativeSetInterval(handler, delay, ...args);
    return nativeSetInterval(function () {
      if (runtime.paused && document.querySelector('#playSurface[data-game-id="mines"]')) return;
      return handler.apply(this, arguments);
    }, delay, ...args);
  };

  function injectStyles() {
    if (document.getElementById("minesEnhancementStyles")) return;
    const style = document.createElement("style");
    style.id = "minesEnhancementStyles";
    style.textContent = `
      .mines-enhancement-actions { display:flex; flex-wrap:wrap; gap:8px; margin-top:10px; }
      .mines-enhancement-actions .button { min-height:42px; box-shadow:3px 3px 0 var(--ink); }
      .mines-records { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:8px; width:100%; margin:10px 0 4px; }
      .mines-records span { display:grid; gap:2px; padding:9px 10px; background:#f3efe5; border:1px solid var(--line); border-radius:8px; text-align:center; }
      .mines-records small { color:var(--muted); font-size:11px; font-weight:900; }
      .mines-records strong { font-size:14px; }
      .mines-board-scroll { position:relative; }
      .mines-pause-overlay { position:absolute; inset:0; z-index:4; display:none; place-items:center; min-height:180px; padding:24px; background:rgba(29,36,51,.86); color:#fff; text-align:center; font-weight:900; border-radius:8px; }
      .is-mines-paused .mines-pause-overlay { display:grid; }
      .is-mines-paused .mines-board { filter:blur(2px); }
      .mines-cell { -webkit-user-select:none; user-select:none; -webkit-touch-callout:none; touch-action:manipulation; }
      #play-area:fullscreen { overflow:auto; padding:clamp(14px,3vw,28px); background:var(--paper); }
      #play-area:fullscreen .play-surface { max-width:1180px; margin:0 auto; }
      #play-area.mines-focus-mode { position:fixed; inset:10px; z-index:1000; overflow:auto; padding:18px; background:var(--paper); border:2px solid var(--ink); border-radius:10px; box-shadow:0 20px 70px rgba(0,0,0,.35); }
      body.has-mines-focus { overflow:hidden; }
      @media (max-width:640px) {
        .mines-enhancement-actions { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); }
        .mines-records { gap:5px; }
        .mines-records span { padding:7px 4px; }
        .mines-records strong { font-size:12px; }
      }
    `;
    document.head.appendChild(style);
  }

  function formatTime(value) {
    const seconds = Number(value);
    if (!Number.isFinite(seconds) || seconds < 0) return "기록 없음";
    const minutes = Math.floor(seconds / 60);
    const rest = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
  }

  function readBest(id) {
    try {
      const raw = localStorage.getItem(`hanpan-arcade-mines-${id}`);
      return raw === null ? NaN : Number(raw);
    } catch (_) {
      return NaN;
    }
  }

  function setup() {
    const stage = document.getElementById("play-area");
    const surface = document.querySelector('#playSurface[data-game-id="mines"]');
    const board = surface && surface.querySelector(".mines-board");
    const boardScroll = surface && surface.querySelector(".mines-board-scroll");
    const actions = surface && surface.querySelector(".mines-actions");
    if (!stage || !surface || !board || !boardScroll || !actions) return false;
    if (stage.dataset.minesEnhanced === "true") return true;
    stage.dataset.minesEnhanced = "true";
    injectStyles();

    const extraActions = document.createElement("div");
    extraActions.className = "mines-enhancement-actions";

    const pauseButton = document.createElement("button");
    pauseButton.type = "button";
    pauseButton.className = "button secondary";
    pauseButton.textContent = "일시정지";
    pauseButton.setAttribute("aria-pressed", "false");

    const fullscreenButton = document.createElement("button");
    fullscreenButton.type = "button";
    fullscreenButton.className = "button secondary";
    fullscreenButton.textContent = "전체화면";
    fullscreenButton.setAttribute("aria-pressed", "false");

    extraActions.append(pauseButton, fullscreenButton);
    actions.insertAdjacentElement("afterend", extraActions);

    const records = document.createElement("div");
    records.className = "mines-records";
    records.setAttribute("aria-label", "난이도별 최고 기록");
    records.innerHTML = [
      ["beginner", "초급 최고"],
      ["intermediate", "중급 최고"],
      ["expert", "고급 최고"]
    ].map(function (item) {
      return `<span data-record="${item[0]}"><small>${item[1]}</small><strong>기록 없음</strong></span>`;
    }).join("");
    extraActions.insertAdjacentElement("afterend", records);

    const overlay = document.createElement("div");
    overlay.className = "mines-pause-overlay";
    overlay.setAttribute("role", "status");
    overlay.innerHTML = "일시정지됨<br><small>계속하려면 일시정지 버튼을 다시 누르세요.</small>";
    boardScroll.appendChild(overlay);

    function syncRecords() {
      ["beginner", "intermediate", "expert"].forEach(function (id) {
        const value = records.querySelector(`[data-record="${id}"] strong`);
        if (value) value.textContent = formatTime(readBest(id));
      });
    }

    function syncPauseUi() {
      const paused = runtime.paused;
      stage.classList.toggle("is-mines-paused", paused);
      pauseButton.textContent = paused ? "계속하기" : "일시정지";
      pauseButton.setAttribute("aria-pressed", String(paused));
    }

    function setManualPause(value) {
      runtime.manualPaused = Boolean(value);
      syncPauseUi();
    }

    pauseButton.addEventListener("click", function () {
      setManualPause(!runtime.manualPaused);
    });

    function syncFullscreenUi() {
      const active = document.fullscreenElement === stage || stage.classList.contains("mines-focus-mode");
      fullscreenButton.textContent = active ? "전체화면 종료" : "전체화면";
      fullscreenButton.setAttribute("aria-pressed", String(active));
      document.body.classList.toggle("has-mines-focus", stage.classList.contains("mines-focus-mode"));
    }

    fullscreenButton.addEventListener("click", async function () {
      try {
        if (document.fullscreenElement === stage) {
          await document.exitFullscreen();
        } else if (stage.requestFullscreen) {
          await stage.requestFullscreen();
        } else {
          stage.classList.toggle("mines-focus-mode");
          syncFullscreenUi();
        }
      } catch (_) {
        stage.classList.toggle("mines-focus-mode");
        syncFullscreenUi();
      }
    });

    document.addEventListener("fullscreenchange", syncFullscreenUi);

    let holdTimer = null;
    let holdTarget = null;
    let holdStartX = 0;
    let holdStartY = 0;
    const suppressClickUntil = new WeakMap();

    function cancelHold() {
      if (holdTimer) window.clearTimeout(holdTimer);
      holdTimer = null;
      holdTarget = null;
    }

    document.addEventListener("pointerdown", function (event) {
      const cell = event.target.closest && event.target.closest(".mines-cell");
      if (!cell || !stage.contains(cell) || (event.pointerType !== "touch" && event.pointerType !== "pen")) return;
      cancelHold();
      holdTarget = cell;
      holdStartX = event.clientX;
      holdStartY = event.clientY;
      holdTimer = window.setTimeout(function () {
        if (!holdTarget) return;
        suppressClickUntil.set(holdTarget, Date.now() + 700);
        holdTarget.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true, view: window }));
        if (navigator.vibrate) navigator.vibrate(18);
        cancelHold();
      }, 430);
    }, true);

    document.addEventListener("pointermove", function (event) {
      if (!holdTarget) return;
      if (Math.abs(event.clientX - holdStartX) > 12 || Math.abs(event.clientY - holdStartY) > 12) cancelHold();
    }, true);
    document.addEventListener("pointerup", cancelHold, true);
    document.addEventListener("pointercancel", cancelHold, true);

    document.addEventListener("click", function (event) {
      const cell = event.target.closest && event.target.closest(".mines-cell");
      if (!cell || !stage.contains(cell)) return;
      const until = suppressClickUntil.get(cell) || 0;
      if (Date.now() < until) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);

    document.addEventListener("visibilitychange", function () {
      runtime.visibilityPaused = document.hidden;
      syncPauseUi();
    });

    const result = document.getElementById("playResult");
    if (result) {
      new MutationObserver(syncRecords).observe(result, { childList: true, characterData: true, subtree: true });
    }
    surface.addEventListener("click", function () { window.setTimeout(syncRecords, 0); });

    syncRecords();
    syncPauseUi();
    syncFullscreenUi();
    return true;
  }

  function boot() {
    if (setup()) return;
    const observer = new MutationObserver(function () {
      if (setup()) observer.disconnect();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
