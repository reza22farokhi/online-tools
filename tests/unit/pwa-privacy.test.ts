import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const manifest = JSON.parse(readFileSync('public/manifest.json', 'utf8')) as Record<string, unknown>;
const bootstrap = readFileSync('public/scripts/site-bootstrap.js', 'utf8');
const serviceWorker = readFileSync('public/sw.js', 'utf8');
const baseLayout = readFileSync('src/layouts/BaseLayout.astro', 'utf8');
const privacy = readFileSync('src/pages/privacy.astro', 'utf8');

describe('PWA privacy', () => {
  it('does not advertise a GET share target that forwards shared text in the request URL', () => {
    expect(manifest.share_target).toBeUndefined();
  });
  it('uses an existing PNG Apple touch icon', () => {
    expect(baseLayout).toContain('rel="apple-touch-icon" sizes="192x192"');
    expect(baseLayout).toContain('icons/icon-192.png');
    expect(existsSync('public/icons/icon-192.png')).toBe(true);
  });
  it('documents offline Cache Storage and never caches query-bearing URLs', () => {
    expect(serviceWorker).toContain('if (url.search) return false;');
    expect(privacy).toContain('Cache Storage');
    expect(privacy).toContain('نشانی‌های دارای پارامتر پرس‌وجو');
  });
  it('hides inactive language-only content during the early bootstrap pass', () => {
    expect(bootstrap).toContain("document.querySelectorAll('[data-lang-only]')");
    expect(bootstrap).toContain("element.hidden = element.getAttribute('data-lang-only') !== lang");
  });

});
