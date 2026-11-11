import { describe, it, expect } from 'vitest';
import { contrastRatio, evaluateContrast, relativeLuminance } from '../../src/tools/color/contrast-checker/logic';

describe('relativeLuminance', () => {
  it('white is 1', () => expect(relativeLuminance({ r: 255, g: 255, b: 255 })).toBeCloseTo(1, 2));
  it('black is 0', () => expect(relativeLuminance({ r: 0, g: 0, b: 0 })).toBeCloseTo(0, 2));
});

describe('contrastRatio', () => {
  it('black on white is 21', () => expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 0));
  it('white on black is 21', () => expect(contrastRatio('#ffffff', '#000000')).toBeCloseTo(21, 0));
  it('same colors is 1', () => expect(contrastRatio('#ff0000', '#ff0000')).toBeCloseTo(1, 1));
  it('invalid returns 0', () => expect(contrastRatio('xyz', '#fff')).toBe(0));
});

describe('evaluateContrast', () => {
  it('black/white passes all levels', () => {
    const r = evaluateContrast('#000000', '#ffffff');
    expect(r.aaNormal).toBe(true);
    expect(r.aaaNormal).toBe(true);
    expect(r.aaaLarge).toBe(true);
  });
  it('gray on white fails AA normal', () => {
    const r = evaluateContrast('#999999', '#ffffff');
    expect(r.aaNormal).toBe(false);
  });
  it('gray on white passes AA large', () => {
    const r = evaluateContrast('#999999', '#ffffff');
    expect(r.aaLarge).toBe(true);
  });
});
