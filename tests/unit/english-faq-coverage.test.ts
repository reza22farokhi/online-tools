import { describe, expect, it } from 'vitest';
import { registry } from '../../src/tools/registry';
import { getFaqsFor } from '../../src/data/tool-faqs';

describe('English tool FAQ coverage', () => {
  it('provides dedicated English questions and answers for every registered tool', () => {
    const missing: string[] = [];

    for (const tool of registry) {
      const faqs = getFaqsFor(tool.slug);
      const hasDedicatedEnglishFaqs =
        faqs.length >= 2 &&
        faqs.every((faq) =>
          typeof faq.qEn === 'string' &&
          faq.qEn.trim().length > 0 &&
          typeof faq.aEn === 'string' &&
          faq.aEn.trim().length > 0
        );

      if (!hasDedicatedEnglishFaqs) missing.push(tool.slug);
    }

    expect(
      missing,
      `Tools missing dedicated English FAQ content: ${missing.join(', ')}`
    ).toEqual([]);
  });
});
