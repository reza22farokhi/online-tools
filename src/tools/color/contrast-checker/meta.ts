import type { ToolMeta } from '../../types';

export const meta: ToolMeta = {
  slug: 'contrast-checker',
  category: 'color',
  name: { fa: 'بررسی کنتراست رنگ (WCAG)', en: 'Color Contrast Checker' },
  description: { fa: "نسبت کنتراست رنگ متن و پس‌زمینه را محاسبه کنید و انطباق را با معیارهای WCAG AA و AAA برای متن عادی و بزرگ بررسی کنید تا رابطی دسترس‌پذیر بسازید.", en: "Measure text and background color contrast, check WCAG AA and AAA thresholds for normal and large text, and adjust colors for accessible interfaces." },
  keywords: ['contrast checker', 'wcag', 'accessibility', 'کنتراست رنگ', 'دسترسی پذیری', 'wcag aa'],
  addedAt: '2026-11-11',
  related: ['palette-generator', 'gradient-generator']
};
