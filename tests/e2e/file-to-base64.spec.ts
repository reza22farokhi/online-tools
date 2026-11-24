import { test, expect } from '@playwright/test';

test('file to Base64 converts exact file bytes locally into a Data URI', async ({ page }) => {
  const uploads: string[] = [];
  page.on('request', request => {
    if (request.method() === 'POST' && new URL(request.url()).origin === 'http://localhost:4321') {
      uploads.push(request.url());
    }
  });

  const bytes = Buffer.from([0, 1, 2, 65, 66, 67, 127, 128, 255]);
  await page.goto('/tools/file-to-base64/');
  await page.locator('#fb-file').setInputFiles({
    name: 'sample.bin',
    mimeType: 'application/octet-stream',
    buffer: bytes
  });

  await expect(page.locator('#fb-workspace')).toBeVisible();
  await expect(page.locator('#fb-name')).toHaveText('sample.bin');
  const output = page.locator('#fb-output');
  await expect(output).toHaveValue(/^data:application\/octet-stream;base64,/);
  const decoded = await page.evaluate((dataUri) => {
    const payload = dataUri.slice(dataUri.indexOf(',') + 1);
    return Array.from(atob(payload), char => char.charCodeAt(0));
  }, await output.inputValue());
  expect(decoded).toEqual([...bytes]);
  await expect(page.locator('#fb-copy')).toBeEnabled();
  expect(uploads).toEqual([]);
});

test('file to Base64 rejects files larger than 10 MiB without exposing output', async ({ page }) => {
  await page.goto('/tools/file-to-base64/');
  await page.locator('#fb-file').setInputFiles({
    name: 'oversized.bin',
    mimeType: 'application/octet-stream',
    buffer: Buffer.alloc(10 * 1024 * 1024 + 1)
  });

  await expect(page.locator('#fb-error')).toBeVisible();
  await expect(page.locator('#fb-error')).toContainText('بیشتر از حد مجاز');
  await expect(page.locator('#fb-workspace')).toBeHidden();
  await expect(page.locator('#fb-output')).toBeEmpty();
});

test('file to Base64 rejects empty files', async ({ page }) => {
  await page.goto('/tools/file-to-base64/');
  await page.locator('#fb-file').setInputFiles({
    name: 'empty.txt',
    mimeType: 'text/plain',
    buffer: Buffer.alloc(0)
  });

  await expect(page.locator('#fb-error')).toBeVisible();
  await expect(page.locator('#fb-error')).toContainText('فایل خالی است');
  await expect(page.locator('#fb-workspace')).toBeHidden();
});
