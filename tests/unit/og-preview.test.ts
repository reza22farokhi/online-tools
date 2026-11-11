import { describe, it, expect } from 'vitest';
import { extractDomain } from '../../src/tools/seo/og-preview/logic';

describe('extractDomain', () => {
  it('extracts simple domain', () => expect(extractDomain('https://example.com')).toBe('example.com'));
  it('strips www', () => expect(extractDomain('https://www.example.com/page')).toBe('example.com'));
  it('adds https if missing', () => expect(extractDomain('example.com')).toBe('example.com'));
  it('handles empty input', () => expect(extractDomain('')).toBe('example.com'));
});
