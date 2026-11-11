import type { ToolMeta } from '../../types';

export const meta: ToolMeta = {
  slug: 'file-info',
  category: 'file',
  name: { fa: 'مشاهده اطلاعات فایل و هش', en: 'File Info & Hash' },
  description: {
    fa: 'اطلاعات دقیق فایل (حجم، نوع، پسوند) را ببینید و هش SHA-256 آن را برای بررسی اصالت محاسبه کنید.',
    en: 'View detailed file info (size, type, extension) and calculate its SHA-256 hash for integrity.'
  },
  keywords: ['file info', 'file hash', 'sha256 file', 'اطلاعات فایل', 'هش فایل', 'حجم فایل'],
  popular: true,
  addedAt: '2026-11-11',
  related: ['file-to-base64', 'hash-generator']
};
