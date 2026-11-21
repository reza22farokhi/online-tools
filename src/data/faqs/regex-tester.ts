import type { ToolFaqItem } from './types';

export const faqs: ToolFaqItem[] = [
    { q: 'چرا از Web Worker استفاده می‌شود؟', a: 'برای جلوگیری از قفل شدن صفحه در صورت اجرای الگوهای پیچیده (ReDoS). Worker جدا از thread اصلی اجرا می‌شود.', qEn: 'Why does the regex tester use a Web Worker?', aEn: 'Regular expressions run in a separate Web Worker so expensive patterns are less likely to block the page’s main thread.' },
    { q: 'ReDoS چیست و چگونه جلوگیری می‌شود؟', a: 'ReDoS حمله‌ای با الگوهای بدخیم است. این ابزار timeout ۲ ثانیه دارد و در صورت تجاوز، Worker را متوقف می‌کند.', qEn: 'What is ReDoS and how is it mitigated?', aEn: 'Regular expression denial of service (ReDoS) occurs when a pattern causes excessive backtracking. This tester applies a two-second execution timeout and terminates the worker if the limit is exceeded.' },
    { q: 'چه flagهایی پشتیبانی می‌شوند؟', a: 'همه flagهای استاندارد جاوااسکریپت: g، i، m، s، u و y.', qEn: 'Which JavaScript regular-expression flags are supported?', aEn: 'The tester supports the standard JavaScript flags used by the interface, including global (g), ignore case (i), multiline (m), dotAll (s), Unicode (u), and sticky (y).' },
];
