(function () {
  const ID = 'ddakji-flip';
  const RK = 'hanpan-ddakji-records-v4';
  const PK = 'hanpan-ddakji-prefs-v4';
  const P = {
    easy: { label: '쉬움', radius: 27, powerWindow: 16, chargeSpeed: 48 },
    normal: { label: '보통', radius: 20, powerWindow: 12, chargeSpeed: 60 },
    hard: { label: '어려움', radius: 15, powerWindow: 9, chargeSpeed: 72 }
  };

  function load(key, fallback) {
    try { return Object.assign({}, fallback, JSON.parse(localStorage.getItem(key) || '{}')); }
    catch (e) { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }

  function mount(surface) {
    if (!surface || surface.dataset.gameId !== ID || surface.querySelector('.dj4')) return;
    const prefs = load(PK, { difficulty: 'normal' });
    let diff = P[prefs.difficulty] ? prefs.difficulty : 'normal';
    const records = load(RK, {});
    let round = 0, score = 0, flips = 0, streak = 0, bestStreak = 0;
    let target = { x: 18, y: 18 }, selected = { x: 50, y: 50 }, targetPower = 70, targetCorner = 'tl';
    let charge = 30, chargeDir = 1, charging = false, busy = false, frame = 0, last = performance.now();

    function record() {
      if (!records[diff]) records[diff] = { runs: 0, bestScore: 0, bestFlips: 0, bestStreak: 0 };
      return records[diff];
    }

    surface.innerHTML = `
      <style>
        .dj4{max-width:700px;margin:auto;display:grid;gap:12px;text-align:center}
        .dj4-hud,.dj4-actions{display:flex;gap:8px;justify-content:center;align-items:center;flex-wrap:wrap}
        .dj4-hud span,.dj4-hud strong,.dj4-records span{padding:7px 10px;border-radius:999px;background:rgba(29,36,51,.07)}
        .dj4-yard{position:relative;min-height:390px;border-radius:22px;overflow:hidden;background:linear-gradient(#f8f1dd,#e4c58e);border:1px solid #d5c29d;touch-action:manipulation}
        .dj4-yard:before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent 0 53px,rgba(101,74,38,.08) 54px 56px)}
        .dj4-opponent{position:absolute;left:50%;top:42%;width:min(46vw,260px);height:min(46vw,260px);max-width:260px;max-height:260px;min-width:190px;min-height:190px;transform:translate(-50%,-50%) rotate(3deg);background:linear-gradient(135deg,#c73c33 0 48%,#f4c24b 49% 52%,#2d65ae 53%);border:8px solid #f8e9c4;border-radius:16px;box-shadow:0 18px 30px rgba(72,45,20,.22);cursor:crosshair;transition:transform .45s cubic-bezier(.2,.8,.2,1),filter .25s;z-index:2;overflow:hidden}
        .dj4-opponent:after{content:"상대 딱지";position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);padding:6px 10px;border-radius:999px;background:#ffffffd9;font-weight:900;color:#283246;pointer-events:none}
        .dj4-opponent.flip{transform:translate(-50%,-50%) rotate(3deg) rotateY(180deg) scale(.92);filter:brightness(1.15)}
        .dj4-fold{position:absolute;width:58px;height:58px;z-index:4;pointer-events:none;filter:drop-shadow(0 5px 4px rgba(70,42,22,.28))}
        .dj4-fold:before{content:"";position:absolute;inset:0;background:linear-gradient(135deg,#fff5cf,#d7a65c);clip-path:polygon(0 0,100% 0,0 100%)}
        .dj4-fold.tl{left:-3px;top:-3px;transform:rotate(0deg)}.dj4-fold.tr{right:-3px;top:-3px;transform:rotate(90deg)}.dj4-fold.br{right:-3px;bottom:-3px;transform:rotate(180deg)}.dj4-fold.bl{left:-3px;bottom:-3px;transform:rotate(270deg)}
        .dj4-selected{position:absolute;width:28px;height:28px;border-radius:50%;transform:translate(-50%,-50%);pointer-events:none;z-index:5;border:4px solid #fff;background:#1e8d64;box-shadow:0 0 0 2px #1b4b3c}
        .dj4-player{position:absolute;left:50%;bottom:18px;width:128px;height:128px;border-radius:14px;background:linear-gradient(135deg,#245ea8,#f3c34d);border:6px solid #fff0c8;box-shadow:0 12px 20px rgba(55,35,18,.2);transform:translateX(-50%) rotate(-8deg);transition:transform .2s ease;z-index:3}
        .dj4-player.slam{transform:translateX(-50%) translateY(-170px) rotate(20deg) scale(.88)}
        .dj4-power{position:relative;height:28px;border-radius:16px;background:linear-gradient(90deg,#d85b50 0 25%,#efb94a 25% 55%,#57b56c 55% 78%,#d85b50 78%);overflow:hidden}.dj4-power .needle{position:absolute;top:-4px;height:36px;width:6px;background:#fff;box-shadow:0 0 0 2px #222;transform:translateX(-50%)}
        .dj4-power-hint{font-size:.9rem;font-weight:900;color:#5d4933}.dj4-help{font-size:.92rem;color:#566070}.dj4 button,.dj4 select{min-height:44px}
        @media(max-width:600px){.dj4-yard{min-height:340px}.dj4-player{width:105px;height:105px}.dj4-actions .button{flex:1 1 130px}}
      </style>
      <div class="dj4">
        <div class="dj4-hud"><strong data-v="score">0점</strong><span data-v="round">0/10판</span><span data-v="flips">뒤집기 0</span><span data-v="streak">연속 0</span></div>
        <div class="dj4-actions"><label>난이도 <select data-v="diff"><option value="easy">쉬움</option><option value="normal">보통</option><option value="hard">어려움</option></select></label><button class="button secondary" data-act="new" type="button">새 10판</button></div>
        <div class="dj4-yard" aria-label="들린 모서리를 눈으로 읽고 딱지 위 타격점을 직접 고른 뒤 힘을 조절하는 게임 영역"><div class="dj4-opponent" data-act="card"><i class="dj4-fold tl"></i><i class="dj4-selected"></i></div><div class="dj4-player" aria-hidden="true"></div></div>
        <div class="dj4-power-hint" data-v="hint">필요한 힘: 보통</div>
        <div class="dj4-power" aria-label="딱지치기 힘 게이지"><i class="needle"></i></div>
        <button class="button primary" data-act="slam" type="button">누르고 있다가 놓아 내리치기 · Space</button>
        <div class="dj4-records"></div><p class="dj4-help">들린 모서리는 접힌 모양으로만 알려 줍니다. 정확한 타격점은 직접 고르고, 힘은 ‘약하게·보통·강하게’ 힌트를 보고 감으로 맞추세요.</p>
      </div>`;

    const $ = (q) => surface.querySelector(q);
    const card = $('[data-act="card"]'), fold = $('.dj4-fold'), selectedMark = $('.dj4-selected');
    const needle = $('.dj4-power .needle'), slamBtn = $('[data-act="slam"]'), playerCard = $('.dj4-player'), sel = $('[data-v="diff"]');
    sel.value = diff;

    function announce(text) { const o = document.querySelector('#playResult'); if (o) o.textContent = text; }
    function powerHint() {
      if (targetPower < 63) return '약하게';
      if (targetPower < 76) return '보통';
      return '강하게';
    }
    function render() {
      const r = record();
      $('[data-v="score"]').textContent = score + '점'; $('[data-v="round"]').textContent = round + '/10판'; $('[data-v="flips"]').textContent = '뒤집기 ' + flips; $('[data-v="streak"]').textContent = '연속 ' + streak + ' · 최고 ' + bestStreak;
      selectedMark.style.left = selected.x + '%'; selectedMark.style.top = selected.y + '%';
      fold.className = 'dj4-fold ' + targetCorner;
      $('[data-v="hint"]').textContent = '필요한 힘: ' + powerHint();
      needle.style.left = charge + '%';
      $('.dj4-records').innerHTML = `<span>${P[diff].label} 최고 ${r.bestScore}점</span><span>최다 뒤집기 ${r.bestFlips}/10</span><span>최고 연속 ${r.bestStreak}</span>`;
      slamBtn.disabled = round >= 10 || busy;
    }

    function nextTarget() {
      const corners = [
        { id: 'tl', make: () => ({ x: 10 + Math.random() * 25, y: 10 + Math.random() * 20 }) },
        { id: 'tr', make: () => ({ x: 65 + Math.random() * 25, y: 10 + Math.random() * 20 }) },
        { id: 'br', make: () => ({ x: 65 + Math.random() * 25, y: 70 + Math.random() * 20 }) },
        { id: 'bl', make: () => ({ x: 10 + Math.random() * 25, y: 70 + Math.random() * 20 }) }
      ];
      const corner = corners[Math.floor(Math.random() * corners.length)];
      targetCorner = corner.id; target = corner.make(); selected = { x: 50, y: 50 };
      targetPower = 54 + Math.random() * 32;
      charge = 30; chargeDir = 1;
      card.classList.remove('flip'); playerCard.classList.remove('slam');
      announce(`접힌 모서리를 읽고 타격점을 정하세요. 힘은 ${powerHint()}가 힌트입니다. ${round + 1}번째 판.`);
      render();
    }

    function reset() {
      round = 0; score = 0; flips = 0; streak = 0; bestStreak = 0; charging = false; busy = false;
      record().runs++; save(RK, records); nextTarget();
    }

    function finish() {
      const r = record(); r.bestScore = Math.max(r.bestScore, score); r.bestFlips = Math.max(r.bestFlips, flips); r.bestStreak = Math.max(r.bestStreak, bestStreak); save(RK, records);
      announce(`10판 종료 · ${score}점 · ${flips}번 뒤집기 · 최고 연속 ${bestStreak}회.`); render();
    }

    function choosePoint(e) {
      if (busy || round >= 10) return;
      const rect = card.getBoundingClientRect();
      selected = { x: Math.max(0, Math.min(100, (e.clientX - rect.left) / rect.width * 100)), y: Math.max(0, Math.min(100, (e.clientY - rect.top) / rect.height * 100)) };
      announce(`타격점을 정했습니다. 힘 힌트는 ${powerHint()}입니다. 버튼을 누르고 있다가 놓으세요.`); render();
    }

    function startCharge(e) {
      if (e) e.preventDefault(); if (busy || round >= 10 || charging) return; charging = true; slamBtn.textContent = '힘 조절 중… 놓으면 내리칩니다';
    }
    function releaseCharge(e) {
      if (e) e.preventDefault(); if (!charging || busy || round >= 10) return; charging = false; slamBtn.textContent = '누르고 있다가 놓아 내리치기 · Space'; resolveHit();
    }

    function resolveHit() {
      busy = true; round++; playerCard.classList.add('slam');
      const distance = Math.hypot(selected.x - target.x, selected.y - target.y);
      const powerError = Math.abs(charge - targetPower);
      const locationRatio = distance / P[diff].radius;
      const powerRatio = powerError / P[diff].powerWindow;
      const quality = locationRatio * .6 + powerRatio * .4;
      let message;
      if (quality <= .46) {
        flips++; streak++; bestStreak = Math.max(bestStreak, streak); score += 150 + Math.min(120, streak * 12); card.classList.add('flip'); message = `완벽한 뒤집기! 타격점과 힘이 정확했습니다. 연속 ${streak}.`;
      } else if (quality <= 1) {
        flips++; streak++; bestStreak = Math.max(bestStreak, streak); score += 85 + Math.min(70, streak * 7); card.classList.add('flip'); message = `뒤집기 성공! 연속 ${streak}.`;
      } else if (quality <= 1.32) {
        streak = 0; score += 20; message = distance > P[diff].radius ? '모서리는 맞췄지만 타격점이 조금 멀어 딱지가 들리기만 했습니다.' : '타격점은 좋았지만 힘이 어긋나 딱지가 들리기만 했습니다.';
      } else {
        streak = 0; message = distance > P[diff].radius ? '타격점이 들린 모서리에서 너무 멀었습니다.' : '힘이 크게 어긋나 뒤집지 못했습니다.';
      }
      announce(message); render();
      setTimeout(() => { busy = false; playerCard.classList.remove('slam'); if (round >= 10) finish(); else nextTarget(); }, 780);
    }

    function loop(now) {
      const dt = Math.min(.034, Math.max(0, (now - last) / 1000)); last = now;
      if (charging) { charge += chargeDir * P[diff].chargeSpeed * dt; if (charge >= 100) { charge = 100; chargeDir = -1; } else if (charge <= 30) { charge = 30; chargeDir = 1; } render(); }
      frame = requestAnimationFrame(loop);
    }
    function keyDown(e) { if (!surface.isConnected || e.repeat || e.code !== 'Space') return; e.preventDefault(); startCharge(e); }
    function keyUp(e) { if (!surface.isConnected || e.code !== 'Space') return; e.preventDefault(); releaseCharge(e); }

    card.addEventListener('pointerdown', choosePoint); slamBtn.addEventListener('pointerdown', startCharge); slamBtn.addEventListener('pointerup', releaseCharge); slamBtn.addEventListener('pointercancel', releaseCharge); window.addEventListener('pointerup', releaseCharge);
    window.addEventListener('keydown', keyDown, true); window.addEventListener('keyup', keyUp, true);
    $('[data-act="new"]').addEventListener('click', reset); sel.addEventListener('change', () => { diff = P[sel.value] ? sel.value : 'normal'; save(PK, { difficulty: diff }); reset(); });

    const observer = new MutationObserver(() => { if (surface.isConnected) return; cancelAnimationFrame(frame); window.removeEventListener('pointerup', releaseCharge); window.removeEventListener('keydown', keyDown, true); window.removeEventListener('keyup', keyUp, true); observer.disconnect(); });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    reset(); frame = requestAnimationFrame(loop);
  }

  function scan() { document.querySelectorAll('#playSurface[data-game-id="' + ID + '"]').forEach(mount); }
  new MutationObserver(scan).observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-game-id'] });
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', scan) : scan();
})();