import { describe, it, expect } from 'vitest';
import { formatBytes, validateFileSize, MAX_FILE_SIZE } from '../../src/tools/file/file-info/logic';

describe('formatBytes', () => {
  it('0 bytes', () => expect(formatBytes(0)).toBe('0 Bytes'));
  it('1 KB', () => expect(formatBytes(1024)).toBe('1 KB'));
  it('1 MB', () => expect(formatBytes(1048576)).toBe('1 MB'));
  it('50 MB', () => expect(formatBytes(MAX_FILE_SIZE)).toBe('50 MB'));
});

describe('MAX_FILE_SIZE', () => {
  it('is exactly 50 MB', () => {
    expect(MAX_FILE_SIZE).toBe(50 * 1024 * 1024);
  });
});

describe('validateFileSize', () => {
  it('accepts small file (1KB)', () => {
    expect(validateFileSize(1024).ok).toBe(true);
  });
  it('accepts file just under limit', () => {
    expect(validateFileSize(MAX_FILE_SIZE - 1).ok).toBe(true);
  });
  it('accepts file exactly at limit', () => {
    expect(validateFileSize(MAX_FILE_SIZE).ok).toBe(true);
  });
  it('rejects file just over limit', () => {
    const r = validateFileSize(MAX_FILE_SIZE + 1);
    expect(r.ok).toBe(false);
    expect(r.error).toContain('بیشتر از حد مجاز');
  });
  it('rejects 100 MB file', () => {
    const r = validateFileSize(100 * 1024 * 1024);
    expect(r.ok).toBe(false);
    expect(r.error).toContain('100.0');
  });
  it('rejects empty file', () => {
    const r = validateFileSize(0);
    expect(r.ok).toBe(false);
    expect(r.error).toContain('خالی');
  });
  it('rejects negative size', () => {
    expect(validateFileSize(-1).ok).toBe(false);
  });
  it('rejects non-finite size', () => {
    expect(validateFileSize(NaN).ok).toBe(false);
    expect(validateFileSize(Infinity).ok).toBe(false);
  });
});
