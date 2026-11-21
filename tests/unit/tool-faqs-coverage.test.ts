import { describe, it, expect } from 'vitest';
import { TOOL_FAQS } from '../../src/data/tool-faqs';
import { getAllSlugs } from '../../src/tools/registry';

describe('tool-faqs coverage', () => {
  const slugs = getAllSlugs();

  for (const slug of slugs) {
    it(slug + ' has at least 2 well-formed FAQs per available language', () => {
      const faqs = TOOL_FAQS[slug];
      expect(faqs, 'no FAQ entry for ' + slug).toBeDefined();
      expect(faqs.length).toBeGreaterThanOrEqual(2);

      const persianFaqs = faqs.filter((faq) => faq.q !== undefined || faq.a !== undefined);
      const englishFaqs = faqs.filter((faq) => faq.qEn !== undefined || faq.aEn !== undefined);
      expect(persianFaqs.length, 'fewer than 2 Persian FAQs in ' + slug).toBeGreaterThanOrEqual(2);
      if (englishFaqs.length > 0) {
        expect(englishFaqs.length, 'fewer than 2 English FAQs in ' + slug).toBeGreaterThanOrEqual(2);
      }

      for (const faq of faqs) {
        const hasPersianQuestion = typeof faq.q === 'string';
        const hasPersianAnswer = typeof faq.a === 'string';
        const hasEnglishQuestion = typeof faq.qEn === 'string';
        const hasEnglishAnswer = typeof faq.aEn === 'string';
        expect(hasPersianQuestion).toBe(hasPersianAnswer);
        expect(hasEnglishQuestion).toBe(hasEnglishAnswer);
        expect(hasPersianQuestion || hasEnglishQuestion, 'FAQ has no complete language pair in ' + slug).toBe(true);
        if (hasPersianQuestion && hasPersianAnswer) {
          expect(faq.q!.trim().length, 'empty Persian question in ' + slug).toBeGreaterThan(5);
          expect(faq.a!.trim().length, 'empty Persian answer in ' + slug).toBeGreaterThan(10);
        }
        if (hasEnglishQuestion && hasEnglishAnswer) {
          expect(faq.qEn!.trim().length, 'empty English question in ' + slug).toBeGreaterThan(5);
          expect(faq.aEn!.trim().length, 'empty English answer in ' + slug).toBeGreaterThan(10);
        }
      }
    });
  }
});
