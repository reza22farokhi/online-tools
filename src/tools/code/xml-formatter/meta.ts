import type { ToolMeta } from '../../types';

export const meta: ToolMeta = {
  slug: 'xml-formatter',
  category: 'code',
  name: { fa: 'قالب‌بندی و اعتبارسنجی XML', en: 'XML Formatter & Validator' },
  description: {
    fa: 'کد XML را مرتب یا فشرده کنید و ساختار و تگ‌ها را اعتبارسنجی کنید؛ پردازش در مرورگر انجام می‌شود و داده‌ای آپلود نمی‌شود.',
    en: 'Format or minify XML and validate its structure and tags locally in your browser. Your XML is never uploaded or stored remotely.'
  },
  keywords: ['xml formatter', 'xml beautifier', 'xml validator', 'xml minifier', 'format xml', 'اعتبارسنجی xml', 'فرمت xml', 'مرتب سازی xml'],
  addedAt: '2026-11-22',
  related: ['json-formatter', 'html-escape']
};
