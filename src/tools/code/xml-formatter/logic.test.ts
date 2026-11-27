import { describe, expect, it } from 'vitest';
import { MAX_XML_DEPTH, MAX_XML_NODES, processXml } from './logic';

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
  it('rejects excessive nesting before recursive serialization', () => {
    const depth = MAX_XML_DEPTH + 1;
    const xml = '<n>'.repeat(depth) + '</n>'.repeat(depth);
    const result = processXml(xml, 'format');
    expect(result.ok).toBe(false);
    expect(result.error).toContain('nesting');
  });
  it('rejects documents with too many nodes', () => {
    const xml = '<root>' + '<n/>'.repeat(MAX_XML_NODES) + '</root>';
    const result = processXml(xml, 'validate');
    expect(result.ok).toBe(false);
    expect(result.error).toContain('node limit');
  });
});
