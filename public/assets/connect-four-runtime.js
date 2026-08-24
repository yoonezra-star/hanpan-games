(function () {
  const statsKey = "hanpan-connect4-stats-v2";
  const prefsKey = "hanpan-connect4-prefs-v2";
  const enhancedRoots = new WeakSet();
  let styleAdded = false;

  function readJson(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "null");
      return value && typeof value === "object" ? value : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (error) { /* Local records are optional. */ }
  }

  function defaultStats() {
    return {
      ai: {
        easy: { wins: 0, losses: 0, draws: 0, streak: 0, bestStreak: 0 },
        normal: { wins: 0, losses: 0, draws: 0, streak: 0, bestStreak: 0 },
        hard: { wins: 0, losses: 0, draws: 0, streak: 0, bestStreak: 0 }
      },
      pvp: { p1: 0, p2: 0, draws: 0 }
    };
  }

  function loadStats() {
    const saved = readJson(statsKey, defaultStats());
    const base = defaultStats();
    ["easy", "normal", "hard"].forEach(function (level) {
      const source = saved.ai && saved.ai[level] ? saved.ai[level] : {};
      Object.keys(base.ai[level]).forEach(function (key) {
        base.ai[level][key] = Math.max(0, Number(source[key]) || 0);
      });
    });
    if (saved.pvp) {
      base.pvp.p1 = Math.max(0, Number(saved.pvp.p1) || 0);
      base.pvp.p2 = Math.max(0, Number(saved.pvp.p2) || 0);
      base.pvp.draws = Math.max(0, Number(saved.pvp.draws) || 0);
    }
    return base;
  }

  function loadPrefs() {
    const saved = readJson(prefsKey, {});
    return {
      mode: saved.mode === "pvp" ? "pvp" : "ai",
      difficulty: ["easy", "normal", "hard"].includes(saved.difficulty) ? saved.difficulty : "normal",
      humanFirst: saved.humanFirst !== false
    };
  }

  function addStyle() {
    if (styleAdded || document.getElementById("connect-four-runtime-style")) return;
    styleAdded = true;
    const style = document.createElement("style");
    style.id = "connect-four-runtime-style";
    style.textContent = `
      .connect4-pro-game { display: grid; gap: 12px; }
      .connect4-pro-settings,
      .connect4-pro-stats,
      .connect4-pro-status {
        border: 1px solid rgba(29,36,51,.14);
        border-radius: 14px;
        background: rgba(255,255,255,.62);
      }
      .connect4-pro-settings { display: flex; flex-wrap: wrap; gap: 10px 14px; align-items: end; padding: 10px 12px; }
      .connect4-pro-settings label { display: grid; gap: 5px; min-width: 132px; font-size: 12px; font-weight: 800; }
      .connect4-pro-settings select { min-height: 40px; border: 1px solid rgba(29,36,51,.2); border-radius: 9px; padding: 0 9px; background: #fff; color: inherit; font: inherit; }
      .connect4-pro-stats { display: flex; flex-wrap: wrap; gap: 8px 16px; padding: 10px 12px; font-size: 13px; }
      .connect4-pro-stats strong { font-weight: 900; }
      .connect4-pro-stats span { opacity: .82; }
      .connect4-pro-status { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 6px 12px; padding: 10px 12px; }
      .connect4-pro-status strong { font-weight: 900; }
      .connect4-pro-status span { opacity: .82; }
      .connect4-pro-board-wrap { overflow-x: auto; overscroll-behavior: contain; -webkit-overflow-scrolling: touch; padding-bottom: 3px; }
      .connect4-pro-board { width: min(100%, 610px); min-width: 326px; margin: 0 auto; outline: none; }
      .connect4-column-controls { display: grid; grid-template-columns: repeat(7, minmax(38px, 1fr)); gap: 5px; margin-bottom: 6px; }
      .connect4-column-button { min-height: 42px; border: 1px solid rgba(29,36,51,.18); border-radius: 10px; background: #fff; color: inherit; font: 800 13px/1 sans-serif; cursor: pointer; touch-action: manipulation; }
      .connect4-column-button::before { content: "▼"; display: block; margin-bottom: 3px; font-size: 12px; opacity: .5; }
      .connect4-column-button.is-selected { outline: 3px solid rgba(36,113,185,.24); border-color: rgba(36,113,185,.66); }
      .connect4-column-button:disabled { cursor: not-allowed; opacity: .38; }
      .connect4-pro-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; padding: 9px; border-radius: 18px; background: #2471b9; box-shadow: inset 0 0 0 2px rgba(0,0,0,.08); }
      .connect4-cell { aspect-ratio: 1; position: relative; border-radius: 50%; background: #fffdf7; box-shadow: inset 0 3px 8px rgba(29,36,51,.2); cursor: pointer; touch-action: manipulation; }
      .connect4-cell[data-mark="1"] { background: #df4b38; }
      .connect4-cell[data-mark="2"] { background: #ffcf5d; }
      .connect4-cell.is-last { box-shadow: inset 0 0 0 4px rgba(29,36,51,.42), inset 0 3px 8px rgba(29,36,51,.18); }
      .connect4-cell.is-winning { outline: 4px solid #1d2433; outline-offset: -5px; animation: connect4Pulse .75s ease-in-out infinite alternate; }
      .connect4-cell.is-preview::after { content: ""; position: absolute; inset: 16%; border-radius: 50%; border: 3px dashed rgba(29,36,51,.34); }
      .connect4-pro-actions { display: flex; flex-wrap: wrap; gap: 8px; }
      .connect4-pro-note { margin: 0; font-size: 13px; opacity: .78; }
      @keyframes connect4Pulse { from { transform: scale(.92); } to { transform: scale(1); } }
      @media (pointer: coarse) {
        .connect4-column-button { min-height: 48px; font-size: 14px; }
        .connect4-pro-actions { position: sticky; bottom: 8px; z-index: 24; padding: 8px; border-radius: 14px; background: rgba(255,250,240,.95); box-shadow: 0 8px 24px rgba(29,36,51,.16); backdrop-filter: blur(8px); }
        .connect4-pro-actions .button { min-height: 44px; }
      }
    `;
    document.head.appendChild(style);
  }

  function createTonePlayer() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const context = AudioContextClass ? new AudioContextClass() : null;
    let muted = false;
    return {
      tone: function (frequency, duration) {
        if (!context || muted) return;
        try {
          if (context.state === "suspended") context.resume();
          const oscillator = context.createOscillator();
          const gain = context.createGain();
          oscillator.type = "sine";
          oscillator.frequency.value = frequency;
          gain.gain.setValueAtTime(0.026, context.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
          oscillator.connect(gain);
          gain.connect(context.destination);
          oscillator.start();
          oscillator.stop(context.currentTime + duration);
        } catch (error) { /* Sound is optional. */ }
      },
      toggle: function (button) {
        muted = !muted;
        button.textContent = muted ? "소리 꺼짐" : "소리 켜짐";
        button.setAttribute("aria-pressed", String(!muted));
      },
      close: function () {
        if (context && context.state !== "closed") {
          try { context.close(); } catch (error) { /* Optional cleanup. */ }
        }
      }
    };
  }

  function setupSurface(surface) {
    if (!surface || surface.querySelector(".connect4-pro-game")) return false;
    const legacyGrid = surface.querySelector(".connect-grid");
    const isConnect = surface.dataset.gameId === "connect-four" || Boolean(legacyGrid);
    if (!isConnect) return false;

    addStyle();
    surface.innerHTML = "";
    surface.dataset.gameId = "connect-four";
    surface.classList.add("connect-four-game");

    const rows = 6;
    const cols = 7;
    let board = Array.from({ length: rows }, function () { return Array(cols).fill(0); });
    let mode;
    let difficulty;
    let humanFirst;
    let turn = 1;
    let humanMark = 1;
    let aiMark = 2;
    let gameOver = false;
    let locked = false;
    let selectedColumn = 3;
    let winningLine = [];
    let lastMove = null;
    let aiTimer = null;
    let stats = loadStats();
    const prefs = loadPrefs();
    mode = prefs.mode;
    difficulty = prefs.difficulty;
    humanFirst = prefs.humanFirst;
    const audio = createTonePlayer();

    const root = document.createElement("div");
    root.className = "connect4-pro-game";
    root.tabIndex = 0;
    root.setAttribute("role", "application");
    root.setAttribute("aria-label", "사목 게임. 좌우 방향키로 열을 고르고 Enter 또는 Space로 말을 놓습니다. 숫자 1부터 7로 열을 바로 선택할 수 있습니다.");
    enhancedRoots.add(root);

    const settings = document.createElement("div");
    settings.className = "connect4-pro-settings";
    const modeLabel = document.createElement("label");
    modeLabel.textContent = "대전 방식";
    const modeSelect = document.createElement("select");
    modeSelect.innerHTML = '<option value="ai">AI 대전</option><option value="pvp">2인 대전</option>';
    modeLabel.appendChild(modeSelect);
    const difficultyLabel = document.createElement("label");
    difficultyLabel.textContent = "AI 난이도";
    const difficultySelect = document.createElement("select");
    difficultySelect.innerHTML = '<option value="easy">쉬움</option><option value="normal">보통</option><option value="hard">어려움</option>';
    difficultyLabel.appendChild(difficultySelect);
    const firstLabel = document.createElement("label");
    firstLabel.textContent = "선공";
    const firstSelect = document.createElement("select");
    firstSelect.innerHTML = '<option value="human">내가 선공</option><option value="ai">AI 선공</option>';
    firstLabel.appendChild(firstSelect);
    settings.append(modeLabel, difficultyLabel, firstLabel);

    const score = document.createElement("div");
    score.className = "connect4-pro-stats";
    score.setAttribute("aria-live", "polite");
    const status = document.createElement("div");
    status.className = "connect4-pro-status";
    status.setAttribute("aria-live", "polite");

    const boardWrap = document.createElement("div");
    boardWrap.className = "connect4-pro-board-wrap";
    const boardBox = document.createElement("div");
    boardBox.className = "connect4-pro-board";
    const columnControls = document.createElement("div");
    columnControls.className = "connect4-column-controls";
    columnControls.setAttribute("aria-label", "말을 떨어뜨릴 열 선택");
    const columnButtons = Array.from({ length: cols }, function (_, col) {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "connect4-column-button";
      item.textContent = String(col + 1);
      item.setAttribute("aria-label", `${col + 1}열에 말 놓기`);
      item.addEventListener("click", function () { playColumn(col); });
      item.addEventListener("focus", function () { selectedColumn = col; renderBoard(); });
      return item;
    });
    columnControls.append(...columnButtons);

    const grid = document.createElement("div");
    grid.className = "connect4-pro-grid";
    grid.setAttribute("role", "grid");
    grid.setAttribute("aria-label", "6행 7열 사목 보드");
    const cells = [];
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const cell = document.createElement("div");
        cell.className = "connect4-cell";
        cell.setAttribute("role", "gridcell");
        cell.dataset.row = String(row);
        cell.dataset.col = String(col);
        cell.addEventListener("click", function () { playColumn(col); });
        grid.appendChild(cell);
        cells.push(cell);
      }
    }
    boardBox.append(columnControls, grid);
    boardWrap.appendChild(boardBox);

    const actions = document.createElement("div");
    actions.className = "connect4-pro-actions";
    const newRound = document.createElement("button");
    newRound.type = "button";
    newRound.className = "button primary";
    newRound.textContent = "새 판";
    const switchFirst = document.createElement("button");
    switchFirst.type = "button";
    switchFirst.className = "button secondary";
    switchFirst.textContent = "선공 바꾸기";
    const sound = document.createElement("button");
    sound.type = "button";
    sound.className = "button secondary sound-toggle";
    sound.textContent = "소리 켜짐";
    sound.setAttribute("aria-pressed", "true");
    actions.append(newRound, switchFirst, sound);
    const note = document.createElement("p");
    note.className = "connect4-pro-note";
    note.textContent = "방향키 ← → 열 선택 · Enter/Space 놓기 · 숫자 1~7 바로 놓기 · R 새 판. AI 어려움은 더 깊게 수를 읽습니다.";

    root.append(settings, score, status, boardWrap, actions, note);
    surface.appendChild(root);

    function savePrefs() {
      writeJson(prefsKey, { mode: mode, difficulty: difficulty, humanFirst: humanFirst });
    }

    function availableColumns(state) {
      const result = [];
      for (let col = 0; col < cols; col += 1) if (state[0][col] === 0) result.push(col);
      return result;
    }

    function dropOn(state, col, mark) {
      for (let row = rows - 1; row >= 0; row -= 1) {
        if (state[row][col] === 0) {
          state[row][col] = mark;
          return { row: row, col: col };
        }
      }
      return null;
    }

    function winningCells(state, mark) {
      const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          if (state[row][col] !== mark) continue;
          for (let index = 0; index < directions.length; index += 1) {
            const dr = directions[index][0];
            const dc = directions[index][1];
            const line = [];
            for (let step = 0; step < 4; step += 1) {
              const rr = row + dr * step;
              const cc = col + dc * step;
              if (rr < 0 || rr >= rows || cc < 0 || cc >= cols || state[rr][cc] !== mark) break;
              line.push([rr, cc]);
            }
            if (line.length === 4) return line;
          }
        }
      }
      return [];
    }

    function winner(state) {
      if (winningCells(state, 1).length) return 1;
      if (winningCells(state, 2).length) return 2;
      return availableColumns(state).length ? 0 : 3;
    }

    function scoreWindow(windowValues, mark) {
      const opponent = mark === 1 ? 2 : 1;
      const mine = windowValues.filter(function (value) { return value === mark; }).length;
      const theirs = windowValues.filter(function (value) { return value === opponent; }).length;
      const empty = 4 - mine - theirs;
      if (mine === 4) return 100000;
      if (mine === 3 && empty === 1) return 140;
      if (mine === 2 && empty === 2) return 18;
      if (theirs === 3 && empty === 1) return -170;
      if (theirs === 2 && empty === 2) return -16;
      return 0;
    }

    function evaluate(state, mark) {
      let total = 0;
      for (let row = 0; row < rows; row += 1) if (state[row][3] === mark) total += 8;
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col <= cols - 4; col += 1) total += scoreWindow([state[row][col], state[row][col + 1], state[row][col + 2], state[row][col + 3]], mark);
      }
      for (let col = 0; col < cols; col += 1) {
        for (let row = 0; row <= rows - 4; row += 1) total += scoreWindow([state[row][col], state[row + 1][col], state[row + 2][col], state[row + 3][col]], mark);
      }
      for (let row = 0; row <= rows - 4; row += 1) {
        for (let col = 0; col <= cols - 4; col += 1) total += scoreWindow([state[row][col], state[row + 1][col + 1], state[row + 2][col + 2], state[row + 3][col + 3]], mark);
      }
      for (let row = 0; row <= rows - 4; row += 1) {
        for (let col = 3; col < cols; col += 1) total += scoreWindow([state[row][col], state[row + 1][col - 1], state[row + 2][col - 2], state[row + 3][col - 3]], mark);
      }
      return total;
    }

    function cloneBoard(state) {
      return state.map(function (row) { return row.slice(); });
    }

    function orderedColumns(state) {
      return [3, 2, 4, 1, 5, 0, 6].filter(function (col) { return state[0][col] === 0; });
    }

    function minimax(state, depth, alpha, beta, maximizing) {
      const result = winner(state);
      if (result === aiMark) return 1000000 + depth;
      if (result === humanMark) return -1000000 - depth;
      if (result === 3) return 0;
      if (depth <= 0) return evaluate(state, aiMark);
      const moves = orderedColumns(state);
      if (maximizing) {
        let value = -Infinity;
        for (let index = 0; index < moves.length; index += 1) {
          const next = cloneBoard(state);
          dropOn(next, moves[index], aiMark);
          value = Math.max(value, minimax(next, depth - 1, alpha, beta, false));
          alpha = Math.max(alpha, value);
          if (alpha >= beta) break;
        }
        return value;
      }
      let value = Infinity;
      for (let index = 0; index < moves.length; index += 1) {
        const next = cloneBoard(state);
        dropOn(next, moves[index], humanMark);
        value = Math.min(value, minimax(next, depth - 1, alpha, beta, true));
        beta = Math.min(beta, value);
        if (alpha >= beta) break;
      }
      return value;
    }

    function immediateMove(mark) {
      const moves = orderedColumns(board);
      for (let index = 0; index < moves.length; index += 1) {
        const next = cloneBoard(board);
        dropOn(next, moves[index], mark);
        if (winningCells(next, mark).length) return moves[index];
      }
      return null;
    }

    function chooseAiMove() {
      const winNow = immediateMove(aiMark);
      if (winNow !== null) return winNow;
      const blockNow = immediateMove(humanMark);
      if (blockNow !== null) return blockNow;
      const moves = orderedColumns(board);
      if (!moves.length) return null;
      if (difficulty === "easy") {
        const pool = moves.length > 3 && Math.random() < 0.62 ? moves.slice(0, 4) : moves;
        return pool[Math.floor(Math.random() * pool.length)];
      }
      const depth = difficulty === "hard" ? 5 : 3;
      let best = moves[0];
      let bestScore = -Infinity;
      for (let index = 0; index < moves.length; index += 1) {
        const next = cloneBoard(board);
        dropOn(next, moves[index], aiMark);
        const value = minimax(next, depth - 1, -Infinity, Infinity, false);
        if (value > bestScore) {
          bestScore = value;
          best = moves[index];
        }
      }
      return best;
    }

    function currentRecord() {
      return stats.ai[difficulty];
    }

    function updateScore() {
      if (mode === "ai") {
        const record = currentRecord();
        const total = record.wins + record.losses + record.draws;
        const winRate = total ? Math.round(record.wins / total * 100) : 0;
        score.innerHTML = `<strong>${difficulty === "easy" ? "쉬움" : difficulty === "hard" ? "어려움" : "보통"} AI</strong><span>승 ${record.wins}</span><span>패 ${record.losses}</span><span>무 ${record.draws}</span><span>승률 ${winRate}%</span><span>연승 ${record.streak} · 최고 ${record.bestStreak}</span>`;
      } else {
        score.innerHTML = `<strong>2인 대전</strong><span>빨강 ${stats.pvp.p1}승</span><span>노랑 ${stats.pvp.p2}승</span><span>무승부 ${stats.pvp.draws}</span>`;
      }
    }

    function renderBoard() {
      cells.forEach(function (cell, index) {
        const row = Math.floor(index / cols);
        const col = index % cols;
        const mark = board[row][col];
        cell.dataset.mark = String(mark);
        cell.classList.toggle("is-last", Boolean(lastMove && lastMove.row === row && lastMove.col === col));
        cell.classList.toggle("is-winning", winningLine.some(function (pair) { return pair[0] === row && pair[1] === col; }));
        cell.classList.toggle("is-preview", !gameOver && !locked && col === selectedColumn && mark === 0 && (row === rows - 1 || board[row + 1][col] !== 0));
        const label = mark === 1 ? "빨강 말" : mark === 2 ? "노랑 말" : "빈칸";
        cell.setAttribute("aria-label", `${row + 1}행 ${col + 1}열 ${label}`);
      });
      columnButtons.forEach(function (button, col) {
        button.disabled = gameOver || locked || board[0][col] !== 0 || (mode === "ai" && turn !== humanMark);
        button.classList.toggle("is-selected", col === selectedColumn);
      });
      modeSelect.value = mode;
      difficultySelect.value = difficulty;
      firstSelect.value = humanFirst ? "human" : "ai";
      difficultySelect.disabled = mode !== "ai";
      firstSelect.disabled = mode !== "ai";
      switchFirst.disabled = mode !== "ai";
      updateScore();
    }

    function setStatus(message) {
      let title;
      if (gameOver) title = "대국 종료";
      else if (locked) title = "AI 생각 중";
      else if (mode === "ai") title = turn === humanMark ? "내 차례" : "AI 차례";
      else title = turn === 1 ? "빨강 차례" : "노랑 차례";
      status.innerHTML = `<strong>${title}</strong><span>${message}</span>`;
      const result = document.getElementById("playResult");
      if (result) result.textContent = message;
    }

    function finish(result) {
      gameOver = true;
      locked = false;
      clearTimeout(aiTimer);
      if (result === 3) {
        if (mode === "ai") {
          const record = currentRecord();
          record.draws += 1;
          record.streak = 0;
        } else stats.pvp.draws += 1;
        setStatus("42칸이 모두 차 무승부입니다. 새 판으로 다시 도전하세요.");
        audio.tone(310, .14);
      } else {
        winningLine = winningCells(board, result);
        if (mode === "ai") {
          const record = currentRecord();
          if (result === humanMark) {
            record.wins += 1;
            record.streak += 1;
            record.bestStreak = Math.max(record.bestStreak, record.streak);
            setStatus(`네 개 연결 완성. ${difficulty === "hard" ? "어려움" : difficulty === "easy" ? "쉬움" : "보통"} AI를 이겼습니다.`);
            audio.tone(660, .12);
            window.setTimeout(function () { audio.tone(880, .18); }, 100);
          } else {
            record.losses += 1;
            record.streak = 0;
            setStatus("AI가 네 개를 연결했습니다. 패배했습니다.");
            audio.tone(180, .2);
          }
        } else {
          if (result === 1) stats.pvp.p1 += 1;
          else stats.pvp.p2 += 1;
          setStatus(`${result === 1 ? "빨강" : "노랑"}이 네 개를 연결해 승리했습니다.`);
          audio.tone(result === 1 ? 620 : 720, .16);
        }
      }
      writeJson(statsKey, stats);
      renderBoard();
    }

    function afterMove(mark) {
      const result = winner(board);
      if (result) {
        finish(result);
        return;
      }
      turn = mark === 1 ? 2 : 1;
      renderBoard();
      if (mode === "ai" && turn === aiMark) queueAi();
      else setStatus(mode === "ai" ? "열을 골라 네 개 연결을 준비하세요." : `${turn === 1 ? "빨강" : "노랑"} 차례입니다.`);
    }

    function place(col, mark) {
      if (gameOver || locked || col < 0 || col >= cols || board[0][col] !== 0) return false;
      const placed = dropOn(board, col, mark);
      if (!placed) return false;
      lastMove = placed;
      selectedColumn = col;
      audio.tone(mark === 1 ? 420 : 520, .055);
      afterMove(mark);
      return true;
    }

    function playColumn(col) {
      root.focus({ preventScroll: true });
      selectedColumn = col;
      if (mode === "ai") {
        if (turn !== humanMark || locked) {
          renderBoard();
          return;
        }
        place(col, humanMark);
      } else place(col, turn);
    }

    function queueAi() {
      if (gameOver || mode !== "ai" || turn !== aiMark) return;
      locked = true;
      renderBoard();
      setStatus("AI가 공격과 방어 후보를 계산하고 있습니다.");
      clearTimeout(aiTimer);
      aiTimer = window.setTimeout(function () {
        if (gameOver || mode !== "ai" || turn !== aiMark) return;
        const col = chooseAiMove();
        locked = false;
        if (col === null) {
          finish(3);
          return;
        }
        place(col, aiMark);
      }, difficulty === "hard" ? 360 : 220);
    }

    function resetRound(message) {
      clearTimeout(aiTimer);
      board = Array.from({ length: rows }, function () { return Array(cols).fill(0); });
      gameOver = false;
      locked = false;
      winningLine = [];
      lastMove = null;
      selectedColumn = 3;
      if (mode === "ai") {
        humanMark = humanFirst ? 1 : 2;
        aiMark = humanFirst ? 2 : 1;
        turn = 1;
      } else {
        humanMark = 1;
        aiMark = 2;
        turn = 1;
      }
      renderBoard();
      setStatus(message || (mode === "ai" ? (humanFirst ? "내가 선공입니다. 첫 열을 고르세요." : "AI가 선공합니다.") : "빨강이 먼저 시작합니다."));
      if (mode === "ai" && !humanFirst) queueAi();
    }

    modeSelect.addEventListener("change", function () {
      mode = modeSelect.value === "pvp" ? "pvp" : "ai";
      savePrefs();
      resetRound(mode === "ai" ? "AI 대전으로 새 판을 시작했습니다." : "2인 대전으로 새 판을 시작했습니다. 빨강이 먼저입니다.");
    });
    difficultySelect.addEventListener("change", function () {
      difficulty = ["easy", "normal", "hard"].includes(difficultySelect.value) ? difficultySelect.value : "normal";
      savePrefs();
      resetRound(`${difficulty === "easy" ? "쉬움" : difficulty === "hard" ? "어려움" : "보통"} AI로 새 판을 시작했습니다.`);
    });
    firstSelect.addEventListener("change", function () {
      humanFirst = firstSelect.value !== "ai";
      savePrefs();
      resetRound(humanFirst ? "내가 선공으로 시작합니다." : "AI가 선공으로 시작합니다.");
    });
    newRound.addEventListener("click", function () { resetRound("새 판을 시작했습니다."); });
    switchFirst.addEventListener("click", function () {
      humanFirst = !humanFirst;
      savePrefs();
      resetRound(humanFirst ? "내가 선공으로 바꿨습니다." : "AI 선공으로 바꿨습니다.");
    });
    sound.addEventListener("click", function () { audio.toggle(sound); });

    root.addEventListener("keydown", function (event) {
      if (event.target && /^(SELECT|INPUT|TEXTAREA)$/.test(event.target.tagName)) return;
      if (event.key >= "1" && event.key <= "7") {
        event.preventDefault();
        playColumn(Number(event.key) - 1);
        return;
      }
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        const direction = event.key === "ArrowLeft" ? -1 : 1;
        let next = selectedColumn;
        for (let count = 0; count < cols; count += 1) {
          next = (next + direction + cols) % cols;
          if (board[0][next] === 0) break;
        }
        selectedColumn = next;
        renderBoard();
        columnButtons[selectedColumn].focus({ preventScroll: true });
        return;
      }
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        playColumn(selectedColumn);
        return;
      }
      if (event.key.toLowerCase() === "r") {
        event.preventDefault();
        resetRound("키보드로 새 판을 시작했습니다.");
      }
    });

    const cleanupObserver = new MutationObserver(function () {
      if (root.isConnected) return;
      clearTimeout(aiTimer);
      audio.close();
      cleanupObserver.disconnect();
    });
    cleanupObserver.observe(document.documentElement, { childList: true, subtree: true });

    resetRound();
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
