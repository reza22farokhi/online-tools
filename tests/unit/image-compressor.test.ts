import { describe, it, expect } from 'vitest';
import { calculateReduction, formatBytes } from '../../src/tools/image/image-compressor/logic';

describe('calculateReduction', () => {
  it('calculates correct percentage', () => {
    expect(calculateReduction(1000, 500)).toBe(50);
    expect(calculateReduction(1000, 200)).toBe(80);
  });
  it('handles zero original size', () => expect(calculateReduction(0, 100)).toBe(0));
  it('does not go below 0 if compressed is larger', () => {
    expect(calculateReduction(500, 1000)).toBe(0);
  });
});
