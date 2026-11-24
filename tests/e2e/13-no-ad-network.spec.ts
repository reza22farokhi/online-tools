import { test, expect } from '@playwright/test';

const YEKTANET_LOADER = 'https://cdn.yektanet.ir/superscript-v2/Cg1anVr4/native-49280/yn_pub.js';
const YEKTANET_TOP_SLOT = '#ynpos-21471';
const YEKTANET_BOTTOM_SLOT = '#ynpos-21470';
const APPROVED_AD_SCRIPT_ORIGINS = new Set([
  'https://cdn.yektanet.ir',
  'https://cdn.yektanet.com',
  'https://native-scripts.yektanet.com'
]);

test('site loads with the approved Yektanet placements and no retired ad scripts', async ({ page }) => {
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
  await expect(page.locator(YEKTANET_TOP_SLOT)).toHaveCount(1);
  await expect(page.locator(YEKTANET_BOTTOM_SLOT)).toHaveCount(1);
  await expect(page.locator('script[src="' + YEKTANET_LOADER + '"]')).toHaveCount(1);
  await expect(page.locator('script[src*="mediaad"], script[src*="tapsell"]')).toHaveCount(0);

  const dimensions = await page.evaluate(() => ({
    viewportWidth: document.documentElement.clientWidth,
    documentWidth: document.documentElement.scrollWidth
  }));
  expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth);
  expect(externalScripts.every(url => {
    try {
      return APPROVED_AD_SCRIPT_ORIGINS.has(new URL(url).origin);
    } catch {
      return false;
    }
  })).toBe(true);
});

test('English and Persian layouts remain usable with Yektanet placements', async ({ page }) => {
  await page.goto('/?lang=en');
  await expect(page.locator('body')).toBeVisible();
  await expect(page.locator('[data-lang-toggle]').first()).toBeVisible();
  await expect(page.locator(YEKTANET_TOP_SLOT)).toHaveCount(1);
  await expect(page.locator(YEKTANET_BOTTOM_SLOT)).toHaveCount(1);

  await page.locator('[data-lang-toggle]').first().click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'fa');
  await expect(page.locator(YEKTANET_TOP_SLOT)).toHaveCount(1);
  await expect(page.locator(YEKTANET_BOTTOM_SLOT)).toHaveCount(1);
});
