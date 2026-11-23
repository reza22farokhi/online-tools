import { test, expect } from '@playwright/test';

test('video converter route renders localized metadata and browser-only controls', async ({ page }) => {
  const response = await page.goto('/tools/video-converter/');
  expect(response?.status()).toBe(200);
  await expect(page.locator('html')).toHaveAttribute('lang', 'fa');
  await expect(page.locator('article h1')).toContainText('مبدل و فشرده‌ساز ویدیو');
  await expect(page.locator('#vc-dropzone')).toBeVisible();
  await expect(page.locator('#vc-format')).toHaveValue('mp4');
  await expect(page.locator('#vc-quality')).toHaveValue('medium');
  await expect(page.locator('.vc-privacy')).toContainText('به سرور سایت ارسال نمی‌شود');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://abzar-tools.ir/tools/video-converter/');
});

test('video converter rejects unknown media types without uploading anything', async ({ page }) => {
  const uploads: string[] = [];
  page.on('request', request => {
    if (request.method() === 'POST' && new URL(request.url()).origin === 'https://abzar-tools.ir') uploads.push(request.url());
  });
  await page.goto('/tools/video-converter/');
  await page.locator('#vc-file').setInputFiles({
    name: 'unknown.payload',
    mimeType: 'application/octet-stream',
    buffer: Buffer.from('not a media file')
  });
  await expect(page.locator('#vc-error')).toBeVisible();
  await expect(page.locator('#vc-error')).toContainText('فرمت فایل ناشناخته');
  expect(uploads).toEqual([]);
});

test('static English video converter route has English direction and FAQ', async ({ page }) => {
  const response = await page.goto('/en/tools/video-converter/');
  expect(response?.status()).toBe(200);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  await expect(page.locator('article h1')).toContainText('In-Browser Video Converter');
  await expect(page.locator('.tool-faq[data-lang-only="en"]')).toBeVisible();
  await expect(page.locator('.tool-faq[data-lang-only="fa"]')).toBeHidden();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://abzar-tools.ir/en/tools/video-converter/');
});
