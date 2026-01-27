// sw.js - Basic Service Worker
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('arrida-store').then((cache) => cache.addAll([
      './',
      './index.html',
      // Add other key files here like your main css or js
    ])),
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request)),
  );
});
