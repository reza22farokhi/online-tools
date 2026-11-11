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

export const categories: CategoryMeta[] = [
  { slug: 'text', fa: 'متن', en: 'Text', icon: '📝' },
  { slug: 'code', fa: 'برنامه‌نویسی', en: 'Code', icon: '💻' },
  { slug: 'calc', fa: 'محاسبات', en: 'Calculators', icon: '🧮' },
  { slug: 'seo', fa: 'سئو', en: 'SEO', icon: '📈' },
  { slug: 'image', fa: 'تصویر', en: 'Image', icon: '🖼️' },
  { slug: 'file', fa: 'فایل', en: 'File', icon: '📁' }
];

export const registry: ToolMeta[] = [
  wordCounterMeta, caseConverterMeta, removeExtraSpacesMeta, lineSorterMeta,
  removeDuplicatesMeta, slugGeneratorMeta,
  jsonFormatterMeta, base64Meta, htmlEscapeMeta, urlEncoderMeta, uuidGeneratorMeta,
  hashGeneratorMeta, regexTesterMeta,
  percentageMeta, ageMeta, dateDiffMeta, unitConverterMeta,
  metaTagMeta, serpPreviewMeta, robotsTxtMeta, ogPreviewMeta,
  imageResizerMeta, imageCompressorMeta, formatConverterMeta, colorPickerMeta
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
