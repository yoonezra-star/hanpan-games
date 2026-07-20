(function () {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  function initReactionGame() {
    const stage = document.getElementById("reaction-game");
    if (!stage) return;

    const panel = document.querySelector(".reaction-stage");
    const text = document.getElementById("reactionText");
    const hint = document.getElementById("reactionHint");
    const button = document.getElementById("reactionButton");
    const result = document.getElementById("reactionResult");
    let timer = null;
    let start = 0;
    let state = "idle";
    const best = localStorage.getItem("hanpan-reaction-best");
    if (best) result.textContent = `최고 기록: ${best}ms`;

    function reset() {
      window.clearTimeout(timer);
      timer = null;
      start = 0;
      state = "idle";
      panel.dataset.state = "idle";
      text.textContent = "준비되면 시작을 누르세요";
      hint.textContent = "성급하게 누르면 실패입니다.";
      button.textContent = "시작";
    }

    button.addEventListener("click", function () {
      if (state === "idle") {
        state = "waiting";
        panel.dataset.state = "waiting";
        text.textContent = "기다리세요";
        hint.textContent = "초록 신호가 켜지면 누르세요.";
        button.textContent = "대기 중";
        const delay = 1200 + Math.round(Math.random() * 2400);
        timer = window.setTimeout(function () {
          state = "ready";
          start = performance.now();
          panel.dataset.state = "ready";
          text.textContent = "지금!";
          hint.textContent = "바로 누르세요.";
          button.textContent = "누르기";
        }, delay);
        return;
      }

      if (state === "waiting") {
        result.textContent = "너무 빨랐습니다. 신호를 기다려 주세요.";
        reset();
        return;
      }

      if (state === "ready") {
        const score = Math.round(performance.now() - start);
        const previous = Number(localStorage.getItem("hanpan-reaction-best") || Infinity);
        if (score < previous) {
          localStorage.setItem("hanpan-reaction-best", String(score));
          result.textContent = `새 최고 기록: ${score}ms`;
        } else {
          result.textContent = `이번 기록: ${score}ms · 최고 기록: ${previous}ms`;
        }
        reset();
      }
    });
  }

  function initNumberGame() {
    const input = document.getElementById("numberGuess");
    const button = document.getElementById("numberButton");
    const resetButton = document.getElementById("numberReset");
    const result = document.getElementById("numberResult");
    if (!input || !button || !result) return;

    let answer = 1;
    let tries = 0;

    function restart() {
      answer = 1 + Math.floor(Math.random() * 50);
      tries = 0;
      input.value = "";
      result.textContent = "새 금고가 준비되었습니다.";
    }

    function guess() {
      const value = Number(input.value);
      if (!Number.isInteger(value) || value < 1 || value > 50) {
        result.textContent = "1부터 50 사이의 숫자를 입력해 주세요.";
        return;
      }

      tries += 1;
      if (value === answer) {
        result.textContent = `${tries}번 만에 열었습니다. 정답은 ${answer}입니다.`;
        return;
      }

      result.textContent = value < answer ? "더 큰 숫자입니다." : "더 작은 숫자입니다.";
      input.select();
    }

    button.addEventListener("click", guess);
    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") guess();
    });
    if (resetButton) resetButton.addEventListener("click", restart);
    restart();
  }

  function initMemoryGame() {
    const board = document.getElementById("memoryBoard");
    const result = document.getElementById("memoryResult");
    const reset = document.getElementById("memoryReset");
    if (!board || !result || !reset) return;

    const values = ["한", "판", "놀", "이"];
    let first = null;
    let second = null;
    let locked = false;
    let moves = 0;
    let matched = 0;

    function shuffle(items) {
      return items
        .map(function (value) { return { value, sort: Math.random() }; })
        .sort(function (a, b) { return a.sort - b.sort; })
        .map(function (item) { return item.value; });
    }

    function build() {
      board.innerHTML = "";
      first = null;
      second = null;
      locked = false;
      moves = 0;
      matched = 0;
      result.textContent = "시도 횟수: 0";
      shuffle(values.concat(values)).forEach(function (value, index) {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "memory-card";
        card.textContent = value;
        card.setAttribute("aria-label", `${index + 1}번 기억 타일`);
        card.dataset.value = value;
        card.addEventListener("click", function () {
          if (locked || card.classList.contains("revealed") || card.classList.contains("matched")) return;
          card.classList.add("revealed");

          if (!first) {
            first = card;
            return;
          }

          second = card;
          moves += 1;
          result.textContent = `시도 횟수: ${moves}`;

          if (first.dataset.value === second.dataset.value) {
            first.classList.add("matched");
            second.classList.add("matched");
            first = null;
            second = null;
            matched += 2;
            if (matched === 8) result.textContent = `${moves}번 만에 모든 짝을 맞췄습니다.`;
            return;
          }

          locked = true;
          window.setTimeout(function () {
            first.classList.remove("revealed");
            second.classList.remove("revealed");
            first = null;
            second = null;
            locked = false;
          }, 700);
        });
        board.appendChild(card);
      });
    }

    reset.addEventListener("click", build);
    build();
  }

  function initGameFilters() {
    const list = document.getElementById("gameList");
    if (!list) return;

    const cards = Array.from(list.querySelectorAll(".game-card"));
    const buttons = Array.from(document.querySelectorAll(".filter"));
    const search = document.getElementById("gameSearch");
    let active = "all";

    function apply() {
      const query = (search && search.value ? search.value : "").trim().toLowerCase();
      cards.forEach(function (card) {
        const categoryMatch = active === "all" || card.dataset.category.includes(active);
        const text = `${card.dataset.title} ${card.textContent}`.toLowerCase();
        const searchMatch = !query || text.includes(query);
        card.hidden = !(categoryMatch && searchMatch);
      });
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        active = button.dataset.filter;
        buttons.forEach(function (item) { item.classList.remove("active"); });
        button.classList.add("active");
        apply();
      });
    });

    if (search) search.addEventListener("input", apply);
  }

  initReactionGame();
  initNumberGame();
  initMemoryGame();
  initGameFilters();
})();
