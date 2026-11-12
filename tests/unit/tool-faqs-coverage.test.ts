import { describe, it, expect } from 'vitest';
import { TOOL_FAQS } from '../../src/data/tool-faqs';
import { getAllSlugs } from '../../src/tools/registry';

describe('tool-faqs coverage', () => {
  const slugs = getAllSlugs();
  for (const slug of slugs) {
    it(`${slug} has at least 2 well-formed FAQs`, () => {
      const faqs = TOOL_FAQS[slug];
      expect(faqs, `no FAQ entry for ${slug}`).toBeDefined();
      expect(faqs.length).toBeGreaterThanOrEqual(2);
      for (const f of faqs) {
        expect(f.q.length, `empty question in ${slug}`).toBeGreaterThan(5);
        expect(f.a.length, `empty answer in ${slug}`).toBeGreaterThan(10);
      }
    });
  }
});
