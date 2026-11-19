import type { ToolMeta } from '../../types';

export const meta: ToolMeta = {
  slug: 'jwt-decoder',
  category: 'code',
  name: { fa: 'رمزگشای JWT', en: 'JWT Decoder' },
  seoTitle: { fa: "رمزگشای JWT و بررسی توکن | ابزارهای آنلاین", en: "JWT Decoder: Inspect Token Claims | Online Tools" },

  description: { fa: "توکن JWT را بدون نیاز به کلید رمزگشایی کنید، Header و Payload را بخوانید و زمان انقضا و ادعاهای مهم را همراه با هشدارهای امنیتی بررسی کنید.", en: "Decode JWT tokens without a secret, inspect the header and payload, and review expiration plus important claims with clear security warnings." },
  keywords: ['jwt decoder', 'json web token', 'jwt decode', 'jwt viewer', 'رمزگشای jwt', 'توکن jwt', 'jwt آنلاین'],
  popular: true,
  addedAt: '2026-11-11',
  related: ['base64', 'json-formatter', 'hash-generator']
};
