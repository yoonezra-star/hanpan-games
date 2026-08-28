(function () {
  const overrides = [
    {
      title: "반응속도 체크",
      minutes: "5~10회 측정",
      category: "순발력·기록",
      description: "초록 신호 뒤 반응시간을 5회 또는 10회 측정해 평균·중앙값·일관성을 확인합니다."
    },
    {
      title: "에임 트레이너",
      minutes: "15~30개 타깃",
      category: "순발력·기록",
      description: "15~30개 타깃을 맞히며 평균 반응시간과 정확도를 측정합니다."
    }
  ];

  function setText(element, value) {
    if (element && element.textContent !== value) element.textContent = value;
  }

  function findOverride(title) {
    return overrides.find(function (item) { return item.title === title; }) || null;
  }

  function applyMetadataOverrides() {
    document.querySelectorAll(".game-card").forEach(function (card) {
      const title = card.querySelector("h2");
      if (!title) return;
      const metadata = findOverride(title.textContent.trim());
      if (!metadata) return;
      setText(card.querySelector("p"), metadata.description);
      setText(card.querySelector(".game-meta span"), metadata.minutes);
    });

    document.querySelectorAll(".picker-item").forEach(function (item) {
      const title = item.querySelector("strong");
      if (!title) return;
      const metadata = findOverride(title.textContent.trim());
      if (!metadata) return;
      setText(item.querySelector("small"), metadata.category + " · " + metadata.minutes);
    });

    const stageTitle = document.querySelector("#stageTitle");
    if (stageTitle) {
      const metadata = findOverride(stageTitle.textContent.trim());
      if (metadata) setText(document.querySelector("#playCategory"), metadata.category + " · " + metadata.minutes);
    }
  }

  let scheduled = false;
  function scheduleApply() {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(function () {
      scheduled = false;
      applyMetadataOverrides();
    });
  }

  applyMetadataOverrides();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyMetadataOverrides, { once: true });
  }

  const observer = new MutationObserver(scheduleApply);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
