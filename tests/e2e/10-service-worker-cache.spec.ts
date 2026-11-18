import { test, expect } from '@playwright/test';

test('service worker keeps an offline shell and bounds runtime caching', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));

  await page.goto('/tools/jwt-inspector/');
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  await page.evaluate(() => fetch('/robots.txt'));
  await page.goto('/?cache-bypass-check=1');

  const cacheState = await page.evaluate(async () => {
    const shell = await caches.open('online-tools-v3-shell');
    const runtime = await caches.open('online-tools-v3-runtime');
    const shellKeys = await shell.keys();
    const runtimeKeys = await runtime.keys();

    return {
      shellPaths: shellKeys.map((request) => new URL(request.url).pathname),
      runtimeUrls: runtimeKeys.map((request) => request.url),
    };
  });

  expect(cacheState.shellPaths).toContain('/offline/');
  expect(cacheState.shellPaths).toContain('/manifest.json');
  expect(cacheState.runtimeUrls.some((url) => new URL(url).pathname === '/tools/jwt-inspector/')).toBe(true);
  expect(cacheState.runtimeUrls.some((url) => url.includes('cache-bypass-check=1'))).toBe(false);
  expect(cacheState.runtimeUrls.some((url) => new URL(url).pathname === '/robots.txt')).toBe(false);
  expect(cacheState.runtimeUrls.length).toBeLessThanOrEqual(100);

  for (const cachedUrl of cacheState.runtimeUrls) {
    const url = new URL(cachedUrl);
    expect(url.origin).toBe('http://localhost:4321');
    expect(url.search).toBe('');
    expect(
      url.pathname.startsWith('/_astro/') ||
      url.pathname === '/' ||
      url.pathname.endsWith('/')
    ).toBe(true);
  }
});
