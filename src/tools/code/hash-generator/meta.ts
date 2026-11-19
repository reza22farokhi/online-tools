import type { ToolMeta } from '../../types';

export const meta: ToolMeta = {
  slug: 'hash-generator',
  category: 'code',
  name: { fa: 'تولید هش (Hash)', en: 'Hash Generator' },
  seoTitle: { fa: "تولید هش SHA-256 و SHA-512 | ابزارهای آنلاین", en: "Secure Text Hash Generator | Online Tools" },

  description: { fa: "برای متن ورودی هش SHA-1، SHA-256، SHA-384 یا SHA-512 بسازید، خروجی‌ها را مقایسه کنید و محاسبه را با Web Crypto در مرورگر انجام دهید.", en: "Generate SHA-1, SHA-256, SHA-384, or SHA-512 hashes from text, compare digest formats, and calculate results locally with the browser Web Crypto API." },
  keywords: ['hash', 'sha256', 'sha512', 'sha1', 'checksum', 'هش', 'تولید هش', 'چک‌سام'],
  addedAt: '2026-11-11',
  related: ['base64', 'uuid-generator', 'json-formatter']
};
