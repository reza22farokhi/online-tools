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
import HashGeneratorTool from './code/hash-generator/Tool.astro';
import RegexTesterTool from './code/regex-tester/Tool.astro';
import JwtDecoderTool from './code/jwt-decoder/Tool.astro';
import PercentageTool from './calc/percentage/Tool.astro';
import AgeTool from './calc/age/Tool.astro';
import DateDiffTool from './calc/date-diff/Tool.astro';
import UnitConverterTool from './calc/unit-converter/Tool.astro';
import MetaTagTool from './seo/meta-tag-generator/Tool.astro';
import SerpPreviewTool from './seo/serp-preview/Tool.astro';
import RobotsTxtTool from './seo/robots-txt-generator/Tool.astro';
import OgPreviewTool from './seo/og-preview/Tool.astro';
import ImageResizerTool from './image/image-resizer/Tool.astro';
import ImageCompressorTool from './image/image-compressor/Tool.astro';
import FormatConverterTool from './image/format-converter/Tool.astro';
import ColorPickerTool from './image/color-picker/Tool.astro';
import FileInfoTool from './file/file-info/Tool.astro';
import FileToBase64Tool from './file/file-to-base64/Tool.astro';
import PaletteGeneratorTool from './color/palette-generator/Tool.astro';
import GradientGeneratorTool from './color/gradient-generator/Tool.astro';
import ContrastCheckerTool from './color/contrast-checker/Tool.astro';
import BoxShadowTool from './color/box-shadow/Tool.astro';
import MultiCalendarTool from './date/multi-calendar-converter/Tool.astro';
import UnixTimestampTool from './date/unix-timestamp/Tool.astro';
import DateCalculatorTool from './date/date-calculator/Tool.astro';
import DateInfoTool from './date/date-info/Tool.astro';
import CsvJsonTool from './file/csv-json-converter/Tool.astro';

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
  'hash-generator': HashGeneratorTool,
  'regex-tester': RegexTesterTool,
  'jwt-decoder': JwtDecoderTool,
  'percentage': PercentageTool,
  'age': AgeTool,
  'date-diff': DateDiffTool,
  'unit-converter': UnitConverterTool,
  'meta-tag-generator': MetaTagTool,
  'serp-preview': SerpPreviewTool,
  'robots-txt-generator': RobotsTxtTool,
  'og-preview': OgPreviewTool,
  'image-resizer': ImageResizerTool,
  'image-compressor': ImageCompressorTool,
  'format-converter': FormatConverterTool,
  'color-picker': ColorPickerTool,
  'file-info': FileInfoTool,
  'file-to-base64': FileToBase64Tool,
  'palette-generator': PaletteGeneratorTool,
  'gradient-generator': GradientGeneratorTool,
  'contrast-checker': ContrastCheckerTool,
  'box-shadow': BoxShadowTool,
  'multi-calendar-converter': MultiCalendarTool,
  'unix-timestamp': UnixTimestampTool,
  'date-calculator': DateCalculatorTool,
  'date-info': DateInfoTool,
  'csv-json-converter': CsvJsonTool
};

export function getToolComponent(slug: string): AstroComponentFactory | null {
  return toolComponents[slug] ?? null;
}
