import { describe, expect, it } from 'vitest';
import { jsonToYaml, parseYaml, stringifyYaml } from './logic';
describe('YAML and JSON conversion', () => {
  it('parses nested mappings, sequences and scalar values', () => {
    expect(parseYaml('name: Ada\\nage: 36\\nactive: true\\ntags:\\n  - math\\n  - logic')).toEqual({ name: 'Ada', age: 36, active: true, tags: ['math', 'logic'] });
  });
  it('parses arrays of objects', () => {
    expect(parseYaml('users:\\n  - name: Ada\\n    age: 36\\n  - name: Grace\\n    age: 40')).toEqual({ users: [{ name: 'Ada', age: 36 }, { name: 'Grace', age: 40 }] });
  });
  it('round trips JSON-compatible values', () => {
    const value = { nested: { enabled: true }, list: [1, 'two', null], 'special key': 'value' };
    expect(parseYaml(stringifyYaml(value))).toEqual(value);
  });
  it('rejects duplicate keys and tab indentation', () => {
    expect(() => parseYaml('a: 1\\na: 2')).toThrow(/تکراری/);
    expect(() => parseYaml('a:\\n\\tb: 1')).toThrow(/Tab/);
  });
  it('rejects malformed JSON and oversized content', () => {
    expect(() => jsonToYaml('{bad')).toThrow(/JSON/);
    expect(() => parseYaml('x'.repeat(100001))).toThrow(/۱۰۰/);
  });
  it('quotes strings that resemble YAML booleans or numbers', () => {
    expect(parseYaml('flag: "true"\\nnumber: "12"')).toEqual({ flag: 'true', number: '12' });
  });
});
