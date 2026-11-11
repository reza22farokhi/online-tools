import { describe, it, expect } from 'vitest';
import { testRegex, MAX_PATTERN_LENGTH } from '../../src/tools/code/regex-tester/logic';

describe('testRegex', () => {
  it('finds all matches with g flag', () => {
    const r = testRegex('\\d+', 'g', 'a1 b22 c333');
    expect(r.ok).toBe(true);
    expect(r.matches.map(m => m.value)).toEqual(['1', '22', '333']);
  });

  it('finds first match only without g', () => {
    const r = testRegex('\\d+', '', 'a1 b22 c333');
    expect(r.ok).toBe(true);
    expect(r.matches.length).toBe(1);
    expect(r.matches[0].value).toBe('1');
  });

  it('case insensitive with i', () => {
    const r = testRegex('abc', 'gi', 'ABC abc Abc');
    expect(r.ok).toBe(true);
    expect(r.matches.length).toBe(3);
  });

  it('case sensitive without i', () => {
    const r = testRegex('abc', 'g', 'ABC abc Abc');
    expect(r.matches.length).toBe(1);
  });

  it('captures named groups', () => {
    const r = testRegex('(?<year>\\d{4})-(?<month>\\d{2})', 'g', '2025-01 and 2026-02');
    expect(r.ok).toBe(true);
    expect(r.matches.length).toBe(2);
    expect(r.matches[0].groups?.year).toBe('2025');
    expect(r.matches[0].groups?.month).toBe('01');
  });

  it('no match returns empty list', () => {
    const r = testRegex('xyz', 'g', 'abc');
    expect(r.ok).toBe(true);
    expect(r.matches.length).toBe(0);
  });

  it('invalid pattern returns error', () => {
    const r = testRegex('(unclosed', 'g', 'abc');
    expect(r.ok).toBe(false);
    expect(r.error).toContain('نامعتبر');
  });

  it('empty pattern returns error', () => {
    const r = testRegex('', 'g', 'abc');
    expect(r.ok).toBe(false);
  });

  it('pattern too long returns error', () => {
    const r = testRegex('a'.repeat(MAX_PATTERN_LENGTH + 1), 'g', 'abc');
    expect(r.ok).toBe(false);
    expect(r.error).toContain('طولانی');
  });

  it('empty match advances lastIndex', () => {
    const r = testRegex('a*', 'g', 'baaa');
    expect(r.ok).toBe(true);
    expect(r.matches.length).toBeGreaterThan(0);
  });

  it('anchors work', () => {
    const r = testRegex('^\\w+', 'gm', 'foo\nbar\nbaz');
    expect(r.ok).toBe(true);
    expect(r.matches.length).toBe(3);
  });

  it('index positions correct', () => {
    const r = testRegex('b', 'g', 'abcabc');
    expect(r.matches[0].index).toBe(1);
    expect(r.matches[1].index).toBe(4);
  });
});
