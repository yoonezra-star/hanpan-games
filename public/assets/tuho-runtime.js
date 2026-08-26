(function () {
  const ID = 'tuho';
  const RK = 'hanpan-tuho-records-v4';
  const PK = 'hanpan-tuho-prefs-v4';
  const P = {
    easy: { label: '쉬움', wind: 3, opening: 10.5, chargeSpeed: 50 },
    normal: { label: '보통', wind: 6, opening: 8, chargeSpeed: 60 },
    hard: { label: '어려움', wind: 9, opening: 6, chargeSpeed: 70 }
  };

  function load(key, fallback) {
    try { return Object.assign({}, fallback, JSON.parse(localStorage.getItem(key) || '{}')); }
    catch (e) { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }

  function mount(surface) {
    if (!surface || surface.dataset.gameId !== ID || surface.querySelector('.th4')) return;
    const prefs = load(PK, { difficulty: 'normal' });
    let diff = P[prefs.difficulty] ? prefs.difficulty : 'normal';
    const records = load(RK, {});
    let score = 0, throws = 0, hits = 0, bulls = 0, streak = 0;
    let wind = 0, charge = 35, chargeDir = 1, charging = false, projectile = null;
    let currentTrail = [], previousTrail = [];
    let last = performance.now(), frame = 0, busy = false, lastShot = '기준 궤적을 만들어 보세요';

    function record() {
      if (!records[diff]) records[diff] = { runs: 0, bestScore: 0, bestHits: 0, bestBullseyes: 0 };
      return records[diff];
    }

    surface.innerHTML = `
      <style>
        .th4{max-width:720px;margin:auto;display:grid;gap:12px;text-align:center}
        .th4-hud,.th4-actions{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;align-items:center}
        .th4-hud span,.th4-hud strong,.th4-records span{padding:7px 10px;border-radius:999px;background:rgba(29,36,51,.07)}
        .th4-field{position:relative;min-height:370px;border-radius:22px;overflow:hidden;border:1px solid #d8d2c5;background:linear-gradient(#dff5ff 0 62%,#e7d1a5 62%);touch-action:none}
        .th4-field:after{content:"";position:absolute;left:0;right:0;bottom:55px;height:2px;background:#b7925d}
        .th4-pot{position:absolute;left:82%;top:57%;width:86px;height:116px;transform:translateX(-50%);background:linear-gradient(90deg,#914523,#c9793e,#8d3f21);border-radius:16px 16px 34px 34px;box-shadow:inset 0 0 0 4px rgba(74,35,20,.2);z-index:2}
        .th4-pot:before{content:"";position:absolute;left:50%;top:-10px;width:70px;height:22px;transform:translateX(-50%);border-radius:50%;background:#321c13;box-shadow:0 0 0 7px #b86132}
        .th4-pot:after{content:"목표";position:absolute;left:50%;top:-43px;transform:translateX(-50%);font-size:.74rem;font-weight:900;color:#6d4026}
        .th4-thrower{position:absolute;left:7%;bottom:55px;font-size:50px;transform:translateX(-50%)}
        .th4-arrow{position:absolute;width:66px;height:6px;background:#56351f;border-radius:6px;transform-origin:50% 50%;z-index:4;display:none}
        .th4-arrow:after{content:"➤";position:absolute;right:-12px;top:-10px;font-size:22px;color:#56351f}
        .th4-trail{position:absolute;width:6px;height:6px;border-radius:50%;background:rgba(86,53,31,.36);z-index:1}
        .th4-trail.prev{width:5px;height:5px;background:rgba(57,105,171,.28);outline:1px solid rgba(57,105,171,.18)}
        .th4-wind{position:absolute;left:50%;top:16px;transform:translateX(-50%);padding:7px 12px;border-radius:999px;background:#ffffffdc;font-weight:900;z-index:5}
        .th4-shot{position:absolute;left:50%;bottom:12px;transform:translateX(-50%);padding:6px 10px;border-radius:999px;background:#ffffffcf;font-size:.8rem;font-weight:800;z-index:5;white-space:nowrap}
        .th4-angle{display:grid;gap:6px;text-align:left;max-width:520px;margin:auto;width:100%}.th4-angle input{width:100%}
        .th4-charge{position:relative;height:24px;border-radius:14px;background:linear-gradient(90deg,#d95b50,#f1c44c 35%,#55b96b 58%,#f1c44c 76%,#d95b50);overflow:hidden}
        .th4-charge i{position:absolute;top:0;bottom:0;width:5px;background:#fff;box-shadow:0 0 0 2px #222;transform:translateX(-50%)}
        .th4-help{font-size:.92rem;color:#566070}.th4 button,.th4 select{min-height:44px}
        @media(max-width:600px){.th4-field{min-height:325px}.th4-pot{left:83%;transform:translateX(-50%) scale(.82);transform-origin:bottom}.th4-shot{max-width:88%;overflow:hidden;text-overflow:ellipsis}.th4-actions .button{flex:1 1 135px}}
      </style>
      <div class="th4">
        <div class="th4-hud"><strong data-v="score">0점</strong><span data-v="throws">0/10발</span><span data-v="hits">명중 0</span><span data-v="bulls">정중앙 0</span></div>
        <div class="th4-actions"><label>난이도 <select data-v="diff"><option value="easy">쉬움</option><option value="normal">보통</option><option value="hard">어려움</option></select></label><button class="button secondary" data-act="new" type="button">새 10발</button></div>
        <div class="th4-field" aria-label="바람과 직전 궤적을 비교하며 화살을 항아리에 넣는 투호 게임 영역"><div class="th4-wind"></div><div class="th4-shot"></div><div class="th4-thrower" aria-hidden="true">🧍</div><div class="th4-pot" aria-hidden="true"></div><div class="th4-arrow" aria-hidden="true"></div></div>
        <label class="th4-angle">던지는 각도 <strong data-v="angleText">45°</strong><input data-v="angle" type="range" min="28" max="62" value="45" aria-label="투호 던지는 각도"></label>
        <div class="th4-charge" aria-label="투호 힘 게이지"><i></i></div>
        <button class="button primary" data-act="throw" type="button">누르고 있다가 놓아 던지기 · Space</button>
        <div class="th4-records"></div><p class="th4-help">갈색 점은 현재 화살, 파란 점은 직전 화살 궤적입니다. 같은 조건에서 한 변수씩 바꾸며 항아리 입구에 맞추세요.</p>
      </div>`;

    const $ = (q) => surface.querySelector(q);
    const field = $('.th4-field'), arrow = $('.th4-arrow'), chargeNeedle = $('.th4-charge i');
    const angle = $('[data-v="angle"]'), sel = $('[data-v="diff"]'), throwBtn = $('[data-act="throw"]');
    sel.value = diff;

    function announce(text) { const o = document.querySelector('#playResult'); if (o) o.textContent = text; }
    function setWind() {
      wind = Math.round((Math.random() * 2 - 1) * P[diff].wind);
      $('.th4-wind').textContent = wind > 0 ? `순풍 → ${wind}` : wind < 0 ? `맞바람 ← ${Math.abs(wind)}` : '바람 없음';
    }
    function render() {
      const r = record();
      $('[data-v="score"]').textContent = score + '점';
      $('[data-v="throws"]').textContent = throws + '/10발';
      $('[data-v="hits"]').textContent = '명중 ' + hits;
      $('[data-v="bulls"]').textContent = '정중앙 ' + bulls;
      $('[data-v="angleText"]').textContent = angle.value + '°';
      $('.th4-shot').textContent = lastShot;
      chargeNeedle.style.left = charge + '%';
      $('.th4-records').innerHTML = `<span>${P[diff].label} 최고 ${r.bestScore}점</span><span>최다 명중 ${r.bestHits}/10</span><span>최다 정중앙 ${r.bestBullseyes}</span>`;
      throwBtn.disabled = throws >= 10 || !!projectile || busy;
      angle.disabled = throws >= 10 || !!projectile || busy;
    }
    function clearTrails() {
      previousTrail.concat(currentTrail).forEach((n) => n.remove());
      previousTrail = []; currentTrail = [];
    }
    function archiveTrail() {
      previousTrail.forEach((n) => n.remove());
      previousTrail = currentTrail;
      previousTrail.forEach((n) => n.classList.add('prev'));
      currentTrail = [];
    }
    function reset() {
      score = 0; throws = 0; hits = 0; bulls = 0; streak = 0; charge = 35; chargeDir = 1; charging = false; projectile = null; busy = false; lastShot = '첫 화살로 기준 궤적을 만들어 보세요';
      record().runs++; save(RK, records); clearTrails(); arrow.style.display = 'none'; setWind(); render();
      announce(`${P[diff].label} 투호 시작. 각도와 힘을 정하고 궤적을 비교해 10발을 던지세요.`);
    }
    function finish() {
      const r = record();
      r.bestScore = Math.max(r.bestScore, score); r.bestHits = Math.max(r.bestHits, hits); r.bestBullseyes = Math.max(r.bestBullseyes, bulls); save(RK, records);
      lastShot = `종료 · ${score}점 · ${hits}발 명중`;
      announce(`10발 종료 · ${score}점 · 명중 ${hits}발 · 정중앙 ${bulls}발.`); render();
    }
    function startCharge(e) {
      if (e) e.preventDefault();
      if (throws >= 10 || projectile || busy || charging) return;
      charging = true; throwBtn.textContent = '힘 조절 중… 놓으면 던집니다';
    }
    function releaseCharge(e) {
      if (e) e.preventDefault();
      if (!charging || projectile || throws >= 10) return;
      charging = false; throwBtn.textContent = '누르고 있다가 놓아 던지기 · Space'; launch();
    }
    function launch() {
      archiveTrail();
      const rad = Number(angle.value) * Math.PI / 180;
      const power = charge;
      const speed = power * .96;
      projectile = { x: 8, y: 78, px: 8, py: 78, vx: Math.cos(rad) * speed, vy: -Math.sin(rad) * speed * 1.08 };
      throws++; arrow.style.display = 'block'; busy = false;
      lastShot = `${throws}발째 · ${angle.value}° · 힘 ${Math.round(power)} · 바람 ${wind}`;
      announce(`${throws}번째 화살 · 각도 ${angle.value}°, 힘 ${Math.round(power)}. 직전 파란 궤적과 비교하세요.`); render();
    }
    function settle(points, text) {
      if (!projectile) return;
      if (points > 0) { hits++; streak++; if (points === 100) bulls++; score += points + Math.min(30, Math.max(0, streak - 1) * 5); }
      else streak = 0;
      projectile = null; arrow.style.display = 'none'; busy = true;
      lastShot = points ? `${points}점 · ${text.replace(/!.*$/, '!')}` : text;
      announce(text);
      if (throws >= 10) { busy = false; finish(); return; }
      setTimeout(() => { busy = false; setWind(); render(); }, 700);
      render();
    }
    function judgeAtPot() {
      const openingY = 59;
      const error = Math.abs(projectile.y - openingY);
      const open = P[diff].opening;
      if (projectile.vy <= 0) { settle(0, '항아리 위를 상승하며 지나갔습니다. 힘을 줄이거나 각도를 낮춰 보세요.'); return; }
      if (error <= open * .28) settle(100, '정중앙! 항아리 입구 한가운데로 들어갔습니다.');
      else if (error <= open * .62) settle(60, '명중! 항아리 안으로 들어갔습니다.');
      else if (error <= open) settle(30, '가장자리 명중! 다음 화살에서 조금만 보정하세요.');
      else settle(0, projectile.y < openingY ? '항아리 위로 높게 빗나갔습니다. 각도나 힘을 낮춰 보세요.' : '항아리 전에 너무 낮아졌습니다. 힘이나 각도를 조금 올려 보세요.');
    }
    function addTrailPoint() {
      if (!projectile || currentTrail.length > 24) return;
      const dot = document.createElement('i'); dot.className = 'th4-trail'; dot.style.left = projectile.x + '%'; dot.style.top = projectile.y + '%'; field.appendChild(dot); currentTrail.push(dot);
    }
    function updateProjectile(dt) {
      if (!projectile) return;
      projectile.px = projectile.x; projectile.py = projectile.y;
      projectile.vx += wind * 1.55 * dt; projectile.vy += 88 * dt;
      projectile.x += projectile.vx * dt; projectile.y += projectile.vy * dt;
      if (Math.random() < .38) addTrailPoint();
      arrow.style.left = projectile.x + '%'; arrow.style.top = projectile.y + '%';
      arrow.style.transform = `translate(-50%,-50%) rotate(${Math.atan2(projectile.vy, projectile.vx) * 180 / Math.PI}deg)`;
      if (projectile.px < 82 && projectile.x >= 82) { judgeAtPot(); return; }
      if (projectile.y > 94 || projectile.x > 106 || projectile.x < -5) settle(0, '화살이 항아리까지 가지 못했습니다. 직전 궤적과 비교해 보정하세요.');
    }
    function loop(now) {
      const dt = Math.min(.034, Math.max(0, (now - last) / 1000)); last = now;
      if (charging) { charge += chargeDir * P[diff].chargeSpeed * dt; if (charge >= 100) { charge = 100; chargeDir = -1; } else if (charge <= 35) { charge = 35; chargeDir = 1; } }
      updateProjectile(dt); render(); frame = requestAnimationFrame(loop);
    }
    function keyDown(e) { if (!surface.isConnected || e.repeat || e.code !== 'Space') return; e.preventDefault(); startCharge(e); }
    function keyUp(e) { if (!surface.isConnected || e.code !== 'Space') return; e.preventDefault(); releaseCharge(e); }

    angle.addEventListener('input', render); sel.addEventListener('change', () => { diff = P[sel.value] ? sel.value : 'normal'; save(PK, { difficulty: diff }); reset(); });
    $('[data-act="new"]').addEventListener('click', reset);
    throwBtn.addEventListener('pointerdown', startCharge); throwBtn.addEventListener('pointerup', releaseCharge); throwBtn.addEventListener('pointercancel', releaseCharge);
    window.addEventListener('pointerup', releaseCharge); window.addEventListener('keydown', keyDown, true); window.addEventListener('keyup', keyUp, true);

    const observer = new MutationObserver(() => { if (surface.isConnected) return; cancelAnimationFrame(frame); clearTrails(); window.removeEventListener('pointerup', releaseCharge); window.removeEventListener('keydown', keyDown, true); window.removeEventListener('keyup', keyUp, true); observer.disconnect(); });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    reset(); frame = requestAnimationFrame(loop);
  }

  function scan() { document.querySelectorAll('#playSurface[data-game-id="' + ID + '"]').forEach(mount); }
  new MutationObserver(scan).observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-game-id'] });
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', scan) : scan();
})();