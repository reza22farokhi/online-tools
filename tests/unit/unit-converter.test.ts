import { describe, it, expect } from 'vitest';
import { UNITS, convert, formatNumber } from '../../src/tools/calc/unit-converter/logic';

function find(cat: 'length' | 'weight' | 'temperature' | 'volume' | 'area', id: string) {
  const u = UNITS[cat].find(x => x.id === id);
  if (!u) throw new Error('unit not found: ' + id);
  return u;
}

describe('length', () => {
  it('1 m = 100 cm', () => {
    expect(convert(1, find('length', 'm'), find('length', 'cm'))).toBeCloseTo(100, 5);
  });
  it('1 km = 1000 m', () => {
    expect(convert(1, find('length', 'km'), find('length', 'm'))).toBeCloseTo(1000, 5);
  });
  it('1 inch = 2.54 cm', () => {
    expect(convert(1, find('length', 'in'), find('length', 'cm'))).toBeCloseTo(2.54, 5);
  });
  it('1 mile = 1609.344 m', () => {
    expect(convert(1, find('length', 'mi'), find('length', 'm'))).toBeCloseTo(1609.344, 3);
  });
});

describe('weight', () => {
  it('1 kg = 1000 g', () => {
    expect(convert(1, find('weight', 'kg'), find('weight', 'g'))).toBeCloseTo(1000, 5);
  });
  it('1 lb = 0.45359237 kg', () => {
    expect(convert(1, find('weight', 'lb'), find('weight', 'kg'))).toBeCloseTo(0.45359237, 5);
  });
});

describe('temperature', () => {
  it('0°C = 32°F', () => {
    expect(convert(0, find('temperature', 'c'), find('temperature', 'f'))).toBeCloseTo(32, 5);
  });
  it('100°C = 212°F', () => {
    expect(convert(100, find('temperature', 'c'), find('temperature', 'f'))).toBeCloseTo(212, 5);
  });
  it('0°C = 273.15 K', () => {
    expect(convert(0, find('temperature', 'c'), find('temperature', 'k'))).toBeCloseTo(273.15, 5);
  });
  it('32°F = 0°C', () => {
    expect(convert(32, find('temperature', 'f'), find('temperature', 'c'))).toBeCloseTo(0, 5);
  });
});

describe('volume', () => {
  it('1 L = 1000 mL', () => {
    expect(convert(1, find('volume', 'l'), find('volume', 'ml'))).toBeCloseTo(1000, 5);
  });
  it('1 m³ = 1000 L', () => {
    expect(convert(1, find('volume', 'm3'), find('volume', 'l'))).toBeCloseTo(1000, 5);
  });
});

describe('area', () => {
  it('1 m² = 10000 cm²', () => {
    expect(convert(1, find('area', 'm2'), find('area', 'cm2'))).toBeCloseTo(10000, 5);
  });
  it('1 ha = 10000 m²', () => {
    expect(convert(1, find('area', 'ha'), find('area', 'm2'))).toBeCloseTo(10000, 5);
  });
});

describe('formatNumber', () => {
  it('integer unchanged', () => expect(formatNumber(100)).toBe('100'));
  it('strips trailing zeros', () => expect(formatNumber(2.50)).toBe('2.5'));
  it('NaN returns dash', () => expect(formatNumber(NaN)).toBe('—'));
});
