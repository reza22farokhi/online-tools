export interface RefineOptions {
  fixArabic: boolean;
  fixHalfSpaces: boolean;
  fixPunctuation: boolean;
  convertToPersianNumbers: boolean;
}

export function fixArabicChars(text: string): string {
  return text
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/ة/g, 'ه')
    .replace(/٤/g, '۴')
    .replace(/٥/g, '۵')
    .replace(/٦/g, '۶');
}

export function convertNumbers(text: string, toPersian: boolean): string {
  const en = '0123456789';
  const fa = '۰۱۲۳۴۵۶۷۸۹';
  if (toPersian) {
    return text.replace(/[0-9]/g, (w) => fa[en.indexOf(w)] || w);
  }
  return text.replace(/[۰-۹]/g, (w) => en[fa.indexOf(w)] || w);
}

export function fixHalfSpaces(text: string): string {
  let fixed = text;
  fixed = fixed.replace(/(^|\s)(می|نمی)\s+/g, '$1$2‌');
  fixed = fixed.replace(/(\S+)\s+(ها|های|هایی|تر|ترین|ام|ات|اش|مان|تان|شان)(\s|$)/g, '$1‌$2$3');
  return fixed;
}

export function fixPunctuation(text: string): string {
  return text
    .replace(/,/g, '،')
    .replace(/\?/g, '؟')
    .replace(/;/g, '؛')
    .replace(/\s+([،؛؟!.:])/g, '$1')
    .replace(/([،؛؟!.:])(?=[^\s])/g, '$1 ')
    .replace(/\s{2,}/g, ' ');
}

export function refinePersianText(text: string, options: RefineOptions): string {
  let result = text;
  if (options.fixArabic) result = fixArabicChars(result);
  if (options.fixHalfSpaces) result = fixHalfSpaces(result);
  if (options.fixPunctuation) result = fixPunctuation(result);
  if (options.convertToPersianNumbers) result = convertNumbers(result, true);
  return result;
}
