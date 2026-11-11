import { describe, it, expect } from 'vitest';
import { convertCase } from '../../src/tools/text/case-converter/logic';

describe('convertCase', () => {
  it('lowercase', () => {
    expect(convertCase('Hello World FOO', 'lower')).toBe('hello world foo');
  });

  it('uppercase', () => {
    expect(convertCase('hello World foo', 'upper')).toBe('HELLO WORLD FOO');
  });

  it('title case', () => {
    expect(convertCase('hello world foo', 'title')).toBe('Hello World Foo');
  });

  it('sentence case', () => {
    expect(convertCase('hello. world! how are you?', 'sentence'))
      .toBe('Hello. World! How are you?');
  });

  it('camelCase from spaces', () => {
    expect(convertCase('hello world foo', 'camel')).toBe('helloWorldFoo');
  });

  it('camelCase from snake_case', () => {
    expect(convertCase('hello_world_foo', 'camel')).toBe('helloWorldFoo');
  });

  it('camelCase from kebab-case', () => {
    expect(convertCase('hello-world-foo', 'camel')).toBe('helloWorldFoo');
  });

  it('camelCase from existing camelCase input', () => {
    expect(convertCase('helloWorldFoo', 'camel')).toBe('helloWorldFoo');
  });

  it('PascalCase from spaces', () => {
    expect(convertCase('hello world', 'pascal')).toBe('HelloWorld');
  });

  it('snake_case from spaces', () => {
    expect(convertCase('hello world foo', 'snake')).toBe('hello_world_foo');
  });

  it('snake_case from camelCase', () => {
    expect(convertCase('helloWorldFoo', 'snake')).toBe('hello_world_foo');
  });

  it('kebab-case from spaces', () => {
    expect(convertCase('hello world foo', 'kebab')).toBe('hello-world-foo');
  });

  it('alternating case', () => {
    expect(convertCase('hello', 'alternating')).toBe('hElLo');
  });

  it('empty string stays empty', () => {
    expect(convertCase('', 'upper')).toBe('');
    expect(convertCase('', 'camel')).toBe('');
    expect(convertCase('', 'title')).toBe('');
  });

  it('preserves whitespace structure in title', () => {
    expect(convertCase('  hello   world  ', 'title'))
      .toBe('  Hello   World  ');
  });
});
