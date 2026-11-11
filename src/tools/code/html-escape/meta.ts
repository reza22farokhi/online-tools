import type { ToolMeta } from '../../types';

export const meta: ToolMeta = {
  slug: 'html-escape',
  category: 'code',
  name: { fa: 'تبدیل و بازگردانی HTML Escape', en: 'HTML Escape / Unescape' },
  description: {
    fa: 'کاراکترهای خاص HTML را به entity تبدیل کنید یا entityها را به کاراکتر اصلی بازگردانید. امن و آفلاین.',
    en: 'Escape special HTML characters to entities or unescape them. Safe and offline.'
  },
  keywords: ['html escape', 'html unescape', 'html entity', 'escape html', 'html encode', 'تبدیل html'],
  addedAt: '2026-11-11',
  related: ['base64', 'url-encoder', 'json-formatter']
};
