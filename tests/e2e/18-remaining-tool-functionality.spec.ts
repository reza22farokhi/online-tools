import { test, expect } from '@playwright/test';

const tinyPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAFklEQVR4nGP8z8DAwMDAxMDAwMDAAAANHQEDasKb6QAAAABJRU5ErkJggg==',
  'base64'
);

test('color picker reads a real pixel from a local image', async ({ page }) => {
  await page.goto('/tools/color-picker/?lang=en');
  await page.locator('#cp-file').setInputFiles({
    name: 'color-picker-e2e.png',
    mimeType: 'image/png',
    buffer: tinyPng
  });
  await expect(page.locator('#cp-workspace')).toBeVisible();
  await page.locator('#cp-canvas').click({ position: { x: 1, y: 1 } });
  await expect(page.locator('#cp-color-box')).toBeVisible();
  await expect(page.locator('#cp-hex')).toHaveValue(/^#[0-9A-F]{6}$/);
  await expect(page.locator('#cp-rgb')).toHaveValue(/^rgb\(\d+, \d+, \d+\)$/);
});

test('contrast checker calculates WCAG contrast ratios and thresholds', async ({ page }) => {
  await page.goto('/tools/contrast-checker/?lang=en');
  await expect(page.locator('#cc-ratio')).toHaveText(/^\d+\.\d{2}:1$/);
  await page.locator('#cc-fg-hex').fill('#000000');
  await expect(page.locator('#cc-ratio')).toHaveText('21.00:1');
  await expect(page.locator('#cc-checks .cc-check')).toHaveCount(4);
  await expect(page.locator('#cc-checks .cc-pass')).toHaveCount(4);
});

test('UUID generator creates the requested number of unique uppercase UUIDs without hyphens', async ({ page }) => {
  await page.goto('/tools/uuid-generator/?lang=en');
  await page.locator('#ug-count').fill('3');
  await page.locator('#ug-upper').check();
  await page.locator('#ug-nohyphen').check();

  const output = page.locator('#ug-output');
  await expect(output).toHaveValue(/^[0-9A-F]{32}(\n[0-9A-F]{32}){2}$/);
  const values = (await output.inputValue()).split('\n');
  expect(new Set(values).size).toBe(3);
  await expect(page.locator('#ug-copy')).toBeEnabled();
});

test('meta tag generator escapes HTML and rejects unsafe URL schemes', async ({ page }) => {
  await page.goto('/tools/meta-tag-generator/?lang=en');
  await page.locator('#mtg-title').fill('<img src=x onerror=alert(1)>');
  await page.locator('#mtg-desc').fill('A safe description');
  await page.locator('#mtg-url').fill('https://example.com/page');
  await page.locator('#mtg-author').fill('Example Team');

  const output = page.locator('#mtg-output');
  await expect(output).toHaveValue(/&lt;img src=x onerror=alert\(1\)&gt;/);
  await expect(output).toHaveValue(/<link rel="canonical" href="https:\/\/example\.com\/page">/);
  expect(await output.inputValue()).not.toContain('<img');

  await page.locator('#mtg-image').fill('javascript:alert(1)');
  await expect(page.locator('#mtg-error')).toBeVisible();
  await expect(output).toHaveValue('');
  await expect(page.locator('#mtg-copy')).toBeDisabled();
});

test('Open Graph preview updates content and blocks remote image loading', async ({ page }) => {
  const remoteImageRequests: string[] = [];
  page.on('request', request => {
    if (request.url().startsWith('https://untrusted.example/')) remoteImageRequests.push(request.url());
  });

  await page.goto('/tools/og-preview/?lang=en');
  await page.locator('#og-url').fill('https://www.example.com/article');
  await page.locator('#og-title').fill('Open Graph test title');
  await page.locator('#og-desc').fill('Open Graph test description');
  await expect(page.locator('#prev-domain')).toHaveText('example.com');
  await expect(page.locator('#prev-title')).toHaveText('Open Graph test title');
  await expect(page.locator('#prev-desc')).toHaveText('Open Graph test description');

  await page.locator('#og-image').fill('https://untrusted.example/image.png');
  await expect(page.locator('#og-image-note')).toBeVisible();
  await expect(page.locator('#prev-img')).toHaveAttribute('src', /^data:image\/svg\+xml/);
  expect(remoteImageRequests).toEqual([]);
});

test('Persian text refiner normalizes Arabic characters, half-spaces, punctuation, and digits', async ({ page }) => {
  await page.goto('/tools/persian-text-refiner/?lang=fa');
  await page.locator('#input-text').fill('كريم 123 می روم, دنيا?');
  await expect(page.locator('#output-text')).toHaveValue('کریم ۱۲۳ می‌روم، دنیا؟');
  await page.locator('#btn-clear').click();
  await expect(page.locator('#input-text')).toHaveValue('');
  await expect(page.locator('#output-text')).toHaveValue('');
});

test('Regex tester executes a safe pattern in its Worker and renders matches', async ({ page }) => {
  await page.goto('/tools/regex-tester/?lang=en');
  await page.locator('#rt-pattern').fill('\\d+');
  await page.locator('#rt-input').fill('abc 123 xyz 45');
  await expect(page.locator('#rt-status')).toContainText('2 matches found', { timeout: 10_000 });
  await expect(page.locator('#rt-matches-wrap')).toBeVisible();
  await expect(page.locator('#rt-matches')).toContainText('123');
  await expect(page.locator('#rt-matches')).toContainText('45');
});

test('robots.txt generator builds valid rules and rejects unsafe sitemap schemes', async ({ page }) => {
  await page.goto('/tools/robots-txt-generator/?lang=en');
  await page.locator('#rb-disallow').fill('/admin\n/private');
  await page.locator('#rb-allow').fill('/public');
  await page.locator('#rb-sitemap').fill('https://example.com/sitemap.xml');

  const output = page.locator('#rb-output');
  await expect(output).toHaveValue(/User-agent: \*/);
  await expect(output).toHaveValue(/Disallow: \/admin/);
  await expect(output).toHaveValue(/Disallow: \/private/);
  await expect(output).toHaveValue(/Allow: \/public/);
  await expect(output).toHaveValue(/Sitemap: https:\/\/example\.com\/sitemap\.xml/);

  await page.locator('#rb-sitemap').fill('javascript:alert(1)');
  await expect(page.locator('#rb-error')).toBeVisible();
  await expect(output).toHaveValue('');
});

test('SERP preview updates snippets and truncates overlong metadata', async ({ page }) => {
  await page.goto('/tools/serp-preview/?lang=en');
  await page.locator('#serp-url').fill('https://www.example.com/docs/guide');
  await page.locator('#serp-title').fill('My SEO title');
  await page.locator('#serp-desc').fill('A concise search result description.');

  await expect(page.locator('#prev-url')).toHaveText('example.com › docs › guide');
  await expect(page.locator('#prev-title')).toHaveText('My SEO title');
  await expect(page.locator('#prev-desc')).toHaveText('A concise search result description.');
  await expect(page.locator('#serp-title-count')).toHaveText('12');
  await expect(page.locator('#serp-desc-count')).toHaveText('36');

  await page.locator('#serp-title').fill('T'.repeat(70));
  const previewTitle = await page.locator('#prev-title').textContent();
  expect(previewTitle?.length).toBeLessThanOrEqual(60);
  expect(previewTitle).toContain('…');
});

test('Unix timestamp converter supports timestamp-to-date and date-to-timestamp directions', async ({ page }) => {
  await page.goto('/tools/unix-timestamp/?lang=en');
  await page.locator('#uts-input-ts').fill('1700000000');
  await page.locator('#uts-convert-ts').click();
  await expect(page.locator('#uts-results-ts')).toBeVisible();
  await expect(page.locator('#uts-out-iso')).toContainText('2023-11-14');

  await page.locator('#uts-date-input').fill('2024-03-20T12:34');
  await page.locator('#uts-convert-date').click();
  await expect(page.locator('#uts-results-date')).toBeVisible();
  const seconds = Number(await page.locator('#uts-out-sec').textContent());
  const milliseconds = Number(await page.locator('#uts-out-ms').textContent());
  expect(Number.isFinite(seconds)).toBe(true);
  expect(milliseconds).toBe(seconds * 1000);
});


test('standalone JWT Inspector decodes locally, escapes untrusted claims, and shows the correct privacy notice', async ({ page }) => {
  await page.goto('/tools/jwt-inspector/?lang=en');
  const privacy = page.locator('.jwt-subtitle');
  await expect(privacy).toContainText('not sent to our servers');
  await expect(privacy).toContainText('Essential technical requests');
  await expect(privacy).not.toContainText(/advert|ad network|ads/i);

  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    sub: '123',
    name: '<img src=x onerror=alert(1)>',
    iat: 1516239022
  })).toString('base64url');
  await page.locator('#jwt-input').fill(`${header}.${payload}.signature`);

  await expect(page.locator('#jwt-result')).toBeVisible();
  await expect(page.locator('#jwt-payload-pre')).toContainText('<img src=x onerror=alert(1)>');
  await expect(page.locator('#jwt-result img')).toHaveCount(0);
  await expect(page.locator('#jwt-claims-table tbody')).toContainText('<img src=x onerror=alert(1)>');
});
