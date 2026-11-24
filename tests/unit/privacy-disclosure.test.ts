import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const privacy = readFileSync('src/pages/privacy.astro', 'utf8');
const about = readFileSync('src/pages/about.astro', 'utf8');
const toolLayout = readFileSync('src/layouts/ToolLayout.astro', 'utf8');

describe('privacy disclosures', () => {
  it('explains local tool-input processing and accurately discloses Yektanet advertising', () => {
    expect(privacy).toContain('محتوای واردشده در ابزارها');
    expect(privacy).toContain('اسکریپت تبلیغاتی یکتانت');
    expect(privacy).toContain('درخواست‌های تبلیغاتی');
    expect(privacy).toContain('Yektanet');
    expect(privacy).not.toContain('هیچ اسکریپت یا شبکه تبلیغاتی شخص ثالثی');
    expect(privacy).toContain('یکتانت');
    expect(privacy).not.toMatch(/تپسل|Tapsell|MediaAd/i);
  });

  it('does not describe a retired advertising provider', () => {
    expect(about).toContain('یکتانت');
    expect(about).not.toMatch(/تپسل|Tapsell|MediaAd/i);
    expect(about).not.toContain('تبلیغات شخص ثالث');
  });

  it('keeps tool privacy statements accurate and advertising-free', () => {
    expect(toolLayout).toContain('برای انجام پردازش به سرورهای ما ارسال نمی‌شود');
    expect(toolLayout).not.toContain('تبلیغاتی شخص ثالث');
  });
  it('visually distinguishes privacy links within explanatory text', () => {
    expect(toolLayout).toContain('.tool-privacy a { text-decoration: underline;');
  });
  it('discloses local Cache Storage use and excludes tool inputs from the cache', () => {
    expect(privacy).toContain('Cache Storage');
    expect(privacy).toContain('پارامتر پرس‌وجو (query string)');
    expect(privacy).toContain('text, files, images, or keys you enter into tools are not stored');
  });
  it('discloses infrastructure request metadata processing in both languages', () => {
    expect(privacy).toContain('Cloudflare Pages');
    expect(privacy).toContain('نشانی IP');
    expect(privacy).toContain('Cloudflare\'s Privacy Policy');
    expect(privacy).toContain('داده‌های فنی درخواست');
  });

});
