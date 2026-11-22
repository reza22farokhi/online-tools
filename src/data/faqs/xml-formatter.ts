import type { ToolFaqItem } from './types';

export const faqs: ToolFaqItem[] = [
  { q: 'این ابزار چه عملیاتی روی XML انجام می‌دهد؟', a: 'می‌توانید XML را با تورفتگی خواناتر کنید، نسخه فشرده بسازید یا خوش‌ساخت بودن تگ‌ها و ساختار آن را بررسی کنید.', qEn: 'What can this XML tool do?', aEn: 'Format XML with indentation, minify its markup, or validate that its tags and document structure are well-formed.' },
  { q: 'آیا فایل XML من به سرور ارسال می‌شود؟', a: 'خیر. پردازش با APIهای داخلی مرورگر انجام می‌شود و محتوای XML از دستگاه شما خارج نمی‌شود.', qEn: 'Is my XML uploaded to a server?', aEn: 'No. Processing uses native browser APIs and your XML content stays on your device.' },
  { q: 'چرا DOCTYPE پشتیبانی نمی‌شود؟', a: 'برای کاهش سطح خطر پردازش موجودیت‌ها و جلوگیری از رفتارهای ناخواسته، این ابزار ورودی‌های دارای DOCTYPE را رد می‌کند.', qEn: 'Why are DOCTYPE declarations rejected?', aEn: 'DOCTYPE declarations are rejected to reduce entity-processing risks and keep parsing behavior predictable.' },
  { q: 'حداکثر اندازه ورودی چقدر است؟', a: 'حداکثر طول ورودی ۱۰۰ هزار کاراکتر است. برای سندهای بزرگ‌تر از ویرایشگر محلی استفاده کنید.', qEn: 'What is the input size limit?', aEn: 'The input limit is 100,000 characters. Use a local desktop editor for larger documents.' }
];
