import type { ToolMeta } from '../../types';

export const meta: ToolMeta = {
  slug: 'file-info',
  category: 'file',
  name: { fa: 'مشاهده اطلاعات فایل و هش', en: 'File Info & Hash' },
  description: { fa: "مشخصات فایل مانند نام، نوع، پسوند و اندازه را ببینید و هش SHA-256 را برای بررسی یکپارچگی و اصالت فایل در همان مرورگر محاسبه کنید.", en: "Inspect a file's name, MIME type, extension, and size, then calculate its SHA-256 digest locally to verify file integrity and compare checksums." },
  keywords: ['file info', 'file hash', 'sha256 file', 'اطلاعات فایل', 'هش فایل', 'حجم فایل'],
  popular: true,
  addedAt: '2026-11-11',
  related: ['file-to-base64', 'hash-generator']
};
