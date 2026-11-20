import { describe, expect, it } from 'vitest';
import { getLocaleSeoUrls } from '../../src/lib/locale-seo';

describe('path-based locale SEO URLs', () => {
  it('creates reciprocal Persian and English URLs for a tool page', () => {
    const urls = getLocaleSeoUrls('/tools/json-formatter/', 'https://abzar-tools.ir/');
    expect(urls.canonical).toBe('https://abzar-tools.ir/tools/json-formatter/');
    expect(urls.fa).toBe(urls.canonical);
    expect(urls.en).toBe('https://abzar-tools.ir/en/tools/json-formatter/');
    expect(urls.xDefault).toBe(urls.fa);
  });

  it('uses the English path as canonical for English documents', () => {
    const urls = getLocaleSeoUrls('/en/tools/json-formatter/?campaign=summer', 'https://abzar-tools.ir/', 'en');
    expect(urls.canonical).toBe('https://abzar-tools.ir/en/tools/json-formatter/?campaign=summer');
    expect(urls.fa).toBe('https://abzar-tools.ir/tools/json-formatter/?campaign=summer');
  });

  it('normalizes legacy lang query strings and preserves other parameters', () => {
    const urls = getLocaleSeoUrls('https://abzar-tools.ir/blog/example/?page=2&lang=en', 'https://abzar-tools.ir/');
    expect(urls.fa).toBe('https://abzar-tools.ir/blog/example/?page=2');
    expect(urls.en).toBe('https://abzar-tools.ir/en/blog/example/?page=2');
  });

  it('creates correct home locale paths', () => {
    const urls = getLocaleSeoUrls('/', 'https://abzar-tools.ir/', 'en');
    expect(urls.fa).toBe('https://abzar-tools.ir/');
    expect(urls.en).toBe('https://abzar-tools.ir/en/');
    expect(urls.canonical).toBe(urls.en);
  });
});
