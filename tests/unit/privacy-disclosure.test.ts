import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const privacy = readFileSync('src/pages/privacy.astro', 'utf8');
const about = readFileSync('src/pages/about.astro', 'utf8');
const toolLayout = readFileSync('src/layouts/ToolLayout.astro', 'utf8');

describe('privacy disclosures', () => {
  it('distinguishes local tool-input processing from third-party advertising requests', () => {
    expect(privacy).toContain('یکتانت');
    expect(privacy).toContain('اطلاعات فنی');
    expect(privacy).toContain('محتوای ورودی ابزارها');
  });

  it('does not claim that the site has no trackers or advertising scripts', () => {
    expect(about).toContain('یکتانت');
    expect(about).not.toContain('هیچ‌گونه ردیاب (Tracker)');
    expect(about).not.toContain('به صفر می‌رسد');
  });

  it('qualifies local processing claims on tool pages', () => {
    expect(toolLayout).toContain('تبلیغاتی شخص ثالث');
    expect(toolLayout).toContain('برای پردازش به سرورهای ما ارسال نمی‌شود');
  });
});
