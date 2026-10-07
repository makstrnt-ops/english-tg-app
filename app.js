'use strict';

/* ================= Telegram ================= */
const tg = window.Telegram && window.Telegram.WebApp;
const inTG = !!(tg && tg.platform && tg.platform !== 'unknown');
const ver = v => inTG && typeof tg.isVersionAtLeast === 'function' && tg.isVersionAtLeast(v);

if (inTG) {
  tg.ready();
  tg.expand();
  try { if (ver('6.1')) { tg.setHeaderColor('secondary_bg_color'); tg.setBackgroundColor('secondary_bg_color'); } } catch (e) {}
  try { if (ver('7.7')) tg.disableVerticalSwipes(); } catch (e) {}
  tg.BackButton.onClick(back);
}

function haptic(type) {
  try {
    if (!inTG || !tg.HapticFeedback) return;
    if (type === 'success' || type === 'error' || type === 'warning') tg.HapticFeedback.notificationOccurred(type);
    else tg.HapticFeedback.impactOccurred(type || 'light');
  } catch (e) {}
}

function confirmDlg(msg, cb) {
  if (ver('6.2')) tg.showConfirm(msg, ok => ok && cb());
  else if (window.confirm(msg)) cb();
}

/* ================= Helpers ================= */
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = (a, n) => shuffle(a).slice(0, n);
// Номер локального дня (для интервального повторения)
const today = () => { const d = new Date(); return Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000); };
const dayLabel = n => new Date(n * 86400000).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', timeZone: 'UTC' });
const plural = (n, one, few, many) => { const m10 = n % 10, m100 = n % 100; return m10 === 1 && m100 !== 11 ? one : m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20) ? few : many; };

function toast(msg) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove('show'), 2400);
}

/* ================= Озвучка ================= */
const ttsOK = 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
let enVoice = null;
function pickVoice() {
  const vs = speechSynthesis.getVoices();
  enVoice = vs.find(v => /en[-_]US/i.test(v.lang)) || vs.find(v => /^en/i.test(v.lang)) || null;
}
if (ttsOK) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
function speak(text) {
  if (!ttsOK || !text) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    if (enVoice) u.voice = enVoice;
    u.rate = 0.9;
    speechSynthesis.speak(u);
  } catch (e) {}
}
const autoSay = text => { if (S.autoSay) speak(text); };
const sayBtn = t => ttsOK ? `<button type="button" class="say" data-say="${esc(t)}" aria-label="Озвучить">🔊</button>` : '';
document.addEventListener('click', e => { const b = e.target.closest('[data-say]'); if (b) speak(b.dataset.say); });

/* ================= Данные ================= */
const LEVELS = ['A1', 'A2', 'B1', 'B2'];
const LEVEL_INFO = {
  A1: 'Начинающий — знаю буквы и пару фраз',
  A2: 'Элементарный — простые бытовые темы',
  B1: 'Средний — объяснюсь в поездке и на работе',
  B2: 'Выше среднего — свободно говорю на многие темы'
};
const WORDS = [], WORD_BY_ID = {}, WORDS_BY_LV = {};
for (const lv of LEVELS) {
  WORDS_BY_LV[lv] = [];
  for (const line of DATA.words[lv].trim().split('\n')) {
    const [en, ru, ex = ''] = line.split('|').map(s => s.trim());
    if (!en || !ru) continue;
    const w = { id: 'w:' + en, en, ru, ex, lv };
    WORDS.push(w); WORD_BY_ID[w.id] = w; WORDS_BY_LV[lv].push(w);
  }
}
const VERBS = DATA.verbs.trim().split('\n').map(line => {
  const [base, v2, v3, ru] = line.split('|').map(s => s.trim());
  return { id: 'v:' + base, base, v2, v3, ru };
});
const VERB_BY_ID = Object.fromEntries(VERBS.map(v => [v.id, v]));
const TOPIC_BY_ID = Object.fromEntries(DATA.grammar.map(t => [t.id, t]));

const customToWord = c => ({ id: c.id, en: c.en, ru: c.ru, ex: c.ex || '', lv: 'my' });
const getWord = id => WORD_BY_ID[id] || (id.startsWith('c:') ? (S.custom.find(c => c.id === id) && customToWord(S.custom.find(c => c.id === id))) : null);
const allWords = () => [...S.custom.map(customToWord), ...WORDS];

/* ================= Состояние и хранение ================= */
const LS_KEY = 'engtrainer_v1';
function fresh() {
  return { v: 1, updated: 0, level: null, goal: 20, newPerDay: 10, autoSay: true,
    cards: {}, custom: [], days: {}, gstats: {}, streak: { n: 0, last: 0 } };
}
function load() {
  try { const raw = localStorage.getItem(LS_KEY); if (raw) return Object.assign(fresh(), JSON.parse(raw)); } catch (e) {}
  return fresh();
}
let S = load();

let cloudTimer = null;
function save() {
  const t = today();
  for (const k of Object.keys(S.days)) if (+k < t - 60) delete S.days[k];
  S.updated = Date.now();
  const json = JSON.stringify(S);
  try { localStorage.setItem(LS_KEY, json); } catch (e) {}
  clearTimeout(cloudTimer);
  cloudTimer = setTimeout(() => cloudSave(json), 1500);
}

// Telegram CloudStorage: синхронизация между устройствами (значение ≤ 4096 символов → режем на куски)
const cloudOK = () => ver('6.9') && !!tg.CloudStorage;
const CHUNK = 4000;
function cloudSave(json) {
  if (!cloudOK()) return;
  const n = Math.ceil(json.length / CHUNK);
  for (let i = 0; i < n; i++) tg.CloudStorage.setItem('s' + i, json.slice(i * CHUNK, (i + 1) * CHUNK));
  tg.CloudStorage.setItem('meta', JSON.stringify({ n, updated: S.updated }));
}
function cloudLoad() {
  if (!cloudOK()) return;
  tg.CloudStorage.getItem('meta', (err, m) => {
    if (err || !m) return;
    let meta; try { meta = JSON.parse(m); } catch (e) { return; }
    if (!(meta.updated > S.updated)) return;
    const keys = Array.from({ length: meta.n }, (_, i) => 's' + i);
    tg.CloudStorage.getItems(keys, (err2, vals) => {
      if (err2 || !vals) return;
      try {
        const json = keys.map(k => vals[k] || '').join('');
        S = Object.assign(fresh(), JSON.parse(json));
        try { localStorage.setItem(LS_KEY, json); } catch (e) {}
        const cur = stack[stack.length - 1].name;
        if (cur === 'home' || cur === 'welcome') resetTo(S.level ? 'home' : 'welcome');
        toast('Прогресс загружен из облака');
      } catch (e) {}
    });
  });
}

/* ================= Прогресс дня, XP, серия ================= */
function dayRec() { const k = today(); return S.days[k] || (S.days[k] = { xp: 0, ok: 0, n: 0, nw: 0 }); }
const todayXP = () => (S.days[today()] || { xp: 0 }).xp;
function addXP(x, correct) {
  const d = dayRec();
  d.xp += x; d.n++; if (correct) d.ok++;
  if (!d.g && d.xp >= S.goal) {
    d.g = 1;
    const t = today();
    S.streak = { n: S.streak && S.streak.last === t - 1 ? S.streak.n + 1 : 1, last: t };
    setTimeout(() => toast(`🎯 Цель дня выполнена! Серия: ${S.streak.n} 🔥`), 300);
    haptic('success');
  }
  save();
}
const streak = () => (S.streak && S.streak.last >= today() - 1 ? S.streak.n : 0);

/* ================= Интервальное повторение (упрощённый SM-2) ================= */
// карточка: d — день следующего показа, i — интервал (дни), e — лёгкость×100, r — успешных подряд, l — забываний
function nextCard(c, g) {
  c = c ? { ...c } : { d: 0, i: 0, e: 250, r: 0, l: 0 };
  let i;
  if (g === 0) { c.l++; c.r = 0; c.e = Math.max(130, c.e - 20); i = 0; }
  else if (g === 1) { c.e = Math.max(130, c.e - 15); i = c.r === 0 ? 1 : Math.max(1, Math.round(c.i * 1.2)); c.r++; }
  else if (g === 2) { i = c.r === 0 ? 1 : c.r === 1 ? 3 : Math.max(c.i + 1, Math.round(c.i * c.e / 100)); c.r++; }
  else { c.e += 15; i = c.r === 0 ? 4 : Math.max(c.i + 2, Math.round(Math.max(c.i, 1) * c.e / 100 * 1.3)); c.r++; }
  c.i = Math.min(i, 365);
  c.d = today() + c.i;
  return c;
}
const fmtInt = i => i === 0 ? 'сейчас' : i === 1 ? 'завтра' : i < 30 ? `${i} дн.` : i < 365 ? `${Math.round(i / 30)} мес.` : '1 год';
const resurface = id => { if (S.cards[id]) S.cards[id].d = today(); };
const isMastered = c => c && c.i >= 21;

function dueWordIds() {
  const t = today();
  return Object.entries(S.cards)
    .filter(([id, c]) => !id.startsWith('v:') && c.d <= t && getWord(id))
    .sort((a, b) => a[1].d - b[1].d).map(([id]) => id);
}
function levelOrder() {
  const i = Math.max(0, LEVELS.indexOf(S.level));
  return [...LEVELS.slice(i), ...LEVELS.slice(0, i).reverse()].flatMap(l => WORDS_BY_LV[l]);
}
function newWordIds(n, exclude) {
  const out = [];
  if (n <= 0) return out;
  for (const w of [...S.custom.map(customToWord), ...levelOrder()]) {
    if (out.length >= n) break;
    if (!S.cards[w.id] && !(exclude && exclude.has(w.id))) out.push(w.id);
  }
  return out;
}
const newLeft = () => Math.max(0, S.newPerDay - ((S.days[today()] || {}).nw || 0));
const dueVerbIds = () => { const t = today(); return VERBS.filter(v => S.cards[v.id] && S.cards[v.id].d <= t).map(v => v.id); };

/* ================= Навигация ================= */
const app = $('#app'), topbar = $('#topbar');
const stack = [];
let sess = null;

function view(html) { app.innerHTML = html; }
function click(sel, fn) { app.querySelectorAll(sel).forEach(el => el.addEventListener('click', fn)); }
function go(name, params) { stack.push({ name, params }); render(); }
function back() { if (stack.length > 1) { stack.pop(); render(); } }
function resetTo(name) { stack.length = 0; stack.push({ name }); render(); }
function render() {
  const top = stack[stack.length - 1];
  sess = null;
  if (ttsOK) speechSynthesis.cancel();
  SCREENS[top.name](top.params || {});
  const canBack = stack.length > 1;
  if (inTG) { canBack ? tg.BackButton.show() : tg.BackButton.hide(); topbar.innerHTML = ''; }
  else {
    topbar.innerHTML = canBack ? '<button id="backb">‹ Назад</button>' : '';
    if (canBack) $('#backb').addEventListener('click', back);
  }
  window.scrollTo(0, 0);
}
const progress = (i, n) => `<div class="sbar" role="progressbar" aria-valuenow="${i}" aria-valuemax="${n}"><i style="width:${n ? Math.round(i / n * 100) : 0}%"></i></div>`;
const homeBtn = () => '<button class="btn" id="home">На главную</button>';
const bindHome = () => click('#home', () => resetTo('home'));

/* ================= Экраны ================= */
const SCREENS = {};

/* ---------- Приветствие ---------- */
SCREENS.welcome = () => {
  view(`
    <div class="welcome">
      <div class="big-emoji">🇬🇧</div>
      <h1>English Trainer</h1>
      <p class="hint">Слова с интервальным повторением, грамматика и неправильные глаголы. 10–15 минут в день — и уровень растёт.</p>
    </div>
    <h2>Какой у тебя уровень?</h2>
    <div class="list">${LEVELS.map(l => `<button class="row" data-lv="${l}"><b class="lv">${l}</b><span>${LEVEL_INFO[l]}</span></button>`).join('')}</div>
    <button class="btn primary" id="test">Не знаю — пройти тест (2 мин)</button>`);
  click('[data-lv]', e => { S.level = e.currentTarget.dataset.lv; save(); haptic('light'); resetTo('home'); });
  click('#test', () => go('placement'));
};

/* ---------- Тест уровня ---------- */
SCREENS.placement = () => {
  const qs = [];
  for (const lv of LEVELS) {
    for (const w of pick(WORDS_BY_LV[lv], 4)) {
      const dis = pick(WORDS_BY_LV[lv].filter(x => x.ru !== w.ru), 3);
      qs.push({ w, opts: shuffle([w, ...dis]) });
    }
  }
  sess = { qs, i: 0, score: { A1: 0, A2: 0, B1: 0, B2: 0 } };
  drawPlacement();
};
function drawPlacement() {
  const s = sess;
  if (s.i >= s.qs.length) return placementResult();
  const q = s.qs[s.i];
  view(`${progress(s.i, s.qs.length)}
    <div class="card center"><div class="hint">Вопрос ${s.i + 1} из ${s.qs.length} · как переводится?</div><div class="word">${esc(q.w.en)}</div></div>
    <div class="opts">${q.opts.map((o, k) => `<button class="opt" data-k="${k}">${esc(o.ru)}</button>`).join('')}
    <button class="opt ghost" data-k="-1">Не знаю</button></div>`);
  click('.opt', e => {
    const k = +e.currentTarget.dataset.k;
    if (k >= 0 && q.opts[k] === q.w) s.score[q.w.lv]++;
    s.i++; haptic('light'); drawPlacement();
  });
}
function placementResult() {
  const sc = sess.score;
  let lv = 'B2';
  for (const l of LEVELS) if (sc[l] < 3) { lv = l; break; }
  view(`
    <div class="card center"><div class="big-emoji">🎓</div><div class="hint">Рекомендуемый уровень</div><div class="word">${lv}</div><p class="hint">${LEVEL_INFO[lv]}</p></div>
    <div class="list">${LEVELS.map(l => `<div class="row"><b class="lv">${l}</b><span>${sc[l]} из 4 верно</span></div>`).join('')}</div>
    <button class="btn primary" id="ok">Начать с уровня ${lv}</button>
    <p class="hint center small">Уровень можно поменять в настройках в любой момент.</p>`);
  click('#ok', () => { S.level = lv; save(); resetTo('home'); });
}

/* ---------- Главная ---------- */
SCREENS.home = () => {
  const xp = todayXP();
  const pct = Math.min(100, Math.round(xp / S.goal * 100));
  const due = dueWordIds().length;
  const nw = newWordIds(newLeft()).length;
  const vdue = dueVerbIds().length;
  const user = inTG && tg.initDataUnsafe && tg.initDataUnsafe.user;
  const h = new Date().getHours();
  const greet = h < 6 ? 'Доброй ночи' : h < 12 ? 'Доброе утро' : h < 18 ? 'Добрый день' : 'Добрый вечер';
  view(`
    <header class="hero">
      <div class="hero-row">
        <div><div class="hint">${greet}</div><h1>${user && user.first_name ? esc(user.first_name) : 'Привет!'}</h1></div>
        <div class="streak" title="Дней подряд с выполненной целью">🔥 ${streak()}</div>
      </div>
      <div class="goal">
        <div class="goal-top"><span>Цель дня</span><span><b>${xp}</b> / ${S.goal} XP ${xp >= S.goal ? '✅' : ''}</span></div>
        <div class="bar"><i style="width:${pct}%"></i></div>
      </div>
    </header>
    <button class="tile main" id="learn">
      <div class="tile-ico">🧠</div>
      <div><div class="tile-title">Учить слова</div><div class="tile-sub">Повторить: ${due} · Новых: ${nw}</div></div>
    </button>
    <div class="grid">
      <button class="tile" data-go="quiz"><div class="tile-ico">🎯</div><div><div class="tile-title">Квиз</div><div class="tile-sub">Выбери перевод</div></div></button>
      <button class="tile" data-go="spell"><div class="tile-ico">✍️</div><div><div class="tile-title">Правописание</div><div class="tile-sub">Напиши слово</div></div></button>
      <button class="tile" data-go="grammar"><div class="tile-ico">📐</div><div><div class="tile-title">Грамматика</div><div class="tile-sub">${DATA.grammar.length} тем</div></div></button>
      <button class="tile" data-go="verbs"><div class="tile-ico">🔁</div><div><div class="tile-title">Неправ. глаголы</div><div class="tile-sub">${vdue ? 'Повторить: ' + vdue : VERBS.length + ' глаголов'}</div></div></button>
    </div>
    <div class="list">
      <button class="row" data-go="dict"><span>📒</span><span>Мой словарь</span><span class="chev">›</span></button>
      <button class="row" data-go="stats"><span>📊</span><span>Статистика</span><span class="chev">›</span></button>
      <button class="row" data-go="settings"><span>⚙️</span><span>Настройки</span><span class="chev">›</span></button>
    </div>
    <p class="hint center small">Уровень ${S.level} · ${cloudOK() ? 'прогресс сохраняется в облаке Telegram' : 'прогресс сохраняется на этом устройстве'}</p>`);
  click('#learn', () => go('learn'));
  click('[data-go]', e => go(e.currentTarget.dataset.go));
};

/* ---------- Учить слова (флеш-карточки) ---------- */
SCREENS.learn = p => {
  const due = dueWordIds();
  const nw = newWordIds(p.extra || newLeft());
  // новые слова вперемешку с повторениями: 3 повторения → 1 новое
  const q = [];
  let di = 0, ni = 0;
  while (di < due.length || ni < nw.length) {
    for (let k = 0; k < 3 && di < due.length; k++) q.push(due[di++]);
    if (ni < nw.length) q.push(nw[ni++]);
  }
  if (!q.length) return learnEmpty();
  sess = { q, done: 0, ok: 0, flipped: false, rev: false };
  drawLearn();
};
function learnEmpty() {
  const left = newWordIds(1).length;
  view(`
    <div class="card center"><div class="big-emoji">🌿</div><h2>На сегодня всё повторено</h2>
    <p class="hint">${left ? 'Лимит новых слов на сегодня исчерпан. Можно взять ещё или потренироваться в квизе.' : 'Ты прошёл все слова в базе! Добавляй свои в «Мой словарь».'}</p></div>
    ${left ? '<button class="btn primary" id="more">Ещё 5 новых слов</button>' : ''}
    <button class="btn" id="quiz">Квиз по изученным</button>
    ${homeBtn()}`);
  click('#more', () => { stack[stack.length - 1].params = { extra: 5 }; render(); });
  click('#quiz', () => { stack.pop(); go('quiz'); });
  bindHome();
}
function drawLearn() {
  const s = sess;
  if (!s.q.length) return learnDone();
  const id = s.q[0];
  const w = getWord(id);
  if (!w) { s.q.shift(); return drawLearn(); }
  const c = S.cards[id];
  const isNew = !c;
  if (!s.flipped) s.rev = !!c && c.r >= 2 && Math.random() < 0.35; // иногда наоборот: RU → EN

  const front = s.rev
    ? `<div class="hint">Вспомни по-английски</div><div class="word">${esc(w.ru)}</div>`
    : `<div class="hint">${isNew ? '<span class="badge">новое слово</span>' : 'Вспомни перевод'}</div><div class="word">${esc(w.en)} ${sayBtn(w.en)}</div>`;
  const answer = !s.flipped ? '<div class="hint small tap-hint">нажми, чтобы увидеть ответ</div>' : `
    <div class="divider"></div>
    ${s.rev ? `<div class="word sm">${esc(w.en)} ${sayBtn(w.en)}</div>` : `<div class="tr">${esc(w.ru)}</div>`}
    ${w.ex ? `<div class="ex">${esc(w.ex)} ${sayBtn(w.ex)}</div>` : ''}`;
  const grades = [['Не помню', 'bad'], ['Сложно', 'warn'], ['Помню', 'ok'], ['Легко', 'easy']];

  view(`${progress(s.done, s.done + s.q.length)}
    <div class="card flash ${s.flipped ? '' : 'tappable'}" id="flash">${front}${answer}</div>
    ${s.flipped
      ? `<div class="grades">${grades.map(([t, cls], g) => `<button class="gbtn ${cls}" data-g="${g}"><b>${t}</b><small>${fmtInt(nextCard(c, g).i)}</small></button>`).join('')}</div>
         ${isNew ? '<button class="link" id="known">Я уже знаю это слово — пропустить</button>' : ''}`
      : '<button class="btn primary" id="show">Показать ответ</button>'}`);

  if (!s.flipped) {
    const flip = e => {
      if (e.target.closest('[data-say]')) return;
      s.flipped = true; haptic('light'); drawLearn();
      if (s.rev) autoSay(w.en);
    };
    click('#flash', flip); click('#show', flip);
    if (!s.rev) autoSay(w.en);
  } else {
    click('[data-g]', e => gradeLearn(id, +e.currentTarget.dataset.g));
    click('#known', () => {
      S.cards[id] = { d: today() + 60, i: 60, e: 270, r: 3, l: 0 };
      s.q.shift(); s.flipped = false; s.done++; s.ok++;
      const repl = newWordIds(1, new Set(s.q)); // замена пропущенному слову
      if (repl.length) s.q.push(repl[0]);
      addXP(1, true); drawLearn();
    });
  }
}
function gradeLearn(id, g) {
  const s = sess;
  if (!S.cards[id]) dayRec().nw++;
  S.cards[id] = nextCard(S.cards[id], g);
  s.q.shift(); s.flipped = false; s.done++;
  if (g > 0) s.ok++;
  else s.q.splice(Math.min(3, s.q.length), 0, id); // забытое — вернуть через пару карточек
  haptic(g === 0 ? 'warning' : 'light');
  addXP(1, g > 0);
  drawLearn();
}
function learnDone() {
  const s = sess;
  const pct = s.done ? Math.round(s.ok / s.done * 100) : 0;
  view(`
    <div class="card center"><div class="big-emoji">🎉</div><h2>Сессия завершена</h2>
    <p class="hint">${s.done} ${plural(s.done, 'карточка', 'карточки', 'карточек')} · вспомнил с первого раза ${pct}%</p>
    <p class="hint">Сегодня: ${todayXP()} / ${S.goal} XP</p></div>
    ${newWordIds(1).length ? '<button class="btn primary" id="more">Ещё 5 новых слов</button>' : ''}
    <button class="btn" id="quiz">Закрепить в квизе</button>
    ${homeBtn()}`);
  click('#more', () => { stack[stack.length - 1].params = { extra: 5 }; render(); });
  click('#quiz', () => { stack.pop(); go('quiz'); });
  bindHome();
}

/* ---------- Квиз ---------- */
function practicePool() {
  const seen = allWords().filter(w => S.cards[w.id]);
  if (seen.length >= 10) return seen;
  return [...seen, ...WORDS_BY_LV[S.level].filter(w => !S.cards[w.id])];
}
SCREENS.quiz = () => {
  const qs = pick(practicePool(), 10).map(w => {
    const base = w.lv === 'my' ? WORDS : WORDS_BY_LV[w.lv];
    const dis = pick(base.filter(x => x.id !== w.id && x.ru !== w.ru && x.en !== w.en), 3);
    return { w, rev: Math.random() < 0.5, opts: shuffle([w, ...dis]) };
  });
  sess = { qs, i: 0, ok: 0, wrong: [], answered: false };
  drawQuiz();
};
function drawQuiz() {
  const s = sess;
  if (s.i >= s.qs.length) return quizDone();
  const q = s.qs[s.i];
  view(`${progress(s.i, s.qs.length)}
    <div class="card center"><div class="hint">${q.rev ? 'Как сказать по-английски?' : 'Как переводится?'}</div>
    <div class="word">${esc(q.rev ? q.w.ru : q.w.en)} ${q.rev ? '' : sayBtn(q.w.en)}</div></div>
    <div class="opts">${q.opts.map((o, k) => `<button class="opt" data-k="${k}">${esc(q.rev ? o.en : o.ru)}</button>`).join('')}</div>
    <div id="after"></div>`);
  if (!q.rev) autoSay(q.w.en);
  click('.opt', e => {
    if (s.answered) return;
    s.answered = true;
    const k = +e.currentTarget.dataset.k;
    const right = q.opts[k] === q.w;
    app.querySelectorAll('.opt').forEach((b, j) => {
      b.disabled = true;
      if (q.opts[j] === q.w) b.classList.add('ok'); else if (j === k) b.classList.add('bad');
    });
    if (right) { s.ok++; haptic('success'); } else { s.wrong.push(q.w); haptic('error'); resurface(q.w.id); }
    addXP(right ? 1 : 0, right);
    if (q.rev) autoSay(q.w.en);
    const next = () => { if (sess !== s) return; s.i++; s.answered = false; drawQuiz(); };
    if (right) setTimeout(next, 750);
    else { $('#after').innerHTML = '<button class="btn primary" id="next">Дальше</button>'; click('#next', next); }
  });
}
function quizDone() {
  const s = sess;
  view(`
    <div class="card center"><div class="big-emoji">${s.ok >= 8 ? '🏆' : s.ok >= 5 ? '👍' : '💪'}</div><h2>${s.ok} из ${s.qs.length}</h2>
    <p class="hint">${s.wrong.length ? 'Ошибки вернутся в карточки на повторение.' : 'Без ошибок!'}</p></div>
    ${mistakesList(s.wrong)}
    <button class="btn primary" id="again">Ещё раунд</button>
    ${homeBtn()}`);
  click('#again', render);
  bindHome();
}
const mistakesList = ws => !ws.length ? '' : `<h2>Повтори</h2><div class="list">${ws.map(w =>
  `<div class="row word-row"><div><div class="w">${esc(w.en)}</div><div class="t">${esc(w.ru)}</div></div>${sayBtn(w.en)}</div>`).join('')}</div>`;

/* ---------- Правописание ---------- */
const normEn = s => s.toLowerCase().replace(/[’`]/g, "'").replace(/[^a-z' ]/g, ' ').replace(/\s+/g, ' ').trim().replace(/^to /, '');
const isRight = (input, en) => !!normEn(input) && en.split('/').some(v => normEn(v) === normEn(input));
function blankEx(w) {
  if (!w.ex) return '';
  const re = new RegExp('\\b' + w.en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+') + '\\w*', 'i');
  const m = w.ex.match(re);
  if (!m) return '';
  return esc(w.ex.slice(0, m.index)) + '<span class="gap">_____</span>' + esc(w.ex.slice(m.index + m[0].length));
}
const hintFor = (en, lvl) => [...en].map((ch, i) => ch === ' ' ? '  ' : (i === 0 || (lvl > 1 && i % 2 === 0)) ? ch : '_').join(' ');

SCREENS.spell = () => {
  sess = { qs: pick(practicePool(), 10), i: 0, ok: 0, wrong: [] };
  drawSpell();
};
function drawSpell() {
  const s = sess;
  if (s.i >= s.qs.length) return spellDone();
  const w = s.qs[s.i];
  let hint = 0, done = false, right = false;
  const ex = blankEx(w);
  view(`${progress(s.i, s.qs.length)}
    <div class="card center"><div class="hint">Напиши по-английски</div><div class="word sm">${esc(w.ru)}</div>
    ${ex ? `<div class="ex">${ex}</div>` : ''}<div id="hintArea" class="hint mono"></div></div>
    <form id="f" autocomplete="off">
      <input id="inp" class="input" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Твой ответ" enterkeyhint="done">
      <div id="res"></div>
      <div class="row2" id="actions"><button type="button" class="btn" id="hintb">Подсказка</button><button class="btn primary" type="submit">Проверить</button></div>
    </form>
    <button class="link" id="skip">Не знаю — показать</button>`);
  const inp = $('#inp');
  inp.focus();

  const finish = () => {
    if (sess !== s) return;
    addXP(right ? (hint ? 1 : 2) : 0, right);
    if (right) s.ok++; else { s.wrong.push(w); resurface(w.id); }
    s.i++; drawSpell();
  };
  const check = giveUp => {
    if (done) return finish();
    right = !giveUp && isRight(inp.value, w.en);
    if (!giveUp && !right && !inp.value.trim()) { inp.focus(); return; }
    done = true;
    inp.readOnly = true;
    inp.classList.add(right ? 'ok' : 'bad');
    haptic(right ? 'success' : 'error');
    autoSay(w.en);
    $('#skip').style.display = 'none';
    $('#res').innerHTML = right
      ? `<div class="res ok">✓ Верно! <b>${esc(w.en)}</b> ${sayBtn(w.en)}</div>`
      : `<div class="res bad">✗ Правильно: <b>${esc(w.en)}</b> ${sayBtn(w.en)}</div>`;
    $('#actions').innerHTML = right
      ? '<button class="btn primary" type="submit" style="grid-column:1/-1">Дальше</button>'
      : `${giveUp ? '' : '<button type="button" class="btn" id="typo">Опечатка, засчитать</button>'}<button class="btn primary" type="submit" ${giveUp ? 'style="grid-column:1/-1"' : ''}>Дальше</button>`;
    const typo = $('#typo');
    if (typo) typo.addEventListener('click', () => { right = true; finish(); });
    if (right) setTimeout(() => { if (sess === s && s.qs[s.i] === w) finish(); }, 1100);
  };
  $('#f').addEventListener('submit', e => { e.preventDefault(); check(false); });
  click('#skip', () => check(true));
  click('#hintb', () => { hint = Math.min(2, hint + 1); $('#hintArea').textContent = 'Подсказка: ' + hintFor(w.en, hint); inp.focus(); });
}
function spellDone() {
  const s = sess;
  view(`
    <div class="card center"><div class="big-emoji">${s.ok >= 8 ? '🏆' : s.ok >= 5 ? '👍' : '💪'}</div><h2>${s.ok} из ${s.qs.length}</h2>
    <p class="hint">Писать слова — лучший способ их по-настоящему запомнить.</p></div>
    ${mistakesList(s.wrong)}
    <button class="btn primary" id="again">Ещё раунд</button>
    ${homeBtn()}`);
  click('#again', render);
  bindHome();
}

/* ---------- Грамматика ---------- */
SCREENS.grammar = () => {
  view(`
    <h1 class="title">Грамматика</h1>
    <button class="tile main" id="mix"><div class="tile-ico">🔀</div><div><div class="tile-title">Микс по всем темам</div><div class="tile-sub">10 случайных вопросов</div></div></button>
    <div class="list">${DATA.grammar.map(t => {
      const st = S.gstats[t.id];
      return `<button class="row" data-t="${t.id}"><div class="grow"><div>${esc(t.title)}</div>
        <div class="hint small">${t.lv} · ${st ? `верно ${Math.round(st.c / st.t * 100)}% из ${st.t}` : 'ещё не начато'}</div></div><span class="chev">›</span></button>`;
    }).join('')}</div>`);
  click('#mix', () => go('gquiz', { mix: true }));
  click('[data-t]', e => go('gtopic', { id: e.currentTarget.dataset.t }));
};
SCREENS.gtopic = p => {
  const t = TOPIC_BY_ID[p.id];
  view(`
    <h1 class="title">${esc(t.title)}</h1>
    <div class="card theory"><div class="hint small">Правило · ${t.lv}</div>${t.tip}</div>
    <button class="btn primary" id="start">Проверить себя (${t.qs.length} ${plural(t.qs.length, 'вопрос', 'вопроса', 'вопросов')})</button>`);
  click('#start', () => go('gquiz', { id: t.id }));
};
SCREENS.gquiz = p => {
  let items = p.mix
    ? pick(DATA.grammar.flatMap(t => t.qs.map(q => ({ t, q }))), 10)
    : shuffle(TOPIC_BY_ID[p.id].qs).map(q => ({ t: TOPIC_BY_ID[p.id], q }));
  items = items.map(({ t, q }) => {
    const [text, opts, a, ex] = q;
    const order = shuffle(opts.map((_, i) => i));
    return { t, text, opts: order.map(i => opts[i]), a: order.indexOf(a), ex };
  });
  sess = { items, i: 0, ok: 0, wrong: [] };
  drawGQ();
};
function fillGaps(text, opt) {
  const parts = opt ? opt.split(' / ') : [];
  let k = 0;
  return esc(text).replace(/___/g, () => opt ? `<b class="fill">${esc(parts[Math.min(k++, parts.length - 1)])}</b>` : '<span class="gap">___</span>');
}
function drawGQ() {
  const s = sess;
  if (s.i >= s.items.length) return gqDone();
  const it = s.items[s.i];
  view(`${progress(s.i, s.items.length)}
    <div class="card"><div class="hint small">${esc(it.t.title)}</div><div class="sentence" id="sent">${fillGaps(it.text)}</div></div>
    <div class="opts">${it.opts.map((o, k) => `<button class="opt" data-k="${k}">${esc(o)}</button>`).join('')}</div>
    <div id="after"></div>`);
  let answered = false;
  click('.opt', e => {
    if (answered) return;
    answered = true;
    const k = +e.currentTarget.dataset.k;
    const right = k === it.a;
    app.querySelectorAll('.opt').forEach((b, j) => { b.disabled = true; if (j === it.a) b.classList.add('ok'); else if (j === k) b.classList.add('bad'); });
    $('#sent').innerHTML = fillGaps(it.text, it.opts[it.a]);
    const st = S.gstats[it.t.id] || (S.gstats[it.t.id] = { c: 0, t: 0 });
    st.t++; if (right) { st.c++; s.ok++; } else s.wrong.push(it);
    haptic(right ? 'success' : 'error');
    addXP(right ? 2 : 0, right);
    $('#after').innerHTML = `<div class="card explain ${right ? 'ok' : 'bad'}"><b>${right ? '✓ Верно' : '✗ Неверно'}</b><div>${esc(it.ex)}</div></div>
      <button class="btn primary" id="next">Дальше</button>`;
    click('#next', () => { s.i++; drawGQ(); });
    $('#after').scrollIntoView({ behavior: 'smooth', block: 'end' });
  });
}
function gqDone() {
  const s = sess;
  view(`
    <div class="card center"><div class="big-emoji">${s.ok / s.items.length >= 0.8 ? '🏆' : '📚'}</div><h2>${s.ok} из ${s.items.length}</h2></div>
    ${s.wrong.length ? `<h2>Разбор ошибок</h2>${s.wrong.map(it => `<div class="card"><div class="sentence sm">${fillGaps(it.text, it.opts[it.a])}</div><div class="hint">${esc(it.ex)}</div></div>`).join('')}` : ''}
    <button class="btn primary" id="again">Ещё раз</button>
    ${homeBtn()}`);
  click('#again', render);
  bindHome();
}

/* ---------- Неправильные глаголы ---------- */
const verbSay = v => `${v.base}, ${v.v2.replace('/', ' or ')}, ${v.v3.replace('/', ' or ')}`;
SCREENS.verbs = () => {
  const learned = VERBS.filter(v => S.cards[v.id] && S.cards[v.id].i >= 7).length;
  const started = VERBS.filter(v => S.cards[v.id]).length;
  const due = dueVerbIds().length;
  view(`
    <h1 class="title">Неправильные глаголы</h1>
    <div class="card">
      <div class="goal-top"><span>Выучено</span><span><b>${learned}</b> / ${VERBS.length}</span></div>
      <div class="bar"><i style="width:${learned / VERBS.length * 100}%"></i></div>
      <p class="hint small">В процессе: ${started - learned} · к повторению сегодня: ${due}</p>
    </div>
    <button class="btn primary" id="train">Тренировка (10 глаголов)</button>
    <button class="btn" id="table">Вся таблица</button>`);
  click('#train', () => go('vtrain'));
  click('#table', () => go('vtable'));
};
SCREENS.vtrain = () => {
  const due = dueVerbIds();
  const unseen = VERBS.filter(v => !S.cards[v.id]).map(v => v.id);
  let ids = due.slice(0, 10);
  if (ids.length < 10) ids = ids.concat(pick(unseen.slice(0, 20), 10 - ids.length));
  if (ids.length < 10) ids = ids.concat(pick(VERBS.map(v => v.id).filter(id => !ids.includes(id)), 10 - ids.length));
  sess = { q: shuffle(ids), done: 0, ok: 0, retried: new Set() };
  drawVT();
};
function drawVT() {
  const s = sess;
  if (!s.q.length) return vtDone();
  const v = VERB_BY_ID[s.q[0]];
  view(`${progress(s.done, s.done + s.q.length)}
    <div class="card center"><div class="hint">${S.cards[v.id] ? 'Повторение' : '<span class="badge">новый</span>'}</div>
    <div class="word">${esc(v.base)} ${sayBtn(v.base)}</div><div class="tr">${esc(v.ru)}</div></div>
    <form id="f" autocomplete="off">
      <input class="input" id="v2" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Past Simple (V2)" enterkeyhint="next">
      <input class="input" id="v3" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Past Participle (V3)" enterkeyhint="done">
      <div id="res"></div>
      <button class="btn primary" type="submit" id="sub">Проверить</button>
    </form>
    <button class="link" id="dk">Не помню — показать</button>`);
  const i2 = $('#v2'), i3 = $('#v3');
  i2.focus();
  let done = false, ok = false;
  const match = (val, forms) => { const parts = val.split(/[\/,]/).map(normEn).filter(Boolean); return parts.length > 0 && parts.every(p => forms.split('/').some(f => normEn(f) === p)); };
  const next = () => {
    if (sess !== s) return;
    s.q.shift(); s.done++;
    if (ok && !s.retried.has(v.id)) s.ok++;
    else if (!ok && !s.retried.has(v.id)) { s.retried.add(v.id); s.q.push(v.id); } // ошибку — повторить в конце
    drawVT();
  };
  const check = giveUp => {
    if (done) return next();
    if (!giveUp && !i2.value.trim()) { i2.focus(); return; }
    const ok2 = !giveUp && match(i2.value, v.v2), ok3 = !giveUp && match(i3.value, v.v3);
    ok = ok2 && ok3; done = true;
    i2.readOnly = i3.readOnly = true;
    i2.classList.add(ok2 ? 'ok' : 'bad'); i3.classList.add(ok3 ? 'ok' : 'bad');
    S.cards[v.id] = nextCard(S.cards[v.id], ok ? 2 : 0);
    addXP(ok ? 2 : 0, ok);
    haptic(ok ? 'success' : 'error');
    autoSay(verbSay(v));
    $('#dk').style.display = 'none';
    $('#res').innerHTML = `<div class="res ${ok ? 'ok' : 'bad'}">${ok ? '✓ Верно' : '✗ Правильно'}: <b>${esc(v.base)} – ${esc(v.v2)} – ${esc(v.v3)}</b> ${sayBtn(verbSay(v))}</div>`;
    $('#sub').textContent = 'Дальше';
    $('#sub').focus();
  };
  i2.addEventListener('keydown', e => { if (e.key === 'Enter' && !done) { e.preventDefault(); i3.focus(); } });
  $('#f').addEventListener('submit', e => { e.preventDefault(); check(false); });
  click('#dk', () => check(true));
}
function vtDone() {
  const s = sess;
  view(`
    <div class="card center"><div class="big-emoji">🔁</div><h2>Готово!</h2><p class="hint">С первого раза: ${s.ok} из ${s.done - s.retried.size}</p></div>
    <button class="btn primary" id="again">Ещё 10 глаголов</button>
    ${homeBtn()}`);
  click('#again', render);
  bindHome();
}
SCREENS.vtable = () => {
  view(`
    <h1 class="title">Таблица глаголов</h1>
    <input class="input" id="q" placeholder="Поиск: go или идти" autocapitalize="off">
    <p class="hint small">⚪ не начат · 🟡 учится · ✅ выучен · нажми на строку, чтобы послушать</p>
    <div class="list" id="vl"></div>`);
  const draw = () => {
    const q = $('#q').value.trim().toLowerCase();
    $('#vl').innerHTML = VERBS.filter(v => !q || [v.base, v.v2, v.v3, v.ru].some(x => x.toLowerCase().includes(q))).map(v => {
      const c = S.cards[v.id];
      return `<button class="row" data-say="${esc(verbSay(v))}"><span>${c ? (c.i >= 7 ? '✅' : '🟡') : '⚪'}</span>
        <div><div><b>${esc(v.base)}</b> – ${esc(v.v2)} – ${esc(v.v3)}</div><div class="hint small">${esc(v.ru)}</div></div></button>`;
    }).join('') || '<div class="row hint">Ничего не найдено</div>';
  };
  draw();
  $('#q').addEventListener('input', draw);
};

/* ---------- Мой словарь ---------- */
SCREENS.dict = () => {
  const hard = allWords().filter(w => S.cards[w.id] && S.cards[w.id].l >= 2)
    .sort((a, b) => S.cards[b.id].l - S.cards[a.id].l).slice(0, 30);
  view(`
    <h1 class="title">Мой словарь</h1>
    <form class="card" id="add" autocomplete="off">
      <div class="hint small">Встретил новое слово? Добавь — оно попадёт в карточки первым.</div>
      <input class="input" id="en" placeholder="Слово по-английски" autocapitalize="off" required>
      <input class="input" id="ru" placeholder="Перевод" required>
      <input class="input" id="ex" placeholder="Пример (необязательно)" autocapitalize="off">
      <button class="btn primary" type="submit">Добавить</button>
    </form>
    <h2>Мои слова (${S.custom.length})</h2>
    ${S.custom.length ? `<div class="list">${S.custom.slice().reverse().map(c => {
      const st = S.cards[c.id];
      return `<div class="row word-row"><div class="grow"><div class="w">${esc(c.en)}</div><div class="t">${esc(c.ru)}</div></div>
        <span class="hint small">${st ? (isMastered(st) ? '✅' : '🟡') : 'новое'}</span>${sayBtn(c.en)}<button class="del" data-del="${c.id}" aria-label="Удалить">✕</button></div>`;
    }).join('')}</div>` : '<p class="hint">Пока пусто.</p>'}
    ${hard.length ? `<h2>Трудные слова</h2><p class="hint small">Слова, которые ты забывал чаще всего.</p>
      <div class="list">${hard.map(w => `<div class="row word-row"><div class="grow"><div class="w">${esc(w.en)}</div><div class="t">${esc(w.ru)}</div></div>
      <span class="hint small">✗ ${S.cards[w.id].l}</span>${sayBtn(w.en)}</div>`).join('')}</div>` : ''}`);
  $('#add').addEventListener('submit', e => {
    e.preventDefault();
    const en = $('#en').value.trim(), ru = $('#ru').value.trim(), ex = $('#ex').value.trim();
    if (!en || !ru) return;
    const low = en.toLowerCase();
    if (allWords().some(w => w.en.toLowerCase() === low)) { toast('Это слово уже есть в базе'); haptic('warning'); return; }
    S.custom.push({ id: 'c:' + Date.now().toString(36), en, ru, ex });
    save(); haptic('success'); toast('Добавлено: ' + en);
    render();
  });
  click('[data-del]', e => {
    const id = e.currentTarget.dataset.del;
    confirmDlg('Удалить слово из словаря?', () => {
      S.custom = S.custom.filter(c => c.id !== id);
      delete S.cards[id];
      save(); render();
    });
  });
};

/* ---------- Статистика ---------- */
SCREENS.stats = () => {
  const t = today();
  const wordCards = Object.entries(S.cards).filter(([id]) => !id.startsWith('v:'));
  const mastered = wordCards.filter(([, c]) => isMastered(c)).length;
  let n7 = 0, ok7 = 0;
  for (let d = t - 6; d <= t; d++) { const r = S.days[d]; if (r) { n7 += r.n; ok7 += r.ok; } }
  const days = Array.from({ length: 14 }, (_, k) => t - 13 + k);
  const vals = days.map(d => (S.days[d] || {}).xp || 0);
  const max = Math.max(S.goal, ...vals) * 1.1;
  view(`
    <h1 class="title">Статистика</h1>
    <div class="stats">
      <div class="stat"><b>🔥 ${streak()}</b><span>${plural(streak(), 'день', 'дня', 'дней')} подряд с целью</span></div>
      <div class="stat"><b>${todayXP()}</b><span>XP сегодня из ${S.goal}</span></div>
      <div class="stat"><b>${wordCards.length}</b><span>слов в изучении</span></div>
      <div class="stat"><b>${mastered}</b><span>слов выучено (интервал ≥ 3 нед.)</span></div>
      <div class="stat"><b>${n7 ? Math.round(ok7 / n7 * 100) + '%' : '—'}</b><span>точность за 7 дней</span></div>
      <div class="stat"><b>${VERBS.filter(v => S.cards[v.id] && S.cards[v.id].i >= 7).length}</b><span>неправ. глаголов выучено</span></div>
    </div>
    <div class="card">
      <div class="goal-top"><b>XP за 14 дней</b><span class="hint small" id="tip">нажми на столбик</span></div>
      <div class="chart" role="img" aria-label="Опыт по дням за последние 14 дней">
        ${days.map((d, k) => `<button class="bar-col" data-tip="${dayLabel(d)}: ${vals[k]} XP" aria-label="${dayLabel(d)}: ${vals[k]} XP"><i style="height:${vals[k] / max * 100}%"></i></button>`).join('')}
        <div class="goal-line" style="bottom:${S.goal / max * 100}%"><span>цель ${S.goal}</span></div>
      </div>
      <div class="chart-x"><span>${dayLabel(days[0])}</span><span>сегодня</span></div>
    </div>
    <h2>Слова по уровням</h2>
    <div class="card">${LEVELS.map(l => {
      const ws = WORDS_BY_LV[l];
      const seen = ws.filter(w => S.cards[w.id]).length;
      return `<div class="meter"><div class="goal-top"><span><b>${l}</b></span><span class="hint small">${seen} / ${ws.length}</span></div><div class="bar"><i style="width:${seen / ws.length * 100}%"></i></div></div>`;
    }).join('')}</div>`);
  const tip = $('#tip'), chart = app.querySelector('.chart');
  const select = b => { chart.classList.add('has-sel'); app.querySelectorAll('.bar-col').forEach(x => x.classList.toggle('sel', x === b)); tip.textContent = b.dataset.tip; };
  app.querySelectorAll('.bar-col').forEach(b => { b.addEventListener('click', () => select(b)); b.addEventListener('mouseenter', () => select(b)); });
};

/* ---------- Настройки ---------- */
SCREENS.settings = () => {
  const seg = (key, vals, fmt = v => v) => `<div class="seg" data-key="${key}">${vals.map(v => `<button class="${S[key] === v ? 'on' : ''}" data-v="${v}">${fmt(v)}</button>`).join('')}</div>`;
  view(`
    <h1 class="title">Настройки</h1>
    <div class="setting"><label>Уровень</label>${seg('level', LEVELS)}</div>
    <div class="setting"><label>Цель дня (XP)</label>${seg('goal', [10, 20, 30, 50])}</div>
    <div class="setting"><label>Новых слов в день</label>${seg('newPerDay', [5, 10, 15, 20, 30])}</div>
    ${ttsOK ? `<div class="list"><label class="row"><span class="grow">Автоматически озвучивать слова</span><input type="checkbox" id="say" ${S.autoSay ? 'checked' : ''}></label></div>`
      : '<p class="hint small">Озвучка не поддерживается на этом устройстве.</p>'}
    <button class="btn" id="test">Пройти тест уровня</button>
    <button class="btn danger" id="reset">Сбросить весь прогресс</button>
    <p class="hint small center">XP: карточка +1, квиз +1, правописание +2, грамматика +2, глагол +2.<br>
    Серия 🔥 растёт, когда за день набрана цель.</p>`);
  click('.seg button', e => {
    const b = e.currentTarget, key = b.parentElement.dataset.key, raw = b.dataset.v;
    S[key] = isNaN(raw) ? raw : +raw;
    save(); haptic('light'); render();
  });
  const sw = $('#say');
  if (sw) sw.addEventListener('change', () => { S.autoSay = sw.checked; save(); });
  click('#test', () => go('placement'));
  click('#reset', () => confirmDlg('Точно сбросить весь прогресс? Это нельзя отменить.', () => {
    S = fresh(); save(); resetTo('welcome');
  }));
};

/* ================= Старт ================= */
stack.push({ name: S.level ? 'home' : 'welcome' });
render();
cloudLoad();
