import { describe, it, expect } from 'vitest';
import { generateSlug, DEFAULT_OPTIONS } from '../../src/tools/text/slug-generator/logic';

describe('generateSlug', () => {
  it('empty returns empty', () => {
    expect(generateSlug('', DEFAULT_OPTIONS)).toBe('');
    expect(generateSlug('   ', DEFAULT_OPTIONS)).toBe('');
  });
  it('basic English slug', () => {
    expect(generateSlug('Hello World', DEFAULT_OPTIONS)).toBe('hello-world');
  });
  it('multiple spaces collapse', () => {
    expect(generateSlug('hello    world', DEFAULT_OPTIONS)).toBe('hello-world');
  });
  it('trims leading/trailing spaces', () => {
    expect(generateSlug('  hello world  ', DEFAULT_OPTIONS)).toBe('hello-world');
  });
  it('removes punctuation', () => {
    expect(generateSlug('Hello, World!', DEFAULT_OPTIONS)).toBe('hello-world');
  });
  it('preserves Persian letters', () => {
    const r = generateSlug('سلام دنیا', DEFAULT_OPTIONS);
    expect(r).toBe('سلام-دنیا');
  });
  it('normalizes Arabic yeh to Persian yeh', () => {
    const r = generateSlug('ي', DEFAULT_OPTIONS);
    expect(r).toBe('ی');
  });
  it('removes ZWNJ', () => {
    expect(generateSlug('می\u200Cرود', DEFAULT_OPTIONS)).toBe('میرود');
  });
  it('strips Latin diacritics', () => {
    expect(generateSlug('Café Crème', DEFAULT_OPTIONS)).toBe('cafe-creme');
  });
  it('respects separator option', () => {
    expect(generateSlug('hello world', { ...DEFAULT_OPTIONS, separator: '_' })).toBe('hello_world');
  });
  it('lowercase off preserves case', () => {
    expect(generateSlug('Hello World', { ...DEFAULT_OPTIONS, lowercase: false })).toBe('Hello-World');
  });
  it('truncates to maxLength', () => {
    const long = 'a'.repeat(200);
    expect(generateSlug(long, { ...DEFAULT_OPTIONS, maxLength: 20 }).length).toBe(20);
  });
  it('does not end with separator after truncate', () => {
    const r = generateSlug('hello world foo bar', { ...DEFAULT_OPTIONS, maxLength: 12 });
    expect(r.endsWith('-')).toBe(false);
  });
  it('numbers preserved', () => {
    expect(generateSlug('test 123', DEFAULT_OPTIONS)).toBe('test-123');
  });
  it('only punctuation returns empty', () => {
    expect(generateSlug('!@#$%', DEFAULT_OPTIONS)).toBe('');
  });
});
