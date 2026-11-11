import { describe, it, expect } from 'vitest';
import { formatBytes } from '../../src/tools/file/file-info/logic';

describe('formatBytes', () => {
  it('0 bytes', () => expect(formatBytes(0)).toBe('0 Bytes'));
  it('KB', () => expect(formatBytes(1024)).toBe('1 KB'));
  it('MB', () => expect(formatBytes(1048576)).toBe('1 MB'));
});
