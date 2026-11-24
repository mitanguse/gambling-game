/* game.js —— 引擎：状态、年份循环、事件、结局、传承 */

const MAX_YEAR = 78;

let S = null;
let pendingEvent = null;
let selectedFamily = null;
let G = null;                      // 家族：{surname, gen, prestige, chronicle[]}
let lastScene = { title: '', body: '' };

const SAVE_KEY = 'fusheng_save_v2';
const CHRON_KEY = 'fusheng_chronicle_v2';

function saveGame() {
  if (!S || S.over) return;
  try { localStorage.setItem(SAVE_KEY, JSON.stringify({ v: 2, S, G, scene: lastScene })); } catch (e) { }
}
function clearSave() { try { localStorage.removeItem(SAVE_KEY); } catch (e) { } }
function readSave() { try { return JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); } catch (e) { return null; } }
function saveChron() { try { if (G) localStorage.setItem(CHRON_KEY, JSON.stringify(G)); } catch (e) { } }
function loadChron() { try { return JSON.parse(localStorage.getItem(CHRON_KEY) || 'null'); } catch (e) { return null; } }

function loadGame() {
  const d = readSave();
  if (!d || !d.S) return;
  S = d.S; G = d.G || null; lastScene = d.scene || { title: '', body: '' };
  // 旧存档迁移
  if (!S.living) S.living = { 衣: 0, 食: 0, 住: 0, 行: 0 };
  if (!S.household) S.household = '民户';
  if (typeof S.mourning !== 'number') S.mourning = 0;
  if (!S.skill) S.skill = { 医术: 0, 文名: 0, 吏干: 0 };
  if (!S.mil) S.mil = { merit: 0 };
  if (!S.office) S.office = { granted: false, power: 0 };
  if (!S.shops) S.shops = [];
  S.shop = (S.shops || []).length;
  if (!S.goods) S.goods = {};
  if (!S.market) S.market = { mi: 1, bu: 1, cha: 1, yao: 1, ci: 1, tie: 1, si: 1, yan: 1 };
  if (!S.era) S.era = { liaoxiang: 0, famine: 0, war: 0, purge: 0 };   // 时局计数器（旧存档补上）
  if (!S.histDone) S.histDone = {};
  if (typeof S.birthYear !== 'number') S.birthYear = 1612 - (S.age || 0);   // 旧存档：按原万历四十年出生推算
  if (typeof S.speed !== 'number') S.speed = 0;
  // 旧存档里重名的孩子，补一个区别字
  const seen = {};
  (S.children || []).forEach(c => {
    if (!seen[c.name]) { seen[c.name] = 1; return; }
    seen[c.name] += 1;
    let n = 2, base = c.name;
    while ((S.children || []).some(x => x.name === base + n)) n += 1;
    c.name = base + n;
  });
  pendingEvent = null;
  showScreen('play');
  scene(lastScene.title || `${S.age} 岁`, lastScene.body || '');
  render();
}

/* ---------- 工具 ---------- */
const clamp = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));
function rnd(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function addStat(k, v) {
  if (k === '名声') { S.fame = Math.max(0, Math.round(S.fame + v)); return; }
  if (!(k in S.stats)) S.stats[k] = 50;
  S.stats[k] = clamp(S.stats[k] + v);
}
function money(n) { S.money = Math.max(0, Math.round(S.money + n)); }
function log(text, cls) {
  S.log.unshift({ y: S.year, t: text, c: cls || '' });
  if (S.log.length > 80) S.log.pop();
}

/* ---------- 初始化 ---------- */
const SURNAMES = ['沈', '顾', '陆', '苏', '裴', '谢', '崔', '程', '晏', '周'];
const GIVEN_M = ['砚', '舟', 'recv', '珩', '澈', '筠', '蔺', '澈', '清'];
const GIVEN_F = ['令仪', '含章', '知微', '月娘', '素心', '静姝'];

function newLife(famId, heir) {
  pendingEvent = null;
  awaitingChoice = false;
  flowAfter = null;
  const fam = (famId && typeof famId === 'object') ? famId : (FAMILIES.find(f => f.id === famId) || FAMILIES[0]);
  const gender = Math.random() < 0.52 ? '男' : '女';
  const name = heir && heir.name ? heir.name : pick(SURNAMES) + (gender === '男' ? pick(['砚', '舟', '珩', '澈', '筠', '蔺', '清', '让']) : pick(GIVEN_F));

  S = {
    name, gender, family: fam.name, famId: fam.id,
    year: 0, age: heir ? 16 : 1,
    stats: Object.assign({}, fam.stats),
    health: 92,
    money: fam.money, land: fam.land, shop: fam.shop,
    shops: fam.shop ? [{ id: 'chouduan' }] : [],
    goods: {},
    market: { mi: 1, bu: 1, cha: 1, yao: 1, ci: 1, tie: 1, si: 1, yan: 1 },
    era: { liaoxiang: 0, famine: 0, war: 0, purge: 0 },   // 时局：辽饷／旱蝗／兵荒／党锢
    birthYear: 1368 + Math.floor(Math.random() * 269),    // 随机生在明朝：洪武元年——崇祯九年
    histDone: {},                                        // 朝局年表已遇过的事件
    speed: 0,                                            // 自动播放速度档位
    fame: fam.fame,
    rank: 0,                     // 0 白身 … 4 进士
    office: { granted: false, power: 0 },
    flags: fam.flags.slice(),
    trade: 'none',
    origin: fam.id,
    originName: fam.name,
    stipend: fam.stipend || 0,
    officialRank: fam.officialRank || 0,
    officialStyle: fam.officialStyle || '',
    imperialRank: fam.imperialRank || '',
    household: fam.id === 'jiang' ? '匠户' : fam.id === 'shang' ? '商户' : fam.id === 'jun' ? '军户' : '民户',
    mourning: 0,
    living: { 衣: 0, 食: 0, 住: 0, 行: 0 },
    skill: { 医术: 0, 文名: 0, 吏干: 0, 农艺: 0, 匠艺: 0, 商道: 0, 讼笔: 0, 幕才: 0, 卜术: 0, 清修: 0, 唱功: 0, 镖艺: 0, 茶道: 0, 丹青: 0 },
    mil: { merit: 0 },
    spouse: null,
    children: [],
    friends: 0,
    parents: { alive: true, age: 30, favor: 55 },
    gender: Math.random() < 0.5 ? '男' : '女',
    ap: 12, apMax: 12,
    careerPicked: false,
    careerPicked6: false, careerPicked14: false, careerLocked: false,
    path: '', careerYears: 0,
    log: [],
    over: false
  };

  if (heir) {
    S.money = heir.money; S.land = heir.land;
    S.shops = (heir.shops || []).slice();
    S.shop = S.shops.length;
    S.goods = Object.assign({}, heir.goods || {});
    S.fame = heir.fame; S.rank = heir.rank; S.flags = heir.flags.slice();
    S.office = { granted: heir.granted, power: heir.power };
    S.trade = heir.trade || 'none';
    S.careerPicked = S.trade !== 'none';
    if (heir.household) S.household = heir.household;
    if (heir.origin) { S.origin = heir.origin; }
    S.skill = Object.assign({ 医术: 0, 文名: 0, 吏干: 0 }, heir.skill || {});
    S.mil = { merit: heir.merit || 0 };
    if (heir.living) {
      S.living = Object.assign({ 衣: 0, 食: 0, 住: 0, 行: 0 }, heir.living);
      ['衣', '食', '住', '行'].forEach(k => { S.living[k] = Math.min(S.living[k], capOf(S, k)); });
    }
    S.stats.才智 = clamp(Math.round((S.stats.才智 + heir.wit) / 2));
    S.log.push({ y: 0, t: `你继承了${heir.from}的家业。`, c: 'up' });
  } else {
    const old = loadChron();
    if (old && old.chronicle && old.chronicle.length) {
      try {
        const arch = JSON.parse(localStorage.getItem('fusheng_archive') || '[]');
        arch.push({ surname: old.surname, gen: old.gen, prestige: old.prestige, last: old.chronicle[old.chronicle.length - 1] });
        localStorage.setItem('fusheng_archive', JSON.stringify(arch.slice(-6)));
      } catch (e) { }
    }
    G = { surname: name.charAt(0), gen: 1, prestige: 0, chronicle: [] };
    if (fam.skill) S.skill = Object.assign(S.skill, fam.skill);
    S.log.push({ y: 0, t: fam.start, c: '' });
  }
}

/* ---------- 主流程 ---------- */
function startGame() {
  if (!selectedFamily) return;
  newLife(selectedFamily, null);
  showScreen('play');
  scene('开卷', `你生于${S.family}。父亲给你取名「${S.name}」。\n这一年，你${S.age}岁。`);
  render();
}

function scene(title, body) {
  lastScene = { title, body };
  document.getElementById('scene-text').innerHTML =
    `<p><b>${title}</b></p><p>${body.replace(/\n/g, '</p><p>')}</p>`;
  // 反应区在行动按钮上方，每次输出后自动滚回去，免得玩家往上划
  const el = document.getElementById('scene-text');
  if (el && el.getBoundingClientRect().top < 0) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

let tlMarksBuilt = false;

function render() {
  if (S.money < 0) S.money = 0;   // 家资不显负数（事件里可能直接扣钱）
  const rn = S.rank >= 4 ? (S.office.granted ? officeName() : '进士') : RANK_NAMES[S.rank];
  document.getElementById('hud-name').textContent = S.name;
  document.getElementById('hud-age').textContent = `${S.age} 岁`;
  document.getElementById('hud-era').textContent = reignOf((S.birthYear || 1590) + S.age);

  // 时间流逝条
  const tlFill = document.getElementById('tl-fill');
  if (tlFill) {
    const SPAN = 80;
    tlFill.style.width = Math.min(100, Math.round((S.age / SPAN) * 100)) + '%';
    const marksEl = document.getElementById('tl-marks');
    if (marksEl && !tlMarksBuilt) {
      marksEl.innerHTML = MILESTONES.map(a => `<i class="mile" style="left:${(a / SPAN) * 100}%"></i>`).join('') +
        [10, 20, 40, 60, 75].map(a => `<i style="left:${(a / SPAN) * 100}%"></i>`).join('');
      tlMarksBuilt = true;
    }
    const yEl = document.getElementById('tl-year'), aEl = document.getElementById('tl-age'), eEl = document.getElementById('tl-end');
    if (yEl) yEl.textContent = reignOf((S.birthYear || 1590) + S.age);
    if (aEl) aEl.textContent = `${S.age} 岁`;
    if (eEl) eEl.textContent = S.over ? '此生已尽' : '寿数八十';
  }
  document.getElementById('hud-rank').textContent = rn;
  document.getElementById('hud-money').textContent = `家资 ${S.money} 贯`;
  document.getElementById('hud-health').textContent = `气血 ${S.health}`;
  const apEl = document.getElementById('hud-ap');
  if (apEl) apEl.textContent = `重心 ${S.focus || '未定'}`;
  const gEl = document.getElementById('hud-gender');
  if (gEl) gEl.textContent = `身 ${S.gender || '男'}`;
  renderTrade();

  // 属性
  const st = document.getElementById('stat-list');
  st.innerHTML = ['体魄', '才智', '德行', '容貌', '气运'].map(k => {
    const v = S.stats[k];
    const cls = v >= 70 ? 'g' : v <= 35 ? 'r' : '';
    return `<div class="stat"><div class="stat-top"><span>${k}</span><span>${v}</span></div>
      <div class="bar ${cls}"><i style="width:${v}%"></i></div></div>`;
  }).join('') + `<div class="stat"><div class="stat-top"><span>气血</span><span>${S.health}</span></div>
      <div class="bar ${S.health < 35 ? 'r' : 'y'}"><i style="width:${S.health}%"></i></div></div>`;

  const shopTypes = {};
  (S.shops || []).forEach(sh => { const d = shopDef(sh.id); const n = d ? d.name : '铺面'; shopTypes[n] = (shopTypes[n] || 0) + 1; });
  const shopText = Object.keys(shopTypes).length
    ? Object.keys(shopTypes).map(k => k + '×' + shopTypes[k]).join('、')
    : '无';
  const goodsText = GOODS.filter(g => (S.goods || {})[g.id] > 0)
    .map(g => `${g.name}${S.goods[g.id]}${g.unit}`).join('、') || '空';
  const rows = [
    ['家世', S.originName || '—'],
    ['营生', (TRADES[S.trade] || '无恒业') + (tradeTitle(S) ? ' · ' + tradeTitle(S) : '') +
      (S.flags.includes('宗' + S.trade) ? '（' + (tradeDef(S.trade) || {}).epithet + '）' : '')],
    ['户籍', S.household || '民户'],
    ['田产', S.land + ' 亩'], ['铺面', (S.shops || []).length + ' 间'],
    ['铺设', shopText],
    ['仓中', goodsText],
    ['风尚', (S.fashion ? S.fashion.name : '朴素') + (S.garden ? ' · 有园' : '') + (S.furniture ? ' · 硬木家具' : '') + (S.guild ? ' · 入行会' : '')],
    ['名声', S.fame], ['功名', rn], ['政绩', S.office.power], ['友人', S.friends + ' 人']
  ];
  if (S.trade === 'jun') rows.splice(1, 0, ['武职', milRank(S)], ['军功', S.mil.merit]);
  if (S.flags.includes('宗室')) rows.splice(1, 0, ['爵位', S.imperialRank || '宗室'], ['禄米', (S.stipend || 0) + ' 贯/年']);
  if (S.origin === 'guan') rows.splice(1, 0, ['父官', (S.officialRank || '?') + ' 品'], ['家风', S.officialStyle || '寻常']);
  if (S.skill.医术) rows.push(['医术', S.skill.医术]);
  if (S.skill.文名) rows.push(['文名', S.skill.文名]);
  if (S.skill.吏干) rows.push(['吏干', S.skill.吏干]);
  document.getElementById('estate-list').innerHTML = rows
    .map(([k, v]) => `<div><span>${k}</span><span>${v}</span></div>`).join('');

  // 身份与优免
  const priv = PRIVILEGES.filter(p => p.rank <= S.rank).pop() || PRIVILEGES[0];
  const plist = document.getElementById('privilege-list');
  plist.innerHTML =
    `<div><span>${priv.name}</span><span>${S.mourning > 0 ? '丁忧守制' : '在籍'}</span></div>` +
    priv.items.map(t => `<div style="border:none;color:#4a4034;font-size:12px">· ${t}</div>`).join('') +
    `<div style="border:none;margin-top:6px">用度：${['衣', '食', '住', '行'].map(k => LIVING[k].levels[S.living[k]]).join('／')}</div>` +
    `<div style="border:none;color:#4a4034;font-size:12px">上限：${['衣', '食', '住', '行'].map(k => LIVING[k].levels[capOf(S, k)]).join('／')}</div>`;

  const fam = [];
  fam.push(['父亲/母亲', S.parents.alive ? `在世（${S.parents.age}）· 亲心 ${Math.round(S.parents.favor || 0)}` : '已故']);
  if (S.spouse) fam.push(['配偶', `${S.spouse.name}（${S.spouse.age || '?'} 岁 · 才德 ${S.spouse.quality}）`]);
  S.children.forEach(c => fam.push([c.name, `${c.age} 岁 · 才学 ${c.wit}`]));
  document.getElementById('family-list').innerHTML = fam.map(([k, v]) => `<div><span>${k}</span><span>${v}</span></div>`).join('');

  document.getElementById('log').innerHTML = S.log.slice(0, 24).map(l =>
    `<li class="${l.c}"><span class="yr">${l.y}岁</span>${l.t}</li>`).join('');

  renderActions();
  scrollToStage();
  saveGame();
}

function scrollToStage() {
  const el = document.querySelector('.stage');
  if (!el) return;
  const y = Math.max(0, Math.round(el.getBoundingClientRect().top + window.scrollY) - 8);
  setTimeout(() => {
    window.scrollTo({ top: y, behavior: 'auto' });
    if (Math.abs(window.scrollY - y) > 4) el.scrollIntoView({ block: 'start' });
  }, 0);
}

function officeName() {
  let name = '未授官';
  OFFICE_RANKS.forEach(r => { if (S.office.power >= r.at) name = r.name; });
  return name === '未授官' ? '候补' : name;
}

const ACTION_GROUPS = [
  { name: '读书仕途', icon: '读', blurb: '苦读、赴考、为官、刻书', ids: ['study', 'exam', 'office', 'publish', 'monitor', 'yinguan'] },
  { name: '营生', icon: '营', blurb: '农工商医与各门师承', ids: ['farm', 'work', 'chores', 'trade', 'craft', 'learn_med', 'practice_med', 'teach_school', 'clerk', 'army', 'quit_trade', 'guild'], prefix: ['join_', 'work_'] },
  { name: '家事', icon: '家', blurb: '说亲、教子、请医', ids: ['marry', 'teach', 'heal'] },
  { name: '人际', icon: '人', blurb: '侍奉父母、交游宴客', ids: ['piety', 'ask_money', 'social', 'fun_jiu', 'travel'] },
  { name: '家业', icon: '业', blurb: '置田、开店、造园', ids: ['land', 'garden', 'furniture', 'bridge'], prefix: ['open_'] },
  { name: '商店', icon: '市', blurb: '买卖、药铺、当铺、医馆', ids: ['clinic', 'pawn_sell', 'fun_yao'], prefix: ['trade_'] },
  { name: '用度', icon: '用', blurb: '衣、食、住、行', ids: ['living_衣', 'living_食', 'living_住', 'living_行'] },
  { name: '消遣', icon: '乐', blurb: '听书、花楼、书坊', ids: ['fun_cha', 'fun_lou', 'fun_shu', 'fun_xiang'] }
];

function groupOf(a) {
  return ACTION_GROUPS.find(g => g.ids.includes(a.id) || (g.prefix || []).some(p => a.id.startsWith(p)));
}

/* ---------- 精力：一年十二分，四季各三分 ---------- */
const ACTION_AP = {
  study: 3, farm: 4, work: 4, chores: 3, trade: 3, exam: 2, office: 4, marry: 2,
  clinic: 1, heal: 1, piety: 2, teach: 2, land: 1, travel: 6, learn_med: 3,
  practice_med: 4, teach_school: 4, clerk: 4, army: 4, craft: 4, quit_trade: 1,
  'living_衣': 1, 'living_食': 1, 'living_住': 1, 'living_行': 1,
  garden: 2, furniture: 1, guild: 1, publish: 2, monitor: 1, bridge: 2,
  pawn_sell: 1, ask_money: 1, social: 1, yinguan: 2
};

function apCost(a) {
  if (ACTION_AP[a.id] !== undefined) return ACTION_AP[a.id];
  if (a.id.startsWith('open_')) return 2;
  if (a.id.startsWith('join_')) return 3;
  if (a.id.startsWith('work_')) return 3;
  if (a.id.startsWith('trade_')) return 1;
  if (a.id.startsWith('fun_')) return 1;
  return 2;
}

function seasonOf(ap) {
  if (ap >= 10) return '春';
  if (ap >= 7) return '夏';
  if (ap >= 4) return '秋';
  return '冬';
}

/* ---------- 职业进度与年入 ---------- */
function tradeIncome(S) {
  const tbl = TRADE_INCOME[S.trade];
  if (!tbl) return 0;
  const lv = Math.max(0, tradeLevel(S));
  const base = tbl[Math.min(tbl.length - 1, lv)] || 0;
  const senior = 1 + Math.min(0.5, (S.careerYears || 0) * 0.04);   // 做久了手熟，年年多挣一点
  return Math.round(base * senior);
}

function renderTrade() {
  const box = document.getElementById('trade-box');
  if (!box) return;
  const d = tradeDef(S.trade);
  if (!d) {
    box.innerHTML = '<div class="trade-meta">尚无恒业。去「营生」寻一门手艺。</div>';
    return;
  }
  const lv = Math.max(0, tradeLevel(S));
  const steps = d.skill === '军功' ? MIL_STEPS : TRADE_STEPS;
  const v = d.skill === '军功' ? S.mil.merit : Math.round(sk(S, d.skill));
  const nextText = lv >= 4 ? '已至化境' : `再积 ${Math.max(1, steps[lv + 1] - v)} 点到「${d.ranks[lv + 1]}」`;
  box.innerHTML =
    `<div class="trade-row"><span>${d.name}</span><span class="trade-lv">${d.ranks[lv]}</span></div>` +
    `<div class="bar y"><i style="width:${Math.min(100, v)}%"></i></div>` +
    `<div class="trade-meta">${d.skill} ${v}${d.skill === '军功' ? '' : '/100'} · 年入约 ${tradeIncome(S)} 贯 · 资历 ${S.careerYears || 0} 年</div>` +
    `<div class="trade-meta">${nextText}</div>` +
    `<div class="trade-meta">${['尚无门路', '可收徒授艺', '可自立门户', '可挂字号', '一方宗师'][lv] || ''}</div>`;
}

function actionState(a) {
  const zx = zuXunBlocked(S, a.id) || ageBlocked(S, a.id) || a.req(S);
  if (zx !== true) return zx;
  if (S.ap < apCost(a)) return '本年已安排妥当，明年再说';
  return true;
}

function actionButton(a) {
  const ok = actionState(a);
  const nm = a.nameOf ? a.nameOf(S) : a.name;
  const ds = a.descOf ? a.descOf(S) : a.desc;
  const btn = document.createElement('button');
  btn.className = 'act';
  btn.innerHTML = `${nm}<small>${ok === true ? ds : ok}</small>`;
  btn.disabled = ok !== true;
  btn.onclick = () => doAction(a);
  return btn;
}

/* ---------- 年度重心：仿《八十亿分之一》——不摆精力，只选今年往哪走 ---------- */
const FOCUS = [
  { name: '读书', icon: '读', blurb: '苦读、课业、文章', ids: ['study', 'monitor'] },
  { name: '营生', icon: '营', blurb: '种地、做工、本行手艺', ids: ['farm', 'work', 'chores', 'trade', 'craft', 'learn_med', 'practice_med', 'teach_school', 'clerk', 'army'], prefix: ['work_'] },
  { name: '家事', icon: '家', blurb: '侍亲、教子、养病', ids: ['piety', 'teach', 'heal'] },
  { name: '交际', icon: '人', blurb: '交游、宴客、远行', ids: ['social', 'fun_jiu', 'travel'] }
];

function inFocus(a, f) {
  return f.ids.includes(a.id) || (f.prefix || []).some(p => a.id.startsWith(p));
}

function focusYear(name) {
  if (S.over || pendingEvent) return;
  if (awaitingChoice) return;                              // 正有一桩事没办完
  document.getElementById('choices').innerHTML = '';       // 残留的旧按钮，清掉再走
  const f = FOCUS.find(x => x.name === name);
  if (!f) return;
  const lines = [];
  let n = 0, flow = null;
  for (let i = 0; i < 14 && S.ap > 0; i++) {
    const cands = ACTIONS.filter(a => inFocus(a, f) && actionState(a) === true);
    if (!cands.length) break;
    cands.sort((x, y) => apCost(x) - apCost(y));   // 先做轻的，尽量多做事
    const a = cands[0];
    S.ap -= apCost(a);
    const res = a.run(S) || {};
    (res.lines || []).forEach(l => lines.push(l));
    n++;
    if (res.flow) { flow = res.flow; break; }
  }
  S.focus = name;
  log(`本年以「${name}」为重心，做了 ${n} 件事。`, n ? 'up' : '');
  lines.forEach(l => log(l, ''));
  scene(`${S.age} 岁 · ${name}`, lines.length ? lines.join('\n') : '这一年没做成什么，日子空过去了。');
  S.health = clamp(S.health);
  if (S.health <= 0) return die('积劳成疾，油尽灯枯');
  if (flow) return startFlow(flow);
  endYear();
}

/* ---------- 主界面：四扇重心 + 细务 ---------- */
function renderActions() {
  if (S.money < 0) S.money = 0;
  const grid = document.getElementById('action-grid');
  if (!grid) return;
  grid.innerHTML = '';

  FOCUS.forEach(f => {
    const items = ACTIONS.filter(a => inFocus(a, f));
    const avail = items.filter(a => actionState(a) === true).length;
    const card = document.createElement('button');
    card.className = 'act-card' + (avail ? '' : ' none');
    card.innerHTML = `<span class="seal">${f.icon}</span><span class="nm">${f.name}</span>` +
      `<span class="bl">${f.blurb}</span><span class="n">${avail ? avail + ' 可做' : '本年做不得'}</span>`;
    card.onclick = () => focusYear(f.name);
    grid.appendChild(card);
  });

  const more = document.createElement('button');
  more.className = 'act-card';
  more.innerHTML = '<span class="seal">细</span><span class="nm">细务</span>' +
    '<span class="bl">置田、开店、婚配、赴考</span><span class="n">自己挑</span>';
  more.onclick = () => openCategory('细务');
  grid.appendChild(more);

  if (document.getElementById('cat-modal').hidden === false) refreshCategory();

  if (!pendingEvent && !awaitingChoice) {
    document.getElementById('choices').innerHTML = '';
  }

  const endBtn = document.getElementById('btn-end-year');
  if (endBtn) {
    endBtn.hidden = false;
    endBtn.textContent = '虚度一年 · 直接过';
    endBtn.classList.remove('urgent');
  }
  const autoBtn = document.getElementById('btn-auto');
  if (autoBtn) {
    autoBtn.textContent = S.auto ? '暂停' : '自动播放';
    autoBtn.classList.toggle('on', !!S.auto);
  }
  const spBtn = document.getElementById('btn-speed');
  if (spBtn) spBtn.textContent = `${SPEEDS[S.speed || 0]}×`;
}

/* ---------- 二级界面 ---------- */
let curCat = null;

function openCategory(name) {
  curCat = name;
  const modal = document.getElementById('cat-modal');
  document.getElementById('cat-title').textContent = name;
  fillCategory();
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  const sheet = modal.querySelector('.cat-sheet');
  if (sheet) sheet.scrollTop = 0;
}

function closeCategory() {
  const modal = document.getElementById('cat-modal');
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  document.body.style.overflow = '';
  curCat = null;
}

function fillCategory() {
  if (!curCat) return;
  const box = document.getElementById('cat-actions');
  box.innerHTML = '';
  const items = ACTIONS.filter(a => {
    if (S.careerLocked && isEntryAction(a) && entryTradeOf(a) !== S.trade) return false;
    if (curCat === '细务') return true;
    return (groupOf(a) || {}).name === curCat;
  });
  const avail = items.filter(a => actionState(a) === true).length;
  document.getElementById('cat-sub').textContent = `${avail}/${items.length} 可做`;
  if (!items.length) {
    box.innerHTML = '<p class="muted">此处暂无可用之事。</p>';
    return;
  }
  items.forEach(a => box.appendChild(actionButton(a)));
  const miss = items.length - avail;
  document.getElementById('cat-foot').textContent = miss
    ? `${miss} 件暂时做不得，缘由写在按钮下方。`
    : '皆可为之。';
}

function refreshCategory() { if (curCat) fillCategory(); }

/* 返回 / Esc / 点遮罩关闭 */
document.addEventListener('click', e => {
  if (e.target && (e.target.id === 'cat-back' || e.target.id === 'cat-mask')) closeCategory();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeCategory();
});

function doAction(a) {
  if (S.over || pendingEvent) return;
  closeCategory();
  if (document.querySelector('#choices .choice')) return;   // 有分步流程未完成
  if (zuXunBlocked(S, a.id)) return;
  const ab = ageBlocked(S, a.id);
  if (ab) return;
  const cost = apCost(a);
  if (S.ap < cost) {
    scene('本年已满', `这一年已经安排满了，这件事做不了。\n要么明年再做，要么今年把重心放在别处。`);
    return;
  }
  S.ap -= cost;
  const res = a.run(S) || {};
  (res.lines || []).forEach(l => log(l, res.cls || ''));
  scene(a.name, (res.lines || ['无']).join('\n'));
  if (res.flow) { startFlow(res.flow); return; }
  afterAction();
}

/* ---------- 分步流程（说亲、分娩、丧礼） ---------- */
let flowAfter = null;
let awaitingChoice = false;      // 真有选择挂在屏幕上，等价于旧版的 DOM 检查

function askStep(title, text, options, after) {
  flowAfter = after || null;
  awaitingChoice = true;
  const box = document.getElementById('choices');
  box.innerHTML = '';
  document.getElementById('scene-text').innerHTML = `<p><b>${title}</b></p><p>${text}</p><p class="muted">如何处置？</p>`;
  scrollToStage();
  options.forEach(o => {
    const b = document.createElement('button');
    b.className = 'choice';
    b.textContent = o.label;
    if (o.disabled) b.disabled = true;
    b.onclick = () => {
      if (o.disabled) return;
      const res = o.run ? o.run() : null;
      awaitingChoice = false;
      if (res && res.lines) { res.lines.forEach(l => log(l, res.cls || '')); scene(title, res.lines.join('\n')); }
      box.innerHTML = '';                                   // 选完就清掉，不留残影
      const f = flowAfter; flowAfter = null;
      if (f) f();
    };
    box.appendChild(b);
  });
}

function startFlow(name) {
  if (name === 'marry') return marriageFlow();
}

/* ---------- 婚姻：说媒 → 相看 → 合八字 → 下聘 → 成亲 ---------- */
function makeCandidates(S) {
  const wantWife = S.gender !== '女';
  const fams = wantWife
    ? ['城南王掌柜家', '县学李教谕家', '东乡张农户家', '城中陈绸缎庄', '落第秀才周家', '城北刘屠户家']
    : ['城南王秀才家', '县学李教谕家', '东乡张农户家', '城中陈绸缎庄', '城北刘屠户家', '本县周主簿家'];
  const names = wantWife
    ? ['王氏', '李氏', '张氏', '陈氏', '周氏', '刘氏']
    : ['王生', '李生', '张生', '陈生', '刘生', '周生'];
  const list = [];
  for (let i = 0; i < 3; i++) {
    const idx = rnd(0, fams.length - 1);
    const q = clamp(rnd(30, 80) + Math.floor(S.fame / 12));
    list.push({
      name: names[idx], surname: names[idx].charAt(0), family: fams[idx],
      age: rnd(15, 21),
      look: clamp(q + rnd(-12, 12)),
      virtue: clamp(q + rnd(-12, 12)),
      price: Math.max(4, Math.round(5 + q * 0.3 + S.fame * 0.2))
    });
  }
  return list;
}

function marriageFlow() {
  const isW = S.gender === '女';
  const word = isW ? '嫁妆' : '聘礼';
  const cs = makeCandidates(S);
  S._cand = null;
  const opts = cs.map(c => ({
    label: `${c.family}·${c.name}｜年 ${c.age}｜容貌 ${c.look}｜才德 ${c.virtue}｜${word}约 ${c.price} 贯`,
    disabled: S.money < c.price,
    run: () => {
      S._cand = c;
      log(isW ? `媒婆引你去庙里相看，隔着人群见了${c.name}一面。` : `你随媒婆去${c.family}相看，见了${c.name}。`);
    }
  }));
  opts.push({ label: '都不中意，先不提亲', run: () => { S._cand = null; } });
  const cheapest = Math.min.apply(null, cs.map(c => c.price));
  if (!isW && S.money < cheapest) {
    opts.push({ label: '聘礼凑不出，只能入赘他家', run: () => { S._cand = cs[0]; S._ruzhui = true; } });
  }
  if (isW && S.money < cheapest) {
    opts.push({ label: '嫁妆凑不出，空手过门（名声 -3）', run: () => { S._cand = cs[0]; S._bare = true; } });
  }
  askStep('说媒', isW
    ? '媒婆递上三家庚帖，说这三家门第都还过得去。你问清了年岁、人品，还有要备的嫁妆。'
    : '媒婆递上三家庚帖，挨个说了一遍好话。你问清了门第、年岁与聘礼。', opts, () => {
    if (!S._cand) { log('你把庚帖退了回去，说再看看。'); return afterAction(); }
    if (S._ruzhui) {
      S._ruzhui = false;
      const c = S._cand;
      S.spouse = { name: c.name, surname: c.surname, quality: Math.max(25, Math.round((c.look + c.virtue) / 2) - 18), age: c.age, inLaw: true };
      addStat('名声', -3);
      S.flags.push('入赘');
      log(`你凑不出聘礼，只得入赘${c.family}。乡里背后议论，日子总算过起来了。`, 'down');
      S._cand = null;
      scene('入赘', '没有花轿，没有鼓乐，你挑着一担行李进了女家的门。');
      return afterAction();
    }
    if (S._bare) {
      S._bare = false;
      const c = S._cand;
      S.spouse = { name: c.name, surname: c.surname, quality: Math.round((c.look + c.virtue) / 2), age: c.age };
      addStat('名声', -3);
      log(`你空着手过了门，婆家脸色不大好看。`, 'down');
      S._cand = null;
      scene('过门', '一顶小轿，两个抬轿的，连吹鼓手都没有。');
      return afterAction();
    }
    baziStep();
  });
}

function baziStep() {
  const c = S._cand;
  const isW = S.gender === '女';
  const word = isW ? '嫁妆' : '聘礼';
  const roll = Math.random();
  const grade = roll < 0.35 ? '上婚' : roll < 0.75 ? '中婚' : '下婚';
  S._bazi = grade;
  S._extra = 0;
  const text = grade === '上婚'
    ? '合了八字，天作之合。两家大喜，都说这是祖上积德。'
    : grade === '中婚'
      ? '八字中平，不冲不克。两家说按例走就是。'
      : `八字相冲。${isW ? '男家' : '女家'}说这婚不敢结，除非多备 ${word}压一压。`;
  const opts = [];
  if (grade === '下婚') {
    opts.push({ label: `多备 10 贯压惊（共 ${c.price + 10} 贯）`, disabled: S.money < c.price + 10, run: () => { S._extra = 10; log(`你多备了十贯，${isW ? '男家' : '女家'}才点头。`); } });
    opts.push({ label: '不信这套，照旧成亲', run: () => { addStat('名声', -2); S.stats.气运 = clamp(S.stats.气运 - 2); log('你不信这些，照旧办了，乡里说你胆大。'); } });
    opts.push({ label: '这门亲事算了', run: () => { S._cand = null; } });
  } else {
    opts.push({ label: isW ? '择日过礼' : '择日纳征', run: () => { log(`你挑了个黄道吉日，送去了${word}。`); } });
  }
  askStep('合八字', text, opts, () => {
    if (!S._cand) return marriageFlow();
    weddingStep();
  });
}

function weddingStep() {
  const c = S._cand;
  const isW = S.gender === '女';
  const word = isW ? '嫁妆' : '聘礼';
  const total = c.price + (S._extra || 0);
  const opts = [
    { label: `按礼办事（${word} ${total} + 酒席 5 贯）`, disabled: S.money < total + 5, run: () => { money(-(total + 5)); addStat('名声', 6); } },
    { label: `从简（${word} ${total}，不摆酒）`, disabled: S.money < total, run: () => { money(-total); addStat('名声', 1); } }
  ];
  askStep('成亲', `择定了日子。${word} ${total} 贯，酒席另算。`, opts, () => {
    S.spouse = { name: c.name, surname: c.surname, quality: Math.round((c.look + c.virtue) / 2), age: c.age };
    log(isW ? `你出阁到${c.family}，红烛高照，母亲在门口哭了一场。` : `你迎娶了${c.family}的${c.name}，红烛高照，宾客盈门。`, 'up');
    S._cand = null;
    scene('成亲', isW ? '盖上盖头，上了花轿。锣鼓一路响到夫家门口。' : '一拜天地，二拜高堂，夫妻对拜。');
    afterAction();
  });
}

/* ---------- 分娩与坐月子 ---------- */
function birthFlow() {
  const opts = [
    { label: '请稳婆（3 贯）', disabled: S.money < 3, run: () => { money(-3); S._birthRisk = 0.10; } },
    { label: '稳婆再请一位郎中同来（8 贯）', disabled: S.money < 8, run: () => { money(-8); S._birthRisk = 0.03; } },
    { label: '自家料理，不请人', run: () => { S._birthRisk = 0.22; } }
  ];
  askStep('临盆', '内人腹痛发作，稳婆在屋里进进出出，说就在这一两日了。', opts, birthOutcome);
}

function birthOutcome() {
  const risk = (S._birthRisk === undefined) ? 0.15 : S._birthRisk;
  S._birthRisk = undefined;
  const bad = Math.random() < risk;
  const witBase = Math.round((S.stats.才智 + (S.spouse ? S.spouse.quality : 50)) / 2 + rnd(-8, 8));
  const surname = (S.gender === '女' ? ((S.spouse && S.spouse.surname) || '夫') : S.name.charAt(0));
  const pool = ['砚', '舟', '珩', '清', '瑾', '瑄', '恪', '慎', '和', '顺', '宁', '安'].concat(GIVEN_F || []);
  let cname = surname + pick(pool);
  let guard = 0;
  while (S.children.some(x => x.name === cname) && guard++ < 24) cname = surname + pick(pool);
  if (S.children.some(x => x.name === cname)) cname = cname + ['二', '三', '四', '五'][S.children.length % 4];
  const c = { name: cname, age: 0, wit: clamp(witBase, 10, 95) };
  if (bad) { c.wit = clamp(c.wit - 5, 5, 95); S.health = clamp(S.health - 6, 1, 100); log('生产不顺，母子都受了罪，好歹撑了过来。', 'down'); }
  S.children.push(c);
  log(`家中添丁，取名${c.name}。`, 'up');

  askStep('坐月子', `${c.name}落地。内人要做月子，鸡汤、米酒、红糖都要钱。`, [
    { label: '好生将养（2 贯）', disabled: S.money < 2, run: () => { money(-2); c.wit = clamp(c.wit + 3); addStat('名声', 1); } },
    { label: '将就着过（不花钱）', run: () => { c.wit = clamp(c.wit - 3, 5, 95); addStat('德行', -1); } }
  ], () => {
    scene('添丁', `${c.name}满月那天，亲戚都来看了。`);
    nextYear();
  });
}

function endYear() {
  if (S.over || pendingEvent) return;
  if (awaitingChoice) return;
  document.getElementById('choices').innerHTML = '';
  S.focus = '虚度';
  nextYear();
}

function afterAction() {
  S.health = clamp(S.health);
  checkMastery();
  if (S.health <= 0) return die('积劳成疾，油尽灯枯');
  render();
}

/* ---------- 关键抉择：非做不可的人生关口 ---------- */
function rollDecision() {
  S.decDone = S.decDone || {};
  const pool = DECISIONS.filter(d =>
    !S.decDone[d.id] && S.age >= d.age[0] && S.age <= d.age[1] && (!d.cond || d.cond(S) === true));
  if (!pool.length) return false;
  let d = pool.find(x => x.node) || null;
  if (!d && Math.random() < 0.22) {
    const total = pool.reduce((s, x) => s + (x.w || 1), 0);
    let r = Math.random() * total;
    for (const x of pool) { r -= (x.w || 1); if (r <= 0) { d = x; break; } }
    d = d || pool[0];
  }
  if (!d) return false;
  showDecision(d);
  return true;
}

function showDecision(d) {
  S.decDone[d.id] = 1;
  if (S.auto) stopAuto();
  const opts = d.choices.filter(c => !c.req || c.req(S) === true).map(c => ({
    label: c.label,
    run: () => ({ lines: (c.run(S) || []) })
  }));
  askStep('人生关口', d.text(S), opts, () => { render(); });
}

/* ---------- 自动播放：点了才自己跑完 ---------- */
let autoTimerId = null;
const SPEEDS = [0.5, 1, 2, 3];
const MILESTONES = [5, 15, 30, 50, 70];

function speedMs() { return Math.round(1100 / SPEEDS[S.speed || 0]); }

function cycleSpeed() {
  S.speed = ((S.speed || 0) + 1) % SPEEDS.length;
  if (S.auto) { clearInterval(autoTimerId); autoTimerId = setInterval(autoTick, speedMs()); }
  log(`自动播放速度：${SPEEDS[S.speed]} 倍。`, '');
  render();
}

/* 人生回望：五、十五、三十、五十、七十岁停一次 */
function showMilestone() {
  if (S.auto) stopAuto();
  const rn = S.rank >= 4 ? (S.office.granted ? officeName() : '进士') : RANK_NAMES[S.rank];
  const fam = 1 + (S.spouse ? 1 : 0) + S.children.length;
  const txt = [
    `家资 ${S.money} 贯，田 ${S.land} 亩，铺 ${(S.shops || []).length} 间。`,
    `功名 ${rn}，名声 ${S.fame}，营生 ${TRADES[S.trade] || '尚无恒业'}。`,
    `家口 ${fam} 人，气血 ${S.health}。`,
    S.era && S.era.liaoxiang ? '这些年辽饷一直摊在田上。' : '',
    S.era && S.era.famine ? '连年旱蝗，仓里一直没满过。' : ''
  ].filter(Boolean).join('\n');
  askStep(`${S.age} 岁 · 回望`, txt, [{ label: '接着往下走' }], () => { render(); });
}

function toggleAuto() {
  if (S.auto) { stopAuto('已停止自动播放。'); return; }
  S.auto = true;
  log('开始自动播放。遇随机事自行处置，遇人生关口停下等你。', 'up');
  render();
  autoTimerId = setInterval(autoTick, speedMs());
}

function stopAuto(msg) {
  S.auto = false;
  if (autoTimerId) { clearInterval(autoTimerId); autoTimerId = null; }
  if (msg) log(msg, '');
  render();
}

function autoTick() {
  if (!S.auto || S.over) { stopAuto(); return; }
  if (pendingEvent || awaitingChoice) return;   // 等玩家决断
  const f = FOCUS[Math.floor(Math.random() * FOCUS.length)];
  focusYear(f.name);
}

function rollEvent() {
  // 朝局年表：史有其事的大势，按绝对年份对（主角出生年随机）
  S.histDone = S.histDone || {};
  const absYear = (S.birthYear || 1580) + S.age;
  const hist = (typeof HIST_EVENTS !== 'undefined' ? HIST_EVENTS : []).filter(e => {
    const sp = e.span || [-1, -1];
    return absYear >= sp[0] && absYear <= sp[1] && !S.histDone[e.id] && (!e.cond || e.cond(S) === true);
  });
  if (hist.length) {
    const he = pick(hist);
    S.histDone[he.id] = 1;
    // 十岁以下：大事由家里承担，孩子只记得大人们发愁
    if (S.age < 10) {
      if (he.child) he.child(S);
      log(`家里说：${String(he.title || '').replace(/^(朝局|天时|鼎革) · /, '')}。大人们愁了好些天。`, 'down');
      return null;
    }
    return he;
  }
  // 幼年不遇外事
  if (S.age < 10) return null;
  // 岁令：先看当年时令之事
  if (Math.random() < 0.6) {
    const m = S.year % 12;
    const se = SEASON_EVENTS.filter(e => e.month === m && (!e.cond || e.cond(S)));
    if (se.length) return pick(se);
  }
  const pool = EVENTS.filter(e => e.cond(S));
  if (!pool.length) return null;
  if (Math.random() > 0.5) return null;   // 余下年份里再有一半概率遇事
  const total = pool.reduce((s, e) => s + e.w, 0);
  let r = Math.random() * total;
  for (const e of pool) { r -= e.w; if (r <= 0) return e; }
  return pool[0];
}

function showEvent(e) {
  pendingEvent = e;
  awaitingChoice = true;
  const box = document.getElementById('choices');
  box.innerHTML = '';
  e.choices.forEach((c, i) => {
    if (c.req && c.req(S) !== true) return;
    const b = document.createElement('button');
    b.className = 'choice';
    b.textContent = `${i + 1}. ${c.label}`;
    b.onclick = () => resolveEvent(c);
    box.appendChild(b);
  });
  document.getElementById('scene-text').innerHTML =
    `<p><b>${e.title || '这一年，出了件事'}</b></p><p>${e.text(S)}</p><p class="muted">如何应对？</p>`;
  if (S.auto) {
    setTimeout(() => {
      if (pendingEvent === e) {
        const c = e.choices.find(x => !x.req || x.req(S) === true);
        if (c) { log('（自动处置）', ''); resolveEvent(c); }
      }
    }, 900);
  }
}

function resolveEvent(c) {
  if (!pendingEvent) return;
  awaitingChoice = false;
  const lines = c.run(S) || [];
  lines.forEach(l => log(l, ''));
  pendingEvent = null;
  checkMastery();
  scene('后果', lines.join('\n') || '事情就这么过去了。');
  S.health = clamp(S.health);
  if (S.health <= 0) return die('伤病交加，药石无灵');
  render();
}

/* ---------- 年份推进 ---------- */
function nextYear() {
  if (S.pregnant) { S.pregnant = false; return birthFlow(); }
  S.year += 1;
  S.age += 1;
  S.parents.age += 1;

  if (!S.ap || S.ap > 12) S.ap = 12;
  S.ap = 12;

  // 田租
  const income = Math.round(S.land * 1.8);
  if (income) money(income);

  // 行当月例：有恒业者，一年到头总有进项
  if (S.trade !== 'none') {
    S.careerYears = (S.careerYears || 0) + 1;
    const ti = tradeIncome(S);
    if (ti > 0) {
      const inc = Math.max(1, Math.round(ti * (0.85 + Math.random() * 0.3)));
      money(inc);
      log(`行当月例：本年进项 ${inc} 贯（${tradeTitle(S)}）。`, 'up');
    }
  }

  // 铺面经营：各行当行情不同，也可能出事故
  let shopIncome = 0;
  (S.shops || []).forEach(sh => {
    const d = shopDef(sh.id);
    if (!d) return;
    let inc = d.income + (d.bonus ? d.bonus(S) : 0);
    inc = Math.max(0, Math.round(inc * (0.75 + Math.random() * 0.5)));
    if (Math.random() < 0.06) {
      const lost = Math.round(inc * 1.6);
      shopIncome -= lost;
      log(`${d.name}出了事故，折了 ${lost} 贯。`, 'down');
    } else {
      shopIncome += inc;
    }
    if (d.yearly) d.yearly(S);
  });
  if (shopIncome) money(shopIncome);

  // 行市：各货逐年浮动
  if (!S.market) S.market = {};
  GOODS.forEach(g => {
    let m = S.market[g.id] || 1;
    m *= 0.86 + Math.random() * 0.34;
    S.market[g.id] = Math.max(0.55, Math.min(2.2, Number(m.toFixed(3))));
  });

  // 家口开销（未成年的孩子由父母养，不单算这一份）
  const mouths = 1 + (S.spouse ? 1 : 0) + S.children.length + (S.parents.alive ? 2 : 0);
  const dependent = S.age < 16 && !S.spouse;
  if (!dependent) money(-Math.round(mouths * 0.6 + S.fame * 0.03 + (S.rank >= 4 ? 1 : 0)));

  // 自家日用：口粮、布、盐，先吃仓里的
  if (!S.goods) S.goods = {};
  if (!dependent && S.land < mouths && S.trade !== 'nong') {   // 自家种地的，口粮从收成里留
    let needRice = Math.ceil(mouths * 1.2);
    const useRice = Math.min(needRice, S.goods.mi || 0);
    S.goods.mi = (S.goods.mi || 0) - useRice;
    needRice -= useRice;
    if (needRice > 0) {
      const p = priceOf(S, GOODS.find(g => g.id === 'mi'));
      const cost = Math.round(needRice * p);
      if (S.money >= cost) { money(-cost); log(`仓中粮不够，按市价买了 ${needRice} 石。`, 'down'); }
      else { S.health -= 8; addStat('名声', -2); log('粮不够，钱也没有，一家人饿了半年。（可去商店买米）', 'down'); }
    }
  }

  // 布：两口人一匹，先取仓里的
  let needCloth = dependent ? 0 : Math.ceil(mouths / 2);
  const useCloth = Math.min(needCloth, S.goods.bu || 0);
  S.goods.bu = (S.goods.bu || 0) - useCloth;
  needCloth -= useCloth;
  if (needCloth > 0) {
    const cost = Math.round(2.6 * needCloth);
    if (S.money >= cost) money(-cost);
    else addStat('名声', -1);
  }

  // 盐：日用之物
  const needSalt = dependent ? 0 : (mouths >= 3 ? 0.4 : 0.2);
  if ((S.goods.yan || 0) >= needSalt) S.goods.yan = Number(((S.goods.yan || 0) - needSalt).toFixed(2));
  else if (S.money >= 2) money(-2);
  else addStat('体魄', -1);

  // 用度维持：体面是要花钱的，也是名声的来源
  const dec = decorum(S);
  const upkeep = Math.round(
    LIVING.衣.upkeep[S.living.衣] + LIVING.食.upkeep[S.living.食] +
    LIVING.住.upkeep[S.living.住] + LIVING.行.upkeep[S.living.行]);
  if (upkeep) money(-upkeep);
  if (dec > 0) addStat('名声', Math.floor(dec / 5));

  // 赋役（明制：田赋 + 均徳折银，功名优免）
  const landTax = Math.round(S.land * (0.25 + 0.05 * ((S.era && S.era.liaoxiang) || 0)));
  const hh = HOUSEHOLDS[S.household] || HOUSEHOLDS['民户'];
  let corvee = hh.corvee + hh.extra;
  if (S.age < 16) corvee = 0;            // 均德按丁征，未成年不当差
  if (S.rank >= 4 || S.office.granted) corvee = 0;
  else if (S.rank === 3) corvee = Math.max(0, corvee - 2);
  else if (S.rank === 2) corvee = Math.max(0, corvee - 1);
  if (S.flags.includes('方外')) corvee = 0;
  if (S.household === '商户') corvee += (S.shops || []).length * 1.2;

  // 风尚：每年一变，奢俭随世
  S.fashion = pick(FASHIONS);
  const dec0 = decorum(S);
  if (S.fashion.id === 'pu') { if (dec0 >= 3) addStat('名声', -1); }
  else if (dec0 >= 2) addStat('名声', S.fashion.fame);

  // 园林、家具、善名、行会
  if (S.garden) addStat('名声', 2);
  if (S.furniture) addStat('名声', 1);
  if (S.flags.includes('善名')) addStat('名声', 1);
  if (S.guild) money(2);

  // 家世余荫：族产贴补、宗室禄米、官宦家风
  if (S.origin === 'zong') money(2);
  if (S.flags.includes('宗室') && S.stipend) {
    let st = S.stipend;
    if (Math.random() < 0.25) { st = Math.round(st * 0.5); log('藩司拖欠禄米，今年只发了一半。', 'down'); }
    money(st);
  }
  if (S.origin === 'guan') {
    if (S.officialStyle === '清贫') addStat('名声', 1);
    else if (S.officialStyle === '贪墨') {
      money(4 + Math.round(10 - (S.officialRank || 5)));
      if (Math.random() < 0.08) {
        const lost = Math.round(Math.max(0, S.money) * 0.5);
        money(-lost); addStat('名声', -12); addStat('德行', -6);
        if (!S.flags.includes('污点')) S.flags.push('污点');
        log(`父亲任上事发，抄没家产，折了 ${lost} 贯，家门名声一落千丈。`, 'down');
      }
    }
  }
  money(-(landTax + Math.round(corvee)));
  const taxParts = [];
  if (landTax > 0) taxParts.push(`田赋 ${landTax} 贯`);
  if (Math.round(corvee) > 0) taxParts.push(`均徳折银 ${Math.round(corvee)} 贯`);
  if (taxParts.length) log(`纳税应役：${taxParts.join('，')}。`, 'down');

  // 廪米与俸禄
  if (S.rank === 2) money(1);
  if (S.office.granted) money(Math.max(1, 2 + Math.floor(S.office.power / 40) - (S.mourning > 0 ? 1 : 0)));

  // 丁忧守制
  if (S.mourning > 0) {
    S.mourning -= 1;
    if (S.mourning === 0) log('守制期满，你服阕出仕。', 'up');
  }

  // 气血随年龄
  let decay = 0;
  if (S.age > 45) decay = Math.round((S.age - 45) / 6) + 1;
  S.health = clamp(S.health - decay, 0, 100);
  if (S.parents.alive && S.parents.age > 62 && Math.random() < 0.12) {
    S.parents.alive = false;
    log('双亲相继谢世，你在灵前守了三夜。', 'down');
    addStat('德行', 2);
    if (S.office.granted) { S.mourning = 3; log('按制丁忧，你解任归里守制三年。', 'down'); }
  }

  // 疾病：年纪越大越容易得，得了不治会耗气血
  if (!S.illness) {
    const p = (S.age > 55 ? 0.10 : S.age > 40 ? 0.06 : 0.03) + (S.health < 40 ? 0.08 : 0);
    if (Math.random() < p) {
      const name = S.age > 55 ? pick(['中风', '痰疾', '筋骨病']) : pick(['风寒', '疟疾', '胃病']);
      S.illness = { name, level: S.age > 55 ? 2 : 1 };
      log(`你染了${name}，卧床数日。`, 'down');
    }
  } else {
    S.health = clamp(S.health - 3 * S.illness.level, 0, 100);
    if (Math.random() < 0.30) { log(`${S.illness.name}自己好了些。`, 'up'); S.illness = null; }
  }

  // 婚配人家生育
  if (S.spouse && !S.pregnant && S.age < 50 && S.spouse.age < 42 && S.children.length < 6 && Math.random() < 0.32) {
    S.pregnant = true;
    log('内人有喜。', 'up');
  }
  S.children.forEach(c => { c.age += 1; if (c.age < 16) c.wit = clamp(c.wit + rnd(0, 2)); });

  // 官职晋升
  if (S.office.granted) {
    const before = officeName();
    if (officeName() !== before) log(`朝廷有旨，你升任${officeName()}。`, 'up');
  }
  if (!S.office.granted && S.rank >= 4 && Math.random() < 0.5) {
    S.office.granted = true;
    log('吏部选官，你补了缺，从此有了官身。', 'up');
  }

  if (S.money < 0) S.money = 0;

  // 时局消退：旱蝗、兵荒会逐年缓解，辽饷则是长效机制
  if (S.era) {
    if (S.era.famine) S.era.famine = Math.max(0, S.era.famine - 1);
    if (S.era.war) S.era.war = Math.max(0, S.era.war - 1);
    if (S.era.purge) S.era.purge = Math.max(0, S.era.purge - 1);
  }

  // 衰老与死亡
  const deathRisk = S.age > 55 ? (S.age - 55) * 0.012 + Math.max(0, (40 - S.health) / 900) : Math.max(0, (25 - S.health) / 1400);
  if (S.health <= 0) return die('气血耗尽');
  if (S.age >= MAX_YEAR || Math.random() < deathRisk) return die(S.age >= 60 ? '寿终正寝' : '一病不起');

  // 新一年的开场（按年纪换说法，别让九岁的小孩在镜子里“又老了一岁”）
  scene(`${S.age} 岁`, openLine() + '\n' + estateLine());
  render();

  // 五、十五、三十、五十、七十：停下来回望一眼
  if (MILESTONES.includes(S.age) && !(S.mile || {})[S.age]) {
    S.mile = S.mile || {};
    S.mile[S.age] = 1;
    return showMilestone();
  }

  // 六岁：开蒙（读档进来的老角色跳过）
  if (S.age >= 6 && S.age < 14 && !S.careerPicked6) {
    S.careerPicked6 = true;
    return careerPick6();
  }

  // 十四岁：定业，此后别家的门不再敲
  if (S.age >= 14 && !S.careerPicked14) {
    S.careerPicked14 = true;
    return careerPick14();
  }

  // 职业事务：行当里总会出点事
  if (S.trade !== 'none' && !S.over && Math.random() < 0.55) {
    const ev = pick(TRADE_EVENTS[S.trade] || TRADE_EVENTS._any);
    if (ev) tradeEvent(ev);
    return;   // 行中事先处置，本年不再叠加别的
  }

  // 时间走到这里：先看有没有非过不可的关口，再掷一次随机事
  if (rollDecision()) return;
  const ev = rollEvent();
  if (ev) showEvent(ev);
}

/* 十四岁择业：把选择摆到面前，而不是埋在二级菜单里 */
/* 六岁开蒙：先定一个大方向（读书 / 家传手艺 / 下地 / 女红 / 帮佣） */
function careerPick6() {
  const famTrade = { jiang: 'jiang', shang: 'shang', geng: 'nong', chi: 'nong', nong: 'nong', jun: 'nong' }[S.origin] || '';
  const opts = [
    {
      label: '入蒙学读书（每年灯油 1 贯，才智长得快）',
      disabled: S.money < 2,
      run: () => {
        S.path = 'study';
        S.flags.push('开蒙');
        addStat('才智', 4);
        log('你进了村塾，先生先教你写自己的名字。', 'up');
      }
    },
    {
      label: famTrade === 'jiang' ? '跟着父亲学木匠（家传手艺）'
        : famTrade === 'shang' ? '跟着家里学算账做生意（家传行当）'
          : '跟着家里下地做活（家传本业）',
      run: () => {
        S.path = 'family';
        if (famTrade) { S.trade = famTrade; grow(S, (tradeDef(famTrade) || {}).skill || '农艺', 6); }
        log('六岁起你就跟着家里做活，手上的力气一点点长出来。', 'up');
      }
    },
    {
      label: '替人放牛、跑腿（每年挣几个铜板）',
      run: () => {
        S.path = 'labor';
        money(1); addStat('体魄', 2);
        log('你开始替邻里放牛、挑水，挣的钱交给母亲。', 'up');
      }
    }
  ];
  if (S.gender === '女') {
    opts.push({
      label: '跟着母亲学女红（绣活、针线）',
      run: () => {
        S.path = 'craft';
        S.trade = 'xiu';
        S.skill.绣艺 = Math.max(S.skill.绣艺 || 0, 6);
        log('你坐在窗下学着穿针，一天下来扎了七个眼。', 'up');
      }
    });
  }
  opts.push({ label: '先不入门，跟着家里混日子', run: () => { S.path = 'none'; log('你没定下学什么，日子还是照过。', ''); } });
  askStep('六岁 · 开蒙',
    '六岁这年，家里问你想学什么。\n这时候定的是大方向：读书、家传手艺，还是先做活挣钱。',
    opts, () => { render(); });
}

/* 入口动作 → 行当 */
const ENTRY_TRADE = { farm: 'nong', craft: 'jiang', trade: 'shang', learn_med: 'yi', clerk: 'li', army: 'jun' };
function isEntryAction(a) {
  if (ENTRY_TRADE[a.id]) return true;
  if (a.id.startsWith('join_')) return true;
  return false;
}
function entryTradeOf(a) {
  return ENTRY_TRADE[a.id] || a.id.replace('join_', '');
}

/* 十四岁定业：给全部行当挑一次，定了就不再改 */
function careerPick14() {
  const joins = ACTIONS.filter(a => isEntryAction(a));
  const genderOk = (a) => {
    const r = a.req(S);
    if (typeof r === 'string' && /只传女子|不收女眷|不收女徒|女眷不入|女子不得|女子不做/.test(r)) return false;
    return true;
  };
  const pool = joins.filter(genderOk);
  const open = pool.filter(a => a.req(S) === true && entryTradeOf(a) !== S.trade);
  const closed = pool.filter(a => a.req(S) !== true && entryTradeOf(a) !== S.trade);
  const picks = open.slice(0, 5).concat(closed.slice(0, 1));
  const opts = picks.map(a => {
    const ok = a.req(S);
    return {
      label: ok === true ? `${a.name}｜${a.desc}` : `${a.name}｜${ok}`,
      disabled: ok !== true,
      run: () => {
        const res = a.run(S) || {};
        (res.lines || []).forEach(l => log(l, res.cls || 'up'));
        S.careerLocked = true;
      }
    };
  });
  const keep = tradeDef(S.trade);
  opts.push({
    label: keep ? `守本业（继续做${keep.name}）` : '暂不定业，先做零活',
    run: () => {
      if (keep) { S.careerLocked = true; log(`你还是守着${keep.name}这一行。`, ''); }
      else { S.careerPicked14 = false; log('你没定下行业，家里说明年再说。', ''); }
    }
  });
  askStep('十四岁 · 定业',
    '十四岁这年，家里把话说开了：往后靠什么吃饭，得定下来了。\n定了一行，别家的门就不必再敲。',
    opts, () => { render(); });
}

/* 职业事务：三年一小变，选得不一样，进度不一样 */
function tradeEvent(ev) {
  const d = tradeDef(S.trade) || { name: '本行', skill: '农艺' };
  const text = String(ev.text).replace('{trade}', d.name || '本行');
  const opts = ev.opts.map(o => ({
    label: o.label,
    disabled: o.need ? S.money < o.need : false,
    run: () => {
      const e = o.eff || {};
      if (e.money) money(e.money);
      if (e.skill) grow(S, d.skill, e.skill);
      if (e.fame) addStat('名声', e.fame);
      if (e.health) S.health = clamp(S.health + e.health);
      if (e.wit) addStat('才智', e.wit);
      log(o.say, (e.money || 0) < 0 || (e.fame || 0) < 0 ? 'down' : 'up');
    }
  }));
  askStep('行中事 · ' + ev.t, text, opts, () => { render(); });
}

function openLine() {
  const a = S.age;
  const weak = S.health < 50;
  const poor = S.land === 0 && S.money < 3;
  const y = `天启 ${S.year + 1} 年，${seasonText()}。`;
  if (a <= 12) {
    return pick([
      y + '你又长高了一点，去年的衣裳短了一截。',
      y + (weak ? '你近来总是咳，母亲半夜起来给你添被。' : '你跑得比去年快，能追上巷口的野狗。'),
      y + '你跟着父亲下地，学会了看云识天气。',
      y + '私塾墙外你站了半晌，听里头念“子曰”。',
      y + (poor ? '锅里照旧是稀的，你把碗底的米粒拨给妹妹。' : '母亲给你添了一件新夹袄。'),
      '一年过去，你已经能帮家里做些轻活。',
      '巷子里的路你跑熟了，谁家灶上烧什么，你都知道。',
      y + '你在河边看人撑船，一看就是一下午。'
    ]);
  }
  if (a <= 19) {
    return pick([
      y,
      `又一年。${a} 岁的你，站在院中看了一会儿天。`,
      '镜子里的脸褪了稚气，眉眼渐渐定了。',
      y + (weak ? '你近来总觉得乏力，饭量也小了。' : '身板渐渐长开，穿的衣裳要重新做。'),
      y + '有人上门说起亲事，母亲笑着把人送走了。',
      '你开始觉得，日子不只是过，还得想。',
      y + (poor ? '你算了算家里的账，越算越睡不着。' : '家里的事，父亲已经开始问你的意思。')
    ]);
  }
  if (a <= 39) {
    return pick([
      y,
      `又一年过去了。${a} 岁的你，站在院中看了一会儿天。`,
      '春耕、夏汛、秋收、冬藏，一年又这么过去了。',
      y + (weak ? '这一年身子不大爽利，做事总提不起劲。' : '肩上的担子比去年重了些。'),
      y + '鬓角添了几根白的，你对着水缸看了半晌。',
      '孩子大了些，开蒙的束脩又涨了。',
      y + (poor ? '年底一算，进项刚够填上开销。' : '仓里的粮还够，你心里踏实了半分。')
    ]);
  }
  if (a <= 59) {
    return pick([
      y,
      `又一年。${a} 岁的你，眼角添了一道纹。`,
      '腰背开始发沉，蹲下去再站起来要缓一缓。',
      y + (weak ? '夜里睡不踏实，天亮得比从前早。' : '身子还算过得去，只是不如从前经折腾。'),
      y + '族里的小辈来问事，你说了半个时辰。',
      '你翻出旧年的账本，纸都发黄了。',
      y + '街上后生叫你一声“老叔”，你应了半天才回过神。'
    ]);
  }
  return pick([
    `镜中的人又老了一岁。${weak ? '近来总觉得气短。' : '身体还算康健。'}`,
    y + '你走得慢了些，拄杖的时候多了。',
    `又一年。${a} 岁的你，坐在门槛上晒太阳。`,
    y + (weak ? '这场风寒拖了半个月，人瘦了一圈。' : '饭还能吃两碗，只是牙口不如从前。'),
    y + '你把儿孙的名字一个个念过去，怕忘了。',
    '你常在夜里醒来，想起年轻时某个赶集的日子。'
  ]);
}

function estateLine() {
  const m = S.money, l = S.land;
  if (l === 0) return `家资 ${m} 贯，无寸土，靠租种与人情过活。`;
  if (S.rank >= 4) return `家资 ${m} 贯，田 ${l} 亩，名下田产已获优免。`;
  if (l >= 20) return `家资 ${m} 贯，田 ${l} 亩，算是一方殷实人家。`;
  return `家资 ${m} 贯，田 ${l} 亩。`;
}

function seasonText() {
  return pick(['春汛刚过', '暑气未消', '秋粮入仓', '大雪封门', '梅雨连绵']);
}

/* ---------- 结局 ---------- */
/* ---------- 行行出宗师 ---------- */
function checkMastery() {
  const d = tradeDef(S.trade);
  if (!d) return;
  const key = '宗' + S.trade;
  if (tradeLevel(S) >= 4 && !S.flags.includes(key)) {
    S.flags.push(key);
    addStat('名声', 20);
    log('你在这行已臻化境，同行当面称你一声「' + d.epithet + '」。', 'up');
  }
}

function score() {
  const e = S;
  return Math.round(
    Math.min(e.money, 800) * 0.6 +
    e.land * 18 +
    (e.shops || []).length * 30 +
    Math.round(Object.keys(e.goods || {}).reduce((s, id) => {
      const g = GOODS.find(x => x.id === id);
      return s + (g ? (e.goods[id] || 0) * priceOf(e, g) : 0);
    }, 0) * 0.5) +
    e.fame * 2.2 +
    e.rank * 55 +
    e.office.power * 1.1 +
    (e.stats.德行 - 40) * 2 +
    e.children.length * 12 +
    decorum(e) * 6 +
    e.flags.filter(f => f.startsWith('宗')).length * 150 +
    S.mil.merit * 0.5 +
    (S.skill.医术 + S.skill.文名 + S.skill.吏干) * 0.8 +
    (e.flags.includes('污点') ? -40 : 0) +
    Math.min(e.age, 80) * 2
  );
}

function die(cause) {
  if (S.over) return;
  S.over = true;
  funeralFlow(cause);
}

function funeralFlow(cause) {
  const opts = [
    { label: '薄棺一口，草草下葬（2 贯）', disabled: S.money < 2, run: () => { money(-2); S._funeral = '薄葬'; addStat('名声', -2); } },
    { label: '依礼成殄，亲友相送（12 贯）', disabled: S.money < 12, run: () => { money(-12); S._funeral = '依礼成殄'; addStat('名声', 2); addStat('德行', 2); } },
    { label: '厚葬，请僧道做法事（35 贯）', disabled: S.money < 35, run: () => { money(-35); S._funeral = '厚葬'; addStat('名声', 6); addStat('德行', 3); } }
  ];
  if (S.land > 0) opts.push({ label: '卖一亩田办丧事', run: () => { S.land -= 1; money(12); S._funeral = '卖田办丧'; addStat('名声', 1); } });
  askStep('身后事', `${S.name}去了，享年 ${S.age} 岁。家人围在床前，等你身后的事有个安排。`, opts, () => finishDeath(cause));
}

function finishDeath(cause) {
  S.money = Math.max(0, Math.round(S.money));
  const sc = score();
  let ending = ENDINGS[ENDINGS.length - 1];
  for (const e of ENDINGS) { if (sc >= e.min) { ending = e; break; } }

  // 家族账本
  if (G) {
    G.prestige += Math.max(1, Math.round(sc / 300));
    G.chronicle.push({ gen: G.gen, name: S.name, family: S.family, age: S.age, ending: ending.name, score: sc });
    if (G.chronicle.length > 40) G.chronicle.shift();
    saveChron();
  }
  clearSave();

  document.getElementById('death-cause').textContent = cause;
  document.getElementById('death-epitaph').textContent =
    `${S.name} · ${S.family} · 享年 ${S.age} 岁` + (G ? ` · ${G.surname}氏第 ${G.gen} 代` : '');
  document.getElementById('death-summary').innerHTML = [
    ['结局', ending.name],
    ['家资', S.money + ' 贯'],
    ['田产', S.land + ' 亩'],
    ['功名', S.rank >= 4 ? (S.office.granted ? '进士 · ' + officeName() : '进士') : RANK_NAMES[S.rank]],
    ['子嗣', S.children.length + ' 人'],
    ['丧仪', S._funeral || '草草了事'],
    ['行业', (TRADES[S.trade] || '无恒业') + (tradeTitle(S) ? ' · ' + tradeTitle(S) : '') +
      (S.flags.includes('宗' + S.trade) ? '（尊号：' + (tradeDef(S.trade) || {}).epithet + '）' : '')],
    ['家族声望', G ? G.prestige : 0],
    ['综合', sc + ' 分']
  ].map(([k, v]) => `<div><span>${k}</span><span>${v}</span></div>`).join('')
    + `<p style="margin:12px 0 0;color:#4a4034">${ending.text}</p>`;

  document.getElementById('lineage').innerHTML = '<b>家族记事</b><br>' + (G ? G.chronicle.slice(-8).map(l =>
    `第${l.gen}代 · ${l.name}（${l.family}）· 享年 ${l.age} · ${l.ending}`).join('<br>') : '');

  // 承家：每个成年子嗣一个按钮；无子则可过继
  const box = document.getElementById('heir-btns');
  box.innerHTML = '';
  const heirs = S.children.filter(c => c.age >= 16);
  heirs.forEach(c => {
    const b = document.createElement('button');
    b.className = 'heir-btn';
    b.innerHTML = `承家：${c.name}<small>${c.age} 岁 · 才学 ${c.wit}</small>`;
    b.onclick = () => startHeir(c, false);
    box.appendChild(b);
  });
  if (!heirs.length) {
    const b = document.createElement('button');
    b.className = 'heir-btn';
    b.innerHTML = `族中过继一子<small>年仅十六，才学平平，家产只继承两成</small>`;
    b.onclick = () => startHeir({ name: pick(SURNAMES) + pick(['砚', '舟', '珩', '清']), age: 16, wit: 45 }, true);
    box.appendChild(b);
  }
  const b2 = document.createElement('button');
  b2.className = 'heir-btn';
  b2.innerHTML = `就到此为止<small>家族断绝，只留一卷族谱</small>`;
  b2.onclick = () => { showScreen('title'); renderTitleExtras(); };
  box.appendChild(b2);

  showScreen('death');
}

/* ---------- 传代 ---------- */
function startHeir(child, adopted) {
  const inherit = {
    name: child.name, from: S.name, wit: child.wit,
    money: Math.round(S.money * (adopted ? 0.2 : 0.4)),
    land: Math.max(0, Math.floor(S.land * (adopted ? 0.3 : 0.5))),
    shop: adopted ? 0 : Math.floor((S.shops || []).length / 2),
    shops: adopted ? [] : (S.shops || []).slice(0, Math.floor((S.shops || []).length / 2)),
    goods: Object.assign({}, S.goods || {}),
    fame: Math.round(S.fame * (adopted ? 0.3 : 0.6)),
    rank: adopted ? 0 : (S.rank >= 2 ? 1 : 0),
    flags: S.flags.filter(f => f !== '污点' && f !== '门荫'),
    trade: adopted ? 'none' : S.trade,
    household: S.household,
    origin: S.origin,
    living: S.living,
    skill: adopted ? { 医术: 0, 文名: 0, 吏干: 0 } : Object.assign({}, S.skill),
    merit: 0, granted: false, power: 0
  };
  const famId = S.famId;
  const prevGen = G ? G.gen : 1;
  newLife(famId, inherit);
  if (!G) G = { surname: inherit.name.charAt(0), gen: 1, prestige: 0, chronicle: [] };
  G.gen = prevGen + 1;
  G.surname = G.surname || inherit.name.charAt(0);

  // 祖上余荫
  const p = G.prestige;
  S.fame += Math.floor(p / 20);
  S.stats.才智 = clamp(S.stats.才智 + Math.floor(p / 40));
  S.money += p * 2;

  showScreen('play');
  scene(`第 ${G.gen} 代`, `你是${inherit.from}的${adopted ? '族中过继之子' : '子嗣'}。祖上留下的田宅、名声与人情，如今都压在你肩上。`);
  render();
  saveGame();
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + id).classList.add('active');
}

/* ---------- 开始界面 ---------- */
function buildTitle() {
  const box = document.getElementById('bg-pick');
  box.innerHTML = '<p class="hint" style="margin:0;line-height:1.9">投胎不由人。或赤贫佃户，或匠人世传，或宗族子弟，也可能生在二品门第。<br>家世只定起点，命数还得自己走。</p>';
  const btn = document.getElementById('btn-start');
  btn.disabled = false;
  btn.textContent = '开卷 · 投胎去';
  btn.onclick = rollFamily;
  document.getElementById('btn-again').onclick = () => {
    showScreen('title');
    renderTitleExtras();
  };
  renderTitleExtras();
}

function rollFamily() {
  const total = FAMILIES.reduce((s, f) => s + (f.w || 1), 0);
  let r = Math.random() * total;
  let fam = FAMILIES[0];
  for (const f of FAMILIES) { r -= (f.w || 1); if (r <= 0) { fam = f; break; } }
  if (fam.dynamic === 'official') fam = rollOfficial();
  else if (fam.dynamic === 'imperial') fam = rollImperial();
  selectedFamily = fam.id;
  newLife(fam, null);
  showScreen('play');
  const extra = [];
  if (fam.flags.includes('手艺')) extra.push('家传手艺，匠艺起步就比别人高');
  if (fam.flags.includes('门荫')) extra.push('有门荫在身，不科考也有一条出仕的路');
  if (fam.flags.includes('宗族')) extra.push('族里有义庄族学，每年贴补，读书也有人指点');
  if (fam.flags.includes('商籍')) extra.push('自小在铺面里长大，商道上手快');
  if (fam.flags.includes('藏书')) extra.push('家中藏书，苦读更有成效');
  if (fam.flags.includes('官宦')) extra.push('官宦之家：家资与权势未必相称，清廉者贫，贪墨者富而有祸');
  if (fam.flags.includes('宗室')) extra.push('宗室：岁食禄米，但祖训不许应举、不许经商、不许从事四民之业');
  if (fam.flags.includes('军籍')) extra.push('军籍出身，投军比旁人顺');
  scene('投胎', `${fam.name}\n${fam.desc}\n` + (extra.length ? extra.join('；') + '。' : ''));
  log(`你投生在${fam.name}。家资 ${fam.money} 贯，田 ${fam.land} 亩。`, 'up');
  render();
  startChildhood();
}

/* ---------- 童年：六岁前只有零碎的几幕 ---------- */
function startChildhood() {
  askStep('童年',
    '六岁前的事你记不清了，只留下几幕：灶膛的火光、父亲手上的茧、母亲在门口喊你回家吃饭。',
    [
      { label: '跟着父亲认字（才智 +6）', run: () => { addStat('才智', 6); log('你趴在桌边认了半本《千字文》。', 'up'); } },
      { label: '跟着下地、跑腿（体魄 +6）', run: () => { addStat('体魄', 6); log('你六岁就能挑半担水。', 'up'); } },
      { label: '在街面上疯跑（气运 +4，结识玩伴）', run: () => { addStat('气运', 4); S.friends += 1; log('你认得了半条街的孩子。', 'up'); } }
    ],
    () => {
      const gap = 6 - S.age;
      S.age = 6;
      S.year += Math.max(0, gap);
      S.parents.age += Math.max(0, gap);
      log('六岁那年，你开始记事了。', 'up');
      scene('六岁', '你开始记事。家里的日子、父亲的手艺、母亲的叹息，都慢慢清楚了。\n往后的事，就要你自己拿主意了。');
      render();
      if (!S.careerPicked6) { S.careerPicked6 = true; careerPick6(); }
    });
}

function renderTitleExtras() {
  const box = document.getElementById('continue-box');
  box.innerHTML = '';
  const d = readSave();
  if (d && d.S && !d.S.over) {
    const b = document.createElement('button');
    b.className = 'save-card';
    const gen = d.G ? `第 ${d.G.gen} 代 · ` : '';
    b.innerHTML = `<b>继续上局</b><span>${gen}${d.S.name} · ${d.S.age} 岁 · 家资 ${d.S.money} 贯 · ${TRADES[d.S.trade] || '无恒业'}</span>`;
    b.onclick = loadGame;
    box.appendChild(b);
  }

  const chron = loadChron();
  const el = document.getElementById('family-chron');
  if (chron && chron.chronicle && chron.chronicle.length) {
    el.innerHTML = `<b>${chron.surname}氏 · 已传 ${chron.gen} 代 · 家族声望 ${chron.prestige}</b><br>` +
      chron.chronicle.slice(-6).map(l => `第${l.gen}代 ${l.name} · ${l.age} 岁 · ${l.ending}（${l.score} 分）`).join('<br>');
  } else {
    el.innerHTML = '';
  }
}

document.addEventListener('DOMContentLoaded', () => { buildTitle(); });
