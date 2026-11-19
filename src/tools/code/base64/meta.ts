import type { ToolMeta } from '../../types';

export const meta: ToolMeta = {
  slug: 'base64',
  category: 'code',
  name: { fa: 'رمزگذاری و رمزگشایی Base64', en: 'Base64 Encoder / Decoder' },
  description: { fa: "متن فارسی و انگلیسی را به Base64 تبدیل کنید یا خروجی را رمزگشایی کنید؛ پشتیبانی UTF-8 و حالت URL-safe با پردازش کامل در مرورگر.", en: "Encode Persian or English text as Base64, or decode an existing value with UTF-8 and URL-safe support; conversion runs locally in your browser." },
  keywords: ['base64', 'encode', 'decode', 'base64 encode', 'base64 decode', 'رمزگذاری base64', 'رمزگشایی base64'],
  addedAt: '2026-11-11',
  related: ['url-encoder', 'html-escape', 'json-formatter']
};
