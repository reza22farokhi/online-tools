import { describe, it, expect } from 'vitest';
import { validateFileSize, formatBytes } from '../../src/lib/file-validation';

describe('validateFileSize', () => {
  const MAX_20 = 20 * 1024 * 1024;
  const LBL_20 = '۲۰ مگابایت';
  it('accepts small file', () => {
    expect(validateFileSize(1024, MAX_20, LBL_20).ok).toBe(true);
  });
  it('accepts file at limit', () => {
    expect(validateFileSize(MAX_20, MAX_20, LBL_20).ok).toBe(true);
  });
  it('rejects file just over limit', () => {
    const r = validateFileSize(MAX_20 + 1, MAX_20, LBL_20);
    expect(r.ok).toBe(false);
    expect(r.error).toContain('بیشتر از حد مجاز');
  });
  it('rejects 100MB against 20MB limit with correct label', () => {
    const r = validateFileSize(100 * 1024 * 1024, MAX_20, LBL_20);
    expect(r.ok).toBe(false);
    expect(r.error).toContain('100.0');
    expect(r.error).toContain('۲۰ مگابایت');
  });
  it('rejects 20MB against 10MB limit', () => {
    const r = validateFileSize(MAX_20, 10 * 1024 * 1024, '۱۰ مگابایت');
    expect(r.ok).toBe(false);
    expect(r.error).toContain('۱۰ مگابایت');
  });
  it('rejects empty file', () => {
    const r = validateFileSize(0, MAX_20, LBL_20);
    expect(r.ok).toBe(false);
    expect(r.error).toContain('خالی');
  });
  it('rejects negative size', () => {
    expect(validateFileSize(-1, MAX_20, LBL_20).ok).toBe(false);
  });
  it('rejects NaN', () => {
    expect(validateFileSize(NaN, MAX_20, LBL_20).ok).toBe(false);
  });
  it('rejects Infinity', () => {
    expect(validateFileSize(Infinity, MAX_20, LBL_20).ok).toBe(false);
  });
});

describe('formatBytes', () => {
  it('0 bytes', () => expect(formatBytes(0)).toBe('0 Bytes'));
  it('1 KB', () => expect(formatBytes(1024)).toBe('1 KB'));
  it('1 MB', () => expect(formatBytes(1024 * 1024)).toBe('1 MB'));
  it('1.5 MB', () => expect(formatBytes(1024 * 1024 * 1.5)).toBe('1.5 MB'));
  it('20 MB', () => expect(formatBytes(20 * 1024 * 1024)).toBe('20 MB'));
});
