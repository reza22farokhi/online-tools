import { describe, expect, it } from 'vitest';
import { processXml } from './logic';

describe('processXml', () => {
  it('validates well-formed XML', () => {
    expect(processXml('<root><item>ok</item></root>', 'validate').ok).toBe(true);
  });
  it('rejects mismatched tags', () => {
    expect(processXml('<root><item></root>', 'validate').ok).toBe(false);
  });
  it('rejects empty input', () => {
    expect(processXml('   ', 'format').ok).toBe(false);
  });
  it('rejects documents with DOCTYPE', () => {
    expect(processXml('<!DOCTYPE root><root/>', 'validate').error).toContain('DOCTYPE');
  });
  it('minifies XML without changing text content', () => {
    const result = processXml('<root>  <item>value</item>  </root>', 'minify');
    expect(result.ok).toBe(true);
    expect(result.output).toContain('<item>value</item>');
  });
  it('preserves mixed content when formatting', () => {
    const result = processXml('<p>Hello <b>world</b>!</p>', 'format');
    expect(result.ok).toBe(true);
    expect(result.output).toContain('Hello <b>world</b>!');
  });
  it('rejects input over the documented limit', () => {
    expect(processXml('<r>' + 'x'.repeat(100_001) + '</r>', 'validate').ok).toBe(false);
  });
});
