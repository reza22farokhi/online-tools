import { test, expect } from '@playwright/test';

test('background remover rejects empty, unsupported and oversized files before loading the model', async ({ page }) => {
  await page.goto('/tools/background-remover/?lang=en');

  await page.locator('#br-file').setInputFiles({
    name: 'empty.png',
    mimeType: 'image/png',
    buffer: Buffer.alloc(0)
  });
  await expect(page.locator('#br-error')).toBeVisible();
  await expect(page.locator('#br-error')).toContainText('Image size must not exceed 10 MB');
  await expect(page.locator('#br-progress')).toBeHidden();
  await expect(page.locator('#br-result')).toBeHidden();

  await page.locator('#br-file').setInputFiles({
    name: 'document.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('%PDF-1.7')
  });
  await expect(page.locator('#br-error')).toContainText('Please choose a valid image file.');
  await expect(page.locator('#br-progress')).toBeHidden();

  await page.locator('#br-file').setInputFiles({
    name: 'oversized.png',
    mimeType: 'image/png',
    buffer: Buffer.alloc(10 * 1024 * 1024 + 1)
  });
  await expect(page.locator('#br-error')).toContainText('Image size must not exceed 10 MB');
  await expect(page.locator('#br-progress')).toBeHidden();
  await expect(page.locator('#br-result')).toBeHidden();
});

test('background remover rejects corrupt image data without starting AI inference', async ({ page }) => {
  await page.goto('/tools/background-remover/?lang=en');
  await page.locator('#br-file').setInputFiles({
    name: 'corrupt.png',
    mimeType: 'image/png',
    buffer: Buffer.from('this is not a PNG image')
  });

  await expect(page.locator('#br-error')).toBeVisible();
  await expect(page.locator('#br-error')).toContainText('Please choose a valid image file.');
  await expect(page.locator('#br-progress')).toBeHidden();
  await expect(page.locator('#br-result')).toBeHidden();
  await expect(page.locator('#br-download')).toBeDisabled();
});
