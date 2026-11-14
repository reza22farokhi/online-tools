import { test, expect } from '@playwright/test';

test('password-generator tool generates passwords and loads FAQ', async ({ page }) => {
  await page.goto('/tools/password-generator/');
  await expect(page.locator('h1')).toContainText('تولیدکننده رمز عبور');

  const output = page.locator('#pass-output');
  await expect(output).toBeVisible();
  
  // By default, it generates on load (length 16)
  await expect(output).not.toHaveValue('');
  
  // Change length to 24
  const slider = page.locator('#pass-length');
  await slider.fill('24');
  await slider.dispatchEvent('input'); // Trigger the vanilla JS listener
  
  // Verify length is now 24
  const newPass = await output.inputValue();
  expect(newPass.length).toBe(24);

  // Click generate button and ensure it changes
  const generateBtn = page.locator('#generate-btn');
  await generateBtn.click();
  const anotherPass = await output.inputValue();
  expect(anotherPass).not.toBe(newPass);

  // Verify FAQ is present
  const faq = page.locator('.tool-faq');
  await expect(faq).toBeVisible();
  await expect(faq.locator('.faq-item').first()).toBeVisible();
});
