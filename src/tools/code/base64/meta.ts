import type { ToolMeta } from '../../types';

export const meta: ToolMeta = {
  slug: 'base64',
  category: 'code',
  name: { fa: 'رمزگذاری و رمزگشایی Base64', en: 'Base64 Encoder / Decoder' },
  description: {
    fa: 'متن را به Base64 تبدیل کنید یا Base64 را رمزگشایی کنید. با پشتیبانی UTF-8، حالت URL-safe و پردازش محلی.',
    en: 'Encode text to Base64 or decode Base64. UTF-8, URL-safe mode, all in-browser.'
  },
  keywords: ['base64', 'encode', 'decode', 'base64 encode', 'base64 decode', 'رمزگذاری base64', 'رمزگشایی base64'],
  addedAt: '2026-11-11',
  related: ['url-encoder', 'html-escape', 'json-formatter']
};
