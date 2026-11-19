import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const privacy = readFileSync('src/pages/privacy.astro', 'utf8');
const about = readFileSync('src/pages/about.astro', 'utf8');
const toolLayout = readFileSync('src/layouts/ToolLayout.astro', 'utf8');

describe('privacy disclosures', () => {
  it('explains local tool-input processing without advertising disclosures', () => {
    expect(privacy).toContain('محتوای واردشده در ابزارها');
    expect(privacy).toContain('هیچ اسکریپت یا شبکه تبلیغاتی شخص ثالثی');
    expect(privacy).not.toContain('یکتانت');
  });

  it('does not describe a retired advertising provider', () => {
    expect(about).not.toContain('یکتانت');
    expect(about).not.toContain('تبلیغات شخص ثالث');
  });

  it('keeps tool privacy statements accurate and advertising-free', () => {
    expect(toolLayout).toContain('برای انجام پردازش به سرورهای ما ارسال نمی‌شود');
    expect(toolLayout).not.toContain('تبلیغاتی شخص ثالث');
  });
});
