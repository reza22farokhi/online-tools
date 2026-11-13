import { describe, it, expect } from 'vitest';
import { fixArabicChars, fixHalfSpaces, fixPunctuation, convertNumbers, refinePersianText } from '../../src/lib/persian-fixer';

describe('Persian Text Refiner', () => {
  it('fixes Arabic characters', () => {
    expect(fixArabicChars('علي كريم')).toBe('علی کریم');
  });
  it('fixes half spaces', () => {
    expect(fixHalfSpaces('می روم به خانه')).toBe('می‌روم به خانه');
    expect(fixHalfSpaces('کتاب ها')).toBe('کتاب‌ها');
  });
  it('fixes punctuation', () => {
    expect(fixPunctuation('سلام , خوبی ؟')).toBe('سلام، خوبی؟');
  });
  it('converts numbers', () => {
    expect(convertNumbers('123', true)).toBe('۱۲۳');
  });
  it('applies all options', () => {
    const input = 'علي 1 تا 2 مي گفت , كتاب ها';
    const expected = 'علی ۱ تا ۲ می‌گفت، کتاب‌ها';
    expect(refinePersianText(input, { fixArabic: true, fixHalfSpaces: true, fixPunctuation: true, convertToPersianNumbers: true })).toBe(expected);
  });
});
