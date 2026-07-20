(function () {
  const categoryNames = {
    arcade: "아케이드",
    puzzle: "퍼즐",
    board: "보드·전략",
    brain: "두뇌·기억",
    skill: "스킬",
    test: "테스트"
  };

  const catalog = [
    { id: "reaction-speed", title: "반응속도 체크", category: "skill", type: "reaction", minutes: "15초", description: "초록 신호가 켜지는 순간을 누르는 반응속도 게임입니다." },
    { id: "number-vault", title: "숫자 금고", category: "puzzle", type: "number", minutes: "1분", description: "업다운 힌트로 숨겨진 숫자를 찾아내는 추리 게임입니다." },
    { id: "memory-tiles", title: "기억 타일", category: "brain", type: "pairs", minutes: "2분", description: "뒤집힌 타일의 위치를 기억해 같은 글자를 맞춥니다." },
    { id: "click-sprint", title: "클릭 스프린트", category: "skill", type: "tap", minutes: "10초", description: "정해진 시간 안에 얼마나 빠르게 클릭하는지 측정합니다." },
    { id: "aim-trainer", title: "에임 트레이너", category: "skill", type: "target", minutes: "1분", description: "무작위 위치에 뜨는 표적을 빠르게 눌러 정확도를 올립니다." },
    { id: "mole-finder", title: "두더지 찾기", category: "arcade", type: "mole", minutes: "1분", description: "여러 구멍 중 튀어나온 두더지를 찾아 누르는 순발력 게임입니다." },
    { id: "brick-break", title: "벽돌깨기 미니", category: "arcade", type: "brick", minutes: "1분", description: "숫자가 적힌 벽돌을 낮은 순서대로 깨며 콤보를 만듭니다." },
    { id: "bubble-pop", title: "버블팝", category: "arcade", type: "target", minutes: "1분", description: "반짝이는 버블을 놓치지 않고 눌러 점수를 모읍니다." },
    { id: "snake-garden", title: "뱀의 정원", category: "arcade", type: "snake", minutes: "2분", description: "정원을 돌아다니며 먹이를 먹고 몸을 늘리는 그리드 게임입니다." },
    { id: "airplane-dodge", title: "붕붕 비행기", category: "arcade", type: "lane", minutes: "1분", description: "세 개의 항로를 오가며 장애물을 피하는 비행 게임입니다." },
    { id: "dessert-catch", title: "디저트 캐치", category: "arcade", type: "catcher", minutes: "1분", description: "떨어지는 디저트를 받아 점수를 올리고 탄 음식은 피합니다." },
    { id: "planet-toss", title: "행성 던지기", category: "arcade", type: "toss", minutes: "1분", description: "각도와 힘을 골라 목표 궤도에 행성을 던져 넣습니다." },
    { id: "tic-tac-toe", title: "틱택토", category: "board", type: "tictactoe", minutes: "1분", description: "세 칸을 먼저 잇는 클래식 보드 게임입니다." },
    { id: "connect-four", title: "사목 미니", category: "board", type: "connect4", minutes: "2분", description: "말을 떨어뜨려 네 개를 먼저 잇는 전략 게임입니다." },
    { id: "blackjack", title: "블랙잭 21", category: "board", type: "blackjack", minutes: "2분", description: "21에 가까운 손패를 만들며 딜러와 겨룹니다." },
    { id: "danger-dice", title: "위험한 주사위", category: "board", type: "dice", minutes: "1분", description: "계속 굴릴지 멈출지 결정해 목표 점수에 도전합니다." },
    { id: "rps-survival", title: "가위바위보 서바이벌", category: "board", type: "rps", minutes: "1분", description: "연승을 이어가며 살아남는 가위바위보 게임입니다." },
    { id: "slot-machine", title: "슬롯머신", category: "board", type: "slot", minutes: "30초", description: "세 칸의 그림을 맞춰 짧게 운을 시험합니다." },
    { id: "mines", title: "지뢰찾기 미니", category: "puzzle", type: "mines", minutes: "2분", description: "숫자 힌트를 보고 지뢰가 없는 칸을 모두 엽니다." },
    { id: "sliding-puzzle", title: "슬라이딩 퍼즐", category: "puzzle", type: "sliding", minutes: "2분", description: "빈 칸을 이용해 숫자 타일을 순서대로 맞춥니다." },
    { id: "sudoku-mini", title: "스도쿠 미니", category: "puzzle", type: "sudoku", minutes: "3분", description: "4x4 스도쿠 판을 완성하는 짧은 논리 퍼즐입니다." },
    { id: "twenty-48", title: "2048 한판", category: "puzzle", type: "twenty48", minutes: "3분", description: "같은 숫자 타일을 합쳐 더 큰 숫자를 만드는 퍼즐입니다." },
    { id: "match-three", title: "매치3 퍼즐", category: "puzzle", type: "match3", minutes: "2분", description: "인접한 타일을 바꿔 같은 그림 세 개를 맞춥니다." },
    { id: "block-fill", title: "블록 채우기", category: "puzzle", type: "blockfill", minutes: "2분", description: "빈 칸을 모두 채우되 폭탄 칸은 피하는 블록 퍼즐입니다." },
    { id: "simon", title: "사이먼 게임", category: "brain", type: "sequence", minutes: "2분", description: "빛나는 순서를 기억했다가 그대로 따라 누릅니다." },
    { id: "pattern-memory", title: "패턴 기억", category: "brain", type: "pattern", minutes: "1분", description: "잠깐 보이는 패턴을 기억해 같은 칸을 다시 선택합니다." },
    { id: "word-guess", title: "단어 맞추기", category: "brain", type: "word", minutes: "2분", description: "힌트를 보고 숨겨진 단어를 추리합니다." },
    { id: "hangman", title: "행맨", category: "brain", type: "hangman", minutes: "2분", description: "글자를 하나씩 골라 숨은 단어를 완성합니다." },
    { id: "typing-sprint", title: "타자 연습", category: "skill", type: "typing", minutes: "1분", description: "제시 문장을 정확히 입력해 속도와 정확도를 확인합니다." },
    { id: "math-climb", title: "수학 등산", category: "brain", type: "math", minutes: "1분", description: "짧은 계산 문제를 풀며 산 정상까지 올라갑니다." },
    { id: "color-match", title: "색깔 맞추기", category: "test", type: "color", minutes: "1분", description: "글자와 색이 일치하는지 빠르게 판단합니다." },
    { id: "perfume-workshop", title: "향수 공방", category: "test", type: "recipe", minutes: "2분", description: "주문에 맞는 향 조합을 골라 작은 공방을 운영합니다." },
    { id: "constellation", title: "별자리 잇기", category: "test", type: "constellation", minutes: "1분", description: "별을 순서대로 이어 작은 별자리를 완성합니다." },
    { id: "garden-water", title: "정원 물주기", category: "test", type: "garden", minutes: "1분", description: "마른 화분을 찾아 물을 주고 정원을 살립니다." }
  ];

  let cleanup = [];

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function clearTimers() {
    cleanup.forEach(function (fn) { fn(); });
    cleanup = [];
  }

  function shuffle(items) {
    return items
      .map(function (value) { return { value, sort: Math.random() }; })
      .sort(function (a, b) { return a.sort - b.sort; })
      .map(function (item) { return item.value; });
  }

  function sample(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function setResult(text) {
    const result = $("#playResult");
    if (result) result.textContent = text;
  }

  function saveBest(id, value, better) {
    const key = `hanpan-arcade-${id}`;
    const prev = Number(localStorage.getItem(key));
    if (!Number.isFinite(prev) || better(value, prev)) {
      localStorage.setItem(key, String(value));
      return true;
    }
    return false;
  }

  function getBest(id) {
    const value = Number(localStorage.getItem(`hanpan-arcade-${id}`));
    return Number.isFinite(value) ? value : null;
  }

  function button(label, className) {
    const item = document.createElement("button");
    item.type = "button";
    item.className = className || "mini-button";
    item.textContent = label;
    return item;
  }

  function makeGrid(count, className) {
    const grid = document.createElement("div");
    grid.className = className || "mini-grid";
    for (let i = 0; i < count; i += 1) {
      const cell = button("", "mini-cell");
      cell.setAttribute("aria-label", `칸 ${i + 1}`);
      grid.appendChild(cell);
    }
    return grid;
  }

  function renderCatalog() {
    const list = $("[data-arcade-list]");
    if (!list) return;
    const search = $("#arcadeSearch");
    const count = $("#arcadeCount");
    const filters = Array.from(document.querySelectorAll("[data-arcade-filter]"));
    let active = "all";

    function draw() {
      const query = (search && search.value ? search.value : "").trim().toLowerCase();
      const games = catalog.filter(function (game) {
        const categoryMatch = active === "all" || game.category === active;
        const text = `${game.title} ${game.description} ${categoryNames[game.category]}`.toLowerCase();
        return categoryMatch && (!query || text.includes(query));
      });
      list.innerHTML = "";
      games.forEach(function (game) {
        const card = document.createElement("article");
        card.className = "game-card";
        card.innerHTML = `
          <span class="tag ${tagColor(game.category)}">${categoryNames[game.category]}</span>
          <h2>${game.title}</h2>
          <p>${game.description}</p>
          <div class="game-meta"><span>${game.minutes}</span><span>즉시 플레이</span></div>
          <div class="link-row compact">
            <a class="inline-link" href="/play/?game=${game.id}">플레이</a>
          </div>
        `;
        list.appendChild(card);
      });
      if (count) count.textContent = `${games.length}개 게임`;
    }

    filters.forEach(function (filter) {
      filter.addEventListener("click", function () {
        active = filter.dataset.arcadeFilter;
        filters.forEach(function (item) { item.classList.remove("active"); });
        filter.classList.add("active");
        draw();
      });
    });
    if (search) search.addEventListener("input", draw);
    draw();
  }

  function tagColor(category) {
    if (category === "arcade" || category === "skill") return "red";
    if (category === "puzzle") return "blue";
    if (category === "brain") return "green";
    return "gold";
  }

  function renderPlayPage() {
    const surface = $("#playSurface");
    if (!surface) return;

    const picker = $("#playPicker");
    const search = $("#playSearch");
    const restart = $("#restartGame");
    let current = catalog.find(function (game) { return game.id === new URLSearchParams(location.search).get("game"); }) || catalog[0];

    function drawPicker() {
      const query = (search && search.value ? search.value : "").trim().toLowerCase();
      picker.innerHTML = "";
      catalog
        .filter(function (game) {
          const text = `${game.title} ${game.description} ${categoryNames[game.category]}`.toLowerCase();
          return !query || text.includes(query);
        })
        .forEach(function (game) {
          const item = button(game.title, game.id === current.id ? "picker-item active" : "picker-item");
          item.addEventListener("click", function () {
            current = game;
            history.replaceState(null, "", `/play/?game=${game.id}`);
            draw();
          });
          picker.appendChild(item);
        });
    }

    function draw() {
      clearTimers();
      $("#playTitle").textContent = current.title;
      $("#playDescription").textContent = current.description;
      $("#stageTitle").textContent = current.title;
      $("#playCategory").textContent = `${categoryNames[current.category]} · ${current.minutes}`;
      surface.innerHTML = "";
      setResult("게임을 시작해 보세요.");
      drawPicker();
      renderGame(current, surface);
    }

    if (restart) restart.addEventListener("click", draw);
    if (search) search.addEventListener("input", drawPicker);
    draw();
  }

  function renderGame(game, surface) {
    const map = {
      reaction: renderReaction,
      number: renderNumber,
      pairs: renderPairs,
      tap: renderTap,
      target: renderTarget,
      mole: renderMole,
      brick: renderBrick,
      snake: renderSnake,
      lane: renderLane,
      catcher: renderCatcher,
      toss: renderToss,
      tictactoe: renderTicTacToe,
      connect4: renderConnect4,
      blackjack: renderBlackjack,
      dice: renderDice,
      rps: renderRps,
      slot: renderSlot,
      mines: renderMines,
      sliding: renderSliding,
      sudoku: renderSudoku,
      twenty48: render2048,
      match3: renderMatch3,
      blockfill: renderBlockFill,
      sequence: renderSequence,
      pattern: renderPattern,
      word: renderWord,
      hangman: renderHangman,
      typing: renderTyping,
      math: renderMath,
      color: renderColor,
      recipe: renderRecipe,
      constellation: renderConstellation,
      garden: renderGarden
    };
    (map[game.type] || renderTap)(game, surface);
  }

  function renderScore(surface, items) {
    const wrap = document.createElement("div");
    wrap.className = "mini-score";
    items.forEach(function (item) {
      const box = document.createElement("span");
      box.innerHTML = `<b>${item.value}</b><small>${item.label}</small>`;
      wrap.appendChild(box);
    });
    surface.appendChild(wrap);
    return wrap;
  }

  function renderReaction(game, surface) {
    let timer = null;
    let start = 0;
    let state = "idle";
    const stage = document.createElement("button");
    stage.type = "button";
    stage.className = "signal-pad";
    stage.innerHTML = "<strong>시작</strong><span>초록 신호가 켜지면 누르세요.</span>";
    surface.appendChild(stage);
    cleanup.push(function () { clearTimeout(timer); });
    stage.addEventListener("click", function () {
      if (state === "idle" || state === "done" || state === "early") {
        state = "wait";
        stage.dataset.state = "wait";
        stage.innerHTML = "<strong>기다리세요</strong><span>아직 누르면 실패입니다.</span>";
        setResult("빨간 대기 상태입니다.");
        timer = setTimeout(function () {
          state = "ready";
          start = performance.now();
          stage.dataset.state = "ready";
          stage.innerHTML = "<strong>지금!</strong><span>바로 누르세요.</span>";
        }, 900 + Math.random() * 2200);
        return;
      }
      if (state === "wait") {
        clearTimeout(timer);
        state = "early";
        stage.dataset.state = "early";
        stage.innerHTML = "<strong>실패</strong><span>너무 빨랐습니다.</span>";
        setResult("신호가 바뀐 뒤에 눌러야 기록됩니다.");
        return;
      }
      if (state === "ready") {
        const score = Math.round(performance.now() - start);
        const best = saveBest(game.id, score, function (a, b) { return a < b; });
        state = "done";
        stage.dataset.state = "done";
        stage.innerHTML = `<strong>${score}ms</strong><span>다시 누르면 새 라운드입니다.</span>`;
        setResult(best ? `새 최고 기록: ${score}ms` : `이번 기록: ${score}ms`);
      }
    });
  }

  function renderNumber(game, surface) {
    const answer = 1 + Math.floor(Math.random() * 80);
    let low = 1;
    let high = 80;
    let tries = 0;
    surface.innerHTML = `
      <div class="game-stats"><span><b id="miniRange">1-80</b><small>범위</small></span><span><b id="miniTries">0</b><small>시도</small></span><span><b>${getBest(game.id) || "-"}</b><small>최고</small></span></div>
      <div class="number-row"><input id="miniNumber" type="number" min="1" max="80" inputmode="numeric" placeholder="숫자 입력"><button class="button secondary" id="miniGuess" type="button">확인</button></div>
    `;
    const input = $("#miniNumber", surface);
    const guess = $("#miniGuess", surface);
    const range = $("#miniRange", surface);
    const triesEl = $("#miniTries", surface);
    function submit() {
      const value = Number(input.value);
      if (!Number.isInteger(value) || value < low || value > high) {
        setResult(`${low}부터 ${high} 사이의 숫자를 입력하세요.`);
        return;
      }
      tries += 1;
      triesEl.textContent = String(tries);
      if (value === answer) {
        input.disabled = true;
        guess.disabled = true;
        const isBest = saveBest(game.id, tries, function (a, b) { return a < b; });
        setResult(isBest ? `${tries}번 만에 성공. 새 최고 기록입니다.` : `${tries}번 만에 성공했습니다.`);
      } else if (value < answer) {
        low = value + 1;
        range.textContent = `${low}-${high}`;
        input.value = "";
        setResult(`${value}보다 큽니다.`);
      } else {
        high = value - 1;
        range.textContent = `${low}-${high}`;
        input.value = "";
        setResult(`${value}보다 작습니다.`);
      }
    }
    guess.addEventListener("click", submit);
    input.addEventListener("keydown", function (event) { if (event.key === "Enter") submit(); });
  }

  function renderPairs(game, surface) {
    const values = shuffle(["한", "판", "게", "임", "별", "빛"].concat(["한", "판", "게", "임", "별", "빛"]));
    let first = null;
    let locked = false;
    let moves = 0;
    let matched = 0;
    renderScore(surface, [{ label: "시도", value: "0" }, { label: "짝", value: "0/6" }]);
    const score = surface.querySelectorAll(".mini-score b");
    const grid = makeGrid(12, "mini-grid memory-mini");
    surface.appendChild(grid);
    Array.from(grid.children).forEach(function (cell, index) {
      cell.textContent = "?";
      cell.addEventListener("click", function () {
        if (locked || cell.classList.contains("done") || cell === first) return;
        cell.textContent = values[index];
        cell.classList.add("open");
        if (!first) {
          first = cell;
          return;
        }
        moves += 1;
        score[0].textContent = String(moves);
        if (values[index] === values[Number(first.dataset.index)]) {
          cell.classList.add("done");
          first.classList.add("done");
          matched += 1;
          score[1].textContent = `${matched}/6`;
          first = null;
          if (matched === 6) {
            const isBest = saveBest(game.id, moves, function (a, b) { return a < b; });
            setResult(isBest ? `${moves}번 만에 완료. 새 최고 기록입니다.` : `${moves}번 만에 완료했습니다.`);
          }
          return;
        }
        locked = true;
        const previous = first;
        setTimeout(function () {
          cell.textContent = "?";
          previous.textContent = "?";
          cell.classList.remove("open");
          previous.classList.remove("open");
          first = null;
          locked = false;
        }, 650);
      });
      cell.dataset.index = String(index);
    });
  }

  function renderTap(game, surface) {
    let score = 0;
    let left = 10;
    renderScore(surface, [{ label: "점수", value: "0" }, { label: "남은 시간", value: "10" }]);
    const values = surface.querySelectorAll(".mini-score b");
    const tap = button("연타 시작", "mega-button");
    surface.appendChild(tap);
    const timer = setInterval(function () {
      left -= 1;
      values[1].textContent = String(left);
      if (left <= 0) {
        clearInterval(timer);
        tap.disabled = true;
        const isBest = saveBest(game.id, score, function (a, b) { return a > b; });
        setResult(isBest ? `${score}점. 새 최고 기록입니다.` : `${score}점으로 마무리했습니다.`);
      }
    }, 1000);
    cleanup.push(function () { clearInterval(timer); });
    tap.addEventListener("click", function () {
      if (left <= 0) return;
      score += 1;
      tap.textContent = `${score}번`;
      values[0].textContent = String(score);
    });
  }

  function renderTarget(game, surface) {
    let score = 0;
    let round = 0;
    renderScore(surface, [{ label: "명중", value: "0" }, { label: "라운드", value: "0/12" }]);
    const values = surface.querySelectorAll(".mini-score b");
    const grid = makeGrid(16, "mini-grid target-grid");
    surface.appendChild(grid);
    function next() {
      Array.from(grid.children).forEach(function (cell) {
        cell.textContent = "";
        cell.className = "mini-cell";
      });
      if (round >= 12) {
        const isBest = saveBest(game.id, score, function (a, b) { return a > b; });
        setResult(isBest ? `${score}개 명중. 새 최고 기록입니다.` : `${score}개 명중했습니다.`);
        return;
      }
      round += 1;
      values[1].textContent = `${round}/12`;
      const target = grid.children[Math.floor(Math.random() * 16)];
      target.textContent = game.id === "bubble-pop" ? "●" : "◎";
      target.classList.add("active");
    }
    Array.from(grid.children).forEach(function (cell) {
      cell.addEventListener("click", function () {
        if (cell.classList.contains("active")) {
          score += 1;
          values[0].textContent = String(score);
        }
        next();
      });
    });
    next();
  }

  function renderMole(game, surface) {
    let score = 0;
    let left = 20;
    renderScore(surface, [{ label: "점수", value: "0" }, { label: "남은", value: "20" }]);
    const values = surface.querySelectorAll(".mini-score b");
    const grid = makeGrid(9, "mini-grid mole-grid");
    surface.appendChild(grid);
    function show() {
      Array.from(grid.children).forEach(function (cell) {
        cell.textContent = "";
        cell.classList.remove("active");
      });
      const active = grid.children[Math.floor(Math.random() * 9)];
      active.textContent = "!";
      active.classList.add("active");
    }
    const timer = setInterval(function () {
      left -= 1;
      values[1].textContent = String(left);
      show();
      if (left <= 0) {
        clearInterval(timer);
        const isBest = saveBest(game.id, score, function (a, b) { return a > b; });
        setResult(isBest ? `${score}점. 새 최고 기록입니다.` : `${score}점으로 종료했습니다.`);
      }
    }, 700);
    cleanup.push(function () { clearInterval(timer); });
    Array.from(grid.children).forEach(function (cell) {
      cell.addEventListener("click", function () {
        if (left > 0 && cell.classList.contains("active")) {
          score += 1;
          values[0].textContent = String(score);
          show();
        }
      });
    });
    show();
  }

  function renderBrick(game, surface) {
    const numbers = shuffle(Array.from({ length: 16 }, function (_, index) { return index + 1; }));
    let next = 1;
    let misses = 0;
    renderScore(surface, [{ label: "다음", value: "1" }, { label: "실수", value: "0" }]);
    const values = surface.querySelectorAll(".mini-score b");
    const grid = makeGrid(16, "mini-grid");
    surface.appendChild(grid);
    Array.from(grid.children).forEach(function (cell, index) {
      cell.textContent = String(numbers[index]);
      cell.addEventListener("click", function () {
        if (cell.disabled) return;
        if (numbers[index] === next) {
          cell.disabled = true;
          cell.classList.add("done");
          next += 1;
          values[0].textContent = next > 16 ? "완료" : String(next);
          if (next > 16) {
            const score = Math.max(0, 16 - misses);
            saveBest(game.id, score, function (a, b) { return a > b; });
            setResult(`벽돌을 모두 깼습니다. 정확도 점수 ${score}점.`);
          }
        } else {
          misses += 1;
          values[1].textContent = String(misses);
          setResult("낮은 숫자부터 차례대로 눌러야 합니다.");
        }
      });
    });
  }

  function renderLane(game, surface) {
    let lane = 1;
    let score = 0;
    let left = 18;
    renderScore(surface, [{ label: "거리", value: "0" }, { label: "남은", value: "18" }]);
    const values = surface.querySelectorAll(".mini-score b");
    const road = document.createElement("div");
    road.className = "lane-road";
    surface.appendChild(road);
    const controls = document.createElement("div");
    controls.className = "mini-controls";
    const leftBtn = button("왼쪽", "button secondary");
    const rightBtn = button("오른쪽", "button secondary");
    controls.append(leftBtn, rightBtn);
    surface.appendChild(controls);
    function draw(obstacle) {
      road.innerHTML = "";
      for (let i = 0; i < 3; i += 1) {
        const cell = document.createElement("span");
        cell.textContent = i === lane ? "✦" : i === obstacle ? "■" : "";
        cell.className = i === lane ? "player" : i === obstacle ? "danger" : "";
        road.appendChild(cell);
      }
    }
    function move(delta) {
      lane = Math.max(0, Math.min(2, lane + delta));
      draw(-1);
    }
    leftBtn.addEventListener("click", function () { move(-1); });
    rightBtn.addEventListener("click", function () { move(1); });
    const timer = setInterval(function () {
      const obstacle = Math.floor(Math.random() * 3);
      left -= 1;
      values[1].textContent = String(left);
      draw(obstacle);
      if (obstacle === lane) {
        clearInterval(timer);
        setResult(`장애물에 부딪혔습니다. 이동 거리 ${score}.`);
        return;
      }
      score += 1;
      values[0].textContent = String(score);
      if (left <= 0) {
        clearInterval(timer);
        saveBest(game.id, score, function (a, b) { return a > b; });
        setResult(`비행 성공. 이동 거리 ${score}.`);
      }
    }, 650);
    cleanup.push(function () { clearInterval(timer); });
    draw(-1);
  }

  function renderCatcher(game, surface) {
    let pos = 1;
    let score = 0;
    let left = 18;
    renderScore(surface, [{ label: "점수", value: "0" }, { label: "남은", value: "18" }]);
    const values = surface.querySelectorAll(".mini-score b");
    const road = document.createElement("div");
    road.className = "lane-road";
    surface.appendChild(road);
    const controls = document.createElement("div");
    controls.className = "mini-controls";
    const leftBtn = button("왼쪽", "button secondary");
    const rightBtn = button("오른쪽", "button secondary");
    controls.append(leftBtn, rightBtn);
    surface.appendChild(controls);
    leftBtn.addEventListener("click", function () { pos = Math.max(0, pos - 1); draw(-1, ""); });
    rightBtn.addEventListener("click", function () { pos = Math.min(2, pos + 1); draw(-1, ""); });
    function draw(drop, symbol) {
      road.innerHTML = "";
      for (let i = 0; i < 3; i += 1) {
        const cell = document.createElement("span");
        cell.textContent = i === pos ? "▣" : i === drop ? symbol : "";
        road.appendChild(cell);
      }
    }
    const timer = setInterval(function () {
      left -= 1;
      values[1].textContent = String(left);
      const drop = Math.floor(Math.random() * 3);
      const bad = Math.random() < 0.22;
      draw(drop, bad ? "X" : "●");
      if (drop === pos) score += bad ? -2 : 2;
      values[0].textContent = String(score);
      if (left <= 0) {
        clearInterval(timer);
        saveBest(game.id, score, function (a, b) { return a > b; });
        setResult(`${score}점으로 종료했습니다.`);
      }
    }, 700);
    cleanup.push(function () { clearInterval(timer); });
    draw(-1, "");
  }

  function renderToss(game, surface) {
    surface.innerHTML = `
      <div class="game-stats"><span><b id="tossAngle">45</b><small>각도</small></span><span><b id="tossPower">50</b><small>힘</small></span><span><b>${getBest(game.id) || "-"}</b><small>최고</small></span></div>
      <label>각도 <input id="angleRange" type="range" min="10" max="80" value="45"></label>
      <label>힘 <input id="powerRange" type="range" min="10" max="100" value="50"></label>
      <button class="button primary full" id="throwPlanet" type="button">던지기</button>
    `;
    const angle = $("#angleRange", surface);
    const power = $("#powerRange", surface);
    const angleText = $("#tossAngle", surface);
    const powerText = $("#tossPower", surface);
    function sync() {
      angleText.textContent = angle.value;
      powerText.textContent = power.value;
    }
    angle.addEventListener("input", sync);
    power.addEventListener("input", sync);
    $("#throwPlanet", surface).addEventListener("click", function () {
      const distance = Math.round(Number(power.value) * Math.sin(Number(angle.value) * Math.PI / 180) + Number(power.value) * 0.5);
      const diff = Math.abs(88 - distance);
      const score = Math.max(0, 100 - diff * 3);
      saveBest(game.id, score, function (a, b) { return a > b; });
      setResult(`목표 궤도와 ${diff} 차이입니다. 점수 ${score}.`);
    });
  }

  function renderTicTacToe(game, surface) {
    const board = Array(9).fill("");
    const grid = makeGrid(9, "mini-grid");
    surface.appendChild(grid);
    function winner(mark) {
      return [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]].some(function (line) {
        return line.every(function (index) { return board[index] === mark; });
      });
    }
    function draw() {
      Array.from(grid.children).forEach(function (cell, index) {
        cell.textContent = board[index];
        cell.disabled = Boolean(board[index]);
      });
    }
    Array.from(grid.children).forEach(function (cell, index) {
      cell.addEventListener("click", function () {
        if (board[index]) return;
        board[index] = "O";
        if (winner("O")) { draw(); setResult("승리했습니다."); return; }
        const empty = board.map(function (value, i) { return value ? null : i; }).filter(function (value) { return value !== null; });
        if (!empty.length) { draw(); setResult("무승부입니다."); return; }
        board[sample(empty)] = "X";
        draw();
        setResult(winner("X") ? "상대가 이겼습니다." : "다음 수를 골라 보세요.");
      });
    });
    draw();
  }

  function renderConnect4(game, surface) {
    const rows = 6;
    const cols = 7;
    const board = Array.from({ length: rows }, function () { return Array(cols).fill(""); });
    const grid = makeGrid(rows * cols, "connect-grid");
    surface.appendChild(grid);
    function drop(col, mark) {
      for (let row = rows - 1; row >= 0; row -= 1) {
        if (!board[row][col]) {
          board[row][col] = mark;
          return true;
        }
      }
      return false;
    }
    function win(mark) {
      const dirs = [[1,0],[0,1],[1,1],[1,-1]];
      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          if (board[r][c] !== mark) continue;
          if (dirs.some(function (d) {
            return [0,1,2,3].every(function (n) {
              const rr = r + d[0] * n;
              const cc = c + d[1] * n;
              return board[rr] && board[rr][cc] === mark;
            });
          })) return true;
        }
      }
      return false;
    }
    function draw() {
      Array.from(grid.children).forEach(function (cell, index) {
        const row = Math.floor(index / cols);
        const col = index % cols;
        cell.textContent = board[row][col];
        cell.dataset.col = String(col);
      });
    }
    grid.addEventListener("click", function (event) {
      const cell = event.target.closest(".mini-cell");
      if (!cell) return;
      const col = Number(cell.dataset.col);
      if (!drop(col, "O")) return;
      if (win("O")) { draw(); setResult("네 개를 이었습니다. 승리!"); return; }
      const available = Array.from({ length: cols }, function (_, c) { return c; }).filter(function (c) { return !board[0][c]; });
      if (available.length) drop(sample(available), "X");
      draw();
      setResult(win("X") ? "상대가 네 개를 이었습니다." : "다음 열을 선택하세요.");
    });
    draw();
  }

  function renderBlackjack(game, surface) {
    const deck = [1,2,3,4,5,6,7,8,9,10,10,10,10];
    let player = [sample(deck), sample(deck)];
    let dealer = [sample(deck), sample(deck)];
    surface.innerHTML = `<div class="card-table"><p id="blackHands"></p><button class="button secondary" id="hit">한 장 더</button><button class="button primary" id="stand">멈추기</button></div>`;
    const hands = $("#blackHands", surface);
    function sum(cards) {
      let total = cards.reduce(function (a, b) { return a + b; }, 0);
      if (cards.includes(1) && total + 10 <= 21) total += 10;
      return total;
    }
    function draw(done) {
      hands.textContent = `내 패 ${player.join(", ")} = ${sum(player)} / 딜러 ${done ? dealer.join(", ") + " = " + sum(dealer) : "?"}`;
    }
    function finish() {
      while (sum(dealer) < 17) dealer.push(sample(deck));
      const ps = sum(player);
      const ds = sum(dealer);
      let message = "패배했습니다.";
      if (ps <= 21 && (ds > 21 || ps > ds)) message = "승리했습니다.";
      else if (ps === ds) message = "비겼습니다.";
      draw(true);
      setResult(message);
      $("#hit", surface).disabled = true;
      $("#stand", surface).disabled = true;
    }
    $("#hit", surface).addEventListener("click", function () {
      player.push(sample(deck));
      if (sum(player) > 21) finish();
      else draw(false);
    });
    $("#stand", surface).addEventListener("click", finish);
    draw(false);
  }

  function renderDice(game, surface) {
    let total = 0;
    let turn = 0;
    surface.innerHTML = `<div class="dice-face" id="diceFace">?</div><div class="mini-controls"><button class="button secondary" id="roll">굴리기</button><button class="button primary" id="hold">멈추기</button></div>`;
    $("#roll", surface).addEventListener("click", function () {
      const value = 1 + Math.floor(Math.random() * 6);
      $("#diceFace", surface).textContent = String(value);
      if (value === 1) {
        turn = 0;
        setResult("1이 나와 이번 턴 점수를 잃었습니다.");
      } else {
        turn += value;
        setResult(`이번 턴 ${turn}점. 계속 굴릴까요?`);
      }
    });
    $("#hold", surface).addEventListener("click", function () {
      total += turn;
      turn = 0;
      if (total >= 30) {
        saveBest(game.id, total, function (a, b) { return a > b; });
        setResult(`${total}점으로 목표를 넘겼습니다.`);
      } else {
        setResult(`누적 ${total}점. 목표는 30점입니다.`);
      }
    });
  }

  function renderRps(game, surface) {
    let streak = 0;
    const options = ["가위", "바위", "보"];
    const wrap = document.createElement("div");
    wrap.className = "choice-row";
    options.forEach(function (choice) {
      const item = button(choice, "button secondary");
      item.addEventListener("click", function () {
        const enemy = sample(options);
        const win = (choice === "가위" && enemy === "보") || (choice === "바위" && enemy === "가위") || (choice === "보" && enemy === "바위");
        if (choice === enemy) setResult(`상대도 ${enemy}. 비겼습니다. 연승 ${streak}.`);
        else if (win) {
          streak += 1;
          saveBest(game.id, streak, function (a, b) { return a > b; });
          setResult(`상대는 ${enemy}. 승리! 연승 ${streak}.`);
        } else {
          streak = 0;
          setResult(`상대는 ${enemy}. 패배해서 연승이 초기화됐습니다.`);
        }
      });
      wrap.appendChild(item);
    });
    surface.appendChild(wrap);
  }

  function renderSlot(game, surface) {
    const symbols = ["7", "★", "◆", "●", "H"];
    surface.innerHTML = `<div class="slot-row"><span>?</span><span>?</span><span>?</span></div><button class="button primary full" id="spin">돌리기</button>`;
    $("#spin", surface).addEventListener("click", function () {
      const result = [sample(symbols), sample(symbols), sample(symbols)];
      surface.querySelectorAll(".slot-row span").forEach(function (slot, index) { slot.textContent = result[index]; });
      const score = result[0] === result[1] && result[1] === result[2] ? 100 : result[0] === result[1] || result[1] === result[2] ? 30 : 5;
      setResult(`점수 ${score}. ${score === 100 ? "잭팟입니다." : "다시 돌려 보세요."}`);
    });
  }

  function renderMines(game, surface) {
    const size = 5;
    const mineSet = new Set();
    while (mineSet.size < 4) mineSet.add(Math.floor(Math.random() * size * size));
    let opened = 0;
    const grid = makeGrid(size * size, "mini-grid mines-grid");
    surface.appendChild(grid);
    function count(index) {
      const r = Math.floor(index / size);
      const c = index % size;
      let n = 0;
      for (let dr = -1; dr <= 1; dr += 1) for (let dc = -1; dc <= 1; dc += 1) {
        const rr = r + dr;
        const cc = c + dc;
        const pos = rr * size + cc;
        if (rr >= 0 && rr < size && cc >= 0 && cc < size && mineSet.has(pos)) n += 1;
      }
      return n;
    }
    Array.from(grid.children).forEach(function (cell, index) {
      cell.textContent = "";
      cell.addEventListener("click", function () {
        if (cell.disabled) return;
        cell.disabled = true;
        if (mineSet.has(index)) {
          cell.textContent = "X";
          setResult("지뢰를 밟았습니다.");
          Array.from(grid.children).forEach(function (item) { item.disabled = true; });
          return;
        }
        cell.textContent = String(count(index));
        opened += 1;
        if (opened === size * size - mineSet.size) setResult("모든 안전 칸을 열었습니다.");
      });
    });
  }

  function renderSliding(game, surface) {
    let tiles = shuffle([1,2,3,4,5,6,7,8,""]);
    const grid = makeGrid(9, "mini-grid");
    surface.appendChild(grid);
    function draw() {
      Array.from(grid.children).forEach(function (cell, index) {
        cell.textContent = String(tiles[index]);
        cell.disabled = tiles[index] === "";
      });
    }
    function solved() {
      return tiles.join(",") === "1,2,3,4,5,6,7,8,";
    }
    Array.from(grid.children).forEach(function (cell, index) {
      cell.addEventListener("click", function () {
        const empty = tiles.indexOf("");
        const adjacent = [empty - 1, empty + 1, empty - 3, empty + 3].includes(index) && Math.abs((empty % 3) - (index % 3)) <= 1;
        if (!adjacent) return;
        tiles[empty] = tiles[index];
        tiles[index] = "";
        draw();
        setResult(solved() ? "퍼즐을 맞췄습니다." : "타일을 순서대로 맞춰 보세요.");
      });
    });
    draw();
  }

  function renderSudoku(game, surface) {
    const puzzle = [1,0,0,4,0,4,1,0,0,1,4,0,4,0,0,2];
    const answer = [1,2,3,4,3,4,1,2,2,1,4,3,4,3,2,1];
    const grid = document.createElement("div");
    grid.className = "mini-grid sudoku-grid";
    surface.appendChild(grid);
    puzzle.forEach(function (value, index) {
      if (value) {
        const fixed = document.createElement("span");
        fixed.className = "mini-cell done";
        fixed.textContent = String(value);
        grid.appendChild(fixed);
      } else {
        const input = document.createElement("input");
        input.className = "sudoku-input";
        input.type = "number";
        input.min = "1";
        input.max = "4";
        input.dataset.index = String(index);
        grid.appendChild(input);
      }
    });
    const check = button("정답 확인", "button primary full");
    surface.appendChild(check);
    check.addEventListener("click", function () {
      const ok = Array.from(grid.querySelectorAll("input")).every(function (input) {
        return Number(input.value) === answer[Number(input.dataset.index)];
      });
      setResult(ok ? "스도쿠를 완성했습니다." : "아직 맞지 않는 칸이 있습니다.");
    });
  }

  function render2048(game, surface) {
    let board = Array(16).fill(0);
    const grid = makeGrid(16, "mini-grid board-2048");
    surface.appendChild(grid);
    const controls = document.createElement("div");
    controls.className = "mini-controls";
    ["위", "왼쪽", "오른쪽", "아래"].forEach(function (label) {
      const item = button(label, "button secondary");
      item.dataset.dir = label;
      controls.appendChild(item);
    });
    surface.appendChild(controls);
    function add() {
      const empty = board.map(function (value, index) { return value ? null : index; }).filter(function (value) { return value !== null; });
      if (empty.length) board[sample(empty)] = Math.random() < 0.88 ? 2 : 4;
    }
    function draw() {
      Array.from(grid.children).forEach(function (cell, index) { cell.textContent = board[index] || ""; });
    }
    function merge(line) {
      const items = line.filter(Boolean);
      for (let i = 0; i < items.length - 1; i += 1) {
        if (items[i] === items[i + 1]) {
          items[i] *= 2;
          items.splice(i + 1, 1);
        }
      }
      while (items.length < 4) items.push(0);
      return items;
    }
    function move(dir) {
      const next = board.slice();
      for (let i = 0; i < 4; i += 1) {
        let line;
        if (dir === "왼쪽" || dir === "오른쪽") line = [0,1,2,3].map(function (c) { return board[i * 4 + c]; });
        else line = [0,1,2,3].map(function (r) { return board[r * 4 + i]; });
        if (dir === "오른쪽" || dir === "아래") line.reverse();
        line = merge(line);
        if (dir === "오른쪽" || dir === "아래") line.reverse();
        for (let j = 0; j < 4; j += 1) {
          if (dir === "왼쪽" || dir === "오른쪽") next[i * 4 + j] = line[j];
          else next[j * 4 + i] = line[j];
        }
      }
      board = next;
      add();
      draw();
      setResult(`최대 타일 ${Math.max.apply(null, board)}.`);
    }
    controls.addEventListener("click", function (event) {
      const target = event.target.closest("button");
      if (target) move(target.dataset.dir);
    });
    add();
    add();
    draw();
  }

  function renderSnake(game, surface) {
    const size = 10;
    let snake = [44, 45, 46];
    let dir = -1;
    let food = 22;
    let score = 0;
    const grid = makeGrid(size * size, "snake-grid");
    surface.appendChild(grid);
    const controls = document.createElement("div");
    controls.className = "mini-controls";
    [["위", -10], ["왼쪽", -1], ["오른쪽", 1], ["아래", 10]].forEach(function (item) {
      const btn = button(item[0], "button secondary");
      btn.addEventListener("click", function () { dir = item[1]; });
      controls.appendChild(btn);
    });
    surface.appendChild(controls);
    function draw() {
      Array.from(grid.children).forEach(function (cell, index) {
        cell.textContent = snake.includes(index) ? "■" : index === food ? "●" : "";
      });
    }
    function step() {
      const head = snake[0];
      const next = head + dir;
      const wall = next < 0 || next >= size * size || (dir === 1 && head % size === size - 1) || (dir === -1 && head % size === 0);
      if (wall || snake.includes(next)) {
        clearInterval(timer);
        setResult(`게임 종료. 먹이 ${score}개.`);
        return;
      }
      snake.unshift(next);
      if (next === food) {
        score += 1;
        const empty = Array.from({ length: size * size }, function (_, index) { return index; }).filter(function (index) { return !snake.includes(index); });
        food = sample(empty);
      } else {
        snake.pop();
      }
      draw();
    }
    const timer = setInterval(step, 350);
    cleanup.push(function () { clearInterval(timer); });
    draw();
  }

  function renderMatch3(game, surface) {
    const icons = ["●", "◆", "▲", "■"];
    let board = Array.from({ length: 36 }, function () { return sample(icons); });
    let picked = null;
    let score = 0;
    renderScore(surface, [{ label: "점수", value: "0" }]);
    const scoreEl = surface.querySelector(".mini-score b");
    const grid = makeGrid(36, "match-grid");
    surface.appendChild(grid);
    function draw() {
      Array.from(grid.children).forEach(function (cell, index) {
        cell.textContent = board[index];
        cell.classList.toggle("active", picked === index);
      });
    }
    function clearMatches() {
      const matched = new Set();
      for (let r = 0; r < 6; r += 1) for (let c = 0; c < 4; c += 1) {
        const i = r * 6 + c;
        if (board[i] === board[i + 1] && board[i] === board[i + 2]) [i, i+1, i+2].forEach(function (x) { matched.add(x); });
      }
      for (let c = 0; c < 6; c += 1) for (let r = 0; r < 4; r += 1) {
        const i = r * 6 + c;
        if (board[i] === board[i + 6] && board[i] === board[i + 12]) [i, i+6, i+12].forEach(function (x) { matched.add(x); });
      }
      matched.forEach(function (index) { board[index] = sample(icons); });
      score += matched.size;
      scoreEl.textContent = String(score);
      return matched.size;
    }
    Array.from(grid.children).forEach(function (cell, index) {
      cell.addEventListener("click", function () {
        if (picked === null) {
          picked = index;
          draw();
          return;
        }
        const adjacent = Math.abs(picked - index) === 1 || Math.abs(picked - index) === 6;
        if (adjacent) {
          const temp = board[picked];
          board[picked] = board[index];
          board[index] = temp;
          const removed = clearMatches();
          setResult(removed ? `${removed}개를 지웠습니다.` : "매치가 없어서 그래도 자리는 바뀌었습니다.");
        }
        picked = null;
        draw();
      });
    });
    draw();
  }

  function renderBlockFill(game, surface) {
    const bombs = new Set(shuffle(Array.from({ length: 16 }, function (_, i) { return i; })).slice(0, 3));
    let filled = 0;
    const grid = makeGrid(16, "mini-grid");
    surface.appendChild(grid);
    Array.from(grid.children).forEach(function (cell, index) {
      cell.addEventListener("click", function () {
        if (cell.disabled) return;
        cell.disabled = true;
        if (bombs.has(index)) {
          cell.textContent = "X";
          setResult("폭탄 칸을 눌렀습니다. 다시 도전해 보세요.");
          return;
        }
        cell.textContent = "■";
        filled += 1;
        setResult(`${filled}/13칸을 채웠습니다.`);
        if (filled === 13) setResult("모든 안전 칸을 채웠습니다.");
      });
    });
  }

  function renderSequence(game, surface) {
    let sequence = [];
    let input = [];
    let level = 0;
    const colors = ["빨강", "파랑", "초록", "노랑"];
    const wrap = document.createElement("div");
    wrap.className = "choice-row";
    colors.forEach(function (color) {
      const item = button(color, "button secondary");
      item.addEventListener("click", function () {
        input.push(color);
        const ok = input.every(function (value, index) { return value === sequence[index]; });
        if (!ok) {
          setResult(`틀렸습니다. 도달 단계 ${level}.`);
          return;
        }
        if (input.length === sequence.length) next();
      });
      wrap.appendChild(item);
    });
    surface.appendChild(wrap);
    const start = button("순서 보기", "button primary full");
    surface.appendChild(start);
    function next() {
      level += 1;
      input = [];
      sequence.push(sample(colors));
      setResult(`단계 ${level}: ${sequence.join(" → ")}`);
    }
    start.addEventListener("click", next);
  }

  function renderPattern(game, surface) {
    const active = new Set(shuffle(Array.from({ length: 16 }, function (_, i) { return i; })).slice(0, 5));
    const grid = makeGrid(16, "mini-grid");
    surface.appendChild(grid);
    Array.from(grid.children).forEach(function (cell, index) {
      if (active.has(index)) cell.classList.add("active");
    });
    setResult("3초 동안 패턴을 기억하세요.");
    setTimeout(function () {
      Array.from(grid.children).forEach(function (cell) { cell.classList.remove("active"); });
      let picked = new Set();
      Array.from(grid.children).forEach(function (cell, index) {
        cell.addEventListener("click", function () {
          cell.classList.toggle("active");
          if (picked.has(index)) picked.delete(index);
          else picked.add(index);
          if (picked.size === active.size) {
            const ok = Array.from(active).every(function (i) { return picked.has(i); });
            setResult(ok ? "패턴을 정확히 기억했습니다." : "다른 칸이 섞였습니다.");
          }
        });
      });
      setResult("기억한 칸 5개를 다시 선택하세요.");
    }, 3000);
  }

  function renderWord(game, surface) {
    const words = [
      { word: "브라우저", hint: "설치 없이 게임을 실행하는 프로그램" },
      { word: "기억력", hint: "기억 타일에서 가장 중요한 능력" },
      { word: "퍼즐", hint: "규칙을 보고 천천히 푸는 게임" }
    ];
    const item = sample(words);
    surface.innerHTML = `<p class="hint-box">${item.hint}</p><input id="wordInput" type="text" placeholder="정답 입력"><button class="button primary full" id="wordSubmit">확인</button>`;
    $("#wordSubmit", surface).addEventListener("click", function () {
      setResult($("#wordInput", surface).value.trim() === item.word ? "정답입니다." : "아직 아닙니다. 힌트를 다시 읽어 보세요.");
    });
  }

  function renderHangman(game, surface) {
    const word = sample(["HANPAN", "GAME", "PUZZLE", "ARCADE"]);
    let misses = 0;
    const picked = new Set();
    const display = document.createElement("p");
    display.className = "word-display";
    surface.appendChild(display);
    const wrap = document.createElement("div");
    wrap.className = "letter-grid";
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(function (letter) {
      const item = button(letter, "mini-button");
      item.addEventListener("click", function () {
        item.disabled = true;
        picked.add(letter);
        if (!word.includes(letter)) misses += 1;
        draw();
      });
      wrap.appendChild(item);
    });
    surface.appendChild(wrap);
    function draw() {
      const shown = word.split("").map(function (letter) { return picked.has(letter) ? letter : "_"; }).join(" ");
      display.textContent = shown;
      if (!shown.includes("_")) setResult("단어를 완성했습니다.");
      else if (misses >= 6) setResult(`실패했습니다. 정답은 ${word}.`);
      else setResult(`남은 실수 ${6 - misses}회.`);
    }
    draw();
  }

  function renderTyping(game, surface) {
    const sentence = sample(["오늘도 가볍게 한 판", "설치 없이 바로 플레이", "기록을 다시 갱신하세요"]);
    const start = Date.now();
    surface.innerHTML = `<p class="hint-box">${sentence}</p><input id="typingInput" type="text" placeholder="문장을 그대로 입력"><button class="button primary full" id="typingSubmit">완료</button>`;
    $("#typingSubmit", surface).addEventListener("click", function () {
      const typed = $("#typingInput", surface).value;
      const seconds = Math.max(1, Math.round((Date.now() - start) / 1000));
      const correct = typed === sentence;
      setResult(correct ? `${seconds}초 만에 정확히 입력했습니다.` : "문장이 정확히 일치하지 않습니다.");
    });
  }

  function renderMath(game, surface) {
    let step = 0;
    let score = 0;
    surface.innerHTML = `<p id="mathQuestion" class="hint-box"></p><input id="mathAnswer" type="number" inputmode="numeric"><button class="button primary full" id="mathSubmit">확인</button>`;
    const q = $("#mathQuestion", surface);
    const input = $("#mathAnswer", surface);
    let answer = 0;
    function next() {
      const a = 2 + Math.floor(Math.random() * 18);
      const b = 2 + Math.floor(Math.random() * 18);
      answer = a + b;
      q.textContent = `${a} + ${b} = ?`;
      input.value = "";
    }
    $("#mathSubmit", surface).addEventListener("click", function () {
      step += 1;
      if (Number(input.value) === answer) score += 1;
      if (step >= 7) setResult(`7문제 중 ${score}개 정답입니다.`);
      else next();
    });
    next();
  }

  function renderColor(game, surface) {
    const colors = [
      { name: "빨강", value: "#df4b38" },
      { name: "파랑", value: "#2877b9" },
      { name: "초록", value: "#258b62" },
      { name: "노랑", value: "#c88b19" }
    ];
    let score = 0;
    let round = 0;
    const card = document.createElement("div");
    card.className = "color-card";
    surface.appendChild(card);
    const controls = document.createElement("div");
    controls.className = "choice-row";
    const yes = button("일치", "button primary");
    const no = button("불일치", "button secondary");
    controls.append(yes, no);
    surface.appendChild(controls);
    let correct = false;
    function next() {
      if (round >= 10) {
        setResult(`10문제 중 ${score}개 정답입니다.`);
        return;
      }
      round += 1;
      const word = sample(colors);
      const paint = sample(colors);
      correct = word.name === paint.name;
      card.textContent = word.name;
      card.style.color = paint.value;
      setResult(`${round}/10: 글자 이름과 색이 같은가요?`);
    }
    function choose(value) {
      if (value === correct) score += 1;
      next();
    }
    yes.addEventListener("click", function () { choose(true); });
    no.addEventListener("click", function () { choose(false); });
    next();
  }

  function renderRecipe(game, surface) {
    const recipes = [
      { order: "상큼한 아침 향", picks: ["레몬", "민트"] },
      { order: "포근한 밤 향", picks: ["바닐라", "우디"] },
      { order: "달콤한 정원 향", picks: ["장미", "꿀"] }
    ];
    const all = ["레몬", "민트", "바닐라", "우디", "장미", "꿀"];
    const recipe = sample(recipes);
    const picked = new Set();
    surface.innerHTML = `<p class="hint-box">주문: ${recipe.order}</p>`;
    const wrap = document.createElement("div");
    wrap.className = "choice-row";
    all.forEach(function (name) {
      const item = button(name, "button secondary");
      item.addEventListener("click", function () {
        item.classList.toggle("active");
        if (picked.has(name)) picked.delete(name);
        else picked.add(name);
      });
      wrap.appendChild(item);
    });
    const submit = button("조향 완료", "button primary full");
    surface.append(wrap, submit);
    submit.addEventListener("click", function () {
      const ok = recipe.picks.every(function (name) { return picked.has(name); }) && picked.size === recipe.picks.length;
      setResult(ok ? "주문에 맞는 향수를 완성했습니다." : "주문과 다른 조합입니다.");
    });
  }

  function renderConstellation(game, surface) {
    const order = shuffle([1,2,3,4,5,6]);
    let next = 0;
    surface.innerHTML = `<p class="hint-box">순서: ${order.join(" → ")}</p>`;
    const grid = makeGrid(9, "mini-grid");
    surface.appendChild(grid);
    order.forEach(function (value, index) {
      grid.children[index + 1].textContent = String(value);
    });
    Array.from(grid.children).forEach(function (cell) {
      cell.addEventListener("click", function () {
        if (!cell.textContent) return;
        if (Number(cell.textContent) === order[next]) {
          cell.classList.add("done");
          next += 1;
          if (next === order.length) setResult("별자리를 완성했습니다.");
          else setResult("다음 별을 이어 주세요.");
        } else {
          setResult("순서가 다릅니다.");
        }
      });
    });
  }

  function renderGarden(game, surface) {
    let score = 0;
    let left = 16;
    renderScore(surface, [{ label: "살린 화분", value: "0" }, { label: "남은", value: "16" }]);
    const values = surface.querySelectorAll(".mini-score b");
    const grid = makeGrid(12, "mini-grid garden-grid");
    surface.appendChild(grid);
    function dry() {
      Array.from(grid.children).forEach(function (cell) {
        cell.textContent = "";
        cell.classList.remove("active");
      });
      const cell = grid.children[Math.floor(Math.random() * 12)];
      cell.textContent = "!";
      cell.classList.add("active");
    }
    Array.from(grid.children).forEach(function (cell) {
      cell.addEventListener("click", function () {
        if (cell.classList.contains("active")) {
          score += 1;
          values[0].textContent = String(score);
          dry();
        }
      });
    });
    const timer = setInterval(function () {
      left -= 1;
      values[1].textContent = String(left);
      if (left <= 0) {
        clearInterval(timer);
        saveBest(game.id, score, function (a, b) { return a > b; });
        setResult(`${score}개의 화분을 살렸습니다.`);
      } else {
        dry();
      }
    }, 800);
    cleanup.push(function () { clearInterval(timer); });
    dry();
  }

  window.HANPAN_CATALOG = catalog;
  renderCatalog();
  renderPlayPage();
})();
