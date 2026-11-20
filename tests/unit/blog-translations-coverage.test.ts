import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { blogTranslationsEn } from '../../src/data/blog-translations-en';

const blogDirectory = join(process.cwd(), 'src/pages/blog');
const articleFiles = readdirSync(blogDirectory).filter(file => file.endsWith('.astro') && file !== 'index.astro');

function getSlug(file: string): string {
  const source = readFileSync(join(blogDirectory, file), 'utf8');
  const match = source.match(/\\bslug\\s*=\\s*["']([^"']+)["']/) ??
    source.match(/\\bconst\\s+slug\\s*=\\s*["']([^"']+)["']/);
  if (!match) throw new Error(`Could not resolve blog slug from ${file}`);
  return match[1];
}

describe('English blog translation coverage', () => {
  const slugs = articleFiles.map(getSlug);

  it('has an English translation for every published blog article', () => {
    expect(Object.keys(blogTranslationsEn).sort()).toEqual([...slugs].sort());
  });

  for (const slug of slugs) {
    it(`${slug} has a substantial English body, description, and FAQs`, () => {
      const translation = blogTranslationsEn[slug];
      expect(translation, `missing English translation for ${slug}`).toBeDefined();
      expect(translation.description.trim().length).toBeGreaterThan(50);
      expect(translation.description).not.toMatch(/[\\u0600-\\u06FF]/);
      expect(translation.body.trim().length).toBeGreaterThan(500);
      expect(translation.body).not.toMatch(/[\\u0600-\\u06FF]/);
      expect(translation.faqs.length).toBeGreaterThanOrEqual(2);
      for (const faq of translation.faqs) {
        expect(faq.q.trim().length).toBeGreaterThan(10);
        expect(faq.a.trim().length).toBeGreaterThan(20);
        expect(faq.q + faq.a).not.toMatch(/[\\u0600-\\u06FF]/);
      }
    });
  }
});
