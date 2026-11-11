import { describe, it, expect } from 'vitest';
import { removeDuplicates, DEFAULT_OPTIONS } from '../../src/tools/text/remove-duplicates/logic';

describe('removeDuplicates', () => {
  it('returns empty for empty input', () => {
    const r = removeDuplicates('', DEFAULT_OPTIONS);
    expect(r.output).toBe('');
    expect(r.removed).toBe(0);
    expect(r.kept).toBe(0);
  });
  it('returns single line untouched', () => {
    const r = removeDuplicates('only one', DEFAULT_OPTIONS);
    expect(r.output).toBe('only one');
    expect(r.removed).toBe(0);
    expect(r.kept).toBe(1);
  });
  it('keeps lines with no duplicates', () => {
    expect(removeDuplicates('a\nb\nc', DEFAULT_OPTIONS).output).toBe('a\nb\nc');
  });
  it('removes duplicate lines', () => {
    const r = removeDuplicates('a\nb\na\nb\nc', DEFAULT_OPTIONS);
    expect(r.output).toBe('a\nb\nc');
    expect(r.removed).toBe(2);
    expect(r.kept).toBe(3);
  });
  it('preserves first occurrence order', () => {
    expect(removeDuplicates('b\na\nb\nc\na', DEFAULT_OPTIONS).output).toBe('b\na\nc');
  });
  it('case-sensitive by default keeps A and a', () => {
    const r = removeDuplicates('A\na\nA', DEFAULT_OPTIONS);
    expect(r.output).toBe('A\na');
    expect(r.removed).toBe(1);
  });
  it('case-insensitive removes A and a', () => {
    const r = removeDuplicates('A\na\nA\nb', { ...DEFAULT_OPTIONS, caseInsensitive: true });
    expect(r.output).toBe('A\nb');
    expect(r.removed).toBe(2);
  });
  it('trims lines before comparing', () => {
    const r = removeDuplicates('  a\na  \n a ', DEFAULT_OPTIONS);
    expect(r.output).toBe('a');
    expect(r.removed).toBe(2);
  });
  it('keeps whitespace when trim off', () => {
    const r = removeDuplicates('a\n a', { ...DEFAULT_OPTIONS, trim: false });
    expect(r.output).toBe('a\n a');
    expect(r.removed).toBe(0);
  });
  it('removes empty lines by default', () => {
    expect(removeDuplicates('a\n\nb\n\n\nc', DEFAULT_OPTIONS).output).toBe('a\nb\nc');
  });
  it('keeps empty lines when option off', () => {
    const r = removeDuplicates('a\n\nb\n\nc', { ...DEFAULT_OPTIONS, removeEmpty: false });
    expect(r.output.split('\n').length).toBe(5);
  });
  it('handles CRLF', () => {
    expect(removeDuplicates('a\r\nb\r\na\r\nc', DEFAULT_OPTIONS).output).toBe('a\nb\nc');
  });
  it('counts kept and removed accurately', () => {
    const r = removeDuplicates('x\nx\nx\ny\ny\nz', DEFAULT_OPTIONS);
    expect(r.kept).toBe(3);
    expect(r.removed).toBe(3);
    expect(r.output).toBe('x\ny\nz');
  });
});
