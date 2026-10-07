// オフラインでも動かすための service worker。
// ネットにつながるときは新しい版を取り、つながらないときは保存した版を出す。
const CACHE = 'kimochi-v4';
const SHELL = [
  './', 'index.html', 'style.css', 'manifest.webmanifest',
  'js/app.js', 'js/data.js', 'js/store.js',
  'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png',
  'images/start_bg.webp',
  'images/kao/ureshii.webp', 'images/kao/kanashii.webp', 'images/kao/okotte.webp', 'images/kao/kowai.webp',
  ...['01_present', '02_futari', '03_hirameki', '04_omocha', '08_bikkuri', '12_kotowaru', '17_tasukete']
    .map((n) => `images/ba/ba_${n}.webp`),
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res.ok || res.type === 'opaque') {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true })),
  );
});
