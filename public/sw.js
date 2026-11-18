const CACHE_NAME = 'online-tools-v2';
const PRECACHE_URLS = ['/', '/offline/', '/manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(PRECACHE_URLS);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((key) => key.startsWith('online-tools-') && key !== CACHE_NAME)
        .map((key) => caches.delete(key))
    );
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (request.headers.has('range')) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);

    try {
      const response = await fetch(request);

      const cacheControl = response.headers.get('Cache-Control') || '';
      const mayCache =
        response.ok &&
        response.type === 'basic' &&
        !/no-store/i.test(cacheControl);

      if (mayCache) {
        await cache.put(request, response.clone()).catch(() => {});
      }

      return response;
    } catch {
      const cached = await cache.match(request);
      if (cached) return cached;

      if (request.mode === 'navigate') {
        const offlinePage = await cache.match('/offline/');
        if (offlinePage) return offlinePage;
      }

      return new Response('Offline', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }
  })());
});
