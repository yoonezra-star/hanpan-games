(function () {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // Local storage can be unavailable in some private browsing modes.
    }
  }

  function readNumber(key) {
    try {
      const value = Number(localStorage.getItem(key));
      return Number.isFinite(value) ? value : null;
    } catch (error) {
      return null;
    }
  }

  function writeNumber(key, value) {
    try {
      localStorage.setItem(key, String(value));
    } catch (error) {
      // Best-effort local score saving only.
    }
  }

  function setText(element, value) {
    if (element) element.textContent = value;
  }

  function initReactionGame() {
    const stage = document.getElementById("reaction-game");
    if (!stage) return;

    const panel = stage.querySelector(".reaction-stage");
    const text = document.getElementById("reactionText");
    const hint = document.getElementById("reactionHint");
    const button = document.getElementById("reactionButton");
    const result = document.getElementById("reactionResult");
    const bestEl = document.getElementById("reactionBest");
    const lastEl = document.getElementById("reactionLast");
    const averageEl = document.getElementById("reactionAverage");

    let timer = null;
    let start = 0;
    let state = "idle";
    let history = readJson("hanpan-reaction-history", [])
      .filter(function (item) { return Number.isFinite(Number(item)); })
      .map(function (item) { return Number(item); })
      .slice(-12);
    const legacyBest = readNumber("hanpan-reaction-best");
    if (!history.length && legacyBest) history = [legacyBest];

    function renderStats() {
      const best = history.length ? Math.min.apply(null, history) : null;
      const last = history.length ? history[history.length - 1] : null;
      const average = history.length
        ? Math.round(history.reduce(function (sum, item) { return sum + item; }, 0) / history.length)
        : null;
      setText(bestEl, best ? `${best}ms` : "-");
      setText(lastEl, last ? `${last}ms` : "-");
      setText(averageEl, average ? `${average}ms` : "-");
    }

    function setPanel(nextState, mainText, helpText, buttonText) {
      state = nextState;
      panel.dataset.state = nextState;
      setText(text, mainText);
      setText(hint, helpText);
      setText(button, buttonText);
    }

    function startRound() {
      window.clearTimeout(timer);
      start = 0;
      setText(result, "빨간 대기 화면입니다. 초록색으로 바뀌는 순간 누르세요.");
      setPanel("waiting", "기다리세요", "지금 누르면 실패입니다.", "초록이면 누르기");
      const delay = 1200 + Math.round(Math.random() * 2600);
      timer = window.setTimeout(function () {
        start = performance.now();
        setPanel("ready", "지금!", "버튼이나 신호판을 바로 누르세요.", "지금 누르기");
      }, delay);
    }

    function finishEarly() {
      window.clearTimeout(timer);
      setText(result, "너무 빨랐습니다. 신호가 바뀐 뒤에 눌러야 기록됩니다.");
      setPanel("early", "실패", "성급하게 누른 판은 기록하지 않습니다.", "다시 도전");
    }

    function finishReady() {
      const score = Math.round(performance.now() - start);
      history.push(score);
      history = history.slice(-12);
      writeJson("hanpan-reaction-history", history);
      writeNumber("hanpan-reaction-best", Math.min.apply(null, history));
      renderStats();

      let grade = "차분한 기록입니다.";
      if (score < 180) grade = "굉장히 빠릅니다.";
      else if (score < 240) grade = "좋은 반응입니다.";
      else if (score < 320) grade = "안정적인 기록입니다.";

      setText(result, `이번 기록: ${score}ms. ${grade}`);
      setPanel("done", "기록 완료", `${score}ms`, "다시 시작");
    }

    function action() {
      if (state === "idle" || state === "done" || state === "early") {
        startRound();
        return;
      }

      if (state === "waiting") {
        finishEarly();
        return;
      }

      if (state === "ready") finishReady();
    }

    button.addEventListener("click", action);
    panel.addEventListener("click", action);
    panel.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        action();
      }
    });

    renderStats();
  }

  function initNumberGame() {
    const input = document.getElementById("numberGuess");
    const button = document.getElementById("numberButton");
    const resetButton = document.getElementById("numberReset");
    const result = document.getElementById("numberResult");
    const rangeEl = document.getElementById("numberRange");
    const triesEl = document.getElementById("numberTries");
    const bestEl = document.getElementById("numberBest");
    const historyEl = document.getElementById("guessHistory");
    if (!input || !button || !result) return;

    let answer = 1;
    let tries = 0;
    let low = 1;
    let high = 50;
    let solved = false;
    let history = [];
    let best = readNumber("hanpan-number-best");

    function renderHistory() {
      if (!historyEl) return;
      historyEl.innerHTML = "";
      history.forEach(function (item) {
        const chip = document.createElement("span");
        chip.className = `guess-chip ${item.type}`;
        chip.textContent = item.label;
        historyEl.appendChild(chip);
      });
    }

    function renderStats() {
      setText(rangeEl, `${low}-${high}`);
      setText(triesEl, String(tries));
      setText(bestEl, best ? `${best}회` : "-");
      input.min = String(low);
      input.max = String(high);
      input.placeholder = `${low}-${high}`;
      renderHistory();
    }

    function restart() {
      answer = 1 + Math.floor(Math.random() * 50);
      tries = 0;
      low = 1;
      high = 50;
      solved = false;
      history = [];
      input.value = "";
      input.disabled = false;
      button.textContent = "확인";
      setText(result, "1부터 50 사이의 숫자를 추리해 보세요.");
      renderStats();
      if (document.activeElement === button || document.activeElement === resetButton) {
        input.focus();
      }
    }

    function guess() {
      if (solved) {
        restart();
        return;
      }

      const value = Number(input.value);
      if (!Number.isInteger(value) || value < 1 || value > 50) {
        setText(result, "1부터 50 사이의 정수를 입력해 주세요.");
        input.select();
        return;
      }

      if (value < low || value > high) {
        setText(result, `이미 제외된 범위입니다. ${low}부터 ${high} 사이에서 골라 보세요.`);
        input.select();
        return;
      }

      tries += 1;

      if (value === answer) {
        history.push({ label: `${value} 정답`, type: "correct" });
        solved = true;
        input.disabled = true;
        button.textContent = "새 금고";
        if (!best || tries < best) {
          best = tries;
          writeNumber("hanpan-number-best", best);
          setText(result, `${tries}번 만에 열었습니다. 새 최고 기록입니다.`);
        } else {
          setText(result, `${tries}번 만에 열었습니다. 현재 최고 기록은 ${best}회입니다.`);
        }
        renderStats();
        return;
      }

      if (value < answer) {
        history.push({ label: `${value} 낮음`, type: "low" });
        low = Math.max(low, value + 1);
        setText(result, `${value}보다 큰 숫자입니다. 가능한 범위가 좁아졌습니다.`);
      } else {
        history.push({ label: `${value} 높음`, type: "high" });
        high = Math.min(high, value - 1);
        setText(result, `${value}보다 작은 숫자입니다. 가능한 범위가 좁아졌습니다.`);
      }

      input.value = "";
      renderStats();
      input.focus();
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
    const movesEl = document.getElementById("memoryMoves");
    const timeEl = document.getElementById("memoryTime");
    const bestEl = document.getElementById("memoryBest");
    if (!board || !result || !reset) return;

    const values = ["한", "판", "게", "임", "즈", "점"];
    const totalCards = values.length * 2;
    let first = null;
    let locked = false;
    let moves = 0;
    let matched = 0;
    let startedAt = null;
    let tickTimer = null;
    let flipTimer = null;
    let best = readJson("hanpan-memory-best", null);

    function shuffle(items) {
      return items
        .map(function (value) { return { value, sort: Math.random() }; })
        .sort(function (a, b) { return a.sort - b.sort; })
        .map(function (item) { return item.value; });
    }

    function elapsedSeconds() {
      if (!startedAt) return 0;
      return Math.floor((Date.now() - startedAt) / 1000);
    }

    function formatBest() {
      if (!best || !Number.isFinite(best.moves) || !Number.isFinite(best.seconds)) return "-";
      return `${best.moves}회/${best.seconds}초`;
    }

    function renderStats() {
      setText(movesEl, String(moves));
      setText(timeEl, `${elapsedSeconds()}초`);
      setText(bestEl, formatBest());
    }

    function startClock() {
      if (startedAt) return;
      startedAt = Date.now();
      tickTimer = window.setInterval(renderStats, 1000);
      renderStats();
    }

    function stopClock() {
      window.clearInterval(tickTimer);
      tickTimer = null;
    }

    function updateCardLabel(card, visible) {
      const position = card.dataset.position;
      const value = card.dataset.value;
      card.setAttribute("aria-label", visible ? `${position}번 타일 ${value}` : `${position}번 숨은 타일`);
    }

    function reveal(card) {
      card.classList.add("revealed");
      updateCardLabel(card, true);
    }

    function hide(card) {
      card.classList.remove("revealed");
      updateCardLabel(card, false);
    }

    function finishGame() {
      stopClock();
      const seconds = elapsedSeconds();
      const isBest = !best || moves < best.moves || (moves === best.moves && seconds < best.seconds);
      if (isBest) {
        best = { moves, seconds };
        writeJson("hanpan-memory-best", best);
      }
      renderStats();
      setText(
        result,
        isBest
          ? `${moves}번, ${seconds}초 만에 완료했습니다. 새 최고 기록입니다.`
          : `${moves}번, ${seconds}초 만에 완료했습니다.`
      );
    }

    function build() {
      window.clearTimeout(flipTimer);
      stopClock();
      board.innerHTML = "";
      first = null;
      locked = false;
      moves = 0;
      matched = 0;
      startedAt = null;
      setText(result, "첫 타일을 뒤집으면 시간이 시작됩니다.");
      renderStats();

      shuffle(values.concat(values)).forEach(function (value, index) {
        const card = document.createElement("button");
        const face = document.createElement("span");
        card.type = "button";
        card.className = "memory-card";
        card.dataset.value = value;
        card.dataset.position = String(index + 1);
        face.textContent = value;
        face.setAttribute("aria-hidden", "true");
        card.appendChild(face);
        updateCardLabel(card, false);
        card.addEventListener("click", function () {
          if (locked || card.disabled || card.classList.contains("revealed")) return;
          startClock();
          reveal(card);

          if (!first) {
            first = card;
            return;
          }

          const second = card;
          moves += 1;
          renderStats();

          if (first.dataset.value === second.dataset.value) {
            first.classList.add("matched");
            second.classList.add("matched");
            first.disabled = true;
            second.disabled = true;
            first = null;
            matched += 2;
            setText(result, `짝을 찾았습니다. 남은 타일: ${totalCards - matched}장`);
            if (matched === totalCards) finishGame();
            return;
          }

          locked = true;
          setText(result, "다른 타일입니다. 위치를 기억해 두세요.");
          flipTimer = window.setTimeout(function () {
            hide(first);
            hide(second);
            first = null;
            locked = false;
          }, 760);
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
