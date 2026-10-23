/* NestMart service worker: makes the app installable and usable offline.
   Strategy: network-first for the app's own files (always fresh when online, so edits show up),
   falling back to the cache when offline (product photos are cached as they are viewed). Fonts are cache-first.
   Bump CACHE to force a clean slate. */
var CACHE = 'nestmart-v5';
var CORE = [
  './', 'index.html', 'manifest.json', 'css/styles.css',
  'js/config.js', 'js/data.js', 'js/store.js', 'js/lang.js', 'js/lang-data.js', 'js/i18n.js', 'js/ui.js', 'js/views-shop.js', 'js/views-cart.js', 'js/views-info.js', 'js/app.js', 'js/pwa.js',
  'icons/logo-160.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(CORE); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (keys) { return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); })
      .then(function () { return self.clients.claim(); })
  );
});

function put(req, res) {
  if (res && res.ok && (res.type === 'basic' || res.type === 'cors' || res.type === 'opaque')) {
    var copy = res.clone();
    caches.open(CACHE).then(function (c) { c.put(req, copy); });
  }
  return res;
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);

  if (url.origin === self.location.origin) {
    e.respondWith(
      fetch(req.mode === 'navigate' ? req.url : req, { cache: 'no-cache' })
        .then(function (res) { return put(req, res); })
        .catch(function () {
          return caches.match(req).then(function (hit) {
            return hit || (req.mode === 'navigate' ? caches.match('index.html') : Response.error());
          });
        })
    );
    return;
  }

  if (/(^|\.)(googleapis|gstatic)\.com$/.test(url.hostname)) {
    e.respondWith(caches.match(req).then(function (hit) {
      return hit || fetch(req).then(function (res) { return put(req, res); });
    }));
  }
});
