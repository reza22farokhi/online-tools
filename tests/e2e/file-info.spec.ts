import { createHash } from 'node:crypto';
import { test, expect } from '@playwright/test';

test('file info displays metadata and computes the exact SHA-256 locally', async ({ page }) => {
  const uploads: string[] = [];
  page.on('request', request => {
    if (request.method() === 'POST' && new URL(request.url()).origin === 'http://localhost:4321') {
      uploads.push(request.url());
    }
  });

  const bytes = Buffer.from('file-info-sha256-e2e\u0000with-binary-\u00ff');
  const expectedHash = createHash('sha256').update(bytes).digest('hex');

  await page.goto('/tools/file-info/?lang=en');
  await page.locator('#fi-file').setInputFiles({
    name: 'integrity-check.txt',
    mimeType: 'text/plain',
    buffer: bytes
  });

  await expect(page.locator('#fi-workspace')).toBeVisible();
  await expect(page.locator('#fi-name')).toHaveText('integrity-check.txt');
  await expect(page.locator('#fi-type')).toHaveText('text/plain');
  await expect(page.locator('#fi-ext')).toHaveText('TXT');
  await expect(page.locator('#fi-size')).toHaveText(String(bytes.length) + ' Bytes');
  await expect(page.locator('#fi-hash')).toHaveValue(expectedHash);
  await expect(page.locator('#fi-copy-hash')).toBeEnabled();
  expect(uploads).toEqual([]);
});

test('file info rejects empty files and does not expose a hash workspace', async ({ page }) => {
  await page.goto('/tools/file-info/');
  await page.locator('#fi-file').setInputFiles({
    name: 'empty.txt',
    mimeType: 'text/plain',
    buffer: Buffer.alloc(0)
  });

  await expect(page.locator('#fi-error')).toBeVisible();
  await expect(page.locator('#fi-error')).toContainText('فایل خالی است');
  await expect(page.locator('#fi-workspace')).toBeHidden();
  await expect(page.locator('#fi-copy-hash')).toBeDisabled();
});

test('file info treats an uploaded filename as text rather than HTML', async ({ page }) => {
  await page.goto('/tools/file-info/?lang=en');
  await page.locator('#fi-file').setInputFiles({
    name: '<img src=x onerror=alert(1)>.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('safe filename')
  });

  await expect(page.locator('#fi-workspace')).toBeVisible();
  await expect(page.locator('#fi-name')).toHaveText('<img src=x onerror=alert(1)>.txt');
  await expect(page.locator('#fi-name img')).toHaveCount(0);
  await expect(page.locator('#fi-hash')).toHaveValue(/^[a-f0-9]{64}$/);
});
