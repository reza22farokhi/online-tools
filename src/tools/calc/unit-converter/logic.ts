export type Category = 'length' | 'weight' | 'temperature' | 'volume' | 'area';

export interface UnitDef {
  id: string;
  label: string;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
}

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'length', label: 'طول' },
  { id: 'weight', label: 'وزن' },
  { id: 'temperature', label: 'دما' },
  { id: 'volume', label: 'حجم' },
  { id: 'area', label: 'مساحت' }
];

export const UNITS: Record<Category, UnitDef[]> = {
  length: [
    { id: 'mm', label: 'میلی‌متر', toBase: v => v / 1000, fromBase: v => v * 1000 },
    { id: 'cm', label: 'سانتی‌متر', toBase: v => v / 100, fromBase: v => v * 100 },
    { id: 'm', label: 'متر', toBase: v => v, fromBase: v => v },
    { id: 'km', label: 'کیلومتر', toBase: v => v * 1000, fromBase: v => v / 1000 },
    { id: 'in', label: 'اینچ', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
    { id: 'ft', label: 'فوت', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
    { id: 'mi', label: 'مایل', toBase: v => v * 1609.344, fromBase: v => v / 1609.344 }
  ],
  weight: [
    { id: 'mg', label: 'میلی‌گرم', toBase: v => v / 1_000_000, fromBase: v => v * 1_000_000 },
    { id: 'g', label: 'گرم', toBase: v => v / 1000, fromBase: v => v * 1000 },
    { id: 'kg', label: 'کیلوگرم', toBase: v => v, fromBase: v => v },
    { id: 't', label: 'تن', toBase: v => v * 1000, fromBase: v => v / 1000 },
    { id: 'lb', label: 'پوند', toBase: v => v * 0.45359237, fromBase: v => v / 0.45359237 },
    { id: 'oz', label: 'اونس', toBase: v => v * 0.028349523, fromBase: v => v / 0.028349523 }
  ],
  temperature: [
    { id: 'c', label: 'سلسیوس (°C)', toBase: v => v, fromBase: v => v },
    { id: 'f', label: 'فارنهایت (°F)', toBase: v => (v - 32) * 5 / 9, fromBase: v => v * 9 / 5 + 32 },
    { id: 'k', label: 'کلوین (K)', toBase: v => v - 273.15, fromBase: v => v + 273.15 }
  ],
  volume: [
    { id: 'ml', label: 'میلی‌لیتر', toBase: v => v / 1000, fromBase: v => v * 1000 },
    { id: 'l', label: 'لیتر', toBase: v => v, fromBase: v => v },
    { id: 'm3', label: 'متر مکعب', toBase: v => v * 1000, fromBase: v => v / 1000 },
    { id: 'gal', label: 'گالن آمریکایی', toBase: v => v * 3.785411784, fromBase: v => v / 3.785411784 },
    { id: 'cup', label: 'پیمانه', toBase: v => v * 0.2365882365, fromBase: v => v / 0.2365882365 }
  ],
  area: [
    { id: 'cm2', label: 'سانتی‌متر مربع', toBase: v => v / 10000, fromBase: v => v * 10000 },
    { id: 'm2', label: 'متر مربع', toBase: v => v, fromBase: v => v },
    { id: 'km2', label: 'کیلومتر مربع', toBase: v => v * 1_000_000, fromBase: v => v / 1_000_000 },
    { id: 'ha', label: 'هکتار', toBase: v => v * 10000, fromBase: v => v / 10000 },
    { id: 'ft2', label: 'فوت مربع', toBase: v => v * 0.09290304, fromBase: v => v / 0.09290304 }
  ]
};

export function convert(value: number, from: UnitDef, to: UnitDef): number {
  if (!Number.isFinite(value)) return NaN;
  return to.fromBase(from.toBase(value));
}

export function formatNumber(n: number, decimals = 6): string {
  if (!Number.isFinite(n)) return '—';
  if (Number.isInteger(n)) return String(n);
  return parseFloat(n.toFixed(decimals)).toString();
}
