const CACHE_NAME = 'to-do-list-cache-v1';
const localUrlsToCache = [
  '/',
  '/app.html',
  '/app.js',
  '/ui.js',
  '/tasks.js',
  '/storage.js',
  '/calendar.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Fetch and cache third-party resources separately
        const thirdPartyRequests = [
          new Request('https://cdn.tailwindcss.com', { mode: 'no-cors' }),
          new Request('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css', { mode: 'no-cors' })
        ];

        thirdPartyRequests.forEach(request => {
          fetch(request).then(response => cache.put(request, response));
        });
        
        // Cache local files
        return cache.addAll(localUrlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});