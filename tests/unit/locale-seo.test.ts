import { describe, expect, it } from 'vitest';
import { getLocaleSeoUrls } from '../../src/lib/locale-seo';

describe('locale SEO URLs', () => {
  it('creates self-referencing canonical URLs for Persian and English', () => {
    const urls = getLocaleSeoUrls('/tools/json-formatter/', 'https://abzar-tools.ir/');
    expect(urls.canonical).toBe('https://abzar-tools.ir/tools/json-formatter/');
    expect(urls.fa).toBe('https://abzar-tools.ir/tools/json-formatter/');
    expect(urls.en).toBe('https://abzar-tools.ir/tools/json-formatter/?lang=en');
    expect(urls.xDefault).toBe(urls.canonical);
  });

  it('uses the English URL as canonical for English documents', () => {
    const urls = getLocaleSeoUrls('/tools/json-formatter/?campaign=summer', 'https://abzar-tools.ir/', 'en');
    expect(urls.canonical).toBe('https://abzar-tools.ir/tools/json-formatter/?campaign=summer&lang=en');
    expect(urls.fa).toBe('https://abzar-tools.ir/tools/json-formatter/?campaign=summer');
    expect(urls.xDefault).toBe('https://abzar-tools.ir/tools/json-formatter/?campaign=summer');
  });

  it('preserves an explicitly supplied canonical path and its query parameters', () => {
    const urls = getLocaleSeoUrls('https://abzar-tools.ir/blog/example/?page=2', 'https://abzar-tools.ir/');
    expect(urls.canonical).toBe('https://abzar-tools.ir/blog/example/?page=2');
    expect(urls.fa).toBe('https://abzar-tools.ir/blog/example/?page=2');
    expect(urls.en).toBe('https://abzar-tools.ir/blog/example/?page=2&lang=en');
  });
});
