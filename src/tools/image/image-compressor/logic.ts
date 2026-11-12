export { validateFileSize, formatBytes } from '../../../lib/file-validation';

export const MAX_IMAGE_SIZE = 20 * 1024 * 1024;
export const MAX_IMAGE_SIZE_LABEL = '۲۰ مگابایت';

export function calculateReduction(original: number, compressed: number): number {
  if (original === 0) return 0;
  return Math.max(0, Math.round(((original - compressed) / original) * 100));
}
