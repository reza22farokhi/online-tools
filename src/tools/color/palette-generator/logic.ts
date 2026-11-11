export interface HSL { h: number; s: number; l: number; }

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = hex.replace('#', '').match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) return null;
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return '#' + toHex(r) + toHex(g) + toHex(b);
}

export function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
      case g: h = ((b - r) / d + 2); break;
      case b: h = ((r - g) / d + 4); break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h = ((h % 360) + 360) % 360 / 360;
  s /= 100; l /= 100;
  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return { r: r * 255, g: g * 255, b: b * 255 };
}

export function hslToHex(h: number, s: number, l: number): string {
  const { r, g, b } = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

export function hexToHsl(hex: string): HSL | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  return rgbToHsl(rgb.r, rgb.g, rgb.b);
}

export type HarmonyType = 'complementary' | 'analogous' | 'triadic' | 'tetradic' | 'monochromatic' | 'split';

export const HARMONY_TYPES: { value: HarmonyType; fa: string; en: string }[] = [
  { value: 'complementary', fa: 'مکمل', en: 'Complementary' },
  { value: 'analogous', fa: 'آنالوگ', en: 'Analogous' },
  { value: 'triadic', fa: 'سه‌گانه', en: 'Triadic' },
  { value: 'tetradic', fa: 'چهارگانه', en: 'Tetradic' },
  { value: 'monochromatic', fa: 'تک‌رنگ', en: 'Monochromatic' },
  { value: 'split', fa: 'Split-Complementary', en: 'Split' }
];

export function generatePalette(baseHex: string, type: HarmonyType): string[] {
  const base = hexToHsl(baseHex);
  if (!base) return [];
  const { h, s, l } = base;

  switch (type) {
    case 'complementary':
      return [baseHex, hslToHex(h + 180, s, l), hslToHex(h + 180, s, Math.max(10, l - 20)), hslToHex(h, s, Math.min(90, l + 20)), hslToHex(h + 180, s, Math.min(90, l + 30))];
    case 'analogous':
      return [hslToHex(h - 30, s, l), hslToHex(h - 15, s, l), baseHex, hslToHex(h + 15, s, l), hslToHex(h + 30, s, l)];
    case 'triadic':
      return [baseHex, hslToHex(h + 120, s, l), hslToHex(h + 240, s, l), hslToHex(h + 120, s, Math.max(10, l - 20)), hslToHex(h + 240, s, Math.min(90, l + 20))];
    case 'tetradic':
      return [baseHex, hslToHex(h + 90, s, l), hslToHex(h + 180, s, l), hslToHex(h + 270, s, l), hslToHex(h, s, Math.min(90, l + 20))];
    case 'monochromatic':
      return [hslToHex(h, s, Math.max(10, l - 30)), hslToHex(h, s, Math.max(15, l - 15)), baseHex, hslToHex(h, s, Math.min(85, l + 15)), hslToHex(h, s, Math.min(95, l + 30))];
    case 'split':
      return [baseHex, hslToHex(h + 150, s, l), hslToHex(h + 210, s, l), hslToHex(h + 150, s, Math.max(10, l - 20)), hslToHex(h + 210, s, Math.min(90, l + 20))];
  }
}
