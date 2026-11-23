import { test, expect } from '@playwright/test';

test('QR generator creates a real PNG canvas and downloadable data URL locally', async ({ page }) => {
  const uploads: string[] = [];
  page.on('request', request => {
    if (request.method() === 'POST') uploads.push(request.url());
  });

  await page.goto('/tools/qr-code-generator/');
  await page.locator('#qr-input').fill('https://abzar-tools.ir/tools/qr-code-generator/');
  await page.locator('#qr-size').fill('350');
  await page.locator('#generate-btn').click();

  await expect(page.locator('#qr-result')).toBeVisible();
  const canvas = page.locator('#qr-canvas');
  await expect(canvas).toBeVisible();
  await expect.poll(() => canvas.evaluate((element: HTMLCanvasElement) => element.width)).toBe(350);
  await expect.poll(() => canvas.evaluate((element: HTMLCanvasElement) => element.toDataURL('image/png'))).toMatch(/^data:image\/png;base64,/);
  await expect(page.locator('#download-btn')).toHaveAttribute('href', /^data:image\/png;base64,/);
  await expect(page.locator('#download-btn')).toHaveAttribute('download', 'qrcode.png');
  await expect(page.locator('#qr-error')).toBeHidden();
  expect(uploads).toEqual([]);
});

test('QR generator validates empty and oversized input without showing stale output', async ({ page }) => {
  await page.goto('/tools/qr-code-generator/');

  await page.locator('#generate-btn').click();
  await expect(page.locator('#qr-error')).toBeVisible();
  await expect(page.locator('#qr-error')).toContainText('لطفاً متنی برای تبدیل وارد کنید');
  await expect(page.locator('#qr-result')).toBeHidden();

  await page.locator('#qr-input').fill('x'.repeat(2001));
  await page.locator('#generate-btn').click();
  await expect(page.locator('#qr-error')).toContainText('حداکثر ۲۰۰۰ بایت');
  await expect(page.locator('#qr-result')).toBeHidden();
});

test('QR generator clamps requested dimensions to its supported range', async ({ page }) => {
  await page.goto('/tools/qr-code-generator/');
  await page.locator('#qr-input').fill('QA dimension check');
  await page.locator('#qr-size').fill('5000');
  await page.locator('#generate-btn').click();

  await expect(page.locator('#qr-result')).toBeVisible();
  await expect(page.locator('#qr-size')).toHaveValue('1000');
  await expect.poll(() => page.locator('#qr-canvas').evaluate((element: HTMLCanvasElement) => element.width)).toBe(1000);
});
