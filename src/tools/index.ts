import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
import WordCounterTool from './text/word-counter/Tool.astro';
import CaseConverterTool from './text/case-converter/Tool.astro';
import RemoveExtraSpacesTool from './text/remove-extra-spaces/Tool.astro';
import LineSorterTool from './text/line-sorter/Tool.astro';
import RemoveDuplicatesTool from './text/remove-duplicates/Tool.astro';
import SlugGeneratorTool from './text/slug-generator/Tool.astro';
import JsonFormatterTool from './code/json-formatter/Tool.astro';
import Base64Tool from './code/base64/Tool.astro';
import HtmlEscapeTool from './code/html-escape/Tool.astro';
import UrlEncoderTool from './code/url-encoder/Tool.astro';
import UuidGeneratorTool from './code/uuid-generator/Tool.astro';
import PercentageTool from './calc/percentage/Tool.astro';
import AgeTool from './calc/age/Tool.astro';
import DateDiffTool from './calc/date-diff/Tool.astro';
import UnitConverterTool from './calc/unit-converter/Tool.astro';

export const toolComponents: Record<string, AstroComponentFactory> = {
  'word-counter': WordCounterTool,
  'case-converter': CaseConverterTool,
  'remove-extra-spaces': RemoveExtraSpacesTool,
  'line-sorter': LineSorterTool,
  'remove-duplicates': RemoveDuplicatesTool,
  'slug-generator': SlugGeneratorTool,
  'json-formatter': JsonFormatterTool,
  'base64': Base64Tool,
  'html-escape': HtmlEscapeTool,
  'url-encoder': UrlEncoderTool,
  'uuid-generator': UuidGeneratorTool,
  'percentage': PercentageTool,
  'age': AgeTool,
  'date-diff': DateDiffTool,
  'unit-converter': UnitConverterTool
};

export function getToolComponent(slug: string): AstroComponentFactory | null {
  return toolComponents[slug] ?? null;
}
