import { test, expect } from '@playwright/test';

test('qr-code-generator tool creates canvas and loads FAQ', async ({ page }) => {
  await page.goto('/tools/qr-code-generator/');
  await expect(page.locator('h1')).toContainText('تولیدکننده کد QR');

  const input = page.locator('#qr-input');
  await expect(input).toBeVisible();
  await input.fill('https://example.com');

  const generateBtn = page.locator('#generate-btn');
  await generateBtn.click();

  // Verify the result container and canvas become visible
  const resultContainer = page.locator('#qr-result');
  await expect(resultContainer).toBeVisible();
  
  const canvas = page.locator('#qr-canvas');
  await expect(canvas).toBeVisible();

  // Verify FAQ is present
  const faq = page.locator('.tool-faq');
  await expect(faq).toBeVisible();
  await expect(faq.locator('.faq-item').first()).toBeVisible();
});
