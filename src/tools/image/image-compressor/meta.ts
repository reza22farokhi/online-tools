import type { ToolMeta } from '../../types';

export const meta: ToolMeta = {
  slug: 'image-compressor',
  category: 'image',
  name: { fa: 'فشرده‌سازی تصویر', en: 'Image Compressor' },
  description: {
    fa: 'حجم تصویر خود را بدون افت محسوس کیفیت کاهش دهید. با تنظیم دقیق کیفیت و فرمت خروجی (JPG/WebP).',
    en: 'Reduce image file size with minimal quality loss. Adjustable quality and output format (JPG/WebP).'
  },
  keywords: ['image compressor', 'compress image', 'reduce size', 'فشرده سازی تصویر', 'کاهش حجم عکس'],
  popular: true,
  addedAt: '2026-11-11',
  related: ['image-resizer']
};
