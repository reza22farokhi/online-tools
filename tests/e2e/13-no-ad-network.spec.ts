import { test, expect } from '@playwright/test';

test('site loads without advertising scripts, placements, or third-party script requests', async ({ page }) => {
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

  await expect(page.locator('[data-ad-id], [data-ad-slot], [class*="ad-slot"], [id*="ad-slot"], iframe')).toHaveCount(0);

  const dimensions = await page.evaluate(() => ({
    viewportWidth: document.documentElement.clientWidth,
    documentWidth: document.documentElement.scrollWidth
  }));
  expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth);
  expect(externalScripts).toEqual([]);
});

test('English and Persian layouts remain usable without ad-specific UI', async ({ page }) => {
  await page.goto('/?lang=en');
  await expect(page.locator('body')).toBeVisible();
  await expect(page.locator('[data-lang-toggle]').first()).toBeVisible();
  await expect(page.locator('[data-ad-id], [data-ad-slot], [class*="ad-slot"], [id*="ad-slot"], iframe')).toHaveCount(0);

  await page.locator('[data-lang-toggle]').first().click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'fa');
  await expect(page.locator('[data-ad-id], [data-ad-slot], [class*="ad-slot"], [id*="ad-slot"], iframe')).toHaveCount(0);
});
