import { describe, it, expect } from 'vitest';
import { processUrl, MAX_URL_INPUT_LENGTH } from '../../src/tools/code/url-encoder/logic';
describe('processUrl', () => {
  it('encodes component with space', () => {
    expect(processUrl('hello world', 'encode', 'component').output).toBe('hello%20world');
  });
  it('encodes component with &', () => {
    expect(processUrl('a&b', 'encode', 'component').output).toBe('a%26b');
  });
  it('decodes component', () => {
    expect(processUrl('hello%20world', 'decode', 'component').output).toBe('hello world');
  });
  it('encode full preserves ://', () => {
    const r = processUrl('https://example.com/a b', 'encode', 'full');
    expect(r.output).toContain('://');
    expect(r.output).toContain('%20');
  });
  it('decodes full URL', () => {
    expect(processUrl('https://example.com/a%20b', 'decode', 'full').output).toBe('https://example.com/a b');
  });
  it('empty returns error', () => {
    expect(processUrl('', 'encode', 'component').ok).toBe(false);
  });
  it('invalid percent returns error', () => {
    expect(processUrl('%E0%A4%A', 'decode', 'component').ok).toBe(false);
  });
  it('rejects inputs above the resource limit', () => {
    const result = processUrl('a'.repeat(MAX_URL_INPUT_LENGTH + 1), 'encode', 'component');
    expect(result.ok).toBe(false);
    expect(result.output).toBe('');
    expect(result.error).toMatch(/۱۰۰/);
  });
  it('accepts inputs at the resource limit', () => {
    expect(processUrl('a'.repeat(MAX_URL_INPUT_LENGTH), 'encode', 'component').ok).toBe(true);
  });
  it('unicode round-trip', () => {
    const orig = 'سلام دنیا!';
    const enc = processUrl(orig, 'encode', 'component').output;
    const dec = processUrl(enc, 'decode', 'component').output;
    expect(dec).toBe(orig);
  });
});
