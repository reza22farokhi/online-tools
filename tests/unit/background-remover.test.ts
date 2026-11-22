import { describe, expect, it } from 'vitest';
import { registry } from '../../src/tools/registry';
import { faqs } from '../../src/data/faqs/background-remover';
import {
  MAX_BACKGROUND_REMOVAL_FILE_SIZE,
  isValidImageDimensions,
  validateBackgroundRemovalFile
} from '../../src/tools/image/background-remover/logic';

describe('AI background remover', () => {
  it('is registered with bilingual metadata and FAQs', () => {
    const tool = registry.find(item => item.slug === 'background-remover');
    expect(tool?.category).toBe('image');
    expect(tool?.name.fa).toContain('حذف پس‌زمینه');
    expect(faqs.length).toBeGreaterThanOrEqual(3);
    expect(faqs.every(item => item.q && item.a && item.qEn && item.aEn)).toBe(true);
  });

  it('enforces the 10 MB upload limit', () => {
    expect(validateBackgroundRemovalFile({ type: 'image/png', size: MAX_BACKGROUND_REMOVAL_FILE_SIZE })).toEqual({ ok: true });
    expect(validateBackgroundRemovalFile({ type: 'image/png', size: MAX_BACKGROUND_REMOVAL_FILE_SIZE + 1 })).toEqual({ ok: false, reason: 'size' });
  });

  it('rejects unsupported file types and empty files', () => {
    expect(validateBackgroundRemovalFile({ type: 'text/plain', size: 20 })).toEqual({ ok: false, reason: 'type' });
    expect(validateBackgroundRemovalFile({ type: 'image/png', size: 0 })).toEqual({ ok: false, reason: 'empty' });
  });

  it('guards against excessive decoded dimensions', () => {
    expect(isValidImageDimensions(4000, 5000)).toBe(true);
    expect(isValidImageDimensions(5000, 5000)).toBe(false);
  });
});
