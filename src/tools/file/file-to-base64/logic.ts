export { validateFileSize, formatBytes } from '../../../lib/file-validation';

export const MAX_FILE_TO_BASE64_SIZE = 10 * 1024 * 1024;
export const MAX_FILE_TO_BASE64_SIZE_LABEL = '۱۰ مگابایت';

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
