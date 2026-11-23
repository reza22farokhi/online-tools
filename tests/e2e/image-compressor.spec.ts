import { test, expect } from '@playwright/test';

const tinyPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/S3sAAAAASUVORK5CYII=',
  'base64'
);

test('image compressor creates a real local image output and downloadable blob', async ({ page }) => {
  const uploads: string[] = [];
  page.on('request', request => {
    if (request.method() === 'POST' && new URL(request.url()).origin === 'http://localhost:4321') {
      uploads.push(request.url());
    }
  });

  await page.goto('/tools/image-compressor/');
  await page.locator('#ic-file').setInputFiles({
    name: 'pixel.png',
    mimeType: 'image/png',
    buffer: tinyPng
  });

  await expect(page.locator('#ic-workspace')).toBeVisible();
  await expect(page.locator('#ic-preview')).toHaveJSProperty('naturalWidth', 1);
  await expect(page.locator('#ic-orig-size')).not.toHaveText('-');

  await page.locator('#ic-quality').fill('65');
  await expect(page.locator('#ic-q-val')).toHaveText('65');
  await page.locator('#ic-format').selectOption('image/webp');
  await page.locator('#ic-process').click();

  const download = page.locator('#ic-download');
  await expect(download).toBeVisible();
  await expect(download).toHaveAttribute('href', /^blob:/);
  await expect(download).toHaveAttribute('download', 'compressed-image.webp');
  await expect(page.locator('#ic-new-size')).not.toHaveText('-');
  await expect(page.locator('#ic-reduction-wrap')).toBeVisible();
  const output = await download.getAttribute('href');
  const outputType = await page.evaluate(async (url) => (await (await fetch(url!)).blob()).type, output);
  expect(outputType).toBe('image/webp');
  expect(uploads).toEqual([]);
});

test('image compressor rejects unsupported and corrupt image files', async ({ page }) => {
  await page.goto('/tools/image-compressor/');

  await page.locator('#ic-file').setInputFiles({
    name: 'document.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('not an image')
  });
  await expect(page.locator('#ic-error')).toBeVisible();
  await expect(page.locator('#ic-error')).toContainText('فرمت تصویر پشتیبانی نمی‌شود');
  await expect(page.locator('#ic-workspace')).toBeHidden();

  await page.locator('#ic-file').setInputFiles({
    name: 'broken.png',
    mimeType: 'image/png',
    buffer: Buffer.from('invalid png bytes')
  });
  await expect(page.locator('#ic-error')).toBeVisible();
  await expect(page.locator('#ic-error')).toContainText('فایل تصویری معتبر نیست');
  await expect(page.locator('#ic-workspace')).toBeHidden();
});
