import { describe, expect, it } from 'vitest';
import { processXml } from '../../src/tools/code/xml-formatter/logic';

describe('XML formatter and validator', () => {
  it('accepts well-formed XML', () => {
    expect(processXml('<root><item>ok</item></root>', 'validate').ok).toBe(true);
  });
  it('rejects mismatched tags', () => {
    expect(processXml('<root><item></root>', 'validate').ok).toBe(false);
  });
  it('rejects empty input', () => {
    expect(processXml('  ', 'format').ok).toBe(false);
  });
  it('blocks DOCTYPE declarations', () => {
    expect(processXml('<!DOCTYPE root><root/>', 'validate').error).toContain('DOCTYPE');
  });
  it('minifies markup', () => {
    const result = processXml('<root>\n <item>value</item>\n</root>', 'minify');
    expect(result.ok).toBe(true);
    expect(result.output.replace(/\\s/g, '')).toContain('<item>value</item>');
  });
  it('preserves mixed content while formatting', () => {
    const result = processXml('<p>Hello <b>world</b>!</p>', 'format');
    expect(result.ok).toBe(true);
    expect(result.output).toContain('Hello <b>world</b>!');
  });
  it('enforces the input length limit', () => {
    expect(processXml('<r>' + 'x'.repeat(100_001) + '</r>', 'validate').ok).toBe(false);
  });
});
