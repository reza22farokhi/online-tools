import { describe, it, expect } from 'vitest';
import { processJson, queryJsonPath, transformJson } from '../../src/tools/code/json-formatter/logic';

describe('processJson', () => {
  it('rejects JSON inputs above the character limit in every operation', () => {
    const oversized = '"' + 'x'.repeat(100_001) + '"';
    expect(processJson(oversized, 'format').ok).toBe(false);
    expect(transformJson(oversized, {}).ok).toBe(false);
    expect(queryJsonPath(oversized, '
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

  it('preserves a __proto__ JSON key without mutating object prototypes', async () => {
    const result = transformJson('{"__proto__":{"polluted":true},"safe":1}', { sortKeys: true });
    expect(result.ok).toBe(true);
    const parsed = JSON.parse(result.output);
    expect(Object.prototype.hasOwnProperty.call(parsed, '__proto__')).toBe(true);
    expect(({} as { polluted?: boolean }).polluted).toBeUndefined();
  });
});


describe('transformJson', () => {
  it('sorts object keys recursively and removes null and empty values', async () => {
    const result = transformJson(
      '{"z":1,"nested":{"b":"","a":2},"nothing":null,"empty":[]}',
      { sortKeys: true, removeNulls: true, removeEmpty: true }
    );
    expect(result.ok).toBe(true);
    expect(result.output).toBe('{\n  "nested": {\n    "a": 2\n  },\n  "z": 1\n}');
  });

  it('keeps null and empty containers when their options are disabled', async () => {
    const result = transformJson('{"nullValue":null,"empty":[],"text":""}', {});
    expect(result.ok).toBe(true);
    expect(JSON.parse(result.output)).toEqual({ nullValue: null, empty: [], text: '' });
  });

  it('rejects invalid JSON and does not return partial output', async () => {
    const result = transformJson('{"broken":', { sortKeys: true });
    expect(result.ok).toBe(false);
    expect(result.output).toBe('');
    expect(result.error).toBeTruthy();
  });
});

describe('queryJsonPath', () => {
  it('reads nested object properties and array indexes', async () => {
    const result = queryJsonPath('{"users":[{"name":"Ada"},{"name":"Grace"}]}', '$.users[1].name');
    expect(result.ok).toBe(true);
    expect(result.output).toBe('"Grace"');
  });

  it('supports quoted property names and array wildcards', async () => {
    const source = '{"odd-key":[{"id":1},{"id":2}]}';
    const quoted = queryJsonPath(source, '$["odd-key"][0].id');
    const wildcard = queryJsonPath(source, '$["odd-key"][*].id');
    expect(quoted.output).toBe('1');
    expect(JSON.parse(wildcard.output)).toEqual([1, 2]);
  });

  it('returns a clear error for invalid or missing paths', async () => {
    expect(queryJsonPath('{"a":1}', 'a').ok).toBe(false);
    expect(queryJsonPath('{"a":1}', '$.missing').ok).toBe(false);
    expect(queryJsonPath('{"a":1}', '$[abc]').ok).toBe(false);
  });

  it('does not expose inherited object properties', async () => {
    expect(queryJsonPath('{"a":1}', '$.__proto__').ok).toBe(false);
  });
});
).ok).toBe(false);
  });

  it('rejects structures above the 20,000-node limit in every operation', () => {
    const oversized = JSON.stringify(Array.from({ length: 20_001 }, () => 0));
    expect(processJson(oversized, 'minify').ok).toBe(false);
    expect(transformJson(oversized, {}).ok).toBe(false);
    expect(queryJsonPath(oversized, '$[*]').ok).toBe(false);
  });

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

  it('preserves a __proto__ JSON key without mutating object prototypes', async () => {
    const result = transformJson('{"__proto__":{"polluted":true},"safe":1}', { sortKeys: true });
    expect(result.ok).toBe(true);
    const parsed = JSON.parse(result.output);
    expect(Object.prototype.hasOwnProperty.call(parsed, '__proto__')).toBe(true);
    expect(({} as { polluted?: boolean }).polluted).toBeUndefined();
  });
});


describe('transformJson', () => {
  it('sorts object keys recursively and removes null and empty values', async () => {
    const result = transformJson(
      '{"z":1,"nested":{"b":"","a":2},"nothing":null,"empty":[]}',
      { sortKeys: true, removeNulls: true, removeEmpty: true }
    );
    expect(result.ok).toBe(true);
    expect(result.output).toBe('{\n  "nested": {\n    "a": 2\n  },\n  "z": 1\n}');
  });

  it('keeps null and empty containers when their options are disabled', async () => {
    const result = transformJson('{"nullValue":null,"empty":[],"text":""}', {});
    expect(result.ok).toBe(true);
    expect(JSON.parse(result.output)).toEqual({ nullValue: null, empty: [], text: '' });
  });

  it('rejects invalid JSON and does not return partial output', async () => {
    const result = transformJson('{"broken":', { sortKeys: true });
    expect(result.ok).toBe(false);
    expect(result.output).toBe('');
    expect(result.error).toBeTruthy();
  });
});

describe('queryJsonPath', () => {
  it('reads nested object properties and array indexes', async () => {
    const result = queryJsonPath('{"users":[{"name":"Ada"},{"name":"Grace"}]}', '$.users[1].name');
    expect(result.ok).toBe(true);
    expect(result.output).toBe('"Grace"');
  });

  it('supports quoted property names and array wildcards', async () => {
    const source = '{"odd-key":[{"id":1},{"id":2}]}';
    const quoted = queryJsonPath(source, '$["odd-key"][0].id');
    const wildcard = queryJsonPath(source, '$["odd-key"][*].id');
    expect(quoted.output).toBe('1');
    expect(JSON.parse(wildcard.output)).toEqual([1, 2]);
  });

  it('returns a clear error for invalid or missing paths', async () => {
    expect(queryJsonPath('{"a":1}', 'a').ok).toBe(false);
    expect(queryJsonPath('{"a":1}', '$.missing').ok).toBe(false);
    expect(queryJsonPath('{"a":1}', '$[abc]').ok).toBe(false);
  });

  it('does not expose inherited object properties', async () => {
    expect(queryJsonPath('{"a":1}', '$.__proto__').ok).toBe(false);
  });
});
