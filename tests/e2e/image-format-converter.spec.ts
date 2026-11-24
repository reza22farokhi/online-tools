import { test, expect } from '@playwright/test';

const tinyPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAFklEQVR4nGP8z8DAwMDAwMDAwMDAAAANHQEDasKb6QAAAABJRU5ErkJggg==',
  'base64'
);

test('image format converter creates valid local JPEG, PNG and WebP blobs', async ({ page }) => {
  const uploads: string[] = [];
  page.on('request', request => {
    if (request.method() === 'POST' && new URL(request.url()).origin === 'http://localhost:4321') {
      uploads.push(request.url());
    }
  });

  await page.goto('/tools/format-converter/');
  await page.locator('#fc-file').setInputFiles({
    name: 'source.png',
    mimeType: 'image/png',
    buffer: tinyPng
  });

  await expect(page.locator('#fc-workspace')).toBeVisible();
  await expect(page.locator('#fc-preview')).toHaveJSProperty('naturalWidth', 2);
  await expect(page.locator('#fc-preview')).toHaveJSProperty('naturalHeight', 2);
  await expect(page.locator('#fc-file-info')).toContainText('2×2');

  const cases = [
    { mime: 'image/jpeg', extension: 'jpg', signature: [0xff, 0xd8, 0xff] },
    { mime: 'image/png', extension: 'png', signature: [0x89, 0x50, 0x4e, 0x47] },
    { mime: 'image/webp', extension: 'webp', signature: [0x52, 0x49, 0x46, 0x46] }
  ];

  for (const output of cases) {
    await page.locator('#fc-format').selectOption(output.mime);
    await page.locator('#fc-process').click();

    const download = page.locator('#fc-download');
    await expect(download).toBeVisible();
    await expect(download).toHaveAttribute('href', /^blob:/);
    await expect(download).toHaveAttribute('download', `converted-image.${output.extension}`);

    const result = await page.evaluate(async (url) => {
      const blob = await (await fetch(url!)).blob();
      const bytes = new Uint8Array(await blob.slice(0, 4).arrayBuffer());
      return { type: blob.type, size: blob.size, signature: Array.from(bytes) };
    }, await download.getAttribute('href'));

    expect(result.type).toBe(output.mime);
    expect(result.size).toBeGreaterThan(0);
    expect(result.signature.slice(0, output.signature.length)).toEqual(output.signature);
  }

  expect(uploads).toEqual([]);
});

test('image format converter rejects unsupported and corrupt image files', async ({ page }) => {
  await page.goto('/tools/format-converter/');

  await page.locator('#fc-file').setInputFiles({
    name: 'document.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('not an image')
  });
  await expect(page.locator('#fc-error')).toBeVisible();
  await expect(page.locator('#fc-error')).toContainText('فرمت تصویر پشتیبانی نمی‌شود');
  await expect(page.locator('#fc-workspace')).toBeHidden();

  await page.locator('#fc-file').setInputFiles({
    name: 'broken.png',
    mimeType: 'image/png',
    buffer: Buffer.from('invalid png bytes')
  });
  await expect(page.locator('#fc-error')).toBeVisible();
  await expect(page.locator('#fc-error')).toContainText('فایل تصویری معتبر نیست');
  await expect(page.locator('#fc-workspace')).toBeHidden();
});

test('image format converter rejects images larger than 20 MiB', async ({ page }) => {
  await page.goto('/tools/format-converter/');
  await page.locator('#fc-file').setInputFiles({
    name: 'oversized.png',
    mimeType: 'image/png',
    buffer: Buffer.alloc(20 * 1024 * 1024 + 1)
  });

  await expect(page.locator('#fc-error')).toBeVisible();
  await expect(page.locator('#fc-workspace')).toBeHidden();
});
