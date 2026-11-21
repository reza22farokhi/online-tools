import type { ToolMeta } from '../../types';

export const meta: ToolMeta = {
  slug: 'json-formatter',
  category: 'code',
  name: {
    fa: 'فرمت‌بندی، کوچک‌سازی و اعتبارسنجی JSON',
    en: 'JSON Formatter / Minifier / Validator'
  },
  description: { fa: "کد JSON را قالب‌بندی و خواناتر کنید، حجم آن را کوچک کنید و خطاهای نحوی را با پیام دقیق پیدا کنید؛ همه پردازش‌ها در مرورگر انجام می‌شود.", en: "Format JSON for readability, minify it for compact transfer, and validate syntax with clear error locations; all processing runs in your browser." },
  keywords: [
    'json formatter',
    'json beautifier',
    'json minify',
    'json validate',
    'json lint',
    'فرمت json',
    'اعتبارسنجی json',
    'کوچک کردن json'
  ],
  popular: true,
  addedAt: '2026-11-11',
  related: ['base64', 'html-escape']
};
