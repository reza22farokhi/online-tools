export { validateFileSize, formatBytes } from '../../../lib/file-validation';

export const MAX_IMAGE_SIZE = 20 * 1024 * 1024;
export const MAX_IMAGE_SIZE_LABEL = '۲۰ مگابایت';

export type ImageFormat = 'image/jpeg' | 'image/png' | 'image/webp';

export function getFileExtension(mime: ImageFormat): string {
  if (mime === 'image/jpeg') return 'jpg';
  if (mime === 'image/png') return 'png';
  if (mime === 'image/webp') return 'webp';
  return 'img';
}
