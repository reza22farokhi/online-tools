import { test, expect } from '@playwright/test';

test('service worker keeps an offline shell, serves cached pages instantly, and bounds runtime caching', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));

  await page.goto('/tools/jwt-inspector/');
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  await page.evaluate(async () => { await fetch('/robots.txt'); });
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
  expect(cacheState.shellPaths).toContain('/scripts/site-bootstrap.js');
  expect(cacheState.runtimeUrls.some((url) => new URL(url).pathname === '/tools/jwt-inspector/')).toBe(true);
  expect(cacheState.runtimeUrls.some((url) => url.includes('cache-bypass-check=1'))).toBe(false);
  expect(cacheState.runtimeUrls.some((url) => new URL(url).pathname === '/robots.txt')).toBe(false);
  expect(cacheState.runtimeUrls.length).toBeLessThanOrEqual(100);

  await page.context().setOffline(true);
  await page.goto('/tools/jwt-inspector/');
  await expect(page.locator('main')).toBeVisible();
  await expect(page).toHaveURL(/\/tools\/jwt-inspector\/$/);

  await page.goto('/tools/uncached-offline-test/');
  await expect(page.getByRole('heading', { name: 'شما آفلاین هستید' })).toBeVisible();

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

test('offline fallback is localized and offers a same-origin retry link', async ({ page }) => {
  await page.goto('/offline/?lang=fa');
  await expect(page.getByRole('heading', { name: 'شما آفلاین هستید' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'تلاش مجدد' })).toHaveAttribute('href', '/');

  await page.goto('/offline/?lang=en');
  await expect(page.getByRole('heading', { name: 'You are offline' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Try again' })).toHaveAttribute('href', '/');
  await expect(page).toHaveTitle('Offline | Online Tools');
});

test('offline fallback handles language and private query parameters without caching them', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));

  await page.context().setOffline(true);
  await page.goto('/tools/uncached-offline-test/?lang=en&token=do-not-cache').catch(() => undefined);

  await expect(page.getByRole('heading', { name: 'You are offline' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Try again' })).toHaveAttribute('href', '/');

  const runtimeUrls = await page.evaluate(async () => {
    const cache = await caches.open('online-tools-v3-runtime');
    return (await cache.keys()).map(request => request.url);
  });

  expect(runtimeUrls.some(url => url.includes('token=do-not-cache'))).toBe(false);
  expect(runtimeUrls.some(url => url.includes('lang=en'))).toBe(false);
});
