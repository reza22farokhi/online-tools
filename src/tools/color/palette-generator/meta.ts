import type { ToolMeta } from '../../types';

export const meta: ToolMeta = {
  slug: 'palette-generator',
  category: 'color',
  name: { fa: 'تولیدکننده پالت رنگ', en: 'Color Palette Generator' },
  description: {
    fa: 'از یک رنگ پایه، پالت‌های هارمونیک (مکمل، آنالوگ، سه‌گانه، چهارگانه، تک‌رنگ، Split) بسازید و کد HEX را کپی کنید.',
    en: 'Generate harmonious color palettes (complementary, analogous, triadic, tetradic, monochromatic, split) from a base color.'
  },
  keywords: ['color palette', 'color scheme', 'color harmony', 'پالت رنگ', 'ترکیب رنگ', 'هارمونی رنگ'],
  popular: true,
  addedAt: '2026-11-11',
  related: ['gradient-generator', 'contrast-checker']
};
