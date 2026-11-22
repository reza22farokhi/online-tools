import type { ToolFaqItem } from './types';

export const faqs: ToolFaqItem[] = [
  { q: 'تحلیل‌گر CSV چه آماری ارائه می‌دهد؟', a: 'تعداد ردیف و ستون، سلول‌های خالی، ردیف‌های تکراری، تعداد مقادیر یکتا و برای ستون‌های کاملاً عددی حداقل، حداکثر، میانگین و میانه را محاسبه می‌کند.', qEn: 'What statistics does the CSV analyzer provide?', aEn: 'It reports row and column counts, empty cells, duplicate rows, unique values, and minimum, maximum, mean, and median for numeric columns.' },
  { q: 'آیا می‌توان داده‌ها را فیلتر و مرتب کرد؟', a: 'بله. می‌توانید یک ستون را انتخاب کنید، بر اساس عبارت دلخواه فیلتر کنید و داده‌ها را صعودی یا نزولی مرتب کنید.', qEn: 'Can I filter and sort the data?', aEn: 'Yes. Select a column, filter by a text query, and sort the resulting rows in ascending or descending order.' },
  { q: 'آیا فایل من به سرور ارسال می‌شود؟', a: 'خیر. تحلیل در مرورگر انجام می‌شود و فایل یا داده‌های شما آپلود نمی‌شوند.', qEn: 'Is my file uploaded to a server?', aEn: 'No. Analysis runs locally in your browser; your file and data are not uploaded.' },
  { q: 'چگونه از CSV خروجی بگیرم؟', a: 'پس از فیلتر یا مرتب‌سازی، دکمه دریافت CSV را بزنید. سلول‌هایی که ممکن است به‌عنوان فرمول صفحه‌گسترده اجرا شوند با پیشوند امن‌سازی می‌شوند.', qEn: 'How do I export the processed CSV?', aEn: 'After filtering or sorting, use Export CSV. Cells that could be interpreted as spreadsheet formulas are prefixed for safety.' }
];
