import type { ToolFaqItem } from './types';

export const faqs: ToolFaqItem[] = [
    { q: 'WCAG چیست؟', a: 'استاندارد دسترسی‌پذیری وب. سطح AA حداقل ۴.۵:۱ و سطح AAA حداقل ۷:۱ نسبت کنتراست را توصیه می‌کند.', qEn: 'What is WCAG?', aEn: 'The Web Content Accessibility Guidelines (WCAG) define recommendations for accessible web content. For normal text, WCAG AA requires a contrast ratio of at least 4.5:1; AAA requires at least 7:1.' },
    { q: 'نسبت کنتراست چگونه محاسبه می‌شود؟', a: 'بر اساس فرمول رسمی WCAG با relative luminance. نسبت (L1+0.05)/(L2+0.05) که L1 رنگ روشن‌تر است.', qEn: 'How is the contrast ratio calculated?', aEn: 'The ratio uses the WCAG relative-luminance formula: (L1 + 0.05) / (L2 + 0.05), where L1 is the lighter color luminance and L2 is the darker one.' },
    { q: 'حداقل کنتراست برای متن معمولی چقدر است؟', a: 'برای متن معمولی (کمتر از ۱۸px): حداقل ۴.۵:۱ (AA). برای متن بزرگ (≥ ۱۸px یا ≥ ۱۴px bold): حداقل ۳:۱.', qEn: 'What contrast ratio does normal text need?', aEn: 'Normal-sized text needs a contrast ratio of at least 4.5:1 for WCAG AA. Large text needs at least 3:1; large text is generally 24 CSS pixels or 18.66 CSS pixels when bold.' },
];
