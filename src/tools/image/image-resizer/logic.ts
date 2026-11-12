export { validateFileSize, formatBytes } from '../../../lib/file-validation';

export const MAX_IMAGE_SIZE = 20 * 1024 * 1024;
export const MAX_IMAGE_SIZE_LABEL = '۲۰ مگابایت';

export function calculateDimensions(oW: number, oH: number, tW: number, tH: number, maintain: boolean) {
  if (!oW || !oH) return { width: 0, height: 0 };
  if (maintain) {
    const ratio = Math.min(tW / oW, tH / oH);
    return { width: Math.round(oW * ratio), height: Math.round(oH * ratio) };
  }
  return { width: tW, height: tH };
}
