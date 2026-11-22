import { describe, expect, it } from 'vitest';
import {
  MAX_BACKGROUND_REMOVAL_FILE_SIZE,
  isValidImageDimensions,
  validateBackgroundRemovalFile
} from './logic';

describe('background remover validation', () => {
  it('accepts supported image types under 10 MB', () => {
    expect(validateBackgroundRemovalFile({ type: 'image/png', size: 1024 })).toEqual({ ok: true });
    expect(validateBackgroundRemovalFile({ type: 'image/jpeg', size: MAX_BACKGROUND_REMOVAL_FILE_SIZE })).toEqual({ ok: true });
  });

  it('rejects non-image and unsupported formats', () => {
    expect(validateBackgroundRemovalFile({ type: 'application/pdf', size: 100 })).toEqual({ ok: false, reason: 'type' });
    expect(validateBackgroundRemovalFile({ type: 'image/svg+xml', size: 100 })).toEqual({ ok: false, reason: 'type' });
  });

  it('rejects files larger than 10 MB and empty files', () => {
    expect(validateBackgroundRemovalFile({ type: 'image/png', size: MAX_BACKGROUND_REMOVAL_FILE_SIZE + 1 })).toEqual({ ok: false, reason: 'size' });
    expect(validateBackgroundRemovalFile({ type: 'image/png', size: 0 })).toEqual({ ok: false, reason: 'empty' });
  });

  it('limits decoded image dimensions to 20 megapixels', () => {
    expect(isValidImageDimensions(4000, 5000)).toBe(true);
    expect(isValidImageDimensions(5000, 5000)).toBe(false);
    expect(isValidImageDimensions(0, 100)).toBe(false);
    expect(isValidImageDimensions(1.5, 100)).toBe(false);
  });
});
