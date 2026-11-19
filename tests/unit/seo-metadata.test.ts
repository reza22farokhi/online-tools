import { describe, expect, it } from 'vitest';
import { registry } from '../../src/tools/registry';
import { DEFAULT_DESCRIPTION } from '../../src/lib/seo';

type SeoTitle = { fa: string; en: string };

describe('SEO metadata quality', () => {
  it('keeps the homepage Persian description within the recommended length', () => {
    expect(DEFAULT_DESCRIPTION.length).toBeGreaterThanOrEqual(120);
    expect(DEFAULT_DESCRIPTION.length).toBeLessThanOrEqual(155);
  });

  for (const tool of registry) {
    it(`${tool.slug} has a Persian meta description between 120 and 155 characters`, () => {
      expect(tool.description.fa.length).toBeGreaterThanOrEqual(120);
      expect(tool.description.fa.length).toBeLessThanOrEqual(155);
    });

    it(`${tool.slug} has an English meta description between 120 and 155 characters`, () => {
      expect(tool.description.en.length).toBeGreaterThanOrEqual(120);
      expect(tool.description.en.length).toBeLessThanOrEqual(155);
    });

    it(`${tool.slug} has Persian and English SEO titles between 30 and 60 characters`, () => {
      const seoTitle = (tool as typeof tool & { seoTitle?: SeoTitle }).seoTitle;
      const fa = seoTitle?.fa ?? `${tool.name.fa} | ابزارهای آنلاین`;
      const en = seoTitle?.en ?? `${tool.name.en} | Online Tools`;
      expect(fa.length).toBeGreaterThanOrEqual(30);
      expect(fa.length).toBeLessThanOrEqual(60);
      expect(en.length).toBeGreaterThanOrEqual(30);
      expect(en.length).toBeLessThanOrEqual(60);
    });
  }
});
