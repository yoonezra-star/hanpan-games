(function () {
  const SAVE_KEY = "hanpan-blockfill-save-v2";
  const RECORD_KEY = "hanpan-blockfill-records-v2";
  const rowsByStage = [5, 6, 6, 6, 6];
  const stageMaps = [
    ["AAABB", "ACCBB", "DCXEE", "DCFFE", "DDFEE"],
    ["AAABBB", "ACCBBB", "ACCDDD", "EECDXD", "EEFFFX", "EEFFGG"],
    ["AABBCC", "AABBCC", "DDDDEE", "DFXXEE", "FFGGGE", "FFGGGE"],
    ["AAABBB", "ACCDBB", "ACCDDB", "EEFXDG", "EEFFGG", "EEFFGG"],
    ["AAABBC", "ADDBBC", "ADDEEC", "FFXEEG", "FFHHGG", "FFHHGG"]
  ];
  const hazardLabels = ["폭탄", "폭탄", "금지", "폭탄", "금지"];
  let styleAdded = false;

  function readJson(key, fallback) {
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || "null");
      return parsed && typeof parsed === "object" ? parsed : fallback;
    } catch (error) { return fallback; }
  }
  function writeJson(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (error) { /* optional */ } }
  function removeKey(key) { try { localStorage.removeItem(key); } catch (error) { /* ignore */ } }
  function formatTime(seconds) {
    const value = Math.max(0, Math.floor(seconds || 0));
    return `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
  }
  function normalize(cells) {
    const minR = Math.min.apply(null, cells.map(function (cell) { return cell[0]; }));
    const minC = Math.min.apply(null, cells.map(function (cell) { return cell[1]; }));
    return cells.map(function (cell) { return [cell[0] - minR, cell[1] - minC]; }).sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
  }
  function rotateCells(cells, turns) {
    let current = normalize(cells);
    for (let t = 0; t < ((turns % 4) + 4) % 4; t += 1) current = normalize(current.map(function (cell) { return [cell[1], -cell[0]]; }));
    return current;
  }
  function parseStage(stageIndex) {
    const map = stageMaps[stageIndex];
    const size = rowsByStage[stageIndex];
    const groups = {};
    const hazards = new Set();
    map.forEach(function (line, r) {
      Array.from(line).forEach(function (mark, c) {
        if (mark === "X") hazards.add(r * size + c);
        else {
          if (!groups[mark]) groups[mark] = [];
          groups[mark].push([r, c]);
        }
      });
    });
    const pieces = Object.keys(groups).sort().map(function (id) {
      const absolute = groups[id];
      const minR = Math.min.apply(null, absolute.map(function (cell) { return cell[0]; }));
      const minC = Math.min.apply(null, absolute.map(function (cell) { return cell[1]; }));
      return { id: id, cells: normalize(absolute), solutionAnchor: minR * size + minC, area: absolute.length };
    });
    return { size: size, map: map, hazards: hazards, pieces: pieces, label: hazardLabels[stageIndex] };
  }
  function stageArea(stage) { return stage.size * stage.size - stage.hazards.size; }

  function addStyle() {
    if (styleAdded) return;
    styleAdded = true;
    const style = document.createElement("style");
    style.textContent = `
      .blockfill-runtime-game{--bf-accent:#397a65}
      .blockfill-runtime-root{display:grid;gap:13px;max-width:860px;margin:0 auto}
      .blockfill-head,.blockfill-actions,.blockfill-records{display:flex;gap:9px;flex-wrap:wrap;align-items:center;justify-content:center}
      .blockfill-head label{display:grid;gap:4px;font-weight:800;min-width:150px}.blockfill-head select{min-height:42px;border:1px solid rgba(29,36,51,.22);border-radius:10px;padding:0 11px;background:#fffdf7;font:inherit}
      .blockfill-status{text-align:center;padding:10px 12px;border-radius:12px;background:rgba(57,122,101,.09);display:grid;gap:3px}.blockfill-status span{font-size:.9rem;opacity:.8}
      .blockfill-workspace{display:grid;grid-template-columns:minmax(250px,1fr) minmax(180px,280px);gap:16px;align-items:start}
      .blockfill-board{--bf-size:5;display:grid;grid-template-columns:repeat(var(--bf-size),1fr);gap:5px;width:min(100%,470px);aspect-ratio:1;padding:7px;border:2px solid rgba(29,36,51,.2);border-radius:16px;background:#e9e1d1;touch-action:none;user-select:none}
      .blockfill-cell{position:relative;min-width:0;min-height:0;border:1px solid rgba(29,36,51,.18);border-radius:8px;background:#fffaf0}
      .blockfill-cell.is-hazard{display:grid;place-items:center;background:repeating-linear-gradient(135deg,#eee4d7,#eee4d7 6px,#dfd2c1 6px,#dfd2c1 12px);font-size:clamp(.85rem,3vw,1.4rem)}
      .blockfill-cell.is-filled{background:#dff1e9;border-color:#65a28b}.blockfill-cell.is-hint{outline:4px solid #ffca57;outline-offset:-4px;animation:bfHint .7s ease-in-out 2}.blockfill-cell.is-preview{outline:3px dashed #397a65;outline-offset:-4px}
      .blockfill-tray{display:grid;gap:9px}.blockfill-piece{display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:center;min-height:58px;padding:8px 10px;border:1px solid rgba(29,36,51,.18);border-radius:12px;background:#fffaf0;cursor:pointer;touch-action:none;text-align:left}.blockfill-piece.is-selected{outline:3px solid #397a65}.blockfill-piece.is-placed{opacity:.48}.blockfill-piece strong{font-size:.9rem}.blockfill-piece small{opacity:.7}
      .blockfill-shape{display:grid;gap:2px;align-self:center}.blockfill-dot{width:14px;height:14px;border-radius:3px;background:#6aa78f}.blockfill-dot.is-void{visibility:hidden}
      .blockfill-records{font-size:.88rem}.blockfill-records span,.blockfill-records strong{padding:6px 9px;border-radius:999px;background:rgba(29,36,51,.06)}
      .blockfill-note{text-align:center;margin:0}
      @keyframes bfHint{50%{transform:scale(.94)}}
      @media(max-width:760px){.blockfill-workspace{grid-template-columns:1fr}.blockfill-board{width:min(100%,390px);margin:0 auto}.blockfill-tray{grid-template-columns:repeat(2,minmax(0,1fr))}.blockfill-piece{grid-template-columns:auto 1fr;padding:7px}.blockfill-piece small{display:none}.blockfill-actions{position:sticky;bottom:8px;z-index:6;padding:8px;border-radius:14px;background:rgba(255,253,247,.95);box-shadow:0 8px 24px rgba(29,36,51,.14)}.blockfill-actions .button{min-height:44px;flex:1 1 100px}}
      @media(max-width:420px){.blockfill-tray{grid-template-columns:1fr 1fr}.blockfill-dot{width:12px;height:12px}}
      @media(prefers-reduced-motion:reduce){.blockfill-cell.is-hint{animation:none}}
    `;
    document.head.appendChild(style);
  }

  function setup(surface) {
    if (surface.querySelector(".blockfill-runtime-root")) return false;
    addStyle();
    surface.classList.add("blockfill-runtime-game");
    surface.innerHTML = "";

    let record = Object.assign({ unlocked: 1, clears: 0, bestStage: 1, bestTime: {}, bestActions: {} }, readJson(RECORD_KEY, {}));
    record.unlocked = Math.max(1, Math.min(stageMaps.length, Number(record.unlocked) || 1));
    let stageNumber = 1;
    let stage = parseStage(0);
    let placements = {};
    let rotations = {};
    let selected = null;
    let history = [];
    let actionsCount = 0;
    let hintsUsed = 0;
    let started = false;
    let completed = false;
    let elapsedBase = 0;
    let runStartedAt = 0;
    let hintTimer = null;
    let drag = null;

    const root = document.createElement("div"); root.className = "blockfill-runtime-root";
    const hud = document.createElement("div"); hud.className = "mini-score";
    const labels = ["스테이지", "채움", "조각", "시간", "행동"];
    const hudValues = labels.map(function (label) { const span = document.createElement("span"); const b = document.createElement("b"); b.textContent = "-"; const small = document.createElement("small"); small.textContent = label; span.append(b, small); hud.appendChild(span); return b; });
    const head = document.createElement("div"); head.className = "blockfill-head";
    const stageLabel = document.createElement("label"); stageLabel.innerHTML = "<span>스테이지</span>";
    const stageSelect = document.createElement("select"); stageLabel.appendChild(stageSelect); head.appendChild(stageLabel);
    const status = document.createElement("div"); status.className = "blockfill-status"; status.setAttribute("aria-live", "polite");
    const workspace = document.createElement("div"); workspace.className = "blockfill-workspace";
    const boardEl = document.createElement("div"); boardEl.className = "blockfill-board"; boardEl.setAttribute("role", "grid"); boardEl.setAttribute("aria-label", "블록 채우기 퍼즐 보드");
    const tray = document.createElement("div"); tray.className = "blockfill-tray"; workspace.append(boardEl, tray);
    const actions = document.createElement("div"); actions.className = "mini-controls blockfill-actions";
    const rotateButton = document.createElement("button"); rotateButton.type = "button"; rotateButton.className = "button secondary"; rotateButton.textContent = "회전";
    const undoButton = document.createElement("button"); undoButton.type = "button"; undoButton.className = "button secondary"; undoButton.textContent = "되돌리기";
    const hintButton = document.createElement("button"); hintButton.type = "button"; hintButton.className = "button secondary"; hintButton.textContent = "힌트";
    const resetButton = document.createElement("button"); resetButton.type = "button"; resetButton.className = "button primary"; resetButton.textContent = "초기화";
    actions.append(rotateButton, undoButton, hintButton, resetButton);
    const records = document.createElement("div"); records.className = "blockfill-records";
    const note = document.createElement("p"); note.className = "mini-note blockfill-note"; note.textContent = "조각을 선택하고 보드 칸을 눌러 놓습니다. R=회전, U=되돌리기, H=힌트.";
    root.append(hud, head, status, workspace, actions, records, note); surface.appendChild(root);

    function announce(title, text) { status.innerHTML = `<strong>${title}</strong><span>${text}</span>`; const result = document.querySelector("#playResult"); if (result) result.textContent = `${title} · ${text}`; }
    function saveRecord() { writeJson(RECORD_KEY, record); }
    function currentElapsedMs() { return elapsedBase + (runStartedAt ? Date.now() - runStartedAt : 0); }
    function currentSeconds() { return Math.floor(currentElapsedMs() / 1000); }
    function pieceById(id) { return stage.pieces.find(function (piece) { return piece.id === id; }); }
    function placedCount() { return Object.keys(placements).length; }
    function filledCount() { return Object.values(placements).reduce(function (total, item) { const piece = pieceById(item.pieceId); return total + (piece ? piece.area : 0); }, 0); }

    function placementCells(piece, anchor, rotation) {
      const ar = Math.floor(anchor / stage.size), ac = anchor % stage.size;
      return rotateCells(piece.cells, rotation).map(function (cell) { return [ar + cell[0], ac + cell[1]]; });
    }
    function boardOwners(exceptId) {
      const owners = Array(stage.size * stage.size).fill(null);
      Object.keys(placements).forEach(function (id) {
        if (id === exceptId) return;
        const item = placements[id], piece = pieceById(id);
        if (!piece) return;
        placementCells(piece, item.anchor, item.rotation).forEach(function (cell) {
          const r = cell[0], c = cell[1];
          if (r >= 0 && c >= 0 && r < stage.size && c < stage.size) owners[r * stage.size + c] = id;
        });
      });
      return owners;
    }
    function canPlace(pieceId, anchor, rotation) {
      const piece = pieceById(pieceId); if (!piece) return false;
      const owners = boardOwners(pieceId);
      const cells = placementCells(piece, anchor, rotation);
      return cells.every(function (cell) {
        const r = cell[0], c = cell[1];
        if (r < 0 || c < 0 || r >= stage.size || c >= stage.size) return false;
        const index = r * stage.size + c;
        return !stage.hazards.has(index) && !owners[index];
      });
    }
    function isSolved() { return filledCount() === stageArea(stage) && placedCount() === stage.pieces.length; }

    function drawShape(container, piece, rotation) {
      container.innerHTML = "";
      const cells = rotateCells(piece.cells, rotation);
      const maxR = Math.max.apply(null, cells.map(function (cell) { return cell[0]; }));
      const maxC = Math.max.apply(null, cells.map(function (cell) { return cell[1]; }));
      container.style.gridTemplateColumns = `repeat(${maxC + 1},14px)`;
      const set = new Set(cells.map(function (cell) { return `${cell[0]}:${cell[1]}`; }));
      for (let r = 0; r <= maxR; r += 1) for (let c = 0; c <= maxC; c += 1) { const dot = document.createElement("span"); dot.className = "blockfill-dot" + (set.has(`${r}:${c}`) ? "" : " is-void"); container.appendChild(dot); }
    }

    function updateStageOptions() {
      stageSelect.innerHTML = "";
      for (let i = 1; i <= stageMaps.length; i += 1) {
        const option = document.createElement("option"); option.value = String(i); option.textContent = `${i}단계${i > record.unlocked ? " · 잠김" : ""}`; option.disabled = i > record.unlocked; stageSelect.appendChild(option);
      }
      stageSelect.value = String(stageNumber);
    }
    function updateHud() {
      hudValues[0].textContent = `${stageNumber}/${stageMaps.length}`;
      hudValues[1].textContent = `${filledCount()}/${stageArea(stage)}`;
      hudValues[2].textContent = `${placedCount()}/${stage.pieces.length}`;
      hudValues[3].textContent = formatTime(currentSeconds());
      hudValues[4].textContent = String(actionsCount);
      const bestTime = record.bestTime[String(stageNumber)];
      const bestActions = record.bestActions[String(stageNumber)];
      records.innerHTML = `<strong>기록</strong><span>클리어 ${record.clears}</span><span>최고 단계 ${record.bestStage}</span><span>최단 ${bestTime === undefined ? "-" : formatTime(bestTime)}</span><span>최소 행동 ${bestActions === undefined ? "-" : bestActions}</span><span>힌트 ${hintsUsed}</span>`;
      rotateButton.disabled = !selected || completed;
      undoButton.disabled = !history.length || completed;
      hintButton.disabled = completed;
    }

    function renderBoard(hintCells) {
      const owners = boardOwners();
      boardEl.innerHTML = ""; boardEl.style.setProperty("--bf-size", String(stage.size));
      for (let index = 0; index < stage.size * stage.size; index += 1) {
        const cell = document.createElement("button"); cell.type = "button"; cell.className = "blockfill-cell"; cell.dataset.index = String(index); cell.setAttribute("role", "gridcell");
        if (stage.hazards.has(index)) {
          cell.classList.add("is-hazard"); cell.disabled = true; cell.textContent = stage.label === "폭탄" ? "💣" : "✕"; cell.setAttribute("aria-label", `${stage.label} 칸`);
        } else {
          const owner = owners[index];
          if (owner) { cell.classList.add("is-filled"); cell.textContent = owner; cell.setAttribute("aria-label", `${owner} 조각이 놓인 칸`); }
          else cell.setAttribute("aria-label", `${Math.floor(index / stage.size) + 1}행 ${index % stage.size + 1}열 빈칸`);
          if (hintCells && hintCells.has(index)) cell.classList.add("is-hint");
          cell.addEventListener("click", function () { if (selected) placePiece(selected, index); });
          cell.addEventListener("pointerenter", function () { if (selected && canPlace(selected, index, rotations[selected] || 0)) previewPlacement(selected, index); });
        }
        boardEl.appendChild(cell);
      }
    }

    function renderTray() {
      tray.innerHTML = "";
      stage.pieces.forEach(function (piece) {
        const card = document.createElement("button"); card.type = "button"; card.className = "blockfill-piece"; card.dataset.piece = piece.id;
        card.classList.toggle("is-selected", selected === piece.id); card.classList.toggle("is-placed", Boolean(placements[piece.id]));
        const shape = document.createElement("span"); shape.className = "blockfill-shape"; drawShape(shape, piece, rotations[piece.id] || 0);
        const text = document.createElement("span"); text.innerHTML = `<strong>조각 ${piece.id}</strong><br><small>${piece.area}칸 · ${placements[piece.id] ? "배치됨" : "대기"}</small>`;
        const rot = document.createElement("small"); rot.textContent = `${(rotations[piece.id] || 0) * 90}°`;
        card.append(shape, text, rot);
        card.addEventListener("click", function () { selectPiece(piece.id); });
        card.addEventListener("pointerdown", function (event) { if (completed) return; drag = { id: piece.id, pointerId: event.pointerId }; selected = piece.id; renderTray(); updateHud(); });
        card.addEventListener("pointerup", function (event) {
          if (!drag || drag.id !== piece.id) return;
          const target = document.elementFromPoint(event.clientX, event.clientY); drag = null;
          const cell = target && target.closest ? target.closest(".blockfill-cell") : null;
          if (cell && boardEl.contains(cell) && !cell.disabled) placePiece(piece.id, Number(cell.dataset.index));
        });
        card.addEventListener("pointercancel", function () { drag = null; });
        tray.appendChild(card);
      });
    }

    function render(hintCells) { renderBoard(hintCells); renderTray(); updateHud(); }
    function previewPlacement(pieceId, anchor) {
      boardEl.querySelectorAll(".is-preview").forEach(function (cell) { cell.classList.remove("is-preview"); });
      const piece = pieceById(pieceId); if (!piece) return;
      placementCells(piece, anchor, rotations[pieceId] || 0).forEach(function (cell) {
        const index = cell[0] * stage.size + cell[1]; const node = boardEl.querySelector(`[data-index="${index}"]`); if (node) node.classList.add("is-preview");
      });
    }
    function selectPiece(id) {
      if (completed) return;
      selected = selected === id ? null : id;
      announce(selected ? "조각 선택" : "선택 해제", selected ? `조각 ${selected}을 배치할 왼쪽 위 기준 칸을 고르세요.` : "다른 조각을 선택하세요.");
      render();
    }
    function startTimer() {
      if (!started) { started = true; runStartedAt = document.hidden ? 0 : Date.now(); }
      else if (!runStartedAt && !document.hidden && !completed) runStartedAt = Date.now();
    }
    function saveGame() {
      if (completed) return;
      writeJson(SAVE_KEY, { version: 2, stage: stageNumber, placements: placements, rotations: rotations, selected: selected, history: history, actions: actionsCount, hints: hintsUsed, started: started, elapsedMs: currentElapsedMs() });
    }
    function validatePlacements(candidate) {
      if (!candidate || typeof candidate !== "object") return false;
      const previous = placements; placements = {};
      let valid = true;
      Object.keys(candidate).forEach(function (id) {
        if (!valid) return;
        const item = candidate[id];
        if (!pieceById(id) || !item || !Number.isInteger(item.anchor) || !Number.isInteger(item.rotation) || !canPlace(id, item.anchor, item.rotation)) valid = false;
        else placements[id] = { pieceId: id, anchor: item.anchor, rotation: item.rotation };
      });
      const rebuilt = placements; placements = previous;
      return valid ? rebuilt : false;
    }

    function placePiece(id, anchor) {
      if (completed) return;
      const rotation = rotations[id] || 0;
      if (!canPlace(id, anchor, rotation)) { announce("배치 불가", "보드 밖, 장애물, 또는 다른 조각과 겹칩니다."); return; }
      startTimer();
      history.push({ type: "place", id: id, previous: placements[id] ? Object.assign({}, placements[id]) : null });
      placements[id] = { pieceId: id, anchor: anchor, rotation: rotation };
      actionsCount += 1; selected = null;
      if (isSolved()) { completeStage(); return; }
      announce("조각 배치", `조각 ${id}을 놓았습니다. ${filledCount()}/${stageArea(stage)}칸을 채웠습니다.`); render(); saveGame();
    }
    function rotateSelected() {
      if (!selected || completed) return;
      rotations[selected] = ((rotations[selected] || 0) + 1) % 4;
      announce("조각 회전", `조각 ${selected}을 ${rotations[selected] * 90}도로 돌렸습니다.`); render(); saveGame();
    }
    function undo() {
      if (!history.length || completed) return;
      const last = history.pop();
      if (last.previous) placements[last.id] = last.previous; else delete placements[last.id];
      selected = last.id; rotations[last.id] = placements[last.id] ? placements[last.id].rotation : (rotations[last.id] || 0);
      actionsCount += 1; announce("되돌리기", `조각 ${last.id}의 직전 배치를 되돌렸습니다.`); render(); saveGame();
    }
    function hint() {
      if (completed) return;
      clearTimeout(hintTimer);
      let target = selected && !placements[selected] ? selected : null;
      if (!target) target = stage.pieces.find(function (piece) { return !placements[piece.id]; })?.id || null;
      if (!target) { announce("힌트", "모든 조각이 배치되어 있습니다. 잘못 놓인 조각을 되돌린 뒤 다시 확인하세요."); return; }
      selected = target; rotations[target] = 0; hintsUsed += 1;
      const piece = pieceById(target); const cells = new Set(placementCells(piece, piece.solutionAnchor, 0).map(function (cell) { return cell[0] * stage.size + cell[1]; }));
      announce("정답 위치 힌트", `조각 ${target}의 정답 위치를 노란 테두리로 표시했습니다. 다른 조각이 막고 있다면 먼저 되돌리세요.`); render(cells);
      hintTimer = setTimeout(function () { if (root.isConnected) render(); }, 1800); saveGame();
    }

    function completeStage() {
      if (runStartedAt) { elapsedBase += Date.now() - runStartedAt; runStartedAt = 0; }
      completed = true; removeKey(SAVE_KEY);
      const seconds = Math.floor(elapsedBase / 1000); record.clears += 1; record.bestStage = Math.max(record.bestStage, stageNumber);
      if (stageNumber < stageMaps.length) record.unlocked = Math.max(record.unlocked, stageNumber + 1);
      if (hintsUsed === 0) {
        const key = String(stageNumber);
        if (record.bestTime[key] === undefined || seconds < record.bestTime[key]) record.bestTime[key] = seconds;
        if (record.bestActions[key] === undefined || actionsCount < record.bestActions[key]) record.bestActions[key] = actionsCount;
      }
      saveRecord(); updateStageOptions();
      announce(stageNumber === stageMaps.length ? "캠페인 완주" : "스테이지 클리어", `${stageNumber}단계를 ${actionsCount}행동 · ${formatTime(seconds)}에 완성했습니다.${hintsUsed ? " 힌트를 사용한 판은 최소 기록 갱신에서 제외됩니다." : ""}`);
      render();
      resetButton.textContent = stageNumber < stageMaps.length ? "다음 스테이지" : "1단계부터";
    }

    function resetStage(message) {
      clearTimeout(hintTimer); placements = {}; rotations = {}; stage.pieces.forEach(function (piece) { rotations[piece.id] = 0; }); selected = null; history = []; actionsCount = 0; hintsUsed = 0; started = false; completed = false; elapsedBase = 0; runStartedAt = 0; removeKey(SAVE_KEY); resetButton.textContent = "초기화";
      announce("스테이지 준비", message || `${stageNumber}단계입니다. ${stage.label} 칸을 피해 ${stage.pieces.length}개 조각으로 ${stageArea(stage)}칸을 모두 채우세요.`); render(); saveGame();
    }
    function loadStage(number, tryRestore) {
      stageNumber = Math.max(1, Math.min(stageMaps.length, number)); stage = parseStage(stageNumber - 1); completed = false; resetButton.textContent = "초기화"; updateStageOptions();
      const saved = tryRestore ? readJson(SAVE_KEY, null) : null;
      if (saved && saved.version === 2 && Number(saved.stage) === stageNumber) {
        placements = {}; const checked = validatePlacements(saved.placements || {});
        if (checked) {
          placements = checked; rotations = Object.assign({}, saved.rotations || {}); stage.pieces.forEach(function (piece) { rotations[piece.id] = Number.isInteger(rotations[piece.id]) ? rotations[piece.id] % 4 : 0; });
          selected = pieceById(saved.selected) ? saved.selected : null; history = Array.isArray(saved.history) ? saved.history : []; actionsCount = Math.max(0, Number(saved.actions) || 0); hintsUsed = Math.max(0, Number(saved.hints) || 0); started = Boolean(saved.started); elapsedBase = Math.max(0, Number(saved.elapsedMs) || 0); runStartedAt = started && !document.hidden ? Date.now() : 0;
          announce("이어하기", `${stageNumber}단계 저장된 퍼즐을 불러왔습니다. ${placedCount()}/${stage.pieces.length}개 조각이 놓여 있습니다.`); render(); return;
        }
      }
      resetStage();
    }

    function onVisibility() {
      if (document.hidden && runStartedAt) { elapsedBase += Date.now() - runStartedAt; runStartedAt = 0; saveGame(); }
      else if (!document.hidden && started && !completed && !runStartedAt) runStartedAt = Date.now();
      updateHud();
    }
    function onKey(event) {
      if (!root.isConnected || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.target && /^(INPUT|SELECT|TEXTAREA)$/.test(event.target.tagName)) return;
      const key = event.key.toLowerCase(); if (!["r", "u", "h"].includes(key)) return;
      event.preventDefault(); event.stopImmediatePropagation();
      if (key === "r") rotateSelected(); else if (key === "u") undo(); else hint();
    }

    stageSelect.addEventListener("change", function () { const next = Number(stageSelect.value); if (next <= record.unlocked) { removeKey(SAVE_KEY); loadStage(next, false); } });
    rotateButton.addEventListener("click", rotateSelected); undoButton.addEventListener("click", undo); hintButton.addEventListener("click", hint);
    resetButton.addEventListener("click", function () {
      if (completed) loadStage(stageNumber < stageMaps.length ? stageNumber + 1 : 1, false); else resetStage("현재 스테이지를 처음 상태로 되돌렸습니다.");
    });
    window.addEventListener("keydown", onKey, true); document.addEventListener("visibilitychange", onVisibility);

    const externalRestart = document.querySelector("#restartGame");
    function onExternalRestart() { removeKey(SAVE_KEY); }
    if (externalRestart) externalRestart.addEventListener("click", onExternalRestart, true);
    const ticker = setInterval(function () { if (root.isConnected) { updateHud(); if (started && !completed) saveGame(); } }, 1000);
    const cleanupObserver = new MutationObserver(function () {
      if (root.isConnected) return; clearInterval(ticker); clearTimeout(hintTimer); window.removeEventListener("keydown", onKey, true); document.removeEventListener("visibilitychange", onVisibility); if (externalRestart) externalRestart.removeEventListener("click", onExternalRestart, true); surface.classList.remove("blockfill-runtime-game"); cleanupObserver.disconnect();
    }); cleanupObserver.observe(document.documentElement, { childList: true, subtree: true });

    const initialSaved = readJson(SAVE_KEY, null); const initialStage = initialSaved && Number(initialSaved.stage) <= record.unlocked ? Number(initialSaved.stage) : record.unlocked;
    loadStage(initialStage || 1, true);
    return true;
  }

  function isTarget(surface) {
    if (surface.dataset.gameId === "block-fill") return true;
    if (location.pathname.indexOf("/games/block-fill/") >= 0) return true;
    return surface.id === "playSurface" && new URLSearchParams(location.search).get("game") === "block-fill";
  }
  function scan() { document.querySelectorAll("#playSurface, .play-surface").forEach(function (surface) { if (isTarget(surface) && !surface.querySelector(".blockfill-runtime-root")) setup(surface); }); }
  function boot() { scan(); const observer = new MutationObserver(scan); observer.observe(document.documentElement, { childList: true, subtree: true }); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true }); else boot();
})();