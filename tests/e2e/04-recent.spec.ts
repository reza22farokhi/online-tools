import { test, expect } from '@playwright/test';

test('recent tools appear after visiting a tool', async ({ page }) => {
  await page.goto('/online-tools/');
  await page.locator('#recent-section').evaluate(el => { (el as HTMLElement).hidden = true; });

  await page.goto('/online-tools/tools/json-formatter/');
  await page.waitForTimeout(500);
  await page.goto('/online-tools/');
  await page.waitForTimeout(500);

  const recentSection = page.locator('#recent-section');
  await expect(recentSection).toBeVisible();

  const recentCards = page.locator('#recent-grid .tool-card-wrap');
  expect(await recentCards.count()).toBeGreaterThan(0);
});
