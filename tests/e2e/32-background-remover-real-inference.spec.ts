import { test, expect } from '@playwright/test';

test.setTimeout(360_000);

const tinyPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAFklEQVR4nGP8z8DAwMDAxMDAwMDAAAANHQEDasKb6QAAAABJRU5ErkJggg==',
  'base64'
);

test('background remover runs real browser inference and keeps the source image local', async ({ page }) => {
  const uploadedImageRequests: string[] = [];
  page.on('request', (request) => {
    if (request.method() !== 'POST') return;
    const body = request.postDataBuffer();
    if (body?.includes(tinyPng)) uploadedImageRequests.push(request.url());
  });

  await page.goto('/tools/background-remover/?lang=en');
  await page.locator('#br-file').setInputFiles({
    name: 'synthetic-e2e.png',
    mimeType: 'image/png',
    buffer: tinyPng
  });

  await expect(page.locator('#br-progress')).toBeVisible();
  await expect(page.locator('#br-result')).toBeVisible({ timeout: 330_000 });
  await expect(page.locator('#br-download')).toBeEnabled();

  const output = await page.locator('#br-after').evaluate(async (image: HTMLImageElement) => {
    await image.decode();
    const response = await fetch(image.src);
    const blob = await response.blob();
    return {
      width: image.naturalWidth,
      height: image.naturalHeight,
      type: blob.type,
      size: blob.size
    };
  });

  expect(output.width).toBeGreaterThan(0);
  expect(output.height).toBeGreaterThan(0);
  expect(output.type).toBe('image/png');
  expect(output.size).toBeGreaterThan(100);
  expect(uploadedImageRequests).toEqual([]);
});
