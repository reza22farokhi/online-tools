import { test, expect } from '@playwright/test';

test('password-generator tool generates passwords and loads FAQ', async ({ page }) => {
  await page.goto('/tools/password-generator/');
  await expect(page.locator('h1')).toContainText('تولیدکننده رمز عبور');

  const output = page.locator('#pass-output');
  await expect(output).toBeVisible();
  await expect(output).not.toHaveValue('');

  const slider = page.locator('#pass-length');
  await slider.fill('24');
  await slider.dispatchEvent('input');

  const newPass = await output.inputValue();
  expect(newPass.length).toBe(24);

  const generateBtn = page.locator('#generate-btn');
  await generateBtn.click();
  const anotherPass = await output.inputValue();
  expect(anotherPass).not.toBe(newPass);

  const faq = page.locator('.tool-faq[data-lang-only="fa"]');
  await expect(faq).toBeVisible();
  await expect(faq.locator('.faq-item').first()).toBeVisible();
});
