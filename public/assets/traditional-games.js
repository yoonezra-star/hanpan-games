(function () {
  function createCanvas(surface, label) {
    const canvas = document.createElement("canvas");
    canvas.className = "arcade-canvas wide-canvas traditional-canvas";
    canvas.width = 900;
    canvas.height = 520;
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", label);
    surface.appendChild(canvas);
    return { canvas, context: canvas.getContext("2d") };
  }

  function addControls(surface, className) {
    const controls = document.createElement("div");
    controls.className = `mini-controls traditional-controls ${className || ""}`.trim();
    surface.appendChild(controls);
    return controls;
  }

  function addButton(controls, label, className) {
    const control = document.createElement("button");
    control.type = "button";
    control.className = className || "button secondary";
    control.textContent = label;
    controls.appendChild(control);
    return control;
  }

  function roundedRect(context, x, y, width, height, radius) {
    context.beginPath();
    context.roundRect(x, y, width, height, radius);
  }

  function drawCourtyard(context) {
    const sky = context.createLinearGradient(0, 0, 0, 350);
    sky.addColorStop(0, "#dff5ff");
    sky.addColorStop(1, "#fff8dd");
    context.fillStyle = sky;
    context.fillRect(0, 0, 900, 350);
    context.fillStyle = "#4c596c";
    context.fillRect(0, 300, 900, 18);
    context.fillStyle = "#fffdf7";
    for (let x = 0; x < 900; x += 52) context.fillRect(x, 306, 34, 4);
    context.fillStyle = "#dcc89e";
    context.fillRect(0, 318, 900, 202);
    context.strokeStyle = "rgba(78, 66, 45, 0.18)";
    context.lineWidth = 2;
    for (let y = 350; y < 520; y += 42) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(900, y);
      context.stroke();
    }
  }

  function createLoop(api, update, draw) {
    let frame = 0;
    let previous = performance.now();
    function tick(now) {
      const delta = Math.min(0.034, Math.max(0, (now - previous) / 1000));
      previous = now;
      update(delta, now);
      draw(now);
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    api.cleanup.push(function () { cancelAnimationFrame(frame); });
  }

  function renderJegi(game, surface, api) {
    const score = api.renderScore(surface, [
      { label: "점수", value: "0" },
      { label: "연속", value: "0" },
      { label: "남은 시간", value: "45" },
      { label: "최고", value: api.getBest(game.id) || "-" }
    ]);
    const values = score.querySelectorAll("b");
    const stage = createCanvas(surface, "제기를 떨어뜨리지 않고 발로 차며 연속 기록에 도전하는 게임 화면");
    const controls = addControls(surface, "jegi-controls");
    const kickButton = addButton(controls, "제기 차기", "button primary traditional-main-action");
    const startButton = addButton(controls, "새 판", "button secondary");
    const speed = api.createSpeedSelect();
    controls.appendChild(speed);
    const sound = addButton(controls, "소리 켜짐", "button secondary");
    sound.setAttribute("aria-pressed", "true");
    const audio = api.createTonePlayer();
    api.cleanup.push(audio.close);

    let playing = false;
    let points = 0;
    let combo = 0;
    let timeLeft = 45;
    let jegiY = 250;
    let jegiX = 450;
    let velocityY = 0;
    let drift = 0;
    let kickFlash = 0;

    function sync() {
      values[0].textContent = String(points);
      values[1].textContent = String(combo);
      values[2].textContent = String(Math.max(0, Math.ceil(timeLeft)));
      values[3].textContent = String(api.getBest(game.id) || "-");
    }

    function reset() {
      playing = true;
      points = 0;
      combo = 0;
      timeLeft = 45;
      jegiY = 360;
      jegiX = 450;
      velocityY = -500;
      drift = 0;
      api.setResult("제기가 무릎 아래로 내려올 때 차면 더 안정적으로 이어집니다.");
      sync();
    }

    function finish(message) {
      playing = false;
      const best = api.saveBest(game.id, points, function (next, previous) { return next > previous; });
      sync();
      api.setResult(best ? `${message} 새 최고 기록 ${points}점입니다.` : `${message} 최종 ${points}점입니다.`);
    }

    function kick() {
      if (!playing) {
        reset();
        return;
      }
      if (jegiY < 285 || velocityY < -40) {
        combo = 0;
        api.setResult("제기가 아직 높습니다. 내려오는 순간을 기다리세요.");
        audio.tone(180, 0.08, "square", 0.025);
        sync();
        return;
      }
      const timing = Math.max(0, 1 - Math.abs(jegiY - 405) / 120);
      combo += 1;
      points += 8 + Math.round(timing * 7) + Math.min(15, combo);
      velocityY = -520 - Math.min(80, combo * 4);
      drift = (Math.random() - 0.5) * (55 + combo * 2);
      kickFlash = 0.16;
      audio.tone(420 + combo * 12, 0.07, "triangle", 0.035);
      api.setResult(timing > 0.72 ? `정확한 타이밍입니다. ${combo}회 연속!` : `${combo}회 연속입니다.`);
      sync();
    }

    function update(delta) {
      if (!playing) return;
      const scale = Number(speed.value) || 1;
      timeLeft -= delta * scale;
      velocityY += 820 * delta * scale;
      jegiY += velocityY * delta * scale;
      jegiX += drift * delta * scale;
      drift *= Math.pow(0.985, delta * 60);
      kickFlash = Math.max(0, kickFlash - delta);
      if (jegiX < 150 || jegiX > 750) drift *= -1;
      if (jegiY > 476) finish("제기를 놓쳤습니다.");
      else if (timeLeft <= 0) finish("45초 도전을 마쳤습니다.");
      sync();
    }

    function draw() {
      const context = stage.context;
      drawCourtyard(context);
      context.fillStyle = "rgba(29, 36, 51, 0.08)";
      context.beginPath();
      context.ellipse(jegiX, 470, 62, 13, 0, 0, Math.PI * 2);
      context.fill();

      context.save();
      context.translate(jegiX, jegiY);
      context.rotate(drift / 160);
      ["#df4b38", "#2877b9", "#f5b82e", "#258b62"].forEach(function (color, index) {
        context.strokeStyle = color;
        context.lineWidth = 10;
        context.beginPath();
        context.moveTo((index - 1.5) * 5, -4);
        context.quadraticCurveTo((index - 1.5) * 13, -34, (index - 1.5) * 9, -68);
        context.stroke();
      });
      context.fillStyle = "#1d2433";
      context.beginPath();
      context.ellipse(0, 0, 25, 13, 0, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = "#ffcf5d";
      context.beginPath();
      context.ellipse(0, -2, 12, 6, 0, 0, Math.PI * 2);
      context.fill();
      context.restore();

      context.save();
      context.translate(jegiX - 72, 470 - kickFlash * 260);
      context.rotate(kickFlash ? -0.35 : 0.08);
      roundedRect(context, 0, -26, 126, 42, 18);
      context.fillStyle = "#fffdf7";
      context.fill();
      context.strokeStyle = "#1d2433";
      context.lineWidth = 5;
      context.stroke();
      context.restore();
    }

    function keydown(event) {
      if (event.code === "Space") {
        event.preventDefault();
        kick();
      }
    }
    kickButton.addEventListener("click", kick);
    stage.canvas.addEventListener("pointerdown", kick);
    startButton.addEventListener("click", reset);
    sound.addEventListener("click", function () { audio.toggle(sound); });
    document.addEventListener("keydown", keydown);
    api.cleanup.push(function () { document.removeEventListener("keydown", keydown); });
    createLoop(api, update, draw);
    playing = false;
    sync();
    api.setResult("제기 차기 또는 새 판을 누르면 45초 도전이 시작됩니다.");
  }

  function renderTuho(game, surface, api) {
    const score = api.renderScore(surface, [
      { label: "점수", value: "0" },
      { label: "남은 화살", value: "10" },
      { label: "연속 성공", value: "0" },
      { label: "최고", value: api.getBest(game.id) || "-" }
    ]);
    const values = score.querySelectorAll("b");
    const stage = createCanvas(surface, "각도와 힘을 조절해 화살을 투호 항아리에 넣는 게임 화면");
    const controls = addControls(surface, "tuho-controls");
    const angleLabel = document.createElement("label");
    angleLabel.className = "traditional-slider";
    angleLabel.innerHTML = '<span>각도 <b>45°</b></span><input type="range" min="30" max="65" value="45" aria-label="투호 각도">';
    const powerLabel = document.createElement("label");
    powerLabel.className = "traditional-slider";
    powerLabel.innerHTML = '<span>힘 <b>55</b></span><input type="range" min="38" max="72" value="55" aria-label="투호 힘">';
    controls.append(angleLabel, powerLabel);
    const throwButton = addButton(controls, "화살 던지기", "button primary traditional-main-action");
    const resetButton = addButton(controls, "새 판", "button secondary");
    const sound = addButton(controls, "소리 켜짐", "button secondary");
    sound.setAttribute("aria-pressed", "true");
    const angle = angleLabel.querySelector("input");
    const power = powerLabel.querySelector("input");
    const audio = api.createTonePlayer();
    api.cleanup.push(audio.close);

    let points = 0;
    let arrows = 10;
    let streak = 0;
    let wind = 0;
    let projectile = null;
    let ended = false;
    const jarX = 710;
    const openingY = 322;

    function sync() {
      values[0].textContent = String(points);
      values[1].textContent = String(arrows);
      values[2].textContent = String(streak);
      values[3].textContent = String(api.getBest(game.id) || "-");
      angleLabel.querySelector("b").textContent = `${angle.value}°`;
      powerLabel.querySelector("b").textContent = power.value;
    }

    function reset() {
      points = 0;
      arrows = 10;
      streak = 0;
      wind = Math.round((Math.random() - 0.5) * 6);
      projectile = null;
      ended = false;
      throwButton.disabled = false;
      api.setResult(`바람 ${wind === 0 ? "없음" : wind > 0 ? `오른쪽 ${wind}` : `왼쪽 ${Math.abs(wind)}`}. 각도와 힘을 맞춰 보세요.`);
      sync();
    }

    function finishRound(hit, distance) {
      projectile = null;
      arrows -= 1;
      if (hit) {
        streak += 1;
        const gained = Math.max(30, 100 - Math.round(distance * 2)) + streak * 5;
        points += gained;
        audio.tone(620, 0.12, "sine", 0.04);
        api.setResult(`명중! ${gained}점을 얻었습니다. 바람이 바뀝니다.`);
      } else {
        streak = 0;
        audio.tone(150, 0.14, "sawtooth", 0.025);
        api.setResult("항아리를 벗어났습니다. 궤적을 보고 각도나 힘을 조금 조절하세요.");
      }
      wind = Math.round((Math.random() - 0.5) * 6);
      if (arrows <= 0) {
        ended = true;
        const best = api.saveBest(game.id, points, function (next, previous) { return next > previous; });
        api.setResult(best ? `열 발을 마쳤습니다. 새 최고 기록 ${points}점입니다.` : `열 발을 마쳤습니다. 최종 ${points}점입니다.`);
      }
      throwButton.disabled = ended;
      sync();
    }

    function launch() {
      if (projectile || ended) return;
      const radians = Number(angle.value) * Math.PI / 180;
      const velocity = Number(power.value) * 10.9;
      projectile = {
        x: 86,
        y: 420,
        previousY: 420,
        vx: Math.cos(radians) * velocity,
        vy: -Math.sin(radians) * velocity,
        rotation: -radians
      };
      throwButton.disabled = true;
      audio.tone(310, 0.08, "triangle", 0.025);
      api.setResult("화살이 날아갑니다.");
    }

    function update(delta) {
      if (!projectile) return;
      projectile.previousY = projectile.y;
      projectile.vx += wind * 7 * delta;
      projectile.vy += 500 * delta;
      projectile.x += projectile.vx * delta;
      projectile.y += projectile.vy * delta;
      projectile.rotation = Math.atan2(projectile.vy, projectile.vx);
      if (projectile.previousY < openingY && projectile.y >= openingY && projectile.vy > 0) {
        const distance = Math.abs(projectile.x - jarX);
        if (distance <= 38) {
          finishRound(true, distance);
          throwButton.disabled = ended;
          return;
        }
      }
      if (projectile.y > 482 || projectile.x > 940) {
        finishRound(false, 99);
        throwButton.disabled = ended;
      }
    }

    function drawArrow(context, x, y, rotation, color) {
      context.save();
      context.translate(x, y);
      context.rotate(rotation);
      context.strokeStyle = color || "#1d2433";
      context.lineWidth = 6;
      context.beginPath();
      context.moveTo(-42, 0);
      context.lineTo(28, 0);
      context.stroke();
      context.fillStyle = "#1d2433";
      context.beginPath();
      context.moveTo(38, 0);
      context.lineTo(22, -9);
      context.lineTo(22, 9);
      context.closePath();
      context.fill();
      context.restore();
    }

    function draw() {
      const context = stage.context;
      drawCourtyard(context);
      context.fillStyle = "#f7f1e2";
      context.fillRect(0, 470, 900, 50);
      context.fillStyle = "rgba(29, 36, 51, 0.08)";
      context.beginPath();
      context.ellipse(jarX, 478, 92, 18, 0, 0, Math.PI * 2);
      context.fill();
      roundedRect(context, jarX - 64, openingY, 128, 156, 24);
      context.fillStyle = "#1d2433";
      context.fill();
      roundedRect(context, jarX - 51, openingY + 14, 102, 130, 17);
      context.fillStyle = "#2877b9";
      context.fill();
      context.fillStyle = "#ffcf5d";
      context.beginPath();
      context.arc(jarX, 395, 30, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = "#df4b38";
      context.beginPath();
      context.arc(jarX, 395, 15, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = "#090d14";
      context.beginPath();
      context.ellipse(jarX, openingY + 5, 54, 15, 0, 0, Math.PI * 2);
      context.fill();

      context.fillStyle = "#1d2433";
      context.font = "700 18px sans-serif";
      context.fillText(`바람 ${wind > 0 ? "→" : wind < 0 ? "←" : "·"} ${Math.abs(wind)}`, 35, 48);
      if (projectile) drawArrow(context, projectile.x, projectile.y, projectile.rotation, "#df4b38");
      else drawArrow(context, 90, 420, -Number(angle.value) * Math.PI / 180, "#df4b38");
    }

    function keydown(event) {
      if (event.code === "Space") {
        event.preventDefault();
        launch();
      }
    }
    angle.addEventListener("input", sync);
    power.addEventListener("input", sync);
    throwButton.addEventListener("click", launch);
    resetButton.addEventListener("click", reset);
    sound.addEventListener("click", function () { audio.toggle(sound); });
    document.addEventListener("keydown", keydown);
    api.cleanup.push(function () { document.removeEventListener("keydown", keydown); });
    createLoop(api, update, draw);
    reset();
  }

  function renderDdakji(game, surface, api) {
    const score = api.renderScore(surface, [
      { label: "점수", value: "0" },
      { label: "남은 판", value: "8" },
      { label: "연속 뒤집기", value: "0" },
      { label: "최고", value: api.getBest(game.id) || "-" }
    ]);
    const values = score.querySelectorAll("b");
    const stage = createCanvas(surface, "움직이는 힘 게이지와 방향을 맞춰 상대 딱지를 뒤집는 게임 화면");
    const controls = addControls(surface, "ddakji-controls");
    const directionWrap = document.createElement("div");
    directionWrap.className = "segmented traditional-directions";
    directionWrap.setAttribute("aria-label", "딱지 내려칠 방향");
    const directions = ["왼쪽", "중앙", "오른쪽"].map(function (label, index) {
      const item = addButton(directionWrap, label, "segment-button");
      item.dataset.direction = String(index);
      return item;
    });
    controls.appendChild(directionWrap);
    const strikeButton = addButton(controls, "내려치기", "button primary traditional-main-action");
    const resetButton = addButton(controls, "새 판", "button secondary");
    const sound = addButton(controls, "소리 켜짐", "button secondary");
    sound.setAttribute("aria-pressed", "true");
    const audio = api.createTonePlayer();
    api.cleanup.push(audio.close);

    let points = 0;
    let rounds = 8;
    let streak = 0;
    let selected = 1;
    let weakness = 1;
    let needle = 0;
    let target = 0.55;
    let clock = 0;
    let animation = null;
    let ended = false;

    function sync() {
      values[0].textContent = String(points);
      values[1].textContent = String(rounds);
      values[2].textContent = String(streak);
      values[3].textContent = String(api.getBest(game.id) || "-");
      directions.forEach(function (item, index) {
        item.classList.toggle("active", index === selected);
        item.setAttribute("aria-pressed", String(index === selected));
      });
    }

    function reset() {
      points = 0;
      rounds = 8;
      streak = 0;
      selected = 1;
      weakness = Math.floor(Math.random() * 3);
      target = 0.3 + Math.random() * 0.4;
      clock = 0;
      animation = null;
      ended = false;
      strikeButton.disabled = false;
      api.setResult("상대 딱지의 들린 모서리를 보고 힘 게이지가 노란 구간에 올 때 내려치세요.");
      sync();
    }

    function strike() {
      if (animation || ended) return;
      const timing = Math.abs(needle - target);
      const directionMatch = selected === weakness;
      const success = timing < 0.055 || (timing < 0.14 && directionMatch);
      const gained = success ? Math.max(60, 150 - Math.round(timing * 500)) + streak * 10 : Math.max(5, 35 - Math.round(timing * 80));
      animation = { progress: 0, success, gained, direction: selected };
      strikeButton.disabled = true;
      audio.tone(success ? 520 : 180, 0.1, success ? "triangle" : "square", 0.04);
    }

    function settle() {
      const outcome = animation;
      animation = null;
      rounds -= 1;
      points += outcome.gained;
      if (outcome.success) {
        streak += 1;
        api.setResult(`딱지를 뒤집었습니다. ${outcome.gained}점, ${streak}회 연속입니다.`);
      } else {
        streak = 0;
        api.setResult("뒤집지 못했습니다. 들린 모서리와 노란 힘 구간을 함께 맞춰 보세요.");
      }
      weakness = Math.floor(Math.random() * 3);
      target = 0.27 + Math.random() * 0.46;
      if (rounds <= 0) {
        ended = true;
        const best = api.saveBest(game.id, points, function (next, previous) { return next > previous; });
        api.setResult(best ? `여덟 판 완료. 새 최고 기록 ${points}점입니다.` : `여덟 판 완료. 최종 ${points}점입니다.`);
      }
      strikeButton.disabled = ended;
      sync();
    }

    function update(delta) {
      clock += delta * 1.35;
      needle = (Math.sin(clock * Math.PI * 2) + 1) / 2;
      if (animation) {
        animation.progress += delta * 1.7;
        if (animation.progress >= 1) settle();
      }
    }

    function drawTile(context, x, y, size, color, rotation, flip) {
      context.save();
      context.translate(x, y);
      context.rotate(rotation || 0);
      context.scale(1, flip === undefined ? 1 : Math.max(0.08, Math.abs(Math.cos(flip * Math.PI))));
      context.fillStyle = color;
      context.strokeStyle = "#1d2433";
      context.lineWidth = 6;
      context.fillRect(-size / 2, -size / 2, size, size);
      context.strokeRect(-size / 2, -size / 2, size, size);
      context.beginPath();
      context.moveTo(-size / 2, -size / 2);
      context.lineTo(size / 2, size / 2);
      context.moveTo(size / 2, -size / 2);
      context.lineTo(-size / 2, size / 2);
      context.stroke();
      context.restore();
    }

    function draw() {
      const context = stage.context;
      drawCourtyard(context);
      context.fillStyle = "rgba(29, 36, 51, 0.12)";
      context.beginPath();
      context.ellipse(575, 445, 150, 22, 0, 0, Math.PI * 2);
      context.fill();
      const targetFlip = animation && animation.success ? animation.progress : 0;
      drawTile(context, 575, 390 - Math.sin(targetFlip * Math.PI) * 80, 178, "#2877b9", targetFlip * 0.45, targetFlip);
      const attackProgress = animation ? Math.min(1, animation.progress * 1.6) : 0;
      const attackX = animation ? 170 + (560 - 170) * attackProgress : 170;
      const attackY = animation ? 195 + Math.sin(attackProgress * Math.PI) * -90 + attackProgress * 205 : 195;
      drawTile(context, attackX, attackY, 138, "#df4b38", animation ? attackProgress * 2.5 : -0.18);

      context.fillStyle = "rgba(29, 36, 51, 0.16)";
      context.fillRect(140, 70, 620, 28);
      context.fillStyle = "#ffcf5d";
      context.fillRect(140 + target * 620 - 55, 70, 110, 28);
      context.fillStyle = "#1d2433";
      context.fillRect(140 + needle * 620 - 4, 58, 8, 52);
      context.font = "800 18px sans-serif";
      context.fillText(`들린 모서리: ${["왼쪽", "중앙", "오른쪽"][weakness]}`, 140, 138);
    }

    function choose(index) {
      selected = index;
      sync();
    }
    function keydown(event) {
      if (event.code === "Space") {
        event.preventDefault();
        strike();
      } else if (["KeyA", "KeyS", "KeyD"].includes(event.code)) {
        choose({ KeyA: 0, KeyS: 1, KeyD: 2 }[event.code]);
      }
    }
    directions.forEach(function (item, index) { item.addEventListener("click", function () { choose(index); }); });
    strikeButton.addEventListener("click", strike);
    resetButton.addEventListener("click", reset);
    sound.addEventListener("click", function () { audio.toggle(sound); });
    document.addEventListener("keydown", keydown);
    api.cleanup.push(function () { document.removeEventListener("keydown", keydown); });
    createLoop(api, update, draw);
    reset();
  }

  function renderGonggi(game, surface, api) {
    const stages = [
      { name: "한 알 줍기", catches: 4, window: 0.18 },
      { name: "두 알 줍기", catches: 2, window: 0.16 },
      { name: "세 알과 한 알", catches: 2, window: 0.14 },
      { name: "네 알 줍기", catches: 1, window: 0.12 },
      { name: "꺾기", catches: 3, window: 0.1 }
    ];
    const score = api.renderScore(surface, [
      { label: "단계", value: "1" },
      { label: "점수", value: "0" },
      { label: "남은 기회", value: "3" },
      { label: "최고 단계", value: api.getBest(game.id) || "-" }
    ]);
    const values = score.querySelectorAll("b");
    const stage = createCanvas(surface, "공깃돌이 떠오르고 내려오는 순간을 맞춰 다섯 단계를 통과하는 게임 화면");
    const controls = addControls(surface, "gonggi-controls");
    const catchButton = addButton(controls, "공깃돌 받기", "button primary traditional-main-action");
    const resetButton = addButton(controls, "새 판", "button secondary");
    const speed = api.createSpeedSelect();
    controls.appendChild(speed);
    const sound = addButton(controls, "소리 켜짐", "button secondary");
    sound.setAttribute("aria-pressed", "true");
    const audio = api.createTonePlayer();
    api.cleanup.push(audio.close);

    let level = 0;
    let caught = 0;
    let points = 0;
    let lives = 3;
    let phase = 0;
    let playing = false;
    let completed = false;
    let flash = 0;

    function sync() {
      values[0].textContent = completed ? "완료" : String(level + 1);
      values[1].textContent = String(points);
      values[2].textContent = String(lives);
      values[3].textContent = String(api.getBest(game.id) || "-");
    }

    function reset() {
      level = 0;
      caught = 0;
      points = 0;
      lives = 3;
      phase = 0;
      playing = true;
      completed = false;
      catchButton.disabled = false;
      api.setResult(`${stages[0].name} 단계입니다. 돌이 손 가까이 내려올 때 받으세요.`);
      sync();
    }

    function miss(message) {
      lives -= 1;
      caught = 0;
      phase = 0;
      flash = -0.2;
      audio.tone(150, 0.14, "square", 0.03);
      if (lives <= 0) {
        playing = false;
        const reached = level + 1;
        api.saveBest(game.id, reached, function (next, previous) { return next > previous; });
        catchButton.disabled = true;
        api.setResult(`${message} ${reached}단계에서 도전을 마쳤습니다.`);
      } else {
        api.setResult(`${message} 기회가 ${lives}번 남았습니다.`);
      }
      sync();
    }

    function catchStone() {
      if (!playing) {
        reset();
        return;
      }
      const current = stages[level];
      const center = 0.84;
      if (Math.abs(phase - center) <= current.window / 2) {
        caught += 1;
        points += 80 + level * 30 + caught * 10;
        phase = 0.04;
        flash = 0.2;
        audio.tone(480 + level * 55, 0.08, "sine", 0.035);
        if (caught >= current.catches) {
          level += 1;
          caught = 0;
          if (level >= stages.length) {
            completed = true;
            playing = false;
            catchButton.disabled = true;
            api.saveBest(game.id, 5, function (next, previous) { return next > previous; });
            api.setResult(`공기놀이 다섯 단계를 모두 통과했습니다. 최종 ${points}점입니다.`);
          } else {
            api.setResult(`${current.name} 성공. ${stages[level].name} 단계로 올라갑니다.`);
          }
        } else {
          api.setResult(`${current.name}: ${caught}/${current.catches}번 성공했습니다.`);
        }
      } else {
        miss(phase < center ? "너무 일찍 손을 뻗었습니다." : "공깃돌을 놓쳤습니다.");
      }
      sync();
    }

    function update(delta) {
      flash += flash > 0 ? -delta : flash < 0 ? delta : 0;
      if (!playing) return;
      const speedScale = Number(speed.value) || 1;
      phase += delta * (0.62 + level * 0.075) * speedScale;
      if (phase >= 1) miss("공깃돌이 손을 지나쳤습니다.");
    }

    function drawStone(context, x, y, radius, color) {
      context.fillStyle = color;
      context.strokeStyle = "#1d2433";
      context.lineWidth = 4;
      context.beginPath();
      for (let index = 0; index < 10; index += 1) {
        const angle = -Math.PI / 2 + index * Math.PI / 5;
        const length = index % 2 ? radius * 0.78 : radius;
        const px = x + Math.cos(angle) * length;
        const py = y + Math.sin(angle) * length;
        if (index === 0) context.moveTo(px, py);
        else context.lineTo(px, py);
      }
      context.closePath();
      context.fill();
      context.stroke();
    }

    function draw() {
      const context = stage.context;
      drawCourtyard(context);
      const current = stages[Math.min(level, stages.length - 1)];
      const arc = Math.sin(Math.min(1, phase) * Math.PI);
      const tossY = 405 - arc * 285;
      context.fillStyle = flash > 0 ? "rgba(37, 139, 98, 0.18)" : flash < 0 ? "rgba(223, 75, 56, 0.16)" : "rgba(255,255,255,0.4)";
      context.fillRect(0, 0, 900, 520);
      context.fillStyle = "#1d2433";
      context.font = "900 25px sans-serif";
      context.fillText(`${level + 1}단계 · ${current.name}`, 36, 48);
      context.font = "700 17px sans-serif";
      context.fillText(`진행 ${caught}/${current.catches}`, 36, 78);

      context.strokeStyle = "rgba(37, 139, 98, 0.45)";
      context.lineWidth = 5;
      context.setLineDash([9, 9]);
      context.beginPath();
      context.arc(450, 430, 78, Math.PI, Math.PI * 2);
      context.stroke();
      context.setLineDash([]);
      ["#df4b38", "#2877b9", "#ffcf5d", "#258b62"].forEach(function (color, index) {
        const remaining = Math.max(0, 4 - caught);
        if (index < remaining) drawStone(context, 330 + index * 82, 438 + (index % 2) * 12, 24, color);
      });
      drawStone(context, 450, tossY, 29, "#b9476a");

      context.fillStyle = "#f2c7a5";
      context.strokeStyle = "#1d2433";
      context.lineWidth = 5;
      context.beginPath();
      context.ellipse(450, 478, 115, 34, 0, Math.PI, Math.PI * 2);
      context.fill();
      context.stroke();
    }

    function keydown(event) {
      if (event.code === "Space") {
        event.preventDefault();
        catchStone();
      }
    }
    catchButton.addEventListener("click", catchStone);
    stage.canvas.addEventListener("pointerdown", catchStone);
    resetButton.addEventListener("click", reset);
    sound.addEventListener("click", function () { audio.toggle(sound); });
    document.addEventListener("keydown", keydown);
    api.cleanup.push(function () { document.removeEventListener("keydown", keydown); });
    createLoop(api, update, draw);
    reset();
  }

  window.HANPAN_TRADITIONAL_GAMES = {
    jegi: renderJegi,
    tuho: renderTuho,
    ddakji: renderDdakji,
    gonggi: renderGonggi
  };
})();
