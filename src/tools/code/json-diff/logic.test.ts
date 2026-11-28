import { describe, expect, it } from 'vitest';
import { compareJsonTexts } from './logic';
describe('compareJsonTexts', () => {
  it('returns no changes for equivalent objects regardless of key order', () => {
    expect(compareJsonTexts('{"b":2,"a":1}', '{"a":1,"b":2}').total).toBe(0);
  });
  it('detects added, removed and changed object properties', () => {
    const result = compareJsonTexts('{"keep":1,"remove":2,"edit":"old"}', '{"keep":1,"add":3,"edit":"new"}');
    expect(result.entries.map(x => x.kind)).toEqual(['added', 'changed', 'removed']);
    expect(result.total).toBe(3);
  });
  it('compares arrays by index and detects appended and removed items', () => {
    const result = compareJsonTexts('[1,2,3]', '[1,4]');
    expect(result.entries.map(x => [x.path, x.kind])).toEqual([['$/1', 'changed'], ['$/2', 'removed']]);
  });
  it('escapes JSON Pointer path segments', () => {
    const result = compareJsonTexts('{"a/b":1}', '{"a/b":2}');
    expect(result.entries[0].path).toBe('$/a~1b');
  });
  it('treats null and missing values as distinct', () => {
    const result = compareJsonTexts('{"x":null}', '{}');
    expect(result.entries[0]).toMatchObject({ path: '$/x', kind: 'removed', before: null });
  });
  it('rejects malformed and oversized inputs', () => {
    expect(() => compareJsonTexts('{bad', '{}')).toThrow(/JSON اول/);
    expect(() => compareJsonTexts('{}', ' '.repeat(100001))).toThrow(/۱۰۰/);
  });
  it('caps displayed entries without losing the total count', () => {
    const a = JSON.stringify(Object.fromEntries(Array.from({ length: 510 }, (_, i) => ['k' + i, i])));
    const result = compareJsonTexts('{}', a);
    expect(result.entries).toHaveLength(500);
    expect(result.total).toBe(510);
    expect(result.truncated).toBe(true);
  });
  it('rejects comparisons that exceed the bounded traversal work', () => {
    const left = JSON.stringify(Array.from({ length: 15000 }, (_, i) => i));
    const right = JSON.stringify(Array.from({ length: 15000 }, (_, i) => i + 1));
    expect(() => compareJsonTexts(left, right)).toThrow(/۲۰٬۰۰۰ گام/);
  });
});
