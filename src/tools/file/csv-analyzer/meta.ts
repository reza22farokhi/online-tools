import type { ToolMeta } from '../../types';

export const meta: ToolMeta = {
  slug: 'csv-analyzer',
  category: 'file',
  name: { fa: 'تحلیل‌گر فایل CSV', en: 'CSV Data Analyzer' },
  seoTitle: { fa: 'تحلیل آنلاین CSV؛ آمار، داده‌های خالی و تکراری', en: 'Free CSV Analyzer – Statistics, Missing and Duplicate Data' },
  description: {
    fa: 'فایل CSV را تحلیل کنید؛ ردیف‌ها، ستون‌ها، سلول‌های خالی، داده‌های تکراری و مقادیر یکتا را بشمارید، آمار عددی بگیرید و داده‌ها را فیلتر و مرتب کنید.',
    en: 'Analyze CSV locally: count rows, columns, empty cells and duplicates, inspect unique values and numeric statistics, then filter, sort and export.'
  },
  keywords: ['csv analyzer', 'csv statistics', 'analyze csv online', 'تحلیل csv', 'آمار فایل csv', 'پاکسازی داده'],
  popular: true,
  addedAt: '2026-11-22',
  related: ['csv-json-converter', 'file-info', 'json-formatter']
};
