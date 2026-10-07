import { DEFAULT_SCENES, ICON_CHOICES, CARD_COLORS, MIN_EMOTIONS, MAX_EMOTIONS } from './data.js';
import {
  loadSettings, saveSettings, defaultSettings, exportJson, importJson,
  listCustomScenes, putCustomScene, deleteCustomScene, shrinkImage, requestPersist,
} from './store.js';

const app = document.getElementById('app');

const state = {
  screen: 'start',
  settings: loadSettings(),
  customScenes: [], // { id, title, situation, line, blob, createdAt, url }
  sceneIndex: 0,
  pick: { line: null, emotion: null }, // 「じぶんで やる」で選んだもの
  bigCard: null, // 回答者が全画面で見せているカードの index
  tab: 'emotions',
  iconPickFor: null, // アイコンを選んでいる気持ちの index
};

// ---------- 小道具 ----------

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function faceHtml(e, cls = 'face') {
  return e.img
    ? `<img class="${cls}" src="${esc(e.img)}" alt="" draggable="false">`
    : `<span class="${cls} face-emoji" aria-hidden="true">${esc(e.emoji)}</span>`;
}

function sceneArt(sc, cls = 'scene-art') {
  if (sc.url || sc.img) return `<img class="${cls}" src="${esc(sc.url || sc.img)}" alt="" draggable="false">`;
  return `<div class="${cls} scene-placeholder"><span class="ph-emoji">${esc(sc.emoji || '🖼️')}</span><span class="ph-note">え は じゅんびちゅう</span></div>`;
}

const backBtn = (to, label = 'もどる') =>
  `<button class="back" data-go="${to}"><span aria-hidden="true">◀</span> ${label}</button>`;

function visibleScenes() {
  const hidden = new Set(state.settings.hiddenScenes);
  return [...DEFAULT_SCENES.filter((s) => !hidden.has(s.id)), ...state.customScenes];
}

function save() {
  saveSettings(state.settings);
}

function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2200);
}

// ---------- 画面 ----------

const screens = {
  start: () => `
    <section class="screen start">
      <div class="start-bg" style="background-image:url('images/start_bg.webp')"></div>
      <div class="start-panel">
        <p class="start-sub">おなじ ことば・ちがう きもち</p>
        <h1 class="start-title">きもちを<br>つたえよう</h1>
        <button class="big-btn btn-go" data-go="role"><span class="btn-ico">▶️</span><span>はじめる</span></button>
      </div>
      <button class="hold-btn" data-hold="settings" aria-label="せってい（ながおし）">
        <span class="hold-ring"></span><span class="btn-ico-s">⚙️</span>
        <span class="hold-label">せってい<br><small>ながく おす</small></span>
      </button>
    </section>`,

  role: () => `
    <section class="screen">
      <header class="bar">${backBtn('start')}<h2>どっちを する？</h2></header>
      <div class="choice2">
        <button class="choice btn-give" data-go="give"><span class="choice-ico">🎭</span><span>もんだいを<br>だす</span></button>
        <button class="choice btn-answer" data-go="answer"><span class="choice-ico">🙋</span><span>もんだいに<br>こたえる</span></button>
      </div>
    </section>`,

  give: () => `
    <section class="screen">
      <header class="bar">${backBtn('role')}<h2>どれで あそぶ？</h2></header>
      <div class="choice2">
        <button class="choice btn-scene" data-go="sceneList"><span class="choice-ico">🖼️</span><span>ばめんを<br>えらぶ</span></button>
        <button class="choice btn-self" data-action="startSelf"><span class="choice-ico">🗣️</span><span>じぶんで<br>やる</span></button>
      </div>
    </section>`,

  sceneList: () => {
    const list = visibleScenes();
    return `
    <section class="screen">
      <header class="bar">${backBtn('give')}<h2>ばめんを えらんでね</h2></header>
      <div class="scene-grid">
        ${list.map((sc, i) => `
          <button class="scene-tile" data-action="openScene" data-i="${i}">
            ${sceneArt(sc, 'tile-art')}
            <span class="tile-line">${sc.line ? `「${esc(sc.line)}」` : esc(sc.title)}</span>
            ${sc.line ? `<span class="tile-title">${esc(sc.title)}</span>` : ''}
          </button>`).join('')}
      </div>
    </section>`;
  },

  sceneView: () => {
    const list = visibleScenes();
    const i = Math.min(state.sceneIndex, list.length - 1);
    const sc = list[i];
    if (!sc) return screens.sceneList();
    return `
    <section class="screen scene-view">
      <header class="bar">${backBtn('sceneList', 'ばめん いちらん')}<span class="count">${i + 1} / ${list.length}</span></header>
      <div class="scene-body">
        <div class="scene-frame">${sceneArt(sc)}</div>
        <div class="scene-side">
          ${sceneSituation(sc) ? `<p class="scene-sit">${esc(sceneSituation(sc))}…</p>` : ''}
          ${sc.line ? `<div class="bubble">「${esc(sc.line)}」</div>` : ''}
          <p class="scene-q">どんな きもちで いったかな？</p>
          <p class="scene-hint">👀 どこを みて そう おもった？</p>
          <div class="nav2">
            <button class="nav-btn" data-action="prevScene" ${i === 0 ? 'disabled' : ''}>◀ まえ</button>
            <button class="nav-btn nav-next" data-action="nextScene" ${i === list.length - 1 ? 'disabled' : ''}>つぎ ▶</button>
          </div>
        </div>
      </div>
    </section>`;
  },

  pickLine: () => `
    <section class="screen">
      <header class="bar">${backBtn('give')}<h2>どの ことばを いう？</h2>${steps(1)}</header>
      <div class="line-grid">
        ${state.settings.lines.map((l, i) => `
          <button class="line-card ${state.pick.line === l ? 'on' : ''}" data-action="pickLine" data-i="${i}">${esc(l)}</button>`).join('')}
      </div>
    </section>`,

  pickEmotion: () => `
    <section class="screen">
      <header class="bar">${backBtn('pickLine')}<h2>どんな きもちで いう？</h2>${steps(2)}</header>
      <p class="said">「${esc(state.pick.line)}」</p>
      ${emotionCards('pickEmotion')}
    </section>`,

  confirm: () => {
    const e = pickedEmotion();
    return `
    <section class="screen">
      <header class="bar">${backBtn('pickEmotion')}<h2>これで いい？</h2>${steps(3)}</header>
      <div class="confirm-body">
        <div class="confirm-line">「${esc(state.pick.line)}」</div>
        <div class="confirm-plus">＋</div>
        <div class="confirm-emo" style="--c:${colorOf(e)}">${faceHtml(e)}<span>${esc(e.name)}</span></div>
      </div>
      <p class="mirror-note">📺 モニターに うつしてから おしてね</p>
      <div class="nav2 confirm-nav">
        <button class="nav-btn" data-go="pickLine">↩ えらびなおす</button>
        <button class="nav-btn nav-start" data-go="present">これで はじめる ▶</button>
      </div>
    </section>`;
  },

  present: () => `
    <section class="screen present">
      <div class="present-line">「${esc(state.pick.line)}」</div>
      <p class="present-ask">どんな きもちで いったかな？</p>
      <button class="reveal-btn" data-go="reveal">🎉 こたえを みる</button>
      <div class="present-nav">
        <button class="nav-btn" data-go="give">やめる</button>
      </div>
    </section>`,

  // こたえあわせ：出題者が えらんだ きもちを 発表する
  reveal: () => {
    const e = pickedEmotion();
    return `
    <section class="screen reveal" style="--c:${colorOf(e)}">
      <p class="reveal-head">こたえ</p>
      <div class="reveal-body">
        <div class="reveal-line">「${esc(state.pick.line)}」は</div>
        <div class="reveal-card">${faceHtml(e, 'reveal-face')}<span class="reveal-name">${esc(e.name)}</span></div>
        <div class="reveal-tail">きもちで いいました</div>
      </div>
      <div class="nav2 reveal-nav">
        <button class="nav-btn" data-go="present">↩ もういちど みる</button>
        <button class="nav-btn nav-start" data-action="startSelf">🔁 つぎの もんだい</button>
        <button class="nav-btn" data-go="give">おわる</button>
      </div>
    </section>`;
  },

  answer: () => {
    if (state.bigCard !== null) {
      const e = state.settings.emotions[state.bigCard];
      return `
      <section class="screen big-card" style="--c:${colorOf(e)}" data-action="closeBig">
        ${faceHtml(e, 'big-face')}
        <div class="big-name">${esc(e.name)}</div>
        <p class="big-hint">タッチで もどる</p>
      </section>`;
    }
    return `
    <section class="screen">
      <header class="bar">${backBtn('role')}<h2>どんな きもち？</h2></header>
      ${emotionCards('showBig')}
    </section>`;
  },

  settings: () => `
    <section class="screen settings">
      <header class="bar">${backBtn('start', 'おわる')}<h2>せってい</h2></header>
      <nav class="tabs">
        ${[['emotions', 'きもち'], ['lines', 'ことば'], ['scenes', 'ばめん'], ['data', 'データ']]
          .map(([k, l]) => `<button class="tab ${state.tab === k ? 'on' : ''}" data-tab="${k}">${l}</button>`).join('')}
      </nav>
      <div class="tab-body">${settingsTabs[state.tab]()}</div>
      ${state.iconPickFor !== null ? iconPicker() : ''}
    </section>`,
};

function pickedEmotion() {
  return state.settings.emotions.find((x) => x.id === state.pick.emotion) || state.settings.emotions[0];
}

// 古い保存データ（question だけ持つ場面）も読めるようにする
const sceneSituation = (sc) => sc.situation ?? sc.question ?? '';

function steps(n) {
  return `<ol class="steps">${[1, 2, 3].map((k) => `<li class="${k <= n ? 'on' : ''}">${k}</li>`).join('')}</ol>`;
}

function colorOf(e) {
  const i = state.settings.emotions.indexOf(e);
  return CARD_COLORS[(i < 0 ? 0 : i) % CARD_COLORS.length];
}

function emotionCards(action) {
  const es = state.settings.emotions;
  return `<div class="emo-row n${es.length}">
    ${es.map((e, i) => `
      <button class="emo-card ${action === 'pickEmotion' && state.pick.emotion === e.id ? 'on' : ''}"
        style="--c:${CARD_COLORS[i % CARD_COLORS.length]}" data-action="${action}" data-i="${i}">
        ${faceHtml(e)}<span class="emo-name">${esc(e.name)}</span>
      </button>`).join('')}
  </div>`;
}

// ---------- せってい ----------

const settingsTabs = {
  emotions: () => {
    const es = state.settings.emotions;
    return `
    <p class="help">きもちは ${MIN_EMOTIONS}〜${MAX_EMOTIONS}こ。かえたら「データ」から JSON を かきだして、せいとの iPad に よみこませてください。</p>
    <ul class="edit-list">
      ${es.map((e, i) => `
        <li class="edit-row">
          <button class="icon-btn" data-action="pickIcon" data-i="${i}" aria-label="アイコンを かえる">${faceHtml(e, 'mini-face')}</button>
          <input class="txt" data-field="emotion" data-i="${i}" value="${esc(e.name)}" maxlength="20">
          ${rowTools(i, es.length, 'Emotion', es.length <= MIN_EMOTIONS)}
        </li>`).join('')}
    </ul>
    <button class="add-btn" data-action="addEmotion" ${es.length >= MAX_EMOTIONS ? 'disabled' : ''}>＋ きもちを ふやす</button>`;
  },

  lines: () => {
    const ls = state.settings.lines;
    return `
    <ul class="edit-list">
      ${ls.map((l, i) => `
        <li class="edit-row">
          <input class="txt" data-field="line" data-i="${i}" value="${esc(l)}" maxlength="30">
          ${rowTools(i, ls.length, 'Line', ls.length <= 1)}
        </li>`).join('')}
    </ul>
    <form class="add-form" data-form="addLine">
      <input class="txt" name="line" placeholder="あたらしい ことば" maxlength="30">
      <button class="add-btn">＋ ふやす</button>
    </form>`;
  },

  scenes: () => {
    const hidden = new Set(state.settings.hiddenScenes);
    return `
    <h3>はじめから ある ばめん</h3>
    <ul class="scene-edit">
      ${DEFAULT_SCENES.map((sc) => `
        <li class="${hidden.has(sc.id) ? 'off' : ''}">
          ${sceneArt(sc, 'thumb')}
          <div class="se-text"><b>${esc(sc.title)}「${esc(sc.line)}」</b><span>${esc(sc.situation)}</span></div>
          <button class="toggle" data-action="toggleScene" data-id="${sc.id}">${hidden.has(sc.id) ? 'かくしている' : 'つかう'}</button>
        </li>`).join('')}
    </ul>
    <h3>じぶんで ついかした ばめん</h3>
    <ul class="scene-edit">
      ${state.customScenes.length ? '' : '<li class="empty">まだ ありません</li>'}
      ${state.customScenes.map((sc) => `
        <li>
          ${sceneArt(sc, 'thumb')}
          <div class="se-text">
            <input class="txt" data-field="sceneTitle" data-id="${sc.id}" value="${esc(sc.title)}" maxlength="20">
            <input class="txt" data-field="sceneSit" data-id="${sc.id}" value="${esc(sceneSituation(sc))}" placeholder="ばめんの せつめい" maxlength="40">
            <input class="txt" data-field="sceneLine" data-id="${sc.id}" value="${esc(sc.line || '')}" placeholder="セリフ" maxlength="30">
          </div>
          <button class="del" data-action="delScene" data-id="${sc.id}" aria-label="けす">🗑️</button>
        </li>`).join('')}
    </ul>
    <form class="add-scene" data-form="addScene">
      <label class="file-btn">🖼️ がぞうを えらぶ<input type="file" name="file" accept="image/*" hidden></label>
      <span class="file-name">えらんで いません</span>
      <input class="txt" name="title" placeholder="なまえ（れい：うんどうかい）" maxlength="20">
      <input class="txt" name="situation" placeholder="ばめんの せつめい（れい：プレゼントを もらって）" maxlength="40">
      <input class="txt" name="line" placeholder="セリフ（れい：ありがとう）" maxlength="30" required>
      <button class="add-btn">＋ ばめんを ふやす</button>
    </form>
    <p class="help">ついかした がぞうは この iPad の なかだけに ほぞんされます。ホームがめんに ついかして つかうと きえにくく なります。</p>`;
  },

  data: () => `
    <div class="data-box">
      <h3>せいとの iPad に くばる</h3>
      <p class="help">きもちと ことばの せっていを ファイルに します（がぞうは はいりません）。AirDrop や ドライブで せいとの iPad に おくり、「よみこむ」で とりこみます。</p>
      <button class="add-btn" data-action="export">⬇️ かきだす（JSON）</button>
      <label class="add-btn file-btn">⬆️ よみこむ<input type="file" accept=".json,application/json" data-action="import" hidden></label>
    </div>
    <div class="data-box">
      <h3>はじめの せっていに もどす</h3>
      <p class="help">きもちと ことばを はじめの じょうたいに もどします。ついかした ばめんは けしません。</p>
      <button class="danger-btn" data-action="reset">↺ もとに もどす</button>
    </div>`,
};

function rowTools(i, len, kind, noDelete) {
  return `
    <button class="mini" data-action="up${kind}" data-i="${i}" ${i === 0 ? 'disabled' : ''} aria-label="うえへ">▲</button>
    <button class="mini" data-action="down${kind}" data-i="${i}" ${i === len - 1 ? 'disabled' : ''} aria-label="したへ">▼</button>
    <button class="mini del" data-action="del${kind}" data-i="${i}" ${noDelete ? 'disabled' : ''} aria-label="けす">🗑️</button>`;
}

function iconPicker() {
  return `
  <div class="modal" data-action="closeIcon">
    <div class="modal-box" data-stop>
      <h3>アイコンを えらぶ</h3>
      <div class="icon-grid">
        ${ICON_CHOICES.map((c, k) => `<button class="icon-choice" data-action="setIcon" data-k="${k}">${faceHtml(c, 'mini-face')}</button>`).join('')}
      </div>
      <button class="nav-btn" data-action="closeIcon">とじる</button>
    </div>
  </div>`;
}

function move(arr, i, d) {
  const j = i + d;
  if (j < 0 || j >= arr.length) return;
  [arr[i], arr[j]] = [arr[j], arr[i]];
}

// ---------- 描画とイベント ----------

function render() {
  app.innerHTML = screens[state.screen]();
  fitText();
}

// 1行に収めたい文字（ことばカード・発表画面など）が はみ出すときは、収まるまで字を小さくする
function fitText() {
  app.querySelectorAll('.line-card, .present-line, .confirm-line, .emo-name, .big-name, .bubble, .reveal-line, .reveal-name').forEach((el) => {
    el.style.fontSize = '';
    let size = parseFloat(getComputedStyle(el).fontSize);
    while (el.scrollWidth > el.clientWidth && size > 14) {
      size -= 2;
      el.style.fontSize = `${size}px`;
    }
  });
}
window.addEventListener('resize', fitText);
document.fonts?.ready.then(fitText); // 文字の形が変わるので、フォントの読み込み後にもう一度

function go(screen) {
  state.screen = screen;
  if (screen !== 'answer') state.bigCard = null;
  if (screen !== 'settings') state.iconPickFor = null;
  render();
  window.scrollTo(0, 0);
}

const actions = {
  startSelf() {
    state.pick = { line: null, emotion: null };
    go('pickLine');
  },
  openScene(el) {
    state.sceneIndex = +el.dataset.i;
    go('sceneView');
  },
  prevScene() {
    state.sceneIndex = Math.max(0, state.sceneIndex - 1);
    render();
  },
  nextScene() {
    state.sceneIndex = Math.min(visibleScenes().length - 1, state.sceneIndex + 1);
    render();
  },
  pickLine(el) {
    state.pick.line = state.settings.lines[+el.dataset.i];
    go('pickEmotion');
  },
  pickEmotion(el) {
    state.pick.emotion = state.settings.emotions[+el.dataset.i].id;
    go('confirm');
  },
  showBig(el) {
    state.bigCard = +el.dataset.i;
    render();
  },
  closeBig() {
    state.bigCard = null;
    render();
  },

  // せってい
  pickIcon(el) {
    state.iconPickFor = +el.dataset.i;
    render();
  },
  setIcon(el) {
    const c = ICON_CHOICES[+el.dataset.k];
    Object.assign(state.settings.emotions[state.iconPickFor], { img: c.img, emoji: c.emoji });
    state.iconPickFor = null;
    save();
    render();
  },
  closeIcon(el, ev) {
    if (ev.target.closest('[data-stop]') && !ev.target.closest('[data-action="closeIcon"].nav-btn')) return;
    state.iconPickFor = null;
    render();
  },
  addEmotion() {
    const es = state.settings.emotions;
    if (es.length >= MAX_EMOTIONS) return;
    es.push({ id: `e${Date.now()}`, name: 'あたらしい きもち', img: null, emoji: '🙂' });
    save();
    render();
  },
  upEmotion: (el) => editList(state.settings.emotions, +el.dataset.i, -1),
  downEmotion: (el) => editList(state.settings.emotions, +el.dataset.i, 1),
  delEmotion(el) {
    const es = state.settings.emotions;
    if (es.length <= MIN_EMOTIONS) return;
    if (!confirm(`「${es[+el.dataset.i].name}」を けしますか？`)) return;
    es.splice(+el.dataset.i, 1);
    save();
    render();
  },
  upLine: (el) => editList(state.settings.lines, +el.dataset.i, -1),
  downLine: (el) => editList(state.settings.lines, +el.dataset.i, 1),
  delLine(el) {
    const ls = state.settings.lines;
    if (ls.length <= 1) return;
    if (!confirm(`「${ls[+el.dataset.i]}」を けしますか？`)) return;
    ls.splice(+el.dataset.i, 1);
    save();
    render();
  },
  toggleScene(el) {
    const h = state.settings.hiddenScenes;
    const k = h.indexOf(el.dataset.id);
    if (k >= 0) h.splice(k, 1);
    else h.push(el.dataset.id);
    save();
    render();
  },
  async delScene(el) {
    const sc = state.customScenes.find((s) => s.id === el.dataset.id);
    if (!sc || !confirm(`「${sc.title}」を けしますか？`)) return;
    await deleteCustomScene(sc.id);
    URL.revokeObjectURL(sc.url);
    state.customScenes = state.customScenes.filter((s) => s !== sc);
    render();
  },
  export() {
    const blob = new Blob([exportJson(state.settings)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'きもち設定.json';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 1000);
  },
  reset() {
    if (!confirm('きもちと ことばを はじめの せっていに もどしますか？')) return;
    const { hiddenScenes } = state.settings;
    state.settings = { ...defaultSettings(), hiddenScenes };
    save();
    toast('もとに もどしました');
    render();
  },
};

function editList(arr, i, d) {
  move(arr, i, d);
  save();
  render();
}

app.addEventListener('click', (ev) => {
  const goEl = ev.target.closest('[data-go]');
  if (goEl) return go(goEl.dataset.go);
  const tabEl = ev.target.closest('[data-tab]');
  if (tabEl) {
    state.tab = tabEl.dataset.tab;
    return render();
  }
  const el = ev.target.closest('[data-action]');
  if (!el || el.disabled || el.tagName === 'INPUT') return;
  const fn = actions[el.dataset.action];
  if (fn) fn(el, ev);
});

// 文字の編集は、入力が終わったときに保存する
app.addEventListener('change', async (ev) => {
  const t = ev.target;
  const s = state.settings;
  if (t.dataset.field === 'emotion') {
    s.emotions[+t.dataset.i].name = t.value.trim() || s.emotions[+t.dataset.i].name;
    save();
  } else if (t.dataset.field === 'line') {
    if (t.value.trim()) s.lines[+t.dataset.i] = t.value.trim();
    save();
    render();
  } else if (['sceneTitle', 'sceneSit', 'sceneLine'].includes(t.dataset.field)) {
    const sc = state.customScenes.find((x) => x.id === t.dataset.id);
    if (!sc || !t.value.trim()) return;
    sc[{ sceneTitle: 'title', sceneSit: 'situation', sceneLine: 'line' }[t.dataset.field]] = t.value.trim();
    delete sc.question;
    const { url, ...rec } = sc;
    await putCustomScene(rec);
  } else if (t.dataset.action === 'import' && t.files[0]) {
    try {
      state.settings = importJson(await t.files[0].text(), s);
      save();
      toast('よみこみました');
    } catch {
      toast('この ファイルは よみこめません');
    }
    render();
  } else if (t.name === 'file') {
    t.closest('form').querySelector('.file-name').textContent = t.files[0] ? t.files[0].name : 'えらんで いません';
  }
});

app.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const f = ev.target;
  if (f.dataset.form === 'addLine') {
    const v = f.line.value.trim();
    if (!v) return;
    state.settings.lines.push(v);
    save();
    render();
    app.querySelector('[data-form="addLine"] input')?.focus();
  } else if (f.dataset.form === 'addScene') {
    const file = f.file.files[0];
    if (!file) return toast('がぞうを えらんでね');
    if (!f.line.value.trim()) return toast('セリフを いれてね');
    try {
      const blob = await shrinkImage(file);
      const rec = {
        id: `my_${Date.now()}`,
        title: f.title.value.trim() || 'ばめん',
        situation: f.situation.value.trim(),
        line: f.line.value.trim(),
        blob,
        createdAt: Date.now(),
      };
      await putCustomScene(rec);
      state.customScenes.push({ ...rec, url: URL.createObjectURL(blob) });
      toast('ばめんを ふやしました');
      render();
    } catch {
      toast('がぞうを ほぞん できませんでした');
    }
  }
});

// 「せってい」は長押しで開く（子どもがうっかり入らないように）
const HOLD_MS = 1000;
let holdTimer = null;
app.addEventListener('pointerdown', (ev) => {
  const el = ev.target.closest('[data-hold]');
  if (!el) return;
  el.classList.add('holding');
  holdTimer = setTimeout(() => {
    el.classList.remove('holding');
    state.tab = 'emotions';
    go(el.dataset.hold);
  }, HOLD_MS);
});
const cancelHold = () => {
  clearTimeout(holdTimer);
  app.querySelectorAll('.holding').forEach((x) => x.classList.remove('holding'));
};
['pointerup', 'pointerleave', 'pointercancel'].forEach((t) => app.addEventListener(t, cancelHold));
app.addEventListener('contextmenu', (ev) => ev.preventDefault());

// ---------- 起動 ----------

(async () => {
  render();
  requestPersist();
  const recs = await listCustomScenes();
  state.customScenes = recs.map((r) => ({ ...r, url: URL.createObjectURL(r.blob) }));
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();
