(function () {
  const ID = 'gonggi';
  const RK = 'hanpan-gonggi-records-v3';
  const PK = 'hanpan-gonggi-prefs-v3';
  const P = {
    easy: { label: '쉬움', flight: 2.45, catchStart: .66, catchEnd: .96, lives: 4 },
    normal: { label: '보통', flight: 2.0, catchStart: .72, catchEnd: .93, lives: 3 },
    hard: { label: '어려움', flight: 1.62, catchStart: .77, catchEnd: .91, lives: 2 }
  };
  const stages = [
    { name: '한 알 줍기', groups: [1, 1, 1, 1] },
    { name: '두 알 줍기', groups: [2, 2] },
    { name: '세 알·한 알', groups: [3, 1] },
    { name: '네 알 줍기', groups: [4] },
    { name: '꺾기', groups: ['flip'] }
  ];

  function load(key, fallback) {
    try { return Object.assign({}, fallback, JSON.parse(localStorage.getItem(key) || '{}')); }
    catch (e) { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }

  function mount(surface) {
    if (!surface || surface.dataset.gameId !== ID || surface.querySelector('.gg3')) return;
    const prefs = load(PK, { difficulty: 'normal' });
    let diff = P[prefs.difficulty] ? prefs.difficulty : 'normal';
    const records = load(RK, {});
    let stage = 0, turn = 0, lives = P[diff].lives, score = 0, combo = 0, bestCombo = 0;
    let flying = false, flightStart = 0, progress = 0, picked = new Set(), ready = true, flipStep = 0, backhand = 0;
    let frame = 0, last = performance.now(), locked = false;

    function record() {
      if (!records[diff]) records[diff] = { runs: 0, bestStage: 0, bestScore: 0, bestCombo: 0, clears: 0 };
      return records[diff];
    }

    surface.innerHTML = `
      <style>
        .gg3{max-width:700px;margin:auto;display:grid;gap:12px;text-align:center}
        .gg3-hud,.gg3-actions{display:flex;gap:8px;justify-content:center;align-items:center;flex-wrap:wrap}
        .gg3-hud span,.gg3-hud strong,.gg3-records span{padding:7px 10px;border-radius:999px;background:rgba(29,36,51,.07)}
        .gg3-board{position:relative;min-height:380px;border-radius:22px;overflow:hidden;background:linear-gradient(#f6eedc 0 70%,#d6b47b 70%);border:1px solid #d1bf9d;touch-action:manipulation}
        .gg3-air{position:absolute;left:50%;bottom:78px;width:42px;height:42px;border-radius:50%;transform:translate(-50%,50%);background:radial-gradient(circle at 35% 30%,#fff,#89a9cd 55%,#476a93);box-shadow:0 8px 12px rgba(0,0,0,.18);display:none;z-index:4}
        .gg3-air.multi{width:66px;height:50px;border-radius:45%;background:radial-gradient(circle at 20% 35%,#fff 0 10%,transparent 11%),radial-gradient(circle at 45% 25%,#fff 0 10%,transparent 11%),radial-gradient(circle at 70% 38%,#fff 0 10%,transparent 11%),radial-gradient(circle at 35% 65%,#fff 0 10%,transparent 11%),radial-gradient(circle at 65% 70%,#fff 0 10%,transparent 11%),#7899c1}
        .gg3-hand{position:absolute;left:50%;bottom:30px;width:150px;height:52px;transform:translateX(-50%);border-radius:70% 70% 35% 35%;background:#f0b98f;border:3px solid #9a694c;z-index:2}.gg3-hand:after{content:"손";position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-weight:900;color:#704932}
        .gg3-ground{position:absolute;left:9%;right:9%;bottom:92px;display:grid;grid-template-columns:repeat(4,1fr);gap:16px;z-index:3}
        .gg3-stone{aspect-ratio:1;max-width:72px;width:100%;justify-self:center;border-radius:50%;border:3px solid #53749a;background:radial-gradient(circle at 35% 30%,#fff,#8fafcf 58%,#55779e);box-shadow:0 7px 10px rgba(0,0,0,.14);cursor:pointer;transition:transform .12s,opacity .12s}.gg3-stone.picked{opacity:.18;transform:translateY(-25px) scale(.8);pointer-events:none}.gg3-stone:disabled{cursor:default}
        .gg3-prompt{position:absolute;left:50%;top:18px;transform:translateX(-50%);padding:9px 14px;border-radius:999px;background:#fffdf2e8;font-weight:900;white-space:nowrap;z-index:5}
        .gg3-stage-name{font-size:1.08rem;font-weight:900}.gg3-help{font-size:.92rem;color:#566070}.gg3 button,.gg3 select{min-height:44px}
        @media(max-width:600px){.gg3-board{min-height:340px}.gg3-ground{left:4%;right:4%;gap:10px}.gg3-actions .button{flex:1 1 125px}}
      </style>
      <div class="gg3">
        <div class="gg3-hud"><strong data-v="score">0점</strong><span data-v="stage">1/5단계</span><span data-v="lives">목숨 3</span><span data-v="combo">콤보 0</span></div>
        <div class="gg3-actions"><label>난이도 <select data-v="diff"><option value="easy">쉬움</option><option value="normal">보통</option><option value="hard">어려움</option></select></label><button class="button secondary" data-act="new" type="button">새 도전</button></div>
        <div class="gg3-stage-name" data-v="stageName"></div>
        <div class="gg3-board" aria-label="공깃돌을 던지고 바닥 돌을 주운 뒤 다시 받는 공기놀이 게임 영역"><div class="gg3-prompt"></div><div class="gg3-air" aria-hidden="true"></div><div class="gg3-ground"></div><div class="gg3-hand" aria-hidden="true"></div></div>
        <div class="gg3-actions"><button class="button primary" data-act="toss" type="button">공깃돌 던지기 · Enter</button><button class="button primary" data-act="catch" type="button">받기 · Space</button></div>
        <div class="gg3-records"></div><p class="gg3-help">1~4단계는 공깃돌을 던진 뒤 바닥 돌을 필요한 개수만큼 눌러 줍고, 내려오는 돌을 Space로 받습니다. 5단계 꺾기는 손등 받기와 뒤집어 받기를 연속으로 성공해야 합니다.</p>
      </div>`;

    const $ = (q) => surface.querySelector(q);
    const ground = $('.gg3-ground'), air = $('.gg3-air'), prompt = $('.gg3-prompt'), tossBtn = $('[data-act="toss"]'), catchBtn = $('[data-act="catch"]'), sel = $('[data-v="diff"]');
    sel.value = diff;

    function announce(text) { const o = document.querySelector('#playResult'); if (o) o.textContent = text; }
    function currentGroup() { return stages[stage] && stages[stage].groups[turn]; }
    function stageNumber() { return Math.min(5, stage + 1); }
    function renderStones() {
      ground.innerHTML = '';
      for (let i = 0; i < 4; i++) {
        const b = document.createElement('button'); b.type = 'button'; b.className = 'gg3-stone' + (picked.has(i) ? ' picked' : ''); b.setAttribute('aria-label', `${i + 1}번 바닥 공깃돌`); b.disabled = !flying || stage === 4 || picked.has(i); b.addEventListener('click', () => pickStone(i)); ground.appendChild(b);
      }
      ground.style.display = stage === 4 ? 'none' : 'grid';
    }
    function render() {
      const r = record();
      $('[data-v="score"]').textContent = score + '점'; $('[data-v="stage"]').textContent = stageNumber() + '/5단계'; $('[data-v="lives"]').textContent = '목숨 ' + lives; $('[data-v="combo"]').textContent = '콤보 ' + combo + ' · 최고 ' + bestCombo;
      $('[data-v="stageName"]').textContent = stage < 5 ? `${stageNumber()}단계 · ${stages[stage].name}` : '완주';
      $('.gg3-records').innerHTML = `<span>${P[diff].label} 최고 ${r.bestScore}점</span><span>최고 단계 ${r.bestStage}/5</span><span>최고 콤보 ${r.bestCombo}</span><span>완주 ${r.clears}회</span>`;
      tossBtn.disabled = !ready || flying || locked || stage >= 5; catchBtn.disabled = !flying || locked;
      if (stage === 4) catchBtn.textContent = flipStep === 0 ? '손등 받기 · Space' : '뒤집어 받기 · Space'; else catchBtn.textContent = '받기 · Space';
      renderStones();
    }

    function setPrompt() {
      if (stage >= 5) { prompt.textContent = '완주'; return; }
      if (stage === 4) { prompt.textContent = flipStep === 0 ? '다섯 알을 띄우고 꼭대기에서 손등으로 받기' : `손등 ${backhand}알 · 내려올 때 뒤집어 받기`; return; }
      const need = currentGroup();
      prompt.textContent = flying ? `${need}알 줍기 · 현재 ${picked.size}/${need}` : `${need}알을 줍는 차례`;
    }

    function reset() {
      stage = 0; turn = 0; lives = P[diff].lives; score = 0; combo = 0; bestCombo = 0; flying = false; picked = new Set(); ready = true; locked = false; flipStep = 0; backhand = 0; progress = 0;
      record().runs++; save(RK, records); air.style.display = 'none'; air.classList.remove('multi'); setPrompt(); render(); announce(`${P[diff].label} 공기놀이 시작. 던지기 → 줍기 → 받기 순서로 진행하세요.`);
    }

    function toss() {
      if (!ready || flying || locked || stage >= 5) return;
      picked = new Set(); flying = true; ready = false; progress = 0; flightStart = performance.now();
      air.style.display = 'block'; air.classList.toggle('multi', stage === 4); setPrompt(); render();
      announce(stage === 4 ? (flipStep === 0 ? '다섯 알을 띄웠습니다. 꼭대기에서 손등 받기!' : '손등의 돌을 띄웠습니다. 내려올 때 뒤집어 받기!') : `${currentGroup()}알을 먼저 줍고 내려오는 공깃돌을 받으세요.`);
    }

    function pickStone(index) {
      if (!flying || stage === 4 || locked || picked.has(index)) return;
      const need = currentGroup();
      picked.add(index);
      if (picked.size > need) { fail('필요한 개수보다 많이 집었습니다.'); return; }
      setPrompt(); render();
      if (picked.size === need) announce(`${need}알을 주웠습니다. 이제 내려오는 공깃돌을 받으세요.`);
    }

    function fail(reason) {
      if (locked) return;
      locked = true; flying = false; air.style.display = 'none'; lives--; combo = 0; picked = new Set(); flipStep = 0; backhand = 0;
      announce(`${reason} 목숨 ${lives}개.`);
      if (lives <= 0) { setTimeout(() => finish(false), 350); return; }
      setTimeout(() => { locked = false; ready = true; setPrompt(); render(); }, 600); render();
    }

    function succeedTurn(timingBonus) {
      flying = false; air.style.display = 'none'; combo++; bestCombo = Math.max(bestCombo, combo); score += 50 + stage * 25 + timingBonus + combo * 4;
      turn++; picked = new Set(); locked = true;
      if (turn >= stages[stage].groups.length) { score += 120 + stage * 30; stage++; turn = 0; combo += 2; bestCombo = Math.max(bestCombo, combo); }
      if (stage >= stages.length) { setTimeout(() => finish(true), 250); return; }
      announce(stage === 4 ? '4단계를 통과했습니다. 마지막 꺾기에 도전하세요.' : `${stages[stage].name}로 진행합니다.`);
      setTimeout(() => { locked = false; ready = true; flipStep = 0; setPrompt(); render(); }, 560); render();
    }

    function catchStone() {
      if (!flying || locked) return;
      const cfg = P[diff];
      if (stage === 4) {
        if (flipStep === 0) {
          if (progress < .38 || progress > .64) { fail('손등 받기 타이밍이 어긋났습니다.'); return; }
          const distance = Math.abs(progress - .5); backhand = Math.max(1, 5 - Math.floor(distance * 22));
          flying = false; air.style.display = 'none'; flipStep = 1; locked = true; score += backhand * 20; announce(`손등에 ${backhand}알 올렸습니다. 이제 다시 띄워 뒤집어 받으세요.`);
          setTimeout(() => { locked = false; ready = true; setPrompt(); render(); }, 480); render(); return;
        }
        if (progress < cfg.catchStart || progress > cfg.catchEnd) { fail('뒤집어 받기 타이밍을 놓쳤습니다.'); return; }
        score += backhand * 45; combo += backhand; bestCombo = Math.max(bestCombo, combo); stage = 5; flying = false; air.style.display = 'none'; finish(true); return;
      }

      const need = currentGroup();
      if (picked.size !== need) { fail(`${need}알을 다 줍기 전에 받으려 했습니다.`); return; }
      if (progress < cfg.catchStart || progress > cfg.catchEnd) { fail(progress < cfg.catchStart ? '너무 일찍 손을 올렸습니다.' : '받는 타이밍이 늦었습니다.'); return; }
      const center = (cfg.catchStart + cfg.catchEnd) / 2;
      const bonus = Math.max(0, Math.round(45 * (1 - Math.abs(progress - center) / ((cfg.catchEnd - cfg.catchStart) / 2))));
      succeedTurn(bonus);
    }

    function finish(clear) {
      flying = false; ready = false; locked = true; air.style.display = 'none';
      const r = record(); r.bestStage = Math.max(r.bestStage, clear ? 5 : stageNumber()); r.bestScore = Math.max(r.bestScore, score); r.bestCombo = Math.max(r.bestCombo, bestCombo); if (clear) r.clears++; save(RK, records);
      announce(clear ? `공기놀이 5단계 완주! ${score}점 · 최고 콤보 ${bestCombo}.` : `도전 종료 · ${stageNumber()}단계 · ${score}점.`); setPrompt(); render();
    }

    function loop(now) {
      const dt = Math.min(.034, Math.max(0, (now - last) / 1000)); last = now;
      if (flying) {
        progress = Math.min(1, (now - flightStart) / (P[diff].flight * 1000));
        const height = Math.sin(progress * Math.PI) * (stage === 4 ? 235 : 220);
        air.style.bottom = (78 + height) + 'px';
        air.style.left = (50 + Math.sin(progress * Math.PI * 2) * (stage === 4 ? 3 : 7)) + '%';
        if (progress >= 1) fail(stage === 4 ? '공깃돌을 받지 못했습니다.' : '던진 공깃돌이 손으로 돌아오기 전에 받지 못했습니다.');
      }
      frame = requestAnimationFrame(loop);
    }

    function keyDown(e) {
      if (!surface.isConnected || e.repeat) return;
      if (e.code === 'Space') { e.preventDefault(); catchStone(); }
      else if (e.key === 'Enter') { e.preventDefault(); toss(); }
      else if (/^[1-4]$/.test(e.key)) { e.preventDefault(); pickStone(Number(e.key) - 1); }
    }

    tossBtn.addEventListener('click', toss); catchBtn.addEventListener('click', catchStone); $('[data-act="new"]').addEventListener('click', reset);
    sel.addEventListener('change', () => { diff = P[sel.value] ? sel.value : 'normal'; save(PK, { difficulty: diff }); reset(); }); window.addEventListener('keydown', keyDown, true);
    const observer = new MutationObserver(() => { if (surface.isConnected) return; cancelAnimationFrame(frame); window.removeEventListener('keydown', keyDown, true); observer.disconnect(); }); observer.observe(document.documentElement, { childList: true, subtree: true });
    reset(); frame = requestAnimationFrame(loop);
  }

  function scan() { document.querySelectorAll('#playSurface[data-game-id="' + ID + '"]').forEach(mount); }
  new MutationObserver(scan).observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-game-id'] });
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', scan) : scan();
})();