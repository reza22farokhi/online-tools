import type { ToolMeta } from '../../types';

export const meta: ToolMeta = {
  slug: 'csv-analyzer',
  category: 'file',
  name: { fa: 'تحلیل‌گر فایل CSV', en: 'CSV Data Analyzer' },
  seoTitle: { fa: 'تحلیل آنلاین CSV؛ آمار، داده‌های خالی و تکراری', en: 'Free CSV Analyzer – Statistics, Missing and Duplicate Data' },
  description: {
    fa: 'داده‌های CSV را تحلیل کنید؛ تعداد ردیف و ستون، سلول‌های خالی، ردیف‌های تکراری، مقادیر یکتا و آمار عددی را ببینید و داده‌ها را فیلتر، مرتب و خروجی‌گیری کنید.',
    en: 'Analyze CSV files in your browser with row and column counts, missing cells, duplicate rows, unique values, numeric summaries, filtering, sorting, and safe CSV export.'
  },
  keywords: ['csv analyzer', 'csv statistics', 'analyze csv online', 'تحلیل csv', 'آمار فایل csv', 'پاکسازی داده'],
  popular: true,
  addedAt: '2026-11-22',
  related: ['csv-json-converter', 'file-info', 'json-formatter']
};
