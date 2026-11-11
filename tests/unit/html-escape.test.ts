import { describe, it, expect } from 'vitest';
import { escapeHtml, unescapeHtml, processHtml } from '../../src/tools/code/html-escape/logic';
describe('escapeHtml', () => {
  it('escapes all special chars', () => {
    expect(escapeHtml('<a href="x">A & B</a>')).toBe('&lt;a href=&quot;x&quot;&gt;A &amp; B&lt;/a&gt;');
  });
  it('preserves plain text', () => {
    expect(escapeHtml('hello world')).toBe('hello world');
  });
});
describe('unescapeHtml', () => {
  it('unescapes named entities', () => {
    expect(unescapeHtml('&lt;a&gt;')).toBe('<a>');
  });
  it('unescapes decimal numeric', () => {
    expect(unescapeHtml('&#65;')).toBe('A');
  });
  it('unescapes hex numeric', () => {
    expect(unescapeHtml('&#x41;')).toBe('A');
  });
  it('leaves unknown untouched', () => {
    expect(unescapeHtml('&unknown;')).toBe('&unknown;');
  });
});
describe('processHtml', () => {
  it('empty returns empty', () => {
    expect(processHtml('', 'escape')).toBe('');
    expect(processHtml('', 'unescape')).toBe('');
  });
  it('round-trip escape/unescape', () => {
    const orig = '<a>"x"&y\'</a>';
    expect(processHtml(processHtml(orig, 'escape'), 'unescape')).toBe(orig);
  });
});
