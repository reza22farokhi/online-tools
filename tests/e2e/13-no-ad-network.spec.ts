import { test, expect } from '@playwright/test';

const TAPSELL_LOADER = 'https://s1.mediaad.org/serve/abzar-tools.ir/loader.js';
const TAPSELL_SLOT = '#mediaad-qn1xY';

test('site loads with the approved Tapsell placement and no unapproved ad scripts', async ({ page }) => {
  const externalScripts: string[] = [];
  page.on('request', request => {
    if (request.resourceType() !== 'script') return;
    try {
      if (new URL(request.url()).origin !== 'http://localhost:4321') {
        externalScripts.push(request.url());
      }
    } catch {
      externalScripts.push(request.url());
    }
  });

  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/?lang=fa');
  await expect(page.locator('body')).toBeVisible();
  await expect(page.locator(TAPSELL_SLOT)).toHaveCount(1);
  await expect(page.locator('script[src="' + TAPSELL_LOADER + '"]')).toHaveCount(1);

  const dimensions = await page.evaluate(() => ({
    viewportWidth: document.documentElement.clientWidth,
    documentWidth: document.documentElement.scrollWidth
  }));
  expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth);
  expect(externalScripts.every(url => {
    try {
      return new URL(url).origin === 'https://s1.mediaad.org';
    } catch {
      return false;
    }
  })).toBe(true);
});

test('English and Persian layouts remain usable with the Tapsell placement', async ({ page }) => {
  await page.goto('/?lang=en');
  await expect(page.locator('body')).toBeVisible();
  await expect(page.locator('[data-lang-toggle]').first()).toBeVisible();
  await expect(page.locator(TAPSELL_SLOT)).toHaveCount(1);

  await page.locator('[data-lang-toggle]').first().click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'fa');
  await expect(page.locator(TAPSELL_SLOT)).toHaveCount(1);
});
