import type { ToolMeta } from '../../types';

export const meta: ToolMeta = {
  slug: 'file-to-base64',
  category: 'file',
  name: { fa: 'تبدیل فایل به Base64', en: 'File to Base64' },
  description: {
    fa: 'فایل خود (مانند تصویر، PDF یا فونت) را به متن Base64 تبدیل کنید تا در کدهای HTML یا CSS استفاده کنید.',
    en: 'Convert your file (image, PDF, font) to Base64 text for use in HTML or CSS code.'
  },
  keywords: ['file to base64', 'base64 encoder file', 'تبدیل فایل به base64', 'دیتا uri'],
  addedAt: '2026-11-11',
  related: ['base64', 'file-info']
};
