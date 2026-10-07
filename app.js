'use strict';

/* ================= Telegram ================= */
const tg = window.Telegram && window.Telegram.WebApp;
const inTG = !!(tg && tg.platform && tg.platform !== 'unknown');
const ver = v => inTG && typeof tg.isVersionAtLeast === 'function' && tg.isVersionAtLeast(v);

if (inTG) {
  tg.ready();
  tg.expand();
  try { if (ver('6.1')) { tg.setHeaderColor(ver('6.9') ? '#000000' : 'bg_color'); tg.setBackgroundColor('#000000'); } } catch (e) {}
  try { if (ver('7.10')) tg.setBottomBarColor('#000000'); } catch (e) {}
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
const rnd = a => a[Math.floor(Math.random() * a.length)];
const today = () => { const d = new Date(); return Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000); };
const dayLabel = n => new Date(n * 86400000).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', timeZone: 'UTC' });
const plural = (n, one, few, many) => { const m10 = n % 10, m100 = n % 100; return m10 === 1 && m100 !== 11 ? one : m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20) ? few : many; };
const fmtTime = ms => { const s = Math.round(ms / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };

function lev(a, b) {
  if (a === b) return 0;
  const m = a.length, n = b.length;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[n];
}

function toast(msg) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove('show'), 2400);
}

/* ================= Иконки (stroke, 24×24) ================= */
const ICONS = {
  home: '<path d="M3 10l9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
  book: '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
  chart: '<path d="M12 20V10M18 20V4M6 20v-4"/>',
  sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
  play: '<path d="M6 4l14 8-14 8z" fill="currentColor"/>',
  x: '<path d="M18 6L6 18M6 6l12 12"/>',
  check: '<path d="M20 6L9 17l-5-5"/>',
  chev: '<path d="M9 18l6-6-6-6"/>',
  zap: '<path d="M13 2L3 14h9l-1 8 10-12h-9z"/>',
  flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2.1-.2-4.1 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.3 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  vol: '<path d="M11 5L6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/>',
  layers: '<rect x="3" y="7" width="13" height="14" rx="2"/><path d="M8 3h11a2 2 0 0 1 2 2v12"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  down: '<circle cx="12" cy="12" r="10"/><path d="M8 12l4 4 4-4M12 8v8"/>',
  headphones: '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z"/>',
  type: '<path d="M4 7V4h16v3M9 20h6M12 4v16"/>',
  blocks: '<rect x="2" y="4" width="9" height="6" rx="1.5"/><rect x="13" y="4" width="9" height="6" rx="1.5"/><rect x="6" y="14" width="12" height="6" rx="1.5"/>',
  pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  ear: '<path d="M6 8.5a6 6 0 0 1 12 0c0 4-4 4.5-4 8a3.5 3.5 0 0 1-7 0"/><path d="M10 9a2 2 0 0 1 4 0c0 1.5-2 2-2 3.5"/>',
  chat: '<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.2A8.4 8.4 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3h.5a8.5 8.5 0 0 1 8 8z"/>',
  rule: '<path d="M2 20L20 2l2 2L4 22z"/><path d="M7 15l2 2M10 12l2 2M13 9l2 2M16 6l2 2"/>',
  repeat: '<path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>',
  star: '<path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
  award: '<circle cx="12" cy="8" r="7"/><path d="M8.2 13.9L7 23l5-3 5 3-1.2-9.1"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21.2l8.8-8.8a5.5 5.5 0 0 0 0-7.8z"/>',
  bulb: '<path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V17h6v-.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>'
};
const ic = (n, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ''}</svg>`;

/* ================= Звуки (WebAudio, без файлов) ================= */
let actx = null;
function tone(freqs, dur = 0.09, type = 'sine', gap = 0.07, vol = 0.12) {
  if (!S.sound) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === 'suspended') actx.resume();
    const t0 = actx.currentTime + 0.01;
    freqs.forEach((f, i) => {
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = type; o.frequency.value = f;
      const st = t0 + i * gap;
      g.gain.setValueAtTime(0.0001, st);
      g.gain.exponentialRampToValueAtTime(vol, st + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, st + dur);
      o.connect(g); g.connect(actx.destination);
      o.start(st); o.stop(st + dur + 0.03);
    });
  } catch (e) {}
}
const sfx = {
  ok: () => tone([660, 990], 0.12, 'sine', 0.08),
  bad: () => tone([196, 147], 0.18, 'triangle', 0.11, 0.1),
  tap: () => tone([520], 0.05, 'sine', 0, 0.05),
  win: () => tone([523, 659, 784, 1047], 0.18, 'sine', 0.11),
  combo: () => tone([784, 1175], 0.1, 'square', 0.06, 0.04)
};

function confetti() {
  const c = document.createElement('canvas');
  c.className = 'confetti';
  const dpr = window.devicePixelRatio || 1, W = innerWidth, H = innerHeight;
  c.width = W * dpr; c.height = H * dpr;
  document.body.appendChild(c);
  const x = c.getContext('2d');
  x.scale(dpr, dpr);
  const cols = ['#ffffff', '#3b6cff', '#8fb0ff', '#1e3a8a', '#c9d6ff'];
  const P = Array.from({ length: 150 }, () => ({
    x: W / 2 + (Math.random() - 0.5) * 120, y: H * 0.32, vx: (Math.random() - 0.5) * 13, vy: -Math.random() * 13 - 4,
    s: Math.random() * 7 + 4, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3, c: rnd(cols)
  }));
  const t0 = performance.now();
  (function f(t) {
    x.clearRect(0, 0, W, H);
    for (const p of P) {
      p.vy += 0.33; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.fillStyle = p.c; x.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); x.restore();
    }
    if (t - t0 < 2800) requestAnimationFrame(f); else c.remove();
  })(t0);
}

/* ================= Озвучка: лучший голос + выбор ================= */
const ttsOK = 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
let enVoices = [];
function voiceScore(v) {
  const n = v.name;
  let s = 0;
  if (/natural|neural/i.test(n)) s += 100;           // Edge / Windows «Natural» голоса
  if (/premium|enhanced|улучш/i.test(n)) s += 80;    // iOS / macOS улучшенные
  if (/siri/i.test(n)) s += 70;
  if (/google/i.test(n)) s += 60;                    // Android / Chrome
  if (/online/i.test(n)) s += 20;
  if (/samantha|ava|allison|evan|nathan|zoe|tom|daniel|serena|karen|moira|aria|jenny|guy|sonia|libby|ryan|emma|brian|andrew/i.test(n)) s += 25;
  if (/compact|eloquence|espeak|novelty|bad news|bells|bubbles|cellos|jester|organ|trinoids|whisper|zarvox|albert|fred|junior|ralph|kathy|bahh|boing|wobble|superstar|grandma|grandpa|reed|rocko|sandy|shelley|flo\b/i.test(n)) s -= 120;
  if (/^en[-_]us/i.test(v.lang)) s += 10; else if (/^en[-_]gb/i.test(v.lang)) s += 8;
  if (v.default) s += 2;
  return s;
}
function loadVoices() {
  enVoices = speechSynthesis.getVoices().filter(v => /^en([-_]|$)/i.test(v.lang)).sort((a, b) => voiceScore(b) - voiceScore(a));
}
if (ttsOK) {
  loadVoices();
  speechSynthesis.onvoiceschanged = () => { loadVoices(); if (stack.length && stack[stack.length - 1].name === 'settings') render(); };
}
const currentVoice = () => (S.voice && enVoices.find(v => v.voiceURI === S.voice)) || enVoices[0] || null;
function speak(text, slow) {
  if (!ttsOK || !text) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const v = currentVoice();
    if (v) { u.voice = v; u.lang = v.lang; } else u.lang = 'en-US';
    u.rate = (S.rate || 0.9) * (slow ? 0.65 : 1);
    speechSynthesis.speak(u);
  } catch (e) {}
}
const autoSay = text => { if (S.autoSay) speak(text); };
const sayBtn = (t, cls = '') => ttsOK ? `<button type="button" class="say ${cls}" data-say="${esc(t)}" aria-label="Озвучить">${ic('vol')}</button>` : '';
document.addEventListener('click', e => {
  const b = e.target.closest('[data-say]');
  if (b) speak(b.dataset.say, b.dataset.slow === '1');
});

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
const PHRASES_BY_LV = {};
for (const lv of LEVELS) {
  PHRASES_BY_LV[lv] = DATA.phrases[lv].trim().split('\n').map(line => {
    const [en, ru] = line.split('|').map(s => s.trim());
    return { en, ru, lv };
  });
}
const VERBS = DATA.verbs.trim().split('\n').map(line => {
  const [base, v2, v3, ru] = line.split('|').map(s => s.trim());
  return { id: 'v:' + base, base, v2, v3, ru };
});
const VERB_BY_ID = Object.fromEntries(VERBS.map(v => [v.id, v]));
const TOPIC_BY_ID = Object.fromEntries(DATA.grammar.map(t => [t.id, t]));
const DIALOG_BY_ID = Object.fromEntries(DATA.dialogs.map(d => [d.id, d]));

const customToWord = c => ({ id: c.id, en: c.en, ru: c.ru, ex: c.ex || '', lv: 'my' });
const getWord = id => {
  if (WORD_BY_ID[id]) return WORD_BY_ID[id];
  const c = id.startsWith('c:') && S.custom.find(x => x.id === id);
  return c ? customToWord(c) : null;
};
const allWords = () => [...S.custom.map(customToWord), ...WORDS];
const lvIdx = () => Math.max(0, LEVELS.indexOf(S.level));

/* ================= Состояние и хранение ================= */
const LS_KEY = 'engtrainer_v1';
function fresh() {
  return {
    v: 2, updated: 0, level: null, goal: 20, newPerDay: 10, autoSay: true, sound: true, voice: '', rate: 0.9,
    cards: {}, custom: [], days: {}, gstats: {}, streak: { n: 0, last: 0 },
    xpTotal: 0, lessons: 0, best: { sprint: 0, savanna: 0 }, dlg: {}
  };
}
function migrate(obj) {
  const s = Object.assign(fresh(), obj);
  if (!obj.xpTotal) s.xpTotal = Object.values(s.days).reduce((a, d) => a + (d.xp || 0), 0);
  s.best = Object.assign({ sprint: 0, savanna: 0 }, s.best);
  return s;
}
function load() {
  try { const raw = localStorage.getItem(LS_KEY); if (raw) return migrate(JSON.parse(raw)); } catch (e) {}
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
// Telegram CloudStorage: значение ≤ 4096 символов → режем на куски
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
        S = migrate(JSON.parse(json));
        try { localStorage.setItem(LS_KEY, json); } catch (e) {}
        const cur = stack[stack.length - 1].name;
        if (TABS.includes(cur) || cur === 'welcome') resetTo(S.level ? 'home' : 'welcome');
        toast('Прогресс загружен из облака');
      } catch (e) {}
    });
  });
}

/* ================= XP, уровень игрока, серия ================= */
function dayRec() { const k = today(); return S.days[k] || (S.days[k] = { xp: 0, ok: 0, n: 0, nw: 0 }); }
const todayXP = () => (S.days[today()] || { xp: 0 }).xp;
const userLevel = xp => { let n = 1; while (25 * n * (n + 1) <= xp) n++; return n; };
const levelSpan = n => [25 * (n - 1) * n, 25 * n * (n + 1)];
function addXP(x, ok = 0, n = 0) {
  const d = dayRec();
  const before = userLevel(S.xpTotal);
  d.xp += x; d.ok += ok; d.n += n;
  S.xpTotal += x;
  if (!d.g && d.xp >= S.goal) {
    d.g = 1;
    const t = today();
    S.streak = { n: S.streak && S.streak.last === t - 1 ? S.streak.n + 1 : 1, last: t };
    setTimeout(() => toast(`Цель дня выполнена! Серия: ${S.streak.n} 🔥`), 400);
  }
  const after = userLevel(S.xpTotal);
  if (after > before) setTimeout(() => { toast(`Новый уровень: ${after}! ⭐`); confetti(); sfx.win(); }, 700);
  save();
}
const streak = () => (S.streak && S.streak.last >= today() - 1 ? S.streak.n : 0);

/* ================= Интервальное повторение (упрощённый SM-2) ================= */
// d — день показа, i — интервал (дни), e — лёгкость×100, r — успехов подряд, l — забываний
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
const isMastered = c => c && c.i >= 21;

function dueWordIds() {
  const t = today();
  return Object.entries(S.cards)
    .filter(([id, c]) => !id.startsWith('v:') && c.d <= t && getWord(id))
    .sort((a, b) => a[1].d - b[1].d).map(([id]) => id);
}
function levelOrder() {
  const i = lvIdx();
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

// Слова для тренажёров: сначала изученные, при нехватке — слова текущего уровня
function practicePool(min = 12) {
  const seen = allWords().filter(w => S.cards[w.id]);
  if (seen.length >= min) return seen;
  return [...seen, ...WORDS_BY_LV[S.level || 'A1'].filter(w => !S.cards[w.id])];
}
function distractors(w, n) {
  const base = w.lv === 'my' ? WORDS : WORDS_BY_LV[w.lv];
  return pick(base.filter(x => x.id !== w.id && x.ru !== w.ru && x.en !== w.en), n);
}
function phrasesPick(n) {
  const cur = shuffle(PHRASES_BY_LV[S.level || 'A1']);
  const low = shuffle(LEVELS.slice(0, lvIdx()).flatMap(l => PHRASES_BY_LV[l]));
  const out = low.length ? [...cur.slice(0, Math.ceil(n * 0.7)), ...low] : cur;
  return shuffle(out.slice(0, n));
}
const topicMinLv = t => LEVELS.indexOf(t.lv.slice(0, 2));
function prepGram(t, q) {
  const [text, opts, a, ex] = q;
  const order = shuffle(opts.map((_, i) => i));
  return { t, text, opts: order.map(i => opts[i]), a: order.indexOf(a), ex };
}
const isSingle = w => /^[a-z]{3,11}$/i.test(w.en);

/* ================= Проверка ответов ================= */
const normEn = s => s.toLowerCase().replace(/[’`]/g, "'").replace(/[^a-z' ]/g, ' ').replace(/\s+/g, ' ').trim().replace(/^to /, '');
function checkWord(input, en) {
  const a = normEn(input);
  if (!a) return { ok: false };
  for (const v of en.split('/')) {
    const b = normEn(v);
    if (a === b) return { ok: true };
    const tol = b.length >= 8 ? 2 : b.length >= 5 ? 1 : 0;
    if (tol && lev(a, b) <= tol) return { ok: true, typo: true };
  }
  return { ok: false };
}
const CONTR = { "i'm": 'i am', "you're": 'you are', "he's": 'he is', "she's": 'she is', "it's": 'it is', "we're": 'we are', "they're": 'they are',
  "don't": 'do not', "doesn't": 'does not', "didn't": 'did not', "isn't": 'is not', "aren't": 'are not', "wasn't": 'was not', "weren't": 'were not',
  "can't": 'cannot', "couldn't": 'could not', "won't": 'will not', "wouldn't": 'would not', "shouldn't": 'should not', "haven't": 'have not',
  "hasn't": 'has not', "hadn't": 'had not', "i've": 'i have', "you've": 'you have', "we've": 'we have', "they've": 'they have', "i'll": 'i will',
  "you'll": 'you will', "we'll": 'we will', "i'd": 'i would', "you'd": 'you would', "let's": 'let us', "there's": 'there is', "that's": 'that is', "what's": 'what is' };
const normSent = s => s.toLowerCase().replace(/[’`]/g, "'").replace(/[^a-z0-9' ]/g, ' ').replace(/\s+/g, ' ').trim()
  .split(' ').map(w => CONTR[w] || w).join(' ').replace(/can not/g, 'cannot');
function checkSentence(input, target) {
  const a = normSent(input), b = normSent(target);
  if (!a) return { ok: false };
  if (a === b) return { ok: true };
  if (lev(a, b) <= Math.max(1, Math.floor(b.length / 15))) return { ok: true, typo: true };
  return { ok: false };
}
const tokens = s => s.replace(/[.,!?;:]/g, '').trim().split(/\s+/);
function blankEx(w) {
  if (!w.ex) return '';
  const re = new RegExp('\\b' + w.en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+') + '\\w*', 'i');
  const m = w.ex.match(re);
  if (!m) return '';
  return esc(w.ex.slice(0, m.index)) + '<span class="gap">_____</span>' + esc(w.ex.slice(m.index + m[0].length));
}
const hintFor = (en, lvl) => [...en].map((ch, i) => ch === ' ' ? '  ' : (i === 0 || (lvl > 1 && i % 2 === 0)) ? ch : '_').join(' ');
const fillGaps = (text, opt) => {
  const parts = opt ? opt.split(' / ') : [];
  let k = 0;
  return esc(text).replace(/___/g, () => opt ? `<b class="fill">${esc(parts[Math.min(k++, parts.length - 1)])}</b>` : '<span class="gap">___</span>');
};
const plainFill = (text, opt) => { const parts = opt.split(' / '); let k = 0; return text.replace(/___/g, () => parts[Math.min(k++, parts.length - 1)]); };
const verbSay = v => `${v.base}, ${v.v2.replace('/', ' or ')}, ${v.v3.replace('/', ' or ')}`;

/* ================= Навигация ================= */
const app = $('#app'), topbar = $('#topbar'), tabbar = $('#tabbar');
const TABS = ['home', 'dict', 'stats', 'settings'];
const stack = [];
let sess = null;
let stepKey = null; // обработчик клавиатуры текущего экрана
document.addEventListener('keydown', e => { if (stepKey && !(e.target.matches && e.target.matches('input, textarea, select'))) stepKey(e); });

function view(html) { app.innerHTML = html; }
function click(sel, fn) { app.querySelectorAll(sel).forEach(el => el.addEventListener('click', fn)); }
function go(name, params) { stack.push({ name, params }); render(); }
function back() { if (stack.length > 1) { stack.pop(); render(); } }
function resetTo(name) { stack.length = 0; stack.push({ name }); render(); }
function leaveSession() { if (sess && sess.onLeave) { try { sess.onLeave(); } catch (e) {} } sess = null; stepKey = null; }
function render() {
  leaveSession();
  if (ttsOK) speechSynthesis.cancel();
  const top = stack[stack.length - 1];
  const isTab = TABS.includes(top.name) && stack.length === 1;
  document.body.classList.toggle('has-tabs', isTab);
  SCREENS[top.name](top.params || {});
  const canBack = stack.length > 1;
  const immersive = !!app.querySelector('.lesson');
  if (inTG) { canBack ? tg.BackButton.show() : tg.BackButton.hide(); topbar.innerHTML = ''; }
  else {
    topbar.innerHTML = canBack && !immersive ? `<button id="backb">${ic('chev', 'flip')} Назад</button>` : '';
    if (canBack && !immersive) $('#backb').addEventListener('click', back);
  }
  tabbar.innerHTML = isTab ? [['home', 'home', 'Главная'], ['dict', 'book', 'Словарь'], ['stats', 'chart', 'Прогресс'], ['settings', 'sliders', 'Настройки']]
    .map(([id, icon, label]) => `<button class="${top.name === id ? 'on' : ''}" data-tab="${id}">${ic(icon)}<span>${label}</span></button>`).join('') : '';
  tabbar.querySelectorAll('[data-tab]').forEach(b => b.addEventListener('click', () => { haptic('light'); resetTo(b.dataset.tab); }));
  window.scrollTo(0, 0);
}
const homeBtn = (label = 'На главную') => `<button class="btn ghost" id="home">${label}</button>`;
const bindHome = () => click('#home', () => resetTo('home'));
const ltop = (pct, extra = '') => `<div class="ltop"><button class="icon-btn" id="close" aria-label="Закрыть">${ic('x')}</button>
  <div class="lbar"><i style="width:${Math.round(pct * 100)}%"></i></div>${extra}</div>`;

/* ================= Экраны ================= */
const SCREENS = {};

/* ---------- Приветствие и тест уровня ---------- */
SCREENS.welcome = () => {
  view(`
    <div class="welcome">
      <div class="logo">${ic('star')}</div>
      <h1>English Trainer</h1>
      <p class="muted">Уроки как в Duolingo, игры как в Lingualeo, повторение как в Anki. 10–15 минут в день — и уровень растёт.</p>
    </div>
    <h2 class="sec">Какой у тебя уровень?</h2>
    <div class="list">${LEVELS.map(l => `<button class="row" data-lv="${l}"><b class="lv">${l}</b><span class="grow">${LEVEL_INFO[l]}</span>${ic('chev', 'chev')}</button>`).join('')}</div>
    <button class="btn primary" id="test">Не знаю — пройти тест (2 мин)</button>`);
  click('[data-lv]', e => { S.level = e.currentTarget.dataset.lv; save(); haptic('light'); resetTo('home'); });
  click('#test', () => go('placement'));
};
SCREENS.placement = () => {
  const qs = [];
  for (const lv of LEVELS) for (const w of pick(WORDS_BY_LV[lv], 4)) qs.push({ w, opts: shuffle([w, ...pick(WORDS_BY_LV[lv].filter(x => x.ru !== w.ru), 3)]) });
  sess = { qs, i: 0, score: { A1: 0, A2: 0, B1: 0, B2: 0 } };
  drawPlacement();
};
function drawPlacement() {
  const s = sess;
  if (s.i >= s.qs.length) return placementResult();
  const q = s.qs[s.i];
  view(`<div class="lesson">${ltop(s.i / s.qs.length)}
    <div class="lbody"><div class="ex-label">Вопрос ${s.i + 1} из ${s.qs.length} · как переводится?</div>
    <div class="prompt"><div class="big-word">${esc(q.w.en)}</div></div>
    <div class="opts">${q.opts.map((o, k) => `<button class="opt" data-k="${k}"><span class="grow">${esc(o.ru)}</span></button>`).join('')}
    <button class="opt ghost" data-k="-1">Не знаю</button></div></div></div>`);
  click('#close', back);
  click('.opt', e => {
    const k = +e.currentTarget.dataset.k;
    if (k >= 0 && q.opts[k] === q.w) s.score[q.w.lv]++;
    s.i++; sfx.tap(); haptic('light'); drawPlacement();
  });
}
function placementResult() {
  const sc = sess.score;
  let lv = 'B2';
  for (const l of LEVELS) if (sc[l] < 3) { lv = l; break; }
  view(`
    <div class="finish"><div class="trophy">${ic('award')}</div><div class="muted">Рекомендуемый уровень</div><div class="mega">${lv}</div><p class="muted">${LEVEL_INFO[lv]}</p></div>
    <div class="list">${LEVELS.map(l => `<div class="row"><b class="lv">${l}</b><span class="grow">${sc[l]} из 4 верно</span></div>`).join('')}</div>
    <button class="btn primary" id="ok">Начать с уровня ${lv}</button>
    <p class="muted small center">Уровень можно поменять в настройках.</p>`);
  click('#ok', () => { S.level = lv; save(); confetti(); resetTo('home'); });
}

/* ---------- Главная ---------- */
const GAMES = [
  { go: 'cards', icon: 'layers', title: 'Карточки', sub: 'Повторение как в Anki' },
  { mode: 'pairs', icon: 'grid', title: 'Пары', sub: 'Найди соответствия' },
  { go: 'sprint', icon: 'zap', title: 'Спринт', sub: 'Верно или нет за 60 с' },
  { go: 'savanna', icon: 'down', title: 'Саванна', sub: 'Успей, пока падает' },
  { mode: 'listen', icon: 'headphones', title: 'Аудиовызов', sub: 'Узнай на слух', tts: true },
  { mode: 'letters', icon: 'type', title: 'Конструктор', sub: 'Собери слово из букв' },
  { mode: 'build', icon: 'blocks', title: 'Собери фразу', sub: 'Перевод из плиток' },
  { mode: 'dictation', icon: 'ear', title: 'Диктант', sub: 'Запиши, что слышишь', tts: true },
  { mode: 'type', icon: 'pen', title: 'Правописание', sub: 'Напиши слово сам' },
  { go: 'dialogs', icon: 'chat', title: 'Диалоги', sub: 'Живые ситуации' }
];
SCREENS.home = () => {
  const xp = todayXP(), pct = Math.min(1, xp / S.goal);
  const due = dueWordIds().length, nw = newWordIds(Math.min(3, newLeft())).length;
  const user = inTG && tg.initDataUnsafe && tg.initDataUnsafe.user;
  const h = new Date().getHours();
  const greet = h < 6 ? 'Доброй ночи' : h < 12 ? 'Доброе утро' : h < 18 ? 'Добрый день' : 'Добрый вечер';
  const lvl = userLevel(S.xpTotal);
  const C = 2 * Math.PI * 34;
  const t = today(), dow = (new Date().getDay() + 6) % 7;
  const week = Array.from({ length: 7 }, (_, k) => t - dow + k);
  const heroTitle = nw && due ? 'Новые слова и повторение' : nw ? 'Новые слова' : due ? 'Повторение' : 'Практика изученного';
  const heroSub = [due ? `${due} повторить` : '', nw ? `${nw} ${plural(nw, 'новое', 'новых', 'новых')}` : '', 'около 5 мин'].filter(Boolean).join(' · ');
  const games = GAMES.filter(g => !g.tts || ttsOK);
  const vdue = dueVerbIds().length;
  view(`
    <header class="top">
      <div><div class="muted">${greet}</div><h1>${user && user.first_name ? esc(user.first_name) : 'Привет!'}</h1></div>
      <div class="chips">
        <div class="chip ${streak() ? 'hot' : ''}" title="Серия дней">${ic('flame')}<b>${streak()}</b></div>
        <div class="chip" title="Уровень игрока">${ic('star')}<b>${lvl}</b></div>
      </div>
    </header>
    <section class="hero">
      <div class="hero-row">
        <div class="ring">
          <svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="34" class="ring-bg"/><circle cx="40" cy="40" r="34" class="ring-fg" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct)}"/></svg>
          <div class="ring-txt"><b>${xp}</b><span>из ${S.goal} XP</span></div>
        </div>
        <div class="hero-main"><div class="kicker">Урок дня</div><div class="hero-title">${heroTitle}</div><div class="hero-sub">${heroSub}</div></div>
      </div>
      <button class="btn white" id="lesson">${ic('play')} ${xp ? 'Продолжить учиться' : 'Начать урок'}</button>
    </section>
    <div class="week">${week.map((d, k) => {
      const r = S.days[d] || {};
      const cls = d > t ? 'future' : r.g ? 'done' : r.xp ? 'part' : 'none';
      return `<div class="wd ${cls} ${d === t ? 'today' : ''}"><span>${['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'][k]}</span><i>${r.g ? ic('flame') : ''}</i></div>`;
    }).join('')}</div>
    <h2 class="sec">Тренажёры</h2>
    <div class="grid">${games.map((g, k) => `<button class="tile" data-k="${k}"><div class="tile-ico">${ic(g.icon)}</div>
      <div class="tile-title">${g.title}</div><div class="tile-sub">${g.go === 'cards' && due ? `${due} к повторению` : g.sub}</div></button>`).join('')}</div>
    <h2 class="sec">Теория</h2>
    <div class="list">
      <button class="row" data-go="grammar"><div class="row-ico">${ic('rule')}</div><div class="grow"><div class="row-title">Грамматика</div><div class="muted small">${DATA.grammar.length} тем с правилами и практикой</div></div>${ic('chev', 'chev')}</button>
      <button class="row" data-go="verbs"><div class="row-ico">${ic('repeat')}</div><div class="grow"><div class="row-title">Неправильные глаголы</div><div class="muted small">${vdue ? `${vdue} к повторению` : `${VERBS.length} глаголов`}</div></div>${ic('chev', 'chev')}</button>
    </div>`);
  click('#lesson', () => go('lesson', { mode: 'daily' }));
  click('.tile', e => { const g = games[+e.currentTarget.dataset.k]; g.go ? go(g.go) : go('lesson', { mode: g.mode }); });
  click('[data-go]', e => go(e.currentTarget.dataset.go));
};

/* ================= Движок уроков ================= */
// Типы заданий: intro, choice, choiceRev, listen, letters, type, build, dictation, pairs, gram, verb
const XPW = { choice: 1, choiceRev: 1, listen: 1, pairs: 2, letters: 2, type: 2, build: 2, dictation: 3, gram: 2, verb: 2 };
const MODE_TITLE = { daily: 'Урок дня', pairs: 'Пары', listen: 'Аудиовызов', letters: 'Конструктор', build: 'Собери фразу',
  dictation: 'Диктант', type: 'Правописание', grammar: 'Грамматика', verbs: 'Неправильные глаголы' };

function reviewType(w) {
  const c = S.cards[w.id];
  const strong = c && c.r >= 2;
  const opts = strong ? ['type', 'choiceRev', isSingle(w) ? 'letters' : 'type', ttsOK ? 'listen' : 'choiceRev']
    : ['choice', 'choiceRev', ttsOK ? 'listen' : 'choice', isSingle(w) ? 'letters' : 'choiceRev'];
  return rnd(opts);
}
function fillWords(list, n) {
  const have = new Set(list.map(w => w.id));
  const extra = shuffle(practicePool(20).filter(w => !have.has(w.id)));
  return [...list, ...extra].slice(0, n);
}
function buildDaily() {
  const due = dueWordIds().slice(0, 6).map(getWord).filter(Boolean);
  let nw = newWordIds(Math.min(3, newLeft())).map(getWord);
  const seenNotDue = allWords().filter(w => S.cards[w.id] && !due.includes(w));
  const prac = pick(seenNotDue, Math.max(0, 7 - due.length - nw.length));
  const have = due.length + nw.length + prac.length;
  if (have < 4) nw = nw.concat(newWordIds(4 - have, new Set(nw.map(w => w.id))).map(getWord));
  const review = shuffle([...due, ...prac]);
  const tasks = [];
  nw.forEach((w, i) => {
    tasks.push({ type: 'intro', w }, { type: 'choice', w });
    if (review[i]) tasks.push({ type: reviewType(review[i]), w: review[i] });
  });
  review.slice(nw.length).forEach(w => tasks.push({ type: reviewType(w), w }));
  tasks.splice(Math.min(tasks.length, 5), 0, { type: 'pairs', ws: fillWords([...nw, ...review], 5) });
  nw.forEach(w => tasks.push({ type: rnd(['choiceRev', isSingle(w) ? 'letters' : 'choiceRev', ttsOK ? 'listen' : 'choiceRev']), w }));
  const ph = phrasesPick(2);
  const tail = [{ type: 'build', p: ph[0] }];
  if (ph[1]) tail.push({ type: ttsOK && S.level !== 'A1' ? 'dictation' : 'build', p: ph[1] });
  const topics = DATA.grammar.filter(t => topicMinLv(t) <= lvIdx());
  const tp = rnd(topics.length ? topics : DATA.grammar);
  tail.push({ type: 'gram', g: prepGram(tp, rnd(tp.qs)) });
  const vd = dueVerbIds();
  if (vd.length) tail.push({ type: 'verb', v: VERB_BY_ID[vd[0]] });
  // «тяжёлые» задания — во вторую половину урока
  for (const t of shuffle(tail)) tasks.splice(Math.floor(tasks.length / 2) + Math.floor(Math.random() * (tasks.length / 2 + 1)), 0, t);
  return tasks;
}
function buildTasks(p) {
  switch (p.mode) {
    case 'daily': return buildDaily();
    case 'pairs': { const ws = pick(practicePool(20), 20); return [0, 1, 2, 3].map(k => ({ type: 'pairs', ws: ws.slice(k * 5, k * 5 + 5) })).filter(t => t.ws.length >= 3); }
    case 'listen': return pick(practicePool(), 10).map(w => ({ type: 'listen', w }));
    case 'letters': return pick(practicePool().filter(isSingle), 10).map(w => ({ type: 'letters', w }));
    case 'type': return pick(practicePool(), 10).map(w => ({ type: 'type', w }));
    case 'build': return phrasesPick(10).map(ph => ({ type: 'build', p: ph }));
    case 'dictation': return phrasesPick(8).map(ph => ({ type: 'dictation', p: ph }));
    case 'grammar': {
      const items = p.mix ? pick(DATA.grammar.flatMap(t => t.qs.map(q => [t, q])), 10) : shuffle(TOPIC_BY_ID[p.id].qs).map(q => [TOPIC_BY_ID[p.id], q]);
      return items.map(([t, q]) => ({ type: 'gram', g: prepGram(t, q) }));
    }
    case 'verbs': {
      let ids = dueVerbIds().slice(0, 10);
      if (ids.length < 10) ids = ids.concat(pick(VERBS.filter(v => !S.cards[v.id]).slice(0, 20).map(v => v.id), 10 - ids.length));
      if (ids.length < 10) ids = ids.concat(pick(VERBS.map(v => v.id).filter(id => !ids.includes(id)), 10 - ids.length));
      return shuffle(ids).map(id => ({ type: 'verb', v: VERB_BY_ID[id] }));
    }
  }
  return [];
}

SCREENS.lesson = p => {
  const tasks = buildTasks(p);
  if (!tasks.length) {
    view(`<div class="finish"><div class="trophy">${ic('target')}</div><h1>Пока нечего тренировать</h1><p class="muted">Сначала выучи несколько слов в уроке дня.</p></div>
      <button class="btn primary" id="daily">Урок дня</button>${homeBtn()}`);
    click('#daily', () => { stack.pop(); go('lesson', { mode: 'daily' }); });
    return bindHome();
  }
  const s = sess = { p, tasks, i: 0, done: 0, total: tasks.length, ok: 0, n: 0, combo: 0, maxCombo: 0, xp: 0, t0: Date.now(), res: {} };
  s.onLeave = () => applyResults(s);
  drawStep();
};
function drawStep() {
  const s = sess;
  stepKey = null;
  if (s.i >= s.tasks.length) return finishLesson();
  const t = s.tasks[s.i];
  s.answered = false;
  view(`<div class="lesson">${ltop(s.done / s.total, `<div class="combo ${s.combo >= 3 ? 'on' : ''}" id="combo">${ic('zap')}<b>${s.combo}</b></div>`)}
    ${t.retry ? `<div class="retry-tag">${ic('repeat')} Исправляем ошибку</div>` : ''}
    <div class="lbody" id="ex"></div><div class="lfoot" id="foot"></div></div>`);
  click('#close', back);
  EX[t.type](t, $('#ex'), $('#foot'));
}
const PRAISE = ['Отлично!', 'Супер!', 'Так держать!', 'Верно!', 'Блестяще!', 'Великолепно!', 'В точку!'];
function rec(id, ok) { if (!sess || !sess.res || !id) return; sess.res[id] = sess.res[id] === undefined ? ok : sess.res[id] && ok; }
function answer(correct, o = {}) {
  const s = sess, t = s.tasks[s.i];
  if (s.answered) return;
  s.answered = true;
  stepKey = null;
  if (!t.retry) { s.n++; if (correct) s.ok++; }
  if (correct) { s.combo++; s.maxCombo = Math.max(s.maxCombo, s.combo); } else s.combo = 0;
  const xp = correct && !t.retry ? (XPW[t.type] || 1) : 0;
  s.xp += xp;
  addXP(xp, !t.retry && correct ? 1 : 0, t.retry ? 0 : 1);
  if (t.w) rec(t.w.id, correct);
  if (t.v) rec(t.v.id, correct);
  if (t.type === 'gram' && !t.retry) { const st = S.gstats[t.g.t.id] || (S.gstats[t.g.t.id] = { c: 0, t: 0 }); st.t++; if (correct) st.c++; }
  if (!correct && !t.retry && t.type !== 'pairs') s.tasks.push({ ...t, retry: true }); // как в Duolingo: ошибку повторим в конце
  if (correct || t.retry || t.type === 'pairs') s.done++;
  const bar = app.querySelector('.lbar i'); if (bar) bar.style.width = Math.round(s.done / s.total * 100) + '%';
  const cb = $('#combo');
  if (cb) { cb.querySelector('b').textContent = s.combo; cb.classList.toggle('on', s.combo >= 3); if (s.combo >= 3) { cb.classList.remove('pop'); void cb.offsetWidth; cb.classList.add('pop'); } }
  if (correct) { sfx.ok(); haptic('success'); if (s.combo > 0 && s.combo % 5 === 0) setTimeout(sfx.combo, 180); } else { sfx.bad(); haptic('error'); }
  const foot = $('#foot');
  foot.innerHTML = `<div class="fb ${correct ? 'ok' : 'bad'}">
    <div class="fb-head">${ic(correct ? 'check' : 'x')}<b>${o.title || (correct ? rnd(PRAISE) : 'Неверно')}</b>${xp ? `<span class="fb-xp">+${xp} XP</span>` : ''}</div>
    ${o.note ? `<div class="fb-note">${esc(o.note)}</div>` : ''}
    ${o.answer && (!correct || o.showAnswer) ? `<div class="fb-ans">${correct ? '' : '<span>Правильно:</span> '}<b>${esc(o.answer)}</b>${o.say ? sayBtn(o.say, 'sm') : ''}</div>` : ''}
    ${o.sub ? `<div class="fb-sub">${esc(o.sub)}</div>` : ''}
    ${o.explain ? `<div class="fb-ex">${ic('bulb')}<span>${esc(o.explain)}</span></div>` : ''}
    <button class="btn ${correct ? 'primary' : 'danger'}" id="cont">${correct ? 'Продолжить' : 'Понятно'}</button></div>`;
  if (o.say && (S.autoSay || o.forceSay)) speak(o.say);
  const cont = $('#cont');
  if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
  cont.addEventListener('click', () => { if (sess === s) { s.i++; drawStep(); } });
  setTimeout(() => { if (sess === s && $('#cont') === cont) cont.focus({ preventScroll: true }); }, 30);
}
function applyResults(s) {
  if (s.applied) return;
  s.applied = true;
  const t = today();
  for (const [id, ok] of Object.entries(s.res)) {
    const c = S.cards[id];
    if (!c) {
      if (s.p.mode !== 'daily' && !id.startsWith('v:')) continue; // в тренажёрах неизученные слова не заводим
      S.cards[id] = nextCard(null, ok ? 2 : 0);
      if (!id.startsWith('v:')) dayRec().nw++;
    } else if (c.d <= t) S.cards[id] = nextCard(c, ok ? 2 : 0);
    else if (!ok) c.d = t;
  }
  save();
}
function finishLesson() {
  const s = sess;
  applyResults(s);
  let bonus = 0;
  if (s.p.mode === 'daily') { bonus = 5; S.lessons = (S.lessons || 0) + 1; addXP(bonus); }
  const acc = s.n ? Math.round(s.ok / s.n * 100) : 100;
  const title = acc === 100 ? 'Идеально!' : acc >= 80 ? 'Отличный урок!' : acc >= 50 ? 'Хорошая работа!' : 'Ты справился!';
  sfx.win(); haptic('success'); confetti();
  view(`
    <div class="finish">
      <div class="trophy">${ic('award')}</div>
      <h1>${title}</h1>
      <p class="muted">${MODE_TITLE[s.p.mode] || 'Тренировка'}: всё пройдено</p>
      <div class="fin-stats">
        <div class="fs"><span>Опыт</span><b>+${s.xp + bonus}</b></div>
        <div class="fs"><span>Точность</span><b>${acc}%</b></div>
        <div class="fs"><span>Время</span><b>${fmtTime(Date.now() - s.t0)}</b></div>
      </div>
      ${s.maxCombo >= 3 ? `<div class="pill">${ic('zap')} Лучшее комбо: ${s.maxCombo} подряд</div>` : ''}
      ${streak() ? `<div class="pill">${ic('flame')} Серия: ${streak()} ${plural(streak(), 'день', 'дня', 'дней')}</div>` : ''}
    </div>
    <button class="btn primary" id="again">${s.p.mode === 'daily' ? 'Ещё урок' : 'Ещё раунд'}</button>
    ${homeBtn()}`);
  sess = null;
  click('#again', render);
  bindHome();
}

/* ---------- Виды заданий ---------- */
const EX = {};
EX.intro = (t, ex, foot) => {
  const w = t.w;
  ex.innerHTML = `<div class="ex-label">${ic('star')} Новое слово</div>
    <div class="card word-card"><div class="big-word">${esc(w.en)}</div>${sayBtn(w.en, 'lg')}
    <div class="tr">${esc(w.ru)}</div>${w.ex ? `<div class="ex-sent">${esc(w.ex)} ${sayBtn(w.ex, 'sm')}</div>` : ''}</div>`;
  foot.innerHTML = '<button class="btn primary" id="cont">Запомнил</button>';
  autoSay(w.en);
  const s = sess;
  $('#cont').addEventListener('click', () => { if (sess !== s) return; s.done++; s.i++; drawStep(); });
};
function choiceEx(t, ex, mode) {
  const w = t.w;
  const opts = shuffle([w, ...distractors(w, mode === 'listen' ? 4 : 3)]);
  const label = { choice: 'Выбери перевод', choiceRev: 'Как это по-английски?', listen: 'Что ты слышишь?' }[mode];
  const prompt = mode === 'choice' ? `<div class="big-word">${esc(w.en)}</div>${sayBtn(w.en)}`
    : mode === 'choiceRev' ? `<div class="big-word">${esc(w.ru)}</div>`
    : `<div class="play-row"><button class="play-big" data-say="${esc(w.en)}" aria-label="Слушать">${ic('vol')}</button><button class="play-slow" data-say="${esc(w.en)}" data-slow="1">0.6×</button></div>`;
  ex.innerHTML = `<div class="ex-label">${label}</div><div class="prompt">${prompt}</div>
    <div class="opts">${opts.map((o, k) => `<button class="opt" data-k="${k}"><span class="kbd">${k + 1}</span><span class="grow">${esc(mode === 'choiceRev' ? o.en : o.ru)}</span></button>`).join('')}</div>`;
  if (mode === 'listen') speak(w.en); else if (mode === 'choice') autoSay(w.en);
  const choose = k => {
    if (sess.answered) return;
    const right = opts[k] === w;
    ex.querySelectorAll('.opt').forEach((b, j) => { b.disabled = true; if (opts[j] === w) b.classList.add('ok'); else if (j === k) b.classList.add('bad'); });
    answer(right, { answer: mode === 'choiceRev' ? w.en : `${w.en} — ${w.ru}`, say: w.en, showAnswer: mode === 'listen' });
  };
  ex.querySelectorAll('.opt').forEach(b => b.addEventListener('click', () => choose(+b.dataset.k)));
  stepKey = e => { const k = +e.key - 1; if (k >= 0 && k < opts.length) choose(k); };
}
EX.choice = (t, ex) => choiceEx(t, ex, 'choice');
EX.choiceRev = (t, ex) => choiceEx(t, ex, 'choiceRev');
EX.listen = (t, ex) => choiceEx(t, ex, 'listen');

EX.letters = (t, ex, foot) => {
  const w = t.w, target = w.en;
  let letters = shuffle([...target]);
  if (letters.join('') === target && target.length > 1) letters = letters.reverse();
  const picked = [];
  ex.innerHTML = `<div class="ex-label">Собери слово из букв</div><div class="prompt"><div class="big-word sm">${esc(w.ru)}</div></div>
    <div class="slots" id="slots"></div><div class="tiles" id="tiles"></div>`;
  foot.innerHTML = '<button class="btn ghost" id="giveup">Не знаю</button>';
  const draw = () => {
    $('#slots').innerHTML = [...target].map((_, i) => picked[i] !== undefined
      ? `<button class="slot filled" data-p="${i}">${esc(letters[picked[i]])}</button>` : '<span class="slot"></span>').join('');
    $('#tiles').innerHTML = letters.map((ch, k) => `<button class="ltile ${picked.includes(k) ? 'used' : ''}" data-k="${k}" ${picked.includes(k) ? 'disabled' : ''}>${esc(ch)}</button>`).join('');
    ex.querySelectorAll('.ltile').forEach(b => b.addEventListener('click', () => put(+b.dataset.k)));
    ex.querySelectorAll('.slot.filled').forEach(b => b.addEventListener('click', () => { if (sess.answered) return; picked.splice(+b.dataset.p, 1); sfx.tap(); draw(); }));
  };
  const put = k => {
    if (sess.answered || picked.includes(k)) return;
    picked.push(k); sfx.tap(); haptic('light'); draw();
    if (picked.length === target.length) {
      const ok = picked.map(i => letters[i]).join('').toLowerCase() === target.toLowerCase();
      $('#slots').classList.add(ok ? 'ok' : 'bad');
      answer(ok, { answer: target, say: target, sub: w.ru });
    }
  };
  draw();
  $('#giveup').addEventListener('click', () => answer(false, { answer: target, say: target, sub: w.ru }));
  stepKey = e => {
    if (e.key === 'Backspace' && picked.length) { picked.pop(); draw(); return; }
    if (e.key.length !== 1) return;
    const k = letters.findIndex((ch, i) => ch.toLowerCase() === e.key.toLowerCase() && !picked.includes(i));
    if (k >= 0) put(k);
  };
};

EX.type = (t, ex, foot) => {
  const w = t.w;
  let hint = 0;
  const bl = blankEx(w);
  ex.innerHTML = `<div class="ex-label">Напиши по-английски</div><div class="prompt"><div class="big-word sm">${esc(w.ru)}</div>
    ${bl ? `<div class="ex-sent">${bl}</div>` : ''}<div class="hint-area" id="hintArea"></div></div>
    <form id="f" autocomplete="off"><input id="inp" class="input" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Твой ответ" enterkeyhint="done"></form>`;
  foot.innerHTML = `<div class="row2"><button class="btn ghost" id="hintb">${ic('bulb')} Подсказка</button><button class="btn primary" id="chk">Проверить</button></div>`;
  const inp = $('#inp');
  inp.focus();
  const check = () => {
    if (sess.answered) return;
    if (!inp.value.trim()) { inp.focus(); return; }
    const r = checkWord(inp.value, w.en);
    inp.readOnly = true;
    inp.classList.add(r.ok ? 'ok' : 'bad');
    answer(r.ok, { answer: w.en, say: w.en, showAnswer: r.typo, note: r.typo ? 'Засчитано, но есть опечатка' : '' });
  };
  $('#f').addEventListener('submit', e => { e.preventDefault(); check(); });
  $('#chk').addEventListener('click', check);
  $('#hintb').addEventListener('click', () => { hint = Math.min(2, hint + 1); $('#hintArea').textContent = hintFor(w.en, hint); inp.focus(); });
};

EX.build = (t, ex, foot) => {
  const ph = t.p;
  const words = tokens(ph.en);
  const lower = new Set(words.map(x => x.toLowerCase()));
  const pool = [...new Set(LEVELS.slice(0, lvIdx() + 1).flatMap(l => PHRASES_BY_LV[l]).flatMap(x => tokens(x.en)).filter(x => !lower.has(x.toLowerCase()) && !/^\d+$/.test(x)))];
  const tiles = shuffle([...words, ...pick(pool, words.length > 6 ? 3 : 2)]).map((w, k) => ({ w, k }));
  const picked = [];
  ex.innerHTML = `<div class="ex-label">Переведи предложение</div>
    <div class="prompt left"><div class="speech">${esc(ph.ru)}</div></div>
    <div class="answer-line" id="line"></div><div class="tiles words" id="bank"></div>`;
  foot.innerHTML = '<div class="row2"><button class="btn ghost" id="giveup">Не знаю</button><button class="btn primary" id="chk" disabled>Проверить</button></div>';
  const draw = () => {
    $('#line').innerHTML = picked.map((k, i) => `<button class="wtile" data-i="${i}">${esc(tiles[k].w)}</button>`).join('') || '<span class="muted small">Нажимай на слова ниже</span>';
    $('#bank').innerHTML = tiles.map(tl => `<button class="wtile ${picked.includes(tl.k) ? 'used' : ''}" data-k="${tl.k}" ${picked.includes(tl.k) ? 'disabled' : ''}>${esc(tl.w)}</button>`).join('');
    $('#chk').disabled = !picked.length;
    $('#line').querySelectorAll('.wtile').forEach(b => b.addEventListener('click', () => { if (sess.answered) return; picked.splice(+b.dataset.i, 1); sfx.tap(); draw(); }));
    $('#bank').querySelectorAll('.wtile').forEach(b => b.addEventListener('click', () => { if (sess.answered) return; picked.push(+b.dataset.k); sfx.tap(); haptic('light'); draw(); }));
  };
  draw();
  const check = () => {
    if (sess.answered || !picked.length) return;
    const got = picked.map(k => tiles[k].w.toLowerCase()).join(' ');
    const ok = got === words.map(x => x.toLowerCase()).join(' ');
    $('#line').classList.add(ok ? 'ok' : 'bad');
    answer(ok, { answer: ph.en, say: ph.en, forceSay: true });
  };
  $('#chk').addEventListener('click', check);
  $('#giveup').addEventListener('click', () => answer(false, { answer: ph.en, say: ph.en }));
};

EX.dictation = (t, ex, foot) => {
  const ph = t.p;
  ex.innerHTML = `<div class="ex-label">Напиши, что слышишь</div>
    <div class="play-row"><button class="play-big" data-say="${esc(ph.en)}" aria-label="Слушать">${ic('vol')}</button><button class="play-slow" data-say="${esc(ph.en)}" data-slow="1">0.6×</button></div>
    <form id="f" autocomplete="off"><textarea id="inp" class="input area" rows="3" autocapitalize="sentences" autocorrect="off" spellcheck="false" placeholder="Напиши по-английски"></textarea></form>`;
  foot.innerHTML = '<div class="row2"><button class="btn ghost" id="giveup">Не могу</button><button class="btn primary" id="chk">Проверить</button></div>';
  const inp = $('#inp');
  const s = sess;
  setTimeout(() => { if (sess === s) speak(ph.en); }, 250);
  inp.focus();
  const check = () => {
    if (sess.answered) return;
    if (!inp.value.trim()) { inp.focus(); return; }
    const r = checkSentence(inp.value, ph.en);
    inp.readOnly = true;
    inp.classList.add(r.ok ? 'ok' : 'bad');
    answer(r.ok, { answer: ph.en, say: ph.en, showAnswer: true, sub: ph.ru, note: r.typo ? 'Засчитано, но есть опечатка' : '' });
  };
  inp.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); check(); } });
  $('#chk').addEventListener('click', check);
  $('#giveup').addEventListener('click', () => answer(false, { answer: ph.en, say: ph.en, sub: ph.ru }));
};

EX.pairs = (t, ex, foot) => {
  const ws = t.ws;
  const L = shuffle(ws), R = shuffle(ws);
  let selL = null, selR = null, matched = 0, mistakes = 0;
  const t0 = Date.now();
  const bad = new Set();
  ex.innerHTML = `<div class="ex-label">Найди пары</div>
    <div class="pairs"><div class="pcol">${L.map(w => `<button class="pbtn" data-side="L" data-id="${esc(w.id)}">${esc(w.en)}</button>`).join('')}</div>
    <div class="pcol">${R.map(w => `<button class="pbtn" data-side="R" data-id="${esc(w.id)}">${esc(w.ru)}</button>`).join('')}</div></div>
    <div class="ptimer muted small" id="ptimer">${ic('clock')} 0:00</div>`;
  foot.innerHTML = '';
  const s = sess;
  const timer = setInterval(() => { if (sess !== s || s.answered) return clearInterval(timer); const el = $('#ptimer'); if (el) el.innerHTML = `${ic('clock')} ${fmtTime(Date.now() - t0)}`; }, 500);
  const btns = [...ex.querySelectorAll('.pbtn')];
  btns.forEach(b => b.addEventListener('click', () => {
    if (b.classList.contains('done') || s.answered) return;
    const side = b.dataset.side;
    btns.filter(x => x.dataset.side === side).forEach(x => x.classList.remove('sel'));
    b.classList.add('sel');
    if (side === 'L') { selL = b; speak(L.find(w => w.id === b.dataset.id).en); } else selR = b;
    sfx.tap();
    if (selL && selR) {
      const a = selL, c = selR;
      selL = selR = null;
      if (a.dataset.id === c.dataset.id) {
        a.classList.remove('sel'); c.classList.remove('sel');
        a.classList.add('done'); c.classList.add('done');
        matched++; haptic('light');
        if (matched === ws.length) {
          clearInterval(timer);
          ws.forEach(w => rec(w.id, !bad.has(w.id)));
          answer(mistakes <= 1, { title: mistakes ? (mistakes === 1 ? 'Почти идеально!' : `Ошибок: ${mistakes}`) : 'Без ошибок!', note: `Время: ${fmtTime(Date.now() - t0)}` });
        }
      } else {
        mistakes++; bad.add(a.dataset.id); bad.add(c.dataset.id);
        a.classList.add('wrong'); c.classList.add('wrong'); sfx.bad(); haptic('error');
        setTimeout(() => { a.classList.remove('wrong', 'sel'); c.classList.remove('wrong', 'sel'); }, 450);
      }
    }
  }));
};

EX.gram = (t, ex) => {
  const g = t.g;
  ex.innerHTML = `<div class="ex-label">${ic('rule')} ${esc(g.t.title)}</div>
    <div class="card sentence-card"><div class="sentence" id="sent">${fillGaps(g.text)}</div></div>
    <div class="opts">${g.opts.map((o, k) => `<button class="opt" data-k="${k}"><span class="kbd">${k + 1}</span><span class="grow">${esc(o)}</span></button>`).join('')}</div>`;
  const choose = k => {
    if (sess.answered) return;
    const right = k === g.a;
    ex.querySelectorAll('.opt').forEach((b, j) => { b.disabled = true; if (j === g.a) b.classList.add('ok'); else if (j === k) b.classList.add('bad'); });
    $('#sent').innerHTML = fillGaps(g.text, g.opts[g.a]);
    answer(right, { explain: g.ex, say: plainFill(g.text, g.opts[g.a]).replace(/^.*→\s*/, '') });
  };
  ex.querySelectorAll('.opt').forEach(b => b.addEventListener('click', () => choose(+b.dataset.k)));
  stepKey = e => { const k = +e.key - 1; if (k >= 0 && k < g.opts.length) choose(k); };
};

EX.verb = (t, ex, foot) => {
  const v = t.v;
  ex.innerHTML = `<div class="ex-label">${ic('repeat')} Неправильный глагол</div>
    <div class="prompt"><div class="big-word">${esc(v.base)}</div>${sayBtn(v.base)}<div class="tr">${esc(v.ru)}</div></div>
    <form id="f" autocomplete="off">
      <input class="input" id="v2" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Past Simple (V2)" enterkeyhint="next">
      <input class="input" id="v3" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Past Participle (V3)" enterkeyhint="done">
    </form>`;
  foot.innerHTML = '<div class="row2"><button class="btn ghost" id="giveup">Не помню</button><button class="btn primary" id="chk">Проверить</button></div>';
  const i2 = $('#v2'), i3 = $('#v3');
  i2.focus();
  const match = (val, forms) => { const parts = val.split(/[\/,]/).map(normEn).filter(Boolean); return parts.length > 0 && parts.every(p => forms.split('/').some(f => normEn(f) === p)); };
  const check = giveUp => {
    if (sess.answered) return;
    if (!giveUp && !i2.value.trim()) { i2.focus(); return; }
    const ok2 = !giveUp && match(i2.value, v.v2), ok3 = !giveUp && match(i3.value, v.v3);
    i2.readOnly = i3.readOnly = true;
    i2.classList.add(ok2 ? 'ok' : 'bad'); i3.classList.add(ok3 ? 'ok' : 'bad');
    answer(ok2 && ok3, { answer: `${v.base} – ${v.v2} – ${v.v3}`, say: verbSay(v), showAnswer: true });
  };
  i2.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); i3.focus(); } });
  $('#f').addEventListener('submit', e => { e.preventDefault(); check(false); });
  $('#chk').addEventListener('click', () => check(false));
  $('#giveup').addEventListener('click', () => check(true));
};

/* ---------- Карточки (интервальное повторение) ---------- */
SCREENS.cards = p => {
  const due = dueWordIds();
  const nw = newWordIds(p.extra || newLeft());
  const q = [];
  let di = 0, ni = 0;
  while (di < due.length || ni < nw.length) {
    for (let k = 0; k < 3 && di < due.length; k++) q.push(due[di++]);
    if (ni < nw.length) q.push(nw[ni++]);
  }
  if (!q.length) return cardsEmpty();
  sess = { q, done: 0, ok: 0, flipped: false, rev: false, t0: Date.now() };
  drawCard();
};
function cardsEmpty() {
  const left = newWordIds(1).length;
  view(`<div class="finish"><div class="trophy">${ic('check')}</div><h1>Всё повторено</h1>
    <p class="muted">${left ? 'Лимит новых слов на сегодня исчерпан. Можно взять ещё или потренироваться в играх.' : 'Ты прошёл все слова в базе! Добавляй свои в «Словарь».'}</p></div>
    ${left ? '<button class="btn primary" id="more">Ещё 5 новых слов</button>' : ''}
    <button class="btn ghost" id="sprint">${ic('zap')} Сыграть в Спринт</button>${homeBtn()}`);
  click('#more', () => { stack[stack.length - 1].params = { extra: 5 }; render(); });
  click('#sprint', () => { stack.pop(); go('sprint'); });
  bindHome();
}
function drawCard() {
  const s = sess;
  stepKey = null;
  if (!s.q.length) return cardsDone();
  const id = s.q[0], w = getWord(id);
  if (!w) { s.q.shift(); return drawCard(); }
  const c = S.cards[id], isNew = !c;
  if (!s.flipped) s.rev = !!c && c.r >= 2 && Math.random() < 0.35;
  const front = s.rev
    ? `<div class="ex-label center">Вспомни по-английски</div><div class="big-word">${esc(w.ru)}</div>`
    : `<div class="ex-label center">${isNew ? '<span class="badge">новое слово</span>' : 'Вспомни перевод'}</div><div class="big-word">${esc(w.en)}</div>${sayBtn(w.en)}`;
  const answerHtml = !s.flipped ? '<div class="muted small tap-hint">нажми, чтобы перевернуть</div>' : `
    <div class="divider"></div>
    ${s.rev ? `<div class="big-word sm">${esc(w.en)}</div>${sayBtn(w.en)}` : `<div class="tr">${esc(w.ru)}</div>`}
    ${w.ex ? `<div class="ex-sent">${esc(w.ex)} ${sayBtn(w.ex, 'sm')}</div>` : ''}`;
  const grades = [['Не помню', 'g0'], ['Сложно', 'g1'], ['Помню', 'g2'], ['Легко', 'g3']];
  view(`<div class="lesson">${ltop(s.done / (s.done + s.q.length), `<div class="combo on">${ic('layers')}<b>${s.q.length}</b></div>`)}
    <div class="lbody"><div class="card flash ${s.flipped ? 'flipped' : 'tappable'}" id="flash">${front}${answerHtml}</div></div>
    <div class="lfoot">${s.flipped
      ? `<div class="grades">${grades.map(([tx, cls], g) => `<button class="gbtn ${cls}" data-g="${g}"><b>${tx}</b><small>${fmtInt(nextCard(c, g).i)}</small></button>`).join('')}</div>
         ${isNew ? '<button class="link" id="known">Я уже знаю это слово</button>' : ''}`
      : '<button class="btn primary" id="show">Показать ответ</button>'}</div></div>`);
  click('#close', back);
  if (!s.flipped) {
    const flip = e => {
      if (e && e.target && e.target.closest && e.target.closest('[data-say]')) return;
      s.flipped = true; sfx.tap(); haptic('light'); drawCard();
      if (s.rev) autoSay(w.en);
    };
    click('#flash', flip); click('#show', flip);
    stepKey = e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(); } };
    if (!s.rev) autoSay(w.en);
  } else {
    click('[data-g]', e => gradeCard(id, +e.currentTarget.dataset.g));
    stepKey = e => { const g = +e.key - 1; if (g >= 0 && g <= 3) gradeCard(id, g); };
    click('#known', () => {
      S.cards[id] = { d: today() + 60, i: 60, e: 270, r: 3, l: 0 };
      s.q.shift(); s.flipped = false; s.done++; s.ok++;
      const repl = newWordIds(1, new Set(s.q));
      if (repl.length) s.q.push(repl[0]);
      addXP(1, 1, 1); drawCard();
    });
  }
}
function gradeCard(id, g) {
  const s = sess;
  if (!S.cards[id]) dayRec().nw++;
  S.cards[id] = nextCard(S.cards[id], g);
  s.q.shift(); s.flipped = false; s.done++;
  if (g > 0) { s.ok++; sfx.ok(); } else { s.q.splice(Math.min(3, s.q.length), 0, id); sfx.bad(); }
  haptic(g === 0 ? 'warning' : 'light');
  addXP(1, g > 0 ? 1 : 0, 1);
  drawCard();
}
function cardsDone() {
  const s = sess;
  const pct = s.done ? Math.round(s.ok / s.done * 100) : 0;
  sfx.win(); confetti();
  view(`<div class="finish"><div class="trophy">${ic('layers')}</div><h1>Карточки пройдены</h1>
    <div class="fin-stats"><div class="fs"><span>Карточек</span><b>${s.done}</b></div><div class="fs"><span>Вспомнил</span><b>${pct}%</b></div><div class="fs"><span>Время</span><b>${fmtTime(Date.now() - s.t0)}</b></div></div></div>
    ${newWordIds(1).length ? '<button class="btn primary" id="more">Ещё 5 новых слов</button>' : ''}${homeBtn()}`);
  click('#more', () => { stack[stack.length - 1].params = { extra: 5 }; render(); });
  bindHome();
}

/* ---------- Спринт (как в Lingualeo) ---------- */
SCREENS.sprint = () => {
  view(`<div class="game-intro"><div class="game-ico">${ic('zap')}</div><h1>Спринт</h1>
    <p class="muted">60 секунд. Перевод верный или нет? Каждые 4 верных ответа подряд увеличивают множитель очков — до ×4.</p>
    <div class="pill">${ic('award')} Рекорд: ${S.best.sprint}</div>
    <p class="muted small">На компьютере: ← неверно, → верно</p></div>
    <button class="btn primary big" id="start">${ic('play')} Старт</button>`);
  click('#start', startSprint);
};
function startSprint() {
  topbar.innerHTML = '';
  const pool = practicePool(30);
  const s = sess = { score: 0, mult: 1, run: 0, ok: 0, n: 0, end: Date.now() + 60000, log: [], cur: null };
  s.onLeave = () => clearInterval(s.timer);
  view(`<div class="lesson sprint">
    <div class="ltop"><button class="icon-btn" id="close" aria-label="Закрыть">${ic('x')}</button><div class="lbar timebar"><i id="tb" style="width:100%"></i></div><div class="combo on">${ic('clock')}<b id="sec">60</b></div></div>
    <div class="sprint-score"><b id="score">0</b><div class="mult" id="mult"></div></div>
    <div class="card sprint-card" id="scard"><div class="big-word" id="sen"></div><div class="eq">=</div><div class="tr" id="sru"></div></div>
    <div class="row2 sprint-btns"><button class="btn danger big" id="no">${ic('x')} Неверно</button><button class="btn primary big" id="yes">${ic('check')} Верно</button></div></div>`);
  click('#close', back);
  const next = () => {
    const w = rnd(pool);
    const truth = Math.random() < 0.5;
    const shown = truth ? w : (distractors(w, 1)[0] || w);
    s.cur = { w, truth: shown === w };
    $('#sen').textContent = w.en;
    $('#sru').textContent = shown.ru;
    $('#mult').innerHTML = `<span class="x">×${s.mult}</span>${[0, 1, 2, 3].map(i => `<i class="${s.mult === 4 || i < s.run % 4 ? 'on' : ''}"></i>`).join('')}`;
  };
  const choose = says => {
    if (sess !== s || Date.now() > s.end) return;
    const ok = says === s.cur.truth;
    s.n++;
    s.log.push({ w: s.cur.w, ok });
    const card = $('#scard');
    card.classList.remove('flash-ok', 'flash-bad'); void card.offsetWidth;
    card.classList.add(ok ? 'flash-ok' : 'flash-bad');
    if (ok) {
      s.ok++; s.run++; s.score += 10 * s.mult;
      if (s.run % 4 === 0 && s.mult < 4) { s.mult++; sfx.combo(); } else sfx.ok();
      haptic('light');
    } else { s.run = 0; s.mult = 1; sfx.bad(); haptic('error'); }
    $('#score').textContent = s.score;
    next();
  };
  click('#yes', () => choose(true));
  click('#no', () => choose(false));
  stepKey = e => { if (e.key === 'ArrowRight') choose(true); if (e.key === 'ArrowLeft') choose(false); };
  next();
  s.timer = setInterval(() => {
    if (sess !== s) return clearInterval(s.timer);
    const left = Math.max(0, s.end - Date.now());
    $('#tb').style.width = (left / 600) + '%';
    $('#sec').textContent = Math.ceil(left / 1000);
    if (!left) { clearInterval(s.timer); sprintEnd(s); }
  }, 100);
}
function sprintEnd(s) {
  stepKey = null;
  const record = s.score > S.best.sprint;
  if (record) S.best.sprint = s.score;
  const xp = Math.round(s.ok / 2);
  addXP(xp, s.ok, s.n);
  sfx.win(); if (record) confetti();
  const wrong = [...new Map(s.log.filter(x => !x.ok).map(x => [x.w.id, x.w])).values()];
  view(`<div class="finish"><div class="trophy">${ic('zap')}</div><h1>${record ? 'Новый рекорд!' : 'Время вышло!'}</h1>
    <div class="mega">${s.score}</div>
    <div class="fin-stats"><div class="fs"><span>Верно</span><b>${s.ok}/${s.n}</b></div><div class="fs"><span>Рекорд</span><b>${S.best.sprint}</b></div><div class="fs"><span>Опыт</span><b>+${xp}</b></div></div></div>
    ${wordList(wrong, 'Где ошибся')}
    <button class="btn primary" id="again">Ещё раз</button>${homeBtn()}`);
  sess = null;
  click('#again', render);
  bindHome();
}
const wordList = (ws, title) => !ws.length ? '' : `<h2 class="sec">${title}</h2><div class="list">${ws.map(w =>
  `<div class="row"><div class="grow"><div class="row-title">${esc(w.en)}</div><div class="muted small">${esc(w.ru)}</div></div>${sayBtn(w.en, 'sm')}</div>`).join('')}</div>`;

/* ---------- Саванна (как в Lingualeo) ---------- */
SCREENS.savanna = () => {
  view(`<div class="game-intro"><div class="game-ico">${ic('down')}</div><h1>Саванна</h1>
    <p class="muted">Слово падает сверху. Выбери перевод, пока оно не коснулось земли. 5 жизней, а слова падают всё быстрее.</p>
    <div class="pill">${ic('award')} Рекорд: ${S.best.savanna}</div>
    <p class="muted small">На компьютере: клавиши 1–4</p></div>
    <button class="btn primary big" id="start">${ic('play')} Старт</button>`);
  click('#start', startSavanna);
};
function startSavanna() {
  topbar.innerHTML = '';
  const words = pick(practicePool(30), 40);
  const s = sess = { words, i: 0, lives: 5, score: 0, n: 0, wrong: [], raf: 0, busy: false, timers: [] };
  s.onLeave = () => { cancelAnimationFrame(s.raf); s.timers.forEach(clearTimeout); };
  view(`<div class="lesson savanna">
    <div class="ltop"><button class="icon-btn" id="close" aria-label="Закрыть">${ic('x')}</button><div class="lives" id="lives"></div><div class="combo on">${ic('star')}<b id="score">0</b></div></div>
    <div class="arena" id="arena"><div class="falling" id="fall"></div><div class="ground"></div></div>
    <div class="sav-opts" id="opts"></div></div>`);
  click('#close', back);
  const drawLives = () => { $('#lives').innerHTML = Array.from({ length: 5 }, (_, i) => `<span class="${i < s.lives ? 'on' : ''}">${ic('heart')}</span>`).join(''); };
  drawLives();
  const round = () => {
    if (sess !== s) return;
    if (s.lives <= 0 || s.i >= s.words.length) return savannaEnd(s);
    const w = s.words[s.i];
    const opts = shuffle([w, ...distractors(w, 3)]);
    s.busy = false;
    const fall = $('#fall'), arena = $('#arena');
    fall.className = 'falling';
    fall.style.transform = 'translate(-50%, 0)';
    fall.textContent = w.en;
    $('#opts').innerHTML = opts.map((o, k) => `<button class="opt" data-k="${k}"><span class="kbd">${k + 1}</span><span class="grow">${esc(o.ru)}</span></button>`).join('');
    const dur = Math.max(2600, 6000 - s.i * 120);
    const t0 = performance.now();
    const H = arena.clientHeight - fall.offsetHeight - 14;
    const resolve = k => {
      if (s.busy || sess !== s) return;
      s.busy = true;
      cancelAnimationFrame(s.raf);
      const ok = k >= 0 && opts[k] === w;
      s.n++;
      app.querySelectorAll('#opts .opt').forEach((b, j) => { b.disabled = true; if (opts[j] === w) b.classList.add('ok'); else if (j === k) b.classList.add('bad'); });
      if (ok) { s.score++; $('#score').textContent = s.score; fall.classList.add('boom'); sfx.ok(); haptic('light'); }
      else { s.lives--; s.wrong.push(w); drawLives(); fall.classList.add('miss'); sfx.bad(); haptic('error'); autoSay(w.en); }
      s.i++;
      s.timers.push(setTimeout(round, ok ? 450 : 1100));
    };
    app.querySelectorAll('#opts .opt').forEach(b => b.addEventListener('click', () => resolve(+b.dataset.k)));
    stepKey = e => { const k = +e.key - 1; if (k >= 0 && k < 4) resolve(k); };
    const frame = now => {
      if (sess !== s || s.busy) return;
      const p = Math.min(1, (now - t0) / dur);
      fall.style.transform = `translate(-50%, ${p * H}px)`;
      if (p >= 1) return resolve(-1);
      s.raf = requestAnimationFrame(frame);
    };
    s.raf = requestAnimationFrame(frame);
  };
  round();
}
function savannaEnd(s) {
  stepKey = null;
  const record = s.score > S.best.savanna;
  if (record) S.best.savanna = s.score;
  addXP(s.score, s.score, s.n);
  sfx.win(); if (record) confetti();
  view(`<div class="finish"><div class="trophy">${ic('down')}</div><h1>${record ? 'Новый рекорд!' : s.lives > 0 ? 'Все слова пройдены!' : 'Жизни закончились'}</h1>
    <div class="mega">${s.score}</div>
    <div class="fin-stats"><div class="fs"><span>Слов</span><b>${s.score}/${s.n}</b></div><div class="fs"><span>Рекорд</span><b>${S.best.savanna}</b></div><div class="fs"><span>Опыт</span><b>+${s.score}</b></div></div></div>
    ${wordList(s.wrong, 'Повтори эти слова')}
    <button class="btn primary" id="again">Ещё раз</button>${homeBtn()}`);
  sess = null;
  click('#again', render);
  bindHome();
}

/* ---------- Диалоги (как в Babbel / Busuu) ---------- */
SCREENS.dialogs = () => {
  view(`<h1 class="title">Диалоги</h1><p class="muted">Выбирай подходящую реплику, как в настоящем разговоре. Нажми на сообщение, чтобы увидеть перевод.</p>
    <div class="list">${DATA.dialogs.map(d => `<button class="row" data-d="${d.id}"><div class="row-ico">${ic('chat')}</div>
      <div class="grow"><div class="row-title">${esc(d.title)}</div><div class="muted small">${d.lv} · ${d.lines.filter(l => l[0] === 'me').length} реплик</div></div>
      ${S.dlg[d.id] ? `<span class="done-mark">${ic('check')}</span>` : ic('chev', 'chev')}</button>`).join('')}</div>`);
  click('[data-d]', e => go('dialog', { id: e.currentTarget.dataset.d }));
};
SCREENS.dialog = p => {
  const d = DIALOG_BY_ID[p.id];
  const s = sess = { d, step: 0, mistakes: 0, xp: 0, timers: [] };
  s.onLeave = () => s.timers.forEach(clearTimeout);
  const meCount = d.lines.filter(l => l[0] === 'me').length;
  view(`<div class="lesson dialog">${ltop(0, `<div class="combo on">${ic('chat')}</div>`)}
    <div class="dlg-title">${esc(d.title)} <span class="muted small">${d.lv}</span></div>
    <div class="chat" id="chat"></div><div class="lfoot" id="foot"></div></div>`);
  click('#close', back);
  const chat = $('#chat'), foot = $('#foot');
  let meDone = 0;
  const bubble = (who, en, ru) => {
    const b = document.createElement('div');
    b.className = `bubble ${who}`;
    b.innerHTML = `<div class="b-en">${esc(en)}</div>${ru ? `<div class="b-ru">${esc(ru)}</div>` : ''}${sayBtn(en, 'sm')}`;
    b.addEventListener('click', e => { if (!e.target.closest('[data-say]')) b.classList.toggle('show-ru'); });
    chat.appendChild(b);
    b.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };
  const step = () => {
    if (sess !== s) return;
    const line = d.lines[s.step];
    if (!line) return dialogEnd(s, meCount);
    if (line[0] === 'them') {
      const typing = document.createElement('div');
      typing.className = 'bubble them typing';
      typing.innerHTML = '<i></i><i></i><i></i>';
      chat.appendChild(typing);
      typing.scrollIntoView({ behavior: 'smooth', block: 'end' });
      s.timers.push(setTimeout(() => {
        if (sess !== s) return;
        typing.remove();
        bubble('them', line[1], line[2]);
        autoSay(line[1]);
        s.step++;
        s.timers.push(setTimeout(step, 700));
      }, 650));
    } else {
      const [, variants, ru] = line;
      const opts = shuffle(variants.map((v, k) => ({ v, ok: k === 0 })));
      let firstTry = true;
      foot.innerHTML = `<div class="ex-label">Твой ответ</div><div class="opts">${opts.map((o, k) => `<button class="opt" data-k="${k}"><span class="grow">${esc(o.v)}</span></button>`).join('')}</div>`;
      foot.querySelectorAll('.opt').forEach(b => b.addEventListener('click', () => {
        const o = opts[+b.dataset.k];
        if (o.ok) {
          sfx.ok(); haptic('success');
          foot.innerHTML = '';
          bubble('me', o.v, ru);
          speak(o.v);
          meDone++;
          const bar = app.querySelector('.lbar i'); if (bar) bar.style.width = Math.round(meDone / meCount * 100) + '%';
          if (firstTry) { s.xp += 2; addXP(2, 1, 1); } else addXP(0, 0, 1);
          s.step++;
          s.timers.push(setTimeout(step, 900));
        } else {
          firstTry = false; s.mistakes++;
          b.classList.add('bad'); b.disabled = true;
          sfx.bad(); haptic('error');
        }
      }));
    }
  };
  step();
};
function dialogEnd(s, meCount) {
  S.dlg[s.d.id] = 1; save();
  sfx.win(); confetti();
  const foot = $('#foot');
  foot.innerHTML = `<div class="fb ok"><div class="fb-head">${ic('check')}<b>${s.mistakes ? 'Диалог пройден!' : 'Идеальный диалог!'}</b><span class="fb-xp">+${s.xp} XP</span></div>
    <div class="fb-note">С первой попытки: ${s.xp / 2} из ${meCount}</div>
    <div class="row2"><button class="btn ghost" id="again">Ещё раз</button><button class="btn primary" id="list">К диалогам</button></div></div>`;
  $('#again').addEventListener('click', render);
  $('#list').addEventListener('click', back);
}

/* ---------- Грамматика ---------- */
SCREENS.grammar = () => {
  view(`<h1 class="title">Грамматика</h1>
    <button class="tile wide" id="mix"><div class="tile-ico">${ic('zap')}</div><div class="grow"><div class="tile-title">Микс по всем темам</div><div class="tile-sub">10 случайных вопросов</div></div>${ic('chev', 'chev')}</button>
    <div class="list">${DATA.grammar.map(t => {
      const st = S.gstats[t.id];
      const pc = st ? Math.round(st.c / st.t * 100) : 0;
      return `<button class="row" data-t="${t.id}"><div class="grow"><div class="row-title">${esc(t.title)}</div>
        <div class="muted small">${t.lv} · ${st ? `верно ${pc}%` : 'ещё не начато'}</div>
        ${st ? `<div class="mini-bar"><i style="width:${pc}%"></i></div>` : ''}</div>${ic('chev', 'chev')}</button>`;
    }).join('')}</div>`);
  click('#mix', () => go('lesson', { mode: 'grammar', mix: true }));
  click('[data-t]', e => go('gtopic', { id: e.currentTarget.dataset.t }));
};
SCREENS.gtopic = p => {
  const t = TOPIC_BY_ID[p.id];
  view(`<h1 class="title">${esc(t.title)}</h1>
    <div class="card theory"><div class="kicker">${ic('bulb')} Правило · ${t.lv}</div>${t.tip}</div>
    <button class="btn primary" id="start">${ic('play')} Практика (${t.qs.length} ${plural(t.qs.length, 'вопрос', 'вопроса', 'вопросов')})</button>`);
  click('#start', () => go('lesson', { mode: 'grammar', id: t.id }));
};

/* ---------- Неправильные глаголы ---------- */
SCREENS.verbs = () => {
  const learned = VERBS.filter(v => S.cards[v.id] && S.cards[v.id].i >= 7).length;
  const started = VERBS.filter(v => S.cards[v.id]).length;
  const due = dueVerbIds().length;
  view(`<h1 class="title">Неправильные глаголы</h1>
    <div class="card"><div class="split"><span>Выучено</span><span><b>${learned}</b> / ${VERBS.length}</span></div>
      <div class="bar"><i style="width:${learned / VERBS.length * 100}%"></i></div>
      <p class="muted small">В процессе: ${started - learned} · к повторению сегодня: ${due}</p></div>
    <button class="btn primary" id="train">${ic('play')} Тренировка (10 глаголов)</button>
    <button class="btn ghost" id="table">Вся таблица</button>`);
  click('#train', () => go('lesson', { mode: 'verbs' }));
  click('#table', () => go('vtable'));
};
SCREENS.vtable = () => {
  view(`<h1 class="title">Таблица глаголов</h1>
    <div class="search">${ic('search')}<input class="input" id="q" placeholder="Поиск: go или идти" autocapitalize="off"></div>
    <p class="muted small">○ не начат · ◐ учится · ● выучен · нажми на строку, чтобы послушать</p>
    <div class="list" id="vl"></div>`);
  const draw = () => {
    const q = $('#q').value.trim().toLowerCase();
    $('#vl').innerHTML = VERBS.filter(v => !q || [v.base, v.v2, v.v3, v.ru].some(x => x.toLowerCase().includes(q))).map(v => {
      const c = S.cards[v.id];
      return `<button class="row" data-say="${esc(verbSay(v))}"><span class="st ${c ? (c.i >= 7 ? 'full' : 'half') : ''}"></span>
        <div class="grow"><div><b>${esc(v.base)}</b> – ${esc(v.v2)} – ${esc(v.v3)}</div><div class="muted small">${esc(v.ru)}</div></div></button>`;
    }).join('') || '<div class="row muted">Ничего не найдено</div>';
  };
  draw();
  $('#q').addEventListener('input', draw);
};

/* ---------- Словарь (вкладка) ---------- */
SCREENS.dict = () => {
  const hard = allWords().filter(w => S.cards[w.id] && S.cards[w.id].l >= 2).sort((a, b) => S.cards[b.id].l - S.cards[a.id].l).slice(0, 30);
  const status = c => c ? (isMastered(c) ? '<span class="tag on">выучено</span>' : '<span class="tag">учится</span>') : '<span class="tag dim">новое</span>';
  view(`<h1 class="title">Словарь</h1>
    <form class="card" id="add" autocomplete="off">
      <div class="kicker">${ic('plus')} Добавить своё слово</div>
      <input class="input" id="en" placeholder="Слово по-английски" autocapitalize="off" required>
      <input class="input" id="ru" placeholder="Перевод" required>
      <input class="input" id="ex" placeholder="Пример (необязательно)" autocapitalize="off">
      <button class="btn primary" type="submit">Добавить</button>
    </form>
    <div class="search">${ic('search')}<input class="input" id="find" placeholder="Найти слово в базе (${allWords().length})" autocapitalize="off"></div>
    <div id="found"></div>
    <h2 class="sec">Мои слова · ${S.custom.length}</h2>
    ${S.custom.length ? `<div class="list">${S.custom.slice().reverse().map(c => `<div class="row"><div class="grow"><div class="row-title">${esc(c.en)}</div><div class="muted small">${esc(c.ru)}</div></div>
      ${status(S.cards[c.id])}${sayBtn(c.en, 'sm')}<button class="icon-btn sm" data-del="${c.id}" aria-label="Удалить">${ic('trash')}</button></div>`).join('')}</div>`
      : '<p class="muted">Пока пусто. Слова, которые ты добавишь, попадут в урок дня первыми.</p>'}
    ${hard.length ? `<h2 class="sec">Трудные слова</h2><div class="list">${hard.map(w => `<div class="row"><div class="grow"><div class="row-title">${esc(w.en)}</div><div class="muted small">${esc(w.ru)}</div></div>
      <span class="tag bad">${ic('x')} ${S.cards[w.id].l}</span>${sayBtn(w.en, 'sm')}</div>`).join('')}</div>` : ''}`);
  $('#find').addEventListener('input', e => {
    const q = e.target.value.trim().toLowerCase();
    $('#found').innerHTML = q.length < 2 ? '' : `<div class="list">${allWords().filter(w => w.en.toLowerCase().includes(q) || w.ru.toLowerCase().includes(q)).slice(0, 20)
      .map(w => `<div class="row"><div class="grow"><div class="row-title">${esc(w.en)} <span class="muted small">${w.lv === 'my' ? 'моё' : w.lv}</span></div><div class="muted small">${esc(w.ru)}</div></div>${status(S.cards[w.id])}${sayBtn(w.en, 'sm')}</div>`).join('') || '<div class="row muted">Не найдено</div>'}</div>`;
  });
  $('#add').addEventListener('submit', e => {
    e.preventDefault();
    const en = $('#en').value.trim(), ru = $('#ru').value.trim(), ex = $('#ex').value.trim();
    if (!en || !ru) return;
    if (allWords().some(w => w.en.toLowerCase() === en.toLowerCase())) { toast('Это слово уже есть в базе'); haptic('warning'); return; }
    S.custom.push({ id: 'c:' + Date.now().toString(36), en, ru, ex });
    save(); sfx.ok(); haptic('success'); toast('Добавлено: ' + en);
    render();
  });
  click('[data-del]', e => {
    const id = e.currentTarget.dataset.del;
    confirmDlg('Удалить слово из словаря?', () => { S.custom = S.custom.filter(c => c.id !== id); delete S.cards[id]; save(); render(); });
  });
};

/* ---------- Прогресс (вкладка) ---------- */
SCREENS.stats = () => {
  const t = today();
  const wordCards = Object.entries(S.cards).filter(([id]) => !id.startsWith('v:'));
  const mastered = wordCards.filter(([, c]) => isMastered(c)).length;
  let n7 = 0, ok7 = 0;
  for (let d = t - 6; d <= t; d++) { const r = S.days[d]; if (r) { n7 += r.n; ok7 += r.ok; } }
  const days = Array.from({ length: 14 }, (_, k) => t - 13 + k);
  const vals = days.map(d => (S.days[d] || {}).xp || 0);
  const max = Math.max(S.goal, ...vals) * 1.1;
  const lvl = userLevel(S.xpTotal), [lo, hi] = levelSpan(lvl);
  view(`<h1 class="title">Прогресс</h1>
    <section class="hero slim"><div class="split"><div><div class="kicker">Уровень игрока</div><div class="mega sm">${lvl}</div></div>
      <div class="right"><div class="kicker">Всего опыта</div><b class="big-num">${S.xpTotal} XP</b></div></div>
      <div class="bar light"><i style="width:${(S.xpTotal - lo) / (hi - lo) * 100}%"></i></div>
      <div class="hero-sub">До уровня ${lvl + 1}: ${hi - S.xpTotal} XP</div></section>
    <div class="stats">
      <div class="stat">${ic('flame')}<b>${streak()}</b><span>${plural(streak(), 'день', 'дня', 'дней')} подряд</span></div>
      <div class="stat">${ic('target')}<b>${n7 ? Math.round(ok7 / n7 * 100) + '%' : '—'}</b><span>точность за 7 дней</span></div>
      <div class="stat">${ic('layers')}<b>${wordCards.length}</b><span>слов в изучении</span></div>
      <div class="stat">${ic('check')}<b>${mastered}</b><span>слов выучено</span></div>
      <div class="stat">${ic('zap')}<b>${S.best.sprint}</b><span>рекорд Спринта</span></div>
      <div class="stat">${ic('down')}<b>${S.best.savanna}</b><span>рекорд Саванны</span></div>
    </div>
    <div class="card">
      <div class="split"><b>Опыт за 14 дней</b><span class="muted small" id="tip">нажми на столбик</span></div>
      <div class="chart" role="img" aria-label="Опыт по дням за 14 дней">
        ${days.map((d, k) => `<button class="bar-col" data-tip="${dayLabel(d)}: ${vals[k]} XP" aria-label="${dayLabel(d)}: ${vals[k]} XP"><i style="height:${vals[k] / max * 100}%"></i></button>`).join('')}
        <div class="goal-line" style="bottom:${S.goal / max * 100}%"><span>цель ${S.goal}</span></div>
      </div>
      <div class="chart-x"><span>${dayLabel(days[0])}</span><span>сегодня</span></div>
    </div>
    <h2 class="sec">Слова по уровням</h2>
    <div class="card">${LEVELS.map(l => {
      const ws = WORDS_BY_LV[l];
      const seen = ws.filter(w => S.cards[w.id]).length;
      return `<div class="meter"><div class="split"><b>${l}</b><span class="muted small">${seen} / ${ws.length}</span></div><div class="bar"><i style="width:${seen / ws.length * 100}%"></i></div></div>`;
    }).join('')}</div>
    <p class="muted small center">Уроков дня пройдено: ${S.lessons || 0} · ${cloudOK() ? 'прогресс в облаке Telegram' : 'прогресс на этом устройстве'}</p>`);
  const tip = $('#tip'), chart = app.querySelector('.chart');
  const select = b => { chart.classList.add('has-sel'); app.querySelectorAll('.bar-col').forEach(x => x.classList.toggle('sel', x === b)); tip.textContent = b.dataset.tip; };
  app.querySelectorAll('.bar-col').forEach(b => { b.addEventListener('click', () => select(b)); b.addEventListener('mouseenter', () => select(b)); });
};

/* ---------- Настройки (вкладка) ---------- */
SCREENS.settings = () => {
  const seg = (key, vals, fmt = v => v) => `<div class="seg" data-key="${key}">${vals.map(v => `<button class="${S[key] === v ? 'on' : ''}" data-v="${v}">${fmt(v)}</button>`).join('')}</div>`;
  const best = enVoices[0];
  const voiceLabel = v => `${v.name.replace(/^Microsoft\s+|\s+Online|\s*\(Natural\)|\s+-\s+English.*$/gi, '')} · ${v.lang}`;
  view(`<h1 class="title">Настройки</h1>
    <div class="setting"><label>Уровень английского</label>${seg('level', LEVELS)}</div>
    <div class="setting"><label>Цель дня (XP)</label>${seg('goal', [10, 20, 30, 50])}</div>
    <div class="setting"><label>Новых слов в день</label>${seg('newPerDay', [5, 10, 15, 20, 30])}</div>
    <h2 class="sec">Озвучка</h2>
    ${ttsOK ? `
      <div class="setting"><label>Голос</label>
        <select class="input select" id="voice">
          <option value="">Авто — лучший голос${best ? ` (${esc(voiceLabel(best))})` : ''}</option>
          ${enVoices.map(v => `<option value="${esc(v.voiceURI)}" ${S.voice === v.voiceURI ? 'selected' : ''}>${voiceScore(v) >= 60 ? '★ ' : ''}${esc(voiceLabel(v))}</option>`).join('')}
        </select>
        ${enVoices.length ? '' : '<p class="muted small">Голоса ещё загружаются…</p>'}
      </div>
      <div class="setting"><label>Скорость речи</label>${seg('rate', [0.7, 0.85, 1, 1.15], v => v + '×')}</div>
      <button class="btn ghost" id="testv">${ic('vol')} Прослушать</button>
      <div class="list"><label class="row"><span class="grow">Озвучивать слова автоматически</span><input type="checkbox" class="switch" id="say" ${S.autoSay ? 'checked' : ''}></label></div>
      <p class="muted small">★ — качественные голоса. Если хороших нет: на iPhone скачай голос с пометкой «улучшенный» (Настройки → Универсальный доступ → Устный контент → Голоса → English), на Android установи «Синтезатор речи Google».</p>`
      : '<p class="muted small">Озвучка не поддерживается на этом устройстве.</p>'}
    <h2 class="sec">Другое</h2>
    <div class="list"><label class="row"><span class="grow">Звуки ответов</span><input type="checkbox" class="switch" id="snd" ${S.sound ? 'checked' : ''}></label></div>
    <button class="btn ghost" id="test">Пройти тест уровня</button>
    <button class="btn ghost danger-text" id="reset">Сбросить весь прогресс</button>
    <p class="muted small center">Опыт: карточка и выбор +1, пары, буквы, письмо и фразы +2, диктант +3, урок дня +5.<br>Серия 🔥 растёт, когда за день набрана цель.</p>`);
  click('.seg button', e => {
    const b = e.currentTarget, key = b.parentElement.dataset.key, raw = b.dataset.v;
    S[key] = isNaN(raw) ? raw : +raw;
    save(); haptic('light'); sfx.tap();
    if (key === 'rate') speak('This is how fast I speak.');
    render();
  });
  const sel = $('#voice');
  if (sel) sel.addEventListener('change', () => { S.voice = sel.value; save(); speak('Hello! This is my voice.'); });
  click('#testv', () => speak("Hello! Let's learn some English today."));
  const sw = $('#say'); if (sw) sw.addEventListener('change', () => { S.autoSay = sw.checked; save(); });
  const sn = $('#snd'); sn.addEventListener('change', () => { S.sound = sn.checked; save(); sfx.ok(); });
  click('#test', () => go('placement'));
  click('#reset', () => confirmDlg('Точно сбросить весь прогресс? Это нельзя отменить.', () => { S = fresh(); save(); resetTo('welcome'); }));
};

/* ================= Старт ================= */
stack.push({ name: S.level ? 'home' : 'welcome' });
render();
cloudLoad();
