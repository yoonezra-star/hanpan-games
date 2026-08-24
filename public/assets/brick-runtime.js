(function () {
  const bestStageKey = "hanpan-brick-best-stage";
  const enhancedSurfaces = new WeakSet();

  function readBestStage() {
    try {
      const value = Number(localStorage.getItem(bestStageKey));
      return Number.isFinite(value) && value > 0 ? Math.floor(value) : 1;
    } catch (error) {
      return 1;
    }
  }

  function saveBestStage(value) {
    const stage = Number(value);
    if (!Number.isFinite(stage) || stage < 1) return readBestStage();
    const best = Math.max(readBestStage(), Math.floor(stage));
    try { localStorage.setItem(bestStageKey, String(best)); } catch (error) { /* Local records are optional. */ }
    return best;
  }

  function setupSurface(surface) {
    if (!surface || enhancedSurfaces.has(surface)) return false;
    const canvas = surface.querySelector(".brick-break-canvas");
    const controls = surface.querySelector(".brick-controls");
    const hud = surface.querySelector(".mini-score.game-score-hud, .mini-score");
    if (!canvas || !controls || !hud) return false;

    const hudItems = Array.from(hud.children);
    if (hudItems.length < 3) return false;
    const stageValue = hudItems[2].querySelector("b");
    if (!stageValue) return false;

    enhancedSurfaces.add(surface);
    surface.classList.add("brick-break-enhanced");
    canvas.style.touchAction = "none";
    canvas.style.webkitUserSelect = "none";
    canvas.style.userSelect = "none";

    let bestBox = hud.querySelector("[data-brick-best-stage]");
    if (!bestBox) {
      bestBox = document.createElement("span");
      bestBox.dataset.brickBestStage = "";
      bestBox.innerHTML = `<b>${readBestStage()}</b><small>최고 스테이지</small>`;
      hud.appendChild(bestBox);
    }
    const bestValue = bestBox.querySelector("b");

    function syncBestStage() {
      const best = saveBestStage(stageValue.textContent);
      if (bestValue) bestValue.textContent = String(best);
    }

    const stageObserver = new MutationObserver(syncBestStage);
    stageObserver.observe(stageValue, { childList: true, characterData: true, subtree: true });
    syncBestStage();

    function capturePointer(event) {
      if (event.pointerType === "mouse") return;
      try { canvas.setPointerCapture(event.pointerId); } catch (error) { /* Pointer capture is optional. */ }
    }

    function releasePointer(event) {
      try {
        if (canvas.hasPointerCapture && canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
      } catch (error) { /* Ignore unsupported pointer capture. */ }
    }

    canvas.addEventListener("pointerdown", capturePointer, true);
    canvas.addEventListener("pointerup", releasePointer, true);
    canvas.addEventListener("pointercancel", releasePointer, true);

    const startButton = controls.querySelector(".button.primary");
    function pauseWhenHidden() {
      if (!document.hidden || !startButton || !surface.isConnected) return;
      const label = (startButton.textContent || "").replace(/\s+/g, "");
      if (label === "일시정지") {
        startButton.click();
        surface.dataset.autoPaused = "true";
        const result = document.getElementById("playResult");
        if (result) result.textContent = "다른 탭으로 이동해 게임을 자동으로 일시 정지했습니다.";
      }
    }

    function noteReturn() {
      if (document.hidden || surface.dataset.autoPaused !== "true") return;
      delete surface.dataset.autoPaused;
      const result = document.getElementById("playResult");
      if (result) result.textContent = "자동 일시 정지 상태입니다. 계속 버튼을 눌러 이어서 플레이하세요.";
    }

    document.addEventListener("visibilitychange", pauseWhenHidden);
    document.addEventListener("visibilitychange", noteReturn);

    const cleanupObserver = new MutationObserver(function () {
      if (surface.isConnected && canvas.isConnected) return;
      stageObserver.disconnect();
      cleanupObserver.disconnect();
      document.removeEventListener("visibilitychange", pauseWhenHidden);
      document.removeEventListener("visibilitychange", noteReturn);
    });
    cleanupObserver.observe(document.documentElement, { childList: true, subtree: true });

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