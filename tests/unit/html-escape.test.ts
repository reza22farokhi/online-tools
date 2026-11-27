import { describe, it, expect } from 'vitest';
import { escapeHtml, unescapeHtml, processHtml, MAX_HTML_INPUT_LENGTH } from '../../src/tools/code/html-escape/logic';
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
  it('leaves unknown and inherited object names untouched', () => {
    expect(unescapeHtml('&unknown;&constructor;&toString;')).toBe('&unknown;&constructor;&toString;');
  });
});
describe('processHtml', () => {
  it('empty returns empty', () => {
    expect(processHtml('', 'escape')).toBe('');
    expect(processHtml('', 'unescape')).toBe('');
  });
  it('rejects oversized input in every processing mode', () => {
    const input = 'a'.repeat(MAX_HTML_INPUT_LENGTH + 1);
    expect(() => processHtml(input, 'escape')).toThrow(RangeError);
    expect(() => processHtml(input, 'unescape')).toThrow(RangeError);
    expect(() => escapeHtml(input)).toThrow(RangeError);
    expect(() => unescapeHtml(input)).toThrow(RangeError);
  });
  it('accepts input at the resource limit', () => {
    expect(processHtml('a'.repeat(MAX_HTML_INPUT_LENGTH), 'escape')).toHaveLength(MAX_HTML_INPUT_LENGTH);
  });
  it('round-trip escape/unescape', () => {
    const orig = '<a>"x"&y</a>';
    expect(processHtml(processHtml(orig, 'escape'), 'unescape')).toBe(orig);
  });
});
