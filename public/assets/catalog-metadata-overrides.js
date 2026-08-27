(function () {
  const reaction = {
    title: "반응속도 체크",
    minutes: "5~10회 측정",
    category: "순발력·기록",
    description: "초록 신호 뒤 반응시간을 5회 또는 10회 측정해 평균·중앙값·일관성을 확인합니다."
  };

  function setText(element, value) {
    if (element && element.textContent !== value) element.textContent = value;
  }

  function applyReactionMetadata() {
    document.querySelectorAll(".game-card").forEach(function (card) {
      const title = card.querySelector("h2");
      if (!title || title.textContent.trim() !== reaction.title) return;
      setText(card.querySelector("p"), reaction.description);
      setText(card.querySelector(".game-meta span"), reaction.minutes);
    });

    document.querySelectorAll(".picker-item").forEach(function (item) {
      const title = item.querySelector("strong");
      if (!title || title.textContent.trim() !== reaction.title) return;
      setText(item.querySelector("small"), reaction.category + " · " + reaction.minutes);
    });

    const stageTitle = document.querySelector("#stageTitle");
    if (stageTitle && stageTitle.textContent.trim() === reaction.title) {
      setText(document.querySelector("#playCategory"), reaction.category + " · " + reaction.minutes);
    }
  }

  let scheduled = false;
  function scheduleApply() {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(function () {
      scheduled = false;
      applyReactionMetadata();
    });
  }

  applyReactionMetadata();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyReactionMetadata, { once: true });
  }

  const observer = new MutationObserver(scheduleApply);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
