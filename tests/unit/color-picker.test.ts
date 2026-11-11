import { describe, it, expect } from 'vitest';
import { rgbToHex, formatRgb } from '../../src/tools/image/color-picker/logic';

describe('rgbToHex', () => {
  it('converts red', () => expect(rgbToHex(255, 0, 0)).toBe('#FF0000'));
  it('converts green', () => expect(rgbToHex(0, 255, 0)).toBe('#00FF00'));
  it('converts blue', () => expect(rgbToHex(0, 0, 255)).toBe('#0000FF'));
  it('converts white', () => expect(rgbToHex(255, 255, 255)).toBe('#FFFFFF'));
  it('converts black', () => expect(rgbToHex(0, 0, 0)).toBe('#000000'));
  it('clamps out of range', () => expect(rgbToHex(300, -10, 100)).toBe('#FF0064'));
});

describe('formatRgb', () => {
  it('formats correctly', () => expect(formatRgb(10, 20, 30)).toBe('rgb(10, 20, 30)'));
});
