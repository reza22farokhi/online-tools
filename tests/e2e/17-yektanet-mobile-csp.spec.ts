import { test, expect } from '@playwright/test';

test('publisher loader is injected only once and ad slots stay within mobile width', async ({ page }) => {
  await page.route('https://cdn.yektanet.ir/**', route => route.abort());
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/?lang=fa');

  await expect(page.locator('#yektanet-publisher-loader')).toHaveCount(1);

  // Re-evaluate the same external loader to model duplicate layout/script execution.
  await page.evaluate(() => {
    const duplicate = document.createElement('script');
    duplicate.src = '/scripts/yektanet-loader.js';
    document.head.appendChild(duplicate);
  });

  await expect(page.locator('#yektanet-publisher-loader')).toHaveCount(1);

  const dimensions = await page.evaluate(() => {
    const slot = document.querySelector<HTMLElement>('.yn-bnr');
    if (!slot) return null;
    const rect = slot.getBoundingClientRect();
    return {
      viewportWidth: document.documentElement.clientWidth,
      slotWidth: rect.width,
      documentWidth: document.documentElement.scrollWidth
    };
  });

  expect(dimensions).not.toBeNull();
  expect(dimensions!.slotWidth).toBeLessThanOrEqual(dimensions!.viewportWidth);
  expect(dimensions!.documentWidth).toBeLessThanOrEqual(dimensions!.viewportWidth);
});
