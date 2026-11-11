import type { ToolMeta } from '../../types';

export const meta: ToolMeta = {
  slug: 'hash-generator',
  category: 'code',
  name: { fa: 'تولید هش (Hash)', en: 'Hash Generator' },
  description: {
    fa: 'هش SHA-1، SHA-256، SHA-384 یا SHA-512 متن را با Web Crypto API محاسبه کنید. همه‌چیز محلی و امن.',
    en: 'Compute SHA-1, SHA-256, SHA-384, or SHA-512 hashes using Web Crypto. All local and secure.'
  },
  keywords: ['hash', 'sha256', 'sha512', 'sha1', 'checksum', 'هش', 'تولید هش', 'چک‌سام'],
  addedAt: '2026-11-11',
  related: ['base64', 'uuid-generator', 'json-formatter']
};
