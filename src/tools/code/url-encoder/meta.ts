import type { ToolMeta } from '../../types';

export const meta: ToolMeta = {
  slug: 'url-encoder',
  category: 'code',
  name: { fa: 'رمزگذاری و رمزگشایی URL', en: 'URL Encoder / Decoder' },
  description: {
    fa: 'متن را برای استفاده در URL رمزگذاری یا رمزگشایی کنید. با حالت‌های encodeURIComponent و encodeURI.',
    en: 'Encode or decode text for URLs. Both encodeURIComponent and encodeURI modes.'
  },
  keywords: ['url encode', 'url decode', 'percent encoding', 'encodeURIComponent', 'رمزگذاری url'],
  addedAt: '2026-11-11',
  related: ['base64', 'html-escape']
};
