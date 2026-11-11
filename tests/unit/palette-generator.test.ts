import { describe, it, expect } from 'vitest';
import { hexToRgb, rgbToHex, hexToHsl, hslToHex, generatePalette } from '../../src/tools/color/palette-generator/logic';

describe('hexToRgb', () => {
  it('parses red', () => expect(hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 }));
  it('parses black', () => expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 }));
  it('parses without #', () => expect(hexToRgb('00FF00')).toEqual({ r: 0, g: 255, b: 0 }));
  it('returns null for invalid', () => expect(hexToRgb('invalid')).toBeNull());
});

describe('rgbToHex', () => {
  it('formats red', () => expect(rgbToHex(255, 0, 0)).toBe('#ff0000'));
  it('formats black', () => expect(rgbToHex(0, 0, 0)).toBe('#000000'));
  it('clamps out of range', () => expect(rgbToHex(300, -10, 128)).toBe('#ff0080'));
});

describe('hexToHsl', () => {
  it('red hue is 0', () => expect(hexToHsl('#FF0000')?.h).toBe(0));
  it('green hue is 120', () => expect(hexToHsl('#00FF00')?.h).toBe(120));
  it('blue hue is 240', () => expect(hexToHsl('#0000FF')?.h).toBe(240));
  it('white has 0 saturation', () => expect(hexToHsl('#FFFFFF')?.s).toBe(0));
});

describe('hslToHex', () => {
  it('hsl 0,100,50 = red', () => expect(hslToHex(0, 100, 50)).toBe('#ff0000'));
  it('hsl 120,100,50 = green', () => expect(hslToHex(120, 100, 50)).toBe('#00ff00'));
  it('hsl 240,100,50 = blue', () => expect(hslToHex(240, 100, 50)).toBe('#0000ff'));
});

describe('generatePalette', () => {
  it('complementary has 5 colors', () => {
    expect(generatePalette('#FF0000', 'complementary').length).toBe(5);
  });
  it('analogous has 5 colors', () => {
    expect(generatePalette('#FF0000', 'analogous').length).toBe(5);
  });
  it('complementary of red includes cyan-ish', () => {
    const palette = generatePalette('#FF0000', 'complementary');
    expect(palette.length).toBe(5);
    // One of the colors should be near cyan (180 hue)
    expect(palette.some(c => {
      const hsl = hexToHsl(c);
      return hsl && Math.abs(hsl.h - 180) < 5;
    })).toBe(true);
  });
  it('returns empty for invalid color', () => {
    expect(generatePalette('xyz', 'complementary')).toEqual([]);
  });
});
