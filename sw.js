const CACHE_NAME = 'to-do-list-cache-v4';
const urlsToCache = [
  '/',
  '/app.html?v=1.0.1',
  '/app.js?v=1.0.1',
  '/ui.js?v=1.0.1',
  '/tasks.js?v=1.0.1',
  '/storage.js?v=1.0.1',
  '/calendar.js?v=1.0.1',
  '/manifest.json?v=1.0.1' // Also cache the manifest
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting()) // Activate new SW immediately
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName); // Delete old caches
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});