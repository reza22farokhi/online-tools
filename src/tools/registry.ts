import { meta as dateConverterMeta } from './date/date-converter/meta';
import { meta as passwordGeneratorMeta } from './code/password-generator/meta';
import { meta as qrCodeMeta } from './image/qr-code-generator/meta';
import type { ToolMeta, ToolCategory, CategoryMeta } from './types';
import { meta as wordCounterMeta } from './text/word-counter/meta';
import { meta as caseConverterMeta } from './text/case-converter/meta';
import { meta as removeExtraSpacesMeta } from './text/remove-extra-spaces/meta';
import { meta as lineSorterMeta } from './text/line-sorter/meta';
import { meta as removeDuplicatesMeta } from './text/remove-duplicates/meta';
import { meta as slugGeneratorMeta } from './text/slug-generator/meta';
import { meta as jsonFormatterMeta } from './code/json-formatter/meta';
import { meta as base64Meta } from './code/base64/meta';
import { meta as htmlEscapeMeta } from './code/html-escape/meta';
import { meta as urlEncoderMeta } from './code/url-encoder/meta';
import { meta as uuidGeneratorMeta } from './code/uuid-generator/meta';
import { meta as hashGeneratorMeta } from './code/hash-generator/meta';
import { meta as regexTesterMeta } from './code/regex-tester/meta';
import { meta as jwtDecoderMeta } from './code/jwt-decoder/meta';
import { meta as percentageMeta } from './calc/percentage/meta';
import { meta as ageMeta } from './calc/age/meta';
import { meta as dateDiffMeta } from './calc/date-diff/meta';
import { meta as unitConverterMeta } from './calc/unit-converter/meta';
import { meta as metaTagMeta } from './seo/meta-tag-generator/meta';
import { meta as serpPreviewMeta } from './seo/serp-preview/meta';
import { meta as robotsTxtMeta } from './seo/robots-txt-generator/meta';
import { meta as ogPreviewMeta } from './seo/og-preview/meta';
import { meta as imageResizerMeta } from './image/image-resizer/meta';
import { meta as imageCompressorMeta } from './image/image-compressor/meta';
import { meta as formatConverterMeta } from './image/format-converter/meta';
import { meta as colorPickerMeta } from './image/color-picker/meta';
import { meta as fileInfoMeta } from './file/file-info/meta';
import { meta as fileToBase64Meta } from './file/file-to-base64/meta';
import { meta as paletteGeneratorMeta } from './color/palette-generator/meta';
import { meta as gradientGeneratorMeta } from './color/gradient-generator/meta';
import { meta as contrastCheckerMeta } from './color/contrast-checker/meta';
import { meta as boxShadowMeta } from './color/box-shadow/meta';
import { meta as multiCalendarMeta } from './date/multi-calendar-converter/meta';
import { meta as unixTimestampMeta } from './date/unix-timestamp/meta';
import { meta as dateCalculatorMeta } from './date/date-calculator/meta';
import { meta as dateInfoMeta } from './date/date-info/meta';
import { meta as csvJsonMeta } from './file/csv-json-converter/meta';

export const categories: CategoryMeta[] = [
  { slug: 'text', fa: 'متن', en: 'Text', icon: '📝' },
  { slug: 'code', fa: 'برنامه‌نویسی', en: 'Code', icon: '💻' },
  { slug: 'calc', fa: 'محاسبات', en: 'Calculators', icon: '🧮' },
  { slug: 'seo', fa: 'سئو', en: 'SEO', icon: '📈' },
  { slug: 'image', fa: 'تصویر', en: 'Image', icon: '🖼️' },
  { slug: 'color', fa: 'رنگ و طراحی', en: 'Color & Design', icon: '🎨' },
  { slug: 'date', fa: 'تاریخ و زمان', en: 'Date & Time', icon: '📅' },
  { slug: 'file', fa: 'فایل', en: 'File', icon: '📁' }
];

export const registry: ToolMeta[] = [
  dateConverterMeta,
  passwordGeneratorMeta,
  qrCodeMeta,
  wordCounterMeta, caseConverterMeta, removeExtraSpacesMeta, lineSorterMeta,
  removeDuplicatesMeta, slugGeneratorMeta,
  jsonFormatterMeta, base64Meta, htmlEscapeMeta, urlEncoderMeta, uuidGeneratorMeta,
  hashGeneratorMeta, regexTesterMeta, jwtDecoderMeta,
  percentageMeta, ageMeta, dateDiffMeta, unitConverterMeta,
  metaTagMeta, serpPreviewMeta, robotsTxtMeta, ogPreviewMeta,
  imageResizerMeta, imageCompressorMeta, formatConverterMeta, colorPickerMeta,
  paletteGeneratorMeta, gradientGeneratorMeta, contrastCheckerMeta, boxShadowMeta,
  fileInfoMeta, fileToBase64Meta,
  multiCalendarMeta, unixTimestampMeta,
  dateCalculatorMeta, dateInfoMeta,
  csvJsonMeta,
  {
    slug: 'persian-text-refiner',
    name: { fa: 'پالایشگر متن فارسی', en: 'Persian Text Refiner' },
    description: { fa: 'اصلاح خودکار حروف عربی، نیم‌فاصله‌ها و علائم نگارشی', en: 'Fix Arabic characters, half-spaces, and punctuation' },
    category: 'text',
    popular: false,
    keywords: ['persian', 'text', 'refiner', 'فارسی'],
    addedAt: '2026-11-14'
  }
];

export function getToolBySlug(slug: string): ToolMeta | undefined {
  return registry.find(t => t.slug === slug);
}
export function getToolsByCategory(category: ToolCategory): ToolMeta[] {
  return registry.filter(t => t.category === category);
}
export function getPopular(): ToolMeta[] {
  return registry.filter(t => t.popular);
}
export function getCategoryMeta(slug: ToolCategory): CategoryMeta | undefined {
  return categories.find(c => c.slug === slug);
}
export function getRelated(slug: string): ToolMeta[] {
  const tool = getToolBySlug(slug);
  if (!tool?.related?.length) return [];
  return tool.related.map(getToolBySlug).filter((x): x is ToolMeta => Boolean(x));
}
export function getAllSlugs(): string[] {
  return registry.map(t => t.slug);
}
