import { describe, it, expect } from 'vitest';
import { timestampToDate, dateToTimestamp } from '../../src/tools/date/unix-timestamp/logic';

describe('timestampToDate', () => {
  it('converts 0 to epoch', () => {
    const d = timestampToDate(0);
    expect(d?.getTime()).toBe(0);
  });
  it('converts known timestamp', () => {
    const d = timestampToDate(1700000000);
    expect(d?.toISOString()).toBe('2023-11-14T22:13:20.000Z');
  });
  it('handles milliseconds', () => {
    const d = timestampToDate(1700000000000);
    expect(d?.getTime()).toBe(1700000000000);
  });
  it('returns null for invalid', () => {
    expect(timestampToDate(NaN)).toBeNull();
  });
});

describe('dateToTimestamp', () => {
  it('converts epoch date', () => {
    expect(dateToTimestamp(new Date(0), true)).toBe(0);
  });
  it('converts known date', () => {
    expect(dateToTimestamp(new Date('2023-11-14T22:13:20Z'), true)).toBe(1700000000);
  });
  it('returns ms when requested', () => {
    expect(dateToTimestamp(new Date(0), false)).toBe(0);
  });
});
