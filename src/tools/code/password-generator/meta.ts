import type { ToolMeta } from '../../types';

export const meta: ToolMeta = {
  slug: 'password-generator',
  category: 'code',
  name: { fa: 'تولیدکننده رمز عبور قوی', en: 'Strong Password Generator' },
  description: {
    fa: 'رمزهای عبور تصادفی و فوق‌العاده امن با استفاده از الگوریتم‌های رمزنگاری مرورگر تولید کنید.',
    en: 'Generate highly secure, random passwords using browser cryptography.'
  },
  keywords: ['password generator', 'strong password', 'secure password', 'تولید رمز', 'پسورد قوی'],
  addedAt: '2026-11-13',
  related: ['hash-generator', 'uuid-generator']
};
