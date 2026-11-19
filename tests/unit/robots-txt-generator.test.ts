import { describe, it, expect } from 'vitest';
import { generateRobotsTxt } from '../../src/tools/seo/robots-txt-generator/logic';

describe('generateRobotsTxt', () => {
  it('basic with sitemap', () => {
    const txt = generateRobotsTxt({ userAgent: '*', disallow: '', allow: '', sitemap: 'https://ex.com/sitemap.xml' });
    expect(txt).toContain('User-agent: *');
    expect(txt).toContain('Disallow:');
    expect(txt).toContain('Sitemap: https://ex.com/sitemap.xml');
  });
  it('multiple disallow paths', () => {
    const txt = generateRobotsTxt({ userAgent: '*', disallow: '/admin\n/private', allow: '', sitemap: '' });
    expect(txt).toContain('Disallow: /admin');
    expect(txt).toContain('Disallow: /private');
  });
  it('adds leading slash if missing', () => {
    const txt = generateRobotsTxt({ userAgent: '*', disallow: 'admin', allow: '', sitemap: '' });
    expect(txt).toContain('Disallow: /admin');
  });
  it('normalizes a sitemap URL without a scheme to HTTPS', () => {
    const txt = generateRobotsTxt({ userAgent: '*', disallow: '', allow: '', sitemap: 'example.com/sitemap.xml' });
    expect(txt).toContain('Sitemap: https://example.com/sitemap.xml');
  });
  it('rejects non-HTTP sitemap schemes', () => {
    expect(() => generateRobotsTxt({ userAgent: '*', disallow: '', allow: '', sitemap: 'javascript:alert(1)' })).toThrow(/HTTP or HTTPS/);
    expect(() => generateRobotsTxt({ userAgent: '*', disallow: '', allow: '', sitemap: 'ftp://example.com/sitemap.xml' })).toThrow(/HTTP or HTTPS/);
  });
  it('rejects directive injection through sitemap and user-agent fields', () => {
    expect(() => generateRobotsTxt({ userAgent: '*', disallow: '', allow: '', sitemap: 'https://example.com/sitemap.xml\nDisallow: /' })).toThrow(/control characters/);
    expect(() => generateRobotsTxt({ userAgent: '*\nDisallow: /', disallow: '', allow: '', sitemap: '' })).toThrow(/control characters/);
  });
  it('rejects whitespace in path directives', () => {
    expect(() => generateRobotsTxt({ userAgent: '*', disallow: '/private area', allow: '', sitemap: '' })).toThrow(/spaces/);
  });
  it('allow paths', () => {
    const txt = generateRobotsTxt({ userAgent: '*', disallow: '/', allow: '/public', sitemap: '' });
    expect(txt).toContain('Allow: /public');
  });
});
