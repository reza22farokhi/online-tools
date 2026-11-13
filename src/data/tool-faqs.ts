import type { ToolFaqItem } from './faqs/types';
export type { ToolFaqItem };

import { faqs as word_counter } from './faqs/word-counter';
import { faqs as case_converter } from './faqs/case-converter';
import { faqs as remove_extra_spaces } from './faqs/remove-extra-spaces';
import { faqs as line_sorter } from './faqs/line-sorter';
import { faqs as remove_duplicates } from './faqs/remove-duplicates';
import { faqs as slug_generator } from './faqs/slug-generator';
import { faqs as json_formatter } from './faqs/json-formatter';
import { faqs as base64 } from './faqs/base64';
import { faqs as html_escape } from './faqs/html-escape';
import { faqs as url_encoder } from './faqs/url-encoder';
import { faqs as uuid_generator } from './faqs/uuid-generator';
import { faqs as hash_generator } from './faqs/hash-generator';
import { faqs as regex_tester } from './faqs/regex-tester';
import { faqs as jwt_decoder } from './faqs/jwt-decoder';
import { faqs as percentage } from './faqs/percentage';
import { faqs as age } from './faqs/age';
import { faqs as date_diff } from './faqs/date-diff';
import { faqs as unit_converter } from './faqs/unit-converter';
import { faqs as meta_tag_generator } from './faqs/meta-tag-generator';
import { faqs as serp_preview } from './faqs/serp-preview';
import { faqs as robots_txt_generator } from './faqs/robots-txt-generator';
import { faqs as og_preview } from './faqs/og-preview';
import { faqs as image_resizer } from './faqs/image-resizer';
import { faqs as image_compressor } from './faqs/image-compressor';
import { faqs as format_converter } from './faqs/format-converter';
import { faqs as color_picker } from './faqs/color-picker';
import { faqs as palette_generator } from './faqs/palette-generator';
import { faqs as gradient_generator } from './faqs/gradient-generator';
import { faqs as contrast_checker } from './faqs/contrast-checker';
import { faqs as box_shadow } from './faqs/box-shadow';
import { faqs as multi_calendar_converter } from './faqs/multi-calendar-converter';
import { faqs as unix_timestamp } from './faqs/unix-timestamp';
import { faqs as date_calculator } from './faqs/date-calculator';
import { faqs as date_info } from './faqs/date-info';
import { faqs as file_info } from './faqs/file-info';
import { faqs as file_to_base64 } from './faqs/file-to-base64';
import { faqs as csv_json_converter } from './faqs/csv-json-converter';
import { faqs as qr_code_generator } from './faqs/qr-code-generator';
import { faqs as password_generator } from './faqs/password-generator';
import { faqs as date_converter } from './faqs/date-converter';

import { faqs as persian_text_refiner } from './faqs/persian-text-refiner';

export const TOOL_FAQS: Record<string, ToolFaqItem[]> = {
  'word-counter': word_counter,
  'case-converter': case_converter,
  'remove-extra-spaces': remove_extra_spaces,
  'line-sorter': line_sorter,
  'remove-duplicates': remove_duplicates,
  'slug-generator': slug_generator,
  'json-formatter': json_formatter,
  'base64': base64,
  'html-escape': html_escape,
  'url-encoder': url_encoder,
  'uuid-generator': uuid_generator,
  'hash-generator': hash_generator,
  'regex-tester': regex_tester,
  'jwt-decoder': jwt_decoder,
  'percentage': percentage,
  'age': age,
  'date-diff': date_diff,
  'unit-converter': unit_converter,
  'meta-tag-generator': meta_tag_generator,
  'serp-preview': serp_preview,
  'robots-txt-generator': robots_txt_generator,
  'og-preview': og_preview,
  'image-resizer': image_resizer,
  'image-compressor': image_compressor,
  'format-converter': format_converter,
  'color-picker': color_picker,
  'palette-generator': palette_generator,
  'gradient-generator': gradient_generator,
  'contrast-checker': contrast_checker,
  'box-shadow': box_shadow,
  'multi-calendar-converter': multi_calendar_converter,
  'unix-timestamp': unix_timestamp,
  'date-calculator': date_calculator,
  'date-info': date_info,
  'file-info': file_info,
  'file-to-base64': file_to_base64,
  'csv-json-converter': csv_json_converter,
  'qr-code-generator': qr_code_generator,
  'password-generator': password_generator,
  'date-converter': date_converter,
  'persian-text-refiner': persian_text_refiner,
};

export function getFaqsFor(slug: string): ToolFaqItem[] {
  return TOOL_FAQS[slug] ?? [];
}
