import { describe, it, expect } from 'vitest';
import { getFileExtension, formatBytes } from '../../src/tools/image/format-converter/logic';

describe('getFileExtension', () => {
  it('jpg for image/jpeg', () => expect(getFileExtension('image/jpeg')).toBe('jpg'));
  it('png for image/png', () => expect(getFileExtension('image/png')).toBe('png'));
  it('webp for image/webp', () => expect(getFileExtension('image/webp')).toBe('webp'));
});
