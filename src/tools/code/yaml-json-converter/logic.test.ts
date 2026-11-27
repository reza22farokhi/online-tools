import { describe, expect, it } from 'vitest';
import { jsonToYaml, parseYaml, stringifyYaml } from './logic';
describe('YAML and JSON conversion', () => {
  it('parses nested mappings, sequences and scalar values', () => {
    expect(parseYaml('name: Ada\nage: 36\nactive: true\ntags:\n  - math\n  - logic')).toEqual({ name: 'Ada', age: 36, active: true, tags: ['math', 'logic'] });
  });
  it('parses arrays of objects', () => {
    expect(parseYaml('users:\n  - name: Ada\n    age: 36\n  - name: Grace\n    age: 40')).toEqual({ users: [{ name: 'Ada', age: 36 }, { name: 'Grace', age: 40 }] });
  });
  it('round trips JSON-compatible values', () => {
    const value = { nested: { enabled: true }, list: [1, 'two', null], 'special key': 'value' };
    expect(parseYaml(stringifyYaml(value))).toEqual(value);
  });
  it('rejects duplicate keys and tab indentation', () => {
    expect(() => parseYaml('a: 1\na: 2')).toThrow(/تکراری/);
    expect(() => parseYaml('a:\n\tb: 1')).toThrow(/Tab/);
  });
  it('rejects malformed JSON and oversized content', () => {
    expect(() => jsonToYaml('{bad')).toThrow(/JSON/);
    expect(() => parseYaml('x'.repeat(100001))).toThrow(/۱۰۰/);
  });
  it('quotes strings that resemble YAML booleans or numbers', () => {
    expect(parseYaml('flag: "true"\nnumber: "12"')).toEqual({ flag: 'true', number: '12' });
  });
  it('preserves prototype-like mapping keys as own properties', () => {
    const parsed = parseYaml('__proto__: safe\nconstructor: value\ntoString: text') as Record<string, unknown>;
    expect(Object.prototype.hasOwnProperty.call(parsed, '__proto__')).toBe(true);
    expect(Object.prototype.hasOwnProperty.call(parsed, 'constructor')).toBe(true);
    expect(Object.prototype.hasOwnProperty.call(parsed, 'toString')).toBe(true);
    expect(parsed['__proto__']).toBe('safe');
    expect(parsed.constructor).toBe('value');
    expect(parsed.toString).toBe('text');
    expect(Object.getPrototypeOf(parsed)).toBe(Object.prototype);
  });
  it('safely merges prototype-like keys in sequence mapping continuations', () => {
    const parsed = parseYaml('items:\n  - name: first\n    __proto__: safe') as { items: Record<string, unknown>[] };
    expect(Object.prototype.hasOwnProperty.call(parsed.items[0], '__proto__')).toBe(true);
    expect(parsed.items[0]['__proto__']).toBe('safe');
    expect(Object.getPrototypeOf(parsed.items[0])).toBe(Object.prototype);
  });
});
