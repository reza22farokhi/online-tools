import { test, expect } from '@playwright/test';

test('theme toggle switches dark/light', async ({ page }) => {
  await page.goto('/');
  const html = page.locator('html');
  const initial = await html.getAttribute('data-theme');
  await page.locator('[data-theme-toggle]').click();
  await page.waitForTimeout(200);
  const next = await html.getAttribute('data-theme');
  expect(next).not.toBe(initial);
});

test('language toggle switches fa/en', async ({ page }) => {
  await page.goto('/');
  const html = page.locator('html');
  const initial = await html.getAttribute('lang');
  await page.locator('[data-lang-toggle]').click();
  await page.waitForTimeout(200);
  const next = await html.getAttribute('lang');
  expect(next).not.toBe(initial);
  expect(['fa', 'en']).toContain(next);
});

test('URL-selected language still bootstraps when browser storage is blocked', async ({ browser }) => {
  const context = await browser.newContext();
  await context.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get() { throw new DOMException('Storage is unavailable', 'SecurityError'); }
    });
  });
  const page = await context.newPage();
  await page.goto('/?lang=en');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page).toHaveTitle(/Professional Online Tools/);
  await context.close();
});
