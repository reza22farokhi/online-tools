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


test('video converter performs a real local WAV-to-MP3 conversion', async ({ page }) => {
  test.setTimeout(180_000);
  const uploads: string[] = [];
  page.on('request', request => {
    if (request.method() === 'POST' && new URL(request.url()).origin === 'http://localhost:4321') uploads.push(request.url());
  });

  const sampleRate = 8000;
  const sampleCount = sampleRate / 2;
  const pcm = Buffer.alloc(sampleCount * 2);
  for (let i = 0; i < sampleCount; i++) {
    pcm.writeInt16LE(Math.round(Math.sin((2 * Math.PI * 440 * i) / sampleRate) * 12000), i * 2);
  }
  const wav = Buffer.alloc(44 + pcm.length);
  wav.write('RIFF', 0);
  wav.writeUInt32LE(36 + pcm.length, 4);
  wav.write('WAVE', 8);
  wav.write('fmt ', 12);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(sampleRate, 24);
  wav.writeUInt32LE(sampleRate * 2, 28);
  wav.writeUInt16LE(2, 32);
  wav.writeUInt16LE(16, 34);
  wav.write('data', 36);
  wav.writeUInt32LE(pcm.length, 40);
  pcm.copy(wav, 44);

  await page.goto('/en/tools/video-converter/');
  await page.locator('#vc-file').setInputFiles({
    name: 'generated-tone.wav',
    mimeType: 'audio/wav',
    buffer: wav
  });
  await page.locator('#vc-format').selectOption('mp3');
  await page.locator('#vc-process').click();
  await expect(page.locator('#vc-download')).toBeVisible({ timeout: 150_000 });
  await expect(page.locator('#vc-status')).toContainText('Conversion completed.');
  await expect(page.locator('#vc-result')).toBeVisible();
  await expect(page.locator('#vc-after')).not.toHaveText('—');
  await expect(page.locator('#vc-download')).toHaveAttribute('href', /^blob:/);
  // Reuse the generated MP3 as input to cover the user's MP3 -> WebM path.
  const mp3Url = await page.locator('#vc-download').getAttribute('href');
  if (!mp3Url) throw new Error('MP3 output URL was not created');
  const mp3Base64 = await page.evaluate(async (url) => {
    const bytes = new Uint8Array(await (await fetch(url)).arrayBuffer());
    let binary = '';
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary);
  }, mp3Url);

  await page.locator('#vc-reset').click();
  await page.locator('#vc-file').setInputFiles({
    name: 'generated-tone.mp3',
    mimeType: 'audio/mpeg',
    buffer: Buffer.from(mp3Base64, 'base64')
  });
  await page.locator('#vc-format').selectOption('webm');
  await page.locator('#vc-process').click();
  await expect(page.locator('#vc-download')).toBeVisible({ timeout: 150_000 });
  await expect(page.locator('#vc-status')).toContainText('Conversion completed.');
  await expect(page.locator('#vc-download')).toHaveAttribute('download', /\.webm$/);
  await expect(page.locator('#vc-download')).toHaveAttribute('href', /^blob:/);
  expect(uploads).toEqual([]);
});
