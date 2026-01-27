const CACHE_NAME = 'arrida-v1';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './student_dashboard.html', // <--- Updated to your real filename
  './admin_portal.html',      // <--- Updated to your real filename
  './manifest-student.json',
  './manifest-admin.json',
  './student-icon-192.png',   // Make sure these match your actual image names
  './admin-icon-192.png'
];

// 1. INSTALL
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching app shell...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. FETCH
self.addEventListener('fetch', (e) => {
  // Ignore API calls
  if (e.request.url.includes('supabase.co') || e.request.url.includes('paystack')) {
    return; 
  }

  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});

// 3. ACTIVATE
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});
