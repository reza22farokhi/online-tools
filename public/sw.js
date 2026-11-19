const SHELL_CACHE_NAME = 'online-tools-v3-shell';
const RUNTIME_CACHE_NAME = 'online-tools-v3-runtime';
const PRECACHE_URLS = ['/', '/offline/', '/manifest.json', '/scripts/site-bootstrap.js'];
const MAX_RUNTIME_ENTRIES = 100;

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE_NAME);
    await cache.addAll(PRECACHE_URLS);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    const currentCaches = new Set([SHELL_CACHE_NAME, RUNTIME_CACHE_NAME]);

    await Promise.all(
      keys
        .filter((key) => key.startsWith('online-tools-') && !currentCaches.has(key))
        .map((key) => caches.delete(key))
    );

    await self.clients.claim();
  })());
});

function isRuntimeCacheable(request, url) {
  // Query strings can contain language preferences or private data. Never cache them.
  if (url.search) return false;

  if (request.mode === 'navigate') {
    return request.destination === 'document';
  }

  return (
    url.pathname.startsWith('/_astro/') &&
    ['script', 'style', 'font'].includes(request.destination)
  );
}

async function putRuntimeEntry(cache, request, response) {
  const cacheControl = response.headers.get('Cache-Control') || '';
  const contentType = response.headers.get('Content-Type') || '';

  if (
    !response.ok ||
    response.type !== 'basic' ||
    /(?:no-store|private)/i.test(cacheControl)
  ) {
    return;
  }

  if (request.mode === 'navigate' && !contentType.toLowerCase().includes('text/html')) {
    return;
  }

  // Cache failures must never turn a successful network response into an offline error.
  try {
    // Reinsert the key so FIFO eviction removes the least recently refreshed entry.
    await cache.delete(request);
    await cache.put(request, response.clone());

    const keys = await cache.keys();
    const overflow = keys.length - MAX_RUNTIME_ENTRIES;

    if (overflow > 0) {
      await Promise.all(keys.slice(0, overflow).map((key) => cache.delete(key)));
    }
  } catch {
    // Storage can be unavailable or full; the network response remains usable.
  }
}

self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (request.method !== 'GET' || request.headers.has('range')) return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const isNavigation = request.mode === 'navigate';
  const isPrecachedAsset = url.pathname === '/scripts/site-bootstrap.js';
  const cacheable = isRuntimeCacheable(request, url);

  // Query-bearing navigations still need offline handling, but are never cached.
  if (!cacheable && !(isNavigation && url.search) && !isPrecachedAsset) return;

  event.respondWith((async () => {
    let runtimeCache = null;

    if (cacheable) {
      try {
        runtimeCache = await caches.open(RUNTIME_CACHE_NAME);
      } catch {
        // If Cache Storage is unavailable, continue with the network normally.
      }
    }

    try {
      const response = await fetch(request);
      if (runtimeCache) await putRuntimeEntry(runtimeCache, request, response);
      return response;
    } catch {
      if (runtimeCache) {
        const cached = await runtimeCache.match(request);
        if (cached) return cached;
      }

      if (isNavigation || isPrecachedAsset) {
        try {
          const shellCache = await caches.open(SHELL_CACHE_NAME);
          if (isPrecachedAsset) {
            const cachedAsset = await shellCache.match('/scripts/site-bootstrap.js');
            if (cachedAsset) return cachedAsset;
          }

          const exactPage = cacheable ? await shellCache.match(request) : null;
          if (exactPage) return exactPage;

          if (isNavigation) {
            const offlinePage = await shellCache.match('/offline/');
            if (offlinePage) return offlinePage;
          }
        } catch {
          // Fall through to the plain offline response.
        }
      }

      return new Response('Offline', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }
  })());
});
