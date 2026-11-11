import type { ToolMeta } from '../../types';

export const meta: ToolMeta = {
  slug: 'contrast-checker',
  category: 'color',
  name: { fa: 'بررسی کنتراست رنگ (WCAG)', en: 'Color Contrast Checker' },
  description: {
    fa: 'کنتراست بین رنگ متن و پس‌زمینه را بر اساس استانداردهای WCAG AA و AAA بررسی کنید.',
    en: 'Check contrast between text and background colors against WCAG AA and AAA standards.'
  },
  keywords: ['contrast checker', 'wcag', 'accessibility', 'کنتراست رنگ', 'دسترسی پذیری', 'wcag aa'],
  addedAt: '2026-11-11',
  related: ['palette-generator', 'gradient-generator']
};
