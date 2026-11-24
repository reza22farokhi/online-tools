import { test, expect } from '@playwright/test';

const tinyPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAFklEQVR4nGP8z8DAwMDAwMDAAAANHQEDasKb6QAAAABJRU5ErkJggg==',
  'base64'
);

test('image resizer generates a real JPEG blob with requested dimensions locally', async ({ page }) => {
  const uploads: string[] = [];
  page.on('request', request => {
    if (request.method() === 'POST' && new URL(request.url()).origin === 'http://localhost:4321') {
      uploads.push(request.url());
    }
  });

  await page.goto('/tools/image-resizer/');
  await page.locator('#ir-file').setInputFiles({
    name: 'source.png',
    mimeType: 'image/png',
    buffer: tinyPng
  });

  await expect(page.locator('#ir-workspace')).toBeVisible();
  await expect(page.locator('#ir-width')).toHaveValue('2');
  await expect(page.locator('#ir-height')).toHaveValue('2');

  await page.locator('#ir-width').fill('6');
  await expect(page.locator('#ir-height')).toHaveValue('6');
  await page.locator('#ir-process').click();

  const download = page.locator('#ir-download');
  await expect(download).toBeVisible();
  await expect(download).toHaveAttribute('href', /^blob:/);
  await expect(download).toHaveAttribute('download', 'resized-6x6.jpg');

  const output = await page.evaluate(async (url) => {
    const blob = await (await fetch(url!)).blob();
    const image = await createImageBitmap(blob);
    const signature = Array.from(new Uint8Array(await blob.slice(0, 3).arrayBuffer()));
    return { type: blob.type, size: blob.size, width: image.width, height: image.height, signature };
  }, await download.getAttribute('href'));

  expect(output.type).toBe('image/jpeg');
  expect(output.size).toBeGreaterThan(0);
  expect(output.width).toBe(6);
  expect(output.height).toBe(6);
  expect(output.signature).toEqual([0xff, 0xd8, 0xff]);
  expect(uploads).toEqual([]);
});

test('image resizer rejects invalid and excessive output dimensions', async ({ page }) => {
  await page.goto('/tools/image-resizer/');
  await page.locator('#ir-file').setInputFiles({
    name: 'source.png',
    mimeType: 'image/png',
    buffer: tinyPng
  });
  await expect(page.locator('#ir-workspace')).toBeVisible();

  await page.locator('#ir-width').fill('10001');
  await page.locator('#ir-height').fill('10001');
  await page.locator('#ir-process').click();
  await expect(page.locator('#ir-error')).toBeVisible();
  await expect(page.locator('#ir-error')).toContainText('ابعاد باید عدد صحیح');

  await page.locator('#ir-width').fill('5000');
  await page.locator('#ir-height').fill('5000');
  await page.locator('#ir-process').click();
  await expect(page.locator('#ir-error')).toContainText('حداکثر ۱۶ مگاپیکسل');
  await expect(page.locator('#ir-download')).toBeHidden();
});

test('image resizer rejects unsupported and corrupt image files', async ({ page }) => {
  await page.goto('/tools/image-resizer/');

  await page.locator('#ir-file').setInputFiles({
    name: 'notes.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('not an image')
  });
  await expect(page.locator('#ir-error')).toBeVisible();
  await expect(page.locator('#ir-error')).toContainText('فرمت تصویر پشتیبانی نمی‌شود');
  await expect(page.locator('#ir-workspace')).toBeHidden();

  await page.locator('#ir-file').setInputFiles({
    name: 'broken.png',
    mimeType: 'image/png',
    buffer: Buffer.from('corrupt image data')
  });
  await expect(page.locator('#ir-error')).toContainText('فایل تصویری معتبر نیست');
  await expect(page.locator('#ir-workspace')).toBeHidden();
});
