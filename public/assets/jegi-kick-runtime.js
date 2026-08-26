(function () {
  const ID = 'jegi-kick';
  const RK = 'hanpan-jegi-records-v3';
  const PK = 'hanpan-jegi-prefs-v3';
  const P = {
    easy: { label: '쉬움', time: 50, gravity: 178, launch: 118, drift: 11, good: 15, perfect: 6 },
    normal: { label: '보통', time: 45, gravity: 194, launch: 124, drift: 16, good: 12, perfect: 5 },
    hard: { label: '어려움', time: 40, gravity: 214, launch: 132, drift: 22, good: 9, perfect: 4 }
  };

  function load(key, fallback) {
    try { return Object.assign({}, fallback, JSON.parse(localStorage.getItem(key) || '{}')); }
    catch (e) { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }

  function mount(surface) {
    if (!surface || surface.dataset.gameId !== ID || surface.querySelector('.jg3')) return;

    const prefs = load(PK, { difficulty: 'normal' });
    let diff = P[prefs.difficulty] ? prefs.difficulty : 'normal';
    const records = load(RK, {});
    let running = false;
    let paused = false;
    let x = 50;
    let y = 72;
    let vx = 0;
    let vy = 0;
    let score = 0;
    let streak = 0;
    let bestStreak = 0;
    let misses = 0;
    let chances = 0;
    let successes = 0;
    let perfects = 0;
    let timeLeft = P[diff].time;
    let last = performance.now();
    let frame = 0;
    let respawnTimer = 0;

    function record() {
      if (!records[diff]) records[diff] = { runs: 0, bestStreak: 0, bestScore: 0, bestAccuracy: 0, bestPerfects: 0 };
      return records[diff];
    }

    surface.innerHTML = `
      <style>
        .jg3{max-width:680px;margin:auto;display:grid;gap:12px;text-align:center}
        .jg3-hud,.jg3-actions{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;align-items:center}
        .jg3-hud span,.jg3-hud strong,.jg3-records span{padding:7px 10px;border-radius:999px;background:rgba(29,36,51,.07)}
        .jg3-arena{position:relative;min-height:390px;overflow:hidden;border-radius:22px;background:linear-gradient(#dff5ff 0 58%,#f3e4bd 58%);border:1px solid #d8d2c5;touch-action:manipulation;user-select:none}
        .jg3-arena:before{content:"";position:absolute;left:0;right:0;bottom:70px;height:2px;background:#caa66a}
        .jg3-kick-zone{position:absolute;left:18%;right:18%;bottom:54px;height:90px;border-radius:24px;background:linear-gradient(180deg,rgba(85,185,107,.05),rgba(85,185,107,.22));border:2px dashed rgba(44,130,68,.35)}
        .jg3-kick-zone:after{content:"차기 구간";position:absolute;right:10px;bottom:8px;font-size:.8rem;font-weight:800;color:#357a48}
        .jg3-jegi{position:absolute;width:38px;height:46px;transform:translate(-50%,-50%);z-index:3;filter:drop-shadow(0 7px 6px rgba(0,0,0,.18))}
        .jg3-jegi .core{position:absolute;left:7px;bottom:0;width:24px;height:15px;border-radius:50%;background:#202736;border:3px solid #f5c347}
        .jg3-jegi .r{position:absolute;left:17px;bottom:13px;width:5px;height:30px;border-radius:5px;background:#dc4a3a;box-shadow:-10px -1px 0 #2877b9,10px 2px 0 #f5b82e,5px -4px 0 #278a62;transform-origin:bottom}
        .jg3-shadow{position:absolute;width:70px;height:16px;border-radius:50%;background:rgba(29,36,51,.13);transform:translateX(-50%);bottom:63px;z-index:1}
        .jg3-foot{position:absolute;left:50%;bottom:44px;width:118px;height:38px;border-radius:25px 35px 18px 18px;background:#fff;border:4px solid #1d2433;transform:translateX(-50%) rotate(-4deg);z-index:2;transition:transform .08s ease}
        .jg3-foot.kick{transform:translateX(-50%) translateY(-22px) rotate(-18deg)}
        .jg3-guide{font-size:.92rem;color:#566070}
        .jg3 button,.jg3 select{min-height:44px}
        @media(max-width:600px){.jg3-arena{min-height:340px}.jg3-kick-zone{left:8%;right:8%}.jg3-actions .button{flex:1 1 130px}}
      </style>
      <div class="jg3">
        <div class="jg3-hud">
          <strong data-v="score">0점</strong><span data-v="time">-</span><span data-v="streak">연속 0</span><span data-v="miss">실수 0/3</span>
        </div>
        <div class="jg3-actions">
          <label>난이도 <select data-v="diff"><option value="easy">쉬움</option><option value="normal">보통</option><option value="hard">어려움</option></select></label>
          <button class="button secondary" data-act="new" type="button">새 도전</button>
        </div>
        <div class="jg3-arena" data-act="arena" aria-label="떠오른 제기가 내려올 때 차는 제기차기 게임 영역">
          <div class="jg3-kick-zone"></div><div class="jg3-shadow"></div>
          <div class="jg3-jegi" aria-hidden="true"><i class="r"></i><i class="core"></i></div>
          <div class="jg3-foot" aria-hidden="true"></div>
        </div>
        <button class="button primary" data-act="kick" type="button">제기 차기 · Space</button>
        <div class="jg3-records"></div>
        <p class="jg3-guide">제기가 내려오며 초록 차기 구간에 들어왔을 때 누르세요. 중심에 가까울수록 높고 안정적으로 다시 떠오릅니다.</p>
      </div>`;

    const $ = (q) => surface.querySelector(q);
    const sel = $('[data-v="diff"]');
    const arena = $('[data-act="arena"]');
    const jegi = $('.jg3-jegi');
    const shadow = $('.jg3-shadow');
    const foot = $('.jg3-foot');
    const kickButton = $('[data-act="kick"]');
    const newButton = $('[data-act="new"]');
    sel.value = diff;

    function announce(text) {
      const out = document.querySelector('#playResult');
      if (out) out.textContent = text;
    }

    function render() {
      const r = record();
      $('[data-v="score"]').textContent = score + '점';
      $('[data-v="time"]').textContent = Math.max(0, Math.ceil(timeLeft)) + '초';
      $('[data-v="streak"]').textContent = '연속 ' + streak + ' · 최고 ' + bestStreak;
      $('[data-v="miss"]').textContent = '실수 ' + misses + '/3';
      $('.jg3-records').innerHTML = `<span>${P[diff].label} 최고 ${r.bestScore}점</span><span>최고 연속 ${r.bestStreak}</span><span>최고 정확도 ${r.bestAccuracy}%</span><span>최다 완벽 ${r.bestPerfects}</span>`;
      kickButton.disabled = !running || paused;
    }

    function positionObjects() {
      jegi.style.left = x + '%';
      jegi.style.top = y + '%';
      shadow.style.left = x + '%';
      const scale = Math.max(.45, Math.min(1.15, 1.15 - (72 - y) / 90));
      shadow.style.transform = `translateX(-50%) scale(${scale})`;
      jegi.style.transform = `translate(-50%,-50%) rotate(${vx * 1.4}deg)`;
    }

    function launch() {
      x = 50 + (Math.random() - .5) * 6;
      y = 72;
      vy = -P[diff].launch;
      vx = (Math.random() - .5) * P[diff].drift;
      positionObjects();
    }

    function startRun() {
      clearTimeout(respawnTimer);
      score = 0; streak = 0; bestStreak = 0; misses = 0; chances = 0; successes = 0; perfects = 0;
      timeLeft = P[diff].time;
      running = true; paused = false;
      record().runs++;
      save(RK, records);
      last = performance.now();
      launch();
      announce(`${P[diff].label} 제기차기 시작! 내려오는 제기를 차기 구간에서 맞히세요.`);
      render();
    }

    function finish(reason) {
      if (!running) return;
      running = false;
      clearTimeout(respawnTimer);
      const accuracy = chances ? Math.round(successes / chances * 100) : 0;
      const r = record();
      r.bestScore = Math.max(r.bestScore, score);
      r.bestStreak = Math.max(r.bestStreak, bestStreak);
      r.bestAccuracy = Math.max(r.bestAccuracy, accuracy);
      r.bestPerfects = Math.max(r.bestPerfects, perfects);
      save(RK, records);
      announce(`${reason} · ${score}점 · 최고 연속 ${bestStreak}회 · 정확도 ${accuracy}%`);
      render();
    }

    function miss(reason) {
      if (!running) return;
      chances++;
      misses++;
      streak = 0;
      score = Math.max(0, score - 12);
      announce(reason + ` 실수 ${misses}/3.`);
      if (misses >= 3) {
        finish('세 번 놓쳐 도전을 마쳤습니다');
        return;
      }
      vy = 0;
      y = 90;
      render();
      clearTimeout(respawnTimer);
      respawnTimer = setTimeout(() => { if (running) launch(); }, 520);
    }

    function kick() {
      if (!running || paused) return;
      foot.classList.add('kick');
      setTimeout(() => foot.classList.remove('kick'), 100);

      if (vy <= 0 || y < 56 || y > 84) {
        miss(vy <= 0 ? '제기가 아직 올라가는 중입니다.' : '발 높이를 벗어났습니다.');
        return;
      }

      chances++;
      const distance = Math.abs(y - 72);
      if (distance <= P[diff].perfect) {
        successes++;
        perfects++;
        streak++;
        bestStreak = Math.max(bestStreak, streak);
        score += 35 + Math.min(50, streak * 4);
        vy = -P[diff].launch - Math.min(18, streak * 1.2);
        vx += (Math.random() - .5) * P[diff].drift * .45;
        announce(`완벽한 발등 타격! ${streak}회 연속.`);
      } else if (distance <= P[diff].good) {
        successes++;
        streak++;
        bestStreak = Math.max(bestStreak, streak);
        score += 20 + Math.min(30, streak * 2);
        vy = -P[diff].launch * .96;
        vx += (Math.random() - .5) * P[diff].drift * .7;
        announce(`받아냈습니다. ${streak}회 연속.`);
      } else {
        miss('발끝에 빗맞았습니다.');
        return;
      }
      render();
    }

    function loop(now) {
      const dt = Math.min(.034, Math.max(0, (now - last) / 1000));
      last = now;
      if (running && !paused) {
        timeLeft -= dt;
        vy += P[diff].gravity * dt;
        y += vy * dt;
        x += vx * dt;
        vx *= Math.pow(.988, dt * 60);
        if (x < 18) { x = 18; vx = Math.abs(vx) * .8; }
        if (x > 82) { x = 82; vx = -Math.abs(vx) * .8; }
        if (y > 88) miss('제기가 땅에 떨어졌습니다.');
        if (timeLeft <= 0) finish('제한 시간을 마쳤습니다');
        positionObjects();
        render();
      }
      frame = requestAnimationFrame(loop);
    }

    function onKeyDown(e) {
      if (!surface.isConnected || e.repeat) return;
      if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault();
        kick();
      }
    }
    function onVisibility() {
      if (!running) return;
      paused = document.hidden;
      if (!paused) last = performance.now();
      announce(paused ? '탭을 벗어나 잠시 멈췄습니다.' : '제기차기를 이어갑니다.');
      render();
    }

    kickButton.addEventListener('click', kick);
    arena.addEventListener('pointerdown', (e) => { e.preventDefault(); kick(); });
    newButton.addEventListener('click', startRun);
    sel.addEventListener('change', () => {
      diff = P[sel.value] ? sel.value : 'normal';
      save(PK, { difficulty: diff });
      startRun();
    });
    window.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('visibilitychange', onVisibility);

    const observer = new MutationObserver(() => {
      if (surface.isConnected) return;
      cancelAnimationFrame(frame);
      clearTimeout(respawnTimer);
      window.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('visibilitychange', onVisibility);
      observer.disconnect();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    render();
    positionObjects();
    announce('난이도를 고르고 새 도전을 누르세요. 제기가 내려올 때 발등으로 차는 타이밍 게임입니다.');
    frame = requestAnimationFrame(loop);
  }

  function scan() {
    document.querySelectorAll('#playSurface[data-game-id="' + ID + '"]').forEach(mount);
  }
  new MutationObserver(scan).observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-game-id'] });
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', scan) : scan();
})();