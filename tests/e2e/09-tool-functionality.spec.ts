import { test, expect } from '@playwright/test';

test('date info renders English labels and valid results', async ({ page }) => {
  await page.goto('/tools/date-info/?lang=en');
  await page.locator('#di-input').fill('1403/01/01');
  await page.locator('#di-calc').click();

  const results = page.locator('#di-grid');
  await expect(results).toBeVisible();
  await expect(results).toContainText('Jalali date');
  await expect(results).toContainText('Gregorian date');
  await expect(results).toContainText('Weekday');
  await expect(results).not.toContainText('روز هفته');
});

test('text diff compares content and remains within a narrow mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/tools/text-diff/?lang=en');
  await page.locator('#text-old').fill('alpha\nbeta');
  await page.locator('#text-new').fill('alpha\ngamma');
  await page.locator('#btn-compare').click();

  const result = page.locator('#diff-result');
  await expect(result).toBeVisible();
  await expect(result).toContainText('- beta');
  await expect(result).toContainText('+ gamma');

  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth
  }));
  expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport);
});
