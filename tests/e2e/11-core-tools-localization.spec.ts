import { test, expect } from '@playwright/test';

test.describe('English localization for core tools', () => {
  test('password generator localizes controls and validation after language changes', async ({ page }) => {
    await page.goto('/tools/password-generator/?lang=en');
    await expect(page.locator('#generate-btn')).toContainText('Generate new password');
    await expect(page.locator('.checkbox-group')).toContainText('Include uppercase letters');
    await expect(page.locator('label[for="pass-length"]')).toContainText('Password length');

    for (const id of ['#inc-upper', '#inc-lower', '#inc-numbers', '#inc-symbols']) {
      await page.locator(id).uncheck();
    }
    await expect(page.locator('#pass-output')).toHaveValue('Select at least one character set.');

    await page.locator('[data-lang-toggle]').first().click();
    await expect(page.locator('#generate-btn')).toContainText('تولید رمز عبور جدید');
    await expect(page.locator('#pass-output')).toHaveValue('حداقل یک گزینه را انتخاب کنید!');
  });

  test('QR generator localizes labels and validation, then generates a downloadable image', async ({ page }) => {
    await page.goto('/tools/qr-code-generator/?lang=en');
    await expect(page.locator('#generate-btn')).toContainText('Generate QR code');
    await expect(page.locator('label[for="qr-input"]')).toContainText('Enter text or a URL');

    await page.locator('#generate-btn').click();
    await expect(page.locator('#qr-error')).toContainText('Enter text or a URL');

    await page.locator('[data-lang-toggle]').first().click();
    await expect(page.locator('#qr-error')).toContainText('لطفاً متنی برای تبدیل وارد کنید.');

    await page.locator('#qr-input').fill('https://example.com');
    await page.locator('#qr-size').fill('1200');
    await page.locator('#generate-btn').click();
    await expect(page.locator('#qr-result')).toBeVisible();
    await expect(page.locator('#qr-size')).toHaveValue('1000');
    await expect(page.locator('#download-btn')).toHaveAttribute('href', /^data:image\/png;base64,/);
  });

  test('unit converter localizes categories and dynamically generated unit options', async ({ page }) => {
    await page.goto('/tools/unit-converter/?lang=en');
    await expect(page.locator('label[for="uc-cat"]')).toContainText('Category');
    await expect(page.locator('#uc-cat option').first()).toHaveText('Length');
    await expect(page.locator('#uc-from option').first()).toHaveText('Millimeter');

    await page.locator('#uc-cat').selectOption('weight');
    await expect(page.locator('#uc-from option').first()).toHaveText('Milligram');
    await expect(page.locator('#uc-to option').nth(1)).toHaveText('Gram');

    await page.locator('[data-lang-toggle]').first().click();
    await expect(page.locator('#uc-cat option:checked')).toHaveText('وزن');
    await expect(page.locator('#uc-from option').first()).toHaveText('میلی‌گرم');
    await expect(page.locator('label[for="uc-value"]')).toContainText('مقدار');
  });
});
