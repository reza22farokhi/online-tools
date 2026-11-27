import { describe, expect, it } from 'vitest';
import { generateTypeScript, MAX_JSON_DEPTH, MAX_JSON_NODES } from './logic';
describe('generateTypeScript', () => {
  it('creates nested interfaces and array types', () => {
    const result = generateTypeScript('{"user":{"id":1},"tags":["a","b"]}');
    expect(result).toContain('export interface Root');
    expect(result).toContain('export interface RootUser');
    expect(result).toContain('tags: string[];');
  });
  it('quotes unsafe property names', () => {
    expect(generateTypeScript('{"display-name":true}')).toContain('"display-name": boolean;');
  });
  it('supports null and empty arrays', () => {
    const result = generateTypeScript('{"value":null,"items":[]}');
    expect(result).toContain('value: null;');
    expect(result).toContain('items: unknown[];');
  });
  it('supports type aliases and optional properties', () => {
    const result = generateTypeScript('{"name":"x"}', { useTypeAliases: true, optionalProperties: true });
    expect(result).toContain('export type Root = {');
    expect(result).toContain('name?: string;');
  });
  it('rejects invalid and oversized JSON', () => {
    expect(() => generateTypeScript('{bad')).toThrow();
    expect(() => generateTypeScript(' '.repeat(100001))).toThrow(/100,000/);
  });
  it('rejects deeply nested JSON before recursive generation', () => {
    const source = '{"a":'.repeat(MAX_JSON_DEPTH + 2) + '0' + '}'.repeat(MAX_JSON_DEPTH + 2);
    expect(() => generateTypeScript(source)).toThrow(/128-level/);
  });
  it('rejects JSON with too many nodes', () => {
    const source = '[' + Array(MAX_JSON_NODES).fill('0').join(',') + ']';
    expect(() => generateTypeScript(source)).toThrow(/20,000-node/);
  });
});
