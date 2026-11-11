import type { ToolMeta } from '../../types';

export const meta: ToolMeta = {
  slug: 'color-picker',
  category: 'image',
  name: { fa: 'انتخاب رنگ از تصویر', en: 'Color Picker from Image' },
  description: {
    fa: 'روی هر نقطه از تصویر کلیک کنید تا کد رنگ (HEX و RGB) آن را کپی کنید. ابزاری ضروری برای طراحان.',
    en: 'Click anywhere on an image to extract and copy its color code (HEX and RGB). Essential for designers.'
  },
  keywords: ['color picker', 'eyedropper', 'image color picker', 'انتخاب رنگ از عکس', 'کد رنگ'],
  addedAt: '2026-11-11',
  related: ['image-resizer', 'format-converter']
};
