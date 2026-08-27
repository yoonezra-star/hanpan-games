(function () {
  const overrides = {
    "reaction-speed": {
      minutes: "5~10회 측정",
      description: "초록 신호 뒤 반응시간을 5회 또는 10회 측정해 평균·중앙값·일관성을 확인합니다."
    }
  };

  function applyCatalogOverrides() {
    const catalog = Array.isArray(window.HANPAN_CATALOG) ? window.HANPAN_CATALOG : [];
    Object.entries(overrides).forEach(function ([id, values]) {
      const game = catalog.find(function (item) { return item.id === id; });
      if (game) Object.assign(game, values);
    });

    document.querySelectorAll(".game-card").forEach(function (card) {
      const title = card.querySelector("h2");
      if (!title || title.textContent.trim() !== "반응속도 체크") return;
      const description = card.querySelector("p");
      const minutes = card.querySelector(".game-meta span");
      if (description) description.textContent = overrides["reaction-speed"].description;
      if (minutes) minutes.textContent = overrides["reaction-speed"].minutes;
    });

    const stageTitle = document.querySelector("#stageTitle");
    if (stageTitle && stageTitle.textContent.trim() === "반응속도 체크") {
      const category = document.querySelector("#playCategory");
      const description = document.querySelector("#playDescription");
      if (category) category.textContent = "순발력·기록 · 5~10회 측정";
      if (description) description.textContent = overrides["reaction-speed"].description;
    }
  }

  applyCatalogOverrides();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyCatalogOverrides, { once: true });
  }
})();
