(function () {
  const ID = 'ddakji-flip';
  const RK = 'hanpan-ddakji-records-v3';
  const PK = 'hanpan-ddakji-prefs-v3';
  const P = {
    easy: { label: '쉬움', radius: 25, powerWindow: 15, chargeSpeed: 50 },
    normal: { label: '보통', radius: 19, powerWindow: 11, chargeSpeed: 62 },
    hard: { label: '어려움', radius: 14, powerWindow: 8, chargeSpeed: 76 }
  };

  function load(key, fallback) {
    try { return Object.assign({}, fallback, JSON.parse(localStorage.getItem(key) || '{}')); }
    catch (e) { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }

  function mount(surface) {
    if (!surface || surface.dataset.gameId !== ID || surface.querySelector('.dj3')) return;
    const prefs = load(PK, { difficulty: 'normal' });
    let diff = P[prefs.difficulty] ? prefs.difficulty : 'normal';
    const records = load(RK, {});
    let round = 0, score = 0, flips = 0, streak = 0, bestStreak = 0;
    let target = { x: 18, y: 18 }, selected = { x: 50, y: 50 }, targetPower = 70;
    let charge = 30, chargeDir = 1, charging = false, busy = false, frame = 0, last = performance.now();

    function record() {
      if (!records[diff]) records[diff] = { runs: 0, bestScore: 0, bestFlips: 0, bestStreak: 0 };
      return records[diff];
    }

    surface.innerHTML = `
      <style>
        .dj3{max-width:700px;margin:auto;display:grid;gap:12px;text-align:center}
        .dj3-hud,.dj3-actions{display:flex;gap:8px;justify-content:center;align-items:center;flex-wrap:wrap}
        .dj3-hud span,.dj3-hud strong,.dj3-records span{padding:7px 10px;border-radius:999px;background:rgba(29,36,51,.07)}
        .dj3-yard{position:relative;min-height:390px;border-radius:22px;overflow:hidden;background:linear-gradient(#f8f1dd,#e4c58e);border:1px solid #d5c29d;touch-action:manipulation}
        .dj3-yard:before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent 0 53px,rgba(101,74,38,.08) 54px 56px)}
        .dj3-opponent{position:absolute;left:50%;top:42%;width:min(46vw,260px);height:min(46vw,260px);max-width:260px;max-height:260px;min-width:190px;min-height:190px;transform:translate(-50%,-50%) rotate(3deg);background:linear-gradient(135deg,#c73c33 0 48%,#f4c24b 49% 52%,#2d65ae 53%);border:8px solid #f8e9c4;border-radius:16px;box-shadow:0 18px 30px rgba(72,45,20,.22);cursor:crosshair;transition:transform .45s cubic-bezier(.2,.8,.2,1),filter .25s;z-index:2}
        .dj3-opponent:after{content:"상대 딱지";position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);padding:6px 10px;border-radius:999px;background:#ffffffd9;font-weight:900;color:#283246;pointer-events:none}
        .dj3-opponent.flip{transform:translate(-50%,-50%) rotate(3deg) rotateY(180deg) scale(.92);filter:brightness(1.15)}
        .dj3-target,.dj3-selected{position:absolute;width:26px;height:26px;border-radius:50%;transform:translate(-50%,-50%);pointer-events:none;z-index:5}
        .dj3-target{background:#ffd84f;box-shadow:0 0 0 6px rgba(255,216,79,.24),0 0 0 2px #8a6514}.dj3-target:after{content:"들림";position:absolute;left:50%;top:-25px;transform:translateX(-50%);font-size:.72rem;font-weight:900;white-space:nowrap;color:#6b5010}
        .dj3-selected{border:4px solid #fff;background:#1e8d64;box-shadow:0 0 0 2px #1b4b3c}
        .dj3-player{position:absolute;left:50%;bottom:18px;width:128px;height:128px;border-radius:14px;background:linear-gradient(135deg,#245ea8,#f3c34d);border:6px solid #fff0c8;box-shadow:0 12px 20px rgba(55,35,18,.2);transform:translateX(-50%) rotate(-8deg);transition:transform .2s ease;z-index:3}
        .dj3-player.slam{transform:translateX(-50%) translateY(-170px) rotate(20deg) scale(.88)}
        .dj3-power{position:relative;height:28px;border-radius:16px;background:linear-gradient(90deg,#d9584e,#f1c24b,#53b66a,#f1c24b,#d9584e);overflow:hidden}.dj3-power .sweet{position:absolute;top:0;bottom:0;background:rgba(255,255,255,.32);border:2px solid rgba(255,255,255,.8);border-radius:12px}.dj3-power .needle{position:absolute;top:-4px;height:36px;width:6px;background:#fff;box-shadow:0 0 0 2px #222;transform:translateX(-50%)}
        .dj3-help{font-size:.92rem;color:#566070}.dj3 button,.dj3 select{min-height:44px}
        @media(max-width:600px){.dj3-yard{min-height:340px}.dj3-player{width:105px;height:105px}.dj3-actions .button{flex:1 1 130px}}
      </style>
      <div class="dj3">
        <div class="dj3-hud"><strong data-v="score">0점</strong><span data-v="round">0/10판</span><span data-v="flips">뒤집기 0</span><span data-v="streak">연속 0</span></div>
        <div class="dj3-actions"><label>난이도 <select data-v="diff"><option value="easy">쉬움</option><option value="normal">보통</option><option value="hard">어려움</option></select></label><button class="button secondary" data-act="new" type="button">새 10판</button></div>
        <div class="dj3-yard" aria-label="들린 모서리를 보고 타격 위치를 고른 뒤 힘을 맞춰 딱지를 뒤집는 게임 영역"><div class="dj3-opponent" data-act="card"><i class="dj3-target"></i><i class="dj3-selected"></i></div><div class="dj3-player" aria-hidden="true"></div></div>
        <div class="dj3-power" aria-label="딱지치기 힘 게이지"><i class="sweet"></i><i class="needle"></i></div>
        <button class="button primary" data-act="slam" type="button">누르고 있다가 놓아 내리치기 · Space</button>
        <div class="dj3-records"></div><p class="dj3-help">노란 ‘들림’ 표시 근처를 먼저 찍고, 아래 힘 게이지의 밝은 구간에서 버튼을 놓으세요. 위치와 힘이 모두 맞아야 안정적으로 뒤집힙니다.</p>
      </div>`;

    const $ = (q) => surface.querySelector(q);
    const card = $('[data-act="card"]'), targetMark = $('.dj3-target'), selectedMark = $('.dj3-selected');
    const sweet = $('.dj3-power .sweet'), needle = $('.dj3-power .needle'), slamBtn = $('[data-act="slam"]'), playerCard = $('.dj3-player'), sel = $('[data-v="diff"]');
    sel.value = diff;

    function announce(text) { const o = document.querySelector('#playResult'); if (o) o.textContent = text; }
    function render() {
      const r = record();
      $('[data-v="score"]').textContent = score + '점'; $('[data-v="round"]').textContent = round + '/10판'; $('[data-v="flips"]').textContent = '뒤집기 ' + flips; $('[data-v="streak"]').textContent = '연속 ' + streak + ' · 최고 ' + bestStreak;
      targetMark.style.left = target.x + '%'; targetMark.style.top = target.y + '%'; selectedMark.style.left = selected.x + '%'; selectedMark.style.top = selected.y + '%';
      needle.style.left = charge + '%'; const w = P[diff].powerWindow; sweet.style.left = Math.max(0, targetPower - w) + '%'; sweet.style.width = Math.min(100, targetPower + w) - Math.max(0, targetPower - w) + '%';
      $('.dj3-records').innerHTML = `<span>${P[diff].label} 최고 ${r.bestScore}점</span><span>최다 뒤집기 ${r.bestFlips}/10</span><span>최고 연속 ${r.bestStreak}</span>`;
      slamBtn.disabled = round >= 10 || busy;
    }

    function nextTarget() {
      const edges = [
        () => ({ x: 12 + Math.random() * 24, y: 11 + Math.random() * 12 }),
        () => ({ x: 64 + Math.random() * 24, y: 11 + Math.random() * 12 }),
        () => ({ x: 12 + Math.random() * 24, y: 77 + Math.random() * 12 }),
        () => ({ x: 64 + Math.random() * 24, y: 77 + Math.random() * 12 })
      ];
      target = edges[Math.floor(Math.random() * edges.length)]();
      selected = { x: 50, y: 50 };
      targetPower = 52 + Math.random() * 35;
      charge = 30; chargeDir = 1;
      card.classList.remove('flip'); playerCard.classList.remove('slam');
      announce(`들린 모서리를 탭해 타격점을 잡고 힘을 맞추세요. ${round + 1}번째 판입니다.`);
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
      announce('타격점을 정했습니다. 힘 버튼을 누르고 있다가 밝은 구간에서 놓으세요.'); render();
    }

    function startCharge(e) {
      if (e) e.preventDefault(); if (busy || round >= 10 || charging) return; charging = true; slamBtn.textContent = '힘 조절 중… 놓으면 내리칩니다';
    }
    function releaseCharge(e) {
      if (e) e.preventDefault(); if (!charging || busy || round >= 10) return; charging = false; slamBtn.textContent = '누르고 있다가 놓아 내리치기 · Space'; resolveHit();
    }

    function resolveHit() {
      busy = true; round++;
      playerCard.classList.add('slam');
      const distance = Math.hypot(selected.x - target.x, selected.y - target.y);
      const powerError = Math.abs(charge - targetPower);
      const locationRatio = distance / P[diff].radius;
      const powerRatio = powerError / P[diff].powerWindow;
      const quality = locationRatio * .58 + powerRatio * .42;
      let message;
      if (quality <= .48) {
        flips++; streak++; bestStreak = Math.max(bestStreak, streak); score += 140 + Math.min(120, streak * 12); card.classList.add('flip'); message = `완벽한 뒤집기! 타격점과 힘이 정확했습니다. 연속 ${streak}.`;
      } else if (quality <= 1) {
        flips++; streak++; bestStreak = Math.max(bestStreak, streak); score += 80 + Math.min(70, streak * 7); card.classList.add('flip'); message = `뒤집기 성공! 연속 ${streak}.`;
      } else if (quality <= 1.35) {
        streak = 0; score += 20; message = distance > P[diff].radius ? '모서리에서 조금 벗어나 딱지가 들리기만 했습니다.' : '힘이 어긋나 딱지가 들리기만 했습니다.';
      } else {
        streak = 0; message = distance > P[diff].radius ? '타격 위치가 들린 모서리와 너무 멀었습니다.' : '힘 타이밍을 놓쳐 뒤집지 못했습니다.';
      }
      announce(message); render();
      setTimeout(() => { busy = false; playerCard.classList.remove('slam'); if (round >= 10) finish(); else nextTarget(); }, 760);
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