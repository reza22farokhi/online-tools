import { test, expect } from '@playwright/test';

test('site doctor [tool:percentage] calculates all three percentage modes', async ({ page }) => {
  await page.goto('/tools/percentage/');

  await page.locator('#pc-of-x').fill('20');
  await page.locator('#pc-of-y').fill('500');
  await expect(page.locator('#pc-of-result')).toContainText('100');

  await page.locator('.pc-mode[data-mode="what"]').click();
  await expect(page.locator('[data-panel="what"]')).toBeVisible();
  await page.locator('#pc-what-x').fill('25');
  await page.locator('#pc-what-y').fill('200');
  await expect(page.locator('#pc-what-result')).toContainText('12.5');

  await page.locator('.pc-mode[data-mode="change"]').click();
  await expect(page.locator('[data-panel="change"]')).toBeVisible();
  await page.locator('#pc-ch-from').fill('100');
  await page.locator('#pc-ch-to').fill('150');
  await expect(page.locator('#pc-ch-result')).toContainText('50');
});

test('site doctor [tool:percentage] rejects zero denominators and recalculates after correction', async ({ page }) => {
  await page.goto('/en/tools/percentage/');

  await page.locator('.pc-mode[data-mode="what"]').click();
  await page.locator('#pc-what-x').fill('25');
  await page.locator('#pc-what-y').fill('0');
  await expect(page.locator('#pc-what-result')).toContainText('Division by zero');

  await page.locator('#pc-what-y').fill('100');
  await expect(page.locator('#pc-what-result')).toContainText('25%');

  await page.locator('.pc-mode[data-mode="change"]').click();
  await page.locator('#pc-ch-from').fill('0');
  await page.locator('#pc-ch-to').fill('10');
  await expect(page.locator('#pc-ch-result')).toContainText('cannot be zero');
});
