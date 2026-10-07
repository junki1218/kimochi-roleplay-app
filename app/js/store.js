// 保存まわり。設定（気持ち・セリフ・非表示の場面）は localStorage、
// 先生が追加した場面の画像は IndexedDB に置く。どちらも端末ごと。

import { DEFAULT_EMOTIONS, DEFAULT_LINES } from './data.js';

const KEY = 'kimochi.settings.v1';

export function defaultSettings() {
  return {
    emotions: DEFAULT_EMOTIONS.map((e) => ({ ...e })),
    lines: [...DEFAULT_LINES],
    hiddenScenes: [],
  };
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultSettings();
    return normalize(JSON.parse(raw));
  } catch {
    return defaultSettings();
  }
}

export function saveSettings(s) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    // プライベートブラウズ等で保存できなくても、その場では動かす
  }
}

// 読み込んだ JSON や古い保存データを、使える形にそろえる
export function normalize(obj) {
  const base = defaultSettings();
  if (!obj || typeof obj !== 'object') return base;
  const emotions = Array.isArray(obj.emotions)
    ? obj.emotions
        .filter((e) => e && typeof e.name === 'string')
        .slice(0, 4)
        .map((e, i) => ({
          id: String(e.id || `e${Date.now()}_${i}`),
          name: e.name.slice(0, 20),
          img: typeof e.img === 'string' && e.img.startsWith('images/') ? e.img : null,
          emoji: typeof e.emoji === 'string' ? e.emoji : '🙂',
        }))
    : base.emotions;
  const lines = Array.isArray(obj.lines)
    ? obj.lines.filter((l) => typeof l === 'string' && l.trim()).map((l) => l.slice(0, 30))
    : base.lines;
  return {
    emotions: emotions.length >= 2 ? emotions : base.emotions,
    lines: lines.length ? lines : base.lines,
    hiddenScenes: Array.isArray(obj.hiddenScenes) ? obj.hiddenScenes.map(String) : [],
  };
}

// 生徒の iPad に配る JSON。画像は含めない
export function exportJson(s) {
  return JSON.stringify(
    { app: 'kimochi-roleplay-app', version: 1, emotions: s.emotions, lines: s.lines },
    null,
    2,
  );
}

export function importJson(text, current) {
  const obj = JSON.parse(text);
  if (!obj || (!obj.emotions && !obj.lines)) throw new Error('形式がちがう');
  const n = normalize({ ...obj, hiddenScenes: current.hiddenScenes });
  return n;
}

// ---- IndexedDB（先生が追加した場面） ----

const DB_NAME = 'kimochi';
const STORE = 'scenes';

let dbPromise = null;
function openDb() {
  dbPromise ??= new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: 'id' });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => {
      dbPromise = null;
      reject(req.error);
    };
  });
  return dbPromise;
}

function tx(mode, fn) {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const t = db.transaction(STORE, mode);
        const result = fn(t.objectStore(STORE));
        t.oncomplete = () => resolve(result && 'result' in result ? result.result : undefined);
        t.onerror = () => reject(t.error);
      }),
  );
}

export async function listCustomScenes() {
  try {
    const all = (await tx('readonly', (s) => s.getAll())) || [];
    return all.sort((a, b) => a.createdAt - b.createdAt);
  } catch {
    return [];
  }
}

export const putCustomScene = (scene) => tx('readwrite', (s) => s.put(scene));
export const deleteCustomScene = (id) => tx('readwrite', (s) => s.delete(id));

// 取り込む画像を長辺 1280px の JPEG に縮める（容量を抑える）
export async function shrinkImage(file, max = 1280) {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = url;
    });
    const scale = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement('canvas');
    c.width = Math.round(img.naturalWidth * scale);
    c.height = Math.round(img.naturalHeight * scale);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    return await new Promise((resolve) => c.toBlob(resolve, 'image/jpeg', 0.85));
  } finally {
    URL.revokeObjectURL(url);
  }
}

// ホーム画面に追加していなくても、なるべく消されないように頼む
export function requestPersist() {
  try {
    navigator.storage?.persist?.();
  } catch {
    /* 対応していない端末では何もしない */
  }
}
