const CACHE_NAME = 'online-tools-v3'; // تغییر نسخه

self.addEventListener('install', (event) => {
  self.skipWaiting(); // فعال‌سازی فوری
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName); // پاک کردن نسخه‌های قدیمی
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// استراتژی Stale-While-Revalidate (سرعت بالا + آپدیت در پس‌زمینه)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return; // فقط درخواست‌های GET
  
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // ۱. اگر در کش بود، فوراً همان را نشان بده (سرعت بالا)
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // همزمان در پس‌زمینه نسخه جدید را دانلود و کش کن
        if (networkResponse && networkResponse.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
          });
        }
        return networkResponse;
      }).catch(() => {
        // اگر شبکه قطع بود، هیچ کاری نکن (همان کش نمایش داده شده)
      });
      
      return cachedResponse || fetchPromise;
    })
  );
});
