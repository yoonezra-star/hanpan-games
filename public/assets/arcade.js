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
    { id: "brick-break", title: "벽돌깨기 미니", category: "arcade", type: "brick", minutes: "2분", description: "패들을 움직여 공을 받아내고 벽돌을 모두 깨며 레벨을 올립니다." },
    { id: "block-drop-classic", title: "블록 드롭 클래식", category: "puzzle", type: "tetris", minutes: "4분", description: "떨어지는 블록을 회전하고 쌓아 가로줄을 지우는 고전 퍼즐입니다." },
    { id: "pong-rally", title: "퐁 랠리", category: "arcade", type: "pong", minutes: "2분", description: "패들을 움직여 공을 받아내고 상대보다 먼저 득점하는 클래식 랠리 게임입니다." },
    { id: "space-guard", title: "우주 방어선", category: "arcade", type: "space", minutes: "3분", description: "좌우로 움직이며 탄을 쏘고 내려오는 적 편대를 막아내는 슈팅 게임입니다." },
    { id: "flappy-jump", title: "플래피 점프", category: "arcade", type: "flappy", minutes: "1분", description: "짧게 점프하며 기둥 사이를 통과하는 원버튼 회피 게임입니다." },
    { id: "bubble-pop", title: "버블팝", category: "arcade", type: "target", minutes: "1분", description: "반짝이는 버블을 놓치지 않고 눌러 점수를 모읍니다." },
    { id: "snake-garden", title: "뱀의 정원", category: "arcade", type: "snake", minutes: "2분", description: "정원을 돌아다니며 먹이를 먹고 몸을 늘리는 그리드 게임입니다." },
    { id: "airplane-dodge", title: "붕붕 비행기", category: "arcade", type: "lane", minutes: "1분", description: "세 개의 항로를 오가며 장애물을 피하는 비행 게임입니다." },
    { id: "chair-dash", title: "의자 질주", category: "arcade", type: "chair", minutes: "2분", description: "바퀴 달린 의자를 타고 사무실 통로를 미끄러지듯 달려 목적지에 도착합니다." },
    { id: "dessert-catch", title: "디저트 캐치", category: "arcade", type: "catcher", minutes: "1분", description: "떨어지는 디저트를 받아 점수를 올리고 탄 음식은 피합니다." },
    { id: "planet-toss", title: "행성 던지기", category: "arcade", type: "toss", minutes: "1분", description: "각도와 힘을 골라 목표 궤도에 행성을 던져 넣습니다." },
    { id: "tic-tac-toe", title: "틱택토", category: "board", type: "tictactoe", minutes: "1분", description: "세 칸을 먼저 잇는 클래식 보드 게임입니다." },
    { id: "connect-four", title: "사목 미니", category: "board", type: "connect4", minutes: "2분", description: "말을 떨어뜨려 네 개를 먼저 잇는 전략 게임입니다." },
    { id: "blackjack", title: "블랙잭 21", category: "board", type: "blackjack", minutes: "3분", description: "칩을 걸고 히트, 스탠드, 더블다운을 선택하며 딜러와 겨룹니다." },
    { id: "danger-dice", title: "위험한 주사위", category: "board", type: "dice", minutes: "1분", description: "계속 굴릴지 멈출지 결정해 목표 점수에 도전합니다." },
    { id: "rps-survival", title: "가위바위보 서바이벌", category: "board", type: "rps", minutes: "1분", description: "연승을 이어가며 살아남는 가위바위보 게임입니다." },
    { id: "slot-machine", title: "슬롯머신", category: "board", type: "slot", minutes: "30초", description: "세 칸의 그림을 맞춰 짧게 운을 시험합니다." },
    { id: "mines", title: "지뢰찾기 미니", category: "puzzle", type: "mines", minutes: "2분", description: "숫자 힌트를 보고 지뢰가 없는 칸을 모두 엽니다." },
    { id: "sliding-puzzle", title: "슬라이딩 퍼즐", category: "puzzle", type: "sliding", minutes: "2분", description: "빈 칸을 이용해 숫자 타일을 순서대로 맞춥니다." },
    { id: "sudoku-mini", title: "스도쿠 미니", category: "puzzle", type: "sudoku", minutes: "4분", description: "6x6 스도쿠 판을 완성하고 충돌 표시와 제한 힌트를 활용합니다." },
    { id: "twenty-48", title: "2048 한판", category: "puzzle", type: "twenty48", minutes: "3분", description: "같은 숫자 타일을 합쳐 더 큰 숫자를 만드는 퍼즐입니다." },
    { id: "match-three", title: "매치3 퍼즐", category: "puzzle", type: "match3", minutes: "3분", description: "인접한 타일을 바꿔 연쇄 매치를 만들고 제한 이동 안에 목표 점수를 넘깁니다." },
    { id: "block-fill", title: "블록 채우기", category: "puzzle", type: "blockfill", minutes: "2분", description: "빈 칸을 모두 채우되 폭탄 칸은 피하는 블록 퍼즐입니다." },
    { id: "simon", title: "사이먼 게임", category: "brain", type: "sequence", minutes: "2분", description: "빛나는 순서를 기억했다가 그대로 따라 누릅니다." },
    { id: "pattern-memory", title: "패턴 기억", category: "brain", type: "pattern", minutes: "1분", description: "잠깐 보이는 패턴을 기억해 같은 칸을 다시 선택합니다." },
    { id: "word-guess", title: "단어 맞추기", category: "brain", type: "word", minutes: "2분", description: "힌트를 보고 숨겨진 단어를 추리합니다." },
    { id: "hangman", title: "행맨", category: "brain", type: "hangman", minutes: "2분", description: "글자를 하나씩 골라 숨은 단어를 완성합니다." },
    { id: "typing-sprint", title: "타이핑 노선", category: "skill", type: "typing", minutes: "2분", description: "역 이름을 정확히 입력할수록 열차가 다음 역으로 달리는 타자 레이스입니다." },
    { id: "math-climb", title: "수학 등산", category: "brain", type: "math", minutes: "1분", description: "짧은 계산 문제를 풀며 산 정상까지 올라갑니다." },
    { id: "color-match", title: "색깔 맞추기", category: "test", type: "color", minutes: "1분", description: "글자와 색이 일치하는지 빠르게 판단합니다." },
    { id: "perfume-workshop", title: "향수 소트 공방", category: "test", type: "recipe", minutes: "3분", description: "뒤섞인 향 노트를 병끼리 옮겨 같은 향으로 정렬하는 컬러 소트 퍼즐입니다." },
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
    try {
      const prev = Number(localStorage.getItem(key));
      if (!Number.isFinite(prev) || better(value, prev)) {
        localStorage.setItem(key, String(value));
        return true;
      }
    } catch (error) {
      return false;
    }
    return false;
  }

  function getBest(id) {
    try {
      const value = Number(localStorage.getItem(`hanpan-arcade-${id}`));
      return Number.isFinite(value) ? value : null;
    } catch (error) {
      return null;
    }
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
            <a class="inline-link" href="/games/${game.id}/">게임 페이지</a>
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
    const requestedGame = new URLSearchParams(location.search).get("game") || surface.dataset.gameId;
    let current = catalog.find(function (game) { return game.id === requestedGame; }) || catalog[0];

    function drawPicker() {
      if (!picker) return;
      const query = (search && search.value ? search.value : "").trim().toLowerCase();
      picker.innerHTML = "";
      catalog
        .filter(function (game) {
          const text = `${game.title} ${game.description} ${categoryNames[game.category]}`.toLowerCase();
          return !query || text.includes(query);
        })
        .forEach(function (game) {
          const item = button(game.title, game.id === current.id ? "picker-item active" : "picker-item");
          item.innerHTML = `<strong>${game.title}</strong><small>${categoryNames[game.category]} · ${game.minutes}</small>`;
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
      document.title = `${current.title} - 한판게임즈`;
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
      tetris: renderTetris,
      pong: renderPong,
      space: renderSpaceGuard,
      flappy: renderFlappy,
      snake: renderSnake,
      lane: renderLane,
      chair: renderChairRace,
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
    let score = 0;
    let lives = 3;
    let level = 1;
    let running = false;
    let frame = null;
    let left = false;
    let right = false;
    const width = 640;
    const height = 380;
    const paddle = { x: 270, y: 346, w: 100, h: 14 };
    const ball = { x: 320, y: 316, dx: 3.2, dy: -3.6, r: 7 };
    let bricks = [];
    renderScore(surface, [
      { label: "점수", value: "0" },
      { label: "목숨", value: "3" },
      { label: "레벨", value: "1" },
      { label: "최고", value: getBest(game.id) || "-" }
    ]);
    const stats = surface.querySelectorAll(".mini-score b");
    const canvas = document.createElement("canvas");
    canvas.className = "arcade-canvas";
    canvas.width = width;
    canvas.height = height;
    canvas.setAttribute("aria-label", "벽돌깨기 게임 화면");
    surface.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const controls = document.createElement("div");
    controls.className = "mini-controls pad-controls";
    const start = button("시작", "button primary");
    const leftBtn = button("왼쪽", "button secondary");
    const rightBtn = button("오른쪽", "button secondary");
    controls.append(start, leftBtn, rightBtn);
    const guide = document.createElement("p");
    guide.className = "mini-note";
    guide.textContent = "방향키, 버튼, 마우스 이동으로 패들을 움직입니다. 공을 떨어뜨리지 않고 벽돌을 모두 깨면 다음 레벨로 갑니다.";
    surface.append(controls, guide);
    function buildBricks() {
      bricks = [];
      const rows = 4 + Math.min(level, 3);
      const cols = 8;
      const bw = 66;
      const bh = 22;
      const gap = 8;
      const startX = 34;
      const startY = 34;
      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          bricks.push({
            x: startX + c * (bw + gap),
            y: startY + r * (bh + gap),
            w: bw,
            h: bh,
            hp: r < level - 1 ? 2 : 1
          });
        }
      }
    }
    function resetBall() {
      ball.x = paddle.x + paddle.w / 2;
      ball.y = paddle.y - 22;
      ball.dx = 3.1 + level * 0.25;
      ball.dy = -3.5 - level * 0.22;
    }
    function sync() {
      stats[0].textContent = String(score);
      stats[1].textContent = String(lives);
      stats[2].textContent = String(level);
    }
    function draw() {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#fffaf0";
      ctx.fillRect(0, 0, width, height);
      bricks.forEach(function (brick) {
        ctx.fillStyle = brick.hp > 1 ? "#2877b9" : "#df4b38";
        ctx.fillRect(brick.x, brick.y, brick.w, brick.h);
        ctx.strokeStyle = "#1d2433";
        ctx.lineWidth = 2;
        ctx.strokeRect(brick.x, brick.y, brick.w, brick.h);
      });
      ctx.fillStyle = "#1d2433";
      ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fillStyle = "#ffcf5d";
      ctx.fill();
      ctx.strokeStyle = "#1d2433";
      ctx.lineWidth = 2;
      ctx.stroke();
      if (!running) {
        ctx.fillStyle = "rgba(29,36,51,0.78)";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "#fffdf7";
        ctx.font = "700 28px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(lives > 0 ? "시작을 눌러 플레이" : "게임 종료", width / 2, height / 2);
      }
    }
    function loseLife() {
      lives -= 1;
      sync();
      running = false;
      start.textContent = lives > 0 ? "계속" : "다시 시작";
      if (lives <= 0) {
        const isBest = saveBest(game.id, score, function (a, b) { return a > b; });
        setResult(isBest ? `게임 종료. 새 최고 점수 ${score}점입니다.` : `게임 종료. ${score}점입니다.`);
      } else {
        resetBall();
        setResult(`공을 놓쳤습니다. 목숨 ${lives}개 남았습니다.`);
      }
    }
    function nextLevel() {
      level += 1;
      score += 25;
      buildBricks();
      resetBall();
      running = false;
      start.textContent = "다음 레벨";
      setResult(`${level - 1}레벨 완료. 다음 레벨은 공이 조금 더 빠릅니다.`);
      sync();
    }
    function step() {
      if (running) {
        if (left) paddle.x -= 7;
        if (right) paddle.x += 7;
        paddle.x = Math.max(8, Math.min(width - paddle.w - 8, paddle.x));
        ball.x += ball.dx;
        ball.y += ball.dy;
        if (ball.x < ball.r || ball.x > width - ball.r) ball.dx *= -1;
        if (ball.y < ball.r) ball.dy *= -1;
        if (ball.y + ball.r >= paddle.y && ball.y - ball.r <= paddle.y + paddle.h && ball.x >= paddle.x && ball.x <= paddle.x + paddle.w && ball.dy > 0) {
          const offset = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
          ball.dx = offset * (4.2 + level * 0.25);
          ball.dy = -Math.abs(ball.dy);
        }
        bricks.forEach(function (brick) {
          if (brick.hp <= 0) return;
          const hit = ball.x + ball.r > brick.x && ball.x - ball.r < brick.x + brick.w && ball.y + ball.r > brick.y && ball.y - ball.r < brick.y + brick.h;
          if (!hit) return;
          brick.hp -= 1;
          ball.dy *= -1;
          score += brick.hp ? 3 : 10;
        });
        bricks = bricks.filter(function (brick) { return brick.hp > 0; });
        if (!bricks.length) nextLevel();
        if (ball.y > height + 20) loseLife();
        sync();
      }
      draw();
      frame = requestAnimationFrame(step);
    }
    function startGame() {
      if (lives <= 0) {
        score = 0;
        lives = 3;
        level = 1;
        paddle.x = 270;
        buildBricks();
        resetBall();
      }
      running = !running;
      start.textContent = running ? "일시정지" : "계속";
      setResult(running ? "공을 받아 벽돌을 깨세요." : "일시정지했습니다.");
      sync();
    }
    function onKey(event) {
      if (event.key === "ArrowLeft") { event.preventDefault(); left = event.type === "keydown"; }
      if (event.key === "ArrowRight") { event.preventDefault(); right = event.type === "keydown"; }
      if (event.key === " ") { event.preventDefault(); if (event.type === "keydown" && !event.repeat) startGame(); }
    }
    start.addEventListener("click", startGame);
    leftBtn.addEventListener("pointerdown", function () { left = true; });
    leftBtn.addEventListener("pointerup", function () { left = false; });
    leftBtn.addEventListener("pointerleave", function () { left = false; });
    rightBtn.addEventListener("pointerdown", function () { right = true; });
    rightBtn.addEventListener("pointerup", function () { right = false; });
    rightBtn.addEventListener("pointerleave", function () { right = false; });
    canvas.addEventListener("pointermove", function (event) {
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width * width;
      paddle.x = Math.max(8, Math.min(width - paddle.w - 8, x - paddle.w / 2));
    });
    document.addEventListener("keydown", onKey);
    document.addEventListener("keyup", onKey);
    cleanup.push(function () {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("keyup", onKey);
    });
    buildBricks();
    resetBall();
    sync();
    step();
  }

  function renderTetris(game, surface) {
    const cols = 10;
    const rows = 20;
    const cell = 24;
    let board = Array.from({ length: rows }, function () { return Array(cols).fill(0); });
    let piece = null;
    let nextPiece = null;
    let score = 0;
    let lines = 0;
    let level = 1;
    let running = false;
    let over = false;
    let dropTimer = null;
    let frame = null;
    const pieces = [
      { color: "#2877b9", shape: [[1,1,1,1]] },
      { color: "#df4b38", shape: [[1,1],[1,1]] },
      { color: "#258b62", shape: [[0,1,0],[1,1,1]] },
      { color: "#c88b19", shape: [[1,0,0],[1,1,1]] },
      { color: "#b9476a", shape: [[0,0,1],[1,1,1]] },
      { color: "#df8b38", shape: [[0,1,1],[1,1,0]] },
      { color: "#4b7f72", shape: [[1,1,0],[0,1,1]] }
    ];
    renderScore(surface, [
      { label: "점수", value: "0" },
      { label: "줄", value: "0" },
      { label: "레벨", value: "1" },
      { label: "최고", value: getBest(game.id) || "-" }
    ]);
    const stats = surface.querySelectorAll(".mini-score b");
    const canvas = document.createElement("canvas");
    canvas.className = "arcade-canvas tall-canvas";
    canvas.width = cols * cell;
    canvas.height = rows * cell;
    canvas.setAttribute("aria-label", "블록 드롭 클래식 게임 화면");
    surface.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const controls = document.createElement("div");
    controls.className = "mini-controls pad-controls";
    const start = button("시작", "button primary");
    const leftBtn = button("왼쪽", "button secondary");
    const rotateBtn = button("회전", "button secondary");
    const rightBtn = button("오른쪽", "button secondary");
    const downBtn = button("빠르게", "button secondary");
    controls.append(start, leftBtn, rotateBtn, rightBtn, downBtn);
    const guide = document.createElement("p");
    guide.className = "mini-note";
    guide.textContent = "방향키로 이동하고 위쪽 키로 회전합니다. 한 줄을 채우면 사라지고, 레벨이 오르면 낙하 속도가 빨라집니다.";
    surface.append(controls, guide);
    function cloneShape(shape) {
      return shape.map(function (row) { return row.slice(); });
    }
    function makePiece() {
      const base = sample(pieces);
      return { shape: cloneShape(base.shape), color: base.color, x: 3, y: 0 };
    }
    function rotateShape(shape) {
      return shape[0].map(function (_, c) {
        return shape.map(function (row) { return row[c]; }).reverse();
      });
    }
    function collides(testPiece, dx, dy, shape) {
      const targetShape = shape || testPiece.shape;
      for (let r = 0; r < targetShape.length; r += 1) {
        for (let c = 0; c < targetShape[r].length; c += 1) {
          if (!targetShape[r][c]) continue;
          const x = testPiece.x + c + dx;
          const y = testPiece.y + r + dy;
          if (x < 0 || x >= cols || y >= rows) return true;
          if (y >= 0 && board[y][x]) return true;
        }
      }
      return false;
    }
    function lockPiece() {
      piece.shape.forEach(function (row, r) {
        row.forEach(function (value, c) {
          if (value && piece.y + r >= 0) board[piece.y + r][piece.x + c] = piece.color;
        });
      });
      clearLines();
      spawn();
    }
    function clearLines() {
      let removed = 0;
      board = board.filter(function (row) {
        if (row.every(Boolean)) {
          removed += 1;
          return false;
        }
        return true;
      });
      while (board.length < rows) board.unshift(Array(cols).fill(0));
      if (removed) {
        lines += removed;
        score += [0, 100, 300, 500, 800][removed] * level;
        level = 1 + Math.floor(lines / 5);
        sync();
        restartDrop();
        setResult(`${removed}줄 제거. 레벨 ${level}입니다.`);
      }
    }
    function spawn() {
      piece = nextPiece || makePiece();
      piece.x = 3;
      piece.y = 0;
      nextPiece = makePiece();
      if (collides(piece, 0, 0)) {
        over = true;
        running = false;
        clearInterval(dropTimer);
        start.textContent = "다시 시작";
        const isBest = saveBest(game.id, score, function (a, b) { return a > b; });
        setResult(isBest ? `게임 종료. 새 최고 점수 ${score}점입니다.` : `게임 종료. ${score}점입니다.`);
      }
    }
    function sync() {
      stats[0].textContent = String(score);
      stats[1].textContent = String(lines);
      stats[2].textContent = String(level);
    }
    function move(dx, dy) {
      if (!piece || over) return false;
      if (!collides(piece, dx, dy)) {
        piece.x += dx;
        piece.y += dy;
        return true;
      }
      if (dy > 0) lockPiece();
      return false;
    }
    function rotate() {
      if (!piece || over) return;
      const next = rotateShape(piece.shape);
      if (!collides(piece, 0, 0, next)) piece.shape = next;
      else if (!collides(piece, -1, 0, next)) { piece.x -= 1; piece.shape = next; }
      else if (!collides(piece, 1, 0, next)) { piece.x += 1; piece.shape = next; }
    }
    function hardDrop() {
      if (!running || over) return;
      while (move(0, 1)) score += 1;
      sync();
    }
    function drop() {
      if (running && !over) move(0, 1);
    }
    function restartDrop() {
      clearInterval(dropTimer);
      if (running && !over) dropTimer = setInterval(drop, Math.max(130, 620 - level * 55));
    }
    function drawCell(x, y, color) {
      ctx.fillStyle = color;
      ctx.fillRect(x * cell + 1, y * cell + 1, cell - 2, cell - 2);
      ctx.strokeStyle = "#1d2433";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x * cell + 1, y * cell + 1, cell - 2, cell - 2);
    }
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#fffaf0";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(29,36,51,0.12)";
      for (let x = 0; x <= cols; x += 1) {
        ctx.beginPath();
        ctx.moveTo(x * cell, 0);
        ctx.lineTo(x * cell, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y <= rows; y += 1) {
        ctx.beginPath();
        ctx.moveTo(0, y * cell);
        ctx.lineTo(canvas.width, y * cell);
        ctx.stroke();
      }
      board.forEach(function (row, r) {
        row.forEach(function (value, c) { if (value) drawCell(c, r, value); });
      });
      if (piece) {
        piece.shape.forEach(function (row, r) {
          row.forEach(function (value, c) { if (value) drawCell(piece.x + c, piece.y + r, piece.color); });
        });
      }
      if (!running) {
        ctx.fillStyle = "rgba(29,36,51,0.74)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#fffdf7";
        ctx.font = "700 22px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(over ? "게임 종료" : "시작을 눌러 플레이", canvas.width / 2, canvas.height / 2);
      }
      frame = requestAnimationFrame(draw);
    }
    function reset() {
      board = Array.from({ length: rows }, function () { return Array(cols).fill(0); });
      score = 0;
      lines = 0;
      level = 1;
      over = false;
      nextPiece = makePiece();
      spawn();
      sync();
    }
    function toggle() {
      if (over) reset();
      running = !running;
      start.textContent = running ? "일시정지" : "계속";
      setResult(running ? "블록을 쌓아 줄을 지워 보세요." : "일시정지했습니다.");
      restartDrop();
    }
    function onKey(event) {
      if (!["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp", " "].includes(event.key)) return;
      event.preventDefault();
      if (event.type !== "keydown" || event.repeat) return;
      if (!running && event.key === " ") {
        toggle();
        return;
      }
      if (!running && event.key !== " ") toggle();
      if (event.key === "ArrowLeft") move(-1, 0);
      if (event.key === "ArrowRight") move(1, 0);
      if (event.key === "ArrowDown") move(0, 1);
      if (event.key === "ArrowUp") rotate();
      if (event.key === " ") hardDrop();
      sync();
    }
    start.addEventListener("click", toggle);
    leftBtn.addEventListener("click", function () { move(-1, 0); });
    rightBtn.addEventListener("click", function () { move(1, 0); });
    rotateBtn.addEventListener("click", rotate);
    downBtn.addEventListener("click", function () { move(0, 1); });
    document.addEventListener("keydown", onKey);
    cleanup.push(function () {
      clearInterval(dropTimer);
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
    });
    reset();
    draw();
  }

  function renderPong(game, surface) {
    const width = 640;
    const height = 360;
    let player = 140;
    let enemy = 140;
    let ball = { x: width / 2, y: height / 2, dx: 4.2, dy: 3.1, r: 8 };
    let playerScore = 0;
    let enemyScore = 0;
    let rally = 0;
    let running = false;
    let up = false;
    let down = false;
    let frame = null;
    renderScore(surface, [
      { label: "내 점수", value: "0" },
      { label: "상대", value: "0" },
      { label: "랠리", value: "0" },
      { label: "최고 랠리", value: getBest(game.id) || "-" }
    ]);
    const stats = surface.querySelectorAll(".mini-score b");
    const canvas = document.createElement("canvas");
    canvas.className = "arcade-canvas wide-canvas";
    canvas.width = width;
    canvas.height = height;
    canvas.setAttribute("aria-label", "퐁 랠리 게임 화면");
    surface.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const controls = document.createElement("div");
    controls.className = "mini-controls pad-controls";
    const start = button("시작", "button primary");
    const upBtn = button("위", "button secondary");
    const downBtn = button("아래", "button secondary");
    controls.append(start, upBtn, downBtn);
    const guide = document.createElement("p");
    guide.className = "mini-note";
    guide.textContent = "위아래 방향키나 버튼으로 왼쪽 패들을 움직입니다. 먼저 5점을 얻으면 승리합니다.";
    surface.append(controls, guide);
    function sync() {
      stats[0].textContent = String(playerScore);
      stats[1].textContent = String(enemyScore);
      stats[2].textContent = String(rally);
    }
    function resetBall(direction) {
      ball.x = width / 2;
      ball.y = height / 2;
      ball.dx = direction * (4 + Math.random() * 1.2);
      ball.dy = (Math.random() > 0.5 ? 1 : -1) * (2.4 + Math.random() * 1.8);
      rally = 0;
    }
    function endCheck() {
      if (playerScore >= 5 || enemyScore >= 5) {
        running = false;
        start.textContent = "다시 시작";
        if (playerScore > enemyScore) setResult("승리했습니다. 패들 각도로 더 긴 랠리에 도전해 보세요.");
        else setResult("상대가 먼저 5점을 얻었습니다.");
      }
    }
    function update() {
      if (running) {
        if (up) player -= 7;
        if (down) player += 7;
        player = Math.max(12, Math.min(height - 92, player));
        enemy += (ball.y - (enemy + 40)) * 0.075;
        enemy = Math.max(12, Math.min(height - 92, enemy));
        ball.x += ball.dx;
        ball.y += ball.dy;
        if (ball.y < ball.r || ball.y > height - ball.r) ball.dy *= -1;
        if (ball.x - ball.r < 30 && ball.y > player && ball.y < player + 80 && ball.dx < 0) {
          ball.dx = Math.abs(ball.dx) + 0.18;
          ball.dy += (ball.y - (player + 40)) * 0.045;
          rally += 1;
          saveBest(game.id, rally, function (a, b) { return a > b; });
        }
        if (ball.x + ball.r > width - 30 && ball.y > enemy && ball.y < enemy + 80 && ball.dx > 0) {
          ball.dx = -Math.abs(ball.dx) - 0.12;
          ball.dy += (ball.y - (enemy + 40)) * 0.035;
          rally += 1;
        }
        if (ball.x < -20) {
          enemyScore += 1;
          resetBall(1);
          endCheck();
        }
        if (ball.x > width + 20) {
          playerScore += 1;
          resetBall(-1);
          endCheck();
        }
        sync();
      }
    }
    function draw() {
      update();
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#fffaf0";
      ctx.fillRect(0, 0, width, height);
      ctx.setLineDash([10, 10]);
      ctx.strokeStyle = "rgba(29,36,51,0.25)";
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#2877b9";
      ctx.fillRect(18, player, 14, 80);
      ctx.fillStyle = "#df4b38";
      ctx.fillRect(width - 32, enemy, 14, 80);
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fillStyle = "#ffcf5d";
      ctx.fill();
      ctx.strokeStyle = "#1d2433";
      ctx.lineWidth = 2;
      ctx.stroke();
      if (!running) {
        ctx.fillStyle = "rgba(29,36,51,0.72)";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "#fffdf7";
        ctx.font = "700 26px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("시작을 눌러 랠리", width / 2, height / 2);
      }
      frame = requestAnimationFrame(draw);
    }
    function toggle() {
      if (playerScore >= 5 || enemyScore >= 5) {
        playerScore = 0;
        enemyScore = 0;
        resetBall(Math.random() > 0.5 ? 1 : -1);
      }
      running = !running;
      start.textContent = running ? "일시정지" : "계속";
      setResult(running ? "공을 놓치지 말고 받아내세요." : "일시정지했습니다.");
      sync();
    }
    function hold(which, value) {
      if (which === "up") up = value;
      if (which === "down") down = value;
    }
    function onKey(event) {
      if (!["ArrowUp", "ArrowDown", " "].includes(event.key)) return;
      event.preventDefault();
      if (event.key === "ArrowUp") hold("up", event.type === "keydown");
      if (event.key === "ArrowDown") hold("down", event.type === "keydown");
      if (event.key === " " && event.type === "keydown" && !event.repeat) toggle();
    }
    start.addEventListener("click", toggle);
    upBtn.addEventListener("pointerdown", function () { hold("up", true); });
    upBtn.addEventListener("pointerup", function () { hold("up", false); });
    upBtn.addEventListener("pointerleave", function () { hold("up", false); });
    downBtn.addEventListener("pointerdown", function () { hold("down", true); });
    downBtn.addEventListener("pointerup", function () { hold("down", false); });
    downBtn.addEventListener("pointerleave", function () { hold("down", false); });
    canvas.addEventListener("pointermove", function (event) {
      const rect = canvas.getBoundingClientRect();
      player = Math.max(12, Math.min(height - 92, (event.clientY - rect.top) / rect.height * height - 40));
    });
    document.addEventListener("keydown", onKey);
    document.addEventListener("keyup", onKey);
    cleanup.push(function () {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("keyup", onKey);
    });
    resetBall(Math.random() > 0.5 ? 1 : -1);
    sync();
    draw();
  }

  function renderSpaceGuard(game, surface) {
    const width = 640;
    const height = 390;
    let ship = width / 2;
    let bullets = [];
    let enemies = [];
    let score = 0;
    let lives = 3;
    let wave = 1;
    let running = false;
    let frame = null;
    let left = false;
    let right = false;
    let lastShot = 0;
    renderScore(surface, [
      { label: "점수", value: "0" },
      { label: "목숨", value: "3" },
      { label: "웨이브", value: "1" },
      { label: "최고", value: getBest(game.id) || "-" }
    ]);
    const stats = surface.querySelectorAll(".mini-score b");
    const canvas = document.createElement("canvas");
    canvas.className = "arcade-canvas wide-canvas";
    canvas.width = width;
    canvas.height = height;
    canvas.setAttribute("aria-label", "우주 방어선 게임 화면");
    surface.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const controls = document.createElement("div");
    controls.className = "mini-controls pad-controls";
    const start = button("시작", "button primary");
    const leftBtn = button("왼쪽", "button secondary");
    const fireBtn = button("발사", "button secondary");
    const rightBtn = button("오른쪽", "button secondary");
    controls.append(start, leftBtn, fireBtn, rightBtn);
    const guide = document.createElement("p");
    guide.className = "mini-note";
    guide.textContent = "좌우 방향키로 이동하고 스페이스바로 발사합니다. 적 편대가 바닥까지 내려오기 전에 막아내세요.";
    surface.append(controls, guide);
    function buildWave() {
      enemies = [];
      const rows = Math.min(3 + wave, 6);
      const cols = 8;
      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          enemies.push({ x: 72 + c * 62, y: 34 + r * 32, alive: true });
        }
      }
    }
    function sync() {
      stats[0].textContent = String(score);
      stats[1].textContent = String(lives);
      stats[2].textContent = String(wave);
    }
    function shoot() {
      const now = Date.now();
      if (!running || now - lastShot < 180) return;
      lastShot = now;
      bullets.push({ x: ship, y: height - 54 });
    }
    function finish(message) {
      running = false;
      start.textContent = lives > 0 ? "계속" : "다시 시작";
      const isBest = saveBest(game.id, score, function (a, b) { return a > b; });
      setResult(isBest ? `${message} 새 최고 점수 ${score}점입니다.` : message);
    }
    function update() {
      if (!running) return;
      if (left) ship -= 6.5;
      if (right) ship += 6.5;
      ship = Math.max(28, Math.min(width - 28, ship));
      bullets.forEach(function (bullet) { bullet.y -= 8; });
      bullets = bullets.filter(function (bullet) { return bullet.y > -20; });
      const speed = 0.28 + wave * 0.08;
      enemies.forEach(function (enemy, index) {
        enemy.x += Math.sin((Date.now() / 400) + index) * 0.45;
        enemy.y += speed;
      });
      bullets.forEach(function (bullet) {
        enemies.forEach(function (enemy) {
          if (!enemy.alive) return;
          if (Math.abs(bullet.x - enemy.x) < 20 && Math.abs(bullet.y - enemy.y) < 16) {
            enemy.alive = false;
            bullet.y = -99;
            score += 15;
          }
        });
      });
      enemies = enemies.filter(function (enemy) { return enemy.alive; });
      if (enemies.some(function (enemy) { return enemy.y > height - 74; })) {
        lives -= 1;
        if (lives <= 0) {
          sync();
          finish("방어선이 무너졌습니다.");
          return;
        }
        buildWave();
        setResult(`적이 방어선에 닿았습니다. 목숨 ${lives}개 남았습니다.`);
      }
      if (!enemies.length) {
        wave += 1;
        score += 40;
        buildWave();
        setResult(`${wave - 1}웨이브 방어 성공. 다음 편대가 더 빠릅니다.`);
      }
      sync();
    }
    function draw() {
      update();
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#101827";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = "rgba(255,255,255,0.58)";
      for (let i = 0; i < 42; i += 1) {
        const x = (i * 83 + 17) % width;
        const y = (i * 47 + Date.now() / 35) % height;
        ctx.fillRect(x, y, 2, 2);
      }
      enemies.forEach(function (enemy) {
        ctx.fillStyle = "#df4b38";
        ctx.fillRect(enemy.x - 17, enemy.y - 10, 34, 20);
        ctx.fillStyle = "#ffcf5d";
        ctx.fillRect(enemy.x - 7, enemy.y - 16, 14, 8);
      });
      ctx.fillStyle = "#ffcf5d";
      bullets.forEach(function (bullet) { ctx.fillRect(bullet.x - 2, bullet.y - 12, 4, 14); });
      ctx.fillStyle = "#2877b9";
      ctx.beginPath();
      ctx.moveTo(ship, height - 66);
      ctx.lineTo(ship - 26, height - 24);
      ctx.lineTo(ship + 26, height - 24);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#fffdf7";
      ctx.lineWidth = 2;
      ctx.stroke();
      if (!running) {
        ctx.fillStyle = "rgba(16,24,39,0.72)";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "#fffdf7";
        ctx.font = "700 26px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(lives > 0 ? "시작을 눌러 방어" : "게임 종료", width / 2, height / 2);
      }
      frame = requestAnimationFrame(draw);
    }
    function reset() {
      ship = width / 2;
      bullets = [];
      score = 0;
      lives = 3;
      wave = 1;
      buildWave();
      sync();
    }
    function toggle() {
      if (lives <= 0) reset();
      running = !running;
      start.textContent = running ? "일시정지" : "계속";
      setResult(running ? "적 편대를 막아내세요." : "일시정지했습니다.");
    }
    function hold(which, value) {
      if (which === "left") left = value;
      if (which === "right") right = value;
    }
    function onKey(event) {
      if (!["ArrowLeft", "ArrowRight", " "].includes(event.key)) return;
      event.preventDefault();
      if (event.key === "ArrowLeft") hold("left", event.type === "keydown");
      if (event.key === "ArrowRight") hold("right", event.type === "keydown");
      if (event.key === " " && event.type === "keydown" && !event.repeat) {
        if (!running) toggle();
        else shoot();
      }
    }
    start.addEventListener("click", toggle);
    fireBtn.addEventListener("click", shoot);
    leftBtn.addEventListener("pointerdown", function () { hold("left", true); });
    leftBtn.addEventListener("pointerup", function () { hold("left", false); });
    leftBtn.addEventListener("pointerleave", function () { hold("left", false); });
    rightBtn.addEventListener("pointerdown", function () { hold("right", true); });
    rightBtn.addEventListener("pointerup", function () { hold("right", false); });
    rightBtn.addEventListener("pointerleave", function () { hold("right", false); });
    document.addEventListener("keydown", onKey);
    document.addEventListener("keyup", onKey);
    cleanup.push(function () {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("keyup", onKey);
    });
    reset();
    draw();
  }

  function renderFlappy(game, surface) {
    const width = 520;
    const height = 360;
    let bird = { x: 100, y: 170, vy: 0 };
    let pipes = [];
    let score = 0;
    let lives = 1;
    let running = false;
    let frame = null;
    let tick = 0;
    renderScore(surface, [
      { label: "통과", value: "0" },
      { label: "상태", value: "준비" },
      { label: "최고", value: getBest(game.id) || "-" }
    ]);
    const stats = surface.querySelectorAll(".mini-score b");
    const canvas = document.createElement("canvas");
    canvas.className = "arcade-canvas wide-canvas";
    canvas.width = width;
    canvas.height = height;
    canvas.setAttribute("aria-label", "플래피 점프 게임 화면");
    surface.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const controls = document.createElement("div");
    controls.className = "mini-controls pad-controls";
    const start = button("시작", "button primary");
    const jump = button("점프", "button secondary");
    controls.append(start, jump);
    const guide = document.createElement("p");
    guide.className = "mini-note";
    guide.textContent = "스페이스바나 점프 버튼을 짧게 눌러 높이를 조절합니다. 기둥 사이를 통과할 때마다 점수가 오릅니다.";
    surface.append(controls, guide);
    function addPipe() {
      const gap = 118;
      const top = 50 + Math.random() * 155;
      pipes.push({ x: width + 20, top, bottom: top + gap, passed: false });
    }
    function sync(status) {
      stats[0].textContent = String(score);
      stats[1].textContent = status || (running ? "비행" : "준비");
    }
    function reset() {
      bird = { x: 100, y: 170, vy: 0 };
      pipes = [];
      score = 0;
      lives = 1;
      tick = 0;
      addPipe();
      sync("준비");
    }
    function flap() {
      if (!running) {
        running = true;
        start.textContent = "일시정지";
        setResult("기둥 사이를 통과하세요.");
      }
      sync("비행");
      bird.vy = -7.2;
    }
    function finish() {
      running = false;
      lives = 0;
      start.textContent = "다시 시작";
      const isBest = saveBest(game.id, score, function (a, b) { return a > b; });
      sync("종료");
      setResult(isBest ? `충돌했습니다. 새 최고 기록 ${score}개입니다.` : `충돌했습니다. ${score}개를 통과했습니다.`);
    }
    function update() {
      if (!running) return;
      tick += 1;
      bird.vy += 0.42;
      bird.y += bird.vy;
      pipes.forEach(function (pipe) { pipe.x -= 2.8; });
      pipes = pipes.filter(function (pipe) { return pipe.x > -70; });
      if (!pipes.length || pipes[pipes.length - 1].x < width - 185) addPipe();
      pipes.forEach(function (pipe) {
        if (!pipe.passed && pipe.x + 48 < bird.x) {
          pipe.passed = true;
          score += 1;
          sync("비행");
        }
        const inX = bird.x + 13 > pipe.x && bird.x - 13 < pipe.x + 48;
        const inGap = bird.y - 13 > pipe.top && bird.y + 13 < pipe.bottom;
        if (inX && !inGap) finish();
      });
      if (bird.y < 0 || bird.y > height - 24) finish();
    }
    function draw() {
      update();
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#dcecf7";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = "#fffdf7";
      for (let i = 0; i < 5; i += 1) {
        ctx.beginPath();
        ctx.arc((i * 130 + tick) % (width + 80) - 40, 70 + (i % 3) * 34, 18, 0, Math.PI * 2);
        ctx.arc((i * 130 + tick) % (width + 80) - 15, 70 + (i % 3) * 34, 24, 0, Math.PI * 2);
        ctx.fill();
      }
      pipes.forEach(function (pipe) {
        ctx.fillStyle = "#258b62";
        ctx.fillRect(pipe.x, 0, 48, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, 48, height - pipe.bottom);
        ctx.strokeStyle = "#1d2433";
        ctx.lineWidth = 2;
        ctx.strokeRect(pipe.x, 0, 48, pipe.top);
        ctx.strokeRect(pipe.x, pipe.bottom, 48, height - pipe.bottom);
      });
      ctx.fillStyle = "#ffcf5d";
      ctx.beginPath();
      ctx.arc(bird.x, bird.y, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#1d2433";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#1d2433";
      ctx.fillRect(0, height - 20, width, 20);
      if (!running) {
        ctx.fillStyle = "rgba(29,36,51,0.68)";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "#fffdf7";
        ctx.font = "700 24px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(lives > 0 ? "점프해서 시작" : "게임 종료", width / 2, height / 2);
      }
      frame = requestAnimationFrame(draw);
    }
    function toggle() {
      if (lives <= 0) reset();
      running = !running;
      start.textContent = running ? "일시정지" : "계속";
      setResult(running ? "높이를 조절하며 기둥 사이를 통과하세요." : "일시정지했습니다.");
      sync();
    }
    function onKey(event) {
      if (event.key !== " ") return;
      event.preventDefault();
      if (event.type === "keydown" && !event.repeat) flap();
    }
    start.addEventListener("click", toggle);
    jump.addEventListener("click", flap);
    canvas.addEventListener("pointerdown", flap);
    document.addEventListener("keydown", onKey);
    cleanup.push(function () {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
    });
    reset();
    draw();
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

  function renderChairRace(game, surface) {
    const width = 640;
    const height = 420;
    let chair = { x: 74, y: 342, angle: -0.18, speed: 0 };
    let running = false;
    let finished = false;
    let frame = null;
    let startTime = 0;
    let snack = { x: 320, y: 210, active: true, boost: 0 };
    const keys = { left: false, right: false, boost: false };
    const goal = { x: 540, y: 46, w: 68, h: 58 };
    const walls = [
      { x: 0, y: 0, w: width, h: 12 },
      { x: 0, y: height - 12, w: width, h: 12 },
      { x: 0, y: 0, w: 12, h: height },
      { x: width - 12, y: 0, w: 12, h: height },
      { x: 116, y: 74, w: 34, h: 242 },
      { x: 232, y: 22, w: 34, h: 250 },
      { x: 358, y: 150, w: 34, h: 250 },
      { x: 474, y: 22, w: 34, h: 260 },
      { x: 156, y: 326, w: 148, h: 28 },
      { x: 406, y: 94, w: 118, h: 28 }
    ];
    renderScore(surface, [
      { label: "시간", value: "0.0" },
      { label: "속도", value: "0" },
      { label: "충돌", value: "0" },
      { label: "최고", value: getBest(game.id) ? `${getBest(game.id)}초` : "-" }
    ]);
    const stats = surface.querySelectorAll(".mini-score b");
    const canvas = document.createElement("canvas");
    canvas.className = "arcade-canvas wide-canvas";
    canvas.width = width;
    canvas.height = height;
    canvas.setAttribute("aria-label", "의자 질주 게임 화면");
    surface.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const controls = document.createElement("div");
    controls.className = "mini-controls pad-controls";
    const start = button("시작", "button primary");
    const leftBtn = button("왼쪽", "button secondary");
    const boostBtn = button("밀기", "button secondary");
    const rightBtn = button("오른쪽", "button secondary");
    controls.append(start, leftBtn, boostBtn, rightBtn);
    const guide = document.createElement("p");
    guide.className = "mini-note";
    guide.textContent = "좌우로 방향을 돌리고 위쪽 키나 스페이스바로 의자를 밀어 주세요. 관성이 있어 코너 전에 미리 방향을 잡는 것이 중요합니다.";
    surface.append(controls, guide);
    let bumps = 0;
    function hitRect(x, y, rect) {
      return x > rect.x && x < rect.x + rect.w && y > rect.y && y < rect.y + rect.h;
    }
    function reset() {
      chair = { x: 74, y: 342, angle: -0.18, speed: 0 };
      running = false;
      finished = false;
      startTime = 0;
      snack = { x: 320, y: 210, active: true, boost: 0 };
      bumps = 0;
      start.textContent = "시작";
      stats[0].textContent = "0.0";
      stats[1].textContent = "0";
      stats[2].textContent = "0";
      setResult("회의실까지 의자를 몰고 가세요.");
    }
    function finish() {
      finished = true;
      running = false;
      start.textContent = "다시 시작";
      const elapsed = Number(((Date.now() - startTime) / 1000).toFixed(1));
      const isBest = saveBest(game.id, elapsed, function (a, b) { return a < b; });
      setResult(isBest ? `${elapsed}초 도착. 새 최고 기록입니다.` : `${elapsed}초 만에 회의실에 도착했습니다.`);
    }
    function update() {
      if (!running || finished) return;
      if (keys.left) chair.angle -= 0.055;
      if (keys.right) chair.angle += 0.055;
      if (keys.boost) chair.speed += snack.boost > 0 ? 0.19 : 0.13;
      if (snack.boost > 0) snack.boost -= 1;
      chair.speed *= 0.982;
      chair.speed = Math.max(-1.6, Math.min(snack.boost > 0 ? 6.6 : 4.8, chair.speed));
      const prev = { x: chair.x, y: chair.y };
      chair.x += Math.cos(chair.angle) * chair.speed;
      chair.y += Math.sin(chair.angle) * chair.speed;
      if (walls.some(function (wall) { return hitRect(chair.x, chair.y, wall); })) {
        chair.x = prev.x;
        chair.y = prev.y;
        chair.speed *= -0.42;
        chair.angle += 0.42;
        bumps += 1;
      }
      if (snack.active && Math.hypot(chair.x - snack.x, chair.y - snack.y) < 22) {
        snack.active = false;
        snack.boost = 190;
        setResult("간식 버프. 잠깐 더 빠르게 밀 수 있습니다.");
      }
      if (hitRect(chair.x, chair.y, goal)) finish();
      stats[0].textContent = ((Date.now() - startTime) / 1000).toFixed(1);
      stats[1].textContent = String(Math.round(Math.abs(chair.speed) * 10));
      stats[2].textContent = String(bumps);
    }
    function draw() {
      update();
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#f3efe5";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = "#e5ddcc";
      for (let x = 40; x < width; x += 76) for (let y = 36; y < height; y += 76) ctx.fillRect(x, y, 34, 20);
      ctx.fillStyle = "#dff3e8";
      ctx.fillRect(goal.x, goal.y, goal.w, goal.h);
      ctx.strokeStyle = "#258b62";
      ctx.lineWidth = 3;
      ctx.strokeRect(goal.x, goal.y, goal.w, goal.h);
      ctx.fillStyle = "#258b62";
      ctx.font = "700 16px sans-serif";
      ctx.fillText("회의실", goal.x + 11, goal.y + 34);
      ctx.fillStyle = "#1d2433";
      walls.forEach(function (wall) { ctx.fillRect(wall.x, wall.y, wall.w, wall.h); });
      if (snack.active) {
        ctx.fillStyle = "#ffcf5d";
        ctx.beginPath();
        ctx.arc(snack.x, snack.y, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#1d2433";
        ctx.stroke();
      }
      ctx.save();
      ctx.translate(chair.x, chair.y);
      ctx.rotate(chair.angle);
      ctx.fillStyle = snack.boost > 0 ? "#df4b38" : "#2877b9";
      ctx.fillRect(-17, -12, 34, 24);
      ctx.fillStyle = "#fffdf7";
      ctx.fillRect(-8, -18, 16, 8);
      ctx.strokeStyle = "#1d2433";
      ctx.lineWidth = 2;
      ctx.strokeRect(-17, -12, 34, 24);
      ctx.restore();
      if (!running) {
        ctx.fillStyle = "rgba(29,36,51,0.7)";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "#fffdf7";
        ctx.font = "700 26px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(finished ? "도착 완료" : "시작을 눌러 질주", width / 2, height / 2);
      }
      frame = requestAnimationFrame(draw);
    }
    function toggle() {
      if (finished) reset();
      running = !running;
      if (running && !startTime) startTime = Date.now();
      if (running && stats[0].textContent === "0.0") startTime = Date.now();
      start.textContent = running ? "일시정지" : "계속";
      setResult(running ? "관성을 이용해 목적지까지 달려 보세요." : "일시정지했습니다.");
    }
    function hold(which, value) {
      keys[which] = value;
    }
    function onKey(event) {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", " "].includes(event.key)) return;
      event.preventDefault();
      if (event.key === "ArrowLeft") hold("left", event.type === "keydown");
      if (event.key === "ArrowRight") hold("right", event.type === "keydown");
      if (event.key === "ArrowUp") hold("boost", event.type === "keydown");
      if (event.key === " " && event.type === "keydown" && !event.repeat) {
        if (!running) toggle();
        hold("boost", true);
      }
      if (event.key === " " && event.type === "keyup") hold("boost", false);
    }
    start.addEventListener("click", toggle);
    leftBtn.addEventListener("pointerdown", function () { hold("left", true); });
    leftBtn.addEventListener("pointerup", function () { hold("left", false); });
    leftBtn.addEventListener("pointerleave", function () { hold("left", false); });
    rightBtn.addEventListener("pointerdown", function () { hold("right", true); });
    rightBtn.addEventListener("pointerup", function () { hold("right", false); });
    rightBtn.addEventListener("pointerleave", function () { hold("right", false); });
    boostBtn.addEventListener("pointerdown", function () { if (!running) toggle(); hold("boost", true); });
    boostBtn.addEventListener("pointerup", function () { hold("boost", false); });
    boostBtn.addEventListener("pointerleave", function () { hold("boost", false); });
    document.addEventListener("keydown", onKey);
    document.addEventListener("keyup", onKey);
    cleanup.push(function () {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("keyup", onKey);
    });
    reset();
    draw();
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
    let bank = 100;
    let bet = 10;
    let roundOver = false;
    let deck = [];
    let player = [];
    let dealer = [];
    renderScore(surface, [
      { label: "칩", value: "100" },
      { label: "베팅", value: "10" },
      { label: "최고 칩", value: getBest(game.id) || "-" }
    ]);
    const stats = surface.querySelectorAll(".mini-score b");
    surface.insertAdjacentHTML("beforeend", `
      <div class="card-table">
        <div class="table-row"><strong>딜러</strong><div class="card-hand" id="dealerHand"></div><small id="dealerTotal"></small></div>
        <div class="table-row"><strong>플레이어</strong><div class="card-hand" id="playerHand"></div><small id="playerTotal"></small></div>
      </div>
      <div class="mini-controls">
        <button class="button secondary" id="betDown" type="button">-10</button>
        <button class="button secondary" id="betUp" type="button">+10</button>
        <button class="button secondary" id="hit" type="button">한 장 더</button>
        <button class="button secondary" id="doubleDown" type="button">더블</button>
        <button class="button primary" id="stand" type="button">멈추기</button>
        <button class="button primary" id="nextRound" type="button">다음 라운드</button>
      </div>
      <p class="mini-note">A는 1 또는 11로 계산됩니다. 딜러는 17 이상에서 멈추고, 더블은 한 장만 받고 바로 승부합니다.</p>
    `);
    const dealerHand = $("#dealerHand", surface);
    const playerHand = $("#playerHand", surface);
    const dealerTotal = $("#dealerTotal", surface);
    const playerTotal = $("#playerTotal", surface);
    const hit = $("#hit", surface);
    const stand = $("#stand", surface);
    const doubleDown = $("#doubleDown", surface);
    const nextRound = $("#nextRound", surface);
    function freshDeck() {
      const ranks = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
      const suits = ["♠","♥","♦","♣"];
      return shuffle(suits.flatMap(function (suit) {
        return ranks.map(function (rank) { return { rank, suit }; });
      }));
    }
    function value(card) {
      if (card.rank === "A") return 1;
      if (["J", "Q", "K"].includes(card.rank)) return 10;
      return Number(card.rank);
    }
    function sum(cards) {
      let total = cards.reduce(function (a, b) { return a + value(b); }, 0);
      const aces = cards.filter(function (card) { return card.rank === "A"; }).length;
      for (let i = 0; i < aces; i += 1) {
        if (total + 10 <= 21) total += 10;
      }
      return total;
    }
    function drawCard(card, hidden) {
      const item = document.createElement("span");
      item.className = "playing-card";
      item.textContent = hidden ? "?" : `${card.rank}${card.suit}`;
      if (!hidden && (card.suit === "♥" || card.suit === "♦")) item.classList.add("red-card");
      return item;
    }
    function draw(revealDealer) {
      stats[0].textContent = String(bank);
      stats[1].textContent = String(bet);
      dealerHand.innerHTML = "";
      playerHand.innerHTML = "";
      dealer.forEach(function (card, index) { dealerHand.appendChild(drawCard(card, !revealDealer && index === 1)); });
      player.forEach(function (card) { playerHand.appendChild(drawCard(card, false)); });
      dealerTotal.textContent = revealDealer ? `합계 ${sum(dealer)}` : `보이는 패 ${value(dealer[0])}`;
      playerTotal.textContent = `합계 ${sum(player)}`;
      hit.disabled = roundOver;
      stand.disabled = roundOver;
      doubleDown.disabled = roundOver || player.length !== 2 || bank < bet;
      nextRound.disabled = !roundOver || bank <= 0;
      $("#betDown", surface).disabled = !roundOver || bet <= 10;
      $("#betUp", surface).disabled = !roundOver || bet + 10 > bank;
    }
    function deal() {
      if (bank <= 0) {
        setResult("칩이 모두 떨어졌습니다. 다시 시작 버튼으로 새 테이블을 열어 주세요.");
        return;
      }
      if (bet > bank) bet = bank;
      deck = freshDeck();
      player = [deck.pop(), deck.pop()];
      dealer = [deck.pop(), deck.pop()];
      roundOver = false;
      setResult("내 차례입니다. 21에 가까워지도록 선택하세요.");
      if (sum(player) === 21) finish("blackjack");
      else draw(false);
    }
    function finish(reason) {
      const ps = sum(player);
      if (ps <= 21) {
        while (sum(dealer) < 17) dealer.push(deck.pop());
      }
      const ds = sum(dealer);
      let message = "패배했습니다.";
      let delta = -bet;
      if (reason === "blackjack") {
        delta = Math.round(bet * 1.5);
        message = "블랙잭입니다. 1.5배로 승리했습니다.";
      } else if (ps > 21) {
        message = "버스트. 21을 넘었습니다.";
      } else if (ds > 21 || ps > ds) {
        delta = bet;
        message = "승리했습니다.";
      } else if (ps === ds) {
        delta = 0;
        message = "비겼습니다.";
      }
      bank += delta;
      roundOver = true;
      if (bank > 0) saveBest(game.id, bank, function (a, b) { return a > b; });
      draw(true);
      setResult(`${message} 칩 ${delta >= 0 ? "+" : ""}${delta}.`);
    }
    hit.addEventListener("click", function () {
      player.push(deck.pop());
      if (sum(player) > 21) finish();
      else draw(false);
    });
    stand.addEventListener("click", function () { finish(); });
    doubleDown.addEventListener("click", function () {
      if (bank < bet) return;
      bet *= 2;
      player.push(deck.pop());
      finish();
    });
    $("#betDown", surface).addEventListener("click", function () {
      if (!roundOver || bet <= 10) return;
      bet -= 10;
      draw(true);
    });
    $("#betUp", surface).addEventListener("click", function () {
      if (!roundOver || bet + 10 > bank) return;
      bet += 10;
      draw(true);
    });
    nextRound.addEventListener("click", deal);
    roundOver = true;
    deal();
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
    const size = 6;
    const mineTotal = 7;
    let mineSet = null;
    let opened = 0;
    let flags = new Set();
    let flagMode = false;
    let gameOver = false;
    renderScore(surface, [
      { label: "안전 칸", value: `0/${size * size - mineTotal}` },
      { label: "깃발", value: `0/${mineTotal}` },
      { label: "최고", value: getBest(game.id) || "-" }
    ]);
    const stats = surface.querySelectorAll(".mini-score b");
    const controls = document.createElement("div");
    controls.className = "mini-controls";
    const flagToggle = button("깃발 모드 끄기", "button secondary");
    flagToggle.setAttribute("aria-pressed", "false");
    controls.appendChild(flagToggle);
    surface.appendChild(controls);
    const grid = makeGrid(size * size, "mini-grid mines-grid");
    surface.appendChild(grid);
    const guide = document.createElement("p");
    guide.className = "mini-note";
    guide.textContent = "첫 클릭은 안전합니다. 숫자는 주변 8칸의 지뢰 수이고, 깃발 모드로 의심 칸을 표시할 수 있습니다.";
    surface.appendChild(guide);
    function neighbors(index) {
      const r = Math.floor(index / size);
      const c = index % size;
      const items = [];
      for (let dr = -1; dr <= 1; dr += 1) for (let dc = -1; dc <= 1; dc += 1) {
        if (!dr && !dc) continue;
        const rr = r + dr;
        const cc = c + dc;
        if (rr >= 0 && rr < size && cc >= 0 && cc < size) items.push(rr * size + cc);
      }
      return items;
    }
    function buildMines(firstIndex) {
      const forbidden = new Set(neighbors(firstIndex).concat([firstIndex]));
      mineSet = new Set();
      while (mineSet.size < mineTotal) {
        const index = Math.floor(Math.random() * size * size);
        if (!forbidden.has(index)) mineSet.add(index);
      }
    }
    function count(index) {
      return neighbors(index).filter(function (pos) { return mineSet.has(pos); }).length;
    }
    function syncStats() {
      stats[0].textContent = `${opened}/${size * size - mineTotal}`;
      stats[1].textContent = `${flags.size}/${mineTotal}`;
    }
    function revealAll() {
      Array.from(grid.children).forEach(function (cell, index) {
        cell.disabled = true;
        if (mineSet && mineSet.has(index)) {
          cell.textContent = "×";
          cell.classList.add("danger");
        }
      });
    }
    function openCell(index) {
      const cell = grid.children[index];
      if (!cell || cell.disabled || flags.has(index) || gameOver) return;
      if (!mineSet) buildMines(index);
      if (mineSet.has(index)) {
        gameOver = true;
        revealAll();
        setResult("지뢰를 밟았습니다. 깃발과 숫자 흐름을 다시 읽어 보세요.");
        return;
      }
      const n = count(index);
      cell.disabled = true;
      cell.classList.add("done");
      cell.textContent = n ? String(n) : "";
      opened += 1;
      if (!n) neighbors(index).forEach(openCell);
      if (opened === size * size - mineTotal) {
        gameOver = true;
        revealAll();
        const isBest = saveBest(game.id, flags.size, function (a, b) { return a < b; });
        setResult(isBest ? "모든 안전 칸을 열었습니다. 깔끔한 새 기록입니다." : "모든 안전 칸을 열었습니다.");
      } else {
        setResult(n ? `주변 지뢰 ${n}개. 이어서 안전 칸을 찾아보세요.` : "빈 구역이 열렸습니다.");
      }
      syncStats();
    }
    function toggleFlag(index) {
      if (gameOver) return;
      const cell = grid.children[index];
      if (cell.disabled) return;
      if (flags.has(index)) {
        flags.delete(index);
        cell.textContent = "";
        cell.classList.remove("flagged");
      } else {
        flags.add(index);
        cell.textContent = "!";
        cell.classList.add("flagged");
      }
      syncStats();
    }
    flagToggle.addEventListener("click", function () {
      flagMode = !flagMode;
      flagToggle.textContent = flagMode ? "깃발 모드 켜짐" : "깃발 모드 끄기";
      flagToggle.classList.toggle("active", flagMode);
      flagToggle.setAttribute("aria-pressed", flagMode ? "true" : "false");
      setResult(flagMode ? "의심 칸을 눌러 깃발을 꽂으세요." : "칸을 눌러 열 수 있습니다.");
    });
    Array.from(grid.children).forEach(function (cell, index) {
      cell.textContent = "";
      cell.addEventListener("click", function () {
        if (flagMode) toggleFlag(index);
        else openCell(index);
      });
      cell.addEventListener("contextmenu", function (event) {
        event.preventDefault();
        toggleFlag(index);
      });
    });
    setResult("안전해 보이는 첫 칸을 열어 보세요.");
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
    const size = 6;
    const puzzle = [
      1,0,0,4,0,6,
      0,5,6,0,2,0,
      2,0,0,5,0,1,
      0,6,1,0,3,0,
      3,0,5,0,0,2,
      0,1,0,3,4,0
    ];
    const answer = [
      1,2,3,4,5,6,
      4,5,6,1,2,3,
      2,3,4,5,6,1,
      5,6,1,2,3,4,
      3,4,5,6,1,2,
      6,1,2,3,4,5
    ];
    let mistakes = 0;
    let hints = 0;
    renderScore(surface, [
      { label: "완성", value: "0/20" },
      { label: "실수", value: "0" },
      { label: "힌트", value: "3" }
    ]);
    const stats = surface.querySelectorAll(".mini-score b");
    const grid = document.createElement("div");
    grid.className = "mini-grid sudoku-grid size-6";
    surface.appendChild(grid);
    function filledCount() {
      return Array.from(grid.querySelectorAll("input")).filter(function (input) { return input.value; }).length;
    }
    function peers(index) {
      const row = Math.floor(index / size);
      const col = index % size;
      const boxRow = Math.floor(row / 2) * 2;
      const boxCol = Math.floor(col / 3) * 3;
      const items = new Set();
      for (let c = 0; c < size; c += 1) items.add(row * size + c);
      for (let r = 0; r < size; r += 1) items.add(r * size + col);
      for (let r = boxRow; r < boxRow + 2; r += 1) for (let c = boxCol; c < boxCol + 3; c += 1) items.add(r * size + c);
      items.delete(index);
      return Array.from(items);
    }
    function valueAt(index) {
      const fixed = puzzle[index];
      if (fixed) return String(fixed);
      const input = grid.querySelector(`input[data-index="${index}"]`);
      return input ? input.value : "";
    }
    function sync() {
      const inputs = Array.from(grid.querySelectorAll("input"));
      inputs.forEach(function (input) {
        const index = Number(input.dataset.index);
        const value = input.value;
        const conflict = value && peers(index).some(function (peer) { return valueAt(peer) === value; });
        input.classList.toggle("error", Boolean(conflict));
        input.setAttribute("aria-invalid", conflict ? "true" : "false");
      });
      stats[0].textContent = `${filledCount()}/${inputs.length}`;
      stats[1].textContent = String(mistakes);
      stats[2].textContent = String(3 - hints);
    }
    puzzle.forEach(function (value, index) {
      if (value) {
        const fixed = document.createElement("span");
        fixed.className = "mini-cell done";
        fixed.textContent = String(value);
        fixed.setAttribute("aria-label", `고정 숫자 ${value}`);
        grid.appendChild(fixed);
      } else {
        const input = document.createElement("input");
        input.className = "sudoku-input";
        input.type = "number";
        input.min = "1";
        input.max = "6";
        input.inputMode = "numeric";
        input.placeholder = "·";
        input.dataset.index = String(index);
        input.setAttribute("aria-label", `빈 칸 ${index + 1}`);
        input.addEventListener("input", function () {
          input.value = input.value.replace(/[^1-6]/g, "").slice(0, 1);
          sync();
        });
        grid.appendChild(input);
      }
    });
    const controls = document.createElement("div");
    controls.className = "mini-controls";
    const check = button("정답 확인", "button primary");
    const hint = button("힌트", "button secondary");
    controls.append(check, hint);
    const guide = document.createElement("p");
    guide.className = "mini-note";
    guide.textContent = "각 행, 열, 2x3 박스에는 1부터 6까지 한 번씩 들어갑니다. 충돌하는 숫자는 바로 표시됩니다.";
    surface.append(controls, guide);
    check.addEventListener("click", function () {
      const ok = Array.from(grid.querySelectorAll("input")).every(function (input) {
        return Number(input.value) === answer[Number(input.dataset.index)];
      });
      if (ok) {
        const score = Math.max(0, 100 - mistakes * 8 - hints * 10);
        const isBest = saveBest(game.id, score, function (a, b) { return a > b; });
        setResult(isBest ? `스도쿠 완성. 새 최고 점수 ${score}점입니다.` : `스도쿠 완성. 점수 ${score}점입니다.`);
        Array.from(grid.querySelectorAll("input")).forEach(function (input) { input.disabled = true; input.classList.add("solved"); });
      } else {
        mistakes += 1;
        setResult("아직 맞지 않는 칸이 있습니다. 충돌 표시를 먼저 확인해 보세요.");
        sync();
      }
    });
    hint.addEventListener("click", function () {
      if (hints >= 3) {
        setResult("힌트는 한 판에 3번까지 사용할 수 있습니다.");
        return;
      }
      const empty = Array.from(grid.querySelectorAll("input")).filter(function (input) { return !input.value; });
      if (!empty.length) return;
      const input = sample(empty);
      const index = Number(input.dataset.index);
      input.value = String(answer[index]);
      input.classList.add("hinted");
      hints += 1;
      setResult(`힌트를 사용했습니다. ${3 - hints}번 남았습니다.`);
      sync();
    });
    sync();
  }

  function render2048(game, surface) {
    let board = Array(16).fill(0);
    let score = 0;
    let moves = 0;
    let finished = false;
    renderScore(surface, [
      { label: "점수", value: "0" },
      { label: "최대 타일", value: "2" },
      { label: "최고", value: getBest(game.id) || "-" }
    ]);
    const stats = surface.querySelectorAll(".mini-score b");
    const grid = makeGrid(16, "mini-grid board-2048");
    grid.setAttribute("tabindex", "0");
    grid.setAttribute("aria-label", "2048 보드. 방향키로 이동할 수 있습니다.");
    surface.appendChild(grid);
    const controls = document.createElement("div");
    controls.className = "mini-controls pad-controls";
    ["위", "왼쪽", "오른쪽", "아래"].forEach(function (label) {
      const item = button(label, "button secondary");
      item.dataset.dir = label;
      controls.appendChild(item);
    });
    const guide = document.createElement("p");
    guide.className = "mini-note";
    guide.textContent = "같은 숫자는 한 번만 합쳐집니다. 방향키나 버튼으로 움직이고, 더 이상 움직일 수 없으면 종료됩니다.";
    surface.append(controls, guide);
    function add() {
      const empty = board.map(function (value, index) { return value ? null : index; }).filter(function (value) { return value !== null; });
      if (empty.length) board[sample(empty)] = Math.random() < 0.88 ? 2 : 4;
    }
    function draw() {
      const max = Math.max.apply(null, board);
      stats[0].textContent = String(score);
      stats[1].textContent = String(max || 2);
      Array.from(grid.children).forEach(function (cell, index) {
        const value = board[index];
        cell.textContent = value || "";
        cell.dataset.value = value ? String(value) : "0";
        cell.setAttribute("aria-label", value ? `${value} 타일` : `빈 칸 ${index + 1}`);
      });
    }
    function merge(line) {
      const items = line.filter(Boolean);
      for (let i = 0; i < items.length - 1; i += 1) {
        if (items[i] === items[i + 1]) {
          items[i] *= 2;
          score += items[i];
          items.splice(i + 1, 1);
        }
      }
      while (items.length < 4) items.push(0);
      return items;
    }
    function buildMove(dir, source) {
      const next = source.slice();
      for (let i = 0; i < 4; i += 1) {
        let line;
        if (dir === "왼쪽" || dir === "오른쪽") line = [0,1,2,3].map(function (c) { return source[i * 4 + c]; });
        else line = [0,1,2,3].map(function (r) { return source[r * 4 + i]; });
        if (dir === "오른쪽" || dir === "아래") line.reverse();
        line = merge(line);
        if (dir === "오른쪽" || dir === "아래") line.reverse();
        for (let j = 0; j < 4; j += 1) {
          if (dir === "왼쪽" || dir === "오른쪽") next[i * 4 + j] = line[j];
          else next[j * 4 + i] = line[j];
        }
      }
      return next;
    }
    function hasMove() {
      if (board.some(function (value) { return value === 0; })) return true;
      for (let r = 0; r < 4; r += 1) {
        for (let c = 0; c < 4; c += 1) {
          const value = board[r * 4 + c];
          if (c < 3 && board[r * 4 + c + 1] === value) return true;
          if (r < 3 && board[(r + 1) * 4 + c] === value) return true;
        }
      }
      return false;
    }
    function move(dir) {
      if (finished) return;
      const before = board.join(",");
      const scoreBefore = score;
      const next = buildMove(dir, board);
      if (next.join(",") === before) {
        score = scoreBefore;
        setResult("그 방향으로는 움직일 수 없습니다.");
        return;
      }
      board = next;
      add();
      moves += 1;
      draw();
      if (Math.max.apply(null, board) >= 2048) {
        const isBest = saveBest(game.id, score, function (a, b) { return a > b; });
        setResult(isBest ? `2048 달성. 새 최고 점수 ${score}점입니다.` : `2048 달성. ${moves}수 만에 성공했습니다.`);
        return;
      }
      if (!hasMove()) {
        finished = true;
        const isBest = saveBest(game.id, score, function (a, b) { return a > b; });
        setResult(isBest ? `게임 종료. 새 최고 점수 ${score}점입니다.` : `게임 종료. ${score}점으로 마무리했습니다.`);
        return;
      }
      setResult(`${moves}수 진행. 빈 칸을 유지하며 큰 타일을 만들어 보세요.`);
    }
    controls.addEventListener("click", function (event) {
      const target = event.target.closest("button");
      if (target) move(target.dataset.dir);
    });
    function onKey(event) {
      const map = { ArrowUp: "위", ArrowLeft: "왼쪽", ArrowRight: "오른쪽", ArrowDown: "아래" };
      if (!map[event.key]) return;
      event.preventDefault();
      move(map[event.key]);
    }
    document.addEventListener("keydown", onKey);
    cleanup.push(function () { document.removeEventListener("keydown", onKey); });
    add();
    add();
    draw();
  }

  function renderSnake(game, surface) {
    const size = 10;
    let snake = [45, 46, 47];
    let dir = -1;
    let nextDir = -1;
    let food = 22;
    let score = 0;
    let running = false;
    let over = false;
    let timer = null;
    let speed = 260;
    let rocks = new Set([33, 66]);
    renderScore(surface, [
      { label: "먹이", value: "0" },
      { label: "속도", value: "1단계" },
      { label: "최고", value: getBest(game.id) || "-" }
    ]);
    const stats = surface.querySelectorAll(".mini-score b");
    const grid = makeGrid(size * size, "snake-grid");
    grid.setAttribute("tabindex", "0");
    grid.setAttribute("aria-label", "스네이크 보드. 방향키로 조작할 수 있습니다.");
    surface.appendChild(grid);
    const controls = document.createElement("div");
    controls.className = "mini-controls pad-controls";
    const start = button("시작", "button primary");
    controls.appendChild(start);
    [["위", -10], ["왼쪽", -1], ["오른쪽", 1], ["아래", 10]].forEach(function (item) {
      const btn = button(item[0], "button secondary");
      btn.addEventListener("click", function () { turn(item[1]); });
      controls.appendChild(btn);
    });
    const guide = document.createElement("p");
    guide.className = "mini-note";
    guide.textContent = "먹이를 먹으면 몸이 길어지고 속도가 올라갑니다. 벽, 몸, 돌에 닿으면 종료됩니다.";
    surface.append(controls, guide);
    function placeFood() {
      const empty = Array.from({ length: size * size }, function (_, index) { return index; })
        .filter(function (index) { return !snake.includes(index) && !rocks.has(index); });
      food = sample(empty);
    }
    function turn(value) {
      if (over) return;
      if (value + dir === 0) return;
      nextDir = value;
      if (!running) toggle();
    }
    function draw() {
      Array.from(grid.children).forEach(function (cell, index) {
        cell.className = "mini-cell";
        cell.textContent = "";
        if (index === snake[0]) {
          cell.textContent = "●";
          cell.classList.add("snake-head");
        } else if (snake.includes(index)) {
          cell.textContent = "■";
          cell.classList.add("snake-body");
        } else if (index === food) {
          cell.textContent = "◆";
          cell.classList.add("snake-food");
        } else if (rocks.has(index)) {
          cell.textContent = "×";
          cell.classList.add("snake-rock");
        }
      });
      stats[0].textContent = String(score);
      stats[1].textContent = `${Math.max(1, Math.round((300 - speed) / 35))}단계`;
    }
    function restartTimer() {
      clearInterval(timer);
      if (running && !over) timer = setInterval(step, speed);
    }
    function toggle() {
      if (over) return;
      running = !running;
      start.textContent = running ? "일시정지" : "계속";
      setResult(running ? "방향키나 버튼으로 먹이를 쫓아가세요." : "일시정지했습니다.");
      restartTimer();
    }
    function step() {
      if (!running || over) return;
      dir = nextDir;
      const head = snake[0];
      const next = head + dir;
      const wall = next < 0 || next >= size * size || (dir === 1 && head % size === size - 1) || (dir === -1 && head % size === 0);
      if (wall || snake.includes(next) || rocks.has(next)) {
        clearInterval(timer);
        running = false;
        over = true;
        start.disabled = true;
        const isBest = saveBest(game.id, score, function (a, b) { return a > b; });
        setResult(isBest ? `게임 종료. 먹이 ${score}개로 새 최고 기록입니다.` : `게임 종료. 먹이 ${score}개.`);
        return;
      }
      snake.unshift(next);
      if (next === food) {
        score += 1;
        if (score % 3 === 0 && speed > 125) {
          speed -= 24;
          restartTimer();
        }
        if (score % 4 === 0) {
          const emptyForRock = Array.from({ length: size * size }, function (_, index) { return index; })
            .filter(function (index) { return !snake.includes(index) && index !== food && !rocks.has(index); });
          if (emptyForRock.length) rocks.add(sample(emptyForRock));
        }
        placeFood();
      } else {
        snake.pop();
      }
      draw();
    }
    function onKey(event) {
      const map = { ArrowUp: -10, ArrowLeft: -1, ArrowRight: 1, ArrowDown: 10, " ": 0 };
      if (!(event.key in map)) return;
      event.preventDefault();
      if (event.key === " ") toggle();
      else turn(map[event.key]);
    }
    start.addEventListener("click", toggle);
    document.addEventListener("keydown", onKey);
    cleanup.push(function () {
      clearInterval(timer);
      document.removeEventListener("keydown", onKey);
    });
    setResult("시작을 누르거나 방향키를 누르면 출발합니다.");
    draw();
  }

  function renderMatch3(game, surface) {
    const width = 6;
    const icons = ["●", "◆", "▲", "■", "★"];
    let board = [];
    let picked = null;
    let score = 0;
    let moves = 20;
    let combo = 0;
    let finished = false;
    renderScore(surface, [
      { label: "점수", value: "0" },
      { label: "이동", value: "20" },
      { label: "목표", value: "45" }
    ]);
    const stats = surface.querySelectorAll(".mini-score b");
    const grid = makeGrid(36, "match-grid");
    surface.appendChild(grid);
    const guide = document.createElement("p");
    guide.className = "mini-note";
    guide.textContent = "인접한 두 타일을 바꿔 세 개 이상을 만드세요. 매치가 없으면 이동 수가 줄지 않습니다.";
    surface.appendChild(guide);
    function findMatches(source) {
      const matched = new Set();
      for (let r = 0; r < width; r += 1) {
        let run = [r * width];
        for (let c = 1; c < width; c += 1) {
          const index = r * width + c;
          if (source[index] === source[run[0]]) run.push(index);
          else {
            if (run.length >= 3) run.forEach(function (x) { matched.add(x); });
            run = [index];
          }
        }
        if (run.length >= 3) run.forEach(function (x) { matched.add(x); });
      }
      for (let c = 0; c < width; c += 1) {
        let run = [c];
        for (let r = 1; r < width; r += 1) {
          const index = r * width + c;
          if (source[index] === source[run[0]]) run.push(index);
          else {
            if (run.length >= 3) run.forEach(function (x) { matched.add(x); });
            run = [index];
          }
        }
        if (run.length >= 3) run.forEach(function (x) { matched.add(x); });
      }
      return matched;
    }
    function makeBoard() {
      board = [];
      for (let i = 0; i < 36; i += 1) {
        let choices = icons.slice();
        const left1 = i % width >= 1 ? board[i - 1] : null;
        const left2 = i % width >= 2 ? board[i - 2] : null;
        const up1 = i >= width ? board[i - width] : null;
        const up2 = i >= width * 2 ? board[i - width * 2] : null;
        choices = choices.filter(function (icon) {
          return !(icon === left1 && icon === left2) && !(icon === up1 && icon === up2);
        });
        board.push(sample(choices));
      }
    }
    function draw() {
      Array.from(grid.children).forEach(function (cell, index) {
        cell.className = "mini-cell";
        cell.textContent = board[index];
        cell.classList.toggle("active", picked === index);
        cell.dataset.gem = board[index];
        cell.setAttribute("aria-label", `${board[index]} 타일 ${index + 1}`);
      });
      stats[0].textContent = String(score);
      stats[1].textContent = String(moves);
    }
    function collapse(matched) {
      matched.forEach(function (index) { board[index] = null; });
      for (let c = 0; c < width; c += 1) {
        const column = [];
        for (let r = width - 1; r >= 0; r -= 1) {
          const value = board[r * width + c];
          if (value) column.push(value);
        }
        while (column.length < width) column.push(sample(icons));
        for (let r = width - 1; r >= 0; r -= 1) {
          board[r * width + c] = column[width - 1 - r];
        }
      }
    }
    function resolveMatches() {
      let total = 0;
      let matched = findMatches(board);
      combo = 0;
      while (matched.size) {
        combo += 1;
        total += matched.size;
        score += matched.size * combo;
        collapse(matched);
        matched = findMatches(board);
      }
      return total;
    }
    function swap(a, b) {
      const temp = board[a];
      board[a] = board[b];
      board[b] = temp;
    }
    function finish(message) {
      finished = true;
      Array.from(grid.children).forEach(function (cell) { cell.disabled = true; });
      const isBest = saveBest(game.id, score, function (a, b) { return a > b; });
      setResult(isBest ? `${message} 새 최고 점수 ${score}점입니다.` : `${message} 최종 ${score}점입니다.`);
    }
    Array.from(grid.children).forEach(function (cell, index) {
      cell.addEventListener("click", function () {
        if (finished) return;
        if (picked === null) {
          picked = index;
          draw();
          return;
        }
        if (picked === index) {
          picked = null;
          draw();
          return;
        }
        const sameRow = Math.floor(picked / width) === Math.floor(index / width);
        const adjacent = (sameRow && Math.abs(picked - index) === 1) || Math.abs(picked - index) === width;
        if (adjacent) {
          swap(picked, index);
          const initialMatches = findMatches(board);
          if (!initialMatches.size) {
            swap(picked, index);
            setResult("세 개 이상이 만들어지는 자리만 바꿀 수 있습니다.");
          } else {
            moves -= 1;
            const removed = resolveMatches();
            if (score >= 45) finish(`목표 달성. ${removed}개를 연쇄로 지웠습니다.`);
            else if (moves <= 0) finish("이동 수를 모두 사용했습니다.");
            else setResult(combo > 1 ? `${combo}연쇄! ${removed}개를 지웠습니다.` : `${removed}개를 지웠습니다.`);
          }
        }
        picked = null;
        draw();
      });
    });
    makeBoard();
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
    const stations = ["한판역", "블록공원", "퍼즐시청", "초록신호", "은하항구", "기록광장", "게임연구소", "승리터미널"];
    let index = 0;
    let typed = 0;
    let errors = 0;
    let started = false;
    let startTime = 0;
    renderScore(surface, [
      { label: "역", value: `1/${stations.length}` },
      { label: "정확도", value: "100%" },
      { label: "속도", value: "0타/분" },
      { label: "최고", value: getBest(game.id) ? `${getBest(game.id)}타/분` : "-" }
    ]);
    const stats = surface.querySelectorAll(".mini-score b");
    const route = document.createElement("div");
    route.className = "rail-route";
    stations.forEach(function (name, stationIndex) {
      const item = document.createElement("span");
      item.className = "station-pill";
      item.textContent = name;
      item.dataset.index = String(stationIndex);
      route.appendChild(item);
    });
    const panel = document.createElement("div");
    panel.className = "typing-panel";
    panel.innerHTML = `
      <p class="hint-box" id="typingPrompt">${stations[0]}</p>
      <input id="typingInput" type="text" inputmode="text" autocomplete="off" placeholder="역 이름 입력" aria-label="역 이름 입력">
    `;
    const guide = document.createElement("p");
    guide.className = "mini-note";
    guide.textContent = "표시된 역 이름을 정확히 입력하면 열차가 다음 역으로 이동합니다. 오타가 나면 Enter로 현재 입력을 비울 수 있습니다.";
    surface.append(route, panel, guide);
    const prompt = $("#typingPrompt", surface);
    const input = $("#typingInput", surface);
    function sync() {
      route.querySelectorAll(".station-pill").forEach(function (item, stationIndex) {
        item.classList.toggle("done", stationIndex < index);
        item.classList.toggle("active", stationIndex === index);
      });
      const elapsed = started ? Math.max(1, (Date.now() - startTime) / 60000) : 1;
      const speed = Math.round(typed / elapsed);
      const accuracy = Math.max(0, Math.round((typed - errors) / Math.max(1, typed) * 100));
      stats[0].textContent = `${Math.min(index + 1, stations.length)}/${stations.length}`;
      stats[1].textContent = `${accuracy}%`;
      stats[2].textContent = `${speed}타/분`;
      return { speed, accuracy };
    }
    function complete() {
      const result = sync();
      input.disabled = true;
      const score = Math.max(0, Math.round(result.speed * result.accuracy / 100));
      const isBest = saveBest(game.id, score, function (a, b) { return a > b; });
      setResult(isBest ? `종착역 도착. 새 최고 기록 ${score}타/분입니다.` : `종착역 도착. 환산 기록 ${score}타/분입니다.`);
    }
    input.addEventListener("input", function () {
      if (!started) {
        started = true;
        startTime = Date.now();
      }
      const target = stations[index];
      typed += 1;
      if (!target.startsWith(input.value)) {
        errors += 1;
        input.classList.add("typing-error");
        setResult("입력이 역 이름과 다릅니다. Enter로 비우고 다시 입력할 수 있습니다.");
      } else {
        input.classList.remove("typing-error");
        setResult("좋습니다. 역 이름을 끝까지 입력하세요.");
      }
      if (input.value === target) {
        index += 1;
        input.value = "";
        if (index >= stations.length) complete();
        else {
          prompt.textContent = stations[index];
          setResult(`${stations[index - 1]} 통과. 다음 역으로 이동합니다.`);
        }
      }
      sync();
    });
    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        input.value = "";
        input.classList.remove("typing-error");
        setResult("현재 역 입력을 비웠습니다.");
      }
    });
    setTimeout(function () { input.focus(); }, 50);
    sync();
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
    const scents = [
      { id: "citrus", label: "시트러스", color: "#ffcf5d" },
      { id: "rose", label: "로즈", color: "#b9476a" },
      { id: "mint", label: "민트", color: "#258b62" },
      { id: "wood", label: "우디", color: "#7c5b3e" }
    ];
    const capacity = 4;
    let moves = 0;
    let undo = 5;
    let selected = null;
    let history = [];
    let bottles = scents.map(function (scent) { return [scent.id, scent.id, scent.id, scent.id]; }).concat([[], []]);
    renderScore(surface, [
      { label: "이동", value: "0" },
      { label: "되돌리기", value: "5" },
      { label: "완성 병", value: "0/4" },
      { label: "최고", value: getBest(game.id) || "-" }
    ]);
    const stats = surface.querySelectorAll(".mini-score b");
    const rack = document.createElement("div");
    rack.className = "perfume-rack";
    const controls = document.createElement("div");
    controls.className = "mini-controls";
    const undoBtn = button("되돌리기", "button secondary");
    controls.appendChild(undoBtn);
    const guide = document.createElement("p");
    guide.className = "mini-note";
    guide.textContent = "병을 하나 고르고 다른 병을 누르면 맨 위의 같은 향 노트가 함께 이동합니다. 같은 향 위나 빈 병으로만 옮길 수 있습니다.";
    surface.append(rack, controls, guide);
    function scentInfo(id) {
      return scents.find(function (scent) { return scent.id === id; });
    }
    function topGroup(index) {
      const bottle = bottles[index];
      if (!bottle.length) return null;
      const top = bottle[bottle.length - 1];
      let count = 0;
      for (let i = bottle.length - 1; i >= 0 && bottle[i] === top; i -= 1) count += 1;
      return { id: top, count };
    }
    function canPour(from, to) {
      if (from === to) return false;
      const source = topGroup(from);
      if (!source) return false;
      const target = bottles[to];
      if (target.length >= capacity) return false;
      if (target.length && target[target.length - 1] !== source.id) return false;
      return true;
    }
    function pour(from, to) {
      if (!canPour(from, to)) {
        setResult("같은 향 위나 빈 병으로만 옮길 수 있습니다.");
        return false;
      }
      history.push(bottles.map(function (bottle) { return bottle.slice(); }));
      const source = topGroup(from);
      const room = capacity - bottles[to].length;
      const amount = Math.min(source.count, room);
      for (let i = 0; i < amount; i += 1) bottles[to].push(bottles[from].pop());
      moves += 1;
      selected = null;
      setResult(`${scentInfo(source.id).label} 향 ${amount}칸을 옮겼습니다.`);
      return true;
    }
    function solvedBottle(bottle) {
      return !bottle.length || (bottle.length === capacity && bottle.every(function (id) { return id === bottle[0]; }));
    }
    function finishedCount() {
      return bottles.filter(function (bottle) { return bottle.length === capacity && bottle.every(function (id) { return id === bottle[0]; }); }).length;
    }
    function isSolved() {
      return bottles.every(solvedBottle);
    }
    function randomize() {
      const notes = shuffle(scents.flatMap(function (scent) { return [scent.id, scent.id, scent.id, scent.id]; }));
      bottles = [
        notes.slice(0, 4),
        notes.slice(4, 8),
        notes.slice(8, 12),
        notes.slice(12, 16),
        [],
        []
      ];
      if (isSolved()) randomize();
      history = [];
      moves = 0;
      selected = null;
    }
    function sync() {
      stats[0].textContent = String(moves);
      stats[1].textContent = String(undo);
      stats[2].textContent = `${finishedCount()}/4`;
      undoBtn.disabled = !history.length || undo <= 0;
    }
    function draw() {
      rack.innerHTML = "";
      bottles.forEach(function (bottle, index) {
        const item = button("", "perfume-bottle");
        item.classList.toggle("selected", selected === index);
        item.classList.toggle("complete", bottle.length === capacity && bottle.every(function (id) { return id === bottle[0]; }));
        item.setAttribute("aria-label", `${index + 1}번 향수병`);
        for (let i = capacity - 1; i >= 0; i -= 1) {
          const segment = document.createElement("span");
          segment.className = "scent-segment";
          const id = bottle[i];
          if (id) {
            const scent = scentInfo(id);
            segment.style.background = scent.color;
            segment.textContent = scent.label.slice(0, 1);
          } else {
            segment.classList.add("scent-empty");
          }
          item.appendChild(segment);
        }
        item.addEventListener("click", function () {
          if (selected === null) {
            if (!bottle.length) return;
            selected = index;
            setResult(`${index + 1}번 병을 선택했습니다. 옮길 병을 고르세요.`);
          } else {
            pour(selected, index);
          }
          draw();
        });
        rack.appendChild(item);
      });
      sync();
      if (isSolved()) {
        const score = Math.max(1, moves);
        const isBest = saveBest(game.id, score, function (a, b) { return a < b; });
        setResult(isBest ? `${moves}번 이동으로 완성. 새 최고 기록입니다.` : `${moves}번 이동으로 향 노트를 모두 정렬했습니다.`);
      }
    }
    undoBtn.addEventListener("click", function () {
      if (!history.length || undo <= 0) return;
      bottles = history.pop().map(function (bottle) { return bottle.slice(); });
      undo -= 1;
      selected = null;
      setResult("한 수 되돌렸습니다.");
      draw();
    });
    randomize();
    draw();
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
