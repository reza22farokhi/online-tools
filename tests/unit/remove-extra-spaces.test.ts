import { describe, it, expect } from 'vitest';
import { cleanSpaces, DEFAULT_OPTIONS } from '../../src/tools/text/remove-extra-spaces/logic';

describe('cleanSpaces', () => {
  it('returns empty for empty input', () => {
    expect(cleanSpaces('', DEFAULT_OPTIONS)).toBe('');
  });

  it('collapses multiple spaces to one', () => {
    const r = cleanSpaces('hello    world', DEFAULT_OPTIONS);
    expect(r).toBe('hello world');
  });

  it('trims each line', () => {
    const r = cleanSpaces('  a  \n  b  ', DEFAULT_OPTIONS);
    expect(r).toBe('a\nb');
  });

  it('trims whole text', () => {
    const r = cleanSpaces('   hello   ', DEFAULT_OPTIONS);
    expect(r).toBe('hello');
  });

  it('keeps empty lines by default', () => {
    const r = cleanSpaces('a\n\nb', DEFAULT_OPTIONS);
    expect(r).toBe('a\n\nb');
  });

  it('removes empty lines when option on', () => {
    const r = cleanSpaces('a\n\n\nb', { ...DEFAULT_OPTIONS, removeEmptyLines: true });
    expect(r).toBe('a\nb');
  });

  it('respects collapseSpaces off', () => {
    const r = cleanSpaces('hello    world', { ...DEFAULT_OPTIONS, collapseSpaces: false });
    expect(r).toBe('hello    world');
  });

  it('respects trimLines off', () => {
    const r = cleanSpaces('  a  ', { ...DEFAULT_OPTIONS, trimLines: false, trimText: false });
    expect(r).toBe(' a ');
  });

  it('handles tabs and non-breaking spaces', () => {
    const r = cleanSpaces('a\t\tb\u00A0\u00A0c', DEFAULT_OPTIONS);
    expect(r).toBe('a b c');
  });

  it('handles CRLF line endings', () => {
    const r = cleanSpaces('a\r\nb\r\nc', DEFAULT_OPTIONS);
    expect(r).toBe('a\nb\nc');
  });

  it('preserves single-line content intact', () => {
    const r = cleanSpaces('single line', DEFAULT_OPTIONS);
    expect(r).toBe('single line');
  });

  it('handles whitespace-only input', () => {
    const r = cleanSpaces('   \n\t  ', DEFAULT_OPTIONS);
    expect(r).toBe('');
  });
});
