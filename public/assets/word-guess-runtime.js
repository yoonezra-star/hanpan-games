(function () {
  const SAVE_KEY = "hanpan-word-guess-save-v2";
  const RECORD_KEY = "hanpan-word-guess-records-v2";
  const PREF_KEY = "hanpan-word-guess-prefs-v2";
  const LEGACY_KEY = "hanpan-arcade-word-guess";
  const ROUND_COUNT = 8;
  const difficulties = {
    easy: { label: "쉬움", attempts: 5, base: 100, hintPenalty: 12, missPenalty: 10 },
    normal: { label: "보통", attempts: 4, base: 150, hintPenalty: 20, missPenalty: 15 },
    hard: { label: "어려움", attempts: 3, base: 220, hintPenalty: 30, missPenalty: 22 }
  };
  const categories = {
    all: "전체",
    life: "생활",
    travel: "여행",
    nature: "자연",
    science: "과학",
    food: "음식"
  };
  const words = [
    { id:"life-umbrella", category:"life", answer:"우산", hints:["비 오는 날 밖에서 자주 찾는 물건입니다.","접었다 펼 수 있고 머리 위를 가립니다.","첫 글자는 ‘우’, 두 글자입니다."] },
    { id:"life-clock", category:"life", answer:"시계", hints:["하루의 흐름을 숫자로 확인할 때 씁니다.","손목이나 벽에서 볼 수 있습니다.","첫 글자는 ‘시’, 두 글자입니다."] },
    { id:"life-fridge", category:"life", answer:"냉장고", hints:["음식이 쉽게 상하지 않도록 보관합니다.","주방에서 차갑게 유지하는 큰 가전입니다.","첫 글자는 ‘냉’, 세 글자입니다."] },
    { id:"life-stairs", category:"life", answer:"계단", hints:["높이가 다른 층을 걸어서 오갈 때 이용합니다.","여러 개의 단이 이어져 있습니다.","첫 글자는 ‘계’, 두 글자입니다."] },
    { id:"life-elevator", category:"life", answer:"엘리베이터", hints:["건물 안에서 위아래로 빠르게 이동합니다.","버튼으로 층을 선택하는 작은 이동 공간입니다.","첫 글자는 ‘엘’, 다섯 글자입니다."] },
    { id:"life-library", category:"life", answer:"도서관", hints:["조용히 자료를 읽거나 빌릴 수 있는 곳입니다.","많은 책이 주제별로 정리되어 있습니다.","첫 글자는 ‘도’, 세 글자입니다."] },
    { id:"life-browser", category:"life", answer:"브라우저", hints:["웹사이트를 열고 인터넷 정보를 보는 프로그램입니다.","주소창에 웹 주소를 입력해 페이지를 엽니다.","첫 글자는 ‘브’, 네 글자입니다."] },
    { id:"life-keyboard", category:"life", answer:"키보드", hints:["컴퓨터에 글자와 명령을 입력할 때 씁니다.","여러 개의 문자·숫자 키가 배열되어 있습니다.","첫 글자는 ‘키’, 세 글자입니다."] },
    { id:"travel-passport", category:"travel", answer:"여권", hints:["나라 밖으로 이동할 때 신분을 증명하는 문서입니다.","출입국 심사 때 제시합니다.","첫 글자는 ‘여’, 두 글자입니다."] },
    { id:"travel-compass", category:"travel", answer:"나침반", hints:["길을 찾을 때 방향을 알려 줍니다.","자기장을 이용해 북쪽을 가리킵니다.","첫 글자는 ‘나’, 세 글자입니다."] },
    { id:"travel-train", category:"travel", answer:"기차", hints:["여러 칸이 연결되어 많은 사람이 함께 이동합니다.","철로 위를 달리는 교통수단입니다.","첫 글자는 ‘기’, 두 글자입니다."] },
    { id:"travel-camping", category:"travel", answer:"캠핑", hints:["야외에서 머물며 자연을 즐기는 활동입니다.","텐트와 침낭을 자주 사용합니다.","첫 글자는 ‘캠’, 두 글자입니다."] },
    { id:"travel-map", category:"travel", answer:"지도", hints:["장소의 위치와 길을 한눈에 보여 줍니다.","여행 경로를 계획할 때 자주 확인합니다.","첫 글자는 ‘지’, 두 글자입니다."] },
    { id:"travel-bike", category:"travel", answer:"자전거", hints:["두 바퀴를 사람이 직접 힘으로 굴립니다.","페달을 밟아 이동하는 탈것입니다.","첫 글자는 ‘자’, 세 글자입니다."] },
    { id:"travel-hiking", category:"travel", answer:"등산", hints:["높은 곳을 향해 길을 걸으며 자연을 즐깁니다.","산길과 등산화를 떠올리면 쉽습니다.","첫 글자는 ‘등’, 두 글자입니다."] },
    { id:"travel-lodging", category:"travel", answer:"숙박", hints:["여행지에서 밤을 보내는 일을 뜻합니다.","호텔·펜션·게스트하우스와 관련 있습니다.","첫 글자는 ‘숙’, 두 글자입니다."] },
    { id:"nature-rainbow", category:"nature", answer:"무지개", hints:["비가 그친 뒤 하늘에서 여러 색으로 보이기도 합니다.","햇빛이 물방울에서 굴절·반사되어 나타납니다.","첫 글자는 ‘무’, 세 글자입니다."] },
    { id:"nature-lightning", category:"nature", answer:"번개", hints:["폭풍우 때 하늘을 순간적으로 밝힙니다.","구름 사이 또는 구름과 땅 사이의 전기 방전입니다.","첫 글자는 ‘번’, 두 글자입니다."] },
    { id:"nature-waterfall", category:"nature", answer:"폭포", hints:["높은 곳의 물이 아래로 크게 떨어집니다.","계곡이나 절벽에서 볼 수 있는 물의 흐름입니다.","첫 글자는 ‘폭’, 두 글자입니다."] },
    { id:"nature-desert", category:"nature", answer:"사막", hints:["강수량이 매우 적고 건조한 지역입니다.","넓은 모래 언덕을 떠올리기 쉽습니다.","첫 글자는 ‘사’, 두 글자입니다."] },
    { id:"nature-volcano", category:"nature", answer:"화산", hints:["지하의 뜨거운 물질이 지표로 분출할 수 있습니다.","분화구와 용암이 대표적인 이미지입니다.","첫 글자는 ‘화’, 두 글자입니다."] },
    { id:"nature-wave", category:"nature", answer:"파도", hints:["바다 표면이 반복해서 오르내리며 움직입니다.","해변으로 밀려왔다가 다시 나갑니다.","첫 글자는 ‘파’, 두 글자입니다."] },
    { id:"nature-milkyway", category:"nature", answer:"은하수", hints:["밤하늘에 희미한 띠처럼 보이는 별들의 무리입니다.","우리 은하의 일부를 지구에서 바라본 모습입니다.","첫 글자는 ‘은’, 세 글자입니다."] },
    { id:"nature-pine", category:"nature", answer:"소나무", hints:["사계절 푸른 잎을 유지하는 대표적인 나무입니다.","가늘고 긴 바늘 모양 잎과 솔방울이 특징입니다.","첫 글자는 ‘소’, 세 글자입니다."] },
    { id:"science-gravity", category:"science", answer:"중력", hints:["물체가 아래로 떨어지는 현상과 관련 있습니다.","질량을 가진 물체 사이에 작용하는 힘입니다.","첫 글자는 ‘중’, 두 글자입니다."] },
    { id:"science-oxygen", category:"science", answer:"산소", hints:["사람이 호흡하는 공기에 들어 있는 기체입니다.","원소 기호는 O입니다.","첫 글자는 ‘산’, 두 글자입니다."] },
    { id:"science-atom", category:"science", answer:"원자", hints:["물질을 이루는 매우 작은 기본 단위입니다.","원자핵과 전자로 설명합니다.","첫 글자는 ‘원’, 두 글자입니다."] },
    { id:"science-planet", category:"science", answer:"행성", hints:["별 주위를 일정한 궤도로 도는 천체입니다.","지구·화성·목성 등이 여기에 속합니다.","첫 글자는 ‘행’, 두 글자입니다."] },
    { id:"science-photosynthesis", category:"science", answer:"광합성", hints:["식물이 빛을 이용해 양분을 만드는 과정입니다.","빛·물·이산화탄소가 중요한 재료입니다.","첫 글자는 ‘광’, 세 글자입니다."] },
    { id:"science-fossil", category:"science", answer:"화석", hints:["아주 오래전 생물의 흔적이 돌 등에 남은 것입니다.","과거 생물과 환경을 연구하는 자료가 됩니다.","첫 글자는 ‘화’, 두 글자입니다."] },
    { id:"science-cell", category:"science", answer:"세포", hints:["생물의 몸을 이루는 기본적인 구조 단위입니다.","현미경으로 관찰하는 대표적인 생명과학 대상입니다.","첫 글자는 ‘세’, 두 글자입니다."] },
    { id:"science-magnet", category:"science", answer:"자석", hints:["철 같은 물질을 끌어당길 수 있습니다.","N극과 S극이 있습니다.","첫 글자는 ‘자’, 두 글자입니다."] },
    { id:"food-kimchi", category:"food", answer:"김치", hints:["채소를 소금에 절이고 양념해 발효시킨 음식입니다.","배추와 무로 많이 만들며 한국 밥상에 자주 나옵니다.","첫 글자는 ‘김’, 두 글자입니다."] },
    { id:"food-bibimbap", category:"food", answer:"비빔밥", hints:["밥 위에 여러 나물과 재료를 올려 섞어 먹습니다.","고추장을 넣고 비벼 먹는 대표적인 한식입니다.","첫 글자는 ‘비’, 세 글자입니다."] },
    { id:"food-tteokbokki", category:"food", answer:"떡볶이", hints:["쌀이나 밀로 만든 길쭉한 떡을 양념에 조리합니다.","매콤달콤한 빨간 양념으로 유명한 분식입니다.","첫 글자는 ‘떡’, 세 글자입니다."] },
    { id:"food-naengmyeon", category:"food", answer:"냉면", hints:["차갑게 먹는 면 요리입니다.","물 또는 비빔 방식으로 즐기며 여름에 특히 인기입니다.","첫 글자는 ‘냉’, 두 글자입니다."] },
    { id:"food-gimbap", category:"food", answer:"김밥", hints:["밥과 여러 재료를 김으로 말아 썰어 먹습니다.","소풍이나 간단한 한 끼로 자주 떠올리는 음식입니다.","첫 글자는 ‘김’, 두 글자입니다."] },
    { id:"food-doenjang", category:"food", answer:"된장", hints:["콩을 발효해 만드는 짭짤한 전통 장입니다.","찌개나 국의 깊은 맛을 낼 때 자주 씁니다.","첫 글자는 ‘된’, 두 글자입니다."] },
    { id:"food-dumpling", category:"food", answer:"만두", hints:["얇은 피 안에 고기나 채소 같은 소를 넣습니다.","찌거나 굽거나 국에 넣어 먹을 수 있습니다.","첫 글자는 ‘만’, 두 글자입니다."] },
    { id:"food-watermelon", category:"food", answer:"수박", hints:["여름에 시원하게 먹는 큰 과일입니다.","초록 껍질 안에 붉은 과육과 씨가 있습니다.","첫 글자는 ‘수’, 두 글자입니다."] }
  ];
  let styleAdded = false;
  let audioContext = null;

  function readJson(key, fallback) {
    try { const value = JSON.parse(localStorage.getItem(key) || "null"); return value && typeof value === "object" ? value : fallback; }
    catch (error) { return fallback; }
  }
  function writeJson(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (error) { /* optional */ } }
  function removeKey(key) { try { localStorage.removeItem(key); } catch (error) { /* optional */ } }
  function normalize(value) { return String(value || "").normalize("NFC").toLowerCase().replace(/[\s\-_.·]/g, ""); }
  function shuffled(items) { return items.map(function (value) { return { value:value, order:Math.random() }; }).sort(function (a,b) { return a.order-b.order; }).map(function (item) { return item.value; }); }
  function freshRecord() { return { runs:0, completed:0, correct:0, questions:0, bestScore:0, bestStreak:0, bestAccuracy:0 }; }
  function loadRecords() {
    const raw = readJson(RECORD_KEY, {});
    const records = { easy:Object.assign(freshRecord(), raw.easy || {}), normal:Object.assign(freshRecord(), raw.normal || {}), hard:Object.assign(freshRecord(), raw.hard || {}) };
    try { const legacy = Number(localStorage.getItem(LEGACY_KEY)); if (Number.isFinite(legacy) && legacy > records.normal.bestScore) records.normal.bestScore = legacy; } catch (error) { /* optional */ }
    return records;
  }
  function accuracy(correct, total) { return total ? Math.round(correct / total * 100) : 100; }
  function clampDifficulty(value) { return difficulties[value] ? value : "normal"; }
  function clampCategory(value) { return categories[value] ? value : "all"; }
  function addStyle() {
    if (styleAdded) return; styleAdded = true;
    const style = document.createElement("style");
    style.textContent = `
      .word-guess-runtime-root{display:grid;gap:14px;max-width:720px;margin:0 auto}
      .word-settings,.word-actions,.word-records{display:flex;gap:9px;flex-wrap:wrap;align-items:center;justify-content:center}
      .word-settings label{display:grid;gap:5px;min-width:150px;font-weight:700}.word-settings select{min-height:42px;border:1px solid rgba(29,36,51,.22);border-radius:10px;padding:0 12px;background:#fffdf7;font:inherit}
      .word-card{display:grid;gap:13px;padding:18px;border:1px solid rgba(29,36,51,.13);border-radius:18px;background:rgba(255,255,255,.7)}
      .word-meta{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}.word-meta span{padding:6px 10px;border-radius:999px;background:rgba(74,111,185,.1);font-size:.88rem;font-weight:800}
      .word-hints{display:grid;gap:8px;margin:0;padding:0;list-style:none}.word-hints li{padding:11px 13px;border-radius:12px;background:rgba(29,36,51,.055);line-height:1.55}.word-hints strong{margin-right:7px}
      .word-answer-row{display:grid;grid-template-columns:1fr auto;gap:8px}.word-answer-row input{min-width:0;min-height:46px;border:1px solid rgba(29,36,51,.24);border-radius:12px;padding:0 14px;background:#fff;font:inherit}.word-answer-row input:focus{outline:3px solid rgba(74,111,185,.28);border-color:#4a6fb9}
      .word-status{text-align:center;min-height:1.6em;font-weight:750}.word-records{font-size:.88rem}.word-records span,.word-records strong{padding:6px 9px;border-radius:999px;background:rgba(29,36,51,.06)}
      .word-answer-reveal{padding:11px 13px;border-radius:12px;background:rgba(180,73,67,.1);text-align:center;font-weight:800}
      @media(max-width:760px){.word-guess-runtime-root{gap:11px}.word-settings label{flex:1 1 140px}.word-answer-row{grid-template-columns:1fr}.word-actions{position:sticky;bottom:8px;z-index:6;padding:8px;border-radius:14px;background:rgba(255,253,247,.95);box-shadow:0 8px 24px rgba(29,36,51,.14)}.word-actions .button{min-height:44px;flex:1 1 110px}}
    `;
    document.head.appendChild(style);
  }

  function setup(surface) {
    if (surface.querySelector(".word-guess-runtime-root")) return false;
    addStyle(); surface.classList.add("word-guess-runtime-game"); surface.innerHTML = "";
    const prefs = readJson(PREF_KEY, { difficulty:"normal", category:"all", muted:false });
    let difficulty = clampDifficulty(prefs.difficulty); let category = clampCategory(prefs.category); let muted = Boolean(prefs.muted);
    let records = loadRecords(); let deck = []; let round = 0; let currentId = ""; let attemptsLeft = difficulties[difficulty].attempts; let hintLevel = 1; let wrongGuesses = 0; let score = 0; let streak = 0; let runBestStreak = 0; let correct = 0; let questions = 0; let started = false; let runCounted = false; let phase = "ready"; let timer = null;

    const root = document.createElement("div"); root.className = "word-guess-runtime-root";
    const hud = document.createElement("div"); hud.className = "mini-score";
    const hudLabels = ["문제","기회","점수","연승","정확도"];
    const hudValues = hudLabels.map(function (label) { const span=document.createElement("span"); const value=document.createElement("b"); value.textContent="-"; const small=document.createElement("small"); small.textContent=label; span.append(value,small); hud.appendChild(span); return value; });
    const settings = document.createElement("div"); settings.className = "word-settings";
    const diffLabel=document.createElement("label"); diffLabel.innerHTML="<span>난이도</span>"; const diffSelect=document.createElement("select"); diffSelect.innerHTML='<option value="easy">쉬움 · 기회 5</option><option value="normal">보통 · 기회 4</option><option value="hard">어려움 · 기회 3</option>'; diffLabel.appendChild(diffSelect);
    const catLabel=document.createElement("label"); catLabel.innerHTML="<span>카테고리</span>"; const catSelect=document.createElement("select"); catSelect.innerHTML=Object.keys(categories).map(function (key) { return `<option value="${key}">${categories[key]}</option>`; }).join(""); catLabel.appendChild(catSelect); settings.append(diffLabel,catLabel);
    const card=document.createElement("div"); card.className="word-card"; const meta=document.createElement("div"); meta.className="word-meta"; const hints=document.createElement("ol"); hints.className="word-hints";
    const answerRow=document.createElement("div"); answerRow.className="word-answer-row"; const input=document.createElement("input"); input.type="text"; input.autocomplete="off"; input.autocapitalize="off"; input.spellcheck=false; input.placeholder="정답 입력"; input.setAttribute("aria-label","단어 정답 입력"); const submit=document.createElement("button"); submit.type="button"; submit.className="button primary"; submit.textContent="정답 확인"; answerRow.append(input,submit);
    const status=document.createElement("div"); status.className="word-status"; status.setAttribute("aria-live","polite"); card.append(meta,hints,answerRow,status);
    const actions=document.createElement("div"); actions.className="mini-controls word-actions"; const start=document.createElement("button"); start.type="button"; start.className="button primary"; start.textContent="8문제 시작"; const hint=document.createElement("button"); hint.type="button"; hint.className="button secondary"; hint.textContent="힌트 더 보기"; const skip=document.createElement("button"); skip.type="button"; skip.className="button secondary"; skip.textContent="정답 보기"; const mute=document.createElement("button"); mute.type="button"; mute.className="button secondary"; actions.append(start,hint,skip,mute);
    const recordBox=document.createElement("div"); recordBox.className="word-records"; root.append(hud,settings,card,actions,recordBox); surface.appendChild(root);

    function cfg() { return difficulties[difficulty]; }
    function currentRecord() { return records[difficulty]; }
    function currentWord() { return words.find(function (item) { return item.id === currentId; }) || null; }
    function pool() { return words.filter(function (item) { return category === "all" || item.category === category; }); }
    function tone(freq, duration) { if (muted) return; try { audioContext=audioContext || new (window.AudioContext || window.webkitAudioContext)(); if (audioContext.state === "suspended") audioContext.resume(); const osc=audioContext.createOscillator(); const gain=audioContext.createGain(); osc.frequency.value=freq; gain.gain.value=.04; osc.connect(gain); gain.connect(audioContext.destination); osc.start(); gain.gain.exponentialRampToValueAtTime(.0001,audioContext.currentTime+(duration||.14)); osc.stop(audioContext.currentTime+(duration||.15)); } catch (error) { /* optional */ } }
    function announce(text) { status.textContent=text; const out=document.querySelector("#playResult"); if (out) out.textContent=text; }
    function saveRecords() { writeJson(RECORD_KEY,records); }
    function updateRecordBox() { const rec=currentRecord(); recordBox.innerHTML=`<strong>${cfg().label}</strong><span>도전 ${rec.runs}</span><span>완주 ${rec.completed}</span><span>최고 ${rec.bestScore}점</span><span>최고 연승 ${rec.bestStreak}</span><span>최고 정확도 ${rec.bestAccuracy}%</span>`; }
    function updateHud() { hudValues[0].textContent=started?`${Math.min(round,ROUND_COUNT)}/${ROUND_COUNT}`:"0/8"; hudValues[1].textContent=started?String(attemptsLeft):"-"; hudValues[2].textContent=String(score); hudValues[3].textContent=String(streak); hudValues[4].textContent=`${accuracy(correct,questions)}%`; diffSelect.value=difficulty; catSelect.value=category; mute.textContent=muted?"소리 켜기":"소리 끄기"; input.disabled=phase!=="input"; submit.disabled=phase!=="input"; hint.disabled=phase!=="input"||hintLevel>=3; skip.disabled=phase!=="input"; start.textContent=started?"새 도전":"8문제 시작"; updateRecordBox(); }
    function renderQuestion() { const item=currentWord(); meta.innerHTML=item?`<span>${categories[item.category]}</span><span>${item.answer.length}글자</span><span>${cfg().label}</span>`:"<span>준비</span>"; hints.innerHTML=""; if (item) for (let i=0;i<hintLevel;i+=1) { const li=document.createElement("li"); li.innerHTML=`<strong>힌트 ${i+1}</strong>${item.hints[i]}`; hints.appendChild(li); } input.value=""; updateHud(); }
    function saveGame() { if (!started || phase==="finished") { if (phase==="finished") removeKey(SAVE_KEY); return; } writeJson(SAVE_KEY,{ version:2,difficulty,category,deck,round,currentId,attemptsLeft,hintLevel,wrongGuesses,score,streak,runBestStreak,correct,questions,started,runCounted }); }
    function validSave(value) { return value&&value.version===2&&difficulties[value.difficulty]&&categories[value.category]&&Array.isArray(value.deck)&&Number.isInteger(value.round)&&value.round>=1&&value.round<=ROUND_COUNT&&words.some(function (item) { return item.id===value.currentId; })&&Number(value.attemptsLeft)>0; }
    function makeDeck() { const ids=pool().map(function (item) { return item.id; }); return shuffled(ids).slice(0,ROUND_COUNT); }
    function beginRun() { if (timer) clearTimeout(timer); deck=makeDeck(); round=1; currentId=deck[0]; attemptsLeft=cfg().attempts; hintLevel=1; wrongGuesses=0; score=0; streak=0; runBestStreak=0; correct=0; questions=0; started=true; phase="input"; const rec=currentRecord(); rec.runs+=1; runCounted=true; saveRecords(); renderQuestion(); announce(`${categories[category]} ${cfg().label} 8문제 도전을 시작합니다.`); saveGame(); setTimeout(function () { if (phase==="input"&&root.isConnected) input.focus(); },0); }
    function nextQuestion() { if (round>=ROUND_COUNT) { finishRun(); return; } round+=1; currentId=deck[round-1]; attemptsLeft=cfg().attempts; hintLevel=1; wrongGuesses=0; phase="input"; renderQuestion(); announce(`${round}번째 문제입니다. 첫 힌트부터 추리해 보세요.`); saveGame(); setTimeout(function () { if (root.isConnected) input.focus(); },0); }
    function pointsForCurrent() { return Math.max(20, cfg().base-(hintLevel-1)*cfg().hintPenalty-wrongGuesses*cfg().missPenalty+Math.min(streak,5)*10); }
    function isAnswer(item,value) { const accepted=[item.answer].concat(item.aliases||[]).map(normalize); return accepted.includes(normalize(value)); }
    function submitAnswer() { if (phase!=="input") return; const item=currentWord(); const value=input.value.trim(); if (!value) { announce("정답을 입력한 뒤 확인하세요."); input.focus(); return; } if (isAnswer(item,value)) { questions+=1; correct+=1; streak+=1; runBestStreak=Math.max(runBestStreak,streak); const earned=pointsForCurrent(); score+=earned; const rec=currentRecord(); rec.correct+=1; rec.questions+=1; rec.bestScore=Math.max(rec.bestScore,score); rec.bestStreak=Math.max(rec.bestStreak,runBestStreak); rec.bestAccuracy=Math.max(rec.bestAccuracy,accuracy(correct,questions)); saveRecords(); phase="transition"; renderQuestion(); announce(`정답! ${item.answer} · +${earned}점 · ${streak}연승입니다.`); tone(760,.16); saveGame(); timer=setTimeout(nextQuestion,950); return; } wrongGuesses+=1; attemptsLeft-=1; tone(180,.16); if (attemptsLeft<=0) { questions+=1; streak=0; const rec=currentRecord(); rec.questions+=1; rec.bestAccuracy=Math.max(rec.bestAccuracy,accuracy(correct,questions)); saveRecords(); phase="transition"; renderQuestion(); const reveal=document.createElement("div"); reveal.className="word-answer-reveal"; reveal.textContent=`정답: ${item.answer}`; card.insertBefore(reveal,status); announce(`기회를 모두 사용했습니다. 정답은 ${item.answer}입니다.`); saveGame(); timer=setTimeout(function () { if (reveal.isConnected) reveal.remove(); nextQuestion(); },1500); } else { input.value=""; updateHud(); announce(`아쉽습니다. 남은 기회 ${attemptsLeft}번입니다. 힌트를 더 열거나 다시 추리하세요.`); input.focus(); saveGame(); } }
    function revealHint() { if (phase!=="input"||hintLevel>=3) return; hintLevel+=1; streak=0; renderQuestion(); announce(`힌트 ${hintLevel}을 열었습니다. 이번 문제의 획득 가능 점수가 줄어듭니다.`); tone(470,.08); saveGame(); input.focus(); }
    function revealAnswer() { if (phase!=="input") return; const item=currentWord(); questions+=1; streak=0; const rec=currentRecord(); rec.questions+=1; rec.bestAccuracy=Math.max(rec.bestAccuracy,accuracy(correct,questions)); saveRecords(); phase="transition"; renderQuestion(); const reveal=document.createElement("div"); reveal.className="word-answer-reveal"; reveal.textContent=`정답: ${item.answer}`; card.insertBefore(reveal,status); announce("정답 보기를 사용했습니다. 이 문제는 오답으로 기록됩니다."); saveGame(); timer=setTimeout(function () { if (reveal.isConnected) reveal.remove(); nextQuestion(); },1500); }
    function finishRun() { if (timer) clearTimeout(timer); phase="finished"; started=false; const rec=currentRecord(); rec.completed+=1; rec.bestScore=Math.max(rec.bestScore,score); rec.bestStreak=Math.max(rec.bestStreak,runBestStreak); rec.bestAccuracy=Math.max(rec.bestAccuracy,accuracy(correct,questions)); saveRecords(); removeKey(SAVE_KEY); renderQuestion(); announce(`8문제 완료 · ${correct}/${ROUND_COUNT} 정답 · ${score}점 · 정확도 ${accuracy(correct,questions)}%입니다.`); tone(880,.22); }
    function restore() { const saved=readJson(SAVE_KEY,null); if (!validSave(saved)) { phase="ready"; started=false; renderQuestion(); announce("난이도와 카테고리를 고른 뒤 8문제 도전을 시작하세요."); return; } difficulty=clampDifficulty(saved.difficulty); category=clampCategory(saved.category); deck=saved.deck.filter(function (id) { return words.some(function (item) { return item.id===id; }); }); round=Math.max(1,Math.min(ROUND_COUNT,Number(saved.round)||1)); currentId=saved.currentId; attemptsLeft=Math.max(1,Math.min(cfg().attempts,Number(saved.attemptsLeft)||cfg().attempts)); hintLevel=Math.max(1,Math.min(3,Number(saved.hintLevel)||1)); wrongGuesses=Math.max(0,Number(saved.wrongGuesses)||0); score=Math.max(0,Number(saved.score)||0); streak=Math.max(0,Number(saved.streak)||0); runBestStreak=Math.max(streak,Number(saved.runBestStreak)||0); correct=Math.max(0,Number(saved.correct)||0); questions=Math.max(correct,Number(saved.questions)||0); started=true; runCounted=Boolean(saved.runCounted); phase="input"; renderQuestion(); announce(`${cfg().label} ${round}/${ROUND_COUNT} 문제 진행 상태를 복구했습니다.`); setTimeout(function () { if (root.isConnected) input.focus(); },0); }
    function changeSettings() { difficulty=clampDifficulty(diffSelect.value); category=clampCategory(catSelect.value); writeJson(PREF_KEY,{difficulty,category,muted}); if (timer) clearTimeout(timer); removeKey(SAVE_KEY); deck=[]; round=0; currentId=""; attemptsLeft=cfg().attempts; hintLevel=1; wrongGuesses=0; score=0; streak=0; runBestStreak=0; correct=0; questions=0; started=false; phase="ready"; renderQuestion(); announce(`${categories[category]} · ${cfg().label} 모드로 변경했습니다.`); }
    function onKey(event) { if (!root.isConnected||event.altKey||event.ctrlKey||event.metaKey) return; if (event.key.toLowerCase()==="h"&&event.target!==input) { event.preventDefault(); event.stopImmediatePropagation(); revealHint(); } else if (event.key.toLowerCase()==="n"&&event.target!==input) { event.preventDefault(); event.stopImmediatePropagation(); beginRun(); } }

    submit.addEventListener("click",submitAnswer); input.addEventListener("keydown",function (event) { if (event.key==="Enter") { event.preventDefault(); submitAnswer(); } }); start.addEventListener("click",beginRun); hint.addEventListener("click",revealHint); skip.addEventListener("click",revealAnswer); mute.addEventListener("click",function () { muted=!muted; writeJson(PREF_KEY,{difficulty,category,muted}); updateHud(); }); diffSelect.addEventListener("change",changeSettings); catSelect.addEventListener("change",changeSettings); window.addEventListener("keydown",onKey,true);
    const externalRestart=document.querySelector("#restartGame"); function onExternalRestart() { removeKey(SAVE_KEY); if (timer) clearTimeout(timer); } if (externalRestart) externalRestart.addEventListener("click",onExternalRestart,true);
    const cleanupObserver=new MutationObserver(function () { if (root.isConnected) return; if (timer) clearTimeout(timer); window.removeEventListener("keydown",onKey,true); if (externalRestart) externalRestart.removeEventListener("click",onExternalRestart,true); surface.classList.remove("word-guess-runtime-game"); cleanupObserver.disconnect(); }); cleanupObserver.observe(document.documentElement,{childList:true,subtree:true});
    restore(); return true;
  }
  function isTarget(surface) { if (surface.dataset.gameId==="word-guess") return true; if (location.pathname.indexOf("/games/word-guess/")>=0) return true; return surface.id==="playSurface"&&new URLSearchParams(location.search).get("game")==="word-guess"; }
  function scan() { document.querySelectorAll("#playSurface, .play-surface").forEach(function (surface) { if (isTarget(surface)&&!surface.querySelector(".word-guess-runtime-root")) setup(surface); }); }
  function boot() { scan(); const observer=new MutationObserver(scan); observer.observe(document.documentElement,{childList:true,subtree:true}); }
  if (document.readyState==="loading") document.addEventListener("DOMContentLoaded",boot,{once:true}); else boot();
})();