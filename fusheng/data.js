/* data.js —— 数据与规则表（改数值即可调平衡） */

const FAMILIES = [
  {
    id: 'chi', name: '赤贫佃户', w: 16,
    desc: '上无片瓦，下无寸土，租人家田种，交完租只剩糠菜。',
    stats: { 体魄: 62, 才智: 28, 德行: 58, 容貌: 44, 气运: 48 },
    money: 1, land: 0, shop: 0, fame: 2, flags: [],
    start: '母亲把半碗稀粥推到你面前，说：家里就这点，你吃。'
  },
  {
    id: 'nong', name: '寒门农家', w: 20,
    desc: '三代自耕，田二亩，屋三间，识字者仅你一人。',
    stats: { 体魄: 60, 才智: 32, 德行: 56, 容貌: 46, 气运: 50 },
    money: 6, land: 2, shop: 0, fame: 4, flags: [],
    start: '父亲把最后半袋粟米推到你面前，说：读书要钱，种地要人，你自己拿主意。'
  },
  {
    id: 'jiang', name: '匠户世家', w: 12,
    desc: '祖传木匠，一把刨子养了三代。手艺传子不传女，你自小在刨花堆里长大。',
    stats: { 体魄: 56, 才智: 40, 德行: 50, 容貌: 46, 气运: 50 },
    money: 15, land: 1, shop: 0, fame: 8, flags: ['手艺'],
    skill: { 匠艺: 25 },
    start: '父亲把祖传的墨斗交给你，说：手艺人饿不死，也发不了大财。'
  },
  {
    id: 'shang', name: '行商之家', w: 10,
    desc: '父在县城开一间绸缎铺，家境殷实，只是士林清议里，商人总低人一头。',
    stats: { 体魄: 46, 才智: 46, 德行: 42, 容貌: 52, 气运: 55 },
    money: 48, land: 0, shop: 1, fame: 10, flags: ['商籍'],
    skill: { 商道: 15 },
    start: '父亲拨了二十贯与你，说：本钱给你，赔了别回来哭。'
  },
  {
    id: 'geng', name: '耕读之家', w: 12,
    desc: '几亩薄田，一箱旧书。白天种地，夜里点灯教子。',
    stats: { 体魄: 52, 才智: 50, 德行: 58, 容貌: 47, 气运: 50 },
    money: 14, land: 4, shop: 0, fame: 12, flags: ['藏书'],
    start: '父亲在油灯下把《千字文》摊开：认得字，就不算白活。'
  },
  {
    id: 'shu', name: '书香门第', w: 9,
    desc: '祖上出过两位举人，家中藏书三千卷。父亲屡试不第，把指望全押在你身上。',
    stats: { 体魄: 42, 才智: 58, 德行: 60, 容貌: 50, 气运: 50 },
    money: 22, land: 3, shop: 0, fame: 24, flags: ['藏书'],
    skill: { 文名: 10 },
    start: '父亲把《四书章句》拍在案上：三年之内，我要看到你进学。'
  },
  {
    id: 'zong', name: '宗族子弟', w: 8,
    desc: '族中有秀才，也有义庄、族学。你不是最亲的那一支，但姓这个姓。',
    stats: { 体魄: 50, 才智: 46, 德行: 62, 容貌: 50, 气运: 52 },
    money: 18, land: 2, shop: 0, fame: 16, flags: ['宗族'],
    skill: { 文名: 6 },
    start: '族老把你叫到祠堂前：族里供你读书，将来要有出息。'
  },
  {
    id: 'jun', name: '军户之家', w: 6,
    desc: '世袭军籍，父辈在卫所当差，家里有刀有甲，也有说不清的旧债。',
    stats: { 体魄: 60, 才智: 38, 德行: 50, 容貌: 46, 气运: 48 },
    money: 10, land: 2, shop: 0, fame: 10, flags: ['军籍'],
    start: '父亲把他的腰刀挂在你床头：军户的儿郎，先学会站直。'
  },
  {
    id: 'guan', name: '官宦之家', w: 12, dynamic: 'official',
    desc: '父亲做着官。只是官大官小、清不清廉，差别比人和狗还大。',
    stats: { 体魄: 46, 才智: 50, 德行: 50, 容貌: 54, 气运: 54 },
    money: 30, land: 4, shop: 0, fame: 30, flags: [],
    start: '父亲的官轿停在门口，你在影壁后头看着，不知道那是荣耀还是麻烦。'
  },
  {
    id: 'zongshi', name: '宗室之家', w: 8, dynamic: 'imperial',
    desc: '你姓朱。祖训条章把你养起来，也把你困起来。',
    stats: { 体魄: 48, 才智: 48, 德行: 48, 容貌: 56, 气运: 54 },
    money: 60, land: 8, shop: 0, fame: 45, flags: ['宗室', '祖训'],
    start: '族谱上你的名字排在很长一串后面。父亲说：安分守己，就能一世衣食无忧。'
  }
];

/* 功名阶梯：idx 即 S.rank */
const RANK_NAMES = ['白身', '童生', '秀才', '举人', '进士', '入仕'];
const EXAM = [
  { need: 1, name: '县试', age: 8,  wit: 34, fee: 1,  base: 0.55, gain: 12, desc: '考童生，识文断字即可' },
  { need: 2, name: '院试', age: 14, wit: 50, fee: 3,  base: 0.42, gain: 20, desc: '考秀才，中者免差役' },
  { need: 3, name: '乡试', age: 18, wit: 64, fee: 8,  base: 0.26, gain: 40, desc: '考举人，三年一科' },
  { need: 4, name: '会试', age: 22, wit: 76, fee: 15, base: 0.16, gain: 80, desc: '考进士，天子门生' }
];

const OFFICE_RANKS = [
  { at: 0,   name: '未授官' },
  { at: 20,  name: '七品知县' },
  { at: 55,  name: '六品通判' },
  { at: 110, name: '五品知州' },
  { at: 200, name: '四品知府' },
  { at: 320, name: '三品布政使' },
  { at: 480, name: '二品巡抚' }
];

/* 行动：一年一件。req 返回 false 或不可用原因字符串 */
/* 向父母讨钱：各家底子不同 */
const ASK_BASE = { chi: 1, nong: 2, jiang: 3, shang: 6, geng: 3, shu: 5, zong: 4, jun: 2, guan: 8, zongshi: 10 };

const ACTIONS = [
  {
    id: 'study', name: '苦读', cost: 0,
    desc: '闭门读书，一年光阴换几分才学',
    req: (S) => (S.age >= 6 ? true : '年纪太小'),
    run: (S) => {
      let bonus = 1;
      if (S.flags.includes('藏书')) bonus = 1.3;
      else if (S.flags.includes('宗族')) bonus = 1.15;
      const decay = S.age > 40 ? 0.5 : S.age > 30 ? 0.75 : 1;
      const wit = Math.round((4 + rnd(0, 4)) * bonus * decay);
      const body = -Math.round(1 + (S.age > 40 ? 2 : 0));
      addStat('才智', wit); addStat('体魄', body);
      S.money -= 1;
      return { lines: [pick([
        `你把一年的灯油都熬干了，才学长进 ${wit} 点。`,
        `窗下读到三更，墨磨干了两锭，才学进 ${wit} 点。`,
        `你把《四书》又通了一遍，字也写得端正些，才学进 ${wit} 点。`
      ]), `体魄 -${-body}，灯油钱花了 1 贯。`] };
    }
  },
  {
    id: 'farm', name: '务农', cost: 0,
    desc: '守着自家田地，稳当但不富',
    req: (S) => ((S.land > 0 || S.origin === 'chi') ? true : '家中无田'),
    run: (S) => {
      if (S.land === 0) {   // 佃户：租人家的田，交完租只剩口粮
        const r = 2 + rnd(0, 2);
        S.trade = 'nong'; grow(S, '农艺', rnd(1, 3));
        S.money += r; addStat('体魄', -2);
        return { lines: [pick([
        `你租了东家的田，一年两熟，交完租剩 ${r} 贯。`,
        `春天下种，秋天还租，落到手里 ${r} 贯。`,
        `东家来收租那日，把斗刮得很平。你一年落下 ${r} 贯。`
      ])] };
      }
      let yield_ = Math.round(S.land * (1.2 + Math.random()) + 1);
      if (S.goods && S.goods.tie > 0) yield_ += 2;   // 仓里存着铁器，农具不缺
      S.trade = 'nong';
      grow(S, '农艺', rnd(2, 4));
      S.money += yield_; addStat('体魄', -1);
      return { lines: [pick([
        `一年两熟，田里出了 ${yield_} 贯。`,
        `稻子压弯了秆，晒场上一片金黄，折银 ${yield_} 贯。`,
        `今年雨水调匀，收成不坏，田里出了 ${yield_} 贯。`
      ])] };
    }
  },
  {
    id: 'work', name: '做工', cost: 0,
    desc: '凭手艺吃饭，伤身但来钱',
    req: () => true,
    run: (S) => {
      const gain = S.flags.includes('手艺') ? 6 + rnd(0, 2) : 4 + rnd(0, 2);
      S.money += gain; addStat('体魄', -3);
      return { lines: [pick([
        `你替人做了一年活计，挣得 ${gain} 贯，腰背酸了一年。`,
        `砖窑、码头、米行，哪有活就往哪去，一年攒下 ${gain} 贯。`,
        `手艺不精，只能干粗活。一年下来，手上裂口没合过，挣 ${gain} 贯。`
      ])] };
    }
  },
  {
    id: 'chores', name: '帮工', cost: 0,
    desc: '替人放牛、拾柴、挑水，挣几个铜板',
    req: (S) => (S.age >= 6 && S.age <= 14 ? true : (S.age < 6 ? '太小了' : '这年纪不该再做这个')),
    run: (S) => {
      const gain = 1 + rnd(0, 2);
      S.money += gain; addStat('体魄', 1);
      grow(S, '农艺', 1);
      return { lines: [pick([
        `你在邻家帮了一年工，东家管饭，另给 ${gain} 贯。`,
        `你替人放牛、拾柴、挑水，年底东家给了 ${gain} 贯。`,
        `你跟着大人下地，人小力气小，只挣得 ${gain} 贯，管两顿饭。`
      ])] };
    }
  },
  {
    id: 'trade', name: '经商', cost: 0,
    desc: '本钱生本钱，也可能血本无归',
    req: (S) => (S.money >= 12 ? true : '本钱不足十二贯'),
    run: (S) => {
      S.trade = 'shang';
      grow(S, '商道', 2);
      const st = (S.stats.才智 + S.stats.气运) / 2;
      const p = st / 100;
      const stake = Math.min(Math.round(S.money * 0.45), 150);
      if (Math.random() < 0.18 + p * 0.5) {
        const gain = Math.round(stake * (0.25 + Math.random() * 0.6));
        S.money += gain; addStat('名声', 1);
        return { lines: [`一趟货走下来，净赚 ${gain} 贯。`] };
      }
      const loss = Math.round(stake * (0.4 + Math.random() * 0.7));
      S.money -= loss;
      return { lines: [`行情崩了，折了 ${loss} 贯。`], cls: 'down' };
    }
  },
  {
    id: 'ask_money', name: '向父母讨钱', cost: 0,
    desc: '开口要钱，总要拿几分脸面去换',
    req: (S) => (!S.parents.alive ? '双亲已故'
      : (S.parents.favor >= 18 ? true : `父母已不愿再给（亲心 ${Math.round(S.parents.favor)}）`)),
    run: (S) => {
      const base = ASK_BASE[S.origin] || 2;
      const f = (S.parents.favor || 50) / 100;
      const got = Math.max(1, Math.round(base * (0.4 + f * 1.2) * (0.7 + Math.random() * 0.6)));
      S.parents.favor = Math.max(0, S.parents.favor - 14);
      S.money += got; addStat('德行', -1);
      if (S.stats.名声 > 0) addStat('名声', -1);
      return { lines: [pick([
        `母亲从箱底摸出 ${got} 贯，塞进你袖子里，说别叫你父亲知道。`,
        `父亲把烟袋在桌上磕了磕，半晌才拿出 ${got} 贯：“省着花。”`,
        `你开了口，屋里静了一阵，最后凑出 ${got} 贯。`,
        `母亲把陪嫁的银簪拿去当了，换回 ${got} 贯，没让你看她空了的耳垂。`
      ]) + `（亲心 ${Math.round(S.parents.favor)}）`] };
    }
  },
  {
    id: 'social', name: '交游', cost: 0,
    desc: '宴饮往来，攒人脉也攒名声',
    req: () => true,
    run: (S) => {
      const n = 4 + rnd(0, 3);
      money(-n);
      let tea = 0;
      if (S.goods && S.goods.cha >= 2) { S.goods.cha -= 2; tea = 2; }
      addStat('名声', 3 + rnd(0, 3) + Math.floor(decorum(S) / 3) + tea); S.friends += 1;
      return { lines: [`一年间宴饮往来不断，结识新友一位，名声渐起。`], cls: 'up' };
    }
  },
  {
    id: 'exam', name: '赴考', cost: 0,
    desc: '按功名逐级应试，中则改命',
    req: (S) => {
      if (S.gender === '女') return '明制女子不得应举';
      if (S.flags.includes('方外')) return '出家之人不赴科场';
      if (S.flags.includes('乐籍')) return '乐户子弟不得应举';
      if (S.rank >= 4) return '已登进士，无需再考';
      const e = EXAM[S.rank];
      if (S.age < e.age) return `须年满 ${e.age} 岁`;
      if (S.stats.才智 < e.wit) return `才学不足（需 ${e.wit}）`;
      if (S.rank >= 2 && S.year % 3 !== 0) return '乡试以上三年一科，今岁非大比之年';
      if (S.money < e.fee) return `盘缠不足（需 ${e.fee} 贯），可向父母讨要`;
      return true;
    },
    run: (S) => {
      const e = EXAM[S.rank];
      S.money -= e.fee;
      let p = e.base + (S.stats.才智 - e.wit) * 0.012 + (S.stats.气运 - 50) * 0.003
        + (S.stats.德行 - 50) * 0.0015 + (S.friends * 0.005);
      if (S.flags.includes('程文')) { p += 0.06; S.flags = S.flags.filter(f => f !== '程文'); }
      if (Math.random() < Math.max(0.05, Math.min(0.9, p))) {
        S.rank += 1; addStat('名声', e.gain / 2);
        const lines = [`${e.name}放榜，你的名字在列。功名进为「${RANK_NAMES[S.rank]}」。`];
        if (S.rank >= 4) { S.office.power += 25; lines.push('殿试之后，你被授了官身。'); }
        return { lines, cls: 'up' };
      }
      addStat('体魄', -4); addStat('气运', -1);
      return { lines: [`${e.name}落第。榜下人头攒动，你挤到最前面，没有找到自己的名字。`], cls: 'down' };
    }
  },
  {
    id: 'office', name: '理政', cost: 0,
    desc: '在任上做实事，攒政绩也攒名声',
    req: (S) => (S.gender === '女' ? '女子不得入仕' : S.mourning > 0 ? '丁忧守制中' : S.office.granted ? true : '尚未入仕'),
    run: (S) => {
      const eff = Math.round((S.stats.才智 + S.stats.德行) / 20 + rnd(0, 3));
      S.office.power += eff; addStat('名声', 2);
      S.money += 3 + rnd(0, 3);
      const lines = [`你任上一年，修渠断案，政绩 +${eff}。`];
      if (Math.random() < 0.25) {
        S.money += 25; addStat('德行', -6);
        lines.push('有商人送来一份厚礼，你收下了——账面上没人知道。');
      }
      return { lines };
    }
  },
  {
    id: 'marry', name: '请媒说亲', cost: 0,
    desc: '托媒婆寻人家：相看、合八字、下聘',
    req: (S) => {
      if (S.spouse) return '已有家室';
      if (S.flags.includes('方外')) return '身入空门，不作婚配';
      if (S.age < 15) return '年岁尚小';
      if (S.money < 3) return '连媒钱都拿不出（需 3 贯）';
      return true;
    },
    run: (S) => {
      money(-3);
      return { lines: ['你拎两包点心去了媒婆家，托她寻一门亲事。'], flow: 'marry' };
    }
  },
  {
    id: 'clinic', name: '去医馆', cost: 0,
    desc: '坐堂医切脉开方，治身上的病',
    req: (S) => (!S.illness ? '身上没病' : S.money >= 8 ? true : '诊金要 8 贯'),
    run: (S) => {
      money(-8);
      if (Math.random() < 0.8) {
        const n = S.illness.name;
        S.illness = null;
        S.health = Math.min(100, S.health + 8);
        return { lines: [`医馆的坐堂医替你切了脉，开了方子，${n}渐渐好了。`], cls: 'up' };
      }
      S.health = Math.min(100, S.health + 6);
      return { lines: ['药吃了半月，病势缓了些，但没断根。'] };
    }
  },
  {
    id: 'yinguan', name: '门荫出仕', cost: 0,
    desc: '凭父祖之荫入监选官，不必科第',
    req: (S) => (S.gender === '女' ? '门荫只及男丁' : !S.flags.includes('门荫') ? '无门荫可恃' : S.age < 16 ? '年岁尚小' : S.office.granted ? '已有官身' : true),
    run: (S) => {
      S.flags = S.flags.filter(f => f !== '门荫');
      S.office.granted = true;
      S.office.power = Math.max(S.office.power, 10);
      addStat('名声', 5); addStat('德行', -2);
      return { lines: ['你凭父祖之荫入了国子监，未几选官，得了一个县丞。士林说你「不由科第」，语气里带着轻慢。'], cls: 'up' };
    }
  },
  {
    id: 'teach', name: '教子', cost: 0,
    desc: '把希望押在下一代身上',
    req: (S) => (S.children.length ? true : '尚无子嗣'),
    run: (S) => {
      const c = S.children[0];
      c.wit += 6 + rnd(0, 4);
      addStat('德行', 3); addStat('体魄', -1);
      return { lines: [`你手把手教${c.name}读书，他的才学长了 ${6 + rnd(0, 4)} 点。`] };
    }
  },
  {
    id: 'heal', name: '延医', cost: 0,
    desc: '花钱养身，气血回升',
    req: (S) => ((S.money >= 4 || (S.goods && S.goods.yao > 0)) ? true : '无钱延医'),
    run: (S) => {
      if (S.goods && S.goods.yao > 0) {
        S.goods.yao -= 1;
        S.health = Math.min(100, S.health + 12 + rnd(0, 6));
        return { lines: ['你从仓里取了一担药材，自己配药调养，气血渐复。'], cls: 'up' };
      }
      S.money -= 4; S.health = Math.min(100, S.health + 8 + rnd(0, 6));
      return { lines: ['你请了郎中，抓了半年的药，气血渐复。'], cls: 'up' };
    }
  },
  {
    id: 'land', name: '置田', cost: 0,    desc: '二十贯两亩，年年收租',
    req: (S) => (S.money >= 20 ? true : '现银不足二十贯'),
    run: (S) => {
      S.money -= 20; S.land += 2;
      return { lines: ['你买下两亩水田，契纸压在箱底。'] };
    }
  },
  {
    id: 'travel', name: '远游', cost: 0,
    desc: '出门见世面，见闻也是本钱',
    req: (S) => (S.money >= 8 ? true : '盘缠不足'),
    run: (S) => {
      S.money -= 8; addStat('名声', 3); addStat('才智', 2); addStat('气运', 1);
      const found = Math.random() < 0.25;
      if (found) { S.money += 15; return { lines: ['你在外乡遇着旧识，顺手做成一笔小买卖，反赚了十五贯。'], cls: 'up' }; }
      return { lines: ['你走了三省，见了饥荒也见了繁华，眼界大开。'] };
    }
  },
  {
    id: 'piety', name: '侍亲', cost: 0,
    desc: '父母在，尽孝道',
    req: (S) => (S.parents.alive ? true : '双亲已故'),
    run: (S) => {
      addStat('德行', 5); addStat('名声', 2); S.health = Math.min(100, S.health + 2);
      if (S.parents.favor !== undefined) S.parents.favor = Math.min(100, S.parents.favor + 12);
      return { lines: [pick([
        '你在床前侍奉了一整年，乡里都说你是孝子。',
        '你替父亲捶背、替母亲挑水，一年下来，两个老人脸上的褶子都松了些。',
        '冬夜母亲咳得厉害，你守到天亮。邻里看在眼里。'
      ]) + `（亲心 ${Math.round(S.parents.favor || 0)}）`], cls: 'up' };
    }
  }
];

/* ---------- 营生（职业线） ---------- */
const MIL_RANKS = [
  { at: 0, name: '士卒' }, { at: 20, name: '伍长' },
  { at: 60, name: '队正' }, { at: 140, name: '校尉' }, { at: 300, name: '将军' }
];

const TRADES = {
  none: '无恒业',
  yi: '行医',
  shu: '塾师',
  li: '衙吏',
  jun: '军旅',
  jiang: '匠作'
};

function milRank(S) {
  let n = MIL_RANKS[0].name;
  MIL_RANKS.forEach(r => { if (S.mil.merit >= r.at) n = r.name; });
  return n;
}

ACTIONS.push(
  {
    id: 'learn_med', name: '拜师学医', cost: 0,
    desc: '十五贯束修，换一门吃饭的手艺',
    req: (S) => (S.trade === 'yi' ? '已在此行' : S.money < 15 ? '束修不足十五贯' : S.stats.才智 < 45 ? '才智不足（需 45）' : true),
    run: (S) => {
      S.money -= 15; S.trade = 'yi';      S.skill.医术 = Math.max(S.skill.医术, 10);
      addStat('德行', 1);
      return { lines: ['你随城南老郎中抄方抓药，一年下来，认得了三百味药材。'], cls: 'up' };
    }
  },
  {
    id: 'practice_med', name: '行医', cost: 0,
    desc: '坐堂问诊，医术越精进项越多',
    req: (S) => (S.trade === 'yi' ? true : '尚未入此行'),
    run: (S) => {
      const gain = rnd(3, 6);
      S.skill.医术 = Math.min(100, S.skill.医术 + gain);
      const fee = 2 + Math.floor(S.skill.医术 / 6);
      money(fee); addStat('德行', 2); addStat('名声', 1);
      const lines = [`你坐堂一年，医术 +${gain}，诊金与药钱共得 ${fee} 贯。`];
      if (Math.random() < 0.08) { addStat('名声', -3); money(-3); lines.push('有一味药抓错了，病家闹上门来，赔了三贯，名声也损了。'); }
      return { lines };
    }
  },
  {
    id: 'teach_school', name: '坐馆教书', cost: 0,
    desc: '秀才以上可开馆授徒，清苦但体面',
    req: (S) => (S.rank < 2 ? '须先中秀才' : S.trade === 'shu' ? '已在此行' : true),
    run: (S) => {
      S.trade = 'shu';
      const gain = rnd(3, 5);
      S.skill.文名 = Math.min(100, S.skill.文名 + gain);
      const fee = 4 + Math.floor(S.skill.文名 / 9);
      money(fee); addStat('名声', 2);
      return { lines: [`你在祠堂边开了间蒙馆，收了七八个蒙童，一年束修 ${fee} 贯。`] };
    }
  },
  {
    id: 'clerk', name: '入衙做吏', cost: 0,
    desc: '钱粮刑名，来钱快，名声损',
    req: (S) => (S.gender === '女' ? '女子不做衙吏' : S.stats.才智 < 45 ? '才智不足（需 45）' : S.trade === 'li' ? '已在此行' : true),
    run: (S) => {
      S.trade = 'li';
      const gain = rnd(3, 5);
      S.skill.吏干 = Math.min(100, S.skill.吏干 + gain);
      const fee = 5 + Math.floor(S.skill.吏干 / 8);
      money(fee); addStat('名声', -1);
      const lines = [`你在县衙做了书办，钱粮刑名样样经手，一年进项 ${fee} 贯。`];
      if (Math.random() < 0.18) { money(8); addStat('德行', -4); lines.push('有户人家塞了银子求你笔下留情，你收了。'); }
      return { lines };
    }
  },
  {
    id: 'army', name: '投军', cost: 0,
    desc: '以命换军功，升迁看军功',
    req: (S) => {
      if (S.trade === 'jun') return true;
      if (S.gender === '女') return '军户女眷不入伍';
      if (S.age < 16) return '年纪太小';
      if (S.age > 45) return '年岁已过';
      if (S.stats.体魄 < 55) return '体魄不足（需 55）';
      return true;
    },
    run: (S) => {
      S.trade = 'jun';
      const before = milRank(S);
      const merit = 3 + rnd(0, 5) + Math.floor(S.stats.体魄 / 25) + (S.household === '军户' ? 2 : 0);
      S.mil.merit += merit; money(3);
      const lines = [`你在营中操练、戍守，一年积军功 ${merit} 点。`];
      if (Math.random() < 0.1) { S.health -= 15; lines.push('一次巡边遇上马贼，你背上挨了一刀。'); }
      if (milRank(S) !== before) { addStat('名声', 6); money(10); lines.push(`上峰点卯，你升作${milRank(S)}。`); }
      return { lines };
    }
  },
  {
    id: 'craft', name: '匠作', cost: 0,
    desc: '斧凿锯刨，手艺吃饭',
    req: (S) => (S.gender === '女' ? '匠作不收女徒' : S.flags.includes('手艺') || S.stats.体魄 >= 50 ? (S.trade === 'jiang' ? '已在此行' : true) : '体魄不足（需 50）'),
    run: (S) => {
      S.trade = 'jiang';
      grow(S, '匠艺', rnd(2, 4));
      const fee = 6 + Math.floor(S.stats.体魄 / 20) + (S.goods && S.goods.tie > 0 ? 2 : 0);
      money(fee); addStat('体魄', -1);
      return { lines: [`你替人起屋打家具，一年挣得 ${fee} 贯，手上又添了几个茧。`] };
    }
  },
  {
    id: 'quit_trade', name: '弃业归耕', cost: 0,
    desc: '收起招牌，回家守几亩田',
    req: (S) => (S.trade !== 'none' ? true : '本就无业'),
    run: (S) => {
      S.trade = 'none'; addStat('德行', 1); addStat('名声', 1);
      return { lines: ['你收了招牌，回村守着几亩田过日子。'] };
    }
  }
);

/* ---------- 制度：户籍、赋役、身份特权（参照明制） ---------- */
const HOUSEHOLDS = {
  民户: { desc: '纳粮当差，里甲正役与均徳折银', corvee: 1.2, extra: 0 },
  匠户: { desc: '轮班匠，或输银代役（班匠银）', corvee: 0.8, extra: 0 },
  军户: { desc: '世袭军籍，出丁当兵，自备军装', corvee: 1.0, extra: 0 },
  商户: { desc: '市籍，无田而有商税、门摊课', corvee: 1.2, extra: 0.5 }
};

/* 按功名享的优免与特权（rank: 0 白身 1 童生 2 秀才 3 举人 4 进士） */
const PRIVILEGES = [
  { rank: 0, name: '白身', items: ['无优免，须纳粮当差'] },
  { rank: 1, name: '童生', items: ['无优免，可应县试、院试'] },
  { rank: 2, name: '秀才', items: ['免本身徭役', '见官不跪、免笞刑（须先革功名）', '可坐馆教书、岁给廪米'] },
  { rank: 3, name: '举人', items: ['免本身及一丁徭役', '可候选教职、知县', '可赴会试'] },
  { rank: 4, name: '进士', items: ['授官食俸', '优免田粮', '本身及家内二丁免役'] }
];

/* ---------- 衣食住行：用度按身份定上限（明初定制之意） ---------- */
const LIVING = {
  衣: {
    label: '衣着',
    levels: ['布衣短褐', '细布长衫', '绢绸直裰', '锦缎袍服'],
    caps: [1, 1, 2, 3, 3],
    costs: [0, 6, 18, 45],
    upkeep: [0, 1, 1, 2]
  },
  食: {
    label: '饮食',
    levels: ['粗茶淡饭', '常有荤腥', '宴客成席', '珍饶罗列'],
    caps: [1, 1, 2, 3, 3],
    costs: [0, 5, 15, 40],
    upkeep: [0, 1, 1, 2]
  },
  住: {
    label: '宅第',
    levels: ['茅檐土屋', '瓦房三间', '五架厅堂', '三进宅院'],
    caps: [1, 1, 1, 2, 3],
    costs: [0, 20, 60, 150],
    upkeep: [0, 1, 3, 6]
  },
  行: {
    label: '出行',
    levels: ['徒步', '雇驴代步', '租赁小轿', '自备轿马'],
    caps: [1, 1, 1, 2, 3],
    costs: [0, 4, 15, 50],
    upkeep: [0, 1, 1, 2]
  }
};

function capOf(S, key) {
  const caps = LIVING[key].caps;
  let cap = caps[Math.min(S.rank, 4)];
  if (key === '衣' && S.household === '商户') cap = Math.max(0, cap - 1);
  if (S.office.granted) cap = 3;
  // 有钱有脸面的人家，日子总能过得比身份高一头（逾制难免，官府不常究）
  let slack = 0;
  if (S.money >= 120) slack += 1;
  if (S.money >= 400) slack += 1;
  if (S.fame >= 100) slack += 1;
  return Math.min(3, cap + Math.min(2, slack));
}

function decorum(S) {
  return S.living.衣 + S.living.食 + S.living.住 + S.living.行;
}

/* 事件库：cond 决定是否可能发生 */
const EVENTS = [
  {
    id: 'famine', w: 6,
    cond: (S) => S.land > 0 && S.age >= 10,
    text: () => '今岁大旱，河床见底。乡里已有人开始卖儿卖女，官府的赈粮迟迟不到。',
    choices: [
      { label: '开仓济乡邻', req: (S) => S.money >= 5, run: (S) => { S.money -= 5; addStat('德行', 8); addStat('名声', 6); return ['你把存粮分了出去，自己饿了三个月。']; } },
      { label: '趁荒年低价买田', run: (S) => { if (S.money < 15) return ['你连低价都出不起，只能眼睁睁看着。']; S.money -= 15; S.land += 3; addStat('德行', -10); addStat('名声', -6); return ['你以三成价钱买下邻家三亩田，乡里背后骂你。']; } },
      { label: '闭门自守', run: (S) => { S.health -= 6; addStat('德行', -1); return ['你家门紧闭，熬过了荒年，也熬薄了人情。']; } }
    ]
  },
  {
    id: 'plague', w: 4,
    cond: (S) => S.age >= 8,
    text: () => '疫气入城。街口每日都有新棺，郎中束手，人人闭户。',
    choices: [
      { label: '出钱设药棚', req: (S) => S.money >= 10, run: (S) => { S.money -= 10; addStat('德行', 10); addStat('名声', 8); S.health -= 10; return ['你在城门口设棚施药，救了不少人，自己也病了一场。']; } },
      { label: '举家避往山中', run: (S) => { S.money -= 3; S.health -= 2; return ['你带着家小躲进山里，靠野菜过活，总算无恙。']; } },
      { label: '照常过活', run: (S) => { if (Math.random() < 0.45) { S.health -= 22; return ['你染了疫，高热七日，险些没挺过来。']; } return ['你竟安然无事，只是街坊少了几户人。']; } }
    ]
  },
  {
    id: 'robber', w: 5,
    cond: (S) => S.money > 10 && S.age >= 12,
    text: () => '你夜行归家，道旁窜出三人，一柄柴刀架在你颈上。',
    choices: [
      { label: '破财免灾', run: (S) => { const loss = Math.min(S.money, 10 + rnd(0, 15)); S.money -= loss; return ['你把钱袋扔了过去，捡回一条命，折了 ' + loss + ' 贯。']; } },
      { label: '奋起反抗', run: (S) => { if (Math.random() < S.stats.体魄 / 130) { addStat('名声', 4); addStat('体魄', -6); return ['你夺刀反打，伤了两人，自己也挂了彩。乡里传你勇名。']; } S.health -= 25; S.money = Math.round(S.money * 0.4); return ['你被打翻在地，抢掠一空，躺了两月。']; } },
      { label: '大喊求救', run: (S) => { if (Math.random() < (S.fame + S.friends * 5) / 120) return ['巡夜的乡邻闻声赶来，贼人四散。']; S.money = Math.round(S.money * 0.6); return ['喊声只惊动了野狗，钱还是丢了六成。']; } }
    ]
  },
  {
    id: 'patron', w: 4,
    cond: (S) => S.stats.才智 > 55 && S.rank >= 1,
    text: () => '府学教谕看过你的文章，留你饮茶，说愿为你写一封荐书。',
    choices: [
      { label: '执弟子礼，奉上束脩', req: (S) => S.money >= 6, run: (S) => { S.money -= 6; S.friends += 2; addStat('名声', 6); addStat('才智', 3); return ['你拜入其门下，从此有了师承。']; } },
      { label: '只谈学问，不攀交情', run: (S) => { addStat('才智', 5); return ['你只论文章，教谕反倒更看重你，只是没写荐书。']; } }
    ]
  },
  {
    id: 'lawsuit', w: 4,
    cond: (S) => S.money > 20 && S.age >= 16,
    text: () => '族中堂兄告你侵占祖田，状纸已递到县衙。',
    choices: [
      { label: '花钱打点', req: (S) => S.money >= 15, run: (S) => { S.money -= 15; addStat('德行', -3); addStat('名声', -4); return ['你使了银子，官司赢了一半，名声坏了一点。']; } },
      { label: '据理力争', run: (S) => { if (S.stats.德行 > 55 || S.rank >= 2) { addStat('名声', 5); return ['你呈上契纸，当堂辩明，县令判你胜诉。']; } S.money -= 20; return ['你输了官司，赔了二十贯。']; } },
      { label: '让田息事', run: (S) => { S.land = Math.max(0, S.land - 1); addStat('德行', 4); return ['你让出一亩田，堂兄撤了状子，族老赞你识大体。']; } }
    ]
  },
  {
    id: 'flood', w: 3,
    cond: (S) => S.office.granted,
    text: () => '汛期将至，堤坝年久失修。上司催要银两，库中却空。',
    choices: [
      { label: '自捐俸银修堤', run: (S) => { S.money -= Math.min(S.money, 20); S.office.power += 25; addStat('名声', 8); return ['堤成，百姓立碑记你的名字。']; } },
      { label: '向上请款', run: (S) => { if (Math.random() < 0.5) { S.office.power += 15; return ['上司准了款子，堤修得不算好，但没决口。']; } S.office.power -= 8; return ['款子被层层克扣，堤决了一段，你被记了过。']; } },
      { label: '摊派于民', run: (S) => { S.office.power += 8; addStat('德行', -8); addStat('名声', -6); return ['堤修好了，民怨也起来了。']; } }
    ]
  },
  {
    id: 'marry_offer', w: 4,
    cond: (S) => !S.spouse && S.age >= 15,
    text: () => '媒人上门，说城中一户人家看中了你，只是对方门第略高，聘礼要得多。',
    choices: [
      { label: '倾家相聘', req: (S) => S.money >= 25, run: (S) => { S.money -= 25; S.spouse = { name: '柳氏', quality: 82, age: S.age + 1 }; addStat('名声', 8); return ['你倾其所有，娶回了柳氏。岳家是县中有名的积善之家。']; } },
      { label: '婉言谢绝', run: () => ['你觉得门第不称，婉拒了。媒人摇头走了。'] }
    ]
  },
  {
    id: 'child_talent', w: 4,
    cond: (S) => S.children.length > 0,
    text: () => '孩子先生说你儿记性极好，背书过目不忘，问你愿不愿送去县学。',
    choices: [
      { label: '送去县学，束脩不惜', req: (S) => S.money >= 10, run: (S) => { S.money -= 10; S.children[0].wit += 12; return ['孩子进了县学，回来时眼睛亮得像灯。']; } },
      { label: '留在家里帮工', run: (S) => { S.money += 4; S.children[0].wit -= 4; addStat('德行', -3); return ['孩子留在田里，一年下来多收了四贯，只是书没再翻过。']; } }
    ]
  },
  {
    id: 'old_friend', w: 3,
    cond: (S) => S.friends >= 2,
    text: () => '旧友来访，说他在南边得了门路，邀你同去，只是要押上全部家当。',
    choices: [
      { label: '倾囊相随', req: (S) => S.money >= 30, run: (S) => { const stake = Math.round(S.money * 0.8); if (Math.random() < 0.45) { const gain = Math.min(Math.round(stake * 0.5), 160); S.money += gain; addStat('名声', 6); return ['南边果然有路子，你带回来的银子装了半车，净赚 ' + gain + ' 贯。']; } S.money -= stake; return ['货在半路被扣，血本无归。']; } },
      { label: '赠他十贯，不掺和', req: (S) => S.money >= 10, run: (S) => { S.money -= 10; addStat('德行', 5); return ['你赠了盘缠，他红着眼走了。数年后他回来，还了你三倍。']; } },
      { label: '闭门不见', run: () => ['你推说身子不适，没见他。'] }
    ]
  },
  {
    id: 'imperial', w: 2,
    cond: (S) => S.rank >= 4,
    text: () => '朝中有人举荐你入翰林院，只是同僚暗示，须得先"走动走动"。',
    choices: [
      { label: '照规矩走动', req: (S) => S.money >= 40, run: (S) => { S.money -= 40; S.office.power += 30; addStat('德行', -8); return ['你入了翰林，清贵之职，只是心里明白这位置是怎么来的。']; } },
      { label: '守正不入', run: (S) => { addStat('德行', 8); addStat('名声', 4); S.office.power += 5; return ['你没有走动，翰林院的门没开，但士林记住了你的名字。']; } }
    ]
  },
  {
    id: 'gift', w: 3,
    cond: (S) => S.office.granted,
    text: () => '属县富户送来一箱"土仪"，箱底压着三百两银票。',
    choices: [
      { label: '收下', run: (S) => { S.money += 60; addStat('德行', -12); S.flags.push('污点'); return ['你收了银子，从此见了那富户便矮三分。']; } },
      { label: '原样退回', run: (S) => { addStat('德行', 8); addStat('名声', 5); return ['你把箱子退了回去，富户脸色难看，百姓却传你清廉。']; } }
    ]
  },
  {
    id: 'sick_parent', w: 3,
    cond: (S) => S.parents.alive && S.age > 12,
    text: () => '母亲病重，郎中开了方子，药钱要八贯。',
    choices: [
      { label: '倾力医治', req: (S) => S.money >= 8, run: (S) => { S.money -= 8; addStat('德行', 6); return ['母亲熬了过来，拉着你的手说不出话。']; } },
      { label: '卖田换药', req: (S) => S.land >= 1, run: (S) => { S.land -= 1; addStat('德行', 8); addStat('名声', 4); S.parents.alive = false; return ['你卖了一亩田，母亲还是走了，走时攥着你的手。']; } },
      { label: '听天由命', run: (S) => { S.parents.alive = false; addStat('德行', -10); return ['你舍不得那八贯钱。入冬时，母亲没了。']; } }
    ]
  },
  {
    id: 'bandit_raid', w: 3,
    cond: (S) => S.age > 14,
    text: () => '流民成股，聚众劫掠。县中丁壮被征去守寨。',
    choices: [
      { label: '应征守寨', run: (S) => { if (Math.random() < S.stats.体魄 / 120) { addStat('名声', 6); S.money += 6; return ['你守住了寨子，官府赏了六贯，乡里称你义士。']; } S.health -= 18; return ['寨门被破，你身中两刀，养了半年。']; } },
      { label: '举家逃难', run: (S) => { S.money = Math.round(S.money * 0.7); S.health -= 6; return ['你带着家人南逃，家当丢了七成。']; } },
      { label: '出钱雇人', req: (S) => S.money >= 20, run: (S) => { S.money -= 20; return ['你出钱雇了十个乡勇，自己没上阵。']; } }
    ]
  },
  {
    id: 'windfall', w: 3,
    cond: () => true,
    text: () => '你在旧书摊上翻到一册残卷，里头夹着一张前朝的田契。',
    choices: [
      { label: '拿去县衙认领', run: (S) => { if (Math.random() < 0.4) { S.land += 2; addStat('名声', 4); return ['县衙核了旧档，田竟真是无主的，你白得两亩。']; } return ['县衙说契纸年久失效，你白跑一趟。']; } },
      { label: '悄悄收起', run: (S) => { S.flags.push('旧契'); addStat('气运', -1); return ['你把契纸收进箱底，总觉得心里不踏实。']; } },
      { label: '卖与书商', run: (S) => { S.money += 5; return ['书商给了五贯，说这残卷有点意思。']; } }
    ]
  },
  {
    id: 'exam_friend', w: 3,
    cond: (S) => S.rank >= 2 && S.rank < 4,
    text: () => '同窗邀你同赴乡试，说他有门路能打听主考偏好，只是要分润。',
    choices: [
      { label: '与他同行', req: (S) => S.money >= 8, run: (S) => { S.money -= 8; addStat('才智', 3); S.flags.push('门路'); return ['你花了八贯，得了几篇"拟题"，心里却有些不安。']; } },
      { label: '独自备考', run: (S) => { addStat('才智', 6); addStat('德行', 3); return ['你闭门苦读，把《四书》又抄了三遍。']; } }
    ]
  },
  {
    id: 'retire', w: 2,
    cond: (S) => S.age >= 58 && S.office.granted,
    text: () => '你年近花甲，上书乞骸骨。上司挽留，说再干三年便可荫一子。',
    choices: [
      { label: '致仕归乡', run: (S) => { S.flags.push('致仕'); addStat('名声', 6); S.health += 6; return ['你辞官归里，在村口种了两畦菜。']; } },
      { label: '再留三年', run: (S) => { S.office.power += 25; S.health -= 8; S.flags.push('荫子'); return ['你留任三年，为儿子换了一个荫官的名额。']; } }
    ]
  }
];

EVENTS.push(
  {
    id: 'war', w: 5,
    cond: (S) => S.trade === 'jun' && S.age >= 16,
    text: () => '北边起了战事，营中传令：明日拔营。有人说这一仗能立功，也有人说是有去无回。',
    choices: [
      { label: '奋勇先登', run: (S) => { if (Math.random() < S.stats.体魄 / 130) { S.mil.merit += 25; addStat('名声', 8); money(15); return ['你第一个攀上城头，军功 +25，赏了十五贯。']; } S.health -= 30; S.mil.merit += 5; return ['你冲在最前，被一箭射穿了肩胛，躺了三个月。']; } },
      { label: '守营待命', run: (S) => { S.mil.merit += 8; return ['你守住了营寨，无功也无过，军功 +8。']; } },
      { label: '称病避战', run: (S) => { S.mil.merit = Math.max(0, S.mil.merit - 6); addStat('名声', -5); return ['你托病没上阵，同袍看你的眼神变了。']; } }
    ]
  },
  {
    id: 'med_case', w: 5,
    cond: (S) => S.trade === 'yi',
    text: () => '城中富户遣人来请，说家中老母病重，愿出重金；同一日，村东的寡妇抱着发烧的孩子跪在门口。',
    choices: [
      { label: '先赴富户之约', run: (S) => { money(18); addStat('德行', -3); return ['你得了十八贯诊金，寡妇的孩子是别家郎中看的。']; } },
      { label: '先救孩子', run: (S) => { addStat('德行', 6); addStat('名声', 4); money(2); return ['孩子救回来了，富户改请了别人，你只收了二贯药钱。']; } },
      { label: '两边都跑', run: (S) => { S.health -= 8; money(10); addStat('德行', 2); return ['你两头奔波，人都救下了，自己累病了一场。']; } }
    ]
  },
  {
    id: 'corvee', w: 5,
    cond: (S) => S.household === '民户' && S.age >= 16 && S.rank < 3,
    text: () => '里长上门派役：今年轮到你户应里甲正役，催征钱粮、勾摄公事，一应杂差都要应。',
    choices: [
      { label: '亲自应役', run: (S) => { S.health -= 4; addStat('名声', 2); return ['你在县里跑了一年腿，人都黑瘦了，乡里说你本分。']; } },
      { label: '输银代役', req: (S) => S.money >= 4, run: (S) => { money(-4); return ['你交了四贯代役银，免了一年辛苦。']; } },
      { label: '出钱雇人顶役', req: (S) => S.money >= 2, run: (S) => { money(-2); addStat('德行', -2); return ['你花两贯雇了个闲汉顶役，里长睁一只眼闭一只眼。']; } },
      { label: '设法推脱', run: (S) => { if (Math.random() < 0.5) { addStat('名声', -5); money(-3); return ['里长把你报了上去，罚了三贯，乡里议论你滑头。']; } return ['你托了人情把差事推了，没出事。']; } }
    ]
  }
);
/* 用度行动：升一级，受身份上限约束 */
function livingCost(S, key, lv) {
  const base = LIVING[key].costs[lv];
  const m = (S.fashion && S.fashion.cloth) ? S.fashion.cloth : 1;
  return Math.max(1, Math.round(base * m));
}

function livingAction(key, label) {
  const L = LIVING[key];
  return {
    id: 'living_' + key, name: label, cost: 0,
    desc: '按身份添置' + L.label,
    req: (S) => {
      const cur = S.living[key];
      if (cur >= L.levels.length - 1) return '已到顶格';
      if (cur >= capOf(S, key)) return '逾制不可为';
      const need = livingCost(S, key, cur + 1);
      if (S.money < need) return '需 ' + need + ' 贯';
      return true;
    },
    run: (S) => {
      const cur = S.living[key];
      money(-livingCost(S, key, cur + 1));
      S.living[key] = cur + 1;
      addStat('名声', 1);
      return { lines: [`你添置${L.label}，由「${L.levels[cur]}」升为「${L.levels[cur + 1]}」。`], cls: 'up' };
    }
  };
}

ACTIONS.push(
  livingAction('衣', '置办衣饰'),
  livingAction('食', '改善饮食'),
  livingAction('住', '修葺宅第'),
  livingAction('行', '添置车轿')
);

/* 儕越：贪一时体面，违一时定制 */
EVENTS.push({
  id: 'sumptuary', w: 4,
  cond: (S) => S.money >= 50 && S.rank < 3,
  text: () => '县中富户做寿，遣人说愿借你一身绸衣赴席，还许你一笔「衣资」，只求席上添些体面。',
  choices: [
    { label: '穿绸赴宴', run: (S) => { money(15); addStat('名声', 4); if (Math.random() < 0.45) { addStat('名声', -8); money(-10); return ['你穿着绸衣招摇过市，被巡街的差役撞见，按儕制罚了十贯。']; } return ['满座皆惊，你在县里一时出了名。']; } },
    { label: '辞而不受', run: (S) => { addStat('德行', 3); return ['你只穿布衣赴宴，席上有人轻慢，也有人敬你守分。']; } }
  ]
});

const ENDINGS = [
  { min: 900, name: '青史留名', text: '你的名字进了府志，后世修谱，都要从你这一页翻起。' },
  { min: 650, name: '一方人物', text: '县里人提起你，总要顿一顿，说：那是个人物。' },
  { min: 450, name: '殷实人家', text: '田宅俱在，儿孙绕膝。你这辈子没做过惊天动地的事，但没让家里饿过一顿。' },
  { min: 300, name: '寻常一生', text: '你活过、苦过、也笑过。族谱上你只有一行字：某某，某年卒。' },
  { min: 180, name: '潦倒半生', text: '你走的时候，家里只剩一口薄棺，是邻里凑钱买的。' },
  { min: 0,   name: '湮没无闻', text: '你像一粒沙落进河里，没有声息。多年后，无人记得你的名字。' }
];

/* ================= 三教九流：行业成长线 ================= */
Object.assign(TRADES, {
  nong: '力田', shang: '行商', song: '讼师', mu: '幕友',
  bu: '卜筮', seng: '僧道', you: '优伶', biao: '镖师',
  cha: '茶人', hua: '画师'
});

const TRADE_DEFS = [
  { id: 'nong',  name: '力田', skill: '农艺', epithet: '先农',   ranks: ['佃客', '自耕农', '田把式', '田庄管事', '粮长'] },
  { id: 'jiang', name: '匠作', skill: '匠艺', epithet: '御匠',   ranks: ['学徒', '匠人', '都料匠', '匠首', '营造大家'] },
  { id: 'shang', name: '行商', skill: '商道', epithet: '陶朱',   ranks: ['小贩', '行商', '坐贾', '大商', '巨贾'] },
  { id: 'shu',   name: '蒙师', skill: '文名', epithet: '文宗',   ranks: ['蒙师', '塾师', '名师', '山长', '一代宗师'] },
  { id: 'yi',    name: '行医', skill: '医术', epithet: '杏林国手', ranks: ['药童', '游医', '坐堂医', '名医', '国手'] },
  { id: 'li',    name: '衙吏', skill: '吏干', epithet: '铁案',   ranks: ['书办', '典吏', '主文', '吏目', '掌案'] },
  { id: 'jun',   name: '军旅', skill: '军功', epithet: '都督',   ranks: ['士卒', '伍长', '队正', '校尉', '将军'] },
  { id: 'song',  name: '讼师', skill: '讼笔', epithet: '铁笔',   ranks: ['代书', '讼师', '名状', '刀笔', '讼魁'] },
  { id: 'mu',    name: '幕友', skill: '幕才', epithet: '幕中诸葛', ranks: ['书启', '刑名幕友', '钱谷幕友', '名幕', '大幕'] },
  { id: 'bu',    name: '卜筮', skill: '卜术', epithet: '鬼谷',   ranks: ['走街算命', '设摊', '相馆', '神算', '半仙'] },
  { id: 'seng',  name: '僧道', skill: '清修', epithet: '国师',   ranks: ['沙弥道童', '知客', '监院', '住持', '方丈'] },
  { id: 'you',   name: '优伶', skill: '唱功', epithet: '梨园宗师', ranks: ['龙套', '配角', '正角', '班主', '名伶'] },
  { id: 'biao',  name: '镖师', skill: '镖艺', epithet: '神镖',   ranks: ['趟子手', '镖师', '镖头', '总镖头', '镖局东家'] },
  { id: 'cha',   name: '茶人', skill: '茶道', epithet: '茶圣',   ranks: ['茶童', '茶博士', '点茶师', '茶师', '茶道大家'] },
  { id: 'hua',   name: '画师', skill: '丹青', epithet: '画圣',   ranks: ['画徒', '画工', '画师', '名画师', '丹青大家'] }
];

function tradeDef(id) { return TRADE_DEFS.find(t => t.id === id) || null; }
function sk(S, key) { return S.skill[key] || 0; }
function grow(S, key, v) { S.skill[key] = Math.min(100, sk(S, key) + v); }

const TRADE_STEPS = [0, 20, 45, 70, 92];
const MIL_STEPS = [0, 20, 60, 140, 300];

function tradeLevel(S) {
  const d = tradeDef(S.trade);
  if (!d) return -1;
  const steps = d.skill === '军功' ? MIL_STEPS : TRADE_STEPS;
  const v = d.skill === '军功' ? S.mil.merit : sk(S, d.skill);
  let lv = 0;
  steps.forEach((step, i) => { if (v >= step) lv = i; });
  return lv;
}

function tradeTitle(S) {
  const d = tradeDef(S.trade);
  if (!d) return '';
  return d.ranks[Math.max(0, tradeLevel(S))];
}

/* 通用行业动作生成器 */
function careerActions(def) {
  const d = tradeDef(def.id);
  return [
    {
      id: 'join_' + def.id, name: def.join.name, cost: 0,
      desc: def.join.desc || ('入门束修 ' + def.join.cost + ' 贯'),
      req: (S) => {
        if (S.trade === def.id) return '已在此行';
        if (FEMALE_ONLY_TRADES.indexOf(def.id) >= 0 && S.gender !== '女') return '这门手艺只传女子';
        if (MALE_ONLY_TRADES.indexOf(def.id) >= 0 && S.gender === '女') return '此行不收女眷';
        const r = def.join.req ? def.join.req(S) : true;
        if (r !== true) return r;
        if (S.money < def.join.cost) return '需 ' + def.join.cost + ' 贯';
        return true;
      },
      run: (S) => {
        money(-def.join.cost);
        S.trade = def.id;
        grow(S, d.skill, 6);
        if (def.onJoin) def.onJoin(S);
        return { lines: [def.join.text || ('你入了' + d.name + '这一行。')], cls: 'up' };
      }
    },
    {
      id: 'work_' + def.id, name: def.work.name, cost: 0,
      desc: def.work.desc,
      req: (S) => (S.trade === def.id ? true : '尚未入此行'),
      run: (S) => {
        const lv = tradeLevel(S);
        const gain = rnd(3, 6);
        grow(S, d.skill, gain);
        const fee = def.fee(lv, S);
        money(fee);
        if (def.effects) def.effects(S);
        const lines = [def.work.text || ('你干了一年' + d.name + '，手艺精进 ' + gain + ' 点，进项 ' + fee + ' 贯。')];
        if (def.flavor && Math.random() < 0.3) lines.push(def.flavor);
        return { lines };
      }
    }
  ];
}

/* 六条新行业线 */
[
  {
    id: 'song',
    join: { name: '投师学讼', cost: 12, req: (S) => (S.stats.才智 >= 50 ? true : '才智不足（需 50）'), text: '你随老讼师学了三年刀笔，学会了怎么在状纸上做文章。' },
    work: { name: '代人写状', desc: '替人打官司，来钱快，名声损', text: '你替人写状、递状、打通关节，一年下来腰包鼓了，背后骂你的人也多了。' },
    fee: (lv, S) => 3 + lv * 3,
    effects: (S) => { addStat('名声', -1); },
    flavor: '县太爷斥你「刁讼」，罚了钱，你转头又接了两桩案子。'
  },
  {
    id: 'mu',
    join: { name: '入幕为宾', cost: 15, req: (S) => (S.rank >= 2 ? true : S.stats.才智 >= 60 ? true : '须秀才出身或才智 60'), text: '你受聘入幕，替东家看刑名钱谷，从此刻起，你的名字不上公文，只上签稿。' },
    work: { name: '佐幕办差', desc: '替官员办刑名钱谷，稳当体面', text: '你替东家理案卷、算钱粮，一年下来东家离不开你。' },
    fee: (lv, S) => 5 + lv * 4,
    effects: (S) => { addStat('名声', 1); }
  },
  {
    id: 'bu',
    join: { name: '拜师学卜', cost: 6, req: () => true, text: '你随游方术士学了看相卜卦，从此在桥头摆开一张席子。' },
    work: { name: '摆摊卜卦', desc: '看相算命，看天吃饭', text: '你替人看相卜卦，说的多是半真半假的话，钱倒是实打实的。' },
    fee: (lv, S) => 2 + lv * 2 + Math.floor(S.stats.气运 / 40),
    effects: (S) => { addStat('名声', 1); },
    flavor: '有位老爷说你算得准，赏了一锭银子；也有人掀了你的摊子，骂你骗子。'
  },
  {
    id: 'seng',
    join: { name: '剃度出家', cost: 2, req: (S) => (S.age >= 12 ? true : '年纪太小'), text: '你落了发，法号「慧明」。红尘事，从此隔了一道山门。' },
    onJoin: (S) => { S.flags.push('方外'); },
    work: { name: '诵经化缘', desc: '晨钟暮鼓，香火养活一门', text: '你每日诵经、洒扫、接待香客，寺里的香火钱分你一份。' },
    fee: (lv, S) => 3 + lv * 3,
    effects: (S) => { addStat('德行', 2); }
  },
  {
    id: 'you',
    join: { name: '入戏班学艺', cost: 4, req: (S) => (S.stats.容貌 >= 45 ? true : '容貌不足（需 45）'), text: '你进了县里的戏班，从跑龙套做起。班主说：唱好了，也是个人物。' },
    onJoin: (S) => { S.flags.push('乐籍'); },
    work: { name: '登台唱戏', desc: '贱业但来钱，名声受损', text: '你在庙会、堂会上唱了一年，赏钱不少，士绅看你的眼神却怪。' },
    fee: (lv, S) => 4 + lv * 4,
    effects: (S) => { addStat('名声', -2); addStat('容貌', 1); }
  },
  {
    id: 'biao',
    join: { name: '投镖局学艺', cost: 10, req: (S) => (S.stats.体魄 >= 60 ? true : '体魄不足（需 60）'), text: '你进了城西的镖局，先做趟子手，跟着镖车走南闯北。' },
    work: { name: '走镖', desc: '刀口舔血，一趟镖一条命', text: '你押着镖车走了一趟远路，风餐露宿，好在平安回来。' },
    fee: (lv, S) => 5 + lv * 4,
    effects: (S) => { addStat('名声', 1); },
    flavor: '半路遇上一伙山贼，你亮出字号，对方拱手让道。'
  },
  {
    id: 'cha',
    join: { name: '拜师学茶', cost: 8, req: (S) => (S.stats.才智 >= 40 ? true : '才智不足（需 40）'), text: '你入茶肆为徒，从烧水、碾茶、点汤学起，师父说：茶要静，人要淡。' },
    work: { name: '制茶待客', desc: '煮水分茶，雅俗共赏', text: '你一年里焙茶、斗茶、待客，手上有了分寸，座上也坐满了人。' },
    fee: (lv, S) => 3 + lv * 3,
    effects: (S) => { addStat('名声', 1); addStat('德行', 1); },
    flavor: '有位致仕的官员喝了你的茶，说：这盏茶里有山水。'
  },
  {
    id: 'hua',
    join: { name: '拜师学画', cost: 12, req: (S) => (S.stats.才智 >= 45 ? true : '才智不足（需 45）'), text: '你随画师学丹青，先临《芥子园》，再学写生，一笔一笔磨了三年。' },
    work: { name: '鬻画', desc: '卖画为生，雅名与现钱难兼得', text: '你一年里替人画扇面、写喜容、作山水，润笔费攒了一些，手上也算有了名。' },
    fee: (lv, S) => 3 + lv * 4,
    effects: (S) => { addStat('名声', 2); },
    flavor: '本地富商请你去画一堂屏风，笔资丰厚，只是要在画角题他的名字。'
  }
].forEach(def => ACTIONS.push(...careerActions(def)));

/* ================= 岁令：每年时令特色事件 ================= */
const MONTHS = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月'];

const SEASON_EVENTS = [
  {
    month: 0, id: 'se_newyear', w: 3,
    text: () => '正月里，爆竹声从村头响到村尾。族中长辈遣人来请，说今年该你去各家走动走动。',
    choices: [
      { label: '挨家拜年', run: (S) => { money(-1); addStat('名声', 3); S.friends += 1; return ['你走遍了族中几户人家，喝了一肚子米酒，人情攒下了。']; } },
      { label: '闭门读书', run: (S) => { addStat('才智', 2); return ['外头锣鼓喧天，你只管翻自己的书。']; } },
      { label: '在村口施粥', req: (S) => S.money >= 3, run: (S) => { money(-3); addStat('德行', 5); addStat('名声', 2); return ['你在村口支了一口锅，施了三日粥，穷人称你善人。']; } }
    ]
  },
  {
    month: 2, id: 'se_qingming', w: 3,
    text: () => '清明将至，坟头上该添土了。族人问你，今年祭祖的份子钱出多少。',
    choices: [
      { label: '照旧出份子', run: (S) => { money(-2); addStat('德行', 3); return ['你按例出了份子，跟着族人上山扫墓，添了新土。']; } },
      { label: '多出钱修坟', req: (S) => S.money >= 6, run: (S) => { money(-6); addStat('德行', 6); addStat('名声', 3); return ['你出钱把祖坟修整了一遍，族老当众夸你。']; } },
      { label: '推说手头紧', run: (S) => { addStat('名声', -3); addStat('德行', -2); return ['你没去，也没出钱。族里有人在背后念叨。']; } }
    ]
  },
  {
    month: 3, id: 'se_lean', w: 3,
    text: () => '四月青黄不接，缸里的米见了底。邻家已经开始挖野菜。',
    choices: [
      { label: '向富户借粮', run: (S) => { money(5); S.flags.push('欠粮'); addStat('名声', -1); return ['你借了五贯的粮，说好秋后加倍还。']; } },
      { label: '卖一亩田', req: (S) => S.land >= 1, run: (S) => { S.land -= 1; money(12); addStat('德行', -2); return ['你卖了一亩田，换了十二贯，熬过了这两个月。']; } },
      { label: '全家挖野菜', run: (S) => { S.health -= 4; addStat('体魄', -1); return ['一家人靠野菜和糠熬了过去，人都瘦了一圈。']; } }
    ]
  },
  {
    month: 4, id: 'se_duanwu', w: 3,
    text: () => '五月端午，河里赛起龙舟。乡人邀你同去，也有人在门口插艾驱疫。',
    choices: [
      { label: '去看龙舟', run: (S) => { money(-1); addStat('名声', 2); S.health += 2; return ['你在河边挤了一日，喊哑了嗓子，倒觉得筋骨舒展。']; } },
      { label: '在家插艾避疫', run: (S) => { S.health += 4; return ['你在门楣插了艾草，煮了雄黄水，一家人安然入夏。']; } },
      { label: '借机摆摊卖粽', run: (S) => { money(3); addStat('体魄', -1); return ['你包了三百个粽子挑去河边卖，赚了三贯。']; } }
    ]
  },
  {
    month: 7, id: 'se_midautumn', w: 3,
    text: () => '八月中秋，月色极好。邻家办酒，族人也在张罗。',
    choices: [
      { label: '设宴请客', req: (S) => S.money >= 4, run: (S) => { money(-4); addStat('名声', 4); S.friends += 1; return ['你在院里摆了两桌，宾主尽欢，人情做足了。']; } },
      { label: '一家人分饼', run: (S) => { addStat('德行', 2); S.health += 1; return ['你把一块月饼切成几份，孩子们抢着吃。']; } },
      { label: '独自对月', run: (S) => { addStat('才智', 1); addStat('气运', 1); return ['你一个人在院子里坐到半夜，忽然想通了些事。']; } }
    ]
  },
  {
    month: 9, id: 'se_rent', w: 3,
    text: () => '十月收租。佃户挑着谷子来，说今年雨水少，求少收两成。',
    choices: [
      { label: '照数收足', run: (S) => { money(Math.round(S.land * 0.6) + 2); addStat('名声', -2); return ['你一粒不少地收了，佃户走时脸是青的。']; } },
      { label: '减两成', run: (S) => { money(Math.round(S.land * 0.4)); addStat('德行', 3); addStat('名声', 2); return ['你减了两成租，佃户在田埂上给你磕了个头。']; } },
      { label: '今年全免', req: (S) => S.land >= 2, run: (S) => { addStat('德行', 6); addStat('名声', 4); return ['你免了今年的租。族里说你傻，佃户说你厚道。']; } }
    ]
  },
  {
    month: 10, id: 'se_winter', w: 2,
    text: () => '冬月冬至，族中祠堂开祭。族长说，今年该轮到你家出祭品。',
    choices: [
      { label: '按例备办', run: (S) => { money(-3); addStat('德行', 3); return ['你备了三牲果品，跪在祠堂里听族长念了一遍祖训。']; } },
      { label: '加倍备办', req: (S) => S.money >= 8, run: (S) => { money(-8); addStat('名声', 4); addStat('德行', 3); return ['你的祭品比别家厚了一倍，族老连连点头。']; } },
      { label: '托病不去', run: (S) => { addStat('名声', -4); addStat('德行', -3); return ['你没去祠堂。第二天，族里就有人提起「这家不像话」。']; } }
    ]
  },
  {
    month: 11, id: 'se_year_end', w: 3,
    text: () => '腊月年关，讨债的已经在门口站了半晌。家里也要办年货、写春联。',
    choices: [
      { label: '先还债', req: (S) => S.money >= 3, run: (S) => { money(-3); addStat('名声', 3); return ['你把欠的债先还了，年货办得单薄，心里却踏实。']; } },
      { label: '先办年货', req: (S) => S.money >= 2, run: (S) => { money(-2); addStat('名声', 1); addStat('德行', -2); return ['年货置办得齐整，债主在门外骂了半日。']; } },
      { label: '闭门躲债', run: (S) => { addStat('名声', -4); S.health -= 2; return ['你把门拴死，一家人啃着冷饼子过了一个年。']; } }
    ]
  }
];

/* ================= 天启年间：朝局大事 ================= */
EVENTS.push(
  {
    id: 'era_eunuch', w: 2,
    cond: (S) => S.age >= 18 && S.money >= 15,
    text: () => '宫里派下人来，说是为「修三殿」劝捐。来人笑吟吟的，身后跟着两个缇骑。',
    choices: [
      { label: '如数捐输', run: (S) => { money(-15); addStat('名声', -2); return ['你捐了十五贯，换来一块「乐善好施」的匾，和一年的安生。']; } },
      { label: '托人打点', req: (S) => S.money >= 8, run: (S) => { money(-8); addStat('德行', -1); return ['你托了县里的主簿说情，只花了八贯。']; } },
      { label: '硬顶不捐', run: (S) => { addStat('名声', 5); addStat('德行', 3); if (Math.random() < 0.35) { S.money = Math.round(S.money * 0.6); return ['你被缇骑锁走，关了半月，家里使了钱才放人。']; } return ['你没捐，来人冷笑一声走了。四乡都传你有骨头。']; } }
    ]
  },
  {
    id: 'era_liaoxiang', w: 3,
    cond: (S) => S.age >= 16 && S.land > 0,
    text: () => '辽东战事吃紧，朝廷加派「辽饷」，按亩摊银。里长拿着册子上门了。',
    choices: [
      { label: '照数缴纳', run: (S) => { money(-Math.max(1, Math.round(S.land * 0.4))); addStat('名声', 1); return ['你按亩交了辽饷，缸里的粮又少了一截。']; } },
      { label: '拖欠不缴', run: (S) => { addStat('名声', -2); if (Math.random() < 0.4) { money(-4); return ['里长报了上去，差役上门催了三回，最后还是补交了。']; } return ['你拖了半年，里长换了人，这笔就含糊过去了。']; } },
      { label: '卖田完税', req: (S) => S.land >= 1, run: (S) => { S.land -= 1; addStat('名声', 2); return ['你卖了一亩田完税，乡里称你忠厚。']; } }
    ]
  },
  {
    id: 'era_mining', w: 2,
    cond: (S) => S.money >= 10 || (S.shops || []).length > 0,
    text: () => '矿监税使到了县里，说凡有产业者，都要重新登记、加倍纳税。',
    choices: [
      { label: '花钱消灾', req: (S) => S.money >= 10, run: (S) => { money(-10); return ['你塞了十贯，税使在你的册子上画了个圈。']; } },
      { label: '联合商户抗税', run: (S) => { addStat('名声', 6); addStat('德行', 3); if (Math.random() < 0.4) { money(-12); return ['商户们一同罢市，税使调了兵来，你被罚了十二贯。']; } return ['商户罢市三日，税使到底没敢加征。']; } },
      { label: '关门避祸', run: (S) => { if ((S.shops || []).length) { S.shops.pop(); S.shop = S.shops.length; } addStat('名声', -2); return ['你关了一家铺子躲了半年，生意断了一截。']; } }
    ]
  }
);

/* ================= 店铺：明代县城里的各色营生 ================= */
const SHOPS = [
  { id: 'jiangyuan', name: '酱园',     cost: 20,  income: 3,  desc: '酱醋腐乳，家家要用', req: () => true },
  { id: 'xiangzhu',  name: '香烛铺',   cost: 25,  income: 3,  desc: '香烛纸马，庙会时最旺', req: () => true, yearly: (S) => { addStat('德行', 1); } },
  { id: 'mi',        name: '米铺',     cost: 30,  income: 4,  desc: '民以食为天，薄利稳当', req: () => true },
  { id: 'bu',        name: '布庄',     cost: 40,  income: 5,  desc: '布匹成衣，四乡都来扯布', req: () => true },
  { id: 'cha',       name: '茶肆',     cost: 45,  income: 5,  bonus: (S) => Math.floor(sk(S, '茶道') / 20), desc: '一碗茶钱，半日谈资', req: () => true },
  { id: 'yao',       name: '药铺',     cost: 50,  income: 6,  bonus: (S) => Math.floor(sk(S, '医术') / 20), desc: '药材齐全，兼卖丸散膏丹', req: (S) => (sk(S, '医术') >= 10 || S.stats.才智 >= 50 ? true : '须懂医术或才智 50') },
  { id: 'jiu',       name: '酒肆',     cost: 55,  income: 7,  desc: '三杯两盏，人声鼎沸', req: () => true },
  { id: 'chema',     name: '车马行',   cost: 60,  income: 8,  desc: '骡马大车，走货载客', req: () => true },
  { id: 'shufang',   name: '书坊',     cost: 70,  income: 8,  bonus: (S) => Math.floor(sk(S, '文名') / 15), desc: '刻书印谱，兼卖笔墨', req: (S) => (S.rank >= 2 || sk(S, '文名') >= 10 ? true : '须秀才或文名 10') },
  { id: 'chouduan',  name: '绸缎庄',   cost: 90,  income: 11, desc: '绫罗绸缎，本钱重，客也贵', req: (S) => (S.fame >= 15 || S.household === '商户' ? true : '名声不足（需 15）') },
  { id: 'dangpu',    name: '当铺',     cost: 100, income: 14, desc: '押物放债，利厚而损名', req: (S) => (S.money >= 100 ? true : '需 100 贯本钱'), yearly: (S) => { addStat('名声', -2); addStat('德行', -1); } },
  { id: 'qian',      name: '钱铺',     cost: 150, income: 18, desc: '兑换银钱，本厚利丰', req: (S) => (sk(S, '商道') >= 20 || S.fame >= 30 ? true : '须商道 20 或名声 30') }
];

function shopDef(id) { return SHOPS.find(s => s.id === id) || null; }

function shopAction(def) {
  return {
    id: 'open_' + def.id, name: '开' + def.name, cost: 0,
    desc: def.desc + '（' + def.cost + ' 贯）',
    req: (S) => {
      if (S.money < def.cost) return '需 ' + def.cost + ' 贯';
      const r = def.req ? def.req(S) : true;
      return r;
    },
    run: (S) => {
      money(-def.cost);
      S.shops.push({ id: def.id });
      S.shop = S.shops.length;
      const d = def;
      return { lines: [`你在县里盘下一间${d.name}，挂上幌子开张。`], cls: 'up' };
    }
  };
}

ACTIONS.push(...SHOPS.map(shopAction));

/* ================= 行商贩货：随行就市，低买高卖 ================= */
const GOODS = [
  { id: 'mi',   name: '米',   unit: '石', base: 1.2,  batch: 20, desc: '秋收贱、春荒贵' },
  { id: 'bu',   name: '布',   unit: '匹', base: 2.6,  batch: 10, desc: '四时皆需，价稳' },
  { id: 'cha',  name: '茶',   unit: '担', base: 3.8,  batch: 8,  desc: '山场出货，路远利厚' },
  { id: 'yao',  name: '药材', unit: '担', base: 5.0,  batch: 6,  desc: '疫年暴涨，平时平缓' },
  { id: 'ci',   name: '瓷器', unit: '担', base: 7.0,  batch: 4,  desc: '易碎，路上一颠就折本', risk: true },
  { id: 'tie',  name: '铁器', unit: '担', base: 6.0,  batch: 5,  desc: '官府时有禁令' },
  { id: 'si',   name: '丝绸', unit: '匹', base: 12.0, batch: 3,  desc: '本重利厚，官绅人家才用得起', risk: true },
  { id: 'yan',  name: '盐',   unit: '引', base: 4.5,  batch: 8,  desc: '官营，无盐引不得贩', needYin: true }
];

function priceOf(S, g) {
  let m = (S.market && S.market[g.id]) || 1;
  if (g.id === 'mi') {
    const mon = S.year % 12;
    if (mon >= 2 && mon <= 4) m *= 1.28;      // 春荒
    if (mon >= 9 && mon <= 10) m *= 0.78;     // 秋收
  }
  if (g.id === 'yao' && S.flags && S.flags.includes('疫年')) m *= 1.6;
  return Math.max(0.3, g.base * m);
}

function goodsAction(g) {
  return {
    id: 'trade_' + g.id, cost: 0,
    nameOf: (S) => ((S.goods && S.goods[g.id]) ? '卖' + g.name : '买' + g.name),
    descOf: (S) => {
      const p = priceOf(S, g).toFixed(1);
      const q = (S.goods && S.goods[g.id]) || 0;
      return `${p} 贯/${g.unit} · 存 ${q} · ${g.desc}`;
    },
    first: true,
    req: (S) => {
      if (g.needYin && !(S.flags.includes('盐引') || S.office.granted || S.rank >= 3)) return '无盐引，不得贩盐';
      const q = (S.goods && S.goods[g.id]) || 0;
      if (q > 0) return true;
      const cost = Math.round(priceOf(S, g) * g.batch);
      if (S.money < cost) return `本钱不足（需 ${cost} 贯）`;
      return true;
    },
    run: (S) => {
      const p = priceOf(S, g);
      const q = (S.goods && S.goods[g.id]) || 0;
      if (!S.goods) S.goods = {};
      if (q > 0) {
        let qty = q;
        let line = '';
        if (g.risk && Math.random() < 0.12) {
          const lost = Math.max(1, Math.round(qty * 0.3));
          qty -= lost;
          line = `路上损了 ${lost} ${g.unit}。`;
        }
        const gain = Math.round(p * qty);
        money(gain);
        S.goods[g.id] = 0;
        return { lines: [`你把 ${qty} ${g.unit}${g.name}出手，得 ${gain} 贯。${line}`], cls: gain > 0 ? 'up' : '' };
      }
      const cost = Math.round(p * g.batch);
      money(-cost);
      S.goods[g.id] = g.batch;
      return { lines: [`你趁价低进了 ${g.batch} ${g.unit}${g.name}，压了 ${cost} 贯本钱，等行情。`] };
    }
  };
}

ACTIONS.push(...GOODS.map(goodsAction));

/* ================= 消遣：店铺不只是生意，也是去处 ================= */
function ownsShop(S, id) { return (S.shops || []).some(sh => sh.id === id); }

function funAction(def) {
  return {
    id: 'fun_' + def.id, name: def.name, cost: 0,
    desc: def.desc,
    costOf: (S) => def.cost(S),
    descOf: (S) => {
      const c = def.cost(S);
      return def.desc + (c ? ' · ' + c + ' 贯' : ' · 自家铺子，不花钱');
    },
    req: (S) => {
      const c = def.cost(S);
      if (S.money < c) return '需 ' + c + ' 贯';
      if (def.req) { const r = def.req(S); if (r !== true) return r; }
      return true;
    },
    run: (S) => {
      const c = def.cost(S);
      money(-c);
      if (def.once) S.flags = S.flags.filter(f => f !== def.once);
      return def.run(S, c);
    }
  };
}

ACTIONS.push(
  funAction({
    id: 'cha', name: '茶肆听书',
    desc: '一碗茶钱，听一回《三国》',
    cost: (S) => (ownsShop(S, 'cha') ? 0 : 1),
    run: (S, c) => {
      addStat('名声', 1); addStat('才智', 1);
      const lines = [`你在茶肆坐了一下午，听人说《三国》说到「诸葛亮骂王朗」${c ? '，茶钱 ' + c + ' 贯' : '，自家铺子不花钱'}。`];
      if (Math.random() < 0.3) { addStat('气运', 1); lines.push('邻座一位老先生同你说了半日话，临走送你一句谶语。'); }
      return { lines };
    }
  }),
  funAction({
    id: 'jiu', name: '酒肆请客',
    desc: '三杯两盏，交情就厚了',
    cost: (S) => (ownsShop(S, 'jiu') ? 2 : 4),
    run: (S, c) => {
      addStat('名声', 2); S.friends += 1; addStat('体魄', -1);
      return { lines: [`你在酒肆摆了一桌，请了几位朋友，喝到二更才散，花去 ${c} 贯。`], cls: 'up' };
    }
  }),
  funAction({
    id: 'lou', name: '花楼听曲',
    desc: '听一支曲，风雅也招惹是非',
    cost: () => 8,
    req: (S) => (S.age >= 16 ? true : '年岁尚小'),
    run: (S) => {
      addStat('容貌', 1); addStat('气运', 1); addStat('名声', 2);
      const lines = ['你在花楼听了一支琵琶，赏了银子，席间人人称你风流。'];
      if (Math.random() < 0.12) { S.health -= 12; lines.push('回来后身上发痒，请郎中看了半月才好。'); }
      if ((S.office.granted || S.rank >= 3) && Math.random() < 0.1) { addStat('名声', -6); lines.push('有御史风闻此事，上了一道参本，你的名声损了。'); }
      return { lines };
    }
  }),
  funAction({
    id: 'shu', name: '书坊看程文',
    desc: '历科墨卷、程文，揣摩主考脾胃',
    cost: (S) => (ownsShop(S, 'shufang') ? 1 : 3),
    once: '程文',
    run: (S, c) => {
      addStat('才智', 2);
      S.flags.push('程文');
      return { lines: [`你在书坊翻了一整天历科程文，把主考偏好的笔法记了下来，花了 ${c} 贯。下次应试更有把握。`], cls: 'up' };
    }
  }),
  funAction({
    id: 'xiang', name: '香烛铺祈福',
    desc: '一炷香，求个心安',
    cost: (S) => (ownsShop(S, 'xiangzhu') ? 0 : 1),
    run: (S, c) => {
      addStat('气运', 1); addStat('德行', 1);
      return { lines: [`你在香烛铺请了一炷香，跪拜时许了个愿${c ? '，花费 ' + c + ' 贯' : ''}。`] };
    }
  }),
  funAction({
    id: 'yao', name: '药铺抓补药',
    desc: '参芪当归，补一补气血',
    cost: (S) => (ownsShop(S, 'yao') ? 2 : 4),
    run: (S, c) => {
      S.health = Math.min(100, S.health + 6 + rnd(0, 4));
      return { lines: [`你在药铺抓了两副补药，煎服之后，觉着身上暖了些${c ? '，花去 ' + c + ' 贯' : ''}。`], cls: 'up' };
    }
  }),
  {
    id: 'pawn_sell', name: '当铺典当', cost: 0,
    desc: '急用钱时把仓里的货押出去，只值六成',
    req: (S) => {
      const total = Object.keys(S.goods || {}).reduce((s, k) => s + (S.goods[k] || 0), 0);
      return total > 0 ? true : '仓中无货可当';
    },
    run: (S) => {
      let gain = 0; const parts = [];
      GOODS.forEach(g => {
        const q = (S.goods || {})[g.id] || 0;
        if (!q) return;
        const v = Math.round(priceOf(S, g) * q * 0.6);
        gain += v;
        parts.push(`${g.name}${q}${g.unit}`);
        S.goods[g.id] = 0;
      });
      money(gain);
      return { lines: [`你把${parts.join('、')}一并押给了当铺，只得六成价，换回 ${gain} 贯。`], cls: 'down' };
    }
  }
);

/* ================= 家世细算：官宦（一至九品 × 清廉贪墨）、宗室（爵位按血缘） ================= */
function rollOfficial() {
  const table = [[1, 2], [2, 4], [3, 6], [4, 9], [5, 13], [6, 18], [7, 22], [8, 14], [9, 12]];
  const total = table.reduce((s, x) => s + x[1], 0);
  let r = Math.random() * total, rank = 7;
  for (const [rk, w] of table) { r -= w; if (r <= 0) { rank = rk; break; } }
  const sr = Math.random();
  const style = sr < 0.25 ? '清贫' : sr < 0.80 ? '寻常' : '贪墨';
  const base = [0, 46, 40, 34, 28, 24, 20, 16, 12, 9][rank];
  const mul = style === '清贫' ? 0.4 : style === '寻常' ? 1 : 3.2;
  const money = Math.max(1, Math.round(base * mul));
  const land = Math.min(12, Math.max(0, Math.round((10 - rank) * 1.1)));
  const fame = Math.max(5, 18 + (10 - rank) * 6 + (style === '清贫' ? 6 : style === '贪墨' ? -8 : 0));
  const de = (style === '清贫' ? 70 : style === '贪墨' ? 36 : 52) + rnd(-6, 6);
  const stats = {
    体魄: clamp(46 + rnd(-6, 6)), 才智: clamp(38 + (10 - rank) * 3 + rnd(-6, 8)),
    德行: clamp(de), 容貌: clamp(48 + rnd(-8, 10)), 气运: clamp(50 + rnd(-8, 10))
  };
  const flags = ['官宦'];
  if (rank <= 5) flags.push('门荫');
  if (rank <= 7) flags.push('人脉');
  return {
    id: 'guan', name: `官宦之家（${rank} 品·${style}）`, dynamic: 'official',
    desc: `父亲官居${rank}品。${style === '清贫' ? '俸禄之外一文不取，家里陈设与寒士无异，年节还要当东西' : style === '贪墨' ? '任上常例收得不少，宅子新修了两进，门房也养着人' : '循例做官，不上不下，日子过得去'}。`,
    stats, money, land, shop: 0, fame, flags,
    officialRank: rank, officialStyle: style,
    start: style === '清贫'
      ? '父亲把官服叠得整整齐齐：为官一场，能带走的只有这个。'
      : style === '贪墨'
        ? '父亲数着银票，忽然看你一眼：这些东西，将来未必是你的。'
        : '父亲说：读书做官，是本分。'
  };
}

const IMPERIAL_RANKS = [
  { name: '亲王', w: 2, stipend: 120, land: 30 },
  { name: '郡王', w: 6, stipend: 80, land: 20 },
  { name: '镇国将军', w: 10, stipend: 50, land: 12 },
  { name: '辅国将军', w: 14, stipend: 35, land: 8 },
  { name: '奉国将军', w: 16, stipend: 25, land: 6 },
  { name: '镇国中尉', w: 16, stipend: 18, land: 4 },
  { name: '辅国中尉', w: 18, stipend: 14, land: 3 },
  { name: '奉国中尉', w: 18, stipend: 10, land: 2 }
];

function rollImperial() {
  const total = IMPERIAL_RANKS.reduce((s, x) => s + x.w, 0);
  let r = Math.random() * total;
  let rank = IMPERIAL_RANKS[IMPERIAL_RANKS.length - 1];
  for (const x of IMPERIAL_RANKS) { r -= x.w; if (r <= 0) { rank = x; break; } }
  const money = Math.round(rank.stipend * 1.6);
  return {
    id: 'zongshi', name: `宗室之家（${rank.name}）`, dynamic: 'imperial',
    desc: `你是${rank.name}之后，按祖训条章食禄不任事，每年禄米折银约 ${rank.stipend} 贯，另有庄田 ${rank.land} 亩。`,
    stats: {
      体魄: clamp(44 + rnd(-6, 10)), 才智: clamp(46 + rnd(-8, 10)),
      德行: clamp(50 + rnd(-8, 8)), 容貌: clamp(52 + rnd(-6, 10)), 气运: clamp(54 + rnd(-8, 10))
    },
    money, land: rank.land, shop: 0, fame: 30 + Math.round(rank.stipend / 4),
    flags: ['宗室', '祖训'], stipend: rank.stipend, imperialRank: rank.name,
    start: `族谱上你的名字排在「${rank.name}」那一行。父亲说：安分守己，就一世衣食无忧。`
  };
}

/* 祖训约束：宗室不得应举、不得经商、不得从事四民之业 */
function zuXunBlocked(S, id) {
  if (!S || !S.flags || !S.flags.includes('祖训')) return null;
  if (id === 'exam') return '祖训不许应举';
  if (id === 'yinguan') return '宗室不由门荫入仕';
  if (id === 'trade' || id === 'open_trade' || id.startsWith('trade_') || id.startsWith('open_')) return '祖训不许经商';
  if (['farm', 'work', 'craft', 'learn_med', 'practice_med', 'teach_school', 'clerk', 'army', 'quit_trade'].includes(id) ||
      id.startsWith('join_') || id.startsWith('work_')) return '祖训不许从事四民之业';
  return null;
}

/* ================= 市井与风尚（参明代城市生活诸书所记） ================= */
const FASHIONS = [
  { id: 'su',    name: '苏样', desc: '苏州式样风行，衣冠器用皆尚精巧', cloth: 0.8,  fame: 1 },
  { id: 'jing',  name: '京样', desc: '京师式样为正，官宦士人争相效仿', cloth: 1.0,  fame: 1 },
  { id: 'guang', name: '广样', desc: '广船带来舶来之物，富室竞相购求', cloth: 1.15, fame: 0 },
  { id: 'pu',    name: '朴素', desc: '朝廷屡申俭约，奢靡者遭讥',       cloth: 0.9,  fame: -1 }
];

function fashionOf(S) { return S.fashion || FASHIONS[3]; }

ACTIONS.push(
  {
    id: 'garden', name: '造园', cost: 0,
    desc: '叠山理水，筑一处自家园林',
    req: (S) => (S.garden ? '已有园林' : S.money >= 80 ? true : '需 80 贯'),
    run: (S) => {
      money(-80); S.garden = true; addStat('名声', 8);
      return { lines: ['你请香山匠人叠石理水，凿池栽竹，园子落成那日，四邻都来看了。'], cls: 'up' };
    }
  },
  {
    id: 'furniture', name: '置硬木家具', cost: 0,
    desc: '花梨紫檀，一堂好家具也是体面',
    req: (S) => (S.furniture ? '已置办齐整' : S.money >= 30 ? true : '需 30 贯'),
    run: (S) => {
      money(-30); S.furniture = true; addStat('名声', 4);
      return { lines: ['你置了一堂花梨桌椅，榫卯严丝合缝，来客都要摸一摸。'], cls: 'up' };
    }
  },
  {
    id: 'guild', name: '入行会', cost: 0,
    desc: '入了行帮，接活有人照应，也有人说闲话',
    req: (S) => (S.guild ? '已入行会' : (!S.trade || S.trade === 'none') ? '须先有一门营生' : S.money >= 10 ? true : '需 10 贯'),
    run: (S) => {
      money(-10); S.guild = true; addStat('名声', 2);
      return { lines: ['你交了香火钱入行会，从此接活有同行照应，行价也有人替你说话。'], cls: 'up' };
    }
  },
  {
    id: 'publish', name: '刻书', cost: 0,
    desc: '刻一部书，留名也是留财',
    req: (S) => {
      if (S.flags.includes('刻书')) return '已刻过一部';
      if (!(sk(S, '文名') >= 10 || S.rank >= 2)) return '须有文名或功名';
      if (S.money < 40) return '需 40 贯';
      return true;
    },
    run: (S) => {
      money(-40); S.flags.push('刻书'); addStat('名声', 8);
      let extra = '';
      if (Math.random() < 0.35) { money(30); extra = '书卖得极好，士林争相购求，竟还赚了三十贯。'; }
      return { lines: ['你把历年所作刻成一册，送人之外也发到书坊寄卖。' + extra], cls: 'up' };
    }
  },
  {
    id: 'monitor', name: '纳粟入监', cost: 0,
    desc: '捐一笔粟，换一个例监的名分，可直接应乡试',
    req: (S) => (S.gender === '女' ? '女子不得入监' : S.rank >= 2 ? '已有功名' : S.money >= 60 ? true : '需 60 贯'),
    run: (S) => {
      money(-60); S.rank = 2; addStat('名声', -4); S.flags.push('例监');
      return { lines: ['你纳粟入了国子监，从此可应乡试。清议说这是「铜臭功名」。'], cls: 'up' };
    }
  },
  {
    id: 'bridge', name: '修桥铺路', cost: 0,
    desc: '出资修一段桥路，乡里立碑',
    req: (S) => (S.money >= 15 ? true : '需 15 贯'),
    run: (S) => {
      money(-15); addStat('德行', 8); addStat('名声', 5);
      if (!S.flags.includes('善名')) S.flags.push('善名');
      return { lines: ['你出钱修了村口的桥，石上刻了你的名字，过路的人都念一声。'], cls: 'up' };
    }
  }
);

/* ================= 年龄门槛：什么事到什么时候才能做 ================= */
const AGE_MIN = {
  study: 6, clinic: 6, heal: 6, piety: 6, chores: 6, ask_money: 8,
  farm: 10, work: 10, bridge: 12, publish: 12, monitor: 12, social: 12, quit_trade: 12,
  craft: 14, exam: 8, guild: 16, land: 16, travel: 16, office: 16, yinguan: 16,
  garden: 16, furniture: 16, pawn_sell: 16, teach: 22, marry: 15
};

function ageBlocked(S, id) {
  let need = AGE_MIN[id];
  if (need === undefined) {
    if (id.startsWith('living_')) need = 12;
    else if (id.startsWith('open_')) need = 16;
    else if (id.startsWith('trade_')) need = 16;
    else if (id.startsWith('fun_')) need = 12;
    else if (id.startsWith('join_')) need = 14;
    else if (id.startsWith('work_')) need = 14;
    else need = 12;
  }
  if (S.age < need) return `年方 ${S.age} 岁，还做不得此事`;
  return null;
}


/* ================= 各行当的年入（按等级：学徒 → 宗师） ================= */
const TRADE_INCOME = {
  nong: [2, 4, 7, 12, 20],
  jiang: [3, 5, 9, 15, 26],
  shang: [4, 8, 15, 28, 50],
  shu: [2, 4, 7, 12, 20],
  yi: [3, 6, 10, 18, 30],
  li: [2, 4, 6, 10, 16],
  jun: [2, 4, 7, 12, 22],
  song: [3, 6, 10, 18, 30],
  mu: [4, 7, 12, 20, 35],
  bu: [1, 3, 5, 9, 15],
  seng: [1, 2, 4, 7, 12],
  you: [2, 4, 7, 12, 20],
  biao: [3, 6, 10, 18, 30],
  cha: [2, 4, 7, 11, 18],
  hua: [2, 4, 7, 13, 22]
};

/* ================= 职业事务：每年行当里的事 ================= */
/* eff: money 贯 / skill 本行手艺 / fame 名声 / health 气血 / wit 才智 */
const TRADE_EVENTS = {
  nong: [
    { t: '久旱', text: '入夏久旱，田里裂了口子，族里商量凑钱修渠。', opts: [
      { label: '出钱修渠（8 贯）', need: 8, eff: { money: -8, skill: 3, fame: 3 }, say: '渠修成了，水进了田，族里记你一笔功。' },
      { label: '去邻县帮工度荒', eff: { money: 3, skill: 1, health: -4 }, say: '你外出帮了半年工，家里少一张嘴，田里荒了些。' },
      { label: '守着田等雨', eff: { money: -2, health: -2 }, say: '雨来得太晚，收成减了三成，人也熬瘦了。' }
    ] },
    { t: '牛疫', text: '村里病倒两头牛，眼看春耕要误。', opts: [
      { label: '与人合买一头（6 贯）', need: 6, eff: { money: -6, skill: 2, fame: 1 }, say: '两家合用一头牛，春耕赶上了。' },
      { label: '自己拉犁', eff: { health: -6, skill: 4 }, say: '你与兄弟轮流拉犁，肩膀磨破了，农活却更熟了。' },
      { label: '改种杂粮', eff: { money: -1, skill: 1 }, say: '你改种豆黍，收成少些，总算没误农时。' }
    ] }
  ],
  jiang: [
    { t: '官府点匠', text: '县里要修衙署，点名征匠，去了管饭不给工钱。', opts: [
      { label: '应征（手艺精进）', eff: { skill: 6, money: 0, health: -3 }, say: '你在衙署工地上做了三个月，见了不少好手艺。' },
      { label: '使钱免役（5 贯）', need: 5, eff: { money: -5, skill: 1 }, say: '你托人说情，花钱免了这趟役。' },
      { label: '推病不去', eff: { fame: -2, skill: 0 }, say: '差役骂了几句走了，行里有人说你滑头。' }
    ] },
    { t: '料子出错', text: '东家一批木料受潮变形，硬要你照旧做出来。', opts: [
      { label: '照做，收工钱', eff: { money: 4, fame: -3 }, say: '东西勉强交差，东家没说什么，口碑却坏了。' },
      { label: '退回料子重做', eff: { money: -3, fame: 4, skill: 2 }, say: '你赔了几贯，把活重做了一遍，东家从此只找你。' }
    ] }
  ],
  shang: [
    { t: '行市起落', text: '今年棉价忽高忽低，同行都在观望。', opts: [
      { label: '囤一批等涨（10 贯本钱）', need: 10, eff: { money: 8, skill: 2 }, say: '你压了一仓棉，入冬涨价，转手赚了八贯。' },
      { label: '按老规矩走货', eff: { money: 2, skill: 1 }, say: '你不赌行情，稳稳做了几笔。' },
      { label: '合伙放账收息', eff: { money: 4, fame: -2 }, say: '你把钱放给急用的商户，利息不薄，名声稍损。' }
    ] },
    { t: '路遇盘查', text: '货船在关津被拦，税吏说要开箱验货。', opts: [
      { label: '照章纳税（4 贯）', need: 4, eff: { money: -4, fame: 1 }, say: '你如数纳了税，单据齐全，一路顺畅。' },
      { label: '塞钱了事（2 贯）', need: 2, eff: { money: -2, fame: -1 }, say: '税吏收了钱，箱子没开。' },
      { label: '硬顶不放', eff: { money: -6, fame: 2 }, say: '你据理力争，货扣了三日，最后仍按章放行。' }
    ] }
  ],
  yi: [
    { t: '疑难症', text: '富户老母久病不愈，请了三位郎中都没起色。', opts: [
      { label: '接下这桩（尽力施治）', eff: { skill: 5, money: 6, fame: 3 }, say: '你换了方子，老人渐渐能进食，富户重谢。' },
      { label: '推辞不接', eff: { fame: -1 }, say: '你说自己学浅，不敢误人，富户另请高明。' },
      { label: '请师父同去', eff: { skill: 3, money: 2, fame: 1 }, say: '你请师父一同诊治，学到了辨证的法子。' }
    ] },
    { t: '瘟疫', text: '城外几个村子起了时疫，官府设局施药。', opts: [
      { label: '入局施药（危险）', eff: { skill: 6, fame: 6, health: -6 }, say: '你在疫区熬了一个月，救活不少人，自己也病了一场。' },
      { label: '捐药不出人（5 贯）', need: 5, eff: { money: -5, fame: 3 }, say: '你捐了几味药，人没去，乡里仍念你的好。' },
      { label: '闭门谢客', eff: { fame: -2, money: 1 }, say: '你关了门，安稳度过，坊间议论你惜命。' }
    ] }
  ],
  li: [
    { t: '案牍出错', text: '一桩田产案的文书出了岔子，上头要追责。', opts: [
      { label: '自己担下', eff: { fame: 3, money: -2 }, say: '你把错认在自己身上，堂官记你一份厚道。' },
      { label: '推到书办身上', eff: { fame: -3, money: 1 }, say: '事情推了出去，底下人心里不服。' },
      { label: '连夜补正', eff: { skill: 4, health: -3 }, say: '你熬了三夜把卷宗补齐，没人再提这事。' }
    ] },
    { t: '上官索贿', text: '新来的主簿递话，说年节该“意思意思”。', opts: [
      { label: '照送（8 贯）', need: 8, eff: { money: -8, fame: 1 }, say: '你送了礼，往后差事好办了些。' },
      { label: '装作不懂', eff: { fame: -2, skill: 1 }, say: '你把话岔开了，主簿脸色不好看，差事也难做些。' },
      { label: '托人转圜（3 贯）', need: 3, eff: { money: -3, skill: 2 }, say: '你托同僚递了几句软话，事情糊过去了。' }
    ] }
  ],
  song: [
    { t: '棘手讼案', text: '一户人家争继嗣，两房各执一词，出得起钱。', opts: [
      { label: '接下，替弱房说话', eff: { money: 5, fame: 2, skill: 3 }, say: '你替孤儿寡母争回一份产业，县里传你的名。' },
      { label: '接下，替强房说话', eff: { money: 9, fame: -4 }, say: '你替有钱那房赢了官司，钱袋鼓了，骂名也来了。' },
      { label: '劝两家和解', eff: { money: 2, fame: 3, skill: 1 }, say: '你在祠堂里劝了半天，两家各让一步。' }
    ] }
  ],
  mu: [
    { t: '东家调任', text: '东翁要调任邻府，问你愿不愿随行。', opts: [
      { label: '随行赴任', eff: { money: 6, skill: 4, health: -3 }, say: '你随东家走了几百里，新衙门里诸事从头理。' },
      { label: '留乡另寻馆地', eff: { money: 1, skill: 1, fame: 1 }, say: '你留在本乡，另投了一位县尊。' },
      { label: '趁势辞幕归耕', eff: { money: 0, fame: 1, health: 4 }, say: '你辞了幕，回乡住了半年，人也松快了。' }
    ] }
  ],
  jun: [
    { t: '边警', text: '北边传来警报，卫所要抽调人马。', opts: [
      { label: '请缨出战', eff: { skill: 5, money: 3, health: -8, fame: 4 }, say: '你随队出塞，斩获不多，却立了名。' },
      { label: '留守本卫', eff: { skill: 1, money: 1 }, say: '你留守城池，日子照旧。' },
      { label: '使钱避调（6 贯）', need: 6, eff: { money: -6, fame: -3 }, say: '你花钱留在本卫，同袍背后议论。' }
    ] }
  ],
  _any: [
    { t: '行内是非', text: '{trade}行里起了争执，众人推你出来说句话。', opts: [
      { label: '出面调停', eff: { fame: 2, skill: 2 }, say: '你把话说圆了，两边都欠你一份人情。' },
      { label: '避而不问', eff: { fame: -1 }, say: '你躲开了，行里有人说你不担事。' },
      { label: '趁势揽下活计', eff: { money: 4, fame: -1 }, say: '你趁机接了两笔活，钱挣了，人情薄了。' }
    ] },
    { t: '收徒', text: '有后生上门，想拜在你门下学手艺。', opts: [
      { label: '收下，倾囊相授', eff: { fame: 4, money: 2, skill: 2 }, say: '你收了徒弟，教得严，行里都说你有传承。' },
      { label: '收下，留一手', eff: { money: 3, fame: -1 }, say: '你收了束修，关键的几手没教。' },
      { label: '婉拒', eff: {}, say: '你说自己还不到收徒的时候。' }
    ] },
    { t: '同业压价', text: '同行几家联手压价，要把生人挤出去。', opts: [
      { label: '跟着降价硬撑', eff: { money: -3, skill: 2 }, say: '你撑了半年，本钱薄了些，客源稳住了。' },
      { label: '做精不做多', eff: { money: 2, skill: 4, fame: 2 }, say: '你把活做细，反倒有人愿意多出钱。' },
      { label: '另寻门路', eff: { money: 1, skill: 1 }, say: '你换了个地界做买卖，从头来过。' }
    ] }
  ]
};


/* ================= 女行：明代女子自己的一口饭 ================= */
const FEMALE_ONLY_TRADES = ['xiu', 'wen', 'nyi', 'ru', 'chu', 'mei', 'shi', 'nvs', 'dian'];
const MALE_ONLY_TRADES = ['song', 'mu', 'li', 'jun', 'jiang', 'shang', 'biao'];

const FEMALE_CAREERS = [
  {
    id: 'xiu',
    join: { name: '学绣', cost: 4, req: (S) => (S.stats.容貌 >= 35 ? true : '手上不稳'), text: '你跟着绣坊的师傅学穿针，一年下来，指头扎满了眼。' },
    work: { name: '做绣活', desc: '针线换钱，手快眼细', text: '你替绣庄做帕子、荷包、裙襕，一年下来眼睛熬得发花，钱是一个铜板一个铜板攒的。' },
    fee: (lv, S) => 2 + lv * 3 + (S.fashion && S.fashion.id === 'su' ? 2 : 0),
    effects: (S) => { addStat('名声', 1); },
    flavor: '绣庄接了织造局的活，赶了三个月的夜工，交上去被挑了两处针脚。'
  },
  {
    id: 'wen',
    join: { name: '随稳婆学手', cost: 2, req: (S) => (S.age >= 14 ? true : '年纪太小'), text: '你跟着巷尾的老稳婆走门串户，先学洗手、备水、剪脐带。' },
    work: { name: '接生', desc: '一手托两条命，夜里也要出门', text: '这一年你接了多少胎记不清了，只记得有几夜是在人家灶房等到天亮。' },
    fee: (lv, S) => 2 + lv * 3,
    effects: (S) => { addStat('德行', 2); },
    flavor: '有户人家生了双胎，母子平安，塞给你一匹红布。'
  },
  {
    id: 'nyi',
    join: { name: '学女科', cost: 10, req: (S) => (S.stats.才智 >= 45 ? true : '才智不足（需 45）'), text: '你随一位女医抄方，学的是妇人调经、安胎、产后诸症。' },
    work: { name: '看女科', desc: '内眷不便见男医，女医因此吃香', text: '你出入内宅替夫人小姐诊脉，药钱诊金都比男医低些，胜在人家肯让你进门。' },
    fee: (lv, S) => 3 + lv * 4,
    effects: (S) => { addStat('名声', 2); addStat('德行', 1); },
    flavor: '有位小姐的病久治不愈，你换了方子，三个月后能下床了。'
  },
  {
    id: 'ru',
    join: { name: '入府做乳母', cost: 0, req: (S) => (S.children.length > 0 || S.age >= 18 ? true : '须生育过'), text: '你进了城东大户的门，给孩子喂奶，自己家的娃留在乡下。' },
    work: { name: '乳养', desc: '吃住在主家，进项稳当，见不着自家孩子', text: '你在主家喂了一年孩子，主家待你不薄，只是夜里想起自家的娃，睡不踏实。' },
    fee: (lv, S) => 2 + lv * 2,
    effects: (S) => { addStat('名声', 1); },
    flavor: '主家孩子认你，见你就伸手；主母看在眼里，脸色不太好。'
  },
  {
    id: 'chu',
    join: { name: '学庖厨', cost: 3, req: () => true, text: '你跟着厨下大娘学切配火候，先切了半年的菜。' },
    work: { name: '掌灶', desc: '一手好菜，走到哪家都有人请', text: '你替人家办席面，四冷四热八碟，一天站到黑，赏钱是实打实的。' },
    fee: (lv, S) => 2 + lv * 3,
    effects: (S) => { addStat('名声', 1); },
    flavor: '县里富户办寿宴，点了你的八宝鸭，事后又请你去做了一桌。'
  },
  {
    id: 'mei',
    join: { name: '随媒婆跑腿', cost: 1, req: (S) => (S.stats.容貌 >= 30 ? true : '不便抛头露面'), text: '你跟着城里有名的媒婆走街串巷，记人家的年岁、家底、脾气。' },
    work: { name: '说亲', desc: '一张嘴走遍两城，成不成都有谢礼', text: '你一年说了十几门亲，成的有谢礼，不成也落一顿茶饭。' },
    fee: (lv, S) => 2 + lv * 2 + Math.floor(S.stats.容貌 / 50),
    effects: (S) => { addStat('名声', 1); addStat('德行', -1); },
    flavor: '有一门亲事瞒了男方的病，过门后闹起来，人家堵着门骂了你三天。'
  },
  {
    id: 'shi',
    join: { name: '学跳神', cost: 2, req: () => true, text: '你跟着师婆学唱神歌、画符、烧纸，夜里在院子里练到嗓子哑。' },
    work: { name: '做法事', desc: '禳灾祈福，信的人家舍得给钱', text: '你替人家禳灾、叫魂、送祟，锣鼓一响，围观的人比主家还多。' },
    fee: (lv, S) => 1 + lv * 3,
    effects: (S) => { addStat('名声', 1); },
    flavor: '有户人家的孩子病了，你跳了一夜神，第二天孩子退了烧，你家门口排起了队。'
  },
  {
    id: 'nvs',
    join: { name: '设闺塾', cost: 8, req: (S) => (S.stats.才智 >= 55 ? true : '才智不足（需 55）'), text: '你在自家堂屋摆了几张矮桌，教邻里女孩认字、读《女诫》、做针线。' },
    work: { name: '教女弟子', desc: '束脩不厚，胜在清白体面', text: '你教女孩们认字、写字、算账，一年收几份束脩，街坊都称你一声先生。' },
    fee: (lv, S) => 2 + lv * 2 + Math.floor(S.stats.才智 / 40),
    effects: (S) => { addStat('名声', 2); addStat('德行', 1); },
    flavor: '有户人家说女儿不必读书，把娃领走了；你也没争，只在门口站了一会儿。'
  },
  {
    id: 'dian',
    join: { name: '开一间小铺', cost: 12, req: (S) => (S.money >= 12 ? true : '本钱不足'), text: '你盘下街口一间小铺面，卖茶、卖酒、卖几样点心。' },
    work: { name: '当垆经营', desc: '站柜台、算账、应付客人，比谁都累', text: '你天不亮就起来烧水，夜里数完铜钱才睡。客人有轻薄的，你端起茶壶就泼过去。' },
    fee: (lv, S) => 3 + lv * 4,
    effects: (S) => { addStat('名声', 1); },
    flavor: '有两个泼皮来吃白食，你叫了巡街的，从此没人敢在你铺里闹。'
  }
];


TRADE_DEFS.push(
  { id: 'xiu', name: '绣作', skill: '绣艺', epithet: '针神',   ranks: ['绣女', '绣娘', '绣作头', '绣庄掌事', '绣作大家'] },
  { id: 'wen', name: '稳婆', skill: '接生术', epithet: '送子', ranks: ['帮手', '稳婆', '老稳婆', '接生圣手', '送子娘娘'] },
  { id: 'nyi', name: '女科', skill: '女科术', epithet: '杏林女史', ranks: ['药婆', '女医', '女郎中', '女科圣手', '女国手'] },
  { id: 'ru',  name: '乳养', skill: '乳养', epithet: '乳保',   ranks: ['帮佣', '乳母', '上房乳母', '府中管事', '官眷乳母'] },
  { id: 'chu', name: '庖厨', skill: '庖艺', epithet: '鼎俎',   ranks: ['灶下丫头', '厨娘', '大厨娘', '府上庖头', '庖厨大家'] },
  { id: 'mei', name: '说媒', skill: '媒才', epithet: '月老',   ranks: ['跑腿', '媒婆', '官媒', '城中第一媒', '官媒正'] },
  { id: 'shi', name: '师婆', skill: '祝祷', epithet: '灵验',   ranks: ['烧香婆', '师婆', '跳神师婆', '掌坛', '一方灵应'] },
  { id: 'nvs', name: '闺塾', skill: '闺学', epithet: '女先生', ranks: ['伴读', '塾师', '女塾师', '名门女师', '女中师表'] },
  { id: 'dian', name: '当垆', skill: '店务', epithet: '女东家', ranks: ['帮工', '当垆女', '掌灶娘子', '女店主', '一方女东家'] }
);

FEMALE_CAREERS.forEach(d => ACTIONS.push(...careerActions(d)));

Object.assign(TRADE_INCOME, {
  xiu: [2, 4, 7, 12, 20],
  wen: [2, 4, 6, 10, 16],
  nyi: [3, 6, 10, 18, 30],
  ru:  [2, 3, 5, 8, 13],
  chu: [2, 4, 7, 11, 18],
  mei: [2, 3, 5, 8, 13],
  shi: [1, 3, 5, 9, 15],
  nvs: [2, 4, 7, 11, 18],
  dian: [3, 6, 10, 17, 28]
});

Object.assign(TRADE_EVENTS, {
  xiu: [
    { t: '织造局点绣', text: '织造局要一批龙袍补子，绣坊把头把活分了下来，工期只有两个月。', opts: [
      { label: '连夜赶工', eff: { money: 6, skill: 5, health: -6 }, say: '你熬了两个月，眼睛肿了半个月，活计交上去受了赏。' },
      { label: '推给别人做', eff: { money: 1, fame: -2 }, say: '你把活推出去了，工钱薄，坊里说你不担事。' },
      { label: '只接一半', eff: { money: 3, skill: 2 }, say: '你量力接了一半，做完针脚齐整，没人挑出错。' }
    ] }
  ],
  wen: [
    { t: '难产', text: '半夜有人拍门，说媳妇难产，已经请了两个稳婆都没法子。', opts: [
      { label: '立刻去', eff: { skill: 6, money: 3, fame: 3, health: -5 }, say: '你在产房里守到天亮，孩子落地时哭了一声，满屋人都瘫了。' },
      { label: '推说不敢接', eff: { fame: -3 }, say: '你关了门，第二天听说母子都没保住。' },
      { label: '荐老稳婆去', eff: { money: 1, fame: 1 }, say: '你把活荐给了师父，师父事后分了你一份谢礼。' }
    ] }
  ],
  nyi: [
    { t: '内宅请诊', text: '一位官眷产后失调，男医不便入内，托人请你去看。', opts: [
      { label: '入宅诊治', eff: { skill: 5, money: 8, fame: 4 }, say: '你开了三剂方子，官眷气色渐好，府里送了你一匹绸。' },
      { label: '只开方不进门', eff: { skill: 2, money: 3 }, say: '你隔帘问诊，开了方子，稳妥但挣得少。' },
      { label: '辞了这桩', eff: { fame: -1 }, say: '你说自己医道尚浅，怕误了贵人。' }
    ] }
  ],
  dian: [
    { t: '泼皮吃白食', text: '两个泼皮赖在铺子里，吃了喝了不给钱，还说你家酒酸。', opts: [
      { label: '叫巡街的来', eff: { money: -2, fame: 3 }, say: '你花了两个钱请巡街的来，泼皮被赶走，街坊都夸你有胆。' },
      { label: '忍下这口气', eff: { money: -3, fame: -2 }, say: '你自认倒霉，往后他们来得更勤了。' },
      { label: '拿茶壶泼过去', eff: { health: -3, fame: 2 }, say: '你端起滚茶泼过去，泼皮骂骂咧咧走了，你的手也被烫了。' }
    ] }
  ]
});
