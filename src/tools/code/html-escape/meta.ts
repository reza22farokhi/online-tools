import type { ToolMeta } from '../../types';

export const meta: ToolMeta = {
  slug: 'html-escape',
  category: 'code',
  name: { fa: 'تبدیل و بازگردانی HTML Escape', en: 'HTML Escape / Unescape' },
  description: { fa: "کاراکترهای ویژه مانند علامت‌های < و > و کوتیشن را به HTML entities تبدیل کنید یا entityها را به متن اصلی برگردانید؛ مناسب توسعه وب.", en: "Escape special HTML characters into entities or decode existing entities back to readable text, helping prepare safe snippets for web development." },
  keywords: ['html escape', 'html unescape', 'html entity', 'escape html', 'html encode', 'تبدیل html'],
  addedAt: '2026-11-11',
  related: ['base64', 'url-encoder', 'json-formatter']
};
