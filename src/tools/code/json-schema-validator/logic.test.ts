import { describe, expect, it } from 'vitest';
import { validateJsonSchema } from './logic';
describe('validateJsonSchema', () => {
  it('accepts valid nested objects and arrays', () => {
    const result = validateJsonSchema('{"name":"Ada","age":36,"tags":["a","b"]}', JSON.stringify({ type:'object', required:['name'], properties:{ name:{type:'string'}, age:{type:'integer',minimum:0}, tags:{type:'array',items:{type:'string'}} } }));
    expect(result.valid).toBe(true);
    expect(result.issues).toHaveLength(0);
  });
  it('reports missing required properties and wrong types', () => {
    const result = validateJsonSchema('{"age":"old"}', '{"type":"object","required":["name"],"properties":{"age":{"type":"integer"}}}');
    expect(result.valid).toBe(false);
    expect(result.issues.length).toBeGreaterThanOrEqual(2);
  });
  it('supports enum, pattern, bounds and uniqueItems', () => {
    const result = validateJsonSchema('{"role":"guest","code":"x","ids":[1,1]}', '{"type":"object","properties":{"role":{"enum":["admin","user"]},"code":{"pattern":"^[A-Z]+$"},"ids":{"type":"array","uniqueItems":true}}}');
    expect(result.issues.length).toBe(3);
  });
  it('rejects malformed and oversized input', () => {
    expect(() => validateJsonSchema('{bad','{}')).toThrow(/ورودی/);
    expect(() => validateJsonSchema('null',' '.repeat(100001))).toThrow(/۱۰۰/);
  });
  it('supports additionalProperties false', () => {
    const result = validateJsonSchema('{"ok":true,"extra":1}', '{"type":"object","properties":{"ok":{"type":"boolean"}},"additionalProperties":false}');
    expect(result.issues.some(x => x.path === '$/extra')).toBe(true);
  });
});
