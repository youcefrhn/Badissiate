const CACHE_NAME = 'badisiyat-v1';
const assetsToCache = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assetsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
self.addEventListener('push', function(event) {
  const data = event.data?.text() || "📖 قول اليوم";
  event.waitUntil(
    self.registration.showNotification("باديسيات", {
      body: data,
      icon: "/icons/icon-192.png"
    })
  );
});
