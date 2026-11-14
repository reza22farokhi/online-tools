const CACHE_NAME = 'online-tools-v2'; // تغییر نسخه از v1 به v2
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.json'
];

// نصب سرویس‌ورکر جدید و پاک کردن کش‌های قدیمی
self.addEventListener('install', (event) => {
  self.skipWaiting(); // مجبور کردن سرویس‌ورکر جدید به فعال شدن فوری
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// فعال‌سازی و حذف کش‌های مربوط به نسخه‌های قبلی
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName); // پاک کردن کش قدیمی
          }
        })
      );
    }).then(() => self.clients.claim()) // کنترل فوری تمام تب‌های باز
  );
});

// استراتژی Network First (اول شبکه، بعد کش) برای جلوگیری از نمایش نسخه قدیمی
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request).then((response) => {
          return response || caches.match('/');
        });
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});
