(function () {
  const categoryNames = {
    traditional: "한국 전통놀이",
    arcade: "고전 오락실",
    puzzle: "퍼즐",
    board: "보드·전략",
    brain: "두뇌·기억",
    skill: "순발력·기록"
  };

  const catalog = [
    { id: "reaction-speed", title: "반응속도 체크", category: "skill", type: "reaction", minutes: "15초", description: "초록 신호가 켜지는 순간을 누르는 반응속도 게임입니다." },
    { id: "number-vault", title: "숫자 금고", category: "puzzle", type: "number", minutes: "1분", description: "업다운 힌트로 숨겨진 숫자를 찾아내는 추리 게임입니다." },
    { id: "memory-tiles", title: "기억 타일", category: "brain", type: "pairs", minutes: "2분", description: "뒤집힌 타일의 위치를 기억해 같은 글자를 맞춥니다." },
    { id: "click-sprint", title: "클릭 스프린트", category: "skill", type: "tap", minutes: "10초", description: "정해진 시간 안에 얼마나 빠르게 클릭하는지 측정합니다." },
    { id: "aim-trainer", title: "에임 트레이너", category: "skill", type: "target", minutes: "1분", description: "무작위 위치에 뜨는 표적을 빠르게 눌러 정확도를 올립니다." },
    { id: "mole-finder", title: "두더지 찾기", category: "arcade", type: "mole", minutes: "1분", description: "여러 구멍 중 튀어나온 두더지를 찾아 누르는 순발력 게임입니다." },
    { id: "brick-break", title: "벽돌깨기 미니", category: "arcade", type: "brick", minutes: "2분", description: "패들을 움직여 공을 받아내고 벽돌을 모두 깨며 레벨을 올립니다." },
    { id: "block-drop-classic", title: "블록 드롭 클래식", category: "puzzle", type: "tetris", minutes: "4분", description: "7종 블록을 쌓아 줄을 지우고 홀드와 다음 블록 3개로 기록에 도전합니다." },
    { id: "pong-rally", title: "퐁 랠리", category: "arcade", type: "pong", minutes: "2분", description: "패들을 움직여 공을 받아내고 상대보다 먼저 득점하는 클래식 랠리 게임입니다." },
    { id: "space-guard", title: "우주 방어선", category: "arcade", type: "space", minutes: "3분", description: "좌우로 움직이며 탄을 쏘고 내려오는 적 편대를 막아내는 슈팅 게임입니다." },
    { id: "maze-chase", title: "미로 추격 클래식", category: "arcade", type: "mazeChase", minutes: "4분", description: "미로의 빛 조각을 모으며 추격 센티널을 피하고 스테이지를 돌파합니다." },
    { id: "flappy-jump", title: "플래피 점프", category: "arcade", type: "flappy", minutes: "1분", description: "짧게 점프하며 기둥 사이를 통과하는 원버튼 회피 게임입니다." },
    { id: "bubble-shooter", title: "버블 슈터 클래식", category: "puzzle", type: "bubbleShooter", minutes: "4분", description: "조준선을 맞춰 같은 색 버블을 세 개 이상 연결하고 연쇄 낙하를 만드는 클래식 퍼즐입니다." },
    { id: "bubble-pop", title: "버블팝", category: "arcade", type: "bubble", minutes: "1분", description: "반짝이는 버블을 놓치지 않고 눌러 점수를 모읍니다." },
    { id: "snake-garden", title: "뱀의 정원", category: "arcade", type: "snake", minutes: "2분", description: "정원을 돌아다니며 먹이를 먹고 몸을 늘리는 그리드 게임입니다." },
    { id: "airplane-dodge", title: "붕붕 비행기", category: "arcade", type: "lane", minutes: "1분", description: "세 개의 항로를 오가며 장애물을 피하는 비행 게임입니다." },
    { id: "chair-dash", title: "의자 질주", category: "arcade", type: "chair", minutes: "2분", description: "바퀴 달린 의자를 타고 사무실 통로를 미끄러지듯 달려 목적지에 도착합니다." },
    { id: "dessert-catch", title: "디저트 캐치", category: "arcade", type: "catcher", minutes: "1분", description: "떨어지는 디저트를 받아 점수를 올리고 탄 음식은 피합니다." },
    { id: "planet-toss", title: "행성 던지기", category: "arcade", type: "toss", minutes: "1분", description: "각도와 힘을 골라 목표 궤도에 행성을 던져 넣습니다." },
    { id: "jegi-kick", title: "제기차기 한판", category: "traditional", type: "jegi", minutes: "1분", description: "제기가 발 가까이 내려오는 순간을 맞춰 차며 연속 기록을 이어 갑니다." },
    { id: "tuho", title: "투호 한판", category: "traditional", type: "tuho", minutes: "2분", description: "바람을 읽고 각도와 힘을 조절해 열 발의 화살을 항아리에 넣습니다." },
    { id: "ddakji-flip", title: "딱지치기 한판", category: "traditional", type: "ddakji", minutes: "2분", description: "상대 딱지의 들린 모서리와 힘 게이지를 맞춰 딱지를 뒤집습니다." },
    { id: "gonggi", title: "공기놀이 한판", category: "traditional", type: "gonggi", minutes: "3분", description: "공깃돌의 낙하 타이밍을 맞춰 한 알 줍기부터 꺾기까지 도전합니다." },
    { id: "tic-tac-toe", title: "틱택토 Tic-Tac-Toe", category: "board", type: "tictactoe", minutes: "2분", description: "미니맥스 AI, 2인 대전, 난이도와 선후공 선택을 갖춘 전략 보드 게임입니다." },
    { id: "omok", title: "오목 한판", category: "board", type: "omok", minutes: "5분", description: "15×15 바둑판에서 다섯 돌을 먼저 잇는 AI·2인 대전 오목 게임입니다." },
    { id: "card-solitaire", title: "카드 솔리테어", category: "board", type: "solitaire", minutes: "8분", description: "52장 카드를 무늬별로 정리하는 정통 클론다이크 솔리테어입니다." },
    { id: "freecell-classic", title: "프리셀 클래식", category: "board", type: "freecell", minutes: "10분", description: "네 개의 임시칸을 활용해 52장 카드를 모두 정리하는 전략 카드 퍼즐입니다." },
    { id: "connect-four", title: "사목 미니", category: "board", type: "connect4", minutes: "2분", description: "말을 떨어뜨려 네 개를 먼저 잇는 전략 게임입니다." },
    { id: "rps-survival", title: "가위바위보 서바이벌", category: "board", type: "rps", minutes: "1분", description: "연승을 이어가며 살아남는 가위바위보 게임입니다." },
    { id: "mines", title: "지뢰찾기 클래식", category: "puzzle", type: "mines", minutes: "5분", description: "세 가지 난이도에서 숫자 단서를 읽고 지뢰를 피해 모든 안전 칸을 엽니다." },
    { id: "sliding-puzzle", title: "슬라이딩 퍼즐", category: "puzzle", type: "sliding", minutes: "2분", description: "빈 칸을 이용해 숫자 타일을 순서대로 맞춥니다." },
    { id: "sudoku-mini", title: "스도쿠 클래식", category: "puzzle", type: "sudoku", minutes: "8분", description: "세 가지 난이도의 9x9 퍼즐을 메모와 힌트로 풀고 자동 저장된 기록에 도전합니다." },
    { id: "twenty-48", title: "2048 한판", category: "puzzle", type: "twenty48", minutes: "3분", description: "같은 숫자 타일을 합치고 기록을 이어 저장하며 2048 이상에 도전하는 클래식 퍼즐입니다." },
    { id: "match-three", title: "매치3 퍼즐", category: "puzzle", type: "match3", minutes: "3분", description: "인접한 타일을 바꿔 연쇄 매치를 만들고 제한 이동 안에 목표 점수를 넘깁니다." },
    { id: "block-fill", title: "블록 채우기", category: "puzzle", type: "blockfill", minutes: "2분", description: "빈 칸을 모두 채우되 폭탄 칸은 피하는 블록 퍼즐입니다." },
    { id: "simon", title: "사이먼 게임", category: "brain", type: "sequence", minutes: "2분", description: "빛나는 순서를 기억했다가 그대로 따라 누릅니다." },
    { id: "pattern-memory", title: "패턴 기억", category: "brain", type: "pattern", minutes: "1분", description: "잠깐 보이는 패턴을 기억해 같은 칸을 다시 선택합니다." },
    { id: "word-guess", title: "단어 맞추기", category: "brain", type: "word", minutes: "2분", description: "힌트를 보고 숨겨진 단어를 추리합니다." },
    { id: "hangman", title: "행맨", category: "brain", type: "hangman", minutes: "2분", description: "글자를 하나씩 골라 숨은 단어를 완성합니다." },
    { id: "typing-sprint", title: "타이핑 노선", category: "skill", type: "typing", minutes: "2분", description: "역 이름을 정확히 입력할수록 열차가 다음 역으로 달리는 타자 레이스입니다." },
    { id: "math-climb", title: "수학 등산", category: "brain", type: "math", minutes: "1분", description: "짧은 계산 문제를 풀며 산 정상까지 올라갑니다." },
    { id: "color-match", title: "색깔 맞추기", category: "skill", type: "color", minutes: "1분", description: "글자와 색이 일치하는지 빠르게 판단합니다." },
    { id: "perfume-workshop", title: "향수 소트 공방", category: "puzzle", type: "recipe", minutes: "3분", description: "뒤섞인 향 노트를 병끼리 옮겨 같은 향으로 정렬하는 컬러 소트 퍼즐입니다." },
    { id: "constellation", title: "별자리 잇기", category: "puzzle", type: "constellation", minutes: "1분", description: "별을 순서대로 이어 작은 별자리를 완성합니다." },
    { id: "garden-water", title: "정원 물주기", category: "skill", type: "garden", minutes: "1분", description: "마른 화분을 찾아 물을 주고 정원을 살립니다." }
  ];

  const illustratedGameIds = new Set(catalog.map(function (game) { return game.id; }));

  const approvalVisibleGameIds = new Set(["mines", "card-solitaire", "sudoku-mini", "twenty-48", "block-drop-classic", "brick-break", "snake-garden", "freecell-classic", "tic-tac-toe", "connect-four", "maze-chase", "match-three", "sliding-puzzle", "hangman", "flappy-jump"]);
  const approvalHiddenGameIds = new Set(catalog
    .filter(function (game) { return !approvalVisibleGameIds.has(game.id); })
    .map(function (game) { return game.id; }));
  const gameById = new Map(catalog.map(function (game) { return [game.id, game]; }));
  const flagshipGameIds = new Set(["mines", "card-solitaire", "sudoku-mini", "twenty-48", "block-drop-classic", "brick-break", "snake-garden", "freecell-classic", "tic-tac-toe", "connect-four"]);
  const publicCatalog = ["mines", "card-solitaire", "sudoku-mini", "twenty-48", "block-drop-classic", "brick-break", "snake-garden", "freecell-classic", "tic-tac-toe", "connect-four", "maze-chase", "match-three", "sliding-puzzle", "hangman", "flappy-jump"]
    .map(function (id) { return gameById.get(id); })
    .filter(Boolean);
  const flagshipChallengeRules = {
    "mines": { label: "진행", unit: "%", tiers: [[25, "숫자 경계 만들기"], [60, "판의 절반 넘기기"], [100, "모든 안전 칸 열기"]] },
    "card-solitaire": { label: "정리", unit: "장", tiers: [[13, "한 무늬 분량 정리"], [26, "카드 절반 정리"], [52, "네 기초 더미 완성"]] },
    "sudoku-mini": { label: "입력", unit: "칸", tiers: [[15, "첫 구역 확정"], [35, "후반 후보 정리"], [51, "모든 빈칸 완성"]] },
    "twenty-48": { label: "최대 타일", unit: "", tiers: [[128, "128 타일 만들기"], [512, "512 타일 만들기"], [2048, "2048 타일 완성"]] },
    "block-drop-classic": { label: "줄", unit: "줄", tiers: [[2, "첫 두 줄 삭제"], [10, "10줄 정리"], [30, "30줄 생존"]] },
    "brick-break": { label: "스테이지", unit: "", tiers: [[2, "스테이지 2 진입"], [3, "스테이지 3 진입"], [5, "스테이지 5 도전"]] },
    "snake-garden": { label: "길이", unit: "칸", tiers: [[6, "기본 순환 경로 만들기"], [10, "길이 10 유지"], [15, "후반 공간 관리"]] },
    "freecell-classic": { label: "정리", unit: "장", tiers: [[13, "한 무늬 분량 정리"], [26, "카드 절반 정리"], [52, "네 기초 더미 완성"]] },
    "tic-tac-toe": { source: ".tt2", metric: "ticMatch", unit: "승", tiers: [[1, "첫 판 승리"], [2, "매치 포인트 도달"], [3, "3선승 매치 완성"]] },
    "connect-four": { source: ".connect4-pro-game", metric: "connectTurns", unit: "수", tiers: [[2, "두 수 전개"], [3, "세 수 전개"], [4, "한 판 마무리", "대국 종료"]] }
  };

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
      const raw = localStorage.getItem(key);
      const prev = raw === null ? NaN : Number(raw);
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
      const raw = localStorage.getItem(`hanpan-arcade-${id}`);
      const value = raw === null ? NaN : Number(raw);
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

  function createTonePlayer() {
    let audio = null;
    let muted = false;

    function ensureAudio() {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!audio && typeof AudioContext === "function") audio = new AudioContext();
      if (audio && audio.state === "suspended") audio.resume();
      return audio;
    }

    function tone(frequency, duration, type, volume, delay) {
      if (muted) return;
      try {
        const context = ensureAudio();
        if (!context) return;
        const startAt = context.currentTime + (delay || 0);
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = type || "square";
        oscillator.frequency.setValueAtTime(frequency, startAt);
        gain.gain.setValueAtTime(volume || 0.025, startAt);
        gain.gain.exponentialRampToValueAtTime(0.001, startAt + duration);
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(startAt);
        oscillator.stop(startAt + duration);
      } catch (error) {
        // Audio is optional; gameplay remains available when the browser blocks it.
      }
    }

    function toggle(buttonElement) {
      muted = !muted;
      buttonElement.textContent = muted ? "소리 꺼짐" : "소리 켜짐";
      buttonElement.setAttribute("aria-pressed", String(!muted));
      if (!muted) tone(520, 0.08, "sine", 0.02);
    }

    function close() {
      if (audio && audio.state !== "closed") audio.close();
    }

    return { tone, toggle, close };
  }

  function createSpeedSelect() {
    const select = document.createElement("select");
    select.className = "game-option-select speed-select";
    select.setAttribute("aria-label", "게임 속도");
    [["0.78", "속도 느림"], ["1", "속도 보통"], ["1.2", "속도 빠름"]].forEach(function (item) {
      const option = document.createElement("option");
      option.value = item[0];
      option.textContent = item[1];
      if (item[0] === "1") option.selected = true;
      select.appendChild(option);
    });
    return select;
  }

  function animationScale(now, previousFrame, speedSelect) {
    const elapsed = previousFrame ? (now - previousFrame) / (1000 / 60) : 1;
    const speed = speedSelect ? Number(speedSelect.value) || 1 : 1;
    return Math.min(2, Math.max(0, elapsed)) * speed;
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
    const categoryJumps = Array.from(document.querySelectorAll("[data-arcade-jump]"));
    let active = "all";

    function draw() {
      const query = (search && search.value ? search.value : "").trim().toLowerCase();
      const games = publicCatalog.filter(function (game) {
        const categoryMatch = active === "all" || game.category === active;
        const text = `${game.title} ${game.description} ${categoryNames[game.category]}`.toLowerCase();
        return categoryMatch && (!query || text.includes(query));
      });
      list.innerHTML = "";
      games.forEach(function (game) {
        const card = document.createElement("article");
        card.className = "game-card";
        card.innerHTML = `
          ${illustratedGameIds.has(game.id) ? `<a class="game-card-art" href="/games/${game.id}/" aria-label="${game.title} 게임 열기"><img src="/assets/game-art/${game.id}.webp" width="640" height="360" loading="lazy" decoding="async" alt="${game.title} 플레이 장면"></a>` : ""}
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
    categoryJumps.forEach(function (jump) {
      jump.addEventListener("click", function () {
        active = jump.dataset.arcadeJump;
        filters.forEach(function (item) {
          item.classList.toggle("active", item.dataset.arcadeFilter === active);
        });
        draw();
      });
    });
    if (search) search.addEventListener("input", draw);
    draw();
  }

  function tagColor(category) {
    if (category === "traditional") return "traditional";
    if (category === "arcade" || category === "skill") return "red";
    if (category === "puzzle") return "blue";
    if (category === "brain") return "green";
    return "gold";
  }

  function setupGameFullscreen(surface) {
    const stage = surface.closest(".inline-game-stage, .arcade-stage");
    const actions = stage && $(".stage-actions", stage);
    if (!stage || !actions || $("[data-game-fullscreen]", stage)) return;
    if (surface.dataset.gameId === "mines" && window.__hanpanMinesRuntime) {
      stage.classList.add("uses-inline-stage-actions");
      return;
    }

    const toggle = document.createElement("button");
    const icon = document.createElement("span");
    const label = document.createElement("span");
    const status = document.createElement("span");
    let fallbackActive = false;

    toggle.type = "button";
    toggle.className = "button secondary game-fullscreen-toggle";
    toggle.dataset.gameFullscreen = "";
    toggle.setAttribute("aria-pressed", "false");
    icon.className = "game-fullscreen-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "⛶";
    label.textContent = "전체화면";
    toggle.append(icon, label);

    status.className = "visually-hidden";
    status.setAttribute("aria-live", "polite");
    actions.insertBefore(toggle, $("#restartGame", actions) || null);
    actions.appendChild(status);
    stage.classList.add("game-fullscreen-stage");

    function fullscreenElement() {
      return document.fullscreenElement || document.webkitFullscreenElement || null;
    }

    function isActive() {
      return fullscreenElement() === stage || fallbackActive;
    }

    function sync() {
      const active = isActive();
      stage.classList.toggle("is-game-fullscreen-active", active);
      toggle.setAttribute("aria-pressed", String(active));
      icon.textContent = active ? "×" : "⛶";
      label.textContent = active ? "전체화면 종료" : "전체화면";
      toggle.title = active ? "전체화면 종료" : "전체화면으로 게임하기";
      if (!active && screen.orientation && typeof screen.orientation.unlock === "function") {
        try { screen.orientation.unlock(); } catch (error) { /* Orientation unlock is optional. */ }
      }
    }

    function openFallback() {
      fallbackActive = true;
      stage.classList.add("is-game-fullscreen-fallback");
      document.body.classList.add("game-fullscreen-fallback-open");
      status.textContent = "전체화면 모드가 켜졌습니다.";
      sync();
    }

    function closeFallback() {
      fallbackActive = false;
      stage.classList.remove("is-game-fullscreen-fallback");
      document.body.classList.remove("game-fullscreen-fallback-open");
      status.textContent = "전체화면 모드가 종료됐습니다.";
      sync();
    }

    async function lockLandscape() {
      if (!window.matchMedia("(pointer: coarse)").matches) return;
      if (!screen.orientation || typeof screen.orientation.lock !== "function") return;
      try { await screen.orientation.lock("landscape"); } catch (error) { /* Device rotation still works without a lock. */ }
    }

    async function enter() {
      const request = stage.requestFullscreen || stage.webkitRequestFullscreen;
      if (!request) {
        openFallback();
        return;
      }
      try {
        await Promise.resolve(request.call(stage));
        await lockLandscape();
        status.textContent = "전체화면 모드가 켜졌습니다.";
        sync();
      } catch (error) {
        openFallback();
      }
    }

    async function exitFullscreen() {
      if (fallbackActive) {
        closeFallback();
        return;
      }
      const exit = document.exitFullscreen || document.webkitExitFullscreen;
      if (exit) {
        try { await Promise.resolve(exit.call(document)); } catch (error) { /* Keep the game usable if exit is interrupted. */ }
      }
      sync();
    }

    toggle.addEventListener("click", function () {
      if (isActive()) exitFullscreen();
      else enter();
    });
    document.addEventListener("fullscreenchange", sync);
    document.addEventListener("webkitfullscreenchange", sync);
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && fallbackActive) closeFallback();
    });
    sync();
  }

  function renderPlayPage() {
    const surface = $("#playSurface");
    if (!surface) return;

    const picker = $("#playPicker");
    const search = $("#playSearch");
    const restart = $("#restartGame");
    const requestedGame = new URLSearchParams(location.search).get("game") || surface.dataset.gameId;
    const availableGames = surface.dataset.gameId ? catalog : publicCatalog;
    let current = availableGames.find(function (game) { return game.id === requestedGame; }) || availableGames[0];

    function drawPicker() {
      if (!picker) return;
      const query = (search && search.value ? search.value : "").trim().toLowerCase();
      picker.innerHTML = "";
      availableGames
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
      const pageTitle = $("#playTitle");
      const pageDescription = $("#playDescription");
      if (surface.dataset.gameId) {
        if (pageTitle) pageTitle.textContent = current.title;
        if (pageDescription) pageDescription.textContent = current.description;
      }
      const stageTitle = $("#stageTitle");
      const playCategory = $("#playCategory");
      if (stageTitle) stageTitle.textContent = current.title;
      if (playCategory) playCategory.textContent = `${categoryNames[current.category]} · ${current.minutes}`;
      surface.innerHTML = "";
      try {
        localStorage.setItem("hanpan-recent-game", current.id);
      } catch (error) {
        // Recent-play state is optional.
      }
      setResult("게임을 시작해 보세요.");
      drawPicker();
      renderGame(current, surface);
    }

    if (restart) restart.addEventListener("click", function () {
      if (current.type === "twenty48" || current.type === "sudoku") surface.dataset.restartRequested = "true";
      else delete surface.dataset.restartRequested;
      draw();
    });
    if (search) search.addEventListener("input", drawPicker);
    draw();
    setupGameFullscreen(surface);
  }

  function renderGame(game, surface) {
    const map = {
      reaction: renderReaction,
      number: renderNumber,
      pairs: renderPairs,
      tap: renderTap,
      target: renderTarget,
      bubble: renderTarget,
      mole: renderMole,
      brick: renderBrick,
      tetris: renderTetris,
      pong: renderPong,
      space: renderSpaceGuard,
      mazeChase: renderMazeChase,
      flappy: renderFlappy,
      bubbleShooter: renderBubbleShooter,
      snake: renderSnake,
      lane: renderLane,
      chair: renderChairRace,
      catcher: renderCatcher,
      toss: renderToss,
      jegi: renderTraditional,
      tuho: renderTraditional,
      ddakji: renderTraditional,
      gonggi: renderTraditional,
      tictactoe: renderTicTacToe,
      omok: renderOmok,
      solitaire: renderSolitaire,
      freecell: renderFreeCell,
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
    if (!flagshipGameIds.has(game.id)) addLiveMotion(game, surface);
    addPlayGuidance(game, surface);
  }

  function renderTraditional(game, surface) {
    const renderer = window.HANPAN_TRADITIONAL_GAMES && window.HANPAN_TRADITIONAL_GAMES[game.type];
    if (typeof renderer !== "function") {
      renderTap(game, surface);
      return;
    }
    renderer(game, surface, {
      renderScore,
      setResult,
      saveBest,
      getBest,
      createTonePlayer,
      createSpeedSelect,
      cleanup
    });
  }

  function addPlayGuidance(game, surface) {
    if (surface.querySelector(".play-guidance")) return;
    const hints = {
      brick: "마우스, 터치, 좌우 방향키로 패들을 움직입니다. 공과 조작 영역 주변에는 다른 클릭 요소를 두지 않는 구성이 안전합니다.",
      tetris: "방향키로 이동과 회전, 스페이스바로 즉시 낙하합니다. 모바일에서는 좌우와 내리기 버튼을 길게 눌러 연속 조작할 수 있습니다.",
      pong: "위아래 방향키 또는 포인터 이동으로 패들을 움직입니다. 랠리가 빨라지면 중앙으로 돌아오는 습관이 좋습니다.",
      space: "좌우 방향키로 이동하고 스페이스바로 발사합니다. 화면 버튼도 같은 기능을 제공합니다.",
      mazeChase: "방향키 또는 W·A·S·D로 이동합니다. 모바일에서는 방향 버튼이나 게임판 스와이프로 다음 방향을 예약할 수 있습니다.",
      flappy: "스페이스바, 클릭, 터치로 짧게 점프합니다. 길게 누르기보다 일정한 리듬으로 입력하세요.",
      bubbleShooter: "마우스나 손가락으로 조준하고 게임판을 눌러 발사합니다. 방향키로 각도를 조절하고 스페이스바로 쏠 수도 있습니다.",
      snake: "방향키 또는 화면 방향 버튼으로 이동합니다. 반대 방향 급회전은 제한됩니다.",
      chair: "좌우 방향키로 회전하고 위 방향키 또는 가속 버튼으로 밀어 줍니다. 관성 때문에 코너 전에 미리 방향을 잡는 편이 좋습니다.",
      tictactoe: "칸 클릭, 터치, 숫자키 1-9로 둘 수 있습니다. 새 판은 N 키 또는 다시 시작 버튼으로 시작합니다.",
      omok: "빈 교차점을 누르면 돌을 놓습니다. 방향키로 교차점을 이동하고 Enter 또는 스페이스바로 둘 수도 있습니다.",
      solitaire: "카드를 선택한 뒤 목적지를 누르거나 마우스로 끌어 이동합니다. 같은 색을 번갈아 내림차순으로 쌓고 A부터 무늬별로 올리세요.",
      freecell: "카드나 연속 묶음을 선택한 뒤 열, 임시칸, 기초칸을 누릅니다. 빈 임시칸과 빈 열이 많을수록 더 긴 묶음을 옮길 수 있습니다.",
      connect4: "원하는 열을 클릭하거나 터치하면 말이 아래 빈칸으로 떨어집니다.",
      blackjack: "히트, 스탠드, 더블 버튼을 한 번씩 눌러 진행합니다. 실제 돈, 결제, 환전, 경품은 없습니다.",
      dice: "굴리기와 멈추기 버튼으로 진행합니다. 결과 애니메이션이 끝난 뒤 다음 선택을 누르면 실수를 줄일 수 있습니다.",
      slot: "돌리기 버튼은 회전이 끝난 뒤 다시 누를 수 있습니다. 실제 돈, 결제, 환전, 경품은 없습니다.",
      typing: "입력창에 제시어를 정확히 입력합니다. Enter 키로 현재 입력을 지우고 다시 시작할 수 있습니다.",
      recipe: "옮길 병을 먼저 선택하고 받을 병을 선택합니다. 빈 병은 작업 공간으로 남겨 두면 풀이가 쉬워집니다.",
      mines: "열기·깃발 모드를 바꿔 안전 칸과 지뢰를 구분합니다. 열린 숫자를 다시 누르면 주변 깃발 수가 맞을 때 나머지 칸이 함께 열립니다.",
      sudoku: "칸을 선택한 뒤 숫자 패드나 키보드로 입력합니다. 메모 모드에서는 후보 숫자를 여러 개 남길 수 있습니다.",
      twenty48: "방향키·화면 버튼·스와이프로 타일을 밀어 같은 숫자를 합칩니다. 직전 한 수는 실행 취소할 수 있습니다."
      ,jegi: "스페이스바, 화면 터치 또는 제기 차기 버튼으로 발 가까이 내려온 제기를 찹니다. 너무 일찍 차면 연속 기록이 끊깁니다."
      ,tuho: "각도와 힘 슬라이더를 조절하고 화살 던지기를 누릅니다. 바람 방향과 이전 궤적을 보고 다음 발을 보정하세요."
      ,ddakji: "들린 모서리를 방향 버튼으로 고르고 힘 게이지가 노란 구간에 들어올 때 내려치기 버튼이나 스페이스바를 누릅니다."
      ,gonggi: "공깃돌이 손 가까이 돌아오는 순간 화면, 공깃돌 받기 버튼 또는 스페이스바를 누릅니다. 단계가 오를수록 성공 구간이 좁아집니다."
    };
    const note = document.createElement("div");
    note.className = "play-guidance";
    const hint = hints[game.type] || "버튼, 키보드, 터치 입력 중 화면에 표시되는 방식으로 진행합니다. 결과 메시지를 확인한 뒤 다음 판을 시작하세요.";
    const policy = ["blackjack", "slot-machine", "danger-dice"].includes(game.id)
      ? "<p class=\"policy-note\"><strong>무료 오락용 게임</strong><span>이 게임은 실제 돈, 결제, 환전, 경품, 현금성 보상 없이 브라우저 안에서만 진행됩니다.</span></p>"
      : "";
    note.innerHTML = `<p><strong>조작 힌트</strong><span>${hint}</span></p>${policy}`;
    if (flagshipGameIds.has(game.id)) surface.append(note);
    else surface.prepend(note);
  }

  function addLiveMotion(game, surface) {
    if (surface.querySelector("canvas")) return;
    if (surface.querySelector(".live-motion")) return;
    const panel = document.createElement("div");
    panel.className = `live-motion live-motion-${game.category}`;
    panel.setAttribute("aria-hidden", "true");
    for (let i = 0; i < 7; i += 1) {
      const dot = document.createElement("span");
      dot.className = "live-dot";
      dot.style.setProperty("--dot-index", String(i));
      dot.style.setProperty("--dot-delay", `${i * -0.34}s`);
      panel.appendChild(dot);
    }
    const rail = document.createElement("i");
    rail.className = "live-rail";
    panel.appendChild(rail);
    surface.prepend(panel);
  }

  function pulseClass(element, className) {
    if (!element) return;
    element.classList.remove(className);
    void element.offsetWidth;
    element.classList.add(className);
  }

  function renderScore(surface, items) {
    const wrap = document.createElement("div");
    wrap.className = "mini-score game-score-hud";
    wrap.setAttribute("role", "group");
    wrap.setAttribute("aria-label", "현재 게임 기록");
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
    const answer = 1 + Math.floor(Math.random() * 50);
    let low = 1;
    let high = 50;
    let tries = 0;
    surface.innerHTML = `
      <div class="game-stats"><span><b id="miniRange">1-50</b><small>범위</small></span><span><b id="miniTries">0</b><small>시도</small></span><span><b>${getBest(game.id) || "-"}</b><small>최고</small></span></div>
      <div class="vault-visual" aria-hidden="true"><span id="vaultWindow"></span><i id="vaultNeedle"></i></div>
      <div class="number-row"><input id="miniNumber" type="number" min="1" max="50" inputmode="numeric" placeholder="숫자 입력"><button class="button secondary" id="miniGuess" type="button">확인</button></div>
    `;
    const input = $("#miniNumber", surface);
    const guess = $("#miniGuess", surface);
    const range = $("#miniRange", surface);
    const triesEl = $("#miniTries", surface);
    const windowEl = $("#vaultWindow", surface);
    const needle = $("#vaultNeedle", surface);
    function syncWindow(value) {
      const start = ((low - 1) / 49) * 100;
      const width = ((high - low + 1) / 50) * 100;
      windowEl.style.left = `${start}%`;
      windowEl.style.width = `${width}%`;
      if (Number.isFinite(value)) {
        needle.style.left = `${((value - 1) / 49) * 100}%`;
        pulseClass(needle, "ping");
      }
    }
    function submit() {
      const value = Number(input.value);
      if (!Number.isInteger(value) || value < low || value > high) {
        setResult(`${low}부터 ${high} 사이의 숫자를 입력하세요.`);
        pulseClass(input, "input-shake");
        return;
      }
      tries += 1;
      triesEl.textContent = String(tries);
      if (value === answer) {
        input.disabled = true;
        guess.disabled = true;
        syncWindow(value);
        windowEl.classList.add("solved");
        const isBest = saveBest(game.id, tries, function (a, b) { return a < b; });
        setResult(isBest ? `${tries}번 만에 성공. 새 최고 기록입니다.` : `${tries}번 만에 성공했습니다.`);
      } else if (value < answer) {
        low = value + 1;
        range.textContent = `${low}-${high}`;
        input.value = "";
        syncWindow(value);
        setResult(`${value}보다 큽니다.`);
      } else {
        high = value - 1;
        range.textContent = `${low}-${high}`;
        input.value = "";
        syncWindow(value);
        setResult(`${value}보다 작습니다.`);
      }
    }
    guess.addEventListener("click", submit);
    input.addEventListener("keydown", function (event) { if (event.key === "Enter") submit(); });
    syncWindow();
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
    let running = false;
    let timer = null;
    renderScore(surface, [{ label: "점수", value: "0" }, { label: "남은 시간", value: "10" }]);
    const values = surface.querySelectorAll(".mini-score b");
    const tap = button("연타 시작", "mega-button");
    surface.appendChild(tap);
    function startRound() {
      if (running || left <= 0) return;
      running = true;
      setResult("10초 연타가 시작됐습니다.");
      timer = setInterval(function () {
        left -= 1;
        values[1].textContent = String(left);
        if (left <= 0) {
          clearInterval(timer);
          running = false;
          tap.disabled = true;
          const isBest = saveBest(game.id, score, function (a, b) { return a > b; });
          setResult(isBest ? `${score}점. 새 최고 기록입니다.` : `${score}점으로 마무리했습니다.`);
        }
      }, 1000);
    }
    cleanup.push(function () { clearInterval(timer); });
    tap.addEventListener("click", function () {
      if (left <= 0) return;
      startRound();
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
    let running = false;
    let timer = null;
    renderScore(surface, [{ label: "점수", value: "0" }, { label: "남은", value: "20" }]);
    const values = surface.querySelectorAll(".mini-score b");
    const grid = makeGrid(9, "mini-grid mole-grid");
    surface.appendChild(grid);
    const controls = document.createElement("div");
    controls.className = "mini-controls";
    const start = button("시작", "button primary");
    const speedSelect = createSpeedSelect();
    controls.append(start, speedSelect);
    surface.appendChild(controls);
    function show() {
      Array.from(grid.children).forEach(function (cell) {
        cell.textContent = "";
        cell.classList.remove("active");
      });
      const active = grid.children[Math.floor(Math.random() * 9)];
      active.textContent = "!";
      active.classList.add("active");
    }
    function finish() {
      clearInterval(timer);
      running = false;
      start.disabled = true;
      start.textContent = "종료";
      Array.from(grid.children).forEach(function (cell) {
        cell.textContent = "";
        cell.classList.remove("active");
      });
      const isBest = saveBest(game.id, score, function (a, b) { return a > b; });
      setResult(isBest ? `${score}점. 새 최고 기록입니다.` : `${score}점으로 종료했습니다.`);
    }
    function startRound() {
      if (running) return;
      running = true;
      start.disabled = true;
      start.textContent = "진행 중";
      setResult("나타나는 두더지를 빠르게 누르세요.");
      show();
      timer = setInterval(function () {
        left -= 1;
        values[1].textContent = String(left);
        if (left <= 0) finish();
        else show();
      }, 780 / (Number(speedSelect.value) || 1));
    }
    cleanup.push(function () { clearInterval(timer); });
    Array.from(grid.children).forEach(function (cell) {
      cell.addEventListener("click", function () {
        if (running && left > 0 && cell.classList.contains("active")) {
          score += 1;
          values[0].textContent = String(score);
          show();
        }
      });
    });
    start.addEventListener("click", startRound);
    setResult("시작을 누르면 두더지가 나타납니다.");
  }

  function renderBrickLegacy(game, surface) {
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

  function renderBubbleShooter(game, surface) {
    const width = 720;
    const height = 520;
    const radius = 22;
    const diameter = radius * 2;
    const rowGap = 38;
    const columns = 14;
    const top = 30;
    const shooter = { x: width / 2, y: height - 48 };
    const colors = ["#ff6257", "#ffbf3f", "#42b883", "#4e8ff0", "#a66be5"];
    let bubbles = [];
    let projectile = null;
    let nextColor = colors[1];
    let aim = -Math.PI / 2;
    let score = 0;
    let level = 1;
    let misses = 0;
    let combo = 0;
    let running = false;
    let ended = false;
    let frame = null;
    let previousFrame = 0;
    const audio = createTonePlayer();

    renderScore(surface, [
      { label: "점수", value: "0" },
      { label: "레벨", value: "1" },
      { label: "남은 버블", value: "0" },
      { label: "천장 경고", value: "0/5" },
      { label: "최고", value: getBest(game.id) || "-" }
    ]);
    const stats = surface.querySelectorAll(".mini-score b");
    const canvas = document.createElement("canvas");
    canvas.className = "arcade-canvas bubble-shooter-canvas";
    canvas.width = width;
    canvas.height = height;
    canvas.tabIndex = 0;
    canvas.setAttribute("role", "application");
    canvas.setAttribute("aria-label", "버블 슈터 게임판. 마우스나 터치로 조준하고 눌러 발사합니다. 방향키와 스페이스바도 사용할 수 있습니다.");
    const ctx = canvas.getContext("2d");
    const controls = document.createElement("div");
    controls.className = "mini-controls bubble-shooter-controls";
    const start = button("시작", "button primary");
    const restart = button("새 게임", "button secondary");
    const speedSelect = createSpeedSelect();
    const sound = button("소리 켜짐", "button secondary sound-toggle");
    const left = button("왼쪽 조준", "button secondary");
    const shootButton = button("발사", "button primary");
    const right = button("오른쪽 조준", "button secondary");
    sound.setAttribute("aria-pressed", "true");
    controls.append(start, restart, speedSelect, sound, left, shootButton, right);
    const guide = document.createElement("p");
    guide.className = "mini-note";
    guide.textContent = "같은 색을 3개 이상 연결하세요. 연쇄 제거로 천장과 연결이 끊긴 버블을 떨어뜨리면 더 큰 점수를 얻습니다.";
    surface.append(canvas, controls, guide);

    function activePalette() {
      return colors.slice(0, Math.min(colors.length, 3 + Math.floor((level - 1) / 2)));
    }

    function center(row, column) {
      return {
        x: 40 + radius + column * diameter + (row % 2 ? radius : 0),
        y: top + radius + row * rowGap
      };
    }

    function key(row, column) {
      return `${row}:${column}`;
    }

    function bubbleAt(row, column) {
      return bubbles.find(function (bubble) {
        return bubble.row === row && bubble.column === column;
      });
    }

    function neighborCells(row, column) {
      const offsets = row % 2
        ? [[-1, 0], [-1, 1], [0, -1], [0, 1], [1, 0], [1, 1]]
        : [[-1, -1], [-1, 0], [0, -1], [0, 1], [1, -1], [1, 0]];
      return offsets.map(function (offset) {
        return { row: row + offset[0], column: column + offset[1] };
      }).filter(function (cell) {
        return cell.row >= 0 && cell.column >= 0 && cell.column < columns;
      });
    }

    function randomBoardColor() {
      const available = Array.from(new Set(bubbles.map(function (bubble) { return bubble.color; })));
      const palette = available.length ? available : activePalette();
      return sample(palette);
    }

    function buildBoard(rowCount) {
      bubbles = [];
      const palette = activePalette();
      for (let row = 0; row < rowCount; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          if (row > 2 && Math.random() < 0.12) continue;
          bubbles.push({ row, column, color: sample(palette) });
        }
      }
      nextColor = randomBoardColor();
    }

    function updateStats() {
      stats[0].textContent = String(score);
      stats[1].textContent = String(level);
      stats[2].textContent = String(bubbles.length);
      stats[3].textContent = `${misses}/5`;
      stats[4].textContent = String(getBest(game.id) || "-");
    }

    function matchingGroup(origin) {
      const found = [];
      const visited = new Set();
      const queue = [origin];
      while (queue.length) {
        const current = queue.shift();
        const id = key(current.row, current.column);
        if (visited.has(id) || current.color !== origin.color) continue;
        visited.add(id);
        found.push(current);
        neighborCells(current.row, current.column).forEach(function (cell) {
          const neighbor = bubbleAt(cell.row, cell.column);
          if (neighbor && !visited.has(key(neighbor.row, neighbor.column))) queue.push(neighbor);
        });
      }
      return found;
    }

    function unsupportedBubbles() {
      const anchored = new Set();
      const queue = bubbles.filter(function (bubble) { return bubble.row === 0; });
      while (queue.length) {
        const current = queue.shift();
        const id = key(current.row, current.column);
        if (anchored.has(id)) continue;
        anchored.add(id);
        neighborCells(current.row, current.column).forEach(function (cell) {
          const neighbor = bubbleAt(cell.row, cell.column);
          if (neighbor && !anchored.has(key(neighbor.row, neighbor.column))) queue.push(neighbor);
        });
      }
      return bubbles.filter(function (bubble) {
        return !anchored.has(key(bubble.row, bubble.column));
      });
    }

    function hasReachedShooter() {
      return bubbles.some(function (bubble) {
        return center(bubble.row, bubble.column).y + radius >= shooter.y - 54;
      });
    }

    function finishGame(message) {
      running = false;
      ended = true;
      start.textContent = "다시 시작";
      const isBest = saveBest(game.id, score, function (value, previous) { return value > previous; });
      updateStats();
      audio.tone(150, 0.32, "sawtooth", 0.03);
      setResult(isBest ? `${message} 새 최고 점수 ${score}점입니다.` : `${message} 최종 점수는 ${score}점입니다.`);
    }

    function addCeilingRow() {
      bubbles.forEach(function (bubble) { bubble.row += 1; });
      const palette = activePalette();
      for (let column = 0; column < columns; column += 1) {
        bubbles.push({ row: 0, column, color: sample(palette) });
      }
      audio.tone(175, 0.22, "sawtooth", 0.025);
      setResult("실패 발사 5회로 천장이 한 줄 내려왔습니다.");
      if (hasReachedShooter()) finishGame("버블이 발사선에 닿았습니다.");
    }

    function nearestEmptyCell(x, y) {
      const maxRow = Math.max(0, ...bubbles.map(function (bubble) { return bubble.row; })) + 1;
      const occupied = new Set(bubbles.map(function (bubble) { return key(bubble.row, bubble.column); }));
      let best = null;
      for (let row = 0; row <= Math.min(12, maxRow); row += 1) {
        for (let column = 0; column < columns; column += 1) {
          if (occupied.has(key(row, column))) continue;
          const point = center(row, column);
          const distance = Math.hypot(point.x - x, point.y - y);
          if (!best || distance < best.distance) best = { row, column, distance };
        }
      }
      return best;
    }

    function resolveShot() {
      const cell = nearestEmptyCell(projectile.x, projectile.y);
      if (!cell) {
        projectile = null;
        finishGame("더 놓을 공간이 없습니다.");
        return;
      }
      const placed = { row: cell.row, column: cell.column, color: projectile.color };
      bubbles.push(placed);
      projectile = null;
      const group = matchingGroup(placed);
      if (group.length >= 3) {
        const removed = new Set(group.map(function (bubble) { return key(bubble.row, bubble.column); }));
        bubbles = bubbles.filter(function (bubble) { return !removed.has(key(bubble.row, bubble.column)); });
        const falling = unsupportedBubbles();
        const fallingKeys = new Set(falling.map(function (bubble) { return key(bubble.row, bubble.column); }));
        bubbles = bubbles.filter(function (bubble) { return !fallingKeys.has(key(bubble.row, bubble.column)); });
        combo += 1;
        score += group.length * 12 + falling.length * 25 + Math.max(0, combo - 1) * 15;
        misses = 0;
        audio.tone(520 + Math.min(combo, 8) * 35, 0.09, "sine", 0.03);
        if (falling.length) audio.tone(760, 0.14, "triangle", 0.025, 0.08);
        setResult(`${group.length}개 제거${falling.length ? `, ${falling.length}개 연쇄 낙하` : ""}. 콤보 x${combo}!`);
      } else {
        combo = 0;
        misses += 1;
        audio.tone(240, 0.08, "square", 0.018);
        setResult(`같은 색 3개가 이어지지 않았습니다. 천장 경고 ${misses}/5.`);
        if (misses >= 5) {
          misses = 0;
          addCeilingRow();
        }
      }
      if (!bubbles.length && !ended) {
        level += 1;
        score += 250;
        buildBoard(Math.min(8, 5 + Math.floor(level / 2)));
        running = false;
        start.textContent = "다음 레벨";
        audio.tone(660, 0.12, "sine", 0.035);
        audio.tone(880, 0.18, "sine", 0.03, 0.11);
        setResult(`${level - 1}레벨을 정리했습니다. 다음 레벨에는 색과 버블이 늘어납니다.`);
      }
      if (hasReachedShooter() && !ended) finishGame("버블이 발사선에 닿았습니다.");
      nextColor = randomBoardColor();
      saveBest(game.id, score, function (value, previous) { return value > previous; });
      updateStats();
    }

    function shoot() {
      if (!running || ended || projectile) return;
      projectile = {
        x: shooter.x,
        y: shooter.y - 24,
        dx: Math.cos(aim) * 9.5,
        dy: Math.sin(aim) * 9.5,
        color: nextColor
      };
      nextColor = randomBoardColor();
      audio.tone(360, 0.06, "square", 0.022);
      updateStats();
    }

    function moveAim(amount) {
      aim = Math.max(-Math.PI + 0.2, Math.min(-0.2, aim + amount));
    }

    function aimAt(event) {
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width * width;
      const y = (event.clientY - rect.top) / rect.height * height;
      if (y >= shooter.y - 8) return;
      aim = Math.atan2(y - shooter.y, x - shooter.x);
      aim = Math.max(-Math.PI + 0.2, Math.min(-0.2, aim));
    }

    function resetGame() {
      score = 0;
      level = 1;
      misses = 0;
      combo = 0;
      projectile = null;
      ended = false;
      running = false;
      aim = -Math.PI / 2;
      buildBoard(6);
      start.textContent = "시작";
      setResult("조준선을 움직여 같은 색 버블을 세 개 이상 연결하세요.");
      updateStats();
    }

    function toggleRunning() {
      if (ended) {
        resetGame();
        running = true;
      } else {
        running = !running;
      }
      start.textContent = running ? "일시정지" : "계속";
      setResult(running ? "게임판을 누르거나 스페이스바로 발사하세요." : "일시정지했습니다.");
      if (running) audio.tone(440, 0.07, "sine", 0.02);
      canvas.focus({ preventScroll: true });
    }

    function update(now) {
      const scale = animationScale(now, previousFrame, speedSelect);
      previousFrame = now;
      if (!running || !projectile) return;
      projectile.x += projectile.dx * scale;
      projectile.y += projectile.dy * scale;
      if (projectile.x <= radius || projectile.x >= width - radius) {
        projectile.x = Math.max(radius, Math.min(width - radius, projectile.x));
        projectile.dx *= -1;
        audio.tone(290, 0.035, "square", 0.01);
      }
      const hitTop = projectile.y <= top + radius;
      const hitBubble = bubbles.some(function (bubble) {
        const point = center(bubble.row, bubble.column);
        return Math.hypot(projectile.x - point.x, projectile.y - point.y) <= diameter - 3;
      });
      if (hitTop || hitBubble) resolveShot();
    }

    function drawBubble(x, y, color, scale) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale || 1, scale || 1);
      const gradient = ctx.createRadialGradient(-7, -8, 2, 0, 0, radius);
      gradient.addColorStop(0, "#ffffff");
      gradient.addColorStop(0.18, color);
      gradient.addColorStop(1, color);
      ctx.beginPath();
      ctx.arc(0, 0, radius - 1, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.strokeStyle = "rgba(29,36,51,0.7)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }

    function draw(now) {
      update(now);
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#101827";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = "rgba(255,255,255,0.035)";
      for (let x = 0; x < width; x += 48) ctx.fillRect(x, 0, 1, height);
      ctx.fillStyle = "#ffcf5d";
      ctx.fillRect(0, 0, width, 8);
      bubbles.forEach(function (bubble) {
        const point = center(bubble.row, bubble.column);
        drawBubble(point.x, point.y, bubble.color, 1);
      });
      ctx.save();
      ctx.setLineDash([8, 9]);
      ctx.strokeStyle = "rgba(255,255,255,0.72)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(shooter.x, shooter.y - 10);
      ctx.lineTo(shooter.x + Math.cos(aim) * 150, shooter.y + Math.sin(aim) * 150);
      ctx.stroke();
      ctx.restore();
      ctx.save();
      ctx.translate(shooter.x, shooter.y);
      ctx.rotate(aim + Math.PI / 2);
      ctx.fillStyle = "#fffaf0";
      ctx.fillRect(-12, -58, 24, 60);
      ctx.strokeStyle = "#1d2433";
      ctx.lineWidth = 3;
      ctx.strokeRect(-12, -58, 24, 60);
      ctx.restore();
      drawBubble(shooter.x, shooter.y - 18, nextColor, 0.86);
      ctx.fillStyle = "rgba(255,255,255,0.78)";
      ctx.font = "700 14px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("다음", 24, height - 24);
      drawBubble(82, height - 30, nextColor, 0.5);
      if (projectile) drawBubble(projectile.x, projectile.y, projectile.color, 0.94);
      if (!running) {
        ctx.fillStyle = "rgba(16,24,39,0.7)";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "#ffffff";
        ctx.font = "800 30px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(ended ? "게임 종료" : "시작을 눌러 조준", width / 2, height / 2);
      }
      frame = requestAnimationFrame(draw);
    }

    function onKey(event) {
      if (!["ArrowLeft", "ArrowRight", " ", "p", "P"].includes(event.key)) return;
      event.preventDefault();
      if (event.key === "ArrowLeft") moveAim(-0.075);
      if (event.key === "ArrowRight") moveAim(0.075);
      if (event.key === " ") shoot();
      if (event.key.toLowerCase() === "p" && !event.repeat) toggleRunning();
    }

    start.addEventListener("click", toggleRunning);
    restart.addEventListener("click", resetGame);
    sound.addEventListener("click", function () { audio.toggle(sound); });
    left.addEventListener("click", function () { moveAim(-0.09); canvas.focus({ preventScroll: true }); });
    right.addEventListener("click", function () { moveAim(0.09); canvas.focus({ preventScroll: true }); });
    shootButton.addEventListener("click", shoot);
    canvas.addEventListener("pointermove", aimAt);
    canvas.addEventListener("pointerdown", function (event) {
      event.preventDefault();
      aimAt(event);
      if (!running && !ended) toggleRunning();
      shoot();
      canvas.focus({ preventScroll: true });
    });
    document.addEventListener("keydown", onKey);
    cleanup.push(function () {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
      audio.close();
    });
    resetGame();
    frame = requestAnimationFrame(draw);
  }

  function renderBrick(game, surface) {
    const width = 720;
    const height = 430;
    const stageNames = ["시작의 벽", "네온 요새", "별빛 계단"];
    const palette = ["#ff6b5e", "#ffb454", "#5dd2c7", "#6da7ff", "#c98cff"];
    let score = 0;
    let lives = 3;
    let stage = 1;
    let combo = 0;
    let running = false;
    let ended = false;
    let muted = false;
    let frame = null;
    let lastFrame = 0;
    let lastHit = 0;
    let left = false;
    let right = false;
    let bricks = [];
    let drops = [];
    let particles = [];
    let balls = [];
    let message = "시작을 누르거나 스페이스바를 눌러 출발하세요.";
    let messageUntil = 0;
    const paddle = { x: 302, y: 386, w: 116, h: 15, baseWidth: 116, speed: 510, wideUntil: 0, shield: false };
    const audio = typeof window.AudioContext === "function" || typeof window.webkitAudioContext === "function"
      ? new (window.AudioContext || window.webkitAudioContext)()
      : null;

    renderScore(surface, [
      { label: "점수", value: "0" },
      { label: "목숨", value: "3" },
      { label: "스테이지", value: "1" },
      { label: "콤보", value: "x0" },
      { label: "최고", value: getBest(game.id) || "-" }
    ]);
    const stats = surface.querySelectorAll(".mini-score b");
    const canvas = document.createElement("canvas");
    canvas.className = "arcade-canvas brick-break-canvas";
    canvas.width = width;
    canvas.height = height;
    canvas.tabIndex = 0;
    canvas.setAttribute("role", "application");
    canvas.setAttribute("aria-label", "벽돌깨기 게임판. 좌우 방향키 또는 A와 D 키로 패들을 움직이고 스페이스바로 시작하거나 일시 정지합니다.");
    surface.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const controls = document.createElement("div");
    controls.className = "mini-controls brick-controls";
    const start = button("시작", "button primary");
    const restart = button("새 게임", "button secondary");
    const speedSelect = createSpeedSelect();
    const sound = button("소리 켜짐", "button secondary sound-toggle");
    const leftBtn = button("왼쪽", "button secondary");
    const rightBtn = button("오른쪽", "button secondary");
    sound.setAttribute("aria-pressed", "true");
    leftBtn.setAttribute("aria-label", "패들 왼쪽으로 이동");
    rightBtn.setAttribute("aria-label", "패들 오른쪽으로 이동");
    controls.append(start, restart, speedSelect, sound, leftBtn, rightBtn);
    const guide = document.createElement("p");
    guide.className = "mini-note brick-note";
    guide.textContent = "방향키 또는 A/D로 움직입니다. 게임 속도는 기기 화면 주사율과 무관하며 느림·보통·빠름으로 조절할 수 있습니다.";
    surface.append(controls, guide);

    function playTone(frequency, duration, type, volume) {
      if (muted || !audio) return;
      try {
        if (audio.state === "suspended") audio.resume();
        const oscillator = audio.createOscillator();
        const gain = audio.createGain();
        oscillator.type = type || "square";
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(volume || 0.025, audio.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + duration);
        oscillator.connect(gain);
        gain.connect(audio.destination);
        oscillator.start();
        oscillator.stop(audio.currentTime + duration);
      } catch (error) {
        // Audio is optional and must never block game input.
      }
    }

    function announce(text, duration) {
      message = text;
      messageUntil = performance.now() + (duration || 1800);
      setResult(text);
    }

    function updateStats() {
      stats[0].textContent = String(score);
      stats[1].textContent = String(lives);
      stats[2].textContent = String(stage);
      stats[3].textContent = `x${combo}`;
      stats[4].textContent = getBest(game.id) || "-";
    }

    function makeBall(x, y, direction) {
      return {
        x: x == null ? paddle.x + paddle.w / 2 : x,
        y: y == null ? paddle.y - 15 : y,
        dx: direction || (Math.random() > 0.5 ? 235 : -235),
        dy: -275 - Math.min(stage, 7) * 11,
        r: 7
      };
    }

    function stageLayout() {
      const layouts = [
        ["111111111", "122222221", "113333311", "111111111"],
        ["001111100", "012222210", "123333321", "012222210", "001111100"],
        ["100000001", "120000021", "123000321", "123434321", "123333321"]
      ];
      return layouts[(stage - 1) % layouts.length];
    }

    function buildStage() {
      bricks = [];
      drops = [];
      particles = [];
      const layout = stageLayout();
      const cols = 9;
      const gap = 7;
      const brickWidth = 66;
      const brickHeight = 23;
      const boardWidth = cols * brickWidth + (cols - 1) * gap;
      const startX = (width - boardWidth) / 2;
      layout.forEach(function (row, rowIndex) {
        row.split("").forEach(function (value, colIndex) {
          const hp = Number(value);
          if (!hp) return;
          bricks.push({
            x: startX + colIndex * (brickWidth + gap),
            y: 52 + rowIndex * (brickHeight + gap),
            w: brickWidth,
            h: brickHeight,
            hp: hp,
            maxHp: hp,
            color: palette[(stage + rowIndex + colIndex) % palette.length]
          });
        });
      });
    }

    function resetServe() {
      paddle.x = (width - paddle.w) / 2;
      balls = [makeBall()];
    }

    function startNewGame() {
      score = 0;
      lives = 3;
      stage = 1;
      combo = 0;
      ended = false;
      paddle.w = paddle.baseWidth;
      paddle.wideUntil = 0;
      paddle.shield = false;
      buildStage();
      resetServe();
      running = false;
      start.textContent = "시작";
      announce("새 게임 준비 완료. 첫 스테이지는 각도 감각을 익히는 구간입니다.", 2400);
      updateStats();
      draw();
    }

    function burst(x, y, color, amount) {
      for (let i = 0; i < amount; i += 1) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 65 + Math.random() * 125;
        particles.push({ x: x, y: y, dx: Math.cos(angle) * speed, dy: Math.sin(angle) * speed, life: 0.46 + Math.random() * 0.3, color: color });
      }
    }

    function spawnDrop(brick) {
      const roll = Math.random();
      if (roll > 0.18) return;
      const kind = roll < 0.065 ? "multi" : roll < 0.12 ? "wide" : "shield";
      drops.push({ x: brick.x + brick.w / 2, y: brick.y + brick.h / 2, vy: 105, kind: kind, r: 12 });
    }

    function applyDrop(drop) {
      if (drop.kind === "wide") {
        paddle.w = Math.min(178, paddle.baseWidth + 52);
        paddle.wideUntil = performance.now() + 10000;
        announce("와이드 패들! 10초 동안 패들이 넓어집니다.");
        playTone(430, 0.12, "sine", 0.045);
      } else if (drop.kind === "multi") {
        const base = balls[0] || makeBall();
        balls.push({ x: base.x, y: base.y, dx: -Math.abs(base.dx || 230), dy: base.dy, r: 7 });
        balls.push({ x: base.x, y: base.y, dx: Math.abs(base.dx || 230), dy: base.dy, r: 7 });
        announce("멀티볼! 공이 세 개로 늘어났습니다.");
        playTone(660, 0.16, "triangle", 0.045);
      } else {
        paddle.shield = true;
        announce("바닥 보호막! 다음 한 번의 추락을 막아줍니다.");
        playTone(310, 0.18, "sine", 0.045);
      }
    }

    function hitBrick(ball, brick, now) {
      brick.hp -= 1;
      ball.dy *= -1;
      combo = now - lastHit < 1350 ? combo + 1 : 1;
      lastHit = now;
      const points = brick.hp > 0 ? 8 : 18 + Math.min(combo, 12) * 2;
      score += points;
      burst(ball.x, ball.y, brick.color, brick.hp > 0 ? 5 : 11);
      if (brick.hp <= 0) spawnDrop(brick);
      playTone(brick.hp > 0 ? 190 : 330 + combo * 8, 0.055, "square", 0.02);
    }

    function loseBall() {
      if (balls.length) return;
      if (paddle.shield) {
        paddle.shield = false;
        balls = [makeBall()];
        running = false;
        start.textContent = "계속";
        announce("보호막이 공을 되돌렸습니다. 계속을 눌러 재개하세요.");
        playTone(250, 0.2, "sine", 0.045);
        return;
      }
      lives -= 1;
      combo = 0;
      if (lives <= 0) {
        running = false;
        ended = true;
        start.textContent = "새 게임";
        const isBest = saveBest(game.id, score, function (next, previous) { return next > previous; });
        announce(isBest ? `새 최고 기록 ${score}점! 새 게임으로 다시 도전하세요.` : `게임 종료. ${score}점을 기록했습니다.`, 3600);
        playTone(105, 0.42, "sawtooth", 0.05);
      } else {
        resetServe();
        running = false;
        start.textContent = "계속";
        announce(`공을 놓쳤습니다. 남은 목숨은 ${lives}개입니다.`);
        playTone(150, 0.2, "sawtooth", 0.04);
      }
    }

    function clearStage() {
      score += 100 + stage * 25;
      stage += 1;
      combo = 0;
      buildStage();
      resetServe();
      running = false;
      start.textContent = "다음 스테이지";
      announce(`${stage - 1} 스테이지 클리어! ${stageNames[(stage - 1) % stageNames.length]}로 진입합니다.`, 3000);
      playTone(520, 0.12, "triangle", 0.05);
      setTimeout(function () { playTone(660, 0.14, "triangle", 0.04); }, 90);
    }

    function update(delta, now) {
      const direction = (left ? -1 : 0) + (right ? 1 : 0);
      paddle.x += direction * paddle.speed * delta;
      paddle.x = Math.max(14, Math.min(width - paddle.w - 14, paddle.x));
      if (paddle.wideUntil && now > paddle.wideUntil) {
        paddle.w = paddle.baseWidth;
        paddle.wideUntil = 0;
        paddle.x = Math.max(14, Math.min(width - paddle.w - 14, paddle.x));
        announce("와이드 패들이 원래 크기로 돌아왔습니다.");
      }
      particles.forEach(function (particle) {
        particle.x += particle.dx * delta;
        particle.y += particle.dy * delta;
        particle.dy += 180 * delta;
        particle.life -= delta;
      });
      particles = particles.filter(function (particle) { return particle.life > 0; });
      drops.forEach(function (drop) { drop.y += drop.vy * delta; });
      drops = drops.filter(function (drop) {
        const caught = drop.y + drop.r >= paddle.y && drop.y - drop.r <= paddle.y + paddle.h && drop.x >= paddle.x && drop.x <= paddle.x + paddle.w;
        if (caught) applyDrop(drop);
        return !caught && drop.y < height + 30;
      });
      balls.forEach(function (ball) {
        ball.x += ball.dx * delta;
        ball.y += ball.dy * delta;
        if (ball.x < ball.r + 8) { ball.x = ball.r + 8; ball.dx = Math.abs(ball.dx); playTone(120, 0.03, "square", 0.012); }
        if (ball.x > width - ball.r - 8) { ball.x = width - ball.r - 8; ball.dx = -Math.abs(ball.dx); playTone(120, 0.03, "square", 0.012); }
        if (ball.y < ball.r + 8) { ball.y = ball.r + 8; ball.dy = Math.abs(ball.dy); playTone(150, 0.03, "square", 0.012); }
        if (ball.dy > 0 && ball.y + ball.r >= paddle.y && ball.y - ball.r <= paddle.y + paddle.h && ball.x >= paddle.x && ball.x <= paddle.x + paddle.w) {
          const ratio = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
          const speed = Math.min(465, Math.hypot(ball.dx, ball.dy) + 5);
          ball.dx = ratio * speed * 0.92 + direction * 85;
          ball.dy = -Math.max(205, Math.sqrt(Math.max(1, speed * speed - ball.dx * ball.dx)));
          ball.y = paddle.y - ball.r - 1;
          playTone(230, 0.045, "square", 0.02);
        }
        const collision = bricks.find(function (brick) {
          return ball.x + ball.r > brick.x && ball.x - ball.r < brick.x + brick.w && ball.y + ball.r > brick.y && ball.y - ball.r < brick.y + brick.h;
        });
        if (collision) hitBrick(ball, collision, now);
      });
      balls = balls.filter(function (ball) { return ball.y < height + 35; });
      bricks = bricks.filter(function (brick) { return brick.hp > 0; });
      if (!bricks.length) clearStage();
      if (!balls.length) loseBall();
      if (combo && now - lastHit > 1350) combo = 0;
      updateStats();
    }

    function drawDrop(drop) {
      const labels = { wide: "W", multi: "+", shield: "S" };
      const colors = { wide: "#ffb454", multi: "#5dd2c7", shield: "#6da7ff" };
      ctx.beginPath();
      ctx.arc(drop.x, drop.y, drop.r, 0, Math.PI * 2);
      ctx.fillStyle = colors[drop.kind];
      ctx.fill();
      ctx.fillStyle = "#102138";
      ctx.font = "900 14px system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(labels[drop.kind], drop.x, drop.y + 1);
    }

    function draw() {
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#10273f");
      gradient.addColorStop(0.56, "#163a58");
      gradient.addColorStop(1, "#0b1b30");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      for (let i = 0; i < 42; i += 1) {
        const x = (i * 127 + stage * 61) % width;
        const y = (i * 71 + stage * 19) % (height - 45);
        ctx.fillStyle = i % 4 === 0 ? "rgba(255,255,255,0.42)" : "rgba(163,217,255,0.2)";
        ctx.fillRect(x, y, 2, 2);
      }
      ctx.fillStyle = "rgba(255,255,255,0.11)";
      ctx.fillRect(0, 33, width, 1);
      ctx.fillStyle = "#eaf8ff";
      ctx.font = "800 14px system-ui";
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      ctx.fillText(`STAGE ${stage}  ·  ${stageNames[(stage - 1) % stageNames.length]}`, 20, 23);
      bricks.forEach(function (brick) {
        const inset = 3;
        ctx.fillStyle = "rgba(0,0,0,0.22)";
        ctx.fillRect(brick.x + 3, brick.y + 4, brick.w, brick.h);
        ctx.fillStyle = brick.color;
        ctx.fillRect(brick.x, brick.y, brick.w, brick.h);
        ctx.fillStyle = "rgba(255,255,255,0.28)";
        ctx.fillRect(brick.x + inset, brick.y + inset, brick.w - inset * 2, 4);
        if (brick.hp > 1) {
          ctx.fillStyle = "#102138";
          ctx.font = "900 12px system-ui";
          ctx.textAlign = "center";
          ctx.fillText(String(brick.hp), brick.x + brick.w / 2, brick.y + 16);
        }
      });
      drops.forEach(drawDrop);
      particles.forEach(function (particle) {
        ctx.globalAlpha = Math.max(0, particle.life * 1.25);
        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.x, particle.y, 3, 3);
      });
      ctx.globalAlpha = 1;
      if (paddle.shield) {
        ctx.strokeStyle = "#6da7ff";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(width / 2, height + 36, width * 0.57, Math.PI * 1.1, Math.PI * 1.9);
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(0,0,0,0.28)";
      ctx.fillRect(paddle.x + 3, paddle.y + 4, paddle.w, paddle.h);
      ctx.fillStyle = paddle.wideUntil ? "#ffcc68" : "#eaf8ff";
      ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
      balls.forEach(function (ball) {
        const glow = ctx.createRadialGradient(ball.x - 2, ball.y - 2, 1, ball.x, ball.y, ball.r + 7);
        glow.addColorStop(0, "#ffffff");
        glow.addColorStop(0.42, "#ffdf83");
        glow.addColorStop(1, "rgba(255,180,84,0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.r + 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fff5cf";
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
        ctx.fill();
      });
      if (!running) {
        ctx.fillStyle = "rgba(4, 14, 29, 0.58)";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "#ffffff";
        ctx.font = "900 30px system-ui";
        ctx.textAlign = "center";
        ctx.fillText(ended ? "GAME OVER" : stage === 1 && score === 0 ? "BRICK BREAK" : "PAUSED", width / 2, height / 2 - 24);
        ctx.font = "600 16px system-ui";
        ctx.fillStyle = "#d8ecff";
        ctx.fillText(ended ? `최종 점수 ${score}점` : message, width / 2, height / 2 + 12);
        ctx.font = "700 14px system-ui";
        ctx.fillStyle = "#ffdb79";
        ctx.fillText(ended ? "새 게임을 눌러 다시 도전하세요" : "시작 버튼 또는 스페이스바", width / 2, height / 2 + 47);
      } else if (combo >= 3) {
        ctx.fillStyle = "#ffdb79";
        ctx.font = "900 24px system-ui";
        ctx.textAlign = "center";
        ctx.fillText(`${combo} COMBO`, width / 2, height - 42);
      }
    }

    function tick(now) {
      const delta = Math.min(0.032, (now - lastFrame) / 1000 || 0) * (Number(speedSelect.value) || 1);
      lastFrame = now;
      if (running) update(delta, now);
      draw();
      frame = requestAnimationFrame(tick);
    }

    function togglePlay() {
      if (ended) {
        startNewGame();
      }
      running = !running;
      start.textContent = running ? "일시 정지" : "계속";
      if (running) {
        canvas.focus({ preventScroll: true });
        announce(`스테이지 ${stage} 시작. 패들 가장자리로 각도를 조절해 보세요.`);
        playTone(330, 0.08, "square", 0.025);
      } else {
        announce("일시 정지했습니다.");
      }
    }

    function movePointer(event) {
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width * width;
      paddle.x = Math.max(14, Math.min(width - paddle.w - 14, x - paddle.w / 2));
    }

    function hold(direction, active) {
      if (direction === "left") left = active;
      if (direction === "right") right = active;
    }

    function onKey(event) {
      const key = event.key.toLowerCase();
      const handlesKey = running || document.activeElement === canvas || document.activeElement === start;
      if (!handlesKey) return;
      if (key === "arrowleft" || key === "a") { event.preventDefault(); hold("left", event.type === "keydown"); }
      if (key === "arrowright" || key === "d") { event.preventDefault(); hold("right", event.type === "keydown"); }
      if ((key === " " || key === "enter") && event.type === "keydown" && !event.repeat) { event.preventDefault(); togglePlay(); }
    }

    function bindHold(control, direction) {
      control.addEventListener("pointerdown", function (event) { event.preventDefault(); hold(direction, true); control.setPointerCapture(event.pointerId); });
      control.addEventListener("pointerup", function () { hold(direction, false); });
      control.addEventListener("pointercancel", function () { hold(direction, false); });
      control.addEventListener("pointerleave", function () { hold(direction, false); });
    }

    start.addEventListener("click", togglePlay);
    restart.addEventListener("click", startNewGame);
    speedSelect.addEventListener("change", function () {
      announce(`${speedSelect.options[speedSelect.selectedIndex].text}으로 변경했습니다.`);
    });
    sound.addEventListener("click", function () {
      muted = !muted;
      sound.textContent = muted ? "소리 꺼짐" : "소리 켜짐";
      sound.setAttribute("aria-pressed", String(!muted));
      announce(muted ? "게임 소리를 껐습니다." : "게임 소리를 켰습니다.");
      if (!muted) playTone(440, 0.08, "sine", 0.04);
    });
    bindHold(leftBtn, "left");
    bindHold(rightBtn, "right");
    canvas.addEventListener("pointermove", movePointer);
    canvas.addEventListener("pointerdown", function (event) { canvas.focus({ preventScroll: true }); movePointer(event); });
    document.addEventListener("keydown", onKey);
    document.addEventListener("keyup", onKey);
    cleanup.push(function () {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("keyup", onKey);
      if (audio && audio.state !== "closed") audio.close();
    });
    startNewGame();
    tick(performance.now());
  }

  function renderTetrisLegacy(game, surface) {
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

  function renderTetris(game, surface) {
    const cols = 10;
    const rows = 20;
    const cell = 32;
    const width = cols * cell;
    const height = rows * cell;
    const lockDelay = 480;
    const pieces = [
      { id: "I", color: "#55c8e6", shape: [[1, 1, 1, 1]] },
      { id: "O", color: "#f6c85f", shape: [[1, 1], [1, 1]] },
      { id: "T", color: "#ad7be9", shape: [[0, 1, 0], [1, 1, 1]] },
      { id: "L", color: "#f19a4b", shape: [[1, 0, 0], [1, 1, 1]] },
      { id: "J", color: "#5a8dee", shape: [[0, 0, 1], [1, 1, 1]] },
      { id: "S", color: "#65c28b", shape: [[0, 1, 1], [1, 1, 0]] },
      { id: "Z", color: "#eb6b6b", shape: [[1, 1, 0], [0, 1, 1]] }
    ];
    let board = [];
    let bag = [];
    let piece = null;
    let queue = [];
    let heldPiece = null;
    let canHold = true;
    let score = 0;
    let lines = 0;
    let level = 1;
    let combo = 0;
    let backToBack = false;
    let running = false;
    let over = false;
    let muted = false;
    let frame = null;
    let previousFrame = 0;
    let fallElapsed = 0;
    let lockElapsed = 0;
    let lockResets = 0;
    let flashRows = [];
    let flashUntil = 0;
    let repeatTimeout = null;
    let repeatInterval = null;
    let message = "시작을 누르거나 스페이스바를 눌러 플레이하세요.";
    const audio = typeof window.AudioContext === "function" || typeof window.webkitAudioContext === "function"
      ? new (window.AudioContext || window.webkitAudioContext)()
      : null;

    renderScore(surface, [
      { label: "점수", value: "0" },
      { label: "줄", value: "0" },
      { label: "레벨", value: "1" },
      { label: "콤보", value: "-" },
      { label: "최고", value: getBest(game.id) || "-" }
    ]);
    const stats = surface.querySelectorAll(".mini-score b");
    surface.classList.add("block-drop-game");
    const previewStrip = document.createElement("div");
    previewStrip.className = "block-preview-strip";
    const previewSlots = [];
    ["홀드", "다음 1", "다음 2", "다음 3"].forEach(function (label) {
      const slot = document.createElement("div");
      slot.className = "block-preview-slot";
      const title = document.createElement("span");
      title.textContent = label;
      const preview = document.createElement("canvas");
      preview.width = 76;
      preview.height = 58;
      preview.setAttribute("aria-hidden", "true");
      slot.append(title, preview);
      previewStrip.appendChild(slot);
      previewSlots.push(preview);
    });
    surface.appendChild(previewStrip);

    const canvas = document.createElement("canvas");
    canvas.className = "arcade-canvas block-drop-canvas";
    canvas.width = width;
    canvas.height = height;
    canvas.tabIndex = 0;
    canvas.setAttribute("role", "application");
    canvas.setAttribute("aria-label", "블록 드롭 클래식 게임판. 방향키로 이동과 회전, 스페이스바로 즉시 낙하, C 키로 홀드, P 키로 일시 정지합니다.");
    surface.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const controls = document.createElement("div");
    controls.className = "mini-controls block-controls";
    const start = button("시작", "button primary");
    const holdBtn = button("홀드", "button secondary");
    const leftBtn = button("←", "button secondary");
    leftBtn.setAttribute("aria-label", "왼쪽으로 이동");
    leftBtn.title = "왼쪽으로 이동";
    const rotateBtn = button("↻", "button secondary");
    rotateBtn.setAttribute("aria-label", "시계 방향으로 회전");
    rotateBtn.title = "회전";
    const rightBtn = button("→", "button secondary");
    rightBtn.setAttribute("aria-label", "오른쪽으로 이동");
    rightBtn.title = "오른쪽으로 이동";
    const downBtn = button("↓", "button secondary");
    downBtn.setAttribute("aria-label", "한 칸 내리기");
    downBtn.title = "한 칸 내리기";
    const dropBtn = button("⇊", "button secondary");
    dropBtn.setAttribute("aria-label", "즉시 낙하");
    dropBtn.title = "즉시 낙하";
    const sound = button("소리 켬", "button secondary sound-toggle");
    sound.setAttribute("aria-pressed", "true");
    controls.append(start, holdBtn, leftBtn, rotateBtn, rightBtn, downBtn, dropBtn, sound);
    const guide = document.createElement("p");
    guide.className = "mini-note block-note";
    guide.textContent = "방향키 이동 · 위쪽 키 회전 · 스페이스바 즉시 낙하 · C 홀드 · P 일시 정지. 모바일에서는 좌우·내리기 버튼을 길게 누를 수 있습니다.";
    surface.append(controls, guide);

    function tone(frequency, duration, type, volume) {
      if (muted || !audio) return;
      try {
        if (audio.state === "suspended") audio.resume();
        const oscillator = audio.createOscillator();
        const gain = audio.createGain();
        oscillator.type = type || "square";
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(volume || 0.026, audio.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + duration);
        oscillator.connect(gain);
        gain.connect(audio.destination);
        oscillator.start();
        oscillator.stop(audio.currentTime + duration);
      } catch (error) {
        // Sound is optional; game controls must keep working when audio is unavailable.
      }
    }

    function announce(text) {
      message = text;
      setResult(text);
    }

    function sync() {
      stats[0].textContent = String(score);
      stats[1].textContent = String(lines);
      stats[2].textContent = String(level);
      stats[3].textContent = combo > 0 ? `x${combo}` : "-";
      stats[4].textContent = getBest(game.id) || "-";
      holdBtn.disabled = !canHold || over;
      holdBtn.setAttribute("aria-label", canHold ? "현재 블록 홀드" : "이번 블록에서는 홀드를 이미 사용함");
      canvas.dataset.activePiece = piece ? piece.id : "";
      previewStrip.dataset.heldPiece = heldPiece ? heldPiece.id : "";
      previewStrip.dataset.nextPieces = queue.slice(0, 3).map(function (item) { return item.id; }).join(",");
      drawPreviews();
    }

    function cloneShape(shape) {
      return shape.map(function (row) { return row.slice(); });
    }

    function shuffledBag() {
      return shuffle(pieces.slice());
    }

    function makePiece() {
      if (!bag.length) bag = shuffledBag();
      const base = bag.pop();
      return { id: base.id, color: base.color, shape: cloneShape(base.shape), x: 3, y: -2 };
    }

    function fillQueue() {
      while (queue.length < 5) queue.push(makePiece());
    }

    function takeNextPiece() {
      fillQueue();
      const next = queue.shift();
      fillQueue();
      return next;
    }

    function resetPosition(item) {
      item.x = Math.floor((cols - item.shape[0].length) / 2);
      item.y = item.id === "I" ? -1 : -2;
      return item;
    }

    function rotateShape(shape) {
      return shape[0].map(function (_, column) {
        return shape.map(function (row) { return row[column]; }).reverse();
      });
    }

    function collides(testPiece, dx, dy, shape) {
      const target = shape || testPiece.shape;
      for (let row = 0; row < target.length; row += 1) {
        for (let col = 0; col < target[row].length; col += 1) {
          if (!target[row][col]) continue;
          const x = testPiece.x + col + dx;
          const y = testPiece.y + row + dy;
          if (x < 0 || x >= cols || y >= rows) return true;
          if (y >= 0 && board[y][x]) return true;
        }
      }
      return false;
    }

    function ghostY() {
      if (!piece) return 0;
      let distance = 0;
      while (!collides(piece, 0, distance + 1)) distance += 1;
      return piece.y + distance;
    }

    function endGame() {
      running = false;
      over = true;
      start.textContent = "새 게임";
      const isBest = saveBest(game.id, score, function (next, previous) { return next > previous; });
      announce(isBest ? `새 최고 기록 ${score}점! 새 게임을 눌러 다시 도전하세요.` : `게임 종료. ${score}점을 기록했습니다.`);
      tone(105, 0.4, "sawtooth", 0.05);
      sync();
    }

    function spawn() {
      piece = takeNextPiece();
      resetPosition(piece);
      canHold = true;
      fallElapsed = 0;
      lockElapsed = 0;
      lockResets = 0;
      if (collides(piece, 0, 0)) {
        endGame();
        return;
      }
      sync();
    }

    function clearLines() {
      const filled = [];
      board.forEach(function (row, index) { if (row.every(Boolean)) filled.push(index); });
      if (!filled.length) {
        combo = 0;
        return;
      }
      flashRows = filled;
      flashUntil = performance.now() + 140;
      board = board.filter(function (_, index) { return !filled.includes(index); });
      while (board.length < rows) board.unshift(Array(cols).fill(null));
      const cleared = filled.length;
      lines += cleared;
      combo += 1;
      const base = [0, 100, 300, 500, 800][cleared];
      const backToBackBonus = cleared === 4 && backToBack ? Math.round(base * level * 0.5) : 0;
      const comboBonus = combo > 1 ? (combo - 1) * 50 * level : 0;
      score += base * level + backToBackBonus + comboBonus;
      level = 1 + Math.floor(lines / 10);
      if (cleared === 4) {
        announce(`${backToBackBonus ? "백투백 " : ""}4줄 제거 · 콤보 x${combo}`);
        backToBack = true;
      } else {
        announce(`${cleared}줄 제거${combo > 1 ? ` · 콤보 x${combo}` : ""}`);
        backToBack = false;
      }
      tone(cleared === 4 ? 660 : 420 + cleared * 70, 0.13, "triangle", 0.045);
      setTimeout(function () { tone(cleared === 4 ? 880 : 540, 0.12, "triangle", 0.035); }, 75);
    }

    function lockPiece() {
      let toppedOut = false;
      piece.shape.forEach(function (row, rowIndex) {
        row.forEach(function (value, colIndex) {
          const y = piece.y + rowIndex;
          if (!value) return;
          if (y < 0) toppedOut = true;
          else board[y][piece.x + colIndex] = piece.color;
        });
      });
      if (toppedOut) {
        endGame();
        return;
      }
      tone(155, 0.045, "square", 0.02);
      clearLines();
      spawn();
    }

    function resetLockAfterMove() {
      if (collides(piece, 0, 1) && lockResets < 15) {
        lockElapsed = 0;
        lockResets += 1;
      }
    }

    function move(dx, dy, quiet) {
      if (!piece || over || !running) return false;
      if (!collides(piece, dx, dy)) {
        piece.x += dx;
        piece.y += dy;
        if (dx) resetLockAfterMove();
        if (dy) lockElapsed = 0;
        if (!quiet && dx) tone(205, 0.028, "square", 0.012);
        return true;
      }
      return false;
    }

    function rotate() {
      if (!piece || over || !running) return;
      const rotated = rotateShape(piece.shape);
      const kicks = [0, -1, 1, -2, 2];
      const offset = kicks.find(function (x) { return !collides(piece, x, 0, rotated); });
      if (offset !== undefined) {
        piece.x += offset;
        piece.shape = rotated;
        resetLockAfterMove();
        tone(310, 0.045, "square", 0.018);
      } else {
        tone(120, 0.04, "sawtooth", 0.014);
      }
    }

    function hardDrop() {
      if (!running || over) return;
      let distance = 0;
      while (!collides(piece, 0, 1)) {
        piece.y += 1;
        distance += 1;
      }
      score += distance * 2;
      tone(270, 0.06, "square", 0.026);
      lockPiece();
      sync();
    }

    function hold() {
      if (!canHold || !piece || !running || over) return;
      const outgoing = { id: piece.id, color: piece.color, shape: cloneShape(piece.shape), x: 0, y: 0 };
      if (heldPiece) {
        piece = resetPosition(heldPiece);
        heldPiece = outgoing;
      } else {
        heldPiece = outgoing;
        piece = resetPosition(takeNextPiece());
      }
      canHold = false;
      fallElapsed = 0;
      lockElapsed = 0;
      lockResets = 0;
      if (collides(piece, 0, 0)) {
        endGame();
        return;
      }
      tone(500, 0.08, "sine", 0.035);
      announce("홀드 완료. 다음 블록을 보고 현재 배치를 결정하세요.");
      sync();
    }

    function dropInterval() {
      return Math.max(70, 720 * Math.pow(0.82, level - 1));
    }

    function reset() {
      board = Array.from({ length: rows }, function () { return Array(cols).fill(null); });
      bag = [];
      queue = [];
      score = 0;
      lines = 0;
      level = 1;
      combo = 0;
      backToBack = false;
      over = false;
      heldPiece = null;
      fillQueue();
      spawn();
      sync();
    }

    function toggle() {
      if (over) reset();
      running = !running;
      start.textContent = running ? "일시 정지" : "계속";
      if (running) {
        canvas.focus({ preventScroll: true });
        announce("플레이 시작. 그림자 위치를 보고 빈칸 없이 쌓아 보세요.");
        tone(360, 0.08, "square", 0.025);
      } else {
        announce("일시 정지했습니다.");
      }
    }

    function drawBlock(x, y, color, alpha) {
      if (y < 0) return;
      ctx.globalAlpha = alpha == null ? 1 : alpha;
      ctx.fillStyle = color;
      ctx.fillRect(x * cell + 1, y * cell + 1, cell - 2, cell - 2);
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.fillRect(x * cell + 4, y * cell + 4, cell - 8, 4);
      ctx.strokeStyle = "rgba(4, 18, 34, 0.55)";
      ctx.lineWidth = 1;
      ctx.strokeRect(x * cell + 1, y * cell + 1, cell - 2, cell - 2);
      ctx.globalAlpha = 1;
    }

    function drawPreview(canvasElement, item) {
      const previewContext = canvasElement.getContext("2d");
      previewContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
      if (!item) return;
      const previewCell = 13;
      const offsetX = (canvasElement.width - item.shape[0].length * previewCell) / 2;
      const offsetY = (canvasElement.height - item.shape.length * previewCell) / 2;
      item.shape.forEach(function (row, rowIndex) {
        row.forEach(function (value, colIndex) {
          if (!value) return;
          previewContext.fillStyle = item.color;
          previewContext.fillRect(offsetX + colIndex * previewCell, offsetY + rowIndex * previewCell, previewCell - 1, previewCell - 1);
          previewContext.strokeStyle = "rgba(4,18,34,0.55)";
          previewContext.strokeRect(offsetX + colIndex * previewCell, offsetY + rowIndex * previewCell, previewCell - 1, previewCell - 1);
        });
      });
    }

    function drawPreviews() {
      drawPreview(previewSlots[0], heldPiece);
      previewSlots.slice(1).forEach(function (slot, index) { drawPreview(slot, queue[index]); });
    }

    function update(now) {
      if (!previousFrame) previousFrame = now;
      const delta = Math.min(50, now - previousFrame);
      previousFrame = now;
      if (!running || over || !piece) return;
      fallElapsed += delta;
      if (collides(piece, 0, 1)) {
        lockElapsed += delta;
        if (lockElapsed >= lockDelay) lockPiece();
        return;
      }
      lockElapsed = 0;
      const interval = dropInterval();
      if (fallElapsed >= interval) {
        piece.y += 1;
        fallElapsed %= interval;
      }
    }

    function draw(now) {
      update(now || performance.now());
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#102a44");
      gradient.addColorStop(1, "#081523");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = "#091828";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = "#0d2137";
      ctx.fillRect(2, 2, width - 4, height - 4);
      ctx.strokeStyle = "rgba(198, 233, 255, 0.12)";
      ctx.lineWidth = 1;
      for (let col = 0; col <= cols; col += 1) {
        ctx.beginPath();
        ctx.moveTo(col * cell, 0);
        ctx.lineTo(col * cell, height);
        ctx.stroke();
      }
      for (let row = 0; row <= rows; row += 1) {
        ctx.beginPath();
        ctx.moveTo(0, row * cell);
        ctx.lineTo(width, row * cell);
        ctx.stroke();
      }
      board.forEach(function (row, rowIndex) {
        row.forEach(function (value, colIndex) { if (value) drawBlock(colIndex, rowIndex, value); });
      });
      if (piece) {
        const landingY = ghostY();
        piece.shape.forEach(function (row, rowIndex) {
          row.forEach(function (value, colIndex) {
            if (value) drawBlock(piece.x + colIndex, landingY + rowIndex, piece.color, 0.2);
          });
        });
        piece.shape.forEach(function (row, rowIndex) {
          row.forEach(function (value, colIndex) {
            if (value) drawBlock(piece.x + colIndex, piece.y + rowIndex, piece.color);
          });
        });
      }
      if (flashUntil > performance.now()) {
        ctx.fillStyle = "rgba(255,255,255,0.68)";
        flashRows.forEach(function (row) { ctx.fillRect(0, row * cell, width, cell); });
      }
      if (!running) {
        ctx.fillStyle = "rgba(3, 12, 23, 0.68)";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "#ffffff";
        ctx.font = "900 25px system-ui";
        ctx.textAlign = "center";
        ctx.fillText(over ? "GAME OVER" : "BLOCK DROP", width / 2, height / 2 - 28);
        ctx.fillStyle = "#d8ecff";
        ctx.font = "600 14px system-ui";
        ctx.fillText(over ? `최종 점수 ${score}점` : "7종 블록 · 홀드 · 다음 블록 3개", width / 2, height / 2 + 5);
        ctx.fillStyle = "#ffdb79";
        ctx.font = "800 13px system-ui";
        ctx.fillText(over ? "새 게임을 눌러 다시 도전하세요" : "시작 버튼 또는 스페이스바", width / 2, height / 2 + 37);
      }
      frame = requestAnimationFrame(draw);
    }

    function onKey(event) {
      const key = event.key.toLowerCase();
      const handlesKey = running || document.activeElement === canvas || document.activeElement === start;
      if (!handlesKey) return;
      if (!["arrowleft", "arrowright", "arrowdown", "arrowup", " ", "a", "d", "s", "w", "c", "p", "enter"].includes(key)) return;
      event.preventDefault();
      if (event.type !== "keydown") return;
      const repeatable = ["arrowleft", "arrowright", "arrowdown", "a", "d", "s"].includes(key);
      if (event.repeat && !repeatable) return;
      if (key === "p") { toggle(); return; }
      if ((key === " " || key === "enter") && !running) { toggle(); return; }
      if (!running) return;
      if (key === "arrowleft" || key === "a") move(-1, 0);
      if (key === "arrowright" || key === "d") move(1, 0);
      if (key === "arrowdown" || key === "s") { if (move(0, 1, true)) score += 1; }
      if (key === "arrowup" || key === "w") rotate();
      if (key === " ") hardDrop();
      if (key === "c") hold();
      sync();
    }

    function act(action) {
      canvas.focus({ preventScroll: true });
      if (!running && action !== "toggle") toggle();
      if (action === "left") move(-1, 0);
      if (action === "right") move(1, 0);
      if (action === "down" && move(0, 1, true)) score += 1;
      if (action === "rotate") rotate();
      if (action === "drop") hardDrop();
      if (action === "hold") hold();
      sync();
    }

    function stopRepeat() {
      clearTimeout(repeatTimeout);
      clearInterval(repeatInterval);
      repeatTimeout = null;
      repeatInterval = null;
    }

    function bindRepeat(control, action) {
      control.addEventListener("pointerdown", function (event) {
        event.preventDefault();
        stopRepeat();
        act(action);
        control.setPointerCapture(event.pointerId);
        repeatTimeout = setTimeout(function () {
          repeatInterval = setInterval(function () { act(action); }, action === "down" ? 55 : 75);
        }, 190);
      });
      ["pointerup", "pointercancel", "lostpointercapture"].forEach(function (eventName) {
        control.addEventListener(eventName, stopRepeat);
      });
    }

    function onVisibilityChange() {
      if (!document.hidden || !running || over) return;
      running = false;
      start.textContent = "계속";
      announce("다른 화면으로 이동해 게임을 자동으로 멈췄습니다.");
    }

    start.addEventListener("click", toggle);
    holdBtn.addEventListener("click", function () { act("hold"); });
    rotateBtn.addEventListener("click", function () { act("rotate"); });
    dropBtn.addEventListener("click", function () { act("drop"); });
    bindRepeat(leftBtn, "left");
    bindRepeat(rightBtn, "right");
    bindRepeat(downBtn, "down");
    sound.addEventListener("click", function () {
      muted = !muted;
      sound.textContent = muted ? "소리 끔" : "소리 켬";
      sound.setAttribute("aria-pressed", String(!muted));
      announce(muted ? "게임 소리를 껐습니다." : "게임 소리를 켰습니다.");
      if (!muted) tone(440, 0.08, "sine", 0.04);
    });
    document.addEventListener("keydown", onKey);
    document.addEventListener("visibilitychange", onVisibilityChange);
    cleanup.push(function () {
      stopRepeat();
      cancelAnimationFrame(frame);
      surface.classList.remove("block-drop-game");
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (audio && audio.state !== "closed") audio.close();
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
    let matchOver = false;
    let hasStarted = false;
    let up = false;
    let down = false;
    let frame = null;
    let lastFrame = 0;
    let serveUntil = 0;
    let serveDirection = 1;
    let trail = [];
    const audio = createTonePlayer();
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
    canvas.tabIndex = 0;
    canvas.setAttribute("role", "application");
    canvas.setAttribute("aria-label", "퐁 랠리 게임 화면. 위아래 방향키 또는 W와 S 키로 조작합니다.");
    surface.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const controls = document.createElement("div");
    controls.className = "mini-controls pad-controls";
    const start = button("시작", "button primary");
    const difficulty = document.createElement("select");
    difficulty.className = "game-option-select";
    difficulty.setAttribute("aria-label", "상대 난이도");
    [["easy", "쉬움"], ["normal", "보통"], ["hard", "어려움"]].forEach(function (item) {
      const option = document.createElement("option");
      option.value = item[0];
      option.textContent = `난이도 ${item[1]}`;
      if (item[0] === "normal") option.selected = true;
      difficulty.appendChild(option);
    });
    const upBtn = button("위", "button secondary");
    const downBtn = button("아래", "button secondary");
    const speedSelect = createSpeedSelect();
    const sound = button("소리 켜짐", "button secondary sound-toggle");
    sound.setAttribute("aria-pressed", "true");
    controls.append(start, difficulty, speedSelect, upBtn, downBtn, sound);
    const guide = document.createElement("p");
    guide.className = "mini-note arcade-note";
    guide.textContent = "위아래 방향키 또는 W·S로 움직입니다. 속도는 기기 주사율과 무관하며 느림·보통·빠름으로 조절할 수 있습니다.";
    surface.append(controls, guide);
    function sync() {
      stats[0].textContent = String(playerScore);
      stats[1].textContent = String(enemyScore);
      stats[2].textContent = String(rally);
      stats[3].textContent = String(getBest(game.id) || "-");
    }
    function resetBall(direction, countdown) {
      ball.x = width / 2;
      ball.y = height / 2;
      ball.dx = direction * (4.1 + Math.random() * 0.9);
      ball.dy = (Math.random() > 0.5 ? 1 : -1) * (2.4 + Math.random() * 1.8);
      rally = 0;
      trail = [];
      serveDirection = direction;
      serveUntil = countdown ? performance.now() + 2200 : 0;
    }
    function endCheck() {
      if (playerScore >= 7 || enemyScore >= 7) {
        running = false;
        matchOver = true;
        difficulty.disabled = false;
        start.textContent = "다시 시작";
        if (playerScore > enemyScore) {
          audio.tone(523, 0.12, "sine", 0.035);
          audio.tone(659, 0.16, "sine", 0.035, 0.11);
          setResult(`7점 경기 승리. 최고 랠리는 ${getBest(game.id) || rally}회입니다.`);
        } else {
          audio.tone(170, 0.28, "sawtooth", 0.025);
          setResult("상대가 먼저 7점을 얻었습니다. 난이도를 조절해 다시 도전해 보세요.");
        }
      }
    }
    function update(now, frameScale) {
      if (running) {
        if (up) player -= 7 * frameScale;
        if (down) player += 7 * frameScale;
        player = Math.max(12, Math.min(height - 92, player));
        const settings = {
          easy: { tracking: 0.045, error: 28 },
          normal: { tracking: 0.072, error: 13 },
          hard: { tracking: 0.105, error: 4 }
        }[difficulty.value];
        const enemyTarget = ball.dx > 0 ? ball.y - 40 : height / 2 - 40;
        const wobble = Math.sin(now / 520) * settings.error;
        const tracking = 1 - Math.pow(1 - settings.tracking, frameScale);
        enemy += (enemyTarget + wobble - enemy) * tracking;
        enemy = Math.max(12, Math.min(height - 92, enemy));
        if (serveUntil > now) return;
        if (serveUntil) {
          serveUntil = 0;
          ball.dx = Math.abs(ball.dx) * serveDirection;
        }
        ball.x += ball.dx * frameScale;
        ball.y += ball.dy * frameScale;
        trail.unshift({ x: ball.x, y: ball.y });
        trail = trail.slice(0, 8);
        if (ball.y < ball.r || ball.y > height - ball.r) {
          ball.y = Math.max(ball.r, Math.min(height - ball.r, ball.y));
          ball.dy *= -1;
          audio.tone(245, 0.045, "square", 0.014);
        }
        if (ball.x - ball.r < 30 && ball.y > player && ball.y < player + 80 && ball.dx < 0) {
          ball.x = 31 + ball.r;
          ball.dx = Math.min(9.2, Math.abs(ball.dx) + 0.22);
          ball.dy = Math.max(-7.2, Math.min(7.2, ball.dy + (ball.y - (player + 40)) * 0.055));
          rally += 1;
          saveBest(game.id, rally, function (a, b) { return a > b; });
          audio.tone(420 + Math.min(rally, 20) * 9, 0.055, "square", 0.024);
        }
        if (ball.x + ball.r > width - 30 && ball.y > enemy && ball.y < enemy + 80 && ball.dx > 0) {
          ball.x = width - 31 - ball.r;
          ball.dx = -Math.min(9.2, Math.abs(ball.dx) + 0.16);
          ball.dy = Math.max(-7.2, Math.min(7.2, ball.dy + (ball.y - (enemy + 40)) * 0.04));
          rally += 1;
          audio.tone(340 + Math.min(rally, 20) * 7, 0.055, "square", 0.018);
        }
        if (ball.x < -20) {
          enemyScore += 1;
          audio.tone(145, 0.18, "sawtooth", 0.025);
          resetBall(1, true);
          endCheck();
        }
        if (ball.x > width + 20) {
          playerScore += 1;
          audio.tone(620, 0.09, "sine", 0.03);
          audio.tone(820, 0.11, "sine", 0.025, 0.08);
          resetBall(-1, true);
          endCheck();
        }
        sync();
      }
    }
    function draw(now) {
      const frameScale = animationScale(now, lastFrame, speedSelect);
      lastFrame = now;
      update(now, frameScale);
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#101827";
      ctx.fillRect(0, 0, width, height);
      ctx.setLineDash([10, 10]);
      ctx.strokeStyle = "rgba(255,255,255,0.24)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.font = "900 54px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(String(playerScore), width / 2 - 62, 66);
      ctx.fillText(String(enemyScore), width / 2 + 62, 66);
      ctx.shadowBlur = 14;
      ctx.shadowColor = "#5ec8ff";
      ctx.fillStyle = "#5ec8ff";
      ctx.fillRect(18, player, 14, 80);
      ctx.shadowColor = "#ff765e";
      ctx.fillStyle = "#ff765e";
      ctx.fillRect(width - 32, enemy, 14, 80);
      ctx.shadowBlur = 0;
      trail.forEach(function (point, index) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, Math.max(2, ball.r - index * 0.7), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,229,0,${Math.max(0.05, 0.3 - index * 0.035)})`;
        ctx.fill();
      });
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fillStyle = "#ffe500";
      ctx.fill();
      if (running && serveUntil > now) {
        const remaining = Math.max(1, Math.ceil((serveUntil - now) / 700));
        ctx.fillStyle = "rgba(16,24,39,0.62)";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "#ffffff";
        ctx.font = "900 54px sans-serif";
        ctx.fillText(String(remaining), width / 2, height / 2 + 18);
      }
      if (!running) {
        ctx.fillStyle = "rgba(16,24,39,0.76)";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "#ffffff";
        ctx.font = "700 26px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(matchOver ? "경기 종료" : "시작을 눌러 랠리", width / 2, height / 2);
      }
      frame = requestAnimationFrame(draw);
    }
    function toggle() {
      if (matchOver) {
        playerScore = 0;
        enemyScore = 0;
        matchOver = false;
        player = height / 2 - 40;
        enemy = height / 2 - 40;
        resetBall(Math.random() > 0.5 ? 1 : -1, true);
      }
      if (!hasStarted) {
        resetBall(Math.random() > 0.5 ? 1 : -1, true);
        hasStarted = true;
      }
      running = !running;
      start.textContent = running ? "일시정지" : "계속";
      difficulty.disabled = running;
      setResult(running ? "공을 놓치지 말고 반사 각도를 만들어 보세요." : "일시정지했습니다.");
      if (running) audio.tone(360, 0.07, "sine", 0.02);
      sync();
      canvas.focus({ preventScroll: true });
    }
    function hold(which, value) {
      if (which === "up") up = value;
      if (which === "down") down = value;
    }
    function onKey(event) {
      const key = event.key.toLowerCase();
      if (!["ArrowUp", "ArrowDown", " ", "w", "s", "p"].includes(key) && !["ArrowUp", "ArrowDown"].includes(event.key)) return;
      event.preventDefault();
      if (event.key === "ArrowUp" || key === "w") hold("up", event.type === "keydown");
      if (event.key === "ArrowDown" || key === "s") hold("down", event.type === "keydown");
      if ((event.key === " " || key === "p") && event.type === "keydown" && !event.repeat) toggle();
    }
    start.addEventListener("click", toggle);
    sound.addEventListener("click", function () { audio.toggle(sound); });
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
    canvas.addEventListener("pointerdown", function () { canvas.focus({ preventScroll: true }); });
    document.addEventListener("keydown", onKey);
    document.addEventListener("keyup", onKey);
    cleanup.push(function () {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("keyup", onKey);
      audio.close();
    });
    resetBall(Math.random() > 0.5 ? 1 : -1, false);
    sync();
    draw();
  }

  function renderSpaceGuard(game, surface) {
    const width = 640;
    const height = 390;
    let ship = width / 2;
    let bullets = [];
    let enemyBullets = [];
    let enemies = [];
    let score = 0;
    let lives = 3;
    let wave = 1;
    let combo = 0;
    let shield = 100;
    let running = false;
    let gameOver = false;
    let frame = null;
    let lastFrame = 0;
    let left = false;
    let right = false;
    let lastShot = 0;
    let lastEnemyShot = 0;
    let formationDirection = 1;
    let invulnerableUntil = 0;
    let particles = [];
    const audio = createTonePlayer();
    renderScore(surface, [
      { label: "점수", value: "0" },
      { label: "보호막", value: "100" },
      { label: "웨이브", value: "1" },
      { label: "연속 격추", value: "0" },
      { label: "최고", value: getBest(game.id) || "-" }
    ]);
    const stats = surface.querySelectorAll(".mini-score b");
    const canvas = document.createElement("canvas");
    canvas.className = "arcade-canvas wide-canvas";
    canvas.width = width;
    canvas.height = height;
    canvas.tabIndex = 0;
    canvas.setAttribute("role", "application");
    canvas.setAttribute("aria-label", "우주 방어선 게임 화면. 좌우 방향키 또는 A와 D로 이동하고 스페이스바로 발사합니다.");
    surface.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const controls = document.createElement("div");
    controls.className = "mini-controls pad-controls";
    const start = button("시작", "button primary");
    const leftBtn = button("왼쪽", "button secondary");
    const fireBtn = button("발사", "button secondary");
    const rightBtn = button("오른쪽", "button secondary");
    const speedSelect = createSpeedSelect();
    const sound = button("소리 켜짐", "button secondary sound-toggle");
    sound.setAttribute("aria-pressed", "true");
    controls.append(start, speedSelect, leftBtn, fireBtn, rightBtn, sound);
    const guide = document.createElement("p");
    guide.className = "mini-note arcade-note";
    guide.textContent = "좌우 방향키 또는 A·D로 이동하고 스페이스바로 발사합니다. 속도는 느림·보통·빠름으로 언제든 조절할 수 있습니다.";
    surface.append(controls, guide);
    function buildWave() {
      enemies = [];
      enemyBullets = [];
      formationDirection = Math.random() > 0.5 ? 1 : -1;
      const rows = Math.min(2 + Math.ceil(wave / 2), 5);
      const cols = 8;
      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          enemies.push({ x: 72 + c * 62, y: 42 + r * 38, row: r, alive: true });
        }
      }
    }
    function sync() {
      stats[0].textContent = String(score);
      stats[1].textContent = String(Math.max(0, shield));
      stats[2].textContent = String(wave);
      stats[3].textContent = combo ? `x${Math.min(5, 1 + Math.floor(combo / 4))}` : "0";
      stats[4].textContent = String(getBest(game.id) || "-");
    }
    function shoot() {
      const now = Date.now();
      if (!running || now - lastShot < 180) return;
      lastShot = now;
      bullets.push({ x: ship, y: height - 54 });
      audio.tone(620, 0.045, "square", 0.014);
    }
    function finish(message) {
      running = false;
      gameOver = true;
      start.textContent = "다시 시작";
      const isBest = saveBest(game.id, score, function (a, b) { return a > b; });
      setResult(isBest ? `${message} 새 최고 점수 ${score}점입니다.` : message);
      audio.tone(180, 0.32, "sawtooth", 0.028);
    }
    function burst(x, y, color) {
      for (let i = 0; i < 9; i += 1) {
        particles.push({
          x,
          y,
          dx: (Math.random() - 0.5) * 5,
          dy: (Math.random() - 0.5) * 5,
          life: 24,
          color
        });
      }
    }
    function hitShip(now) {
      if (now < invulnerableUntil) return;
      shield -= 34;
      lives -= 1;
      combo = 0;
      invulnerableUntil = now + 1300;
      burst(ship, height - 42, "#5ec8ff");
      audio.tone(125, 0.24, "sawtooth", 0.032);
      if (shield <= 0 || lives <= 0) finish("기체의 보호막이 소진되었습니다.");
      else setResult(`피격되었습니다. 보호막 ${shield}%가 남았습니다.`);
    }
    function update(now, frameScale) {
      if (!running) return;
      if (left) ship -= 6.5 * frameScale;
      if (right) ship += 6.5 * frameScale;
      ship = Math.max(28, Math.min(width - 28, ship));
      bullets.forEach(function (bullet) { bullet.y -= 8 * frameScale; });
      bullets = bullets.filter(function (bullet) { return bullet.y > -20; });
      enemyBullets.forEach(function (bullet) { bullet.y += bullet.speed * frameScale; });
      enemyBullets = enemyBullets.filter(function (bullet) { return bullet.y < height + 20; });
      const formationSpeed = 0.42 + wave * 0.065;
      const edge = enemies.some(function (enemy) {
        return (formationDirection > 0 && enemy.x > width - 42) || (formationDirection < 0 && enemy.x < 42);
      });
      if (edge) {
        formationDirection *= -1;
        enemies.forEach(function (enemy) { enemy.y += 11; });
      }
      enemies.forEach(function (enemy) { enemy.x += formationDirection * formationSpeed * frameScale; });
      const shotInterval = Math.max(420, 1150 - wave * 80) / (Number(speedSelect.value) || 1);
      if (now - lastEnemyShot > shotInterval && enemies.length) {
        lastEnemyShot = now;
        const lowestByColumn = enemies.filter(function (enemy) {
          return !enemies.some(function (other) { return Math.abs(other.x - enemy.x) < 18 && other.y > enemy.y; });
        });
        const shooter = sample(lowestByColumn);
        enemyBullets.push({ x: shooter.x, y: shooter.y + 13, speed: 3.2 + wave * 0.24 });
      }
      bullets.forEach(function (bullet) {
        enemies.forEach(function (enemy) {
          if (!enemy.alive) return;
          if (Math.abs(bullet.x - enemy.x) < 20 && Math.abs(bullet.y - enemy.y) < 16) {
            enemy.alive = false;
            bullet.y = -99;
            combo += 1;
            const multiplier = Math.min(5, 1 + Math.floor(combo / 4));
            score += 15 * multiplier;
            burst(enemy.x, enemy.y, enemy.row % 2 ? "#ff765e" : "#ffe500");
            audio.tone(260 + multiplier * 65, 0.07, "square", 0.02);
          }
        });
      });
      enemies = enemies.filter(function (enemy) { return enemy.alive; });
      enemyBullets.forEach(function (bullet) {
        if (Math.abs(bullet.x - ship) < 24 && bullet.y > height - 72 && bullet.y < height - 18) {
          bullet.y = height + 99;
          hitShip(now);
        }
      });
      enemyBullets = enemyBullets.filter(function (bullet) { return bullet.y < height + 20; });
      if (!running) {
        sync();
        return;
      }
      if (enemies.some(function (enemy) { return enemy.y > height - 74; })) {
        shield = 0;
        sync();
        finish("적 편대가 방어선에 도달했습니다.");
        return;
      }
      if (!enemies.length) {
        wave += 1;
        score += 50 * wave;
        shield = Math.min(100, shield + 20);
        combo = 0;
        buildWave();
        audio.tone(440, 0.09, "sine", 0.03);
        audio.tone(660, 0.12, "sine", 0.03, 0.1);
        setResult(`${wave - 1}웨이브 방어 성공. 다음 편대가 더 빠릅니다.`);
      }
      particles.forEach(function (particle) {
        particle.x += particle.dx * frameScale;
        particle.y += particle.dy * frameScale;
        particle.life -= frameScale;
      });
      particles = particles.filter(function (particle) { return particle.life > 0; });
      sync();
    }
    function draw(now) {
      const frameScale = animationScale(now, lastFrame, speedSelect);
      lastFrame = now;
      update(now, frameScale);
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
        ctx.fillStyle = enemy.row % 2 ? "#ff765e" : "#ffe500";
        ctx.fillRect(enemy.x - 17, enemy.y - 10, 34, 20);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(enemy.x - 7, enemy.y - 16, 14, 8);
      });
      ctx.fillStyle = "#ffcf5d";
      bullets.forEach(function (bullet) { ctx.fillRect(bullet.x - 2, bullet.y - 12, 4, 14); });
      ctx.fillStyle = "#ff765e";
      enemyBullets.forEach(function (bullet) { ctx.fillRect(bullet.x - 3, bullet.y, 6, 13); });
      particles.forEach(function (particle) {
        ctx.globalAlpha = particle.life / 24;
        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4);
      });
      ctx.globalAlpha = now < invulnerableUntil && Math.floor(now / 90) % 2 ? 0.22 : 1;
      ctx.fillStyle = "#5ec8ff";
      ctx.beginPath();
      ctx.moveTo(ship, height - 70);
      ctx.lineTo(ship - 27, height - 24);
      ctx.lineTo(ship, height - 34);
      ctx.lineTo(ship + 27, height - 24);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      ctx.fillRect(18, height - 12, width - 36, 5);
      ctx.fillStyle = shield > 34 ? "#5ec8ff" : "#ff765e";
      ctx.fillRect(18, height - 12, (width - 36) * Math.max(0, shield) / 100, 5);
      if (!running) {
        ctx.fillStyle = "rgba(16,24,39,0.72)";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "#fffdf7";
        ctx.font = "700 26px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(gameOver ? "방어 종료" : "시작을 눌러 방어", width / 2, height / 2);
      }
      frame = requestAnimationFrame(draw);
    }
    function reset() {
      ship = width / 2;
      bullets = [];
      score = 0;
      lives = 3;
      wave = 1;
      combo = 0;
      shield = 100;
      gameOver = false;
      particles = [];
      lastEnemyShot = performance.now();
      buildWave();
      sync();
    }
    function toggle() {
      if (gameOver) reset();
      running = !running;
      start.textContent = running ? "일시정지" : "계속";
      setResult(running ? "적탄을 피하며 편대를 막아내세요." : "일시정지했습니다.");
      if (running) audio.tone(360, 0.08, "sine", 0.02);
      canvas.focus({ preventScroll: true });
    }
    function hold(which, value) {
      if (which === "left") left = value;
      if (which === "right") right = value;
    }
    function onKey(event) {
      const key = event.key.toLowerCase();
      if (!["ArrowLeft", "ArrowRight", " "].includes(event.key) && !["a", "d", "p"].includes(key)) return;
      event.preventDefault();
      if (event.key === "ArrowLeft" || key === "a") hold("left", event.type === "keydown");
      if (event.key === "ArrowRight" || key === "d") hold("right", event.type === "keydown");
      if (event.key === " " && event.type === "keydown" && !event.repeat) {
        if (!running) toggle();
        else shoot();
      }
      if (key === "p" && event.type === "keydown" && !event.repeat) toggle();
    }
    start.addEventListener("click", toggle);
    fireBtn.addEventListener("click", shoot);
    sound.addEventListener("click", function () { audio.toggle(sound); });
    leftBtn.addEventListener("pointerdown", function () { hold("left", true); });
    leftBtn.addEventListener("pointerup", function () { hold("left", false); });
    leftBtn.addEventListener("pointerleave", function () { hold("left", false); });
    rightBtn.addEventListener("pointerdown", function () { hold("right", true); });
    rightBtn.addEventListener("pointerup", function () { hold("right", false); });
    rightBtn.addEventListener("pointerleave", function () { hold("right", false); });
    canvas.addEventListener("pointerdown", function () { canvas.focus({ preventScroll: true }); });
    document.addEventListener("keydown", onKey);
    document.addEventListener("keyup", onKey);
    cleanup.push(function () {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("keyup", onKey);
      audio.close();
    });
    reset();
    draw();
  }

  function renderMazeChase(game, surface) {
    const rows = 21;
    const cols = 19;
    const tile = 30;
    const width = cols * tile;
    const height = rows * tile;
    const tunnelRow = 9;
    const directions = {
      up: { row: -1, col: 0, opposite: "down", angle: -Math.PI / 2 },
      down: { row: 1, col: 0, opposite: "up", angle: Math.PI / 2 },
      left: { row: 0, col: -1, opposite: "right", angle: Math.PI },
      right: { row: 0, col: 1, opposite: "left", angle: 0 }
    };
    const directionOrder = ["up", "left", "down", "right"];
    const sentinelColors = ["#ef476f", "#5ec8ff", "#f6c453"];
    const sentinelHomes = [[9, 7], [9, 9], [9, 11]];
    const scatterTargets = [[1, 17], [1, 1], [19, 17]];
    let maze = [];
    let pellets = new Set();
    let powerPellets = new Set();
    let player = null;
    let sentinels = [];
    let particles = [];
    let score = 0;
    let lives = 3;
    let stage = 1;
    let running = false;
    let gameOver = false;
    let frame = null;
    let lastFrame = 0;
    let gameTime = 0;
    let frightenedUntil = 0;
    let ghostCombo = 0;
    let pauseUntil = 0;
    let invulnerableUntil = 0;
    let statusMessage = "시작을 누르거나 방향을 입력하세요.";
    let lastMode = "scatter";
    let swipeStart = null;
    const audio = createTonePlayer();

    surface.classList.add("maze-chase-game");
    renderScore(surface, [
      { label: "점수", value: "0" },
      { label: "목숨", value: "3" },
      { label: "단계", value: "1" },
      { label: "남은 빛", value: "0" },
      { label: "최고", value: String(getBest(game.id) || "-") }
    ]);
    const stats = surface.querySelectorAll(".mini-score b");
    const status = document.createElement("div");
    status.className = "maze-status";
    status.setAttribute("aria-live", "polite");
    const modeLabel = document.createElement("strong");
    const statusText = document.createElement("span");
    status.append(modeLabel, statusText);
    const canvas = document.createElement("canvas");
    canvas.className = "arcade-canvas maze-canvas";
    canvas.width = width;
    canvas.height = height;
    canvas.tabIndex = 0;
    canvas.setAttribute("role", "application");
    canvas.setAttribute("aria-label", "미로 추격 클래식 게임판. 방향키 또는 W, A, S, D로 이동하며 모바일에서는 방향 버튼과 스와이프를 사용할 수 있습니다.");
    const ctx = canvas.getContext("2d");
    const controls = document.createElement("div");
    controls.className = "mini-controls maze-controls";
    const start = button("시작", "button primary maze-start");
    const speedSelect = createSpeedSelect();
    const upButton = directionButton("↑", "위쪽으로 이동", "up");
    const leftButton = directionButton("←", "왼쪽으로 이동", "left");
    const downButton = directionButton("↓", "아래쪽으로 이동", "down");
    const rightButton = directionButton("→", "오른쪽으로 이동", "right");
    const sound = button("소리 켜짐", "button secondary sound-toggle maze-sound");
    sound.setAttribute("aria-pressed", "true");
    controls.append(start, speedSelect, upButton, leftButton, downButton, rightButton, sound);
    const guide = document.createElement("p");
    guide.className = "mini-note arcade-note";
    guide.textContent = "모든 빛 조각을 모으면 다음 미로로 이동합니다. 큰 파워 코어가 켜진 동안에는 센티널을 역으로 추격할 수 있습니다.";
    surface.append(status, canvas, controls, guide);

    function directionButton(symbol, title, direction) {
      const item = button(symbol, "button secondary maze-direction");
      item.title = title;
      item.setAttribute("aria-label", title);
      item.addEventListener("click", function () { queueDirection(direction); });
      return item;
    }

    function key(row, col) {
      return `${row},${col}`;
    }

    function buildMaze() {
      maze = Array.from({ length: rows }, function () { return Array(cols).fill("#"); });
      const visited = new Set([key(1, 1)]);
      const stack = [[1, 1]];
      maze[1][1] = ".";
      while (stack.length) {
        const current = stack[stack.length - 1];
        const options = [[-2, 0], [2, 0], [0, -2], [0, 2]].map(function (offset) {
          return [current[0] + offset[0], current[1] + offset[1]];
        }).filter(function (cell) {
          return cell[0] > 0 && cell[0] < rows - 1 && cell[1] > 0 && cell[1] < cols - 1 && !visited.has(key(cell[0], cell[1]));
        });
        if (!options.length) {
          stack.pop();
          continue;
        }
        const next = sample(options);
        maze[(current[0] + next[0]) / 2][(current[1] + next[1]) / 2] = ".";
        maze[next[0]][next[1]] = ".";
        visited.add(key(next[0], next[1]));
        stack.push(next);
      }
      const removable = [];
      for (let row = 1; row < rows - 1; row += 1) {
        for (let col = 1; col < cols - 1; col += 1) {
          if (maze[row][col] !== "#") continue;
          const horizontal = row % 2 === 1 && col % 2 === 0 && maze[row][col - 1] === "." && maze[row][col + 1] === ".";
          const vertical = row % 2 === 0 && col % 2 === 1 && maze[row - 1][col] === "." && maze[row + 1][col] === ".";
          if (horizontal || vertical) removable.push([row, col]);
        }
      }
      shuffle(removable).slice(0, 17 + Math.min(stage, 6)).forEach(function (cell) { maze[cell[0]][cell[1]] = "."; });
      maze[tunnelRow][0] = ".";
      maze[tunnelRow][1] = ".";
      maze[tunnelRow][cols - 2] = ".";
      maze[tunnelRow][cols - 1] = ".";
      pellets = new Set();
      powerPellets = new Set();
      const noPellet = new Set([key(19, 9), ...sentinelHomes.map(function (home) { return key(home[0], home[1]); })]);
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          if (maze[row][col] === "." && !noPellet.has(key(row, col))) pellets.add(key(row, col));
        }
      }
      [[1, 1], [1, 17], [19, 1], [19, 17]].forEach(function (cell) {
        const cellKey = key(cell[0], cell[1]);
        if (pellets.has(cellKey)) powerPellets.add(cellKey);
      });
    }

    function createEntity(row, col, direction) {
      return { row, col, dir: direction || null, nextDir: direction || null, progress: 0 };
    }

    function resetEntities() {
      player = createEntity(19, 9, "left");
      sentinels = sentinelHomes.map(function (home, index) {
        const entity = createEntity(home[0], home[1], index === 1 ? "left" : "right");
        entity.index = index;
        entity.activeAt = gameTime + index * 850;
        return entity;
      });
    }

    function isWalkable(row, col) {
      if (row === tunnelRow && (col < 0 || col >= cols)) return true;
      return row >= 0 && row < rows && col >= 0 && col < cols && maze[row][col] !== "#";
    }

    function destination(row, col, direction) {
      const vector = directions[direction];
      let nextRow = row + vector.row;
      let nextCol = col + vector.col;
      if (nextRow === tunnelRow && nextCol < 0) nextCol = cols - 1;
      if (nextRow === tunnelRow && nextCol >= cols) nextCol = 0;
      return { row: nextRow, col: nextCol };
    }

    function canMove(entity, direction) {
      if (!direction) return false;
      const vector = directions[direction];
      return isWalkable(entity.row + vector.row, entity.col + vector.col);
    }

    function position(entity) {
      const vector = entity.dir ? directions[entity.dir] : { row: 0, col: 0 };
      return {
        x: entity.col + 0.5 + vector.col * entity.progress,
        y: entity.row + 0.5 + vector.row * entity.progress
      };
    }

    function reverseEntity(entity) {
      if (!entity.dir) return;
      const reverse = directions[entity.dir].opposite;
      if (entity.progress > 0.0001) {
        const next = destination(entity.row, entity.col, entity.dir);
        entity.row = next.row;
        entity.col = next.col;
        entity.progress = 1 - entity.progress;
      }
      entity.dir = reverse;
    }

    function playerDirection() {
      if (player.nextDir && canMove(player, player.nextDir)) return player.nextDir;
      if (player.dir && canMove(player, player.dir)) return player.dir;
      return null;
    }

    function nearestOpen(target) {
      let best = { row: player.row, col: player.col, distance: Infinity };
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          if (!isWalkable(row, col)) continue;
          const distance = Math.abs(target.row - row) + Math.abs(target.col - col);
          if (distance < best.distance) best = { row, col, distance };
        }
      }
      return best;
    }

    function pathDistance(startCell, targetCell) {
      const target = nearestOpen(targetCell);
      const queue = [{ row: startCell.row, col: startCell.col, distance: 0 }];
      const seen = new Set([key(startCell.row, startCell.col)]);
      for (let index = 0; index < queue.length; index += 1) {
        const current = queue[index];
        if (current.row === target.row && current.col === target.col) return current.distance;
        directionOrder.forEach(function (direction) {
          const next = destination(current.row, current.col, direction);
          const nextKey = key(next.row, next.col);
          if (!seen.has(nextKey) && isWalkable(next.row, next.col)) {
            seen.add(nextKey);
            queue.push({ row: next.row, col: next.col, distance: current.distance + 1 });
          }
        });
      }
      return 999;
    }

    function currentMode() {
      if (gameTime < frightenedUntil) return "frightened";
      return gameTime % 21000 < 6500 ? "scatter" : "chase";
    }

    function chaseTarget(sentinel) {
      const playerVector = player.dir ? directions[player.dir] : { row: 0, col: 0 };
      if (sentinel.index === 0) return { row: player.row, col: player.col };
      if (sentinel.index === 1) return { row: player.row + playerVector.row * 4, col: player.col + playerVector.col * 4 };
      const distance = Math.abs(sentinel.row - player.row) + Math.abs(sentinel.col - player.col);
      return distance > 6 ? { row: player.row, col: player.col } : { row: scatterTargets[2][0], col: scatterTargets[2][1] };
    }

    function sentinelDirection(sentinel) {
      const choices = directionOrder.filter(function (direction) { return canMove(sentinel, direction); });
      const forwardChoices = choices.filter(function (direction) { return direction !== directions[sentinel.dir]?.opposite; });
      const available = forwardChoices.length ? forwardChoices : choices;
      if (!available.length) return null;
      if (currentMode() === "frightened") return sample(available);
      const target = currentMode() === "scatter"
        ? { row: scatterTargets[sentinel.index][0], col: scatterTargets[sentinel.index][1] }
        : chaseTarget(sentinel);
      return available.map(function (direction) {
        const next = destination(sentinel.row, sentinel.col, direction);
        return { direction, distance: pathDistance(next, target) + Math.random() * 0.12 };
      }).sort(function (a, b) { return a.distance - b.distance; })[0].direction;
    }

    function advance(entity, speed, delta, chooseDirection, onArrive) {
      let remaining = speed * delta;
      while (remaining > 0.0001) {
        if (entity.progress <= 0.0001) {
          const nextDirection = chooseDirection(entity);
          entity.dir = nextDirection;
          if (!entity.dir || !canMove(entity, entity.dir)) {
            entity.progress = 0;
            return;
          }
        }
        const step = Math.min(remaining, 1 - entity.progress);
        entity.progress += step;
        remaining -= step;
        if (entity.progress >= 0.9999) {
          const next = destination(entity.row, entity.col, entity.dir);
          entity.row = next.row;
          entity.col = next.col;
          entity.progress = 0;
          if (onArrive) onArrive(entity);
        }
      }
    }

    function burst(row, col, color, count) {
      for (let index = 0; index < (count || 7); index += 1) {
        particles.push({
          x: col + 0.5,
          y: row + 0.5,
          dx: (Math.random() - 0.5) * 2.2,
          dy: (Math.random() - 0.5) * 2.2,
          life: 0.55,
          color
        });
      }
    }

    function collectPellet() {
      const playerKey = key(player.row, player.col);
      if (!pellets.has(playerKey)) return;
      pellets.delete(playerKey);
      if (powerPellets.has(playerKey)) {
        powerPellets.delete(playerKey);
        frightenedUntil = gameTime + Math.max(4300, 7600 - stage * 280);
        ghostCombo = 0;
        score += 50;
        sentinels.forEach(function (sentinel) {
          reverseEntity(sentinel);
        });
        burst(player.row, player.col, "#ffe500", 14);
        audio.tone(680, 0.1, "sine", 0.028);
        audio.tone(920, 0.14, "sine", 0.024, 0.08);
        statusMessage = "파워 코어 활성화. 파란 센티널을 추격하세요.";
      } else {
        score += 10;
        burst(player.row, player.col, "#ffd166", 3);
        if (score % 100 === 0) audio.tone(520, 0.035, "square", 0.012);
      }
      if (!pellets.size) completeStage();
      sync();
    }

    function completeStage() {
      stage += 1;
      score += 500;
      buildMaze();
      resetEntities();
      frightenedUntil = 0;
      pauseUntil = gameTime + 1500;
      statusMessage = `${stage}단계 새 미로입니다. 센티널 속도가 빨라집니다.`;
      setResult(`${stage - 1}단계 완성. 보너스 500점을 얻었습니다.`);
      audio.tone(560, 0.1, "sine", 0.03);
      audio.tone(760, 0.14, "sine", 0.03, 0.1);
      audio.tone(980, 0.18, "sine", 0.028, 0.22);
    }

    function hitPlayer() {
      if (gameTime < invulnerableUntil || gameOver) return;
      lives -= 1;
      audio.tone(150, 0.3, "sawtooth", 0.035);
      burst(player.row, player.col, "#ff765e", 18);
      if (lives <= 0) {
        finish();
        return;
      }
      resetEntities();
      pauseUntil = gameTime + 1200;
      invulnerableUntil = gameTime + 2800;
      statusMessage = `목숨이 ${lives}개 남았습니다. 잠시 뒤 다시 출발합니다.`;
      setResult(statusMessage);
      sync();
    }

    function checkCollisions() {
      const playerPosition = position(player);
      sentinels.forEach(function (sentinel) {
        if (gameTime < sentinel.activeAt) return;
        const sentinelPosition = position(sentinel);
        const rawX = Math.abs(playerPosition.x - sentinelPosition.x);
        const distanceX = Math.min(rawX, cols - rawX);
        const distanceY = Math.abs(playerPosition.y - sentinelPosition.y);
        if (Math.hypot(distanceX, distanceY) >= 0.62) return;
        if (currentMode() === "frightened") {
          ghostCombo += 1;
          const bonus = 200 * Math.pow(2, Math.min(ghostCombo - 1, 3));
          score += bonus;
          burst(sentinel.row, sentinel.col, sentinelColors[sentinel.index], 15);
          sentinel.row = sentinelHomes[sentinel.index][0];
          sentinel.col = sentinelHomes[sentinel.index][1];
          sentinel.progress = 0;
          sentinel.dir = null;
          sentinel.activeAt = gameTime + 1700;
          statusMessage = `센티널 회피 성공. ${bonus}점 콤보입니다.`;
          setResult(statusMessage);
          audio.tone(740 + ghostCombo * 80, 0.1, "square", 0.028);
          sync();
        } else {
          hitPlayer();
        }
      });
    }

    function update(delta) {
      if (!running || gameOver) return;
      gameTime += delta * 1000;
      if (gameTime < pauseUntil) return;
      const playerSpeed = 4.35 + Math.min(stage - 1, 8) * 0.06;
      advance(player, playerSpeed, delta, playerDirection, collectPellet);
      sentinels.forEach(function (sentinel) {
        if (gameTime < sentinel.activeAt) return;
        const frightened = currentMode() === "frightened";
        const sentinelSpeed = (frightened ? 2.65 : 3.35) + Math.min(stage - 1, 8) * 0.14;
        advance(sentinel, sentinelSpeed, delta, sentinelDirection);
      });
      checkCollisions();
      particles.forEach(function (particle) {
        particle.x += particle.dx * delta;
        particle.y += particle.dy * delta;
        particle.life -= delta;
      });
      particles = particles.filter(function (particle) { return particle.life > 0; });
    }

    function drawWall(row, col) {
      const x = col * tile;
      const y = row * tile;
      ctx.fillStyle = "#15335f";
      ctx.fillRect(x + 1, y + 1, tile - 2, tile - 2);
      ctx.strokeStyle = "#43c6d8";
      ctx.lineWidth = 1.4;
      ctx.strokeRect(x + 4, y + 4, tile - 8, tile - 8);
    }

    function drawExplorer(now) {
      const playerPosition = position(player);
      const x = playerPosition.x * tile;
      const y = playerPosition.y * tile;
      const angle = directions[player.dir || "right"].angle;
      const pulse = 1 + Math.sin(now / 85) * 0.06;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.globalAlpha = gameTime < invulnerableUntil && Math.floor(now / 90) % 2 ? 0.35 : 1;
      ctx.fillStyle = "rgba(255, 209, 102, 0.28)";
      ctx.beginPath();
      ctx.arc(0, 0, tile * 0.47 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ff9f43";
      ctx.beginPath();
      ctx.arc(0, 0, tile * 0.34, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fffdf7";
      ctx.beginPath();
      ctx.moveTo(tile * 0.2, 0);
      ctx.lineTo(-tile * 0.07, -tile * 0.13);
      ctx.lineTo(-tile * 0.07, tile * 0.13);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#1d2433";
      ctx.beginPath();
      ctx.arc(-tile * 0.12, 0, tile * 0.055, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawSentinel(sentinel, now) {
      if (gameTime < sentinel.activeAt) return;
      const sentinelPosition = position(sentinel);
      const x = sentinelPosition.x * tile;
      const y = sentinelPosition.y * tile;
      const frightened = currentMode() === "frightened";
      const flashing = frightened && frightenedUntil - gameTime < 1500 && Math.floor(now / 150) % 2;
      const color = frightened ? (flashing ? "#fffdf7" : "#3156b8") : sentinelColors[sentinel.index];
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = "rgba(0, 0, 0, 0.24)";
      ctx.fillRect(-tile * 0.28, tile * 0.3, tile * 0.56, tile * 0.1);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, -tile * 0.38);
      ctx.lineTo(tile * 0.34, -tile * 0.14);
      ctx.lineTo(tile * 0.28, tile * 0.34);
      ctx.lineTo(-tile * 0.28, tile * 0.34);
      ctx.lineTo(-tile * 0.34, -tile * 0.14);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#fffdf7";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = frightened && !flashing ? "#8ec5ff" : "#fffdf7";
      ctx.fillRect(-tile * 0.19, -tile * 0.12, tile * 0.13, tile * 0.14);
      ctx.fillRect(tile * 0.06, -tile * 0.12, tile * 0.13, tile * 0.14);
      ctx.fillStyle = frightened && !flashing ? "#fffdf7" : "#1d2433";
      ctx.fillRect(-tile * 0.14, -tile * 0.08, tile * 0.06, tile * 0.07);
      ctx.fillRect(tile * 0.09, -tile * 0.08, tile * 0.06, tile * 0.07);
      ctx.restore();
    }

    function draw(now) {
      const delta = lastFrame ? Math.min(0.04, (now - lastFrame) / 1000) * (Number(speedSelect.value) || 1) : 0;
      lastFrame = now;
      update(delta);
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#071319";
      ctx.fillRect(0, 0, width, height);
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          if (maze[row][col] === "#") drawWall(row, col);
        }
      }
      pellets.forEach(function (pelletKey) {
        const parts = pelletKey.split(",").map(Number);
        const isPower = powerPellets.has(pelletKey);
        ctx.fillStyle = isPower ? "rgba(255, 229, 0, 0.24)" : "#ffd166";
        if (isPower) {
          ctx.beginPath();
          ctx.arc((parts[1] + 0.5) * tile, (parts[0] + 0.5) * tile, tile * (0.24 + Math.sin(now / 120) * 0.035), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = isPower ? "#ffe500" : "#ffd166";
        ctx.beginPath();
        ctx.arc((parts[1] + 0.5) * tile, (parts[0] + 0.5) * tile, isPower ? tile * 0.13 : tile * 0.06, 0, Math.PI * 2);
        ctx.fill();
      });
      particles.forEach(function (particle) {
        ctx.globalAlpha = Math.max(0, particle.life / 0.55);
        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.x * tile - 2, particle.y * tile - 2, 4, 4);
      });
      ctx.globalAlpha = 1;
      sentinels.forEach(function (sentinel) { drawSentinel(sentinel, now); });
      drawExplorer(now);
      if (!running || gameTime < pauseUntil) {
        ctx.fillStyle = "rgba(7, 19, 25, 0.68)";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "#fffdf7";
        ctx.font = "800 28px sans-serif";
        ctx.textAlign = "center";
        const paused = !gameOver && !running && gameTime > 0;
        ctx.fillText(gameOver ? "추격 종료" : gameTime < pauseUntil ? "준비" : paused ? "일시정지" : "시작을 눌러 출발", width / 2, height / 2 - 6);
        ctx.fillStyle = "#ffe500";
        ctx.font = "700 15px sans-serif";
        ctx.fillText(gameOver ? `최종 점수 ${score}` : paused ? "P · Space로 계속" : "방향키 · WASD · 스와이프", width / 2, height / 2 + 25);
      }
      const mode = currentMode();
      if (mode !== lastMode) {
        if (lastMode === "frightened" && mode !== "frightened") statusMessage = "파워 모드 종료. 센티널이 다시 추격을 시작합니다.";
        else if (mode === "chase") statusMessage = "추격 모드. 센티널이 플레이어 주변 경로로 모입니다.";
        else if (mode === "scatter") statusMessage = "순찰 모드. 센티널이 각자 모서리로 흩어집니다.";
        lastMode = mode;
      }
      modeLabel.textContent = mode === "frightened" ? "파워 모드" : mode === "scatter" ? "순찰 모드" : "추격 모드";
      status.dataset.mode = mode;
      statusText.textContent = statusMessage;
      frame = requestAnimationFrame(draw);
    }

    function sync() {
      stats[0].textContent = String(score);
      stats[1].textContent = String(lives);
      stats[2].textContent = String(stage);
      stats[3].textContent = String(pellets.size);
      stats[4].textContent = String(getBest(game.id) || "-");
    }

    function finish() {
      running = false;
      gameOver = true;
      start.textContent = "다시 시작";
      const isBest = saveBest(game.id, score, function (value, previous) { return value > previous; });
      statusMessage = `모든 목숨을 사용했습니다. ${score}점으로 마쳤습니다.`;
      setResult(isBest ? `새 최고 점수 ${score}점입니다.` : `추격 종료. ${score}점, ${stage}단계까지 도달했습니다.`);
      sync();
    }

    function resetGame() {
      score = 0;
      lives = 3;
      stage = 1;
      gameTime = 0;
      frightenedUntil = 0;
      ghostCombo = 0;
      lastMode = "scatter";
      pauseUntil = 0;
      invulnerableUntil = 0;
      particles = [];
      running = false;
      gameOver = false;
      start.textContent = "시작";
      buildMaze();
      resetEntities();
      statusMessage = "시작을 누르거나 방향을 입력하세요.";
      setResult("미로의 빛 조각을 모두 모으고 센티널을 피하세요.");
      sync();
    }

    function toggle() {
      if (gameOver) resetGame();
      running = !running;
      start.textContent = running ? "일시정지" : "계속";
      statusMessage = running ? "빛 조각을 모으며 다음 교차점 방향을 미리 입력하세요." : "게임을 일시정지했습니다.";
      setResult(statusMessage);
      if (running) audio.tone(390, 0.08, "sine", 0.02);
      canvas.focus({ preventScroll: true });
    }

    function queueDirection(direction) {
      if (gameOver) resetGame();
      if (player.dir && directions[player.dir].opposite === direction) reverseEntity(player);
      player.nextDir = direction;
      if (!running) toggle();
      canvas.focus({ preventScroll: true });
    }

    function onKey(event) {
      const map = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right", w: "up", s: "down", a: "left", d: "right" };
      const pressed = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      if (!(pressed in map) && pressed !== " " && pressed !== "p") return;
      event.preventDefault();
      if ((pressed === " " || pressed === "p") && !event.repeat) toggle();
      else if (pressed in map) queueDirection(map[pressed]);
    }

    start.addEventListener("click", toggle);
    sound.addEventListener("click", function () { audio.toggle(sound); });
    canvas.addEventListener("pointerdown", function (event) {
      swipeStart = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
      canvas.setPointerCapture(event.pointerId);
      canvas.focus({ preventScroll: true });
    });
    canvas.addEventListener("pointerup", function (event) {
      if (!swipeStart) return;
      const dx = event.clientX - swipeStart.x;
      const dy = event.clientY - swipeStart.y;
      swipeStart = null;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) return;
      queueDirection(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up"));
    });
    canvas.addEventListener("pointercancel", function () { swipeStart = null; });
    document.addEventListener("keydown", onKey);
    cleanup.push(function () {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
      audio.close();
      surface.classList.remove("maze-chase-game");
    });
    resetGame();
    draw(0);
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
    let lastFrame = 0;
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
    const speedSelect = createSpeedSelect();
    controls.append(start, speedSelect, jump);
    const guide = document.createElement("p");
    guide.className = "mini-note";
    guide.textContent = "스페이스바나 점프 버튼으로 높이를 조절합니다. 느림·보통·빠름 중 편한 속도를 선택할 수 있습니다.";
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
      bird.vy = -430;
    }
    function finish() {
      running = false;
      lives = 0;
      start.textContent = "다시 시작";
      const isBest = saveBest(game.id, score, function (a, b) { return a > b; });
      sync("종료");
      setResult(isBest ? `충돌했습니다. 새 최고 기록 ${score}개입니다.` : `충돌했습니다. ${score}개를 통과했습니다.`);
    }
    function update(delta) {
      if (!running) return;
      tick += delta * 60;
      bird.vy += 1510 * delta;
      bird.y += bird.vy * delta;
      pipes.forEach(function (pipe) { pipe.x -= 168 * delta; });
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
    function draw(now) {
      const delta = Math.min(0.034, (now - lastFrame) / 1000 || 0) * (Number(speedSelect.value) || 1);
      lastFrame = now;
      update(delta);
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
    let obstacle = -1;
    let score = 0;
    let left = 18;
    let running = false;
    let timer = null;
    renderScore(surface, [{ label: "거리", value: "0" }, { label: "남은", value: "18" }]);
    const values = surface.querySelectorAll(".mini-score b");
    const road = document.createElement("div");
    road.className = "lane-road";
    surface.appendChild(road);
    const controls = document.createElement("div");
    controls.className = "mini-controls";
    const start = button("시작", "button primary");
    const speedSelect = createSpeedSelect();
    const leftBtn = button("왼쪽", "button secondary");
    const rightBtn = button("오른쪽", "button secondary");
    leftBtn.disabled = true;
    rightBtn.disabled = true;
    controls.append(start, speedSelect, leftBtn, rightBtn);
    surface.appendChild(controls);
    function draw(obstacle) {
      road.innerHTML = "";
      for (let i = 0; i < 3; i += 1) {
        const cell = document.createElement("span");
        const collision = i === lane && i === obstacle;
        cell.textContent = collision ? "✦×" : i === lane ? "✦" : i === obstacle ? "■" : "";
        cell.className = collision ? "player danger" : i === lane ? "player" : i === obstacle ? "danger" : "";
        road.appendChild(cell);
      }
    }
    function move(delta) {
      if (!running) return;
      lane = Math.max(0, Math.min(2, lane + delta));
      draw(obstacle);
    }
    leftBtn.addEventListener("click", function () { move(-1); });
    rightBtn.addEventListener("click", function () { move(1); });
    function finish(message) {
      clearInterval(timer);
      running = false;
      leftBtn.disabled = true;
      rightBtn.disabled = true;
      start.disabled = true;
      start.textContent = "종료";
      setResult(message);
    }
    function startRound() {
      if (running) return;
      running = true;
      start.disabled = true;
      start.textContent = "비행 중";
      leftBtn.disabled = false;
      rightBtn.disabled = false;
      setResult("좌우로 항로를 바꾸며 장애물을 피하세요.");
      obstacle = Math.floor(Math.random() * 3);
      draw(obstacle);
      timer = setInterval(function () {
        left -= 1;
        values[1].textContent = String(left);
        if (obstacle === lane) {
          draw(obstacle);
          finish(`장애물에 부딪혔습니다. 이동 거리 ${score}.`);
          return;
        }
        score += 1;
        values[0].textContent = String(score);
        if (left <= 0) {
          saveBest(game.id, score, function (a, b) { return a > b; });
          finish(`비행 성공. 이동 거리 ${score}.`);
          return;
        }
        obstacle = Math.floor(Math.random() * 3);
        draw(obstacle);
      }, 900 / (Number(speedSelect.value) || 1));
    }
    function onKey(event) {
      if (!running || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault();
      move(event.key === "ArrowLeft" ? -1 : 1);
    }
    start.addEventListener("click", startRound);
    document.addEventListener("keydown", onKey);
    cleanup.push(function () {
      clearInterval(timer);
      document.removeEventListener("keydown", onKey);
    });
    draw(-1);
    setResult("시작을 누르면 비행이 시작됩니다.");
  }

  function renderChairRace(game, surface) {
    const width = 640;
    const height = 420;
    let chair = { x: 74, y: 342, angle: -0.18, speed: 0 };
    let running = false;
    let finished = false;
    let frame = null;
    let lastFrame = 0;
    let elapsedMs = 0;
    let runStartedAt = 0;
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
    const speedSelect = createSpeedSelect();
    controls.append(start, speedSelect, leftBtn, boostBtn, rightBtn);
    const guide = document.createElement("p");
    guide.className = "mini-note";
    guide.textContent = "좌우로 방향을 돌리고 위쪽 키나 스페이스바로 의자를 밉니다. 기기와 무관하게 느림·보통·빠름 속도를 선택할 수 있습니다.";
    surface.append(controls, guide);
    let bumps = 0;
    function hitRect(x, y, rect) {
      return x > rect.x && x < rect.x + rect.w && y > rect.y && y < rect.y + rect.h;
    }
    function reset() {
      chair = { x: 74, y: 342, angle: -0.18, speed: 0 };
      running = false;
      finished = false;
      elapsedMs = 0;
      runStartedAt = 0;
      snack = { x: 320, y: 210, active: true, boost: 0 };
      bumps = 0;
      start.textContent = "시작";
      stats[0].textContent = "0.0";
      stats[1].textContent = "0";
      stats[2].textContent = "0";
      setResult("회의실까지 의자를 몰고 가세요.");
    }
    function finish() {
      if (runStartedAt) elapsedMs += Date.now() - runStartedAt;
      runStartedAt = 0;
      finished = true;
      running = false;
      start.textContent = "다시 시작";
      const elapsed = Number((elapsedMs / 1000).toFixed(1));
      const isBest = saveBest(game.id, elapsed, function (a, b) { return a < b; });
      setResult(isBest ? `${elapsed}초 도착. 새 최고 기록입니다.` : `${elapsed}초 만에 회의실에 도착했습니다.`);
    }
    function update(frameScale) {
      if (!running || finished) return;
      if (keys.left) chair.angle -= 0.055 * frameScale;
      if (keys.right) chair.angle += 0.055 * frameScale;
      if (keys.boost) chair.speed += (snack.boost > 0 ? 0.19 : 0.13) * frameScale;
      if (snack.boost > 0) snack.boost -= frameScale;
      chair.speed *= Math.pow(0.982, frameScale);
      chair.speed = Math.max(-1.6, Math.min(snack.boost > 0 ? 6.6 : 4.8, chair.speed));
      const prev = { x: chair.x, y: chair.y };
      chair.x += Math.cos(chair.angle) * chair.speed * frameScale;
      chair.y += Math.sin(chair.angle) * chair.speed * frameScale;
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
      stats[0].textContent = ((elapsedMs + (runStartedAt ? Date.now() - runStartedAt : 0)) / 1000).toFixed(1);
      stats[1].textContent = String(Math.round(Math.abs(chair.speed) * 10));
      stats[2].textContent = String(bumps);
    }
    function draw(now) {
      const frameScale = animationScale(now, lastFrame, speedSelect);
      lastFrame = now;
      update(frameScale);
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
        ctx.fillText(finished ? "도착 완료" : elapsedMs > 0 ? "일시정지" : "시작을 눌러 질주", width / 2, height / 2);
      }
      frame = requestAnimationFrame(draw);
    }
    function toggle() {
      if (finished) reset();
      const now = Date.now();
      if (running) {
        elapsedMs += now - runStartedAt;
        runStartedAt = 0;
        running = false;
      } else {
        running = true;
        runStartedAt = now;
      }
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
    let drop = -1;
    let dropSymbol = "";
    let score = 0;
    let left = 18;
    let running = false;
    let timer = null;
    renderScore(surface, [{ label: "점수", value: "0" }, { label: "남은", value: "18" }]);
    const values = surface.querySelectorAll(".mini-score b");
    const road = document.createElement("div");
    road.className = "lane-road";
    surface.appendChild(road);
    const controls = document.createElement("div");
    controls.className = "mini-controls";
    const start = button("시작", "button primary");
    const speedSelect = createSpeedSelect();
    const leftBtn = button("왼쪽", "button secondary");
    const rightBtn = button("오른쪽", "button secondary");
    leftBtn.disabled = true;
    rightBtn.disabled = true;
    controls.append(start, speedSelect, leftBtn, rightBtn);
    surface.appendChild(controls);
    leftBtn.addEventListener("click", function () { if (running) { pos = Math.max(0, pos - 1); draw(drop, dropSymbol); } });
    rightBtn.addEventListener("click", function () { if (running) { pos = Math.min(2, pos + 1); draw(drop, dropSymbol); } });
    function draw(drop, symbol) {
      road.innerHTML = "";
      for (let i = 0; i < 3; i += 1) {
        const cell = document.createElement("span");
        cell.textContent = i === pos && i === drop ? `▣${symbol}` : i === pos ? "▣" : i === drop ? symbol : "";
        if (i === pos && i === drop) cell.className = symbol === "X" ? "danger" : "player";
        road.appendChild(cell);
      }
    }
    function finish() {
      clearInterval(timer);
      running = false;
      start.disabled = true;
      start.textContent = "종료";
      leftBtn.disabled = true;
      rightBtn.disabled = true;
      saveBest(game.id, score, function (a, b) { return a > b; });
      setResult(`${score}점으로 종료했습니다.`);
    }
    function startRound() {
      if (running) return;
      running = true;
      start.disabled = true;
      start.textContent = "진행 중";
      leftBtn.disabled = false;
      rightBtn.disabled = false;
      setResult("디저트는 받고 탄 음식은 피하세요.");
      drop = Math.floor(Math.random() * 3);
      dropSymbol = Math.random() < 0.22 ? "X" : "●";
      draw(drop, dropSymbol);
      timer = setInterval(function () {
        left -= 1;
        values[1].textContent = String(left);
        if (drop === pos) score += dropSymbol === "X" ? -2 : 2;
        values[0].textContent = String(score);
        if (left <= 0) {
          finish();
          return;
        }
        drop = Math.floor(Math.random() * 3);
        dropSymbol = Math.random() < 0.22 ? "X" : "●";
        draw(drop, dropSymbol);
      }, 900 / (Number(speedSelect.value) || 1));
    }
    function onKey(event) {
      if (!running || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault();
      if (event.key === "ArrowLeft") leftBtn.click();
      else rightBtn.click();
    }
    start.addEventListener("click", startRound);
    document.addEventListener("keydown", onKey);
    cleanup.push(function () {
      clearInterval(timer);
      document.removeEventListener("keydown", onKey);
    });
    draw(-1, "");
    setResult("시작을 누르면 디저트가 떨어집니다.");
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
    surface.classList.add("tic-game");
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    const positions = [
      "왼쪽 위", "위 가운데", "오른쪽 위",
      "왼쪽 가운데", "중앙", "오른쪽 가운데",
      "왼쪽 아래", "아래 가운데", "오른쪽 아래"
    ];
    const scoreKey = "hanpan-tictactoe-session";
    let board = Array(9).fill("");
    let mode = "ai";
    let difficulty = "hard";
    let humanMark = "X";
    let aiMark = "O";
    let turn = "X";
    let gameOver = false;
    let locked = false;
    let winningLine = [];
    let aiTimer = null;
    let roundToken = 0;
    let scores = loadScores();

    const status = document.createElement("div");
    status.className = "tic-status";
    status.setAttribute("aria-live", "polite");

    const scoreWrap = document.createElement("div");
    scoreWrap.className = "tic-scoreboard";
    const scoreItems = [
      { key: "x", label: "X 승" },
      { key: "o", label: "O 승" },
      { key: "draw", label: "무승부" },
      { key: "streak", label: "무패" }
    ];
    const statNodes = {};
    scoreItems.forEach(function (item) {
      const box = document.createElement("span");
      const value = document.createElement("b");
      const label = document.createElement("small");
      value.textContent = "0";
      label.textContent = item.label;
      box.append(value, label);
      scoreWrap.appendChild(box);
      statNodes[item.key] = value;
    });

    const controls = document.createElement("div");
    controls.className = "tic-control-panel";
    const modeButtons = makeSegment("대전 모드", [
      ["ai", "AI 대전"],
      ["local", "2인 대전"]
    ], function (value) {
      mode = value;
      if (mode === "local") humanMark = "X";
      startRound("새 모드로 판을 열었습니다.", true);
    });
    const difficultyButtons = makeSegment("AI 난이도", [
      ["easy", "쉬움"],
      ["normal", "보통"],
      ["hard", "어려움"]
    ], function (value) {
      difficulty = value;
      startRound("난이도를 바꾸고 새 판을 시작했습니다.", true);
    });
    const sideButtons = makeSegment("내 표시", [
      ["X", "X 선공"],
      ["O", "O 후공"]
    ], function (value) {
      humanMark = value;
      startRound(value === "X" ? "X 선공으로 시작합니다." : "O 후공으로 시작합니다. AI가 먼저 둡니다.", true);
    });
    controls.append(modeButtons.wrap, difficultyButtons.wrap, sideButtons.wrap);

    const boardWrap = document.createElement("div");
    boardWrap.className = "tic-board-wrap";
    const grid = document.createElement("div");
    grid.className = "tic-board";
    grid.setAttribute("role", "grid");
    grid.setAttribute("aria-label", "틱택토 3 곱하기 3 보드");
    const cells = Array.from({ length: 9 }, function (_, index) {
      const cell = button("", "tic-cell");
      cell.dataset.index = String(index);
      cell.setAttribute("aria-keyshortcuts", String(index + 1));
      cell.addEventListener("click", function () { playCell(index); });
      grid.appendChild(cell);
      return cell;
    });
    boardWrap.appendChild(grid);

    const insight = document.createElement("p");
    insight.className = "tic-insight";
    const actions = document.createElement("div");
    actions.className = "mini-controls tic-actions";
    const newRound = button("새 판", "button primary");
    const resetScore = button("전적 초기화", "button secondary");
    actions.append(newRound, resetScore);
    const guide = document.createElement("p");
    guide.className = "mini-note tic-note";
    guide.textContent = "마우스와 터치로 빈 칸을 선택하거나 숫자키 1~9를 눌러 둘 수 있습니다. N 키는 새 판을 시작합니다.";

    surface.append(scoreWrap, controls, status, boardWrap, insight, actions, guide);

    function loadScores() {
      try {
        const parsed = JSON.parse(sessionStorage.getItem(scoreKey) || "null");
        if (parsed && typeof parsed === "object") {
          return {
            x: Number(parsed.x) || 0,
            o: Number(parsed.o) || 0,
            draw: Number(parsed.draw) || 0,
            streak: Number(parsed.streak) || 0
          };
        }
      } catch (error) {
        return { x: 0, o: 0, draw: 0, streak: 0 };
      }
      return { x: 0, o: 0, draw: 0, streak: 0 };
    }

    function storeScores() {
      try {
        sessionStorage.setItem(scoreKey, JSON.stringify(scores));
      } catch (error) {
        return false;
      }
      return true;
    }

    function makeSegment(labelText, entries, onSelect) {
      const wrap = document.createElement("div");
      wrap.className = "tic-control-group";
      const label = document.createElement("span");
      label.className = "tic-control-label";
      label.textContent = labelText;
      const row = document.createElement("div");
      row.className = "tic-segment";
      const buttons = entries.map(function (entry) {
        const item = button(entry[1], "tic-segment-button");
        item.dataset.value = entry[0];
        item.addEventListener("click", function () { onSelect(entry[0]); });
        row.appendChild(item);
        return item;
      });
      wrap.append(label, row);
      return { wrap, buttons };
    }

    function available(state) {
      return state
        .map(function (value, index) { return value ? null : index; })
        .filter(function (value) { return value !== null; });
    }

    function outcome(state) {
      for (const line of lines) {
        const mark = state[line[0]];
        if (mark && line.every(function (index) { return state[index] === mark; })) {
          return { mark, line };
        }
      }
      return available(state).length ? null : { mark: "draw", line: [] };
    }

    function nextMark(mark) {
      return mark === "X" ? "O" : "X";
    }

    function findImmediate(mark) {
      for (const index of available(board)) {
        const copy = board.slice();
        copy[index] = mark;
        const result = outcome(copy);
        if (result && result.mark === mark) return index;
      }
      return null;
    }

    function randomMove() {
      const free = available(board);
      return free.length ? sample(free) : null;
    }

    function minimax(state, mark, depth, memo) {
      const result = outcome(state);
      if (result) {
        if (result.mark === aiMark) return 10 - depth;
        if (result.mark === humanMark) return depth - 10;
        return 0;
      }
      const key = `${state.join("-")}|${mark}`;
      if (memo.has(key)) return memo.get(key);
      const scoresForMoves = available(state).map(function (index) {
        const copy = state.slice();
        copy[index] = mark;
        return minimax(copy, nextMark(mark), depth + 1, memo);
      });
      const score = mark === aiMark ? Math.max.apply(null, scoresForMoves) : Math.min.apply(null, scoresForMoves);
      memo.set(key, score);
      return score;
    }

    function bestMove() {
      const memo = new Map();
      let bestScore = -Infinity;
      let bestIndexes = [];
      available(board).forEach(function (index) {
        const copy = board.slice();
        copy[index] = aiMark;
        const score = minimax(copy, humanMark, 0, memo);
        if (score > bestScore) {
          bestScore = score;
          bestIndexes = [index];
        } else if (score === bestScore) {
          bestIndexes.push(index);
        }
      });
      return bestIndexes.length ? sample(bestIndexes) : null;
    }

    function chooseAiMove() {
      const win = findImmediate(aiMark);
      const block = findImmediate(humanMark);
      if (difficulty === "easy") {
        if (win !== null && Math.random() < 0.35) return win;
        if (block !== null && Math.random() < 0.25) return block;
        return Math.random() < 0.2 ? bestMove() : randomMove();
      }
      if (difficulty === "normal") {
        if (win !== null) return win;
        if (block !== null && Math.random() < 0.85) return block;
        return Math.random() < 0.65 ? bestMove() : randomMove();
      }
      return bestMove();
    }

    function setStatus(text) {
      status.textContent = text;
      setResult(text);
    }

    function turnMessage() {
      if (gameOver) return "판이 종료되었습니다.";
      if (locked) return "AI가 다음 수를 계산하고 있습니다.";
      if (mode === "ai") {
        return turn === humanMark ? `${humanMark} 차례입니다. 빈 칸을 선택하세요.` : "AI 차례입니다.";
      }
      return `${turn} 차례입니다. 다음 플레이어가 빈 칸을 선택하세요.`;
    }

    function updateControls() {
      modeButtons.buttons.forEach(function (item) {
        const active = item.dataset.value === mode;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      difficultyButtons.buttons.forEach(function (item) {
        const active = item.dataset.value === difficulty;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
        item.disabled = mode !== "ai";
      });
      sideButtons.buttons.forEach(function (item) {
        const active = item.dataset.value === humanMark;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
        item.disabled = mode !== "ai";
      });
    }

    function updateBoard() {
      const canHumanPlay = !gameOver && !locked && (mode === "local" || turn === humanMark);
      cells.forEach(function (cell, index) {
        const mark = board[index];
        cell.textContent = mark;
        cell.dataset.mark = mark || "empty";
        cell.disabled = !canHumanPlay || Boolean(mark);
        cell.classList.toggle("winning", winningLine.includes(index));
        cell.setAttribute("aria-label", mark ? `${positions[index]} ${mark}` : `${positions[index]} 빈 칸, 단축키 ${index + 1}`);
      });
    }

    function updateStats() {
      statNodes.x.textContent = String(scores.x);
      statNodes.o.textContent = String(scores.o);
      statNodes.draw.textContent = String(scores.draw);
      statNodes.streak.textContent = String(scores.streak);
    }

    function updateInsight() {
      const center = board[4];
      const corners = [0, 2, 6, 8].filter(function (index) { return board[index]; }).length;
      if (gameOver) {
        insight.textContent = "다음 판에서는 중앙, 모서리, 상대의 두 칸 위협 순서로 확인해 보세요.";
      } else if (!center) {
        insight.textContent = "전략 힌트: 중앙은 네 방향 승리선에 걸쳐 있어 가장 강한 시작점입니다.";
      } else if (corners < 2) {
        insight.textContent = "전략 힌트: 중앙이 막혔다면 모서리에서 포크 기회를 만드세요.";
      } else {
        insight.textContent = "전략 힌트: 상대가 두 칸을 이으면 즉시 막고, 동시에 두 줄을 위협하는 포크를 노리세요.";
      }
    }

    function sync(message) {
      surface.setAttribute("aria-busy", locked ? "true" : "false");
      updateControls();
      updateBoard();
      updateStats();
      updateInsight();
      setStatus(message || turnMessage());
    }

    function finish(result) {
      gameOver = true;
      locked = false;
      winningLine = result.line || [];
      if (result.mark === "draw") {
        scores.draw += 1;
        if (mode === "ai") scores.streak += 1;
        storeScores();
        const best = saveBest(game.id, scores.streak, function (a, b) { return a > b; });
        sync(best ? `무승부입니다. 무패 ${scores.streak}판으로 새 최고 기록입니다.` : "무승부입니다. 완벽한 수 싸움이었습니다.");
        return;
      }
      if (result.mark === "X") scores.x += 1;
      if (result.mark === "O") scores.o += 1;
      if (mode === "ai") {
        if (result.mark === humanMark) scores.streak += 1;
        else scores.streak = 0;
      }
      storeScores();
      if (mode === "ai") {
        if (result.mark === humanMark) {
          const best = saveBest(game.id, scores.streak, function (a, b) { return a > b; });
          sync(best ? `${result.mark} 승리. AI를 꺾고 무패 ${scores.streak}판 최고 기록을 세웠습니다.` : `${result.mark} 승리. 좋은 포크와 차단이었습니다.`);
        } else {
          sync(`${result.mark} 승리. AI가 세 칸을 완성했습니다.`);
        }
      } else {
        sync(`${result.mark} 승리. 같은 표시 세 칸이 연결되었습니다.`);
      }
    }

    function afterMove(mark) {
      const result = outcome(board);
      if (result) {
        finish(result);
        return;
      }
      turn = nextMark(mark);
      sync();
      if (mode === "ai" && turn === aiMark) queueAi();
    }

    function playCell(index) {
      if (locked || gameOver || board[index]) return;
      if (mode === "ai" && turn !== humanMark) return;
      board[index] = mode === "ai" ? humanMark : turn;
      afterMove(board[index]);
    }

    function queueAi() {
      locked = true;
      const token = roundToken;
      sync("AI가 다음 수를 계산하고 있습니다.");
      clearTimeout(aiTimer);
      aiTimer = setTimeout(function () {
        if (token !== roundToken || gameOver) return;
        const move = chooseAiMove();
        locked = false;
        if (move === null) return;
        board[move] = aiMark;
        afterMove(aiMark);
      }, difficulty === "hard" ? 220 : 360);
    }

    function startRound(message, shouldFocus) {
      clearTimeout(aiTimer);
      roundToken += 1;
      board = Array(9).fill("");
      winningLine = [];
      gameOver = false;
      locked = false;
      turn = "X";
      aiMark = humanMark === "X" ? "O" : "X";
      if (mode === "local") aiMark = "O";
      sync(message || "새 판을 시작했습니다.");
      if (mode === "ai" && aiMark === "X") queueAi();
      else if (shouldFocus) setTimeout(function () {
        const nextCell = cells.find(function (cell) { return !cell.disabled; });
        if (nextCell) nextCell.focus();
      }, 0);
    }

    function resetSession() {
      scores = { x: 0, o: 0, draw: 0, streak: 0 };
      storeScores();
      startRound("전적을 초기화하고 새 판을 시작했습니다.", true);
    }

    function onKey(event) {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (/^[1-9]$/.test(event.key)) {
        event.preventDefault();
        playCell(Number(event.key) - 1);
      }
      if (event.key.toLowerCase() === "n") {
        event.preventDefault();
        startRound("단축키로 새 판을 시작했습니다.", true);
      }
    }

    newRound.addEventListener("click", function () { startRound("새 판을 시작했습니다.", true); });
    resetScore.addEventListener("click", resetSession);
    document.addEventListener("keydown", onKey);
    cleanup.push(function () {
      clearTimeout(aiTimer);
      document.removeEventListener("keydown", onKey);
      surface.classList.remove("tic-game");
    });
    startRound("AI 대전 어려움 난이도로 시작합니다. X 차례입니다.");
  }

  function renderOmok(game, surface) {
    const size = 15;
    const black = 1;
    const white = 2;
    const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
    const scoreKey = "hanpan-omok-session";
    let board = Array(size * size).fill(0);
    let mode = "ai";
    let difficulty = "normal";
    let turn = black;
    let gameOver = false;
    let locked = false;
    let history = [];
    let winning = [];
    let undoLeft = 3;
    let aiTimer = null;
    let scores = loadScores();
    const audio = createTonePlayer();

    renderScore(surface, [
      { label: "흑 승", value: String(scores.black) },
      { label: "백 승", value: String(scores.white) },
      { label: "무승부", value: String(scores.draw) },
      { label: "최고 연승", value: String(getBest(game.id) || "-") }
    ]);
    const stats = surface.querySelectorAll(".mini-score b");
    const settings = document.createElement("div");
    settings.className = "omok-settings";
    const modeControl = makeChoice("대전 모드", [["ai", "AI 대전"], ["local", "2인 대전"]], mode, function (value) {
      mode = value;
      difficultyControl.buttons.forEach(function (item) { item.disabled = mode === "local"; });
      resetRound(mode === "ai" ? "AI 대전을 시작합니다. 흑돌이 먼저입니다." : "2인 대전을 시작합니다. 흑돌이 먼저입니다.");
    });
    const difficultyControl = makeChoice("AI 난이도", [["easy", "쉬움"], ["normal", "보통"], ["hard", "어려움"]], difficulty, function (value) {
      difficulty = value;
      resetRound(`${value === "easy" ? "쉬움" : value === "hard" ? "어려움" : "보통"} AI로 새 판을 시작합니다.`);
    });
    settings.append(modeControl.wrap, difficultyControl.wrap);

    const status = document.createElement("div");
    status.className = "omok-status";
    status.setAttribute("aria-live", "polite");
    const grid = document.createElement("div");
    grid.className = "omok-board";
    grid.setAttribute("role", "grid");
    grid.setAttribute("aria-label", "15 곱하기 15 오목판");
    const cells = Array.from({ length: size * size }, function (_, index) {
      const row = Math.floor(index / size);
      const column = index % size;
      const cell = button("", "omok-cell");
      cell.dataset.index = String(index);
      cell.setAttribute("role", "gridcell");
      cell.setAttribute("aria-label", `${row + 1}행 ${column + 1}열 빈 교차점`);
      if ([[3, 3], [3, 11], [7, 7], [11, 3], [11, 11]].some(function (point) { return point[0] === row && point[1] === column; })) {
        cell.classList.add("star-point");
      }
      cell.addEventListener("click", function () { play(index); });
      cell.addEventListener("keydown", function (event) { moveFocus(event, index); });
      grid.appendChild(cell);
      return cell;
    });
    const actions = document.createElement("div");
    actions.className = "mini-controls omok-actions";
    const newRound = button("새 판", "button primary");
    const undo = button("한 수 무르기 (3)", "button secondary");
    const sound = button("소리 켜짐", "button secondary sound-toggle");
    sound.setAttribute("aria-pressed", "true");
    actions.append(newRound, undo, sound);
    const guide = document.createElement("p");
    guide.className = "mini-note";
    guide.textContent = "가로·세로·대각선으로 같은 돌 다섯 개를 먼저 이으면 승리합니다. 방향키와 Enter 또는 스페이스바도 지원합니다.";
    surface.append(settings, status, grid, actions, guide);

    function makeChoice(label, options, initial, onChange) {
      const wrap = document.createElement("div");
      wrap.className = "omok-control-group";
      const title = document.createElement("span");
      title.className = "omok-control-label";
      title.textContent = label;
      const segment = document.createElement("div");
      segment.className = "omok-segment";
      segment.setAttribute("role", "group");
      segment.setAttribute("aria-label", label);
      const items = options.map(function (option) {
        const item = button(option[1], "omok-segment-button");
        item.dataset.value = option[0];
        item.classList.toggle("active", option[0] === initial);
        item.setAttribute("aria-pressed", String(option[0] === initial));
        item.addEventListener("click", function () {
          items.forEach(function (candidate) {
            const active = candidate === item;
            candidate.classList.toggle("active", active);
            candidate.setAttribute("aria-pressed", String(active));
          });
          onChange(option[0]);
        });
        segment.appendChild(item);
        return item;
      });
      wrap.append(title, segment);
      return { wrap, buttons: items };
    }

    function loadScores() {
      try {
        const parsed = JSON.parse(localStorage.getItem(scoreKey) || "null");
        if (parsed && Number.isFinite(parsed.black) && Number.isFinite(parsed.white) && Number.isFinite(parsed.draw)) return parsed;
      } catch (error) {
        // Session scores are optional.
      }
      return { black: 0, white: 0, draw: 0, streak: 0 };
    }

    function storeScores() {
      try { localStorage.setItem(scoreKey, JSON.stringify(scores)); } catch (error) { /* Optional storage. */ }
    }

    function inside(row, column) {
      return row >= 0 && row < size && column >= 0 && column < size;
    }

    function at(row, column) {
      return inside(row, column) ? board[row * size + column] : -1;
    }

    function lineFrom(index, stone) {
      const row = Math.floor(index / size);
      const column = index % size;
      for (const direction of directions) {
        const line = [index];
        let nextRow = row + direction[0];
        let nextColumn = column + direction[1];
        while (inside(nextRow, nextColumn) && at(nextRow, nextColumn) === stone) {
          line.push(nextRow * size + nextColumn);
          nextRow += direction[0];
          nextColumn += direction[1];
        }
        nextRow = row - direction[0];
        nextColumn = column - direction[1];
        while (inside(nextRow, nextColumn) && at(nextRow, nextColumn) === stone) {
          line.unshift(nextRow * size + nextColumn);
          nextRow -= direction[0];
          nextColumn -= direction[1];
        }
        if (line.length >= 5) return line;
      }
      return [];
    }

    function candidateMoves() {
      if (!history.length) return [7 * size + 7];
      const candidates = [];
      for (let index = 0; index < board.length; index += 1) {
        if (board[index]) continue;
        const row = Math.floor(index / size);
        const column = index % size;
        let near = false;
        for (let rowOffset = -2; rowOffset <= 2 && !near; rowOffset += 1) {
          for (let columnOffset = -2; columnOffset <= 2; columnOffset += 1) {
            if (at(row + rowOffset, column + columnOffset) > 0) {
              near = true;
              break;
            }
          }
        }
        if (near) candidates.push(index);
      }
      return candidates.length ? candidates : board.map(function (_, index) { return index; }).filter(function (index) { return !board[index]; });
    }

    function patternScore(index, stone) {
      const row = Math.floor(index / size);
      const column = index % size;
      let total = 0;
      directions.forEach(function (direction) {
        let count = 1;
        let open = 0;
        let nextRow = row + direction[0];
        let nextColumn = column + direction[1];
        while (inside(nextRow, nextColumn) && at(nextRow, nextColumn) === stone) {
          count += 1;
          nextRow += direction[0];
          nextColumn += direction[1];
        }
        if (inside(nextRow, nextColumn) && at(nextRow, nextColumn) === 0) open += 1;
        nextRow = row - direction[0];
        nextColumn = column - direction[1];
        while (inside(nextRow, nextColumn) && at(nextRow, nextColumn) === stone) {
          count += 1;
          nextRow -= direction[0];
          nextColumn -= direction[1];
        }
        if (inside(nextRow, nextColumn) && at(nextRow, nextColumn) === 0) open += 1;
        if (count >= 5) total += 1000000;
        else if (count === 4 && open === 2) total += 90000;
        else if (count === 4) total += 18000;
        else if (count === 3 && open === 2) total += 7000;
        else if (count === 3) total += 1200;
        else if (count === 2 && open === 2) total += 500;
        else if (count === 2) total += 90;
        else if (open === 2) total += 18;
      });
      total += Math.max(0, 12 - Math.abs(7 - row) - Math.abs(7 - column));
      return total;
    }

    function wouldWin(index, stone) {
      board[index] = stone;
      const result = lineFrom(index, stone).length >= 5;
      board[index] = 0;
      return result;
    }

    function chooseAiMove() {
      const candidates = candidateMoves();
      if (difficulty === "easy") return sample(candidates);
      const winningMove = candidates.find(function (index) { return wouldWin(index, white); });
      if (winningMove !== undefined) return winningMove;
      const blockingMove = candidates.find(function (index) { return wouldWin(index, black); });
      if (blockingMove !== undefined) return blockingMove;
      const ranked = candidates.map(function (index) {
        const attack = patternScore(index, white);
        const defense = patternScore(index, black);
        const noise = difficulty === "normal" ? Math.random() * 220 : 0;
        return { index, score: attack + defense * (difficulty === "hard" ? 1.08 : 0.88) + noise };
      }).sort(function (a, b) { return b.score - a.score; });
      if (difficulty === "normal") return sample(ranked.slice(0, Math.min(3, ranked.length))).index;
      return ranked[0].index;
    }

    function updateScores() {
      stats[0].textContent = String(scores.black);
      stats[1].textContent = String(scores.white);
      stats[2].textContent = String(scores.draw);
      stats[3].textContent = String(getBest(game.id) || "-");
    }

    function sync(message) {
      cells.forEach(function (cell, index) {
        const stone = board[index];
        const row = Math.floor(index / size);
        const column = index % size;
        cell.dataset.stone = stone === black ? "black" : stone === white ? "white" : "empty";
        cell.classList.toggle("last-move", history.length > 0 && history[history.length - 1] === index);
        cell.classList.toggle("winning", winning.includes(index));
        cell.disabled = gameOver;
        cell.setAttribute("aria-disabled", String(gameOver || locked));
        cell.setAttribute("aria-label", `${row + 1}행 ${column + 1}열 ${stone === black ? "흑돌" : stone === white ? "백돌" : "빈 교차점"}`);
      });
      undo.disabled = gameOver || locked || !history.length || undoLeft <= 0;
      undo.textContent = `한 수 무르기 (${undoLeft})`;
      status.innerHTML = `<strong>${gameOver ? "대국 종료" : locked ? "AI 생각 중" : turn === black ? "흑 차례" : "백 차례"}</strong><span>${message}</span>`;
      updateScores();
    }

    function finish(winner, line) {
      gameOver = true;
      locked = false;
      winning = line || [];
      if (winner === black) {
        scores.black += 1;
        scores.streak = mode === "ai" ? scores.streak + 1 : scores.streak;
        if (mode === "ai") saveBest(game.id, scores.streak, function (value, previous) { return value > previous; });
      } else if (winner === white) {
        scores.white += 1;
        if (mode === "ai") scores.streak = 0;
      } else {
        scores.draw += 1;
      }
      storeScores();
      audio.tone(winner === black ? 660 : winner === white ? 420 : 300, 0.16, "sine", 0.035);
      if (winner) audio.tone(winner === black ? 880 : 520, 0.2, "sine", 0.03, 0.13);
      const label = winner === black ? "흑돌" : winner === white ? "백돌" : "무승부";
      sync(winner ? `${label}이 다섯 돌을 이었습니다.` : "빈 교차점이 없어 무승부입니다.");
      setResult(winner ? `${label} 승리. 새 판에서 다시 대국할 수 있습니다.` : "무승부입니다. 새 판에서 다시 대국해 보세요.");
    }

    function place(index, stone) {
      board[index] = stone;
      history.push(index);
      audio.tone(stone === black ? 330 : 440, 0.055, "sine", 0.022);
      const line = lineFrom(index, stone);
      if (line.length >= 5) {
        finish(stone, line);
        return true;
      }
      if (history.length === board.length) {
        finish(0, []);
        return true;
      }
      turn = stone === black ? white : black;
      return false;
    }

    function queueAi() {
      locked = true;
      sync("공격과 수비 후보를 계산하고 있습니다.");
      clearTimeout(aiTimer);
      aiTimer = setTimeout(function () {
        if (gameOver || mode !== "ai") return;
        const move = chooseAiMove();
        locked = false;
        if (move === undefined || place(move, white)) return;
        turn = black;
        sync("AI가 백돌을 놓았습니다. 다음 수를 두세요.");
      }, difficulty === "hard" ? 360 : 240);
    }

    function play(index) {
      if (gameOver || locked || board[index]) return;
      const stone = mode === "ai" ? black : turn;
      if (place(index, stone)) return;
      sync(`${stone === black ? "흑돌" : "백돌"}을 놓았습니다.`);
      if (mode === "ai") queueAi();
    }

    function undoMove() {
      if (gameOver || locked || !history.length || undoLeft <= 0) return;
      clearTimeout(aiTimer);
      const removeCount = mode === "ai" && history.length >= 2 ? 2 : 1;
      for (let count = 0; count < removeCount; count += 1) {
        const index = history.pop();
        if (index !== undefined) board[index] = 0;
      }
      undoLeft -= 1;
      turn = history.length % 2 === 0 ? black : white;
      locked = false;
      winning = [];
      audio.tone(240, 0.08, "triangle", 0.018);
      sync("직전 수를 되돌렸습니다.");
      setResult(`무르기 ${undoLeft}회 남았습니다.`);
    }

    function resetRound(message) {
      clearTimeout(aiTimer);
      board = Array(size * size).fill(0);
      history = [];
      winning = [];
      undoLeft = 3;
      turn = black;
      gameOver = false;
      locked = false;
      sync(message || "새 판을 시작했습니다. 흑돌이 먼저입니다.");
      setResult("빈 교차점을 골라 첫 흑돌을 놓으세요.");
    }

    function moveFocus(event, index) {
      const moves = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -size, ArrowDown: size };
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        play(index);
        return;
      }
      if (!(event.key in moves)) return;
      event.preventDefault();
      const row = Math.floor(index / size);
      const column = index % size;
      let target = index + moves[event.key];
      if (event.key === "ArrowLeft" && column === 0) target = index;
      if (event.key === "ArrowRight" && column === size - 1) target = index;
      if (target < 0 || target >= board.length) target = index;
      cells[target].focus();
    }

    newRound.addEventListener("click", function () { resetRound("새 판을 시작했습니다. 흑돌이 먼저입니다."); });
    undo.addEventListener("click", undoMove);
    sound.addEventListener("click", function () { audio.toggle(sound); });
    cleanup.push(function () {
      clearTimeout(aiTimer);
      audio.close();
    });
    resetRound("AI 대전 보통 난이도입니다. 흑돌이 먼저입니다.");
  }

  function renderSolitaire(game, surface) {
    const suits = ["S", "H", "D", "C"];
    const suitSymbols = { S: "♠", H: "♥", D: "♦", C: "♣" };
    const suitNames = { S: "스페이드", H: "하트", D: "다이아몬드", C: "클로버" };
    const rankNames = { 1: "A", 11: "J", 12: "Q", 13: "K" };
    const historyLimit = 30;
    let stock = [];
    let waste = [];
    let tableau = Array.from({ length: 7 }, function () { return []; });
    let foundations = { S: [], H: [], D: [], C: [] };
    let selected = null;
    let history = [];
    let drawCount = 1;
    let moves = 0;
    let seconds = 0;
    let started = false;
    let gameOver = false;
    let message = "카드 더미를 눌러 시작하세요.";
    let hint = null;
    let lastCardClick = { key: "", time: 0 };
    const audio = createTonePlayer();

    surface.classList.add("solitaire-game");
    renderScore(surface, [
      { label: "이동", value: "0" },
      { label: "시간", value: "00:00" },
      { label: "점수", value: "0" },
      { label: "최고", value: formatTime(getBest(game.id)) }
    ]);
    const stats = surface.querySelectorAll(".mini-score b");

    const settings = document.createElement("div");
    settings.className = "solitaire-settings";
    const drawLabel = document.createElement("span");
    drawLabel.className = "solitaire-setting-label";
    drawLabel.textContent = "카드 뽑기";
    const drawChoices = document.createElement("div");
    drawChoices.className = "solitaire-segment";
    drawChoices.setAttribute("role", "group");
    drawChoices.setAttribute("aria-label", "카드 뽑기 방식");
    const drawOne = button("한 장", "solitaire-segment-button active");
    const drawThree = button("세 장", "solitaire-segment-button");
    drawOne.setAttribute("aria-pressed", "true");
    drawThree.setAttribute("aria-pressed", "false");
    drawChoices.append(drawOne, drawThree);
    const status = document.createElement("div");
    status.className = "solitaire-status";
    status.setAttribute("aria-live", "polite");
    settings.append(drawLabel, drawChoices, status);

    const board = document.createElement("div");
    board.className = "solitaire-board";
    board.setAttribute("aria-label", "클론다이크 솔리테어 카드판");
    const topRow = document.createElement("div");
    topRow.className = "solitaire-top-row";
    const stockPile = document.createElement("div");
    stockPile.className = "solitaire-pile solitaire-stock-pile";
    const wastePile = document.createElement("div");
    wastePile.className = "solitaire-pile solitaire-waste-pile";
    const topSpacer = document.createElement("div");
    topSpacer.className = "solitaire-top-spacer";
    const foundationPiles = suits.map(function (suit) {
      const pile = document.createElement("div");
      pile.className = "solitaire-pile solitaire-foundation-pile";
      pile.dataset.destinationKey = `foundation-${suit}`;
      bindDrop(pile, "foundation", suit);
      return pile;
    });
    topRow.append(stockPile, wastePile, topSpacer, ...foundationPiles);

    const tableauRow = document.createElement("div");
    tableauRow.className = "solitaire-tableau";
    const tableauPiles = Array.from({ length: 7 }, function (_, pileIndex) {
      const pile = document.createElement("div");
      pile.className = "solitaire-pile solitaire-tableau-pile";
      pile.dataset.destinationKey = `tableau-${pileIndex}`;
      pile.addEventListener("click", function (event) {
        if (event.target === pile || event.target.classList.contains("solitaire-empty-slot")) {
          attemptMove("tableau", pileIndex);
        }
      });
      bindDrop(pile, "tableau", pileIndex);
      return pile;
    });
    tableauRow.append(...tableauPiles);
    board.append(topRow, tableauRow);

    const actions = document.createElement("div");
    actions.className = "mini-controls solitaire-actions";
    const newGame = button("새 게임", "button primary");
    const undo = button("되돌리기", "button secondary");
    const hintButton = button("힌트", "button secondary");
    const sound = button("소리 켜짐", "button secondary sound-toggle");
    sound.setAttribute("aria-pressed", "true");
    actions.append(newGame, undo, hintButton, sound);
    const guide = document.createElement("p");
    guide.className = "mini-note";
    guide.textContent = "검정과 빨강을 번갈아 내림차순으로 쌓고, 빈 열에는 K만 놓을 수 있습니다. A부터 같은 무늬로 올리면 완성입니다.";
    surface.append(settings, board, actions, guide);

    function rankLabel(rank) {
      return rankNames[rank] || String(rank);
    }

    function formatTime(value) {
      if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return "-";
      const minutes = Math.floor(value / 60);
      const remaining = value % 60;
      return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
    }

    function cardName(card) {
      return `${suitNames[card.suit]} ${rankLabel(card.rank)}`;
    }

    function isRed(card) {
      return card.suit === "H" || card.suit === "D";
    }

    function makeDeck() {
      const deck = [];
      suits.forEach(function (suit) {
        for (let rank = 1; rank <= 13; rank += 1) {
          deck.push({ id: `${suit}-${rank}`, suit, rank, faceUp: false });
        }
      });
      return shuffle(deck);
    }

    function currentScore() {
      const foundationCount = suits.reduce(function (sum, suit) { return sum + foundations[suit].length; }, 0);
      const openTableau = tableau.reduce(function (sum, pile) {
        return sum + pile.filter(function (card) { return card.faceUp; }).length;
      }, 0);
      return Math.max(0, foundationCount * 12 + openTableau * 2 - Math.max(0, moves - 20));
    }

    function updateStats() {
      stats[0].textContent = String(moves);
      stats[1].textContent = formatTime(seconds);
      stats[2].textContent = String(currentScore());
      stats[3].textContent = formatTime(getBest(game.id));
    }

    function snapshot() {
      history.push(JSON.stringify({ stock, waste, tableau, foundations, moves, seconds, started }));
      if (history.length > historyLimit) history.shift();
    }

    function restoreSnapshot(raw) {
      const saved = JSON.parse(raw);
      stock = saved.stock;
      waste = saved.waste;
      tableau = saved.tableau;
      foundations = saved.foundations;
      moves = saved.moves;
      seconds = saved.seconds;
      started = saved.started;
      gameOver = false;
      selected = null;
      hint = null;
    }

    function beginMove() {
      started = true;
      moves += 1;
      hint = null;
    }

    function selectionMatches(source) {
      return selected && selected.type === source.type && selected.pile === source.pile && selected.index === source.index;
    }

    function sourceKey(source) {
      if (!source) return "";
      return source.type === "tableau" ? `tableau-${source.pile}-${source.index}` : `${source.type}-${source.pile || "top"}`;
    }

    function cardButton(card, source, offset) {
      const item = button("", `solitaire-card ${isRed(card) ? "red" : "black"}${card.faceUp ? " face-up" : " face-down"}`);
      item.dataset.cardId = card.id;
      item.dataset.sourceKey = sourceKey(source);
      item.style.setProperty("--card-offset", `${offset || 0}px`);
      item.setAttribute("aria-label", card.faceUp ? cardName(card) : "뒤집힌 카드");
      item.setAttribute("aria-pressed", String(selectionMatches(source)));
      item.disabled = !card.faceUp || gameOver;
      item.draggable = card.faceUp && !gameOver;
      if (card.faceUp) {
        item.innerHTML = `<span class="solitaire-card-corner"><strong>${rankLabel(card.rank)}</strong><span>${suitSymbols[card.suit]}</span></span><span class="solitaire-card-suit" aria-hidden="true">${suitSymbols[card.suit]}</span>`;
        item.addEventListener("click", function (event) {
          event.stopPropagation();
          onCardClick(source);
        });
        item.addEventListener("dblclick", function (event) {
          event.preventDefault();
          event.stopPropagation();
          autoFoundation(source);
        });
        item.addEventListener("dragstart", function (event) {
          selected = source;
          item.setAttribute("aria-pressed", "true");
          event.dataTransfer.effectAllowed = "move";
          event.dataTransfer.setData("text/plain", JSON.stringify(source));
        });
      } else {
        item.innerHTML = "<span class=\"solitaire-card-back\" aria-hidden=\"true\">H</span>";
      }
      return item;
    }

    function emptySlot(label, symbol) {
      const slot = button(symbol || "", "solitaire-empty-slot");
      slot.setAttribute("aria-label", label);
      slot.disabled = gameOver;
      return slot;
    }

    function renderStock() {
      stockPile.innerHTML = "";
      const stockButton = emptySlot(stock.length ? `카드 더미 ${stock.length}장, 카드 뽑기` : "버린 카드 다시 섞기", stock.length ? "" : "↻");
      stockButton.classList.add("solitaire-stock-button");
      stockButton.dataset.destinationKey = "stock";
      if (stock.length) {
        stockButton.classList.add("has-cards");
        stockButton.innerHTML = "<span class=\"solitaire-card-back\" aria-hidden=\"true\">H</span><small>남은 카드</small>";
      }
      stockButton.addEventListener("click", drawStock);
      stockPile.appendChild(stockButton);
    }

    function renderWaste() {
      wastePile.innerHTML = "";
      if (!waste.length) {
        wastePile.appendChild(emptySlot("버린 카드 자리", ""));
        return;
      }
      const visible = waste.slice(Math.max(0, waste.length - drawCount));
      visible.forEach(function (card, visibleIndex) {
        const actualIndex = waste.length - visible.length + visibleIndex;
        const source = { type: "waste", pile: "waste", index: actualIndex };
        const item = cardButton(card, source, visibleIndex * 12);
        item.style.zIndex = String(visibleIndex + 1);
        if (actualIndex !== waste.length - 1) {
          item.disabled = true;
          item.draggable = false;
        }
        wastePile.appendChild(item);
      });
    }

    function renderFoundations() {
      foundationPiles.forEach(function (pile, pileIndex) {
        const suit = suits[pileIndex];
        pile.innerHTML = "";
        const cards = foundations[suit];
        if (!cards.length) {
          const slot = emptySlot(`${suitNames[suit]} 기초 더미, A부터 놓기`, suitSymbols[suit]);
          slot.dataset.destinationKey = `foundation-${suit}`;
          slot.addEventListener("click", function () { attemptMove("foundation", suit); });
          pile.appendChild(slot);
        } else {
          const source = { type: "foundation", pile: suit, index: cards.length - 1 };
          const item = cardButton(cards[cards.length - 1], source, 0);
          item.dataset.destinationKey = `foundation-${suit}`;
          pile.appendChild(item);
        }
      });
    }

    function renderTableau() {
      tableauPiles.forEach(function (pile, pileIndex) {
        pile.innerHTML = "";
        const cards = tableau[pileIndex];
        if (!cards.length) {
          const slot = emptySlot(`${pileIndex + 1}열 빈 자리, K를 놓을 수 있습니다.`, "K");
          slot.dataset.destinationKey = `tableau-${pileIndex}`;
          pile.appendChild(slot);
          pile.style.setProperty("--pile-height", "var(--solitaire-card-height)");
          return;
        }
        let offset = 0;
        cards.forEach(function (card, cardIndex) {
          const source = { type: "tableau", pile: pileIndex, index: cardIndex };
          const item = cardButton(card, source, offset);
          item.style.zIndex = String(cardIndex + 1);
          pile.appendChild(item);
          if (cardIndex < cards.length - 1) offset += card.faceUp ? 27 : 14;
        });
        pile.style.setProperty("--pile-height", `calc(var(--solitaire-card-height) + ${offset}px)`);
      });
    }

    function applyHint() {
      if (!hint) return;
      const sourceElement = board.querySelector(`[data-source-key="${hint.source}"]`);
      const destinationElement = board.querySelector(`[data-destination-key="${hint.destination}"]`);
      if (sourceElement) sourceElement.classList.add("is-hint-source");
      if (destinationElement) destinationElement.classList.add("is-hint-destination");
    }

    function render() {
      renderStock();
      renderWaste();
      renderFoundations();
      renderTableau();
      status.innerHTML = `<strong>${gameOver ? "게임 완성" : selected ? "카드 선택됨" : "진행 중"}</strong><span>${message}</span>`;
      undo.disabled = !history.length || gameOver;
      hintButton.disabled = gameOver;
      updateStats();
      applyHint();
    }

    function canBuildSequence(cards) {
      return cards.every(function (card, index) {
        if (!card.faceUp) return false;
        if (!index) return true;
        const previous = cards[index - 1];
        return previous.rank === card.rank + 1 && isRed(previous) !== isRed(card);
      });
    }

    function sourceCards(source) {
      if (!source) return [];
      if (source.type === "waste") {
        return source.index === waste.length - 1 ? [waste[waste.length - 1]] : [];
      }
      if (source.type === "foundation") {
        const pile = foundations[source.pile];
        return source.index === pile.length - 1 ? [pile[pile.length - 1]] : [];
      }
      if (source.type === "tableau") {
        const cards = tableau[source.pile].slice(source.index);
        return canBuildSequence(cards) ? cards : [];
      }
      return [];
    }

    function canPlaceTableau(card, pileIndex) {
      const target = tableau[pileIndex];
      if (!target.length) return card.rank === 13;
      const top = target[target.length - 1];
      return top.faceUp && top.rank === card.rank + 1 && isRed(top) !== isRed(card);
    }

    function canPlaceFoundation(card, suit) {
      if (card.suit !== suit) return false;
      const target = foundations[suit];
      return card.rank === target.length + 1;
    }

    function detach(source) {
      if (source.type === "waste") return [waste.pop()];
      if (source.type === "foundation") return [foundations[source.pile].pop()];
      return tableau[source.pile].splice(source.index);
    }

    function flipExposed(source) {
      if (source.type !== "tableau") return;
      const pile = tableau[source.pile];
      const top = pile[pile.length - 1];
      if (top && !top.faceUp) {
        top.faceUp = true;
        audio.tone(520, 0.06, "triangle", 0.018);
      }
    }

    function moveToTableau(source, pileIndex) {
      const cards = sourceCards(source);
      if (!cards.length || !canPlaceTableau(cards[0], pileIndex)) return false;
      if (source.type === "tableau" && source.pile === pileIndex) return false;
      snapshot();
      beginMove();
      const moving = detach(source);
      tableau[pileIndex].push(...moving);
      flipExposed(source);
      selected = null;
      message = `${cardName(moving[0])} 카드${moving.length > 1 ? ` 포함 ${moving.length}장` : ""}를 ${pileIndex + 1}열로 옮겼습니다.`;
      audio.tone(360, 0.055, "sine", 0.018);
      checkWin();
      render();
      return true;
    }

    function moveToFoundation(source, suit) {
      const cards = sourceCards(source);
      if (cards.length !== 1 || !canPlaceFoundation(cards[0], suit)) return false;
      snapshot();
      beginMove();
      const moving = detach(source)[0];
      foundations[suit].push(moving);
      flipExposed(source);
      selected = null;
      message = `${cardName(moving)} 카드를 기초 더미에 올렸습니다.`;
      audio.tone(560 + moving.rank * 12, 0.07, "sine", 0.022);
      checkWin();
      render();
      return true;
    }

    function attemptMove(destinationType, destinationPile) {
      if (!selected || gameOver) return false;
      const moved = destinationType === "foundation"
        ? moveToFoundation(selected, destinationPile)
        : moveToTableau(selected, Number(destinationPile));
      if (!moved) {
        message = destinationType === "foundation"
          ? "기초 더미에는 같은 무늬를 A부터 순서대로 놓습니다."
          : "테이블에는 색을 번갈아 한 단계 낮은 카드만 놓을 수 있습니다.";
        audio.tone(170, 0.06, "square", 0.014);
        render();
      }
      return moved;
    }

    function onCardClick(source) {
      if (gameOver) return;
      const now = Date.now();
      const key = sourceKey(source);
      if (lastCardClick.key === key && now - lastCardClick.time < 420) {
        lastCardClick = { key: "", time: 0 };
        autoFoundation(source);
        return;
      }
      lastCardClick = { key, time: now };
      if (selectionMatches(source)) {
        selected = null;
        message = "선택을 해제했습니다.";
        render();
        return;
      }
      if (selected && source.type === "tableau" && attemptMove("tableau", source.pile)) return;
      if (selected && source.type === "foundation" && attemptMove("foundation", source.pile)) return;
      const cards = sourceCards(source);
      if (!cards.length) return;
      selected = source;
      hint = null;
      message = `${cardName(cards[0])} 카드${cards.length > 1 ? `부터 ${cards.length}장` : ""}를 선택했습니다. 목적지를 누르세요.`;
      render();
    }

    function autoFoundation(source) {
      const cards = sourceCards(source);
      if (cards.length !== 1) return;
      if (!moveToFoundation(source, cards[0].suit)) {
        message = "이 카드는 아직 기초 더미에 올릴 수 없습니다.";
        render();
      }
    }

    function drawStock() {
      if (gameOver) return;
      if (!stock.length && !waste.length) return;
      snapshot();
      beginMove();
      selected = null;
      if (!stock.length) {
        stock = waste.reverse().map(function (card) {
          card.faceUp = false;
          return card;
        });
        waste = [];
        message = "버린 카드를 뒤집어 다시 사용할 수 있게 했습니다.";
        audio.tone(240, 0.09, "triangle", 0.018);
      } else {
        const count = Math.min(drawCount, stock.length);
        for (let index = 0; index < count; index += 1) {
          const card = stock.pop();
          card.faceUp = true;
          waste.push(card);
        }
        message = `${count}장의 카드를 펼쳤습니다.`;
        audio.tone(430, 0.045, "triangle", 0.016);
      }
      render();
    }

    function bindDrop(element, destinationType, destinationPile) {
      element.addEventListener("dragover", function (event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        element.classList.add("is-drag-over");
      });
      element.addEventListener("dragleave", function () { element.classList.remove("is-drag-over"); });
      element.addEventListener("drop", function (event) {
        event.preventDefault();
        element.classList.remove("is-drag-over");
        try { selected = JSON.parse(event.dataTransfer.getData("text/plain")); } catch (error) { /* Keep current selection. */ }
        attemptMove(destinationType, destinationPile);
      });
    }

    function findHint() {
      if (waste.length) {
        const source = { type: "waste", pile: "waste", index: waste.length - 1 };
        const card = waste[waste.length - 1];
        if (canPlaceFoundation(card, card.suit)) return { source, destination: `foundation-${card.suit}`, text: `${cardName(card)} 카드를 기초 더미에 올려 보세요.` };
        for (let pile = 0; pile < 7; pile += 1) {
          if (canPlaceTableau(card, pile)) return { source, destination: `tableau-${pile}`, text: `${cardName(card)} 카드를 ${pile + 1}열로 옮길 수 있습니다.` };
        }
      }
      for (let pile = 0; pile < 7; pile += 1) {
        const cards = tableau[pile];
        if (!cards.length) continue;
        const top = cards[cards.length - 1];
        const topSource = { type: "tableau", pile, index: cards.length - 1 };
        if (top.faceUp && canPlaceFoundation(top, top.suit)) return { source: topSource, destination: `foundation-${top.suit}`, text: `${cardName(top)} 카드를 기초 더미에 올릴 수 있습니다.` };
        for (let cardIndex = 0; cardIndex < cards.length; cardIndex += 1) {
          if (!cards[cardIndex].faceUp || !canBuildSequence(cards.slice(cardIndex))) continue;
          for (let destination = 0; destination < 7; destination += 1) {
            if (destination !== pile && canPlaceTableau(cards[cardIndex], destination)) {
              return { source: { type: "tableau", pile, index: cardIndex }, destination: `tableau-${destination}`, text: `${cardName(cards[cardIndex])}부터 ${destination + 1}열로 옮겨 보세요.` };
            }
          }
        }
      }
      if (stock.length || waste.length) return { source: null, destination: "stock", text: stock.length ? "카드 더미에서 새 카드를 펼쳐 보세요." : "버린 카드를 다시 뒤집어 보세요." };
      return null;
    }

    function showHint() {
      const found = findHint();
      selected = null;
      if (!found) {
        hint = null;
        message = "현재 바로 이동할 수 있는 카드를 찾지 못했습니다. 되돌리기나 새 게임을 이용하세요.";
      } else {
        hint = { source: sourceKey(found.source), destination: found.destination };
        message = found.text;
        audio.tone(620, 0.08, "sine", 0.018);
      }
      render();
    }

    function checkWin() {
      const completed = suits.reduce(function (sum, suit) { return sum + foundations[suit].length; }, 0);
      if (completed !== 52) return;
      gameOver = true;
      started = false;
      const isBest = saveBest(game.id, seconds, function (value, previous) { return value < previous; });
      message = `52장을 모두 정리했습니다. ${formatTime(seconds)} 만에 완성${isBest ? "해 최고 기록을 세웠습니다" : "했습니다"}.`;
      setResult(`카드 솔리테어 완성. 이동 ${moves}회, 기록 ${formatTime(seconds)}, 점수 ${currentScore()}점입니다.`);
      audio.tone(660, 0.12, "sine", 0.035);
      audio.tone(880, 0.18, "sine", 0.03, 0.12);
      board.classList.add("is-complete");
    }

    function deal(messageText) {
      const deck = makeDeck();
      tableau = Array.from({ length: 7 }, function (_, pileIndex) {
        const pile = [];
        for (let cardIndex = 0; cardIndex <= pileIndex; cardIndex += 1) {
          const card = deck.pop();
          card.faceUp = cardIndex === pileIndex;
          pile.push(card);
        }
        return pile;
      });
      stock = deck.map(function (card) { card.faceUp = false; return card; });
      waste = [];
      foundations = { S: [], H: [], D: [], C: [] };
      selected = null;
      history = [];
      moves = 0;
      seconds = 0;
      started = false;
      gameOver = false;
      hint = null;
      lastCardClick = { key: "", time: 0 };
      board.classList.remove("is-complete");
      message = messageText || "카드 더미를 눌러 첫 카드를 펼치세요.";
      setResult("카드를 번갈아 내림차순으로 정리하고 A부터 기초 더미에 올리세요.");
      render();
    }

    function changeDrawMode(next) {
      drawCount = next;
      drawOne.classList.toggle("active", next === 1);
      drawThree.classList.toggle("active", next === 3);
      drawOne.setAttribute("aria-pressed", String(next === 1));
      drawThree.setAttribute("aria-pressed", String(next === 3));
      deal(`${next === 1 ? "한 장" : "세 장"} 뽑기 방식으로 새 게임을 시작했습니다.`);
    }

    function undoMove() {
      if (!history.length || gameOver) return;
      restoreSnapshot(history.pop());
      message = "직전 이동을 되돌렸습니다.";
      audio.tone(230, 0.08, "triangle", 0.016);
      setResult(`되돌리기 완료. 현재 이동 수는 ${moves}회입니다.`);
      render();
    }

    const timer = window.setInterval(function () {
      if (!started || gameOver) return;
      seconds += 1;
      updateStats();
    }, 1000);
    drawOne.addEventListener("click", function () { if (drawCount !== 1) changeDrawMode(1); });
    drawThree.addEventListener("click", function () { if (drawCount !== 3) changeDrawMode(3); });
    newGame.addEventListener("click", function () { deal("카드를 다시 섞어 새 게임을 시작했습니다."); });
    undo.addEventListener("click", undoMove);
    hintButton.addEventListener("click", showHint);
    sound.addEventListener("click", function () { audio.toggle(sound); });
    cleanup.push(function () {
      window.clearInterval(timer);
      audio.close();
      surface.classList.remove("solitaire-game");
    });
    deal("한 장 뽑기 방식입니다. 카드 더미를 눌러 시작하세요.");
  }

  function renderFreeCell(game, surface) {
    const suits = ["S", "H", "D", "C"];
    const suitSymbols = { S: "♠", H: "♥", D: "♦", C: "♣" };
    const suitNames = { S: "스페이드", H: "하트", D: "다이아몬드", C: "클로버" };
    const rankNames = { 1: "A", 11: "J", 12: "Q", 13: "K" };
    const historyLimit = 50;
    const saveKey = `hanpan-freecell-save-${game.id}`;
    const streakKey = "hanpan-freecell-streak";
    let columns = Array.from({ length: 8 }, function () { return []; });
    let freeCells = Array(4).fill(null);
    let foundations = { S: [], H: [], D: [], C: [] };
    let selected = null;
    let history = [];
    let hint = null;
    let moves = 0;
    let seconds = 0;
    let started = false;
    let gameOver = false;
    let dealNumber = 0;
    let message = "카드를 선택해 프리셀을 시작하세요.";
    let lastCardClick = { key: "", time: 0 };
    const audio = createTonePlayer();

    surface.classList.add("freecell-game");
    renderScore(surface, [
      { label: "이동", value: "0" },
      { label: "시간", value: "00:00" },
      { label: "정리", value: "0/52" },
      { label: "연승", value: "0" },
      { label: "최고", value: formatTime(getBest(game.id)) }
    ]);
    const stats = surface.querySelectorAll(".mini-score b");

    const settings = document.createElement("div");
    settings.className = "freecell-settings";
    const capacity = document.createElement("div");
    capacity.className = "freecell-capacity";
    const status = document.createElement("div");
    status.className = "solitaire-status freecell-status";
    status.setAttribute("aria-live", "polite");
    settings.append(capacity, status);

    const board = document.createElement("div");
    board.className = "freecell-board";
    board.setAttribute("aria-label", "프리셀 카드판. 위쪽에 임시칸 네 개와 기초칸 네 개, 아래쪽에 카드 열 여덟 개가 있습니다.");

    const boardLabels = document.createElement("div");
    boardLabels.className = "freecell-board-labels";
    boardLabels.innerHTML = "<span>임시칸</span><span>기초칸</span>";
    const topRow = document.createElement("div");
    topRow.className = "freecell-top-row";
    const cellPiles = Array.from({ length: 4 }, function (_, index) {
      const pile = document.createElement("div");
      pile.className = "solitaire-pile freecell-pile freecell-cell-pile";
      pile.dataset.destinationKey = `cell-${index}`;
      bindDrop(pile, "cell", index);
      pile.addEventListener("click", function (event) {
        if (event.target === pile || event.target.classList.contains("solitaire-empty-slot")) attemptMove("cell", index);
      });
      return pile;
    });
    const foundationPiles = suits.map(function (suit) {
      const pile = document.createElement("div");
      pile.className = "solitaire-pile freecell-pile freecell-foundation-pile";
      pile.dataset.destinationKey = `foundation-${suit}`;
      bindDrop(pile, "foundation", suit);
      pile.addEventListener("click", function (event) {
        if (event.target === pile || event.target.classList.contains("solitaire-empty-slot")) attemptMove("foundation", suit);
      });
      return pile;
    });
    topRow.append(...cellPiles, ...foundationPiles);

    const columnRow = document.createElement("div");
    columnRow.className = "freecell-columns";
    const columnPiles = Array.from({ length: 8 }, function (_, index) {
      const pile = document.createElement("div");
      pile.className = "solitaire-pile freecell-pile freecell-column-pile";
      pile.dataset.destinationKey = `column-${index}`;
      bindDrop(pile, "column", index);
      pile.addEventListener("click", function (event) {
        if (event.target === pile || event.target.classList.contains("solitaire-empty-slot")) attemptMove("column", index);
      });
      return pile;
    });
    columnRow.append(...columnPiles);
    board.append(boardLabels, topRow, columnRow);

    const actions = document.createElement("div");
    actions.className = "mini-controls solitaire-actions freecell-actions";
    const newGame = button("새 게임", "button primary");
    const undo = button("되돌리기", "button secondary");
    const hintButton = button("힌트", "button secondary");
    const autoFinish = button("자동 정리", "button secondary");
    const sound = button("소리 켜짐", "button secondary sound-toggle");
    sound.setAttribute("aria-pressed", "true");
    actions.append(newGame, undo, hintButton, autoFinish, sound);

    const guide = document.createElement("p");
    guide.className = "mini-note";
    guide.textContent = "빨강과 검정을 번갈아 내림차순으로 쌓습니다. 빈 임시칸과 빈 열을 확보하면 긴 카드 묶음을 옮길 수 있습니다.";
    surface.append(settings, board, actions, guide);

    function rankLabel(rank) {
      return rankNames[rank] || String(rank);
    }

    function formatTime(value) {
      if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return "-";
      const minutes = Math.floor(value / 60);
      const remaining = value % 60;
      return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
    }

    function cardName(card) {
      return `${suitNames[card.suit]} ${rankLabel(card.rank)}`;
    }

    function isRed(card) {
      return card.suit === "H" || card.suit === "D";
    }

    function foundationCount() {
      return suits.reduce(function (sum, suit) { return sum + foundations[suit].length; }, 0);
    }

    function getStreak() {
      try {
        const value = Number(localStorage.getItem(streakKey));
        return Number.isFinite(value) && value > 0 ? value : 0;
      } catch (error) {
        return 0;
      }
    }

    function setStreak(value) {
      try { localStorage.setItem(streakKey, String(Math.max(0, value))); } catch (error) { /* Local records are optional. */ }
    }

    function makeDeck(seed) {
      const deck = [];
      suits.forEach(function (suit) {
        for (let rank = 1; rank <= 13; rank += 1) deck.push({ id: `${suit}-${rank}`, suit, rank });
      });
      let state = seed >>> 0;
      function random() {
        state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
        return state / 4294967296;
      }
      for (let index = deck.length - 1; index > 0; index -= 1) {
        const target = Math.floor(random() * (index + 1));
        [deck[index], deck[target]] = [deck[target], deck[index]];
      }
      return deck;
    }

    function updateStats() {
      stats[0].textContent = String(moves);
      stats[1].textContent = formatTime(seconds);
      stats[2].textContent = `${foundationCount()}/52`;
      stats[3].textContent = String(getStreak());
      stats[4].textContent = formatTime(getBest(game.id));
    }

    function emptyCellCount() {
      return freeCells.filter(function (card) { return !card; }).length;
    }

    function emptyColumnCount(excludedDestination) {
      return columns.filter(function (pile, index) {
        return !pile.length && index !== excludedDestination;
      }).length;
    }

    function moveCapacity(destinationIndex) {
      const targetIsEmpty = Number.isInteger(destinationIndex)
        && destinationIndex >= 0
        && destinationIndex < columns.length
        && !columns[destinationIndex].length;
      const emptyColumns = emptyColumnCount(targetIsEmpty ? destinationIndex : -1);
      return (emptyCellCount() + 1) * Math.pow(2, emptyColumns);
    }

    function saveState() {
      if (gameOver) return;
      try {
        localStorage.setItem(saveKey, JSON.stringify({ version: 1, columns, freeCells, foundations, moves, seconds, started, dealNumber }));
      } catch (error) {
        // The game remains playable when storage is unavailable.
      }
    }

    function clearSavedState() {
      try { localStorage.removeItem(saveKey); } catch (error) { /* Storage is optional. */ }
    }

    function snapshot() {
      history.push(JSON.stringify({ columns, freeCells, foundations, moves, seconds, started, dealNumber }));
      if (history.length > historyLimit) history.shift();
    }

    function restoreSnapshot(raw) {
      const saved = JSON.parse(raw);
      columns = saved.columns;
      freeCells = saved.freeCells;
      foundations = saved.foundations;
      moves = saved.moves;
      seconds = saved.seconds;
      started = saved.started;
      dealNumber = saved.dealNumber;
      selected = null;
      hint = null;
      gameOver = false;
    }

    function validSavedState(saved) {
      if (!saved || saved.version !== 1 || !Array.isArray(saved.columns) || saved.columns.length !== 8) return false;
      if (!Array.isArray(saved.freeCells) || saved.freeCells.length !== 4 || !saved.foundations) return false;
      const cards = saved.columns.flat()
        .concat(saved.freeCells.filter(Boolean))
        .concat(...suits.map(function (suit) { return saved.foundations[suit] || []; }));
      return cards.length === 52 && new Set(cards.map(function (card) { return card && card.id; })).size === 52;
    }

    function restoreSavedGame() {
      try {
        const saved = JSON.parse(localStorage.getItem(saveKey));
        if (!validSavedState(saved) || suits.reduce(function (sum, suit) { return sum + saved.foundations[suit].length; }, 0) === 52) return false;
        columns = saved.columns;
        freeCells = saved.freeCells;
        foundations = saved.foundations;
        moves = Number(saved.moves) || 0;
        seconds = Number(saved.seconds) || 0;
        started = Boolean(saved.started);
        dealNumber = Number(saved.dealNumber) || 1;
        message = `저장된 게임 #${dealNumber}을 이어서 플레이합니다.`;
        setResult(`프리셀 게임 #${dealNumber} 이어하기. 현재 ${foundationCount()}장을 정리했습니다.`);
        return true;
      } catch (error) {
        return false;
      }
    }

    function sourceKey(source) {
      if (!source) return "";
      return source.type === "column" ? `column-${source.pile}-${source.index}` : `${source.type}-${source.pile}`;
    }

    function selectionMatches(source) {
      return selected && selected.type === source.type && selected.pile === source.pile && selected.index === source.index;
    }

    function canBuildSequence(cards) {
      return cards.every(function (card, index) {
        if (!index) return true;
        const previous = cards[index - 1];
        return previous.rank === card.rank + 1 && isRed(previous) !== isRed(card);
      });
    }

    function sourceCards(source) {
      if (!source) return [];
      if (source.type === "cell") {
        return freeCells[source.pile] && source.index === 0 ? [freeCells[source.pile]] : [];
      }
      if (source.type === "foundation") {
        const pile = foundations[source.pile];
        return pile && source.index === pile.length - 1 ? [pile[pile.length - 1]] : [];
      }
      if (source.type === "column") {
        const cards = columns[source.pile].slice(source.index);
        return canBuildSequence(cards) ? cards : [];
      }
      return [];
    }

    function canPlaceColumn(card, destination) {
      const target = columns[destination];
      if (!target.length) return true;
      const top = target[target.length - 1];
      return top.rank === card.rank + 1 && isRed(top) !== isRed(card);
    }

    function canPlaceFoundation(card, suit) {
      return card.suit === suit && card.rank === foundations[suit].length + 1;
    }

    function detach(source) {
      if (source.type === "cell") {
        const card = freeCells[source.pile];
        freeCells[source.pile] = null;
        return [card];
      }
      if (source.type === "foundation") return [foundations[source.pile].pop()];
      return columns[source.pile].splice(source.index);
    }

    function cardButton(card, source, offset) {
      const item = button("", `solitaire-card freecell-card ${isRed(card) ? "red" : "black"}`);
      item.dataset.cardId = card.id;
      item.dataset.sourceKey = sourceKey(source);
      item.style.setProperty("--card-offset", `${offset || 0}px`);
      item.setAttribute("aria-label", cardName(card));
      item.setAttribute("aria-pressed", String(selectionMatches(source)));
      item.disabled = gameOver;
      item.draggable = !gameOver;
      item.innerHTML = `<span class="solitaire-card-corner"><strong>${rankLabel(card.rank)}</strong><span>${suitSymbols[card.suit]}</span></span><span class="solitaire-card-suit" aria-hidden="true">${suitSymbols[card.suit]}</span>`;
      item.addEventListener("click", function (event) {
        event.stopPropagation();
        onCardClick(source);
      });
      item.addEventListener("dblclick", function (event) {
        event.preventDefault();
        event.stopPropagation();
        autoFoundation(source);
      });
      item.addEventListener("dragstart", function (event) {
        selected = source;
        item.setAttribute("aria-pressed", "true");
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", JSON.stringify(source));
      });
      return item;
    }

    function emptySlot(label, symbol) {
      const slot = button(symbol || "", "solitaire-empty-slot freecell-empty-slot");
      slot.setAttribute("aria-label", label);
      slot.disabled = gameOver;
      return slot;
    }

    function renderCells() {
      cellPiles.forEach(function (pile, index) {
        pile.innerHTML = "";
        const card = freeCells[index];
        if (card) {
          const source = { type: "cell", pile: index, index: 0 };
          const item = cardButton(card, source, 0);
          item.dataset.destinationKey = `cell-${index}`;
          pile.appendChild(item);
        } else {
          const slot = emptySlot(`${index + 1}번 빈 임시칸`, "+");
          slot.dataset.destinationKey = `cell-${index}`;
          pile.appendChild(slot);
        }
      });
    }

    function renderFoundations() {
      foundationPiles.forEach(function (pile, index) {
        const suit = suits[index];
        const cards = foundations[suit];
        pile.innerHTML = "";
        if (cards.length) {
          const source = { type: "foundation", pile: suit, index: cards.length - 1 };
          const item = cardButton(cards[cards.length - 1], source, 0);
          item.dataset.destinationKey = `foundation-${suit}`;
          pile.appendChild(item);
        } else {
          const slot = emptySlot(`${suitNames[suit]} 기초칸, A부터 놓기`, suitSymbols[suit]);
          slot.dataset.destinationKey = `foundation-${suit}`;
          pile.appendChild(slot);
        }
      });
    }

    function renderColumns() {
      columnPiles.forEach(function (pile, pileIndex) {
        pile.innerHTML = "";
        const cards = columns[pileIndex];
        if (!cards.length) {
          const slot = emptySlot(`${pileIndex + 1}번 빈 열`, "빈 열");
          slot.dataset.destinationKey = `column-${pileIndex}`;
          pile.appendChild(slot);
          pile.style.setProperty("--pile-height", "var(--freecell-card-height)");
          return;
        }
        const availableHeight = Math.max(240, Math.min(430, window.innerHeight * 0.46));
        const offset = Math.max(22, Math.min(38, (availableHeight - 116) / Math.max(1, cards.length - 1)));
        cards.forEach(function (card, cardIndex) {
          const source = { type: "column", pile: pileIndex, index: cardIndex };
          const item = cardButton(card, source, cardIndex * offset);
          item.style.zIndex = String(cardIndex + 1);
          pile.appendChild(item);
        });
        pile.style.setProperty("--pile-height", `calc(var(--freecell-card-height) + ${(cards.length - 1) * offset}px)`);
      });
    }

    function applyHint() {
      if (!hint) return;
      const sourceElement = board.querySelector(`[data-source-key="${hint.source}"]`);
      const destinationElement = board.querySelector(`[data-destination-key="${hint.destination}"]`);
      if (sourceElement) sourceElement.classList.add("is-hint-source");
      if (destinationElement) destinationElement.classList.add("is-hint-destination");
    }

    function render() {
      renderCells();
      renderFoundations();
      renderColumns();
      const maxMove = moveCapacity(-1);
      capacity.innerHTML = `<strong>최대 묶음 ${maxMove}장</strong><span>빈 임시칸 ${emptyCellCount()} · 빈 열 ${emptyColumnCount(-1)} · 게임 #${dealNumber}</span>`;
      status.innerHTML = `<strong>${gameOver ? "게임 완성" : selected ? "카드 선택됨" : started ? "진행 중" : "플레이 준비"}</strong><span>${message}</span>`;
      undo.disabled = !history.length || gameOver;
      hintButton.disabled = gameOver;
      autoFinish.disabled = gameOver || foundationCount() === 52;
      updateStats();
      applyHint();
      saveState();
    }

    function beginMove() {
      started = true;
      moves += 1;
      hint = null;
    }

    function moveToColumn(source, destination) {
      const cards = sourceCards(source);
      if (!cards.length || !canPlaceColumn(cards[0], destination)) return false;
      if (source.type === "column" && source.pile === destination) return false;
      const capacityForMove = moveCapacity(destination);
      if (cards.length > capacityForMove) {
        message = `현재 빈 공간으로는 최대 ${capacityForMove}장까지 한 번에 옮길 수 있습니다.`;
        audio.tone(170, 0.07, "square", 0.014);
        render();
        return true;
      }
      snapshot();
      beginMove();
      const moving = detach(source);
      columns[destination].push(...moving);
      selected = null;
      message = `${cardName(moving[0])}${moving.length > 1 ? `부터 ${moving.length}장` : ""}을 ${destination + 1}열로 옮겼습니다.`;
      audio.tone(350, 0.055, "sine", 0.018);
      checkWin();
      render();
      return true;
    }

    function moveToCell(source, destination) {
      const cards = sourceCards(source);
      if (cards.length !== 1 || freeCells[destination]) return false;
      if (source.type === "cell" && source.pile === destination) return false;
      snapshot();
      beginMove();
      const moving = detach(source)[0];
      freeCells[destination] = moving;
      selected = null;
      message = `${cardName(moving)} 카드를 ${destination + 1}번 임시칸에 보관했습니다.`;
      audio.tone(410, 0.055, "triangle", 0.018);
      render();
      return true;
    }

    function moveToFoundation(source, suit) {
      const cards = sourceCards(source);
      if (cards.length !== 1 || !canPlaceFoundation(cards[0], suit)) return false;
      snapshot();
      beginMove();
      const moving = detach(source)[0];
      foundations[suit].push(moving);
      selected = null;
      message = `${cardName(moving)} 카드를 기초칸에 올렸습니다.`;
      audio.tone(560 + moving.rank * 12, 0.07, "sine", 0.022);
      checkWin();
      render();
      return true;
    }

    function attemptMove(destinationType, destination) {
      if (!selected || gameOver) return false;
      let moved = false;
      if (destinationType === "column") moved = moveToColumn(selected, Number(destination));
      if (destinationType === "cell") moved = moveToCell(selected, Number(destination));
      if (destinationType === "foundation") moved = moveToFoundation(selected, destination);
      if (!moved) {
        if (destinationType === "column") message = "열에는 반대 색의 한 단계 낮은 카드만 놓을 수 있습니다.";
        if (destinationType === "cell") message = "임시칸에는 카드 한 장만 보관할 수 있습니다.";
        if (destinationType === "foundation") message = "기초칸에는 같은 무늬를 A부터 순서대로 놓습니다.";
        audio.tone(170, 0.06, "square", 0.014);
        render();
      }
      return moved;
    }

    function onCardClick(source) {
      if (gameOver) return;
      const now = Date.now();
      const key = sourceKey(source);
      if (lastCardClick.key === key && now - lastCardClick.time < 420) {
        lastCardClick = { key: "", time: 0 };
        autoFoundation(source);
        return;
      }
      lastCardClick = { key, time: now };
      if (selectionMatches(source)) {
        selected = null;
        message = "선택을 해제했습니다.";
        render();
        return;
      }
      if (selected && source.type === "column" && attemptMove("column", source.pile)) return;
      if (selected && source.type === "cell" && attemptMove("cell", source.pile)) return;
      if (selected && source.type === "foundation" && attemptMove("foundation", source.pile)) return;
      const cards = sourceCards(source);
      if (!cards.length) return;
      selected = source;
      hint = null;
      message = `${cardName(cards[0])}${cards.length > 1 ? `부터 ${cards.length}장` : ""}을 선택했습니다. 목적지를 누르세요.`;
      render();
    }

    function autoFoundation(source) {
      const cards = sourceCards(source);
      if (cards.length !== 1) return;
      if (!moveToFoundation(source, cards[0].suit)) {
        message = "이 카드는 아직 기초칸에 올릴 수 없습니다.";
        render();
      }
    }

    function bindDrop(element, destinationType, destination) {
      element.addEventListener("dragover", function (event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        element.classList.add("is-drag-over");
      });
      element.addEventListener("dragleave", function () { element.classList.remove("is-drag-over"); });
      element.addEventListener("drop", function (event) {
        event.preventDefault();
        element.classList.remove("is-drag-over");
        try { selected = JSON.parse(event.dataTransfer.getData("text/plain")); } catch (error) { /* Keep current selection. */ }
        attemptMove(destinationType, destination);
      });
    }

    function canAutoSafely(card) {
      if (!canPlaceFoundation(card, card.suit)) return false;
      if (card.rank <= 2) return true;
      const oppositeSuits = isRed(card) ? ["S", "C"] : ["H", "D"];
      return oppositeSuits.every(function (suit) { return foundations[suit].length >= card.rank - 1; });
    }

    function findHint() {
      for (let index = 0; index < 4; index += 1) {
        const card = freeCells[index];
        if (card && canPlaceFoundation(card, card.suit)) {
          const source = { type: "cell", pile: index, index: 0 };
          return { source, destination: `foundation-${card.suit}`, text: `${cardName(card)} 카드를 기초칸에 올릴 수 있습니다.` };
        }
      }
      for (let pile = 0; pile < 8; pile += 1) {
        const cards = columns[pile];
        if (!cards.length) continue;
        const topIndex = cards.length - 1;
        const top = cards[topIndex];
        if (canPlaceFoundation(top, top.suit)) {
          const source = { type: "column", pile, index: topIndex };
          return { source, destination: `foundation-${top.suit}`, text: `${cardName(top)} 카드를 기초칸에 올릴 수 있습니다.` };
        }
      }
      for (let pile = 0; pile < 8; pile += 1) {
        const cards = columns[pile];
        for (let cardIndex = 0; cardIndex < cards.length; cardIndex += 1) {
          const moving = cards.slice(cardIndex);
          if (!canBuildSequence(moving)) continue;
          for (let destination = 0; destination < 8; destination += 1) {
            if (destination === pile || !canPlaceColumn(moving[0], destination) || moving.length > moveCapacity(destination)) continue;
            if (!columns[destination].length && cardIndex === 0) continue;
            return {
              source: { type: "column", pile, index: cardIndex },
              destination: `column-${destination}`,
              text: `${cardName(moving[0])}${moving.length > 1 ? `부터 ${moving.length}장` : ""}을 ${destination + 1}열로 옮겨 보세요.`
            };
          }
        }
      }
      const emptyCell = freeCells.findIndex(function (card) { return !card; });
      if (emptyCell >= 0) {
        for (let pile = 0; pile < 8; pile += 1) {
          if (!columns[pile].length) continue;
          const index = columns[pile].length - 1;
          const card = columns[pile][index];
          return { source: { type: "column", pile, index }, destination: `cell-${emptyCell}`, text: `${cardName(card)} 카드를 임시칸으로 옮겨 아래 카드를 열어 보세요.` };
        }
      }
      return null;
    }

    function showHint() {
      const found = findHint();
      selected = null;
      if (!found) {
        hint = null;
        message = "현재 확인되는 이동이 없습니다. 되돌리기나 새 게임으로 흐름을 바꿔 보세요.";
      } else {
        hint = { source: sourceKey(found.source), destination: found.destination };
        message = found.text;
        audio.tone(620, 0.08, "sine", 0.018);
      }
      render();
    }

    function autoMoveSafeCards() {
      if (gameOver) return;
      snapshot();
      let moved = 0;
      let progress = true;
      while (progress) {
        progress = false;
        for (let index = 0; index < freeCells.length; index += 1) {
          const card = freeCells[index];
          if (!card || !canAutoSafely(card)) continue;
          freeCells[index] = null;
          foundations[card.suit].push(card);
          moves += 1;
          moved += 1;
          progress = true;
        }
        for (let pile = 0; pile < columns.length; pile += 1) {
          const card = columns[pile][columns[pile].length - 1];
          if (!card || !canAutoSafely(card)) continue;
          columns[pile].pop();
          foundations[card.suit].push(card);
          moves += 1;
          moved += 1;
          progress = true;
        }
      }
      if (!moved) {
        history.pop();
        message = "지금 안전하게 자동 정리할 수 있는 카드가 없습니다.";
        audio.tone(170, 0.06, "square", 0.014);
      } else {
        started = true;
        selected = null;
        hint = null;
        message = `안전한 카드 ${moved}장을 기초칸으로 정리했습니다.`;
        audio.tone(660, 0.1, "sine", 0.024);
        checkWin();
      }
      render();
    }

    function checkWin() {
      if (foundationCount() !== 52) return;
      gameOver = true;
      started = false;
      const nextStreak = getStreak() + 1;
      setStreak(nextStreak);
      const isBest = saveBest(game.id, seconds, function (value, previous) { return value < previous; });
      message = `52장을 모두 정리했습니다. ${formatTime(seconds)} 완성${isBest ? "으로 최고 기록을 세웠습니다" : "입니다"}.`;
      setResult(`프리셀 완성. 이동 ${moves}회, 기록 ${formatTime(seconds)}, 연승 ${nextStreak}회입니다.`);
      board.classList.add("is-complete");
      clearSavedState();
      audio.tone(660, 0.12, "sine", 0.035);
      audio.tone(880, 0.18, "sine", 0.03, 0.12);
    }

    function deal(messageText, abandonCurrent) {
      if (abandonCurrent && started && !gameOver && foundationCount() < 52) setStreak(0);
      dealNumber = Math.floor(Math.random() * 999999) + 1;
      const deck = makeDeck(dealNumber);
      columns = Array.from({ length: 8 }, function () { return []; });
      deck.forEach(function (card, index) { columns[index % 8].push(card); });
      freeCells = Array(4).fill(null);
      foundations = { S: [], H: [], D: [], C: [] };
      selected = null;
      history = [];
      hint = null;
      moves = 0;
      seconds = 0;
      started = false;
      gameOver = false;
      message = `${messageText} 게임 #${dealNumber}입니다.`;
      board.classList.remove("is-complete");
      clearSavedState();
      setResult(`프리셀 게임 #${dealNumber}. 카드를 선택해 시작하세요.`);
      render();
    }

    function undoMove() {
      if (!history.length || gameOver) return;
      restoreSnapshot(history.pop());
      message = "직전 이동을 되돌렸습니다.";
      audio.tone(230, 0.08, "triangle", 0.016);
      setResult(`되돌리기 완료. 현재 이동 수는 ${moves}회입니다.`);
      render();
    }

    function onKeyDown(event) {
      if (event.target && /INPUT|SELECT|TEXTAREA/.test(event.target.tagName)) return;
      if (event.key === "Escape" && selected) {
        selected = null;
        message = "선택을 해제했습니다.";
        render();
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        undoMove();
      }
      if (!event.ctrlKey && !event.metaKey && event.key.toLowerCase() === "h") showHint();
    }

    const timer = window.setInterval(function () {
      if (!started || gameOver) return;
      seconds += 1;
      updateStats();
      if (seconds % 5 === 0) saveState();
    }, 1000);
    newGame.addEventListener("click", function () { deal("카드를 다시 섞어 새 게임을 시작했습니다.", true); });
    undo.addEventListener("click", undoMove);
    hintButton.addEventListener("click", showHint);
    autoFinish.addEventListener("click", autoMoveSafeCards);
    sound.addEventListener("click", function () { audio.toggle(sound); });
    window.addEventListener("keydown", onKeyDown);
    cleanup.push(function () {
      window.clearInterval(timer);
      window.removeEventListener("keydown", onKeyDown);
      audio.close();
      surface.classList.remove("freecell-game");
    });

    if (restoreSavedGame()) render();
    else deal("새 카드를 펼쳤습니다.", false);
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
    let rolling = false;
    let rollTimer = null;
    let stopTimer = null;
    renderScore(surface, [
      { label: "누적", value: "0" },
      { label: "이번 턴", value: "0" },
      { label: "목표", value: "30" }
    ]);
    const stats = surface.querySelectorAll(".mini-score b");
    surface.insertAdjacentHTML("beforeend", `<div class="dice-face" id="diceFace">?</div><div class="dice-progress" aria-hidden="true"><span id="diceProgress"></span></div><div class="mini-controls"><button class="button secondary" id="roll">굴리기</button><button class="button primary" id="hold">멈추기</button></div>`);
    const face = $("#diceFace", surface);
    const progress = $("#diceProgress", surface);
    const roll = $("#roll", surface);
    const hold = $("#hold", surface);
    function sync() {
      stats[0].textContent = String(total);
      stats[1].textContent = String(turn);
      progress.style.width = `${Math.min(100, (total / 30) * 100)}%`;
    }
    function finishRoll(value) {
      clearInterval(rollTimer);
      rollTimer = null;
      rolling = false;
      face.classList.remove("rolling");
      face.textContent = String(value);
      roll.disabled = false;
      hold.disabled = false;
      if (value === 1) {
        turn = 0;
        setResult("1이 나와 이번 턴 점수를 잃었습니다.");
      } else {
        turn += value;
        setResult(`이번 턴 ${turn}점. 계속 굴릴까요?`);
      }
      sync();
      pulseClass(face, value === 1 ? "danger-pop" : "success-pop");
    }
    roll.addEventListener("click", function () {
      if (rolling) return;
      rolling = true;
      roll.disabled = true;
      hold.disabled = true;
      face.classList.add("rolling");
      setResult("주사위를 굴리는 중입니다.");
      rollTimer = setInterval(function () {
        face.textContent = String(1 + Math.floor(Math.random() * 6));
      }, 70);
      stopTimer = setTimeout(function () {
        finishRoll(1 + Math.floor(Math.random() * 6));
      }, 560);
    });
    hold.addEventListener("click", function () {
      if (rolling) return;
      total += turn;
      turn = 0;
      if (total >= 30) {
        saveBest(game.id, total, function (a, b) { return a > b; });
        setResult(`${total}점으로 목표를 넘겼습니다.`);
      } else {
        setResult(`누적 ${total}점. 목표는 30점입니다.`);
      }
      sync();
    });
    cleanup.push(function () {
      clearInterval(rollTimer);
      clearTimeout(stopTimer);
    });
    sync();
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
    let credits = 50;
    let spins = 0;
    let spinning = false;
    let timers = [];
    renderScore(surface, [
      { label: "크레딧", value: "50" },
      { label: "스핀", value: "0" },
      { label: "최고", value: getBest(game.id) || "-" }
    ]);
    const stats = surface.querySelectorAll(".mini-score b");
    surface.insertAdjacentHTML("beforeend", `<div class="slot-row"><span>?</span><span>?</span><span>?</span></div><button class="button primary full" id="spin">돌리기</button>`);
    const reels = Array.from(surface.querySelectorAll(".slot-row span"));
    const spin = $("#spin", surface);
    function sync() {
      stats[0].textContent = String(credits);
      stats[1].textContent = String(spins);
    }
    function clearSpinTimers() {
      timers.forEach(function (timer) { clearInterval(timer); clearTimeout(timer); });
      timers = [];
    }
    function finish(result) {
      spinning = false;
      spin.disabled = false;
      clearSpinTimers();
      reels.forEach(function (slot, index) {
        slot.classList.remove("spinning");
        slot.textContent = result[index];
      });
      const score = result[0] === result[1] && result[1] === result[2] ? 100 : result[0] === result[1] || result[1] === result[2] || result[0] === result[2] ? 30 : 5;
      credits += score;
      saveBest(game.id, credits, function (a, b) { return a > b; });
      sync();
      surface.querySelector(".slot-row").classList.toggle("jackpot", score === 100);
      setResult(`점수 ${score}. ${score === 100 ? "잭팟입니다." : "다시 돌려 보세요."}`);
    }
    spin.addEventListener("click", function () {
      if (spinning || credits <= 0) return;
      spinning = true;
      credits -= 5;
      spins += 1;
      sync();
      spin.disabled = true;
      surface.querySelector(".slot-row").classList.remove("jackpot");
      setResult("릴이 돌아가는 중입니다.");
      const result = [sample(symbols), sample(symbols), sample(symbols)];
      reels.forEach(function (slot, index) {
        slot.classList.add("spinning");
        timers.push(setInterval(function () { slot.textContent = sample(symbols); }, 70 + index * 20));
        timers.push(setTimeout(function () {
          slot.classList.remove("spinning");
          slot.textContent = result[index];
          pulseClass(slot, "success-pop");
          if (index === reels.length - 1) finish(result);
        }, 520 + index * 260));
      });
    });
    cleanup.push(clearSpinTimers);
    sync();
  }

  function renderMines(game, surface) {
    const difficulties = {
      beginner: { id: "beginner", label: "초급", rows: 9, cols: 9, mines: 10, width: 414 },
      intermediate: { id: "intermediate", label: "중급", rows: 16, cols: 16, mines: 40, width: 604 },
      expert: { id: "expert", label: "고급", rows: 16, cols: 30, mines: 99, width: 940 }
    };
    let difficulty = difficulties.beginner;
    let mineSet = null;
    let states = [];
    let opened = 0;
    let flags = 0;
    let questions = 0;
    let flagMode = false;
    let started = false;
    let gameOver = false;
    let seconds = 0;
    let moves = 0;
    let hintsUsed = 0;
    let explodedIndex = -1;
    let message = "첫 칸은 안전합니다. 열어 볼 칸을 선택하세요.";
    let lastChordAt = 0;
    const audio = createTonePlayer();

    surface.classList.add("mines-game");
    renderScore(surface, [
      { label: "남은 지뢰", value: "10" },
      { label: "시간", value: "00:00" },
      { label: "진행", value: "0%" },
      { label: "최고", value: "-" }
    ]);
    const stats = surface.querySelectorAll(".mini-score b");

    const settings = document.createElement("div");
    settings.className = "mines-settings";
    const difficultyGroup = document.createElement("div");
    difficultyGroup.className = "mines-difficulty";
    difficultyGroup.setAttribute("role", "group");
    difficultyGroup.setAttribute("aria-label", "지뢰찾기 난이도");
    const difficultyButtons = Object.values(difficulties).map(function (item) {
      const choice = button(`${item.label} ${item.rows}×${item.cols}`, "mines-difficulty-button");
      choice.dataset.difficulty = item.id;
      choice.setAttribute("aria-pressed", String(item.id === difficulty.id));
      difficultyGroup.appendChild(choice);
      return choice;
    });
    const status = document.createElement("div");
    status.className = "mines-status";
    status.setAttribute("aria-live", "polite");
    settings.append(difficultyGroup, status);

    const controls = document.createElement("div");
    controls.className = "mini-controls mines-actions";
    const flagToggle = button("열기 모드", "button secondary mines-mode-toggle");
    flagToggle.setAttribute("aria-pressed", "false");
    const newGame = button("새 게임", "button primary");
    const hintButton = button("안전 힌트 3", "button secondary");
    const sound = button("소리 켜짐", "button secondary sound-toggle");
    sound.setAttribute("aria-pressed", "true");
    controls.append(newGame, flagToggle, hintButton, sound);

    const boardScroll = document.createElement("div");
    boardScroll.className = "mines-board-scroll";
    boardScroll.setAttribute("tabindex", "0");
    boardScroll.setAttribute("aria-label", "지뢰찾기 게임판 스크롤 영역");
    const grid = document.createElement("div");
    grid.className = "mines-board";
    grid.setAttribute("role", "grid");
    grid.setAttribute("aria-label", "지뢰찾기 게임판");
    boardScroll.appendChild(grid);

    const guide = document.createElement("p");
    guide.className = "mini-note";
    guide.textContent = "숫자는 주변 8칸의 지뢰 수입니다. PC는 우클릭, 모바일은 깃발 모드로 표시하며 열린 숫자를 다시 누르면 주변을 한꺼번에 확인합니다.";
    surface.append(settings, controls, boardScroll, guide);

    function totalCells() {
      return difficulty.rows * difficulty.cols;
    }

    function safeTotal() {
      return totalCells() - difficulty.mines;
    }

    function formatTime(value) {
      if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return "-";
      const minutes = Math.floor(value / 60);
      const remaining = value % 60;
      return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
    }

    function bestId() {
      return `${game.id}-${difficulty.id}`;
    }

    function neighbors(index) {
      const r = Math.floor(index / difficulty.cols);
      const c = index % difficulty.cols;
      const items = [];
      for (let dr = -1; dr <= 1; dr += 1) for (let dc = -1; dc <= 1; dc += 1) {
        if (!dr && !dc) continue;
        const rr = r + dr;
        const cc = c + dc;
        if (rr >= 0 && rr < difficulty.rows && cc >= 0 && cc < difficulty.cols) {
          items.push(rr * difficulty.cols + cc);
        }
      }
      return items;
    }

    function buildMines(firstIndex) {
      const forbidden = new Set(neighbors(firstIndex).concat([firstIndex]));
      const candidates = Array.from({ length: totalCells() }, function (_, index) { return index; })
        .filter(function (index) { return !forbidden.has(index); });
      mineSet = new Set();
      shuffle(candidates).slice(0, difficulty.mines).forEach(function (index) { mineSet.add(index); });
    }

    function count(index) {
      return neighbors(index).filter(function (pos) { return mineSet.has(pos); }).length;
    }

    function syncStats() {
      stats[0].textContent = String(Math.max(0, difficulty.mines - flags));
      stats[1].textContent = formatTime(seconds);
      stats[2].textContent = `${Math.round((opened / safeTotal()) * 100)}%`;
      stats[3].textContent = formatTime(getBest(bestId()));
    }

    function cellLabel(index) {
      const row = Math.floor(index / difficulty.cols) + 1;
      const col = (index % difficulty.cols) + 1;
      const state = states[index];
      if (state === "flag") return `${row}행 ${col}열, 깃발 표시`;
      if (state === "question") return `${row}행 ${col}열, 물음표 표시`;
      if (state === "open") {
        const nearby = count(index);
        return nearby ? `${row}행 ${col}열, 주변 지뢰 ${nearby}개` : `${row}행 ${col}열, 빈 안전 칸`;
      }
      if (state === "mine" || state === "exploded") return `${row}행 ${col}열, 지뢰`;
      if (state === "wrong") return `${row}행 ${col}열, 잘못 놓은 깃발`;
      return `${row}행 ${col}열, 닫힌 칸`;
    }

    function renderBoard() {
      Array.from(grid.children).forEach(function (cell, index) {
        const state = states[index];
        cell.className = "mines-cell";
        cell.textContent = "";
        cell.disabled = gameOver;
        if (state === "open") {
          const nearby = count(index);
          cell.classList.add("is-open");
          if (nearby) {
            cell.textContent = String(nearby);
            cell.classList.add(`number-${nearby}`);
          }
        } else if (state === "flag") {
          cell.textContent = "⚑";
          cell.classList.add("is-flagged");
        } else if (state === "question") {
          cell.textContent = "?";
          cell.classList.add("is-question");
        } else if (state === "mine" || state === "exploded") {
          cell.textContent = "✹";
          cell.classList.add("is-mine");
          if (state === "exploded") cell.classList.add("is-exploded");
        } else if (state === "wrong") {
          cell.textContent = "×";
          cell.classList.add("is-wrong");
        }
        cell.setAttribute("aria-label", cellLabel(index));
      });
      const modeName = flagMode ? "깃발 모드" : "열기 모드";
      status.innerHTML = `<strong>${gameOver ? (explodedIndex >= 0 ? "게임 종료" : "판 완성") : modeName}</strong><span>${message}</span>`;
      flagToggle.textContent = flagMode ? "깃발 모드" : "열기 모드";
      flagToggle.classList.toggle("active", flagMode);
      flagToggle.setAttribute("aria-pressed", String(flagMode));
      hintButton.textContent = `안전 힌트 ${Math.max(0, 3 - hintsUsed)}`;
      hintButton.disabled = gameOver || hintsUsed >= 3;
      difficultyButtons.forEach(function (choice) {
        const active = choice.dataset.difficulty === difficulty.id;
        choice.classList.toggle("active", active);
        choice.setAttribute("aria-pressed", String(active));
      });
      syncStats();
    }

    function revealLoss() {
      states = states.map(function (state, index) {
        if (index === explodedIndex) return "exploded";
        if (mineSet.has(index)) return state === "flag" ? "flag" : "mine";
        if (state === "flag") return "wrong";
        return state;
      });
    }

    function finishLoss(index) {
      gameOver = true;
      started = false;
      explodedIndex = index;
      revealLoss();
      message = "지뢰가 있었습니다. 잘못 놓인 깃발과 숫자 경계를 확인해 보세요.";
      setResult(`${difficulty.label} 게임 종료. ${formatTime(seconds)}, 진행률 ${Math.round((opened / safeTotal()) * 100)}%입니다.`);
      audio.tone(120, 0.22, "sawtooth", 0.035);
      renderBoard();
    }

    function finishWin() {
      gameOver = true;
      started = false;
      explodedIndex = -1;
      states = states.map(function (state, index) { return mineSet.has(index) ? "flag" : state; });
      flags = difficulty.mines;
      const isBest = hintsUsed === 0 && saveBest(bestId(), seconds, function (value, previous) { return value < previous; });
      message = hintsUsed
        ? `힌트 ${hintsUsed}회를 사용해 모든 안전 칸을 열었습니다.`
        : `모든 안전 칸을 ${formatTime(seconds)} 만에 열었습니다${isBest ? ". 최고 기록입니다" : ""}.`;
      setResult(`${difficulty.label} 지뢰찾기 완성. 시간 ${formatTime(seconds)}, 이동 ${moves}회${hintsUsed ? `, 힌트 ${hintsUsed}회` : ""}입니다.`);
      audio.tone(660, 0.12, "sine", 0.035);
      audio.tone(880, 0.18, "sine", 0.03, 0.12);
      renderBoard();
    }

    function checkWin() {
      if (!gameOver && opened === safeTotal()) finishWin();
    }

    function revealRegion(startIndex) {
      const queue = [startIndex];
      const queued = new Set(queue);
      while (queue.length) {
        const index = queue.shift();
        if (states[index] === "open" || states[index] === "flag") continue;
        if (mineSet.has(index)) {
          finishLoss(index);
          return false;
        }
        if (states[index] === "question") questions -= 1;
        states[index] = "open";
        opened += 1;
        if (count(index) === 0) {
          neighbors(index).forEach(function (neighbor) {
            if (!queued.has(neighbor) && states[neighbor] !== "flag" && states[neighbor] !== "open") {
              queued.add(neighbor);
              queue.push(neighbor);
            }
          });
        }
      }
      return true;
    }

    function openCell(index) {
      if (gameOver || states[index] === "flag") return;
      if (states[index] === "open") {
        chord(index);
        return;
      }
      if (!mineSet) {
        buildMines(index);
        started = true;
      }
      moves += 1;
      if (mineSet.has(index)) {
        finishLoss(index);
        return;
      }
      const nearby = count(index);
      if (!revealRegion(index)) return;
      message = nearby ? `주변 지뢰 ${nearby}개입니다. 확실한 칸부터 이어 가세요.` : "빈 구역과 맞닿은 숫자 경계를 열었습니다.";
      setResult(message);
      audio.tone(nearby ? 360 + nearby * 35 : 520, 0.045, "sine", 0.014);
      checkWin();
      if (!gameOver) renderBoard();
    }

    function toggleFlag(index) {
      if (gameOver || states[index] === "open") return;
      moves += 1;
      if (states[index] === "closed") {
        if (flags >= difficulty.mines) {
          states[index] = "question";
          questions += 1;
          message = "사용 가능한 깃발을 모두 놓아 물음표로 표시했습니다.";
        } else {
          states[index] = "flag";
          flags += 1;
          message = "지뢰로 의심되는 칸에 깃발을 놓았습니다.";
          audio.tone(430, 0.05, "square", 0.014);
        }
      } else if (states[index] === "flag") {
        states[index] = "question";
        flags -= 1;
        questions += 1;
        message = "확신이 없는 칸을 물음표로 바꿨습니다.";
      } else {
        states[index] = "closed";
        questions -= 1;
        message = "표시를 지웠습니다.";
      }
      setResult(message);
      renderBoard();
    }

    function chord(index) {
      if (gameOver || states[index] !== "open" || !mineSet) return;
      const nearby = count(index);
      if (!nearby) return;
      const around = neighbors(index);
      const nearbyFlags = around.filter(function (neighbor) { return states[neighbor] === "flag"; }).length;
      if (nearbyFlags !== nearby) {
        message = `주변 깃발이 ${nearbyFlags}개입니다. 숫자 ${nearby}와 같아야 함께 열 수 있습니다.`;
        setResult(message);
        audio.tone(180, 0.055, "square", 0.012);
        renderBoard();
        return;
      }
      moves += 1;
      lastChordAt = Date.now();
      for (const neighbor of around) {
        if (states[neighbor] === "flag" || states[neighbor] === "open") continue;
        if (!revealRegion(neighbor)) return;
      }
      message = `숫자 ${nearby} 주변의 표시되지 않은 칸을 함께 열었습니다.`;
      setResult(message);
      audio.tone(580, 0.07, "triangle", 0.018);
      checkWin();
      if (!gameOver) renderBoard();
    }

    function useHint() {
      if (gameOver || hintsUsed >= 3) return;
      if (!mineSet) {
        const center = Math.floor(difficulty.rows / 2) * difficulty.cols + Math.floor(difficulty.cols / 2);
        buildMines(center);
        started = true;
      }
      const safeClosed = states.map(function (state, index) {
        return state !== "open" && state !== "flag" && !mineSet.has(index) ? index : -1;
      }).filter(function (index) { return index >= 0; });
      if (!safeClosed.length) return;
      const index = sample(safeClosed);
      hintsUsed += 1;
      moves += 1;
      revealRegion(index);
      message = `안전한 칸 하나를 열었습니다. 힌트가 ${3 - hintsUsed}회 남았습니다.`;
      setResult(message);
      audio.tone(720, 0.08, "sine", 0.018);
      checkWin();
      if (!gameOver) renderBoard();
    }

    function buildGrid() {
      grid.innerHTML = "";
      grid.style.setProperty("--mines-cols", String(difficulty.cols));
      grid.style.setProperty("--mines-width", `${difficulty.width}px`);
      grid.className = `mines-board difficulty-${difficulty.id}`;
      for (let index = 0; index < totalCells(); index += 1) {
        const cell = button("", "mines-cell");
        cell.dataset.index = String(index);
        cell.tabIndex = index === 0 ? 0 : -1;
        cell.setAttribute("role", "gridcell");
        cell.addEventListener("focus", function () {
          Array.from(grid.children).forEach(function (item) { item.tabIndex = -1; });
          cell.tabIndex = 0;
        });
        cell.addEventListener("click", function () {
          if (flagMode) toggleFlag(index);
          else openCell(index);
        });
        cell.addEventListener("contextmenu", function (event) {
          event.preventDefault();
          if (Date.now() - lastChordAt < 320) return;
          toggleFlag(index);
        });
        cell.addEventListener("mousedown", function (event) {
          if (event.buttons === 3) {
            event.preventDefault();
            chord(index);
          }
        });
        grid.appendChild(cell);
      }
    }

    function reset(messageText) {
      mineSet = null;
      states = Array(totalCells()).fill("closed");
      opened = 0;
      flags = 0;
      questions = 0;
      flagMode = false;
      started = false;
      gameOver = false;
      seconds = 0;
      moves = 0;
      hintsUsed = 0;
      explodedIndex = -1;
      message = messageText || `${difficulty.label} 게임입니다. 첫 칸은 안전합니다.`;
      buildGrid();
      setResult(`${difficulty.label} ${difficulty.rows}×${difficulty.cols}, 지뢰 ${difficulty.mines}개. 첫 칸을 열어 보세요.`);
      renderBoard();
    }

    flagToggle.addEventListener("click", function () {
      flagMode = !flagMode;
      message = flagMode ? "칸을 누르면 깃발, 물음표, 표시 없음 순서로 바뀝니다." : "칸을 누르면 안전 여부를 확인해 엽니다.";
      setResult(message);
      renderBoard();
    });

    difficultyButtons.forEach(function (choice) {
      choice.addEventListener("click", function () {
        const next = difficulties[choice.dataset.difficulty];
        if (!next || next.id === difficulty.id) return;
        difficulty = next;
        reset(`${difficulty.label} 난이도로 새 게임을 시작했습니다.`);
      });
    });

    grid.addEventListener("keydown", function (event) {
      const active = document.activeElement;
      if (!active || !active.classList.contains("mines-cell")) return;
      const index = Number(active.dataset.index);
      let next = index;
      if (event.key === "ArrowLeft") next = Math.max(0, index - 1);
      else if (event.key === "ArrowRight") next = Math.min(totalCells() - 1, index + 1);
      else if (event.key === "ArrowUp") next = Math.max(0, index - difficulty.cols);
      else if (event.key === "ArrowDown") next = Math.min(totalCells() - 1, index + difficulty.cols);
      else if (event.key.toLowerCase() === "f") {
        event.preventDefault();
        toggleFlag(index);
        return;
      } else return;
      event.preventDefault();
      active.tabIndex = -1;
      grid.children[next].tabIndex = 0;
      grid.children[next].focus();
    });

    newGame.addEventListener("click", function () { reset("같은 난이도의 새 판을 만들었습니다."); });
    hintButton.addEventListener("click", useHint);
    sound.addEventListener("click", function () { audio.toggle(sound); });

    const timer = window.setInterval(function () {
      if (!started || gameOver) return;
      seconds += 1;
      syncStats();
    }, 1000);
    cleanup.push(function () {
      window.clearInterval(timer);
      audio.close();
      surface.classList.remove("mines-game");
    });
    reset("초급 게임입니다. 첫 칸과 주변 칸은 안전하게 시작됩니다.");
  }

  function renderSliding(game, surface) {
    let tiles = [1,2,3,4,5,6,7,8,""];
    let moves = 0;
    renderScore(surface, [
      { label: "이동", value: "0" },
      { label: "최고", value: getBest(game.id) || "-" }
    ]);
    const stats = surface.querySelectorAll(".mini-score b");
    const grid = makeGrid(9, "mini-grid");
    surface.appendChild(grid);
    function adjacentIndexes(empty) {
      return [empty - 1, empty + 1, empty - 3, empty + 3].filter(function (index) {
        return index >= 0 && index < 9 && Math.abs((empty % 3) - (index % 3)) <= 1;
      });
    }
    function shuffleSolvable() {
      let previous = -1;
      for (let i = 0; i < 120; i += 1) {
        const empty = tiles.indexOf("");
        const choices = adjacentIndexes(empty).filter(function (index) { return index !== previous; });
        const next = sample(choices.length ? choices : adjacentIndexes(empty));
        tiles[empty] = tiles[next];
        tiles[next] = "";
        previous = empty;
      }
      if (solved()) shuffleSolvable();
    }
    function draw() {
      Array.from(grid.children).forEach(function (cell, index) {
        cell.textContent = String(tiles[index]);
        cell.disabled = tiles[index] === "";
        cell.setAttribute("aria-label", tiles[index] === "" ? `빈 칸 ${index + 1}` : `${tiles[index]} 타일`);
      });
      stats[0].textContent = String(moves);
    }
    function solved() {
      return tiles.join(",") === "1,2,3,4,5,6,7,8,";
    }
    Array.from(grid.children).forEach(function (cell, index) {
      cell.addEventListener("click", function () {
        const empty = tiles.indexOf("");
        if (!adjacentIndexes(empty).includes(index)) return;
        tiles[empty] = tiles[index];
        tiles[index] = "";
        moves += 1;
        draw();
        if (solved()) {
          Array.from(grid.children).forEach(function (item) { item.disabled = true; });
          const isBest = saveBest(game.id, moves, function (a, b) { return a < b; });
          setResult(isBest ? `${moves}번 이동으로 완성. 새 최고 기록입니다.` : `${moves}번 이동으로 퍼즐을 맞췄습니다.`);
        } else {
          setResult("타일을 순서대로 맞춰 보세요.");
        }
      });
    });
    shuffleSolvable();
    draw();
    setResult("항상 풀 수 있는 퍼즐입니다. 빈 칸 옆 타일부터 움직여 보세요.");
  }

  function renderSudoku(game, surface) {
    const difficulties = {
      easy: {
        label: "쉬움",
        puzzle: "530070000600195000098000060800060003400803001700020006060000280000419005000080079",
        solution: "534678912672195348198342567859761423426853791713924856961537284287419635345286179"
      },
      normal: {
        label: "보통",
        puzzle: "000260701680070090190004500820100040004602900050003028009300074040050036703018000",
        solution: "435269781682571493197834562826195347374682915951743628519326874248957136763418259"
      },
      hard: {
        label: "어려움",
        puzzle: "800000000003600000070090200050007000000045700000100030001000068008500010090000400",
        solution: "812753649943682175675491283154237896369845721287169534521974368438526917796318452"
      }
    };
    const saveKey = "hanpan-sudoku-state-v3";
    const restartRequested = surface.dataset.restartRequested === "true";
    delete surface.dataset.restartRequested;
    let difficulty = "easy";
    let puzzle = [];
    let answer = [];
    let values = [];
    let notes = Array.from({ length: 81 }, function () { return []; });
    let hinted = Array(81).fill(false);
    let selected = 0;
    let mistakes = 0;
    let hints = 0;
    let seconds = 0;
    let started = false;
    let completed = false;
    let noteMode = false;
    let autoErrors = true;
    let forceErrors = false;
    let history = [];
    const audio = createTonePlayer();

    renderScore(surface, [
      { label: "입력", value: "0/0" },
      { label: "시간", value: "00:00" },
      { label: "실수", value: "0" },
      { label: "최고", value: "-" }
    ]);
    const stats = surface.querySelectorAll(".mini-score b");
    const gameWrap = document.createElement("div");
    gameWrap.className = "sudoku-classic";
    const settings = document.createElement("div");
    settings.className = "sudoku-settings";
    const difficultyGroup = document.createElement("div");
    difficultyGroup.className = "sudoku-difficulty";
    difficultyGroup.setAttribute("role", "group");
    difficultyGroup.setAttribute("aria-label", "스도쿠 난이도");
    Object.keys(difficulties).forEach(function (id) {
      const option = button(difficulties[id].label, "button secondary");
      option.dataset.difficulty = id;
      difficultyGroup.appendChild(option);
    });
    const status = document.createElement("div");
    status.className = "sudoku-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    const statusTitle = document.createElement("strong");
    const statusDetail = document.createElement("span");
    status.append(statusTitle, statusDetail);
    settings.append(difficultyGroup, status);
    const grid = document.createElement("div");
    grid.className = "sudoku-board";
    grid.setAttribute("role", "grid");
    grid.setAttribute("aria-label", "9x9 스도쿠 게임판");
    gameWrap.append(settings, grid);
    surface.appendChild(gameWrap);

    const numberPad = document.createElement("div");
    numberPad.className = "sudoku-number-pad";
    numberPad.setAttribute("role", "group");
    numberPad.setAttribute("aria-label", "숫자 입력");
    for (let number = 1; number <= 9; number += 1) {
      const item = button(String(number), "sudoku-number");
      item.dataset.number = String(number);
      item.setAttribute("aria-label", `${number} 입력`);
      numberPad.appendChild(item);
    }

    const controls = document.createElement("div");
    controls.className = "sudoku-controls";
    const newGame = button("새 게임", "button primary");
    const undo = button("되돌리기", "button secondary");
    const erase = button("지우기", "button secondary");
    const noteToggle = button("메모 꺼짐", "button secondary");
    const check = button("검사", "button secondary");
    const hint = button("힌트 3", "button secondary");
    const errorToggle = button("오류 표시 켜짐", "button secondary");
    const sound = button("소리 켜짐", "button secondary");
    noteToggle.setAttribute("aria-pressed", "false");
    errorToggle.setAttribute("aria-pressed", "true");
    sound.setAttribute("aria-pressed", "true");
    controls.append(newGame, undo, erase, noteToggle, check, hint, errorToggle, sound);
    const guide = document.createElement("p");
    guide.className = "mini-note";
    guide.textContent = "각 행, 열, 3x3 박스에는 1부터 9가 한 번씩 들어갑니다. 메모 모드에서는 빈칸에 후보 숫자를 여러 개 남길 수 있습니다.";
    surface.append(numberPad, controls, guide);

    function shuffled(items) {
      return shuffle(items.slice());
    }

    function transformedBoard(config) {
      const bands = shuffled([0, 1, 2]);
      const stacks = shuffled([0, 1, 2]);
      const rows = bands.flatMap(function (band) {
        return shuffled([0, 1, 2]).map(function (offset) { return band * 3 + offset; });
      });
      const columns = stacks.flatMap(function (stack) {
        return shuffled([0, 1, 2]).map(function (offset) { return stack * 3 + offset; });
      });
      const digitOrder = shuffled([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      const transpose = Math.random() < 0.5;
      function transform(source) {
        const sourceValues = source.split("").map(Number);
        const result = [];
        for (let row = 0; row < 9; row += 1) {
          for (let column = 0; column < 9; column += 1) {
            const sourceRow = transpose ? columns[column] : rows[row];
            const sourceColumn = transpose ? rows[row] : columns[column];
            const value = sourceValues[sourceRow * 9 + sourceColumn];
            result.push(value ? digitOrder[value - 1] : 0);
          }
        }
        return result;
      }
      return { puzzle: transform(config.puzzle), answer: transform(config.solution) };
    }

    function peers(index) {
      const row = Math.floor(index / 9);
      const column = index % 9;
      const boxRow = Math.floor(row / 3) * 3;
      const boxColumn = Math.floor(column / 3) * 3;
      const items = new Set();
      for (let col = 0; col < 9; col += 1) items.add(row * 9 + col);
      for (let nextRow = 0; nextRow < 9; nextRow += 1) items.add(nextRow * 9 + column);
      for (let nextRow = boxRow; nextRow < boxRow + 3; nextRow += 1) {
        for (let col = boxColumn; col < boxColumn + 3; col += 1) items.add(nextRow * 9 + col);
      }
      items.delete(index);
      return Array.from(items);
    }

    function formatTime(value) {
      const minutes = Math.floor(value / 60);
      const remaining = value % 60;
      return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
    }

    function bestKey() {
      return `hanpan-sudoku-best-${difficulty}`;
    }

    function readBest() {
      try {
        const value = Number(localStorage.getItem(bestKey()));
        return Number.isFinite(value) && value > 0 ? value : null;
      } catch (error) {
        return null;
      }
    }

    function saveBestTime() {
      if (hints > 0) return false;
      const previous = readBest();
      if (previous !== null && previous <= seconds) return false;
      try {
        localStorage.setItem(bestKey(), String(seconds));
        return true;
      } catch (error) {
        return false;
      }
    }

    function editableIndexes() {
      return puzzle.map(function (value, index) { return value ? null : index; }).filter(function (index) { return index !== null; });
    }

    function filledCount() {
      return editableIndexes().filter(function (index) { return values[index] !== 0; }).length;
    }

    function syncStats() {
      const editable = editableIndexes();
      stats[0].textContent = `${filledCount()}/${editable.length}`;
      stats[1].textContent = formatTime(seconds);
      stats[2].textContent = String(mistakes);
      const best = readBest();
      stats[3].textContent = best ? formatTime(best) : "-";
    }

    function hasConflict(index) {
      const value = values[index];
      return Boolean(value && peers(index).some(function (peer) { return values[peer] === value; }));
    }

    function renderBoard(focusSelected) {
      grid.innerHTML = "";
      const selectedValue = values[selected];
      values.forEach(function (value, index) {
        const cell = button("", "sudoku-cell");
        const row = Math.floor(index / 9) + 1;
        const column = index % 9 + 1;
        const isGiven = puzzle[index] !== 0;
        const isError = !isGiven && value && (value !== answer[index] || hasConflict(index));
        const isRelated = index !== selected && peers(selected).includes(index);
        cell.dataset.index = String(index);
        cell.tabIndex = index === selected ? 0 : -1;
        cell.classList.toggle("is-given", isGiven);
        cell.classList.toggle("is-selected", index === selected);
        cell.classList.toggle("is-related", isRelated);
        cell.classList.toggle("is-same", Boolean(selectedValue && value === selectedValue && index !== selected));
        cell.classList.toggle("is-error", Boolean(isError && (autoErrors || forceErrors)));
        cell.classList.toggle("is-hinted", hinted[index]);
        cell.setAttribute("role", "gridcell");
        cell.setAttribute("aria-selected", String(index === selected));
        cell.setAttribute("aria-invalid", String(Boolean(isError && (autoErrors || forceErrors))));
        if (value) {
          cell.textContent = String(value);
          cell.setAttribute("aria-label", `${row}행 ${column}열, ${isGiven ? "고정 숫자" : "입력 숫자"} ${value}`);
        } else if (notes[index].length) {
          const noteGrid = document.createElement("span");
          noteGrid.className = "sudoku-notes";
          for (let number = 1; number <= 9; number += 1) {
            const mark = document.createElement("i");
            mark.textContent = notes[index].includes(number) ? String(number) : "";
            noteGrid.appendChild(mark);
          }
          cell.appendChild(noteGrid);
          cell.setAttribute("aria-label", `${row}행 ${column}열, 메모 ${notes[index].join(", ")}`);
        } else {
          cell.setAttribute("aria-label", `${row}행 ${column}열, 빈 칸`);
        }
        cell.addEventListener("click", function () {
          selected = index;
          render();
          grid.querySelector(`[data-index="${index}"]`)?.focus({ preventScroll: true });
        });
        grid.appendChild(cell);
      });
      grid.setAttribute("aria-label", `${difficulties[difficulty].label} 난이도 9x9 스도쿠. 입력 ${filledCount()}/${editableIndexes().length}, 실수 ${mistakes}.`);
      if (focusSelected) grid.querySelector(`[data-index="${selected}"]`)?.focus({ preventScroll: true });
    }

    function render(focusSelected) {
      syncStats();
      Array.from(difficultyGroup.children).forEach(function (item) {
        const active = item.dataset.difficulty === difficulty;
        item.classList.toggle("primary", active);
        item.classList.toggle("secondary", !active);
        item.setAttribute("aria-pressed", String(active));
      });
      undo.disabled = history.length === 0 || completed;
      erase.disabled = completed || puzzle[selected] !== 0 || (!values[selected] && !notes[selected].length);
      hint.disabled = completed || hints >= 3;
      hint.textContent = `힌트 ${3 - hints}`;
      noteToggle.textContent = noteMode ? "메모 켜짐" : "메모 꺼짐";
      noteToggle.setAttribute("aria-pressed", String(noteMode));
      errorToggle.textContent = autoErrors ? "오류 표시 켜짐" : "오류 표시 꺼짐";
      errorToggle.setAttribute("aria-pressed", String(autoErrors));
      statusTitle.textContent = completed ? "퍼즐 완성" : started ? "풀이 중" : "준비";
      statusDetail.textContent = completed
        ? `${formatTime(seconds)} · 실수 ${mistakes} · 힌트 ${hints}`
        : `${difficulties[difficulty].label} · 빈칸 ${editableIndexes().length - filledCount()}개 · 메모 ${noteMode ? "켜짐" : "꺼짐"}`;
      Array.from(numberPad.children).forEach(function (item) { item.disabled = completed; });
      renderBoard(focusSelected);
    }

    function snapshot() {
      return {
        values: values.slice(),
        notes: notes.map(function (items) { return items.slice(); }),
        hinted: hinted.slice(),
        mistakes,
        hints,
        forceErrors
      };
    }

    function pushHistory() {
      history.push(snapshot());
      if (history.length > 50) history.shift();
    }

    function persist() {
      try {
        localStorage.setItem(saveKey, JSON.stringify({
          version: 3,
          difficulty,
          puzzle,
          answer,
          values,
          notes,
          hinted,
          selected,
          mistakes,
          hints,
          seconds,
          started,
          completed,
          noteMode,
          autoErrors,
          forceErrors,
          history
        }));
      } catch (error) {
        // Local puzzle recovery is optional.
      }
    }

    function restore() {
      try {
        const saved = JSON.parse(localStorage.getItem(saveKey) || "null");
        if (!saved || saved.version !== 3 || !difficulties[saved.difficulty]) return false;
        const arrays = [saved.puzzle, saved.answer, saved.values, saved.notes, saved.hinted];
        if (arrays.some(function (items) { return !Array.isArray(items) || items.length !== 81; })) return false;
        if (!saved.puzzle.every(function (value) { return Number.isInteger(value) && value >= 0 && value <= 9; })) return false;
        if (!saved.answer.every(function (value) { return Number.isInteger(value) && value >= 1 && value <= 9; })) return false;
        if (!saved.values.every(function (value) { return Number.isInteger(value) && value >= 0 && value <= 9; })) return false;
        difficulty = saved.difficulty;
        puzzle = saved.puzzle.slice();
        answer = saved.answer.slice();
        values = saved.values.slice();
        notes = saved.notes.map(function (items) { return Array.isArray(items) ? items.filter(function (value) { return value >= 1 && value <= 9; }) : []; });
        hinted = saved.hinted.map(Boolean);
        selected = Math.max(0, Math.min(80, Number(saved.selected) || 0));
        mistakes = Math.max(0, Number(saved.mistakes) || 0);
        hints = Math.max(0, Math.min(3, Number(saved.hints) || 0));
        seconds = Math.max(0, Number(saved.seconds) || 0);
        started = Boolean(saved.started);
        completed = Boolean(saved.completed);
        noteMode = Boolean(saved.noteMode);
        autoErrors = saved.autoErrors !== false;
        forceErrors = Boolean(saved.forceErrors);
        history = Array.isArray(saved.history) ? saved.history.slice(-50) : [];
        return true;
      } catch (error) {
        return false;
      }
    }

    function startTimer() {
      if (!started) started = true;
    }

    function clearPeerNotes(index, number) {
      peers(index).forEach(function (peer) {
        notes[peer] = notes[peer].filter(function (value) { return value !== number; });
      });
    }

    function finishIfComplete() {
      if (!values.every(function (value, index) { return value === answer[index]; })) return false;
      completed = true;
      const isBest = saveBestTime();
      audio.tone(523, 0.12, "sine", 0.025);
      audio.tone(659, 0.16, "sine", 0.025, 0.12);
      audio.tone(784, 0.22, "sine", 0.025, 0.26);
      if (hints > 0) setResult(`스도쿠 완성. ${formatTime(seconds)}에 풀었습니다. 힌트를 사용한 판은 최고 기록에서 제외됩니다.`);
      else setResult(isBest ? `스도쿠 완성. 새 최고 기록 ${formatTime(seconds)}입니다.` : `스도쿠 완성. ${formatTime(seconds)}에 풀었습니다.`);
      return true;
    }

    function enterNumber(number) {
      if (completed || puzzle[selected]) return;
      pushHistory();
      startTimer();
      forceErrors = false;
      if (noteMode) {
        if (values[selected]) values[selected] = 0;
        const current = notes[selected];
        notes[selected] = current.includes(number)
          ? current.filter(function (value) { return value !== number; })
          : current.concat(number).sort();
        audio.tone(250 + number * 22, 0.035, "triangle", 0.012);
        setResult(`${number} 후보 메모를 ${notes[selected].includes(number) ? "추가" : "삭제"}했습니다.`);
      } else {
        values[selected] = number;
        notes[selected] = [];
        if (number !== answer[selected] && autoErrors) {
          mistakes += 1;
          audio.tone(150, 0.09, "sawtooth", 0.02);
          setResult("해당 숫자는 이 칸의 정답이 아닙니다. 행, 열과 박스를 다시 확인하세요.");
        } else {
          if (number === answer[selected]) clearPeerNotes(selected, number);
          audio.tone(330 + number * 24, 0.045, "sine", 0.018);
          setResult(`${number}을 입력했습니다.`);
        }
      }
      finishIfComplete();
      persist();
      render(true);
    }

    function eraseSelected() {
      if (completed || puzzle[selected] || (!values[selected] && !notes[selected].length)) return;
      pushHistory();
      values[selected] = 0;
      notes[selected] = [];
      hinted[selected] = false;
      forceErrors = false;
      persist();
      render(true);
      setResult("선택한 칸을 지웠습니다.");
    }

    function undoMove() {
      const previous = history.pop();
      if (!previous || completed) return;
      values = previous.values.slice();
      notes = previous.notes.map(function (items) { return items.slice(); });
      hinted = previous.hinted.slice();
      mistakes = previous.mistakes;
      hints = previous.hints;
      forceErrors = previous.forceErrors;
      persist();
      render(true);
      audio.tone(240, 0.06, "triangle", 0.016);
      setResult("직전 입력을 되돌렸습니다.");
    }

    function useHint() {
      if (completed || hints >= 3) return;
      const candidates = editableIndexes().filter(function (index) { return values[index] !== answer[index]; });
      if (!candidates.length) return;
      const index = candidates.includes(selected) ? selected : sample(candidates);
      pushHistory();
      startTimer();
      selected = index;
      values[index] = answer[index];
      notes[index] = [];
      hinted[index] = true;
      hints += 1;
      clearPeerNotes(index, answer[index]);
      audio.tone(520, 0.1, "sine", 0.02);
      finishIfComplete();
      persist();
      render(true);
      if (!completed) setResult(`힌트로 ${answer[index]}을 채웠습니다. ${3 - hints}번 남았습니다.`);
    }

    function inspectBoard() {
      if (completed) return;
      const wrong = editableIndexes().filter(function (index) { return values[index] && values[index] !== answer[index]; });
      if (wrong.length) {
        mistakes += 1;
        forceErrors = true;
        selected = wrong[0];
        audio.tone(150, 0.09, "sawtooth", 0.02);
        setResult(`잘못된 숫자 ${wrong.length}개를 표시했습니다.`);
      } else if (filledCount() === editableIndexes().length) {
        finishIfComplete();
      } else {
        setResult("현재까지 입력한 숫자에는 오류가 없습니다.");
      }
      persist();
      render(true);
    }

    function newPuzzle(nextDifficulty, message) {
      difficulty = nextDifficulty || difficulty;
      const generated = transformedBoard(difficulties[difficulty]);
      puzzle = generated.puzzle;
      answer = generated.answer;
      values = puzzle.slice();
      notes = Array.from({ length: 81 }, function () { return []; });
      hinted = Array(81).fill(false);
      selected = puzzle.findIndex(function (value) { return value === 0; });
      mistakes = 0;
      hints = 0;
      seconds = 0;
      started = false;
      completed = false;
      noteMode = false;
      forceErrors = false;
      history = [];
      persist();
      render();
      setResult(message || `${difficulties[difficulty].label} 난이도 새 퍼즐입니다.`);
    }

    difficultyGroup.addEventListener("click", function (event) {
      const target = event.target.closest("button[data-difficulty]");
      if (!target || target.dataset.difficulty === difficulty) return;
      newPuzzle(target.dataset.difficulty, `${difficulties[target.dataset.difficulty].label} 난이도로 새 퍼즐을 시작합니다.`);
    });
    numberPad.addEventListener("click", function (event) {
      const target = event.target.closest("button[data-number]");
      if (target) enterNumber(Number(target.dataset.number));
    });
    newGame.addEventListener("click", function () { newPuzzle(difficulty); });
    undo.addEventListener("click", undoMove);
    erase.addEventListener("click", eraseSelected);
    noteToggle.addEventListener("click", function () {
      noteMode = !noteMode;
      render(true);
      persist();
      setResult(noteMode ? "메모 모드를 켰습니다." : "숫자 입력 모드로 돌아왔습니다.");
    });
    check.addEventListener("click", inspectBoard);
    hint.addEventListener("click", useHint);
    errorToggle.addEventListener("click", function () {
      autoErrors = !autoErrors;
      forceErrors = false;
      render(true);
      persist();
      setResult(autoErrors ? "틀린 숫자를 바로 표시합니다." : "오류 자동 표시를 껐습니다. 검사 버튼으로 확인할 수 있습니다.");
    });
    sound.addEventListener("click", function () { audio.toggle(sound); });

    function onKey(event) {
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName)) return;
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
        event.preventDefault();
        const row = Math.floor(selected / 9);
        const column = selected % 9;
        if (event.key === "ArrowUp") selected = Math.max(0, row - 1) * 9 + column;
        if (event.key === "ArrowDown") selected = Math.min(8, row + 1) * 9 + column;
        if (event.key === "ArrowLeft") selected = row * 9 + Math.max(0, column - 1);
        if (event.key === "ArrowRight") selected = row * 9 + Math.min(8, column + 1);
        render(true);
        return;
      }
      if (/^[1-9]$/.test(event.key)) {
        event.preventDefault();
        enterNumber(Number(event.key));
      } else if (["Backspace", "Delete", "0"].includes(event.key)) {
        event.preventDefault();
        eraseSelected();
      } else if (event.key.toLowerCase() === "n") {
        event.preventDefault();
        noteToggle.click();
      }
    }

    document.addEventListener("keydown", onKey);
    const timer = window.setInterval(function () {
      if (!started || completed) return;
      seconds += 1;
      syncStats();
      if (seconds % 5 === 0) persist();
    }, 1000);
    cleanup.push(function () {
      document.removeEventListener("keydown", onKey);
      window.clearInterval(timer);
      audio.close();
    });

    if (restartRequested) {
      restore();
      newPuzzle(difficulty, `${difficulties[difficulty].label} 난이도 새 퍼즐입니다.`);
    } else if (!restore()) {
      newPuzzle("easy", "쉬움 난이도 새 퍼즐입니다. 빈칸을 선택해 시작하세요.");
    } else {
      render();
      setResult(completed ? "완성한 스도쿠 기록을 불러왔습니다. 새 게임으로 다시 도전할 수 있습니다." : "저장된 스도쿠를 이어서 시작합니다.");
    }
  }

  function render2048(game, surface) {
    let board = Array(16).fill(0);
    let score = 0;
    let moves = 0;
    let finished = false;
    let won = false;
    let keepPlaying = false;
    let history = null;
    let spawnedIndex = -1;
    let mergedIndexes = [];
    let pointerStart = null;
    const saveKey = "hanpan-2048-state-v2";
    const maxTileKey = "hanpan-2048-max-tile";
    const audio = createTonePlayer();
    const restartRequested = surface.dataset.restartRequested === "true";
    delete surface.dataset.restartRequested;
    renderScore(surface, [
      { label: "점수", value: "0" },
      { label: "최고 점수", value: getBest(game.id) || "-" },
      { label: "최대 타일", value: "2" },
      { label: "이동", value: "0" }
    ]);
    const stats = surface.querySelectorAll(".mini-score b");
    const gameWrap = document.createElement("div");
    gameWrap.className = "game-2048";
    const status = document.createElement("div");
    status.className = "status-2048";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    const statusText = document.createElement("strong");
    const statusDetail = document.createElement("span");
    status.append(statusText, statusDetail);
    const grid = document.createElement("div");
    grid.className = "board-2048";
    grid.setAttribute("role", "grid");
    grid.setAttribute("tabindex", "0");
    grid.setAttribute("aria-label", "2048 게임판. 방향키나 스와이프로 타일을 이동할 수 있습니다.");
    for (let i = 0; i < 16; i += 1) {
      const cell = document.createElement("span");
      cell.className = "tile-2048";
      cell.setAttribute("role", "gridcell");
      grid.appendChild(cell);
    }
    gameWrap.append(status, grid);
    surface.appendChild(gameWrap);
    const controls = document.createElement("div");
    controls.className = "controls-2048";
    [
      ["위", "↑", "move-up", "위로 이동"],
      ["왼쪽", "←", "move-left", "왼쪽으로 이동"],
      ["아래", "↓", "move-down", "아래로 이동"],
      ["오른쪽", "→", "move-right", "오른쪽으로 이동"]
    ].forEach(function (itemData) {
      const item = button(itemData[1], `button secondary direction-2048 ${itemData[2]}`);
      item.dataset.dir = itemData[0];
      item.setAttribute("aria-label", itemData[3]);
      controls.appendChild(item);
    });
    const actions = document.createElement("div");
    actions.className = "actions-2048";
    const newGame = button("새 게임", "button primary");
    const undo = button("실행 취소", "button secondary");
    const continueGame = button("계속하기", "button primary continue-2048");
    const sound = button("소리 켜짐", "button secondary");
    sound.classList.add("sound-2048");
    sound.setAttribute("aria-pressed", "true");
    continueGame.hidden = true;
    undo.disabled = true;
    actions.append(newGame, undo, continueGame, sound);
    const guide = document.createElement("p");
    guide.className = "mini-note";
    guide.textContent = "방향키·화면 버튼·스와이프로 이동합니다. 한 수에 같은 타일은 한 번만 합쳐지며, 실행 취소는 직전 한 수까지 가능합니다.";
    surface.append(controls, actions, guide);

    function readMaxTile() {
      try {
        const value = Number(localStorage.getItem(maxTileKey));
        return Number.isFinite(value) && value >= 2 ? value : 2;
      } catch (error) {
        return 2;
      }
    }

    function saveMaxTile(value) {
      try { localStorage.setItem(maxTileKey, String(Math.max(readMaxTile(), value))); } catch (error) { /* Optional storage. */ }
    }

    function persist() {
      try {
        localStorage.setItem(saveKey, JSON.stringify({
          version: 2,
          board,
          score,
          moves,
          finished,
          won,
          keepPlaying,
          history
        }));
      } catch (error) {
        // Local game recovery is optional.
      }
    }

    function restore() {
      try {
        const saved = JSON.parse(localStorage.getItem(saveKey) || "null");
        if (!saved || saved.version !== 2 || !Array.isArray(saved.board) || saved.board.length !== 16) return false;
        if (!saved.board.every(function (value) { return Number.isInteger(value) && value >= 0; })) return false;
        board = saved.board.slice();
        score = Number(saved.score) || 0;
        moves = Number(saved.moves) || 0;
        finished = Boolean(saved.finished);
        won = Boolean(saved.won);
        keepPlaying = Boolean(saved.keepPlaying);
        history = saved.history && Array.isArray(saved.history.board) && saved.history.board.length === 16
          ? saved.history
          : null;
        return board.some(Boolean);
      } catch (error) {
        return false;
      }
    }

    function add() {
      const empty = board.map(function (value, index) { return value ? null : index; }).filter(function (value) { return value !== null; });
      if (!empty.length) return -1;
      const index = sample(empty);
      board[index] = Math.random() < 0.9 ? 2 : 4;
      return index;
    }

    function draw() {
      const max = Math.max.apply(null, board);
      const best = Math.max(getBest(game.id) || 0, score);
      stats[0].textContent = String(score);
      stats[1].textContent = best ? String(best) : "-";
      stats[2].textContent = String(max || 2);
      stats[3].textContent = String(moves);
      undo.disabled = !history;
      continueGame.hidden = !(won && !keepPlaying);
      statusText.textContent = won && !keepPlaying ? "2048 완성" : finished ? "게임 종료" : "플레이 중";
      statusDetail.textContent = finished && !won
        ? "더 이상 움직일 수 없습니다. 새 게임으로 다시 도전하세요."
        : won && !keepPlaying
          ? "계속하기를 누르면 더 높은 타일에 도전할 수 있습니다."
          : `빈칸 ${board.filter(function (value) { return value === 0; }).length}개 · 최대 ${max || 2}`;
      Array.from(grid.children).forEach(function (cell, index) {
        const value = board[index];
        cell.textContent = value || "";
        cell.dataset.value = value ? String(value) : "0";
        cell.classList.toggle("is-new", index === spawnedIndex);
        cell.classList.toggle("is-merged", mergedIndexes.includes(index));
        const row = Math.floor(index / 4) + 1;
        const column = index % 4 + 1;
        cell.setAttribute("aria-label", value ? `${row}행 ${column}열, ${value} 타일` : `${row}행 ${column}열, 빈 칸`);
      });
      grid.setAttribute("aria-label", `2048 게임판. 점수 ${score}, 최대 타일 ${max || 2}, 빈칸 ${board.filter(function (value) { return value === 0; }).length}개.`);
    }

    function merge(line) {
      const items = line.filter(Boolean);
      const merged = [];
      let gained = 0;
      for (let i = 0; i < items.length - 1; i += 1) {
        if (items[i] === items[i + 1]) {
          items[i] *= 2;
          gained += items[i];
          merged.push(i);
          items.splice(i + 1, 1);
        }
      }
      while (items.length < 4) items.push(0);
      return { values: items, gained, merged };
    }

    function buildMove(dir, source) {
      const next = source.slice();
      const merged = [];
      let gained = 0;
      for (let i = 0; i < 4; i += 1) {
        let line;
        if (dir === "왼쪽" || dir === "오른쪽") line = [0,1,2,3].map(function (c) { return source[i * 4 + c]; });
        else line = [0,1,2,3].map(function (r) { return source[r * 4 + i]; });
        const reverse = dir === "오른쪽" || dir === "아래";
        if (reverse) line.reverse();
        const result = merge(line);
        line = result.values;
        gained += result.gained;
        const lineMerged = result.merged.map(function (position) { return reverse ? 3 - position : position; });
        if (reverse) line.reverse();
        for (let j = 0; j < 4; j += 1) {
          if (dir === "왼쪽" || dir === "오른쪽") next[i * 4 + j] = line[j];
          else next[j * 4 + i] = line[j];
        }
        lineMerged.forEach(function (position) {
          merged.push(dir === "왼쪽" || dir === "오른쪽" ? i * 4 + position : position * 4 + i);
        });
      }
      return { board: next, gained, merged };
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

    function snapshot() {
      return { board: board.slice(), score, moves, finished, won, keepPlaying };
    }

    function finish(message) {
      finished = true;
      const isBest = saveBest(game.id, score, function (a, b) { return a > b; });
      saveMaxTile(Math.max.apply(null, board));
      audio.tone(180, 0.18, "sawtooth", 0.03);
      setResult(isBest ? `${message} 새 최고 점수 ${score}점입니다.` : `${message} ${score}점으로 마무리했습니다.`);
      persist();
      draw();
    }

    function move(dir) {
      if (finished) return;
      const before = board.join(",");
      const result = buildMove(dir, board);
      if (result.board.join(",") === before) {
        audio.tone(120, 0.05, "square", 0.012);
        setResult("그 방향으로는 움직일 수 없습니다.");
        return;
      }
      history = snapshot();
      board = result.board;
      score += result.gained;
      mergedIndexes = result.merged;
      spawnedIndex = add();
      moves += 1;
      const max = Math.max.apply(null, board);
      saveBest(game.id, score, function (a, b) { return a > b; });
      saveMaxTile(max);
      if (result.gained) {
        audio.tone(Math.min(880, 260 + Math.log2(result.gained) * 55), 0.08, "sine", 0.025);
      } else {
        audio.tone(180, 0.035, "triangle", 0.012);
      }
      if (max >= 2048 && !won) {
        won = true;
        finished = true;
        audio.tone(520, 0.12, "sine", 0.025);
        audio.tone(660, 0.15, "sine", 0.025, 0.1);
        audio.tone(820, 0.2, "sine", 0.025, 0.22);
        setResult(`2048 타일을 ${moves}수 만에 완성했습니다. 계속하기를 누르면 더 높은 타일에 도전할 수 있습니다.`);
        persist();
        draw();
        return;
      }
      draw();
      if (!hasMove()) {
        finish("더 이상 움직일 수 없습니다.");
        return;
      }
      persist();
      setResult(result.gained ? `${result.gained}점을 합쳤습니다. 빈칸을 유지하며 다음 수를 살펴보세요.` : `${moves}수 진행했습니다.`);
      window.setTimeout(function () {
        spawnedIndex = -1;
        mergedIndexes = [];
        draw();
      }, 190);
    }

    function resetGame() {
      board = Array(16).fill(0);
      score = 0;
      moves = 0;
      finished = false;
      won = false;
      keepPlaying = false;
      history = null;
      mergedIndexes = [];
      spawnedIndex = add();
      add();
      persist();
      draw();
      setResult("새 게임입니다. 큰 타일을 한쪽 모서리에 유지해 보세요.");
      grid.focus({ preventScroll: true });
    }

    function undoMove() {
      if (!history) return;
      board = history.board.slice();
      score = history.score;
      moves = history.moves;
      finished = history.finished;
      won = history.won;
      keepPlaying = history.keepPlaying;
      history = null;
      spawnedIndex = -1;
      mergedIndexes = [];
      persist();
      draw();
      audio.tone(240, 0.07, "triangle", 0.02);
      setResult("직전 한 수를 되돌렸습니다.");
      grid.focus({ preventScroll: true });
    }

    controls.addEventListener("click", function (event) {
      const target = event.target.closest("button");
      if (target) {
        move(target.dataset.dir);
        grid.focus({ preventScroll: true });
      }
    });
    newGame.addEventListener("click", resetGame);
    undo.addEventListener("click", undoMove);
    sound.addEventListener("click", function () { audio.toggle(sound); });
    continueGame.addEventListener("click", function () {
      keepPlaying = true;
      finished = false;
      persist();
      draw();
      setResult("계속 플레이합니다. 4096 타일에 도전해 보세요.");
      grid.focus({ preventScroll: true });
    });
    function onKey(event) {
      const map = { ArrowUp: "위", ArrowLeft: "왼쪽", ArrowRight: "오른쪽", ArrowDown: "아래" };
      if (!map[event.key]) return;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName)) return;
      event.preventDefault();
      move(map[event.key]);
    }
    function onPointerDown(event) {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      pointerStart = { id: event.pointerId, x: event.clientX, y: event.clientY };
      grid.setPointerCapture?.(event.pointerId);
    }
    function onPointerUp(event) {
      if (!pointerStart || pointerStart.id !== event.pointerId) return;
      const dx = event.clientX - pointerStart.x;
      const dy = event.clientY - pointerStart.y;
      pointerStart = null;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 28) return;
      event.preventDefault();
      move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "오른쪽" : "왼쪽") : (dy > 0 ? "아래" : "위"));
    }
    function onPointerCancel() { pointerStart = null; }
    document.addEventListener("keydown", onKey);
    grid.addEventListener("pointerdown", onPointerDown);
    grid.addEventListener("pointerup", onPointerUp);
    grid.addEventListener("pointercancel", onPointerCancel);
    cleanup.push(function () {
      document.removeEventListener("keydown", onKey);
      audio.close();
    });
    if (restartRequested || !restore()) {
      spawnedIndex = add();
      add();
      persist();
      setResult("두 타일로 시작합니다. 방향키나 스와이프로 움직여 보세요.");
    } else {
      setResult(finished ? "저장된 게임을 불러왔습니다. 새 게임으로 다시 시작할 수 있습니다." : "저장된 게임을 이어서 시작합니다.");
    }
    draw();
  }

  function renderSnake(game, surface) {
    const size = 10;
    let snake = [];
    let dir = -1;
    let nextDir = -1;
    let food = 22;
    let bonusFood = null;
    let bonusUntil = 0;
    let score = 0;
    let eaten = 0;
    let stage = 1;
    let running = false;
    let over = false;
    let timer = null;
    let speed = 260;
    let rocks = new Set();
    let turnLocked = false;
    const audio = createTonePlayer();
    renderScore(surface, [
      { label: "점수", value: "0" },
      { label: "길이", value: "3" },
      { label: "단계", value: "1" },
      { label: "최고", value: getBest(game.id) || "-" }
    ]);
    const stats = surface.querySelectorAll(".mini-score b");
    const grid = makeGrid(size * size, "snake-grid");
    Array.from(grid.children).forEach(function (cell) { cell.tabIndex = -1; });
    grid.setAttribute("tabindex", "0");
    grid.setAttribute("role", "application");
    grid.setAttribute("aria-label", "스네이크 보드. 방향키 또는 W, A, S, D 키로 조작할 수 있습니다.");
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
    const sound = button("소리 켜짐", "button secondary sound-toggle");
    sound.setAttribute("aria-pressed", "true");
    controls.appendChild(sound);
    const guide = document.createElement("p");
    guide.className = "mini-note arcade-note";
    guide.textContent = "먹이는 10점, 잠깐 나타나는 별 먹이는 30점입니다. 5개를 먹을 때마다 속도와 장애물이 늘어납니다.";
    surface.append(controls, guide);
    function emptyCells() {
      return Array.from({ length: size * size }, function (_, index) { return index; })
        .filter(function (index) { return !snake.includes(index) && !rocks.has(index) && index !== bonusFood; });
    }
    function placeFood() {
      const empty = emptyCells();
      food = sample(empty);
    }
    function addRock() {
      const head = snake[0];
      const candidates = emptyCells().filter(function (index) {
        const rowDistance = Math.abs(Math.floor(index / size) - Math.floor(head / size));
        const colDistance = Math.abs(index % size - head % size);
        return index !== food && rowDistance + colDistance > 3;
      });
      if (candidates.length) rocks.add(sample(candidates));
    }
    function placeBonus() {
      const empty = emptyCells().filter(function (index) { return index !== food; });
      if (!empty.length) return;
      bonusFood = sample(empty);
      bonusUntil = Date.now() + 5200;
      setResult("별 먹이가 나타났습니다. 사라지기 전에 먹으면 30점입니다.");
      audio.tone(660, 0.08, "sine", 0.022);
      audio.tone(880, 0.1, "sine", 0.022, 0.08);
    }
    function turn(value) {
      if (over) return;
      if (turnLocked || value + dir === 0) return;
      nextDir = value;
      turnLocked = true;
      if (!running) toggle();
    }
    function draw() {
      if (bonusFood !== null && Date.now() > bonusUntil) bonusFood = null;
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
        } else if (index === bonusFood) {
          cell.textContent = "★";
          cell.classList.add("snake-bonus");
        } else if (rocks.has(index)) {
          cell.textContent = "×";
          cell.classList.add("snake-rock");
        }
      });
      stats[0].textContent = String(score);
      stats[1].textContent = String(snake.length);
      stats[2].textContent = String(stage);
      stats[3].textContent = String(getBest(game.id) || "-");
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
      if (running) audio.tone(360, 0.08, "sine", 0.02);
      grid.focus({ preventScroll: true });
    }
    function step() {
      if (!running || over) return;
      dir = nextDir;
      turnLocked = false;
      const head = snake[0];
      const next = head + dir;
      const wall = next < 0 || next >= size * size || (dir === 1 && head % size === size - 1) || (dir === -1 && head % size === 0);
      const hitsBody = snake.slice(0, -1).includes(next);
      if (wall || hitsBody || rocks.has(next)) {
        clearInterval(timer);
        running = false;
        over = true;
        start.textContent = "다시 시작";
        const isBest = saveBest(game.id, score, function (a, b) { return a > b; });
        audio.tone(170, 0.3, "sawtooth", 0.03);
        setResult(isBest ? `게임 종료. ${score}점으로 새 최고 기록입니다.` : `게임 종료. ${score}점, 길이 ${snake.length}입니다.`);
        draw();
        return;
      }
      snake.unshift(next);
      if (next === food) {
        eaten += 1;
        score += 10;
        audio.tone(520 + Math.min(eaten, 10) * 18, 0.07, "square", 0.022);
        if (eaten % 5 === 0) {
          stage += 1;
          speed = Math.max(105, speed - 24);
          addRock();
          restartTimer();
          setResult(`${stage}단계입니다. 이동 속도와 장애물이 늘었습니다.`);
        }
        placeFood();
        if (eaten % 4 === 0 && bonusFood === null) placeBonus();
      } else if (next === bonusFood && Date.now() <= bonusUntil) {
        score += 30;
        bonusFood = null;
        audio.tone(740, 0.08, "sine", 0.026);
        audio.tone(980, 0.14, "sine", 0.026, 0.08);
        setResult("별 먹이 획득. 보너스 30점입니다.");
      } else {
        snake.pop();
      }
      draw();
    }
    function reset() {
      clearInterval(timer);
      snake = [45, 46, 47];
      dir = -1;
      nextDir = -1;
      food = 22;
      bonusFood = null;
      score = 0;
      eaten = 0;
      stage = 1;
      speed = 260;
      rocks = new Set([33, 66]);
      running = false;
      over = false;
      turnLocked = false;
      start.disabled = false;
      start.textContent = "시작";
      draw();
    }
    function startOrToggle() {
      if (over) reset();
      toggle();
    }
    function onKey(event) {
      const map = { ArrowUp: -10, ArrowLeft: -1, ArrowRight: 1, ArrowDown: 10, w: -10, a: -1, d: 1, s: 10 };
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      if (!(key in map) && key !== " " && key !== "p") return;
      event.preventDefault();
      if ((key === " " || key === "p") && !event.repeat) startOrToggle();
      else if (key in map) turn(map[key]);
    }
    start.addEventListener("click", startOrToggle);
    sound.addEventListener("click", function () { audio.toggle(sound); });
    document.addEventListener("keydown", onKey);
    cleanup.push(function () {
      clearInterval(timer);
      document.removeEventListener("keydown", onKey);
      audio.close();
    });
    setResult("시작을 누르거나 방향키를 누르면 출발합니다.");
    reset();
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
    function hasLegalMove(source) {
      for (let index = 0; index < source.length; index += 1) {
        const row = Math.floor(index / width);
        const col = index % width;
        const candidates = [];
        if (col < width - 1) candidates.push(index + 1);
        if (row < width - 1) candidates.push(index + width);
        for (const other of candidates) {
          const temp = source[index];
          source[index] = source[other];
          source[other] = temp;
          const possible = findMatches(source).size > 0;
          source[other] = source[index];
          source[index] = temp;
          if (possible) return true;
        }
      }
      return false;
    }
    function makeBoard() {
      do {
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
      } while (!hasLegalMove(board));
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
            else if (!hasLegalMove(board)) {
              makeBoard();
              setResult("가능한 이동이 없어 새 판으로 자동 재배열했습니다.");
            } else {
              setResult(combo > 1 ? `${combo}연쇄! ${removed}개를 지웠습니다.` : `${removed}개를 지웠습니다.`);
            }
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
    let ready = false;
    let gameOver = false;
    let previewTimer = null;
    renderScore(surface, [
      { label: "채운 칸", value: "0/13" },
      { label: "상태", value: "준비" }
    ]);
    const stats = surface.querySelectorAll(".mini-score b");
    const grid = makeGrid(16, "mini-grid");
    surface.appendChild(grid);
    const controls = document.createElement("div");
    controls.className = "mini-controls";
    const preview = button("폭탄 위치 보기", "button primary");
    controls.appendChild(preview);
    surface.appendChild(controls);
    function revealBombs(disableAll) {
      Array.from(grid.children).forEach(function (cell, index) {
        if (bombs.has(index)) {
          cell.textContent = "×";
          cell.classList.add("danger");
        }
        if (disableAll) cell.disabled = true;
      });
    }
    function hideBombs() {
      Array.from(grid.children).forEach(function (cell, index) {
        if (bombs.has(index)) {
          cell.textContent = "";
          cell.classList.remove("danger");
        }
      });
      ready = true;
      stats[1].textContent = "진행";
      setResult("기억한 폭탄 3칸을 피해 나머지 칸을 채우세요.");
    }
    preview.addEventListener("click", function () {
      if (ready || gameOver) return;
      preview.disabled = true;
      stats[1].textContent = "기억";
      revealBombs(false);
      setResult("1.5초 동안 폭탄 위치를 기억하세요.");
      previewTimer = setTimeout(hideBombs, 1500);
    });
    Array.from(grid.children).forEach(function (cell, index) {
      cell.addEventListener("click", function () {
        if (!ready || gameOver || cell.disabled) {
          if (!ready && !gameOver) setResult("먼저 폭탄 위치 보기를 누르세요.");
          return;
        }
        cell.disabled = true;
        if (bombs.has(index)) {
          gameOver = true;
          stats[1].textContent = "실패";
          revealBombs(true);
          setResult("폭탄 칸을 눌렀습니다. 다시 시작해 새 판에 도전하세요.");
          return;
        }
        cell.textContent = "■";
        filled += 1;
        stats[0].textContent = `${filled}/13`;
        setResult(`${filled}/13칸을 채웠습니다.`);
        if (filled === 13) {
          gameOver = true;
          stats[1].textContent = "성공";
          Array.from(grid.children).forEach(function (item) { item.disabled = true; });
          setResult("폭탄을 모두 피해 안전 칸을 채웠습니다.");
        }
      });
    });
    cleanup.push(function () { clearTimeout(previewTimer); });
    setResult("폭탄 위치 보기를 누르고 세 칸을 기억하세요.");
  }

  function renderSequence(game, surface) {
    let sequence = [];
    let input = [];
    let level = 0;
    let showing = false;
    let timers = [];
    const colors = ["빨강", "파랑", "초록", "노랑"];
    renderScore(surface, [
      { label: "단계", value: "0" },
      { label: "입력", value: "0/0" },
      { label: "최고", value: getBest(game.id) || "-" }
    ]);
    const stats = surface.querySelectorAll(".mini-score b");
    const wrap = document.createElement("div");
    wrap.className = "choice-row simon-pad";
    colors.forEach(function (color) {
      const item = button(color, "button secondary");
      item.dataset.color = color;
      item.addEventListener("click", function () {
        if (showing || !sequence.length) return;
        pulseClass(item, "simon-flash");
        input.push(color);
        const ok = input.every(function (value, index) { return value === sequence[index]; });
        if (!ok) {
          showing = false;
          Array.from(wrap.children).forEach(function (buttonEl) { buttonEl.disabled = true; });
          saveBest(game.id, Math.max(0, level - 1), function (a, b) { return a > b; });
          setResult(`틀렸습니다. 도달 단계 ${level}.`);
          return;
        }
        sync();
        if (input.length === sequence.length) {
          setResult("정확합니다. 다음 순서를 준비합니다.");
          timers.push(setTimeout(next, 520));
        }
      });
      wrap.appendChild(item);
    });
    surface.appendChild(wrap);
    const start = button("순서 보기", "button primary full");
    surface.appendChild(start);
    function clearSequenceTimers() {
      timers.forEach(function (timer) { clearTimeout(timer); });
      timers = [];
    }
    function sync() {
      stats[0].textContent = String(level);
      stats[1].textContent = `${input.length}/${sequence.length}`;
    }
    function flashSequence() {
      showing = true;
      start.disabled = true;
      Array.from(wrap.children).forEach(function (buttonEl) { buttonEl.disabled = true; });
      setResult(`단계 ${level} 순서를 보고 기억하세요.`);
      sequence.forEach(function (color, index) {
        timers.push(setTimeout(function () {
          const item = wrap.querySelector(`[data-color="${color}"]`);
          pulseClass(item, "simon-flash");
        }, 360 + index * 520));
      });
      timers.push(setTimeout(function () {
        showing = false;
        start.disabled = false;
        Array.from(wrap.children).forEach(function (buttonEl) { buttonEl.disabled = false; });
        setResult("이제 같은 순서로 눌러 보세요.");
        sync();
      }, 360 + sequence.length * 520));
    }
    function next() {
      clearSequenceTimers();
      level += 1;
      input = [];
      sequence.push(sample(colors));
      sync();
      flashSequence();
    }
    start.addEventListener("click", next);
    cleanup.push(clearSequenceTimers);
    sync();
    setResult("순서 보기를 눌러 첫 패턴을 확인하세요.");
  }

  function renderPattern(game, surface) {
    const active = new Set(shuffle(Array.from({ length: 16 }, function (_, i) { return i; })).slice(0, 5));
    let previewTimer = null;
    let accepting = false;
    const grid = makeGrid(16, "mini-grid");
    surface.appendChild(grid);
    const start = button("패턴 보기", "button primary full");
    surface.appendChild(start);
    function begin() {
      start.disabled = true;
      Array.from(grid.children).forEach(function (cell, index) {
        if (active.has(index)) cell.classList.add("active");
      });
      setResult("3초 동안 패턴을 기억하세요.");
      previewTimer = setTimeout(function () {
      Array.from(grid.children).forEach(function (cell) { cell.classList.remove("active"); });
      accepting = true;
      let picked = new Set();
      Array.from(grid.children).forEach(function (cell, index) {
        cell.addEventListener("click", function () {
          if (!accepting) return;
          cell.classList.toggle("active");
          if (picked.has(index)) picked.delete(index);
          else picked.add(index);
          if (picked.size === active.size) {
            const ok = Array.from(active).every(function (i) { return picked.has(i); });
            if (ok) {
              accepting = false;
              Array.from(grid.children).forEach(function (item) { item.disabled = true; });
              setResult("패턴을 정확히 기억했습니다.");
            } else {
              setResult("다른 칸이 섞였습니다. 선택을 바꿔 보세요.");
            }
          }
        });
      });
      setResult("기억한 칸 5개를 다시 선택하세요.");
      }, 3000);
    }
    start.addEventListener("click", begin);
    cleanup.push(function () { clearTimeout(previewTimer); });
    setResult("패턴 보기를 누르면 3초 동안 정답 칸이 나타납니다.");
  }

  function renderWord(game, surface) {
    const words = [
      { word: "브라우저", hint: "설치 없이 게임을 실행하는 프로그램" },
      { word: "기억력", hint: "기억 타일에서 가장 중요한 능력" },
      { word: "퍼즐", hint: "규칙을 보고 천천히 푸는 게임" }
    ];
    const item = sample(words);
    surface.innerHTML = `<p class="hint-box">${item.hint}</p><input id="wordInput" type="text" placeholder="정답 입력"><button class="button primary full" id="wordSubmit">확인</button>`;
    const input = $("#wordInput", surface);
    const submit = $("#wordSubmit", surface);
    function check() {
      if (input.value.trim() === item.word) {
        input.disabled = true;
        submit.disabled = true;
        setResult("정답입니다.");
      } else {
        setResult("아직 아닙니다. 힌트를 다시 읽어 보세요.");
      }
    }
    submit.addEventListener("click", check);
    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") check();
    });
  }

  function renderHangman(game, surface) {
    const word = sample(["HANPAN", "GAME", "PUZZLE", "ARCADE"]);
    let misses = 0;
    let finished = false;
    const picked = new Set();
    const display = document.createElement("p");
    display.className = "word-display";
    surface.appendChild(display);
    const wrap = document.createElement("div");
    wrap.className = "letter-grid";
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(function (letter) {
      const item = button(letter, "mini-button");
      item.addEventListener("click", function () {
        if (finished) return;
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
      if (!shown.includes("_") || misses >= 6) {
        finished = true;
        Array.from(wrap.children).forEach(function (item) { item.disabled = true; });
        setResult(!shown.includes("_") ? "단어를 완성했습니다." : `실패했습니다. 정답은 ${word}.`);
      } else {
        setResult(`남은 실수 ${6 - misses}회.`);
      }
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
    sync();
  }

  function renderMath(game, surface) {
    let step = 0;
    let score = 0;
    let finished = false;
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
    const submit = $("#mathSubmit", surface);
    function answerQuestion() {
      if (finished) return;
      step += 1;
      if (Number(input.value) === answer) score += 1;
      if (step >= 7) {
        finished = true;
        input.disabled = true;
        submit.disabled = true;
        saveBest(game.id, score, function (a, b) { return a > b; });
        setResult(`7문제 중 ${score}개 정답입니다.`);
      } else {
        next();
      }
    }
    submit.addEventListener("click", answerQuestion);
    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") answerQuestion();
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
    let finished = false;
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
      round += 1;
      const word = sample(colors);
      const paint = sample(colors);
      correct = word.name === paint.name;
      card.textContent = word.name;
      card.style.color = paint.value;
      setResult(`${round}/10: 글자 이름과 색이 같은가요?`);
    }
    function choose(value) {
      if (finished) return;
      if (value === correct) score += 1;
      if (round >= 10) {
        finished = true;
        yes.disabled = true;
        no.disabled = true;
        saveBest(game.id, score, function (a, b) { return a > b; });
        setResult(`10문제 중 ${score}개 정답입니다.`);
      } else {
        next();
      }
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
        if (!cell.textContent || cell.classList.contains("done") || next >= order.length) return;
        if (Number(cell.textContent) === order[next]) {
          cell.classList.add("done");
          next += 1;
          if (next === order.length) {
            Array.from(grid.children).forEach(function (item) { item.disabled = true; });
            setResult("별자리를 완성했습니다.");
          }
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
    let running = false;
    let timer = null;
    renderScore(surface, [{ label: "살린 화분", value: "0" }, { label: "남은", value: "16" }]);
    const values = surface.querySelectorAll(".mini-score b");
    const grid = makeGrid(12, "mini-grid garden-grid");
    surface.appendChild(grid);
    const controls = document.createElement("div");
    controls.className = "mini-controls";
    const start = button("시작", "button primary");
    const speedSelect = createSpeedSelect();
    controls.append(start, speedSelect);
    surface.appendChild(controls);
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
        if (running && cell.classList.contains("active")) {
          score += 1;
          values[0].textContent = String(score);
          dry();
        }
      });
    });
    function finish() {
      clearInterval(timer);
      running = false;
      start.disabled = true;
      start.textContent = "종료";
      Array.from(grid.children).forEach(function (cell) {
        cell.textContent = "";
        cell.classList.remove("active");
      });
      saveBest(game.id, score, function (a, b) { return a > b; });
      setResult(`${score}개의 화분을 살렸습니다.`);
    }
    function startRound() {
      if (running) return;
      running = true;
      start.disabled = true;
      start.textContent = "진행 중";
      dry();
      setResult("마른 화분이 나타나는 즉시 물을 주세요.");
      timer = setInterval(function () {
        left -= 1;
        values[1].textContent = String(left);
        if (left <= 0) finish();
        else dry();
      }, 900 / (Number(speedSelect.value) || 1));
    }
    cleanup.push(function () { clearInterval(timer); });
    start.addEventListener("click", startRound);
    setResult("시작을 누르면 마른 화분이 나타납니다.");
  }

  function renderGamePageLauncher() {
    const picker = $("[data-game-page-picker]");
    const start = $("[data-game-page-start]");
    if (!picker) return;
    const current = picker.dataset.currentGame;
    picker.removeAttribute("onchange");
    picker.onchange = null;

    function gamePageUrl(id) {
      return `/games/${encodeURIComponent(id)}/#play-area`;
    }

    publicCatalog.forEach(function (game) {
      const option = document.createElement("option");
      option.value = game.id;
      option.textContent = `${game.title} · ${categoryNames[game.category]}`;
      option.selected = game.id === current;
      picker.appendChild(option);
    });
    function updateTarget() {
      if (!start) return;
      const selected = picker.value;
      start.href = selected === current ? "#play-area" : gamePageUrl(selected);
      start.textContent = selected === current ? "바로 시작" : "선택한 게임 시작";
    }

    function openSelectedGame() {
      const selected = picker.value;
      if (!selected || selected === current) {
        updateTarget();
        return;
      }
      if (start) {
        start.setAttribute("aria-busy", "true");
        start.textContent = "게임 여는 중";
      }
      window.location.assign(gamePageUrl(selected));
    }

    picker.addEventListener("change", openSelectedGame);
    if (start) {
      start.addEventListener("click", function (event) {
        if (picker.value !== current) {
          event.preventDefault();
          openSelectedGame();
          return;
        }
        const stage = $("#play-area");
        if (stage) stage.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
    updateTarget();
  }

  function addFlagshipChallenge(game, surface) {
    const rule = flagshipChallengeRules[game.id];
    const source = rule && surface.querySelector(rule.source || ".mini-score");
    if (!rule || !source || surface.querySelector(".flagship-challenge")) return;

    const panel = document.createElement("section");
    panel.className = "flagship-challenge";
    panel.setAttribute("aria-label", "이번 판 도전");
    panel.innerHTML = `<div class="flagship-challenge-head"><div><strong>이번 판 도전</strong><span data-challenge-summary aria-live="polite"></span></div><b data-challenge-value></b></div><div class="flagship-challenge-track" aria-hidden="true"><i data-challenge-progress></i></div><ol>${rule.tiers.map(function (tier) { return `<li><span aria-hidden="true"></span><strong>${tier[1]}</strong><small>${tier[2] || `${tier[0]}${rule.unit}`}</small></li>`; }).join("")}</ol>`;
    surface.appendChild(panel);

    function currentValue() {
      if (rule.metric === "ticMatch") {
        const matchText = source.querySelector("#ttm")?.textContent || "";
        const match = matchText.match(/X\s+(\d+)\s*:\s*(\d+)\s+O/);
        return match ? Math.max(Number(match[1]), Number(match[2])) : 0;
      }
      if (rule.metric === "connectTurns") {
        const ended = source.querySelector(".connect4-pro-status strong")?.textContent.trim() === "대국 종료";
        if (ended) return rule.tiers[rule.tiers.length - 1][0];
        const red = source.querySelectorAll('[data-mark="1"]').length;
        const yellow = source.querySelectorAll('[data-mark="2"]').length;
        return Math.max(red, yellow);
      }
      const scoreItem = Array.from(source.querySelectorAll(":scope > span")).find(function (item) {
        const label = item.querySelector("small");
        return label && label.textContent.trim() === rule.label;
      });
      const value = scoreItem && scoreItem.querySelector("b");
      const match = value && value.textContent.replace(/,/g, "").match(/\d+/);
      return match ? Number(match[0]) : 0;
    }

    function sync() {
      const current = currentValue();
      const finalTarget = rule.tiers[rule.tiers.length - 1][0];
      const nextTier = rule.tiers.find(function (tier) { return current < tier[0]; });
      const items = panel.querySelectorAll("li");
      items.forEach(function (item, index) {
        const complete = current >= rule.tiers[index][0];
        item.classList.toggle("is-complete", complete);
        item.querySelector("span").textContent = complete ? "✓" : String(index + 1);
      });
      const connectEnded = rule.metric === "connectTurns" && source.querySelector(".connect4-pro-status strong")?.textContent.trim() === "대국 종료";
      panel.querySelector("[data-challenge-value]").textContent = connectEnded ? "종료" : `${current}${rule.unit}`;
      panel.querySelector("[data-challenge-summary]").textContent = nextTier
        ? `다음 목표 · ${nextTier[1]}`
        : "세 단계 목표를 모두 달성했습니다.";
      panel.querySelector("[data-challenge-progress]").style.width = `${Math.min(100, current / finalTarget * 100)}%`;
    }

    const observer = new MutationObserver(sync);
    observer.observe(source, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["data-mark"] });
    cleanup.push(function () { observer.disconnect(); });
    sync();
  }

  function scanFlagshipChallenges() {
    document.querySelectorAll("#playSurface[data-game-id]").forEach(function (surface) {
      const game = gameById.get(surface.dataset.gameId);
      if (game) addFlagshipChallenge(game, surface);
    });
  }

  window.HANPAN_CATALOG = catalog;
  renderCatalog();
  renderPlayPage();
  renderGamePageLauncher();
  scanFlagshipChallenges();
  new MutationObserver(scanFlagshipChallenges).observe(document.documentElement, { childList: true, subtree: true });
})();
