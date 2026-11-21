import type { ToolFaqItem } from './types';

export const faqs: ToolFaqItem[] = [
    { q: 'چه حالت‌های تبدیل پشتیبانی می‌شوند؟', a: 'حروف کوچک، بزرگ، عنوان، جمله، camelCase، PascalCase، snake_case، kebab-case و یک‌درمیان.', qEn: 'Which text case formats are supported?', aEn: 'The converter supports lowercase, uppercase, title case, sentence case, camelCase, PascalCase, snake_case, kebab-case, and alternating case.' },
    { q: 'آیا حروف فارسی هم تبدیل می‌شوند؟', a: 'تبدیل به حروف کوچک/بزرگ روی حروف لاتین اثر دارد. برای فارسی، حالت‌های camelCase و PascalCase بر اساس جداکننده‌ها عمل می‌کنند.', qEn: 'Does case conversion work with Persian text?', aEn: 'Uppercase and lowercase transformations apply to letters that have case, such as Latin characters. Naming formats such as camelCase and PascalCase use word boundaries and separators; Persian letters do not have uppercase or lowercase forms.' },
    { q: 'حداکثر طول متن چقدر است؟', a: 'حداکثر ۱۰۰ هزار کاراکتر. برای متن‌های طولانی‌تر، ورودی بریده می‌شود.', qEn: 'What is the maximum input length?', aEn: 'The tool accepts up to 100,000 characters. Longer input is truncated to the supported limit.' },
];
