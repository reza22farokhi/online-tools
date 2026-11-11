import type { ToolMeta } from '../../types';

export const meta: ToolMeta = {
  slug: 'jwt-decoder',
  category: 'code',
  name: { fa: 'رمزگشای JWT', en: 'JWT Decoder' },
  description: {
    fa: 'توکن‌های JWT را رمزگشایی کنید و Header، Payload و وضعیت انقضا را با نمایش خوانا و هشدارهای امنیتی ببینید.',
    en: 'Decode JWT tokens. View Header, Payload, expiry status, and human-readable timestamps.'
  },
  keywords: ['jwt decoder', 'json web token', 'jwt decode', 'jwt viewer', 'رمزگشای jwt', 'توکن jwt', 'jwt آنلاین'],
  popular: true,
  addedAt: '2026-11-11',
  related: ['base64', 'json-formatter', 'hash-generator']
};
