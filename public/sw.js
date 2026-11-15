// این نسخه، کش‌های قدیمی را کاملاً پاک می‌کند و خود را غیرفعال می‌کند
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('Deleting cache:', cacheName);
          return caches.delete(cacheName); // پاک کردن تمام کش‌ها
        })
      );
    }).then(() => {
      return self.registration.unregister(); // غیرفعال کردن سرویس‌ورکر
    }).then(() => {
      return self.clients.matchAll();
    }).then((clients) => {
      clients.forEach((client) => {
        if (client.url && 'navigate' in client) {
          client.navigate(client.url); // رفرش کردن خودکار صفحه
        }
      });
    })
  );
});
