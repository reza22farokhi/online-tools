import { describe, it, expect } from 'vitest';
import { calculateDimensions, formatBytes } from '../../src/tools/image/image-resizer/logic';

describe('calculateDimensions', () => {
  it('maintains aspect ratio (landscape)', () => {
    expect(calculateDimensions(1920, 1080, 800, 800, true)).toEqual({ width: 800, height: 450 });
  });
  it('maintains aspect ratio (portrait)', () => {
    expect(calculateDimensions(1080, 1920, 500, 500, true)).toEqual({ width: 281, height: 500 });
  });
  it('stretches if maintain is false', () => {
    expect(calculateDimensions(1920, 1080, 500, 500, false)).toEqual({ width: 500, height: 500 });
  });
  it('returns zero for invalid input', () => {
    expect(calculateDimensions(0, 100, 500, 500, true)).toEqual({ width: 0, height: 0 });
  });
});

describe('formatBytes', () => {
  it('formats 0 bytes', () => expect(formatBytes(0)).toBe('0 Bytes'));
  it('formats KB', () => expect(formatBytes(1024)).toBe('1 KB'));
  it('formats MB', () => expect(formatBytes(1048576)).toBe('1 MB'));
  it('formats mixed', () => expect(formatBytes(1500000)).toBe('1.43 MB'));
});
