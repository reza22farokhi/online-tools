import { describe, it, expect } from 'vitest';
import { processJson } from '../../src/tools/code/json-formatter/logic';

describe('processJson', () => {
  it('formats simple object with 2-space indent', () => {
    const r = processJson('{"a":1}', 'format');
    expect(r.ok).toBe(true);
    expect(r.output).toBe('{\n  "a": 1\n}');
  });

  it('formats with 4-space indent', () => {
    const r = processJson('{"a":1}', 'format', 4);
    expect(r.ok).toBe(true);
    expect(r.output).toBe('{\n    "a": 1\n}');
  });

  it('minifies formatted JSON', () => {
    const r = processJson('{\n  "a": 1,\n  "b": 2\n}', 'minify');
    expect(r.ok).toBe(true);
    expect(r.output).toBe('{"a":1,"b":2}');
  });

  it('validates valid JSON', () => {
    const r = processJson('{"a":1}', 'validate');
    expect(r.ok).toBe(true);
    expect(r.output).toContain('معتبر');
  });

  it('returns error for invalid JSON', () => {
    const r = processJson('{invalid}', 'format');
    expect(r.ok).toBe(false);
    expect(r.error).toBeTruthy();
    expect(r.output).toBe('');
  });

  it('returns error for trailing comma', () => {
    const r = processJson('{"a":1,}', 'format');
    expect(r.ok).toBe(false);
  });

  it('returns error for empty input', () => {
    const r = processJson('', 'format');
    expect(r.ok).toBe(false);
    expect(r.error).toContain('خالی');
  });

  it('returns error for whitespace-only input', () => {
    const r = processJson('   \n\t ', 'format');
    expect(r.ok).toBe(false);
  });

  it('handles deeply nested objects', () => {
    const r = processJson('{"a":{"b":{"c":{"d":1}}}}', 'format');
    expect(r.ok).toBe(true);
    expect(r.output).toContain('"d": 1');
  });

  it('handles arrays of primitives', () => {
    const r = processJson('[1,2,3]', 'format');
    expect(r.ok).toBe(true);
    expect(r.output).toContain('1,');
  });

  it('handles arrays of objects', () => {
    const r = processJson('[{"a":1},{"b":2}]', 'minify');
    expect(r.ok).toBe(true);
    expect(r.output).toBe('[{"a":1},{"b":2}]');
  });

  it('preserves number precision', () => {
    const r = processJson('{"n":3.14159}', 'minify');
    expect(r.ok).toBe(true);
    expect(r.output).toBe('{"n":3.14159}');
  });

  it('preserves unicode strings', () => {
    const r = processJson('{"name":"سلام دنیا"}', 'format');
    expect(r.ok).toBe(true);
    expect(r.output).toContain('سلام دنیا');
  });

  it('handles null and boolean values', () => {
    const r = processJson('{"x":null,"y":true,"z":false}', 'minify');
    expect(r.ok).toBe(true);
    expect(r.output).toBe('{"x":null,"y":true,"z":false}');
  });

  it('handles top-level primitives', () => {
    expect(processJson('42', 'minify').output).toBe('42');
    expect(processJson('"hello"', 'minify').output).toBe('"hello"');
    expect(processJson('true', 'validate').ok).toBe(true);
  });

  it('handles escaped characters in strings', () => {
    const r = processJson('{"s":"line1\\nline2"}', 'format');
    expect(r.ok).toBe(true);
    expect(r.output).toContain('line1\\nline2');
  });
});
