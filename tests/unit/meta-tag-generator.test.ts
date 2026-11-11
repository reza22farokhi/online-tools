import { describe, it, expect } from 'vitest';
import { generateMetaTags, escapeHtmlAttr } from '../../src/tools/seo/meta-tag-generator/logic';

describe('escapeHtmlAttr', () => {
  it('escapes quotes and ampersands', () => {
    expect(escapeHtmlAttr('A & B "C" <D>')).toBe('A &amp; B &quot;C&quot; &lt;D&gt;');
  });
});

describe('generateMetaTags', () => {
  it('generates correct tags for full data', () => {
    const html = generateMetaTags({
      title: 'Test Title',
      description: 'Test Desc',
      url: 'https://test.com',
      image: 'https://test.com/img.jpg',
      author: 'Me'
    });
    expect(html).toContain('<title>Test Title</title>');
    expect(html).toContain('<meta name="description" content="Test Desc">');
    expect(html).toContain('<meta property="og:title" content="Test Title">');
    expect(html).toContain('<meta property="twitter:image" content="https://test.com/img.jpg">');
  });

  it('escapes malicious input', () => {
    const html = generateMetaTags({
      title: '"><script>alert(1)</script>',
      description: '', url: '', image: '', author: ''
    });
    expect(html).not.toContain('<script>');
    expect(html).toContain('&quot;&gt;&lt;script&gt;');
  });

  it('omits empty tags', () => {
    const html = generateMetaTags({ title: '', description: '', url: '', image: '', author: '' });
    expect(html).not.toContain('<title>');
    expect(html).toContain('<meta property="og:type"');
  });
});
