export interface FileSizeValidation {
  ok: boolean;
  error?: string;
}

export function validateFileSize(
  size: number,
  maxBytes: number,
  maxLabel: string
): FileSizeValidation {
  if (!Number.isFinite(size) || size < 0) {
    return { ok: false, error: 'اندازه فایل نامعتبر است.' };
  }
  if (size === 0) {
    return { ok: false, error: 'فایل خالی است و قابل پردازش نیست.' };
  }
  if (size > maxBytes) {
    const mb = (size / (1024 * 1024)).toFixed(1);
    return {
      ok: false,
      error: `حجم فایل (${mb} مگابایت) بیشتر از حد مجاز ${maxLabel} است. لطفاً فایل کوچک‌تری انتخاب کنید.`
    };
  }
  return { ok: true };
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
