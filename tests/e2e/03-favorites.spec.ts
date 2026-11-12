import { test, expect } from '@playwright/test';

test('favorites toggle and section appears', async ({ page }) => {
  await page.goto('/online-tools/');

  const favSection = page.locator('#favorites-section');
  await expect(favSection).toBeHidden();

  const firstHeart = page.locator('.fav-btn').first();
  await firstHeart.click();
  await page.waitForTimeout(300);

  await expect(favSection).toBeVisible();
  const favCards = page.locator('#favorites-grid .tool-card-wrap');
  await expect(favCards).toHaveCount(1);

  await page.reload();
  await expect(page.locator('#favorites-section')).toBeVisible();
});
