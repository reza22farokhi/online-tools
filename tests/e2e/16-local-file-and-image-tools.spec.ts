import { test, expect } from '@playwright/test';

const tinyPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAFklEQVR4nGP8z8DAwMDAxMDAwMDAAAANHQEDasKb6QAAAABJRU5ErkJggg==',
  'base64'
);

test('file to Base64 converts a local text file into a correct data URI', async ({ page }) => {
  await page.goto('/tools/file-to-base64/?lang=en');
  await page.locator('#fb-file').setInputFiles({
    name: 'base64-e2e.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('file-to-base64-e2e')
  });
  await expect(page.locator('#fb-workspace')).toBeVisible();
  await expect(page.locator('#fb-name')).toHaveText('base64-e2e.txt');
  await expect(page.locator('#fb-output')).toHaveValue(
    'data:text/plain;base64,' + Buffer.from('file-to-base64-e2e').toString('base64')
  );
  await expect(page.locator('#fb-copy')).toBeEnabled();
});

test('image resizer accepts a local image and produces a downloadable output blob', async ({ page }) => {
  await page.goto('/tools/image-resizer/?lang=en');
  await page.locator('#ir-file').setInputFiles({
    name: 'tiny.png',
    mimeType: 'image/png',
    buffer: tinyPng
  });
  await expect(page.locator('#ir-workspace')).toBeVisible();
  await expect(page.locator('#ir-preview')).toHaveJSProperty('naturalWidth', 2);
  await page.locator('#ir-process').click();
  await expect(page.locator('#ir-download')).toBeVisible();
  await expect(page.locator('#ir-download')).toHaveAttribute('href', /^blob:/);
  await expect(page.locator('#ir-download')).toHaveAttribute('download', /resized-2x2\.jpg/);
});

test('image compressor produces a downloadable compressed image', async ({ page }) => {
  await page.goto('/tools/image-compressor/?lang=en');
  await page.locator('#ic-file').setInputFiles({
    name: 'tiny.png',
    mimeType: 'image/png',
    buffer: tinyPng
  });
  await expect(page.locator('#ic-workspace')).toBeVisible();
  await expect(page.locator('#ic-preview')).toHaveJSProperty('naturalWidth', 2);
  await page.locator('#ic-process').click();
  await expect(page.locator('#ic-download')).toBeVisible();
  await expect(page.locator('#ic-download')).toHaveAttribute('href', /^blob:/);
  await expect(page.locator('#ic-download')).toHaveAttribute('download', /compressed-image\.jpg/);
  await expect(page.locator('#ic-new-size')).not.toHaveText('-');
});

test('image format converter produces a downloadable image in the selected format', async ({ page }) => {
  await page.goto('/tools/format-converter/?lang=en');
  await page.locator('#fc-file').setInputFiles({
    name: 'tiny.png',
    mimeType: 'image/png',
    buffer: tinyPng
  });
  await expect(page.locator('#fc-workspace')).toBeVisible();
  await expect(page.locator('#fc-preview')).toHaveJSProperty('naturalWidth', 2);
  await page.locator('#fc-format').selectOption('image/webp');
  await page.locator('#fc-process').click();
  await expect(page.locator('#fc-download')).toBeVisible();
  await expect(page.locator('#fc-download')).toHaveAttribute('href', /^blob:/);
  await expect(page.locator('#fc-download')).toHaveAttribute('download', /converted-image\.webp/);
});

test('QR code generator renders a real canvas for a URL', async ({ page }) => {
  await page.goto('/tools/qr-code-generator/?lang=en');
  await page.locator('#qr-input').fill('https://example.com/e2e');
  await page.locator('#generate-btn').click();
  await expect(page.locator('#qr-result')).toBeVisible();
  const dimensions = await page.locator('#qr-canvas').evaluate((canvas: HTMLCanvasElement) => ({
    width: canvas.width,
    height: canvas.height,
    dataLength: canvas.toDataURL('image/png').length
  }));
  expect(dimensions.width).toBeGreaterThan(0);
  expect(dimensions.height).toBeGreaterThan(0);
  expect(dimensions.dataLength).toBeGreaterThan(100);
});

test('CSV and JSON converter transforms both directions', async ({ page }) => {
  await page.goto('/tools/csv-json-converter/?lang=en');
  await expect(page.locator('#cjc-out')).toHaveValue(/"name"/);
  await page.locator('.cjc-mode[data-mode="json2csv"]').click();
  await expect(page.locator('#cjc-out')).toHaveValue(/name,age/);
  await expect(page.locator('#cjc-copy')).toBeEnabled();
});
