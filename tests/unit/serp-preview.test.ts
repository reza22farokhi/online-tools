import { describe, it, expect } from 'vitest';
import { truncate, formatUrlForSerp } from '../../src/tools/seo/serp-preview/logic';

describe('truncate', () => {
  it('returns short text unchanged', () => {
    expect(truncate('Short', 10)).toBe('Short');
  });
  it('truncates and adds ellipsis', () => {
    expect(truncate('This is a very long text', 10)).toBe('This is a…');
  });
  it('empty returns empty', () => {
    expect(truncate('', 10)).toBe('');
  });
});

describe('formatUrlForSerp', () => {
  it('formats simple domain', () => {
    expect(formatUrlForSerp('https://example.com')).toBe('example.com');
  });
  it('formats with path', () => {
    expect(formatUrlForSerp('https://www.example.com/foo/bar')).toBe('example.com › foo › bar');
  });
  it('adds https if missing', () => {
    expect(formatUrlForSerp('example.com/test')).toBe('example.com › test');
  });
  it('handles invalid URL gracefully', () => {
    expect(formatUrlForSerp('not a url')).toBe('not a url');
  });
});
