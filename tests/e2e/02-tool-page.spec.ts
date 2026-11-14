import { test, expect } from '@playwright/test';

test('word-counter tool loads with FAQ', async ({ page }) => {
  await page.goto('/tools/word-counter/');
  await expect(page.locator('h1')).toContainText('شمارش کلمات');

  const textarea = page.locator('#wc-input');
  await expect(textarea).toBeVisible();

  await textarea.fill('سلام دنیا این یک تست است');
  await page.waitForTimeout(200);

  const words = page.locator('#stat-words');
  await expect(words).toHaveText('6');

  const faq = page.locator('.tool-faq');
  await expect(faq).toBeVisible();
  await expect(faq.locator('.faq-item').first()).toBeVisible();
});
