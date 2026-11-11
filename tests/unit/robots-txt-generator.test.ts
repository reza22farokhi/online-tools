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
  it('allow paths', () => {
    const txt = generateRobotsTxt({ userAgent: '*', disallow: '/', allow: '/public', sitemap: '' });
    expect(txt).toContain('Allow: /public');
  });
});
