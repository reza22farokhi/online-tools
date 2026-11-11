export type SlugSeparator = '-' | '_';

export interface SlugOptions {
  separator: SlugSeparator;
  lowercase: boolean;
  stripDiacritics: boolean;
  transliterate: boolean;
  maxLength: number;
}

export const DEFAULT_OPTIONS: SlugOptions = {
  separator: '-',
  lowercase: true,
  stripDiacritics: true,
  transliterate: false,
  maxLength: 80
};

const PERSIAN_NORMALIZE: Record<string, string> = {
  '\u064A': '\u06CC',
  '\u0643': '\u06A9',
  '\u0629': '\u0647',
  '\u06C0': '\u0647',
  '\u0623': '\u0627',
  '\u0625': '\u0627',
  '\u0624': '\u0648',
  '\u0626': '\u06CC'
};

const PERSIAN_TO_LATIN: Record<string, string> = {
  'ا': 'a', 'آ': 'a', 'ب': 'b', 'پ': 'p', 'ت': 't', 'ث': 's',
  'ج': 'j', 'چ': 'ch', 'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'z',
  'ر': 'r', 'ز': 'z', 'ژ': 'zh', 'س': 's', 'ش': 'sh', 'ص': 's',
  'ض': 'z', 'ط': 't', 'ظ': 'z', 'ع': '', 'غ': 'gh', 'ف': 'f',
  'ق': 'gh', 'ک': 'k', 'گ': 'g', 'ل': 'l', 'م': 'm', 'ن': 'n',
  'و': 'v', 'ه': 'h', 'ی': 'y'
};

export function generateSlug(input: string, opts: SlugOptions): string {
  if (input.trim() === '') return '';

  let s = input.trim();
  s = s.replace(/\u200C/g, '');
  s = s.split('').map(ch => PERSIAN_NORMALIZE[ch] ?? ch).join('');

  if (opts.transliterate) {
    s = s.split('').map(ch => PERSIAN_TO_LATIN[ch] ?? ch).join('');
  }

  if (opts.stripDiacritics) {
    s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  if (opts.lowercase) s = s.toLowerCase();

  s = s.replace(/[^\p{L}\p{N}]+/gu, opts.separator);
  s = s.split(opts.separator).filter(Boolean).join(opts.separator);

  if (s.length > opts.maxLength) {
    s = s.slice(0, opts.maxLength);
    while (s.endsWith(opts.separator)) s = s.slice(0, -1);
  }

  return s;
}
