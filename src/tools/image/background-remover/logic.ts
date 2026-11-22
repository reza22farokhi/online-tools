export const MAX_BACKGROUND_REMOVAL_FILE_SIZE = 10 * 1024 * 1024;
export const MAX_BACKGROUND_REMOVAL_PIXELS = 20_000_000;
export const SUPPORTED_BACKGROUND_REMOVAL_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'] as const;

export type FileValidation = { ok: true } | { ok: false; reason: 'type' | 'size' | 'empty' };

export function validateBackgroundRemovalFile(file: Pick<File, 'type' | 'size'>): FileValidation {
  if (file.size <= 0) return { ok: false, reason: 'empty' };
  if (!SUPPORTED_BACKGROUND_REMOVAL_TYPES.includes(file.type as typeof SUPPORTED_BACKGROUND_REMOVAL_TYPES[number])) {
    return { ok: false, reason: 'type' };
  }
  if (file.size > MAX_BACKGROUND_REMOVAL_FILE_SIZE) return { ok: false, reason: 'size' };
  return { ok: true };
}

export function isValidImageDimensions(width: number, height: number): boolean {
  return Number.isSafeInteger(width) && Number.isSafeInteger(height)
    && width > 0 && height > 0
    && width * height <= MAX_BACKGROUND_REMOVAL_PIXELS;
}
