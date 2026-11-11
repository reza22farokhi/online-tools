import { describe, it, expect } from 'vitest';
import { sortLines, DEFAULT_OPTIONS } from '../../src/tools/text/line-sorter/logic';

describe('sortLines', () => {
  it('returns empty for empty input', () => {
    expect(sortLines('', DEFAULT_OPTIONS)).toBe('');
  });

  it('sorts alphabetically ascending', () => {
    const r = sortLines('banana\napple\ncherry', DEFAULT_OPTIONS);
    expect(r).toBe('apple\nbanana\ncherry');
  });

  it('sorts alphabetically descending', () => {
    const r = sortLines('banana\napple\ncherry', { ...DEFAULT_OPTIONS, mode: 'desc' });
    expect(r).toBe('cherry\nbanana\napple');
  });

  it('sorts by length ascending', () => {
    const r = sortLines('ccc\na\nbb', { ...DEFAULT_OPTIONS, mode: 'length-asc' });
    expect(r).toBe('a\nbb\nccc');
  });

  it('sorts by length descending', () => {
    const r = sortLines('ccc\na\nbb', { ...DEFAULT_OPTIONS, mode: 'length-desc' });
    expect(r).toBe('ccc\nbb\na');
  });

  it('reverses original order', () => {
    const r = sortLines('a\nb\nc', { ...DEFAULT_OPTIONS, mode: 'reverse' });
    expect(r).toBe('c\nb\na');
  });

  it('sorts numerically when option on', () => {
    const r = sortLines('10\n2\n30\n1', { ...DEFAULT_OPTIONS, numeric: true });
    expect(r).toBe('1\n2\n10\n30');
  });

  it('case-insensitive sort', () => {
    const r = sortLines('banana\nApple\ncherry', { ...DEFAULT_OPTIONS, caseInsensitive: true });
    expect(r.split('\n')[0].toLowerCase()).toBe('apple');
  });

  it('removes empty lines by default', () => {
    const r = sortLines('a\n\nb', DEFAULT_OPTIONS);
    expect(r).toBe('a\nb');
  });

  it('keeps empty lines when option off', () => {
    const r = sortLines('a\n\nb', { ...DEFAULT_OPTIONS, removeEmpty: false, trim: false });
    expect(r.split('\n').length).toBe(3);
  });

  it('removes duplicates when unique on', () => {
    const r = sortLines('a\nb\na\nb\nc', { ...DEFAULT_OPTIONS, unique: true });
    expect(r).toBe('a\nb\nc');
  });

  it('trims lines when trim on', () => {
    const r = sortLines('  b  \n  a  ', DEFAULT_OPTIONS);
    expect(r).toBe('a\nb');
  });

  it('handles CRLF', () => {
    const r = sortLines('b\r\na\r\nc', DEFAULT_OPTIONS);
    expect(r).toBe('a\nb\nc');
  });

  it('numeric sort with mixed non-numbers', () => {
    const r = sortLines('apple\n10\nbanana\n2', { ...DEFAULT_OPTIONS, numeric: true });
    const first = r.split('\n')[0];
    const second = r.split('\n')[1];
    expect(first).toBe('2');
    expect(second).toBe('10');
  });

  it('single line stays alone', () => {
    expect(sortLines('only one', DEFAULT_OPTIONS)).toBe('only one');
  });
});
