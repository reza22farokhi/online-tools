import { test, expect } from '@playwright/test';

test('site loads without advertising scripts, placements, or ad-network requests', async ({ page }) => {
  const externalRequests: string[] = [];
  page.on('request', request => {
    if (/yektanet|triboon/i.test(request.url())) externalRequests.push(request.url());
  });

  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/?lang=fa');
  await expect(page.locator('body')).toBeVisible();

  await expect(page.locator('script[src*="yektanet"]')).toHaveCount(0);
  await expect(page.locator('[id^="ynpos-"], .yn-bnr, .yn-notification, .yn-footer-sticky, .ad-slot-wrap, [data-ad-id]')).toHaveCount(0);
  await expect(page.locator('#pos-article-display-card-124132')).toHaveCount(0);

  const dimensions = await page.evaluate(() => ({
    viewportWidth: document.documentElement.clientWidth,
    documentWidth: document.documentElement.scrollWidth
  }));
  expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth);
  expect(externalRequests).toEqual([]);
});

test('English and Persian layouts remain usable without ad-specific UI', async ({ page }) => {
  await page.goto('/?lang=en');
  await expect(page.locator('body')).toBeVisible();
  await expect(page.locator('[data-lang-toggle]').first()).toBeVisible();
  await expect(page.locator('.yn-bnr, .ad-slot-wrap, [data-ad-id]')).toHaveCount(0);

  await page.locator('[data-lang-toggle]').first().click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'fa');
  await expect(page.locator('.yn-bnr, .ad-slot-wrap, [data-ad-id]')).toHaveCount(0);
});
