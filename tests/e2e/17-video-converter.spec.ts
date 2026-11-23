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


test('video converter performs real local WAV-to-MP3 and MP3-to-WebM conversions', async ({ page }) => {
  test.setTimeout(180_000);
  const uploads: string[] = [];
  const workerRequests: string[] = [];
  page.on('request', request => {
    if (new URL(request.url()).pathname === '/vendor/ffmpeg/0.12.15/worker.js') workerRequests.push(request.url());
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
  const mp3Artifact = await page.evaluate(async (url) => {
    const blob = await (await fetch(url!)).blob();
    const bytes = new Uint8Array(await blob.slice(0, 4).arrayBuffer());
    return { type: blob.type, signature: Array.from(bytes) };
  }, await page.locator('#vc-download').getAttribute('href'));
  expect(mp3Artifact.type).toBe('audio/mpeg');
  expect(
    (mp3Artifact.signature[0] === 0x49 && mp3Artifact.signature[1] === 0x44 && mp3Artifact.signature[2] === 0x33) ||
    (mp3Artifact.signature[0] === 0xff && (mp3Artifact.signature[1] & 0xe0) === 0xe0)
  ).toBe(true);
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
  const webmArtifact = await page.evaluate(async (url) => {
    const blob = await (await fetch(url!)).blob();
    const bytes = new Uint8Array(await blob.slice(0, 4).arrayBuffer());
    return { type: blob.type, signature: Array.from(bytes) };
  }, await page.locator('#vc-download').getAttribute('href'));
  expect(webmArtifact.type).toBe('video/webm');
  expect(webmArtifact.signature).toEqual([0x1a, 0x45, 0xdf, 0xa3]);
  expect(uploads).toEqual([]);
  expect(workerRequests.length).toBeGreaterThan(0);
});


test('video converter rejects empty and unsupported files before starting the engine', async ({ page }) => {
  await page.goto('/tools/video-converter/');
  await page.locator('#vc-file').setInputFiles({
    name: 'empty.mp4',
    mimeType: 'video/mp4',
    buffer: Buffer.alloc(0)
  });
  await expect(page.locator('#vc-error')).toBeVisible();
  await expect(page.locator('#vc-error')).toContainText('فایل خالی است');
  await expect(page.locator('#vc-workspace')).toBeHidden();

  await page.locator('#vc-file').setInputFiles({
    name: 'payload.bin',
    mimeType: 'application/octet-stream',
    buffer: Buffer.from('not media')
  });
  await expect(page.locator('#vc-error')).toBeVisible();
  await expect(page.locator('#vc-error')).toContainText('فرمت فایل ناشناخته');
  await expect(page.locator('#vc-workspace')).toBeHidden();
  await expect(page.locator('#vc-progress-wrap')).toBeHidden();
});
