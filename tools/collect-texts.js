// Собирает все тексты, которые озвучивает приложение, в tools/texts.json
// и пишет audio/manifest.js со списком ключей. Запуск: node tools/collect-texts.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const ctx = {};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root, 'data.js'), 'utf8') + ';this.DATA = DATA;', ctx);
const DATA = ctx.DATA;

// Те же функции, что и в app.js
const audioKey = s => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); } return (h >>> 0).toString(36); };
const verbSay = v => `${v.base}, ${v.v2.replace('/', ' or ')}, ${v.v3.replace('/', ' or ')}`;
const plainFill = (text, opt) => { const parts = opt.split(' / '); let k = 0; return text.replace(/___/g, () => parts[Math.min(k++, parts.length - 1)]); };
const VOICE_SAMPLE = "Hello! Let's learn some English today.";

const texts = new Set([VOICE_SAMPLE]);
for (const lv of Object.keys(DATA.words)) {
  for (const line of DATA.words[lv].trim().split('\n')) {
    const [en, , ex] = line.split('|').map(s => s && s.trim());
    if (en) texts.add(en);
    if (ex) texts.add(ex);
  }
}
for (const line of DATA.verbs.trim().split('\n')) {
  const [base, v2, v3] = line.split('|').map(s => s.trim());
  texts.add(base);
  texts.add(verbSay({ base, v2, v3 }));
}
for (const lv of Object.keys(DATA.phrases)) for (const line of DATA.phrases[lv].trim().split('\n')) texts.add(line.split('|')[0].trim());
for (const d of DATA.dialogs) for (const l of d.lines) texts.add(l[0] === 'them' ? l[1] : l[1][0]);
for (const t of DATA.grammar) for (const [text, opts, a] of t.qs) texts.add(plainFill(text, opts[a]).replace(/^.*→\s*/, ''));

const out = {};
for (const t of texts) {
  const k = audioKey(t);
  if (out[k] && out[k] !== t) throw new Error(`Коллизия ключа ${k}: "${out[k]}" / "${t}"`);
  out[k] = t;
}
fs.writeFileSync(path.join(__dirname, 'texts.json'), JSON.stringify(out, null, 1));
fs.mkdirSync(path.join(root, 'audio'), { recursive: true });
fs.writeFileSync(path.join(root, 'audio', 'manifest.js'), `// Сгенерировано tools/collect-texts.js\nconst AUDIO_KEYS = new Set(${JSON.stringify(Object.keys(out).join(' '))}.split(' '));\n`);
console.log(`Текстов: ${Object.keys(out).length}`);
