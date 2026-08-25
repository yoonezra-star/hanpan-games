(function () {
  const SAVE_KEY = "hanpan-hangman-save-v2";
  const RECORD_KEY = "hanpan-hangman-records-v2";
  const PREF_KEY = "hanpan-hangman-prefs-v2";
  const LEGACY_KEY = "hanpan-arcade-hangman";
  const CHOSEONG = ["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
  const profiles = {
    easy: { label: "쉬움", maxWrong: 8, score: 1 },
    normal: { label: "보통", maxWrong: 6, score: 2 },
    hard: { label: "어려움", maxWrong: 5, score: 3 }
  };
  const words = {
    en: [
      { word:"BROWSER", cat:"생활", hint:"웹사이트를 보는 프로그램" },
      { word:"WINDOW", cat:"생활", hint:"건물에서 바깥을 볼 수 있는 곳" },
      { word:"MARKET", cat:"생활", hint:"물건을 사고파는 곳" },
      { word:"SCHOOL", cat:"생활", hint:"배우고 공부하는 곳" },
      { word:"TRAIN", cat:"여행", hint:"선로 위를 달리는 교통수단" },
      { word:"AIRPORT", cat:"여행", hint:"비행기가 뜨고 내리는 곳" },
      { word:"HOTEL", cat:"여행", hint:"여행 중 머무는 숙소" },
      { word:"BRIDGE", cat:"여행", hint:"강이나 길 위를 건너는 구조물" },
      { word:"FOREST", cat:"자연", hint:"나무가 빽빽하게 모인 곳" },
      { word:"RIVER", cat:"자연", hint:"육지를 따라 흐르는 큰 물줄기" },
      { word:"CLOUD", cat:"자연", hint:"하늘에 떠 있는 작은 물방울 무리" },
      { word:"BEACH", cat:"자연", hint:"바다와 육지가 만나는 모래 해변" },
      { word:"BREAD", cat:"음식", hint:"밀가루 반죽을 구워 만드는 음식" },
      { word:"COFFEE", cat:"음식", hint:"볶은 원두로 만드는 음료" },
      { word:"APPLE", cat:"음식", hint:"빨강이나 초록 껍질의 대표 과일" },
      { word:"PIZZA", cat:"음식", hint:"둥근 반죽 위에 치즈와 토핑을 올린 음식" },
      { word:"ROBOT", cat:"과학", hint:"프로그램에 따라 움직이는 기계" },
      { word:"PLANET", cat:"과학", hint:"별 주위를 도는 천체" },
      { word:"CAMERA", cat:"과학", hint:"빛을 기록해 사진을 남기는 장치" },
      { word:"MAGNET", cat:"과학", hint:"철을 끌어당기는 성질을 가진 물체" }
    ],
    ko: [
      { word:"브라우저", cat:"생활", hint:"웹사이트를 보는 프로그램" },
      { word:"도서관", cat:"생활", hint:"책을 읽거나 빌릴 수 있는 곳" },
      { word:"우산", cat:"생활", hint:"비를 피할 때 펼쳐 쓰는 물건" },
      { word:"시장", cat:"생활", hint:"여러 상점에서 물건을 사고파는 곳" },
      { word:"비행기", cat:"여행", hint:"하늘을 날아 먼 곳으로 가는 교통수단" },
      { word:"기차역", cat:"여행", hint:"열차를 타고 내리는 장소" },
      { word:"자전거", cat:"여행", hint:"두 바퀴를 페달로 굴리는 이동수단" },
      { word:"여행", cat:"여행", hint:"다른 지역이나 나라로 떠나는 활동" },
      { word:"구름", cat:"자연", hint:"하늘에 떠 있는 작은 물방울 무리" },
      { word:"바다", cat:"자연", hint:"넓고 짠물이 가득한 수역" },
      { word:"공원", cat:"자연", hint:"산책하고 쉬기 좋은 녹지 공간" },
      { word:"산책", cat:"자연", hint:"천천히 걸으며 주변을 즐기는 활동" },
      { word:"김치", cat:"음식", hint:"채소를 양념해 발효한 한국 음식" },
      { word:"떡볶이", cat:"음식", hint:"떡을 매콤한 양념에 볶아 만든 음식" },
      { word:"커피", cat:"음식", hint:"볶은 원두로 만드는 음료" },
      { word:"고구마", cat:"음식", hint:"달고 포슬한 맛의 뿌리채소" },
      { word:"별자리", cat:"과학", hint:"별을 이어 이름 붙인 하늘의 무늬" },
      { word:"과학관", cat:"과학", hint:"과학 원리와 전시를 체험하는 장소" },
      { word:"사진", cat:"과학", hint:"카메라로 빛을 기록한 이미지" },
      { word:"망원경", cat:"과학", hint:"멀리 있는 대상을 크게 보는 광학기구" }
    ]
  };
  let styleAdded = false;
  let audioContext = null;

  function readJson(key, fallback) { try { const v = JSON.parse(localStorage.getItem(key) || "null"); return v && typeof v === "object" ? v : fallback; } catch (e) { return fallback; } }
  function writeJson(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {} }
  function removeKey(key) { try { localStorage.removeItem(key); } catch (e) {} }
  function normalize(value, mode) { const raw = String(value || "").trim().replace(/[\s\-_.]/g, ""); return mode === "en" ? raw.toUpperCase() : raw; }
  function initialOf(char) {
    const code = char.charCodeAt(0);
    if (code < 0xac00 || code > 0xd7a3) return char;
    return CHOSEONG[Math.floor((code - 0xac00) / 588)];
  }
  function difficulty(value) { return profiles[value] ? value : "normal"; }
  function modeValue(value) { return value === "ko" ? "ko" : "en"; }
  function freshRecord() { return { attempts:0, wins:0, bestScore:0, bestStreak:0, bestRemaining:0 }; }
  function recordKey(mode, diff) { return mode + ":" + diff; }
  function loadRecords() {
    const raw = readJson(RECORD_KEY, {});
    ["en","ko"].forEach(function (mode) { Object.keys(profiles).forEach(function (diff) { const key = recordKey(mode,diff); raw[key] = Object.assign(freshRecord(), raw[key] || {}); }); });
    try { const legacy = Number(localStorage.getItem(LEGACY_KEY)); if (Number.isFinite(legacy) && legacy > 0) raw[recordKey("en","normal")].bestStreak = Math.max(raw[recordKey("en","normal")].bestStreak, legacy); } catch (e) {}
    return raw;
  }
  function addStyle() {
    if (styleAdded) return; styleAdded = true;
    const style = document.createElement("style");
    style.textContent = `
      .hangman-runtime-root{display:grid;gap:14px;max-width:760px;margin:0 auto}
      .hangman-settings,.hangman-actions,.hangman-records{display:flex;gap:9px;flex-wrap:wrap;align-items:center;justify-content:center}
      .hangman-settings label{display:grid;gap:5px;min-width:145px;font-weight:700}.hangman-settings select{min-height:42px;border:1px solid rgba(29,36,51,.2);border-radius:10px;padding:0 12px;background:#fffdf7;font:inherit}
      .hangman-card{display:grid;gap:10px;padding:16px;border-radius:16px;background:rgba(74,111,185,.08);text-align:center}.hangman-card .hangman-category{font-weight:800}.hangman-card .hangman-hint{margin:0;opacity:.85}
      .hangman-word{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;min-height:58px;align-items:end}.hangman-slot{display:grid;place-items:center;min-width:34px;height:48px;border-bottom:3px solid rgba(29,36,51,.55);font-weight:900;font-size:1.35rem;padding:0 3px}.hangman-slot.is-open{border-bottom-color:#4a6fb9}
      .hangman-stage{font:700 1rem/1.6 ui-monospace,SFMono-Regular,Menlo,monospace;white-space:pre;min-height:112px;margin:0 auto;color:#39445e}
      .hangman-letters{display:grid;grid-template-columns:repeat(auto-fit,minmax(42px,1fr));gap:7px}.hangman-letter{min-height:44px;border:1px solid rgba(29,36,51,.24);border-radius:10px;background:#fffdf7;font:800 1rem/1 system-ui,sans-serif;cursor:pointer}.hangman-letter:disabled{opacity:.42;cursor:default}.hangman-letter.is-hit{background:rgba(74,168,105,.18)}.hangman-letter.is-miss{background:rgba(221,92,83,.16)}
      .hangman-guess{display:flex;gap:8px;max-width:560px;width:100%;margin:0 auto}.hangman-guess input{flex:1;min-width:0;min-height:46px;border:1px solid rgba(29,36,51,.25);border-radius:10px;padding:0 12px;font:inherit}.hangman-guess button{min-height:46px}
      .hangman-records{font-size:.88rem}.hangman-records span,.hangman-records strong{padding:6px 9px;border-radius:999px;background:rgba(29,36,51,.06)}.hangman-note{text-align:center;margin:0}
      @media(max-width:760px){.hangman-runtime-root{gap:11px}.hangman-settings label{flex:1 1 135px}.hangman-letters{grid-template-columns:repeat(auto-fit,minmax(38px,1fr));gap:5px}.hangman-letter{min-height:43px}.hangman-actions{position:sticky;bottom:8px;z-index:6;padding:8px;border-radius:14px;background:rgba(255,253,247,.95);box-shadow:0 8px 24px rgba(29,36,51,.14)}.hangman-actions .button{min-height:44px;flex:1 1 105px}.hangman-guess{flex-direction:column}.hangman-guess button{width:100%}}
    `;
    document.head.appendChild(style);
  }

  function setup(surface) {
    if (surface.querySelector(".hangman-runtime-root")) return false;
    addStyle(); surface.innerHTML = ""; surface.classList.add("hangman-runtime-game");
    const prefs = readJson(PREF_KEY, { mode:"en", difficulty:"normal", category:"전체", muted:false });
    let mode = modeValue(prefs.mode), diff = difficulty(prefs.difficulty), category = prefs.category || "전체", muted = Boolean(prefs.muted);
    let records = loadRecords(), item = null, guessed = new Set(), wrongWords = new Set(), wrong = 0, score = 0, streak = 0, started = false, completed = false, hintUsed = false;

    const root = document.createElement("div"); root.className = "hangman-runtime-root";
    const hud = document.createElement("div"); hud.className = "mini-score";
    const hudNames = ["점수","실수","연승","남은 칸","최고 연승"];
    const hudValues = hudNames.map(function (name) { const span=document.createElement("span"), b=document.createElement("b"), small=document.createElement("small"); b.textContent="-"; small.textContent=name; span.append(b,small); hud.appendChild(span); return b; });
    const settings = document.createElement("div"); settings.className = "hangman-settings";
    function selectLabel(text, html) { const label=document.createElement("label"); const s=document.createElement("select"); label.innerHTML="<span>"+text+"</span>"; s.innerHTML=html; label.appendChild(s); settings.appendChild(label); return s; }
    const modeSelect = selectLabel("언어", '<option value="en">영문 행맨</option><option value="ko">한글 초성 행맨</option>');
    const diffSelect = selectLabel("난이도", '<option value="easy">쉬움 · 실수 8</option><option value="normal">보통 · 실수 6</option><option value="hard">어려움 · 실수 5</option>');
    const catSelect = selectLabel("카테고리", '<option>전체</option><option>생활</option><option>여행</option><option>자연</option><option>음식</option><option>과학</option>');
    const card = document.createElement("div"); card.className="hangman-card";
    const categoryLine=document.createElement("div"); categoryLine.className="hangman-category";
    const hintLine=document.createElement("p"); hintLine.className="hangman-hint";
    const wordBox=document.createElement("div"); wordBox.className="hangman-word"; wordBox.setAttribute("aria-live","polite");
    const stage=document.createElement("pre"); stage.className="hangman-stage"; stage.setAttribute("aria-hidden","true");
    card.append(categoryLine,hintLine,wordBox,stage);
    const letters=document.createElement("div"); letters.className="hangman-letters"; letters.setAttribute("aria-label","글자 선택");
    const guessWrap=document.createElement("div"); guessWrap.className="hangman-guess";
    const wordInput=document.createElement("input"); wordInput.type="text"; wordInput.autocomplete="off"; wordInput.spellcheck=false; wordInput.placeholder="전체 단어를 알고 있다면 입력";
    const wordSubmit=document.createElement("button"); wordSubmit.type="button"; wordSubmit.className="button primary"; wordSubmit.textContent="단어 확인"; guessWrap.append(wordInput,wordSubmit);
    const actions=document.createElement("div"); actions.className="mini-controls hangman-actions";
    const newButton=document.createElement("button"); newButton.type="button"; newButton.className="button primary"; newButton.textContent="새 도전";
    const hintButton=document.createElement("button"); hintButton.type="button"; hintButton.className="button secondary"; hintButton.textContent="한 글자 힌트";
    const skipButton=document.createElement("button"); skipButton.type="button"; skipButton.className="button secondary"; skipButton.textContent="포기·새 단어";
    const muteButton=document.createElement("button"); muteButton.type="button"; muteButton.className="button secondary"; actions.append(newButton,hintButton,skipButton,muteButton);
    const recordBox=document.createElement("div"); recordBox.className="hangman-records";
    const note=document.createElement("p"); note.className="mini-note hangman-note"; note.textContent="영문은 A~Z 키보드 입력을 지원합니다. 한글은 초성 버튼 또는 전체 단어 입력으로 플레이하세요.";
    root.append(hud,settings,card,letters,guessWrap,actions,recordBox,note); surface.appendChild(root);

    function cfg(){return profiles[diff];}
    function currentRecord(){return records[recordKey(mode,diff)];}
    function tone(freq,duration){if(muted)return;try{audioContext=audioContext||new(window.AudioContext||window.webkitAudioContext)();if(audioContext.state==="suspended")audioContext.resume();const o=audioContext.createOscillator(),g=audioContext.createGain();o.frequency.value=freq;o.type="sine";g.gain.value=.035;o.connect(g);g.connect(audioContext.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,audioContext.currentTime+(duration||.12));o.stop(audioContext.currentTime+(duration||.13));}catch(e){}}
    function announce(text){const out=document.querySelector("#playResult");if(out)out.textContent=text;}
    function pool(){const all=words[mode];const filtered=category==="전체"?all:all.filter(function(w){return w.cat===category;});return filtered.length?filtered:all;}
    function pick(exclude){const p=pool().filter(function(w){return !exclude || w.word!==exclude;});return p[Math.floor(Math.random()*p.length)]||pool()[0];}
    function displayUnits(){return mode==="en"?item.word.split(""):Array.from(item.word);}
    function guessKeyForChar(char){return mode==="en"?char.toUpperCase():initialOf(char);}
    function isOpen(char){return guessed.has(guessKeyForChar(char));}
    function remainingCount(){return displayUnits().filter(function(ch){return !isOpen(ch);}).length;}
    function solved(){return item && remainingCount()===0;}
    function gallows(){const n=Math.min(6,wrong);const parts=["  +---+","  |   |",n>0?"  O   |":"      |",n>2?" /|\\  |":n>1?"  |   |":"      |",n>4?" / \\  |":n>3?" /    |":"      |","      |","========="];return parts.join("\n");}
    function saveRecords(){writeJson(RECORD_KEY,records);}
    function saveGame(){if(!started||completed||!item){if(completed)removeKey(SAVE_KEY);return;}writeJson(SAVE_KEY,{version:2,mode,difficulty:diff,category,itemWord:item.word,guessed:Array.from(guessed),wrongWords:Array.from(wrongWords),wrong,score,streak,hintUsed});}
    function validSave(s){return s&&s.version===2&&(s.mode==="en"||s.mode==="ko")&&profiles[s.difficulty]&&typeof s.itemWord==="string"&&Array.isArray(s.guessed)&&Number.isFinite(Number(s.wrong));}
    function renderWord(){wordBox.innerHTML="";displayUnits().forEach(function(ch){const span=document.createElement("span");span.className="hangman-slot"+(isOpen(ch)?" is-open":"");span.textContent=isOpen(ch)?ch:"•";span.setAttribute("aria-label",isOpen(ch)?ch:"숨은 글자");wordBox.appendChild(span);});}
    function renderLetters(){letters.innerHTML="";const alphabet=mode==="en"?"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""):CHOSEONG.slice();alphabet.forEach(function(letter){const b=document.createElement("button");b.type="button";b.className="hangman-letter";b.textContent=letter;b.setAttribute("aria-label",letter+" 선택");if(guessed.has(letter)){b.disabled=true;const hit=displayUnits().some(function(ch){return guessKeyForChar(ch)===letter;});b.classList.add(hit?"is-hit":"is-miss");}else b.disabled=!started||completed;b.addEventListener("click",function(){chooseLetter(letter);});letters.appendChild(b);});}
    function updateHud(){hudValues[0].textContent=score;hudValues[1].textContent=wrong+"/"+cfg().maxWrong;hudValues[2].textContent=streak;hudValues[3].textContent=item?remainingCount():"-";hudValues[4].textContent=currentRecord().bestStreak||"-";modeSelect.value=mode;diffSelect.value=diff;catSelect.value=category;muteButton.textContent=muted?"소리 켜기":"소리 끄기";hintButton.disabled=!started||completed||hintUsed||!item;skipButton.disabled=!started||completed;wordInput.disabled=!started||completed;wordSubmit.disabled=!started||completed;const r=currentRecord();recordBox.innerHTML=`<strong>${mode==="en"?"영문":"한글"} · ${cfg().label}</strong><span>도전 ${r.attempts}</span><span>승리 ${r.wins}</span><span>최고 점수 ${r.bestScore}</span><span>최고 연승 ${r.bestStreak}</span><span>최대 잔여 ${r.bestRemaining}</span>`;}
    function render(){categoryLine.textContent=item?`${item.cat} · ${mode==="en"?"영문 행맨":"한글 초성 행맨"}`:"행맨 준비";hintLine.textContent=item?item.hint:"언어·난이도·카테고리를 고르고 새 도전을 시작하세요.";stage.textContent=gallows();renderWord();renderLetters();updateHud();}
    function begin(resetScore){const previous=item&&item.word;item=pick(previous);guessed.clear();wrongWords.clear();wrong=0;hintUsed=false;started=true;completed=false;if(resetScore){score=0;streak=0;}currentRecord().attempts+=1;saveRecords();wordInput.value="";render();saveGame();announce(`${mode==="en"?"영문":"한글 초성"} 행맨 시작 · ${item.cat} 카테고리입니다.`);wordInput.focus({preventScroll:true});}
    function win(){completed=true;started=false;streak+=1;const remain=Math.max(0,cfg().maxWrong-wrong);const gained=(90+remain*18+(hintUsed?0:35))*cfg().score;score+=gained;const r=currentRecord();r.wins+=1;r.bestScore=Math.max(r.bestScore,score);r.bestStreak=Math.max(r.bestStreak,streak);r.bestRemaining=Math.max(r.bestRemaining,remain);saveRecords();removeKey(SAVE_KEY);tone(820,.18);render();announce(`정답 ${item.word}! +${gained}점 · 연승 ${streak}. 새 도전으로 다음 단어를 이어갈 수 있습니다.`);newButton.textContent="다음 단어";}
    function lose(message){completed=true;started=false;streak=0;const r=currentRecord();r.bestScore=Math.max(r.bestScore,score);saveRecords();removeKey(SAVE_KEY);tone(180,.22);guessed=new Set((mode==="en"?item.word.split(""):Array.from(item.word).map(initialOf)));render();announce(`${message} 정답은 ${item.word}입니다. 연승은 초기화됩니다.`);newButton.textContent="새 도전";}
    function chooseLetter(letter){if(!started||completed||guessed.has(letter))return;guessed.add(letter);const hit=displayUnits().some(function(ch){return guessKeyForChar(ch)===letter;});if(hit){score+=8*cfg().score;tone(560,.08);announce(`${letter} 포함! 단어의 위치를 확인하세요.`);}else{wrong+=1;score=Math.max(0,score-6*cfg().score);tone(220,.09);announce(`${letter}는 없습니다. 실수 ${wrong}/${cfg().maxWrong}.`);}if(solved())win();else if(wrong>=cfg().maxWrong)lose("실수 한도를 모두 사용했습니다.");else{render();saveGame();}}
    function wholeGuess(){if(!started||completed)return;const value=normalize(wordInput.value,mode);if(!value)return;const answer=normalize(item.word,mode);if(value===answer){guessed=new Set((mode==="en"?item.word.split(""):Array.from(item.word).map(initialOf)));win();return;}if(wrongWords.has(value)){announce("이미 시도한 단어입니다. 다른 후보를 입력하세요.");return;}wrongWords.add(value);wrong+=1;score=Math.max(0,score-10*cfg().score);tone(190,.1);wordInput.select();if(wrong>=cfg().maxWrong)lose("전체 단어 추리가 빗나갔고 실수 한도를 모두 사용했습니다.");else{render();saveGame();announce(`정답이 아닙니다. 전체 단어 오답도 실수 1회로 계산됩니다. ${wrong}/${cfg().maxWrong}`);}}
    function hint(){if(!started||completed||hintUsed)return;const candidates=displayUnits().map(function(ch){return guessKeyForChar(ch);}).filter(function(k){return !guessed.has(k);});if(!candidates.length)return;const key=candidates[Math.floor(Math.random()*candidates.length)];hintUsed=true;guessed.add(key);score=Math.max(0,score-25*cfg().score);tone(640,.12);if(solved())win();else{render();saveGame();announce(`${key} 글자를 힌트로 공개했습니다. 힌트 사용으로 보너스가 줄어듭니다.`);}}
    function abandon(){if(!started||completed){begin(false);return;}streak=0;removeKey(SAVE_KEY);const answer=item.word;completed=true;started=false;guessed=new Set((mode==="en"?item.word.split(""):Array.from(item.word).map(initialOf)));render();announce(`정답은 ${answer}였습니다. 포기하면 연승이 초기화됩니다. 새 도전을 눌러 다음 단어를 시작하세요.`);newButton.textContent="새 도전";}
    function restore(){const s=readJson(SAVE_KEY,null);if(!validSave(s)){render();announce("언어·난이도·카테고리를 고르고 새 도전을 시작하세요.");return;}mode=modeValue(s.mode);diff=difficulty(s.difficulty);category=s.category||"전체";item=words[mode].find(function(w){return w.word===s.itemWord;})||null;if(!item){removeKey(SAVE_KEY);render();return;}guessed=new Set(s.guessed||[]);wrongWords=new Set(s.wrongWords||[]);wrong=Math.max(0,Number(s.wrong)||0);score=Math.max(0,Number(s.score)||0);streak=Math.max(0,Number(s.streak)||0);hintUsed=Boolean(s.hintUsed);started=true;completed=false;render();announce(`${mode==="en"?"영문":"한글"} ${item.cat} 단어 진행 상태를 복구했습니다.`);}
    function changeSetting(){mode=modeValue(modeSelect.value);diff=difficulty(diffSelect.value);category=catSelect.value||"전체";writeJson(PREF_KEY,{mode,difficulty:diff,category,muted});removeKey(SAVE_KEY);item=null;guessed.clear();wrongWords.clear();wrong=0;score=0;streak=0;started=false;completed=false;hintUsed=false;newButton.textContent="새 도전";render();announce("설정을 변경했습니다. 새 도전을 시작하세요.");}
    function onKey(event){if(!root.isConnected||event.altKey||event.ctrlKey||event.metaKey)return;if(event.target===wordInput)return;if(mode!=="en"||!started||completed)return;const key=event.key.toUpperCase();if(!/^[A-Z]$/.test(key))return;event.preventDefault();event.stopImmediatePropagation();chooseLetter(key);}

    modeSelect.addEventListener("change",changeSetting);diffSelect.addEventListener("change",changeSetting);catSelect.addEventListener("change",changeSetting);
    newButton.addEventListener("click",function(){begin(completed&&streak===0?false:!item);});hintButton.addEventListener("click",hint);skipButton.addEventListener("click",abandon);muteButton.addEventListener("click",function(){muted=!muted;writeJson(PREF_KEY,{mode,difficulty:diff,category,muted});updateHud();});wordSubmit.addEventListener("click",wholeGuess);wordInput.addEventListener("keydown",function(event){if(event.key==="Enter"){event.preventDefault();wholeGuess();}});window.addEventListener("keydown",onKey,true);
    const externalRestart=document.querySelector("#restartGame");function externalReset(){removeKey(SAVE_KEY);}if(externalRestart)externalRestart.addEventListener("click",externalReset,true);
    const cleanupObserver=new MutationObserver(function(){if(root.isConnected)return;window.removeEventListener("keydown",onKey,true);if(externalRestart)externalRestart.removeEventListener("click",externalReset,true);surface.classList.remove("hangman-runtime-game");cleanupObserver.disconnect();});cleanupObserver.observe(document.documentElement,{childList:true,subtree:true});
    restore();return true;
  }
  function isTarget(surface){if(surface.dataset.gameId==="hangman")return true;if(location.pathname.indexOf("/games/hangman/")>=0)return true;return surface.id==="playSurface"&&new URLSearchParams(location.search).get("game")==="hangman";}
  function scan(){document.querySelectorAll("#playSurface, .play-surface").forEach(function(surface){if(isTarget(surface)&&!surface.querySelector(".hangman-runtime-root"))setup(surface);});}
  function boot(){scan();const observer=new MutationObserver(scan);observer.observe(document.documentElement,{childList:true,subtree:true});}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();