export type CaseMode =
  | 'lower'
  | 'upper'
  | 'title'
  | 'sentence'
  | 'camel'
  | 'pascal'
  | 'snake'
  | 'kebab'
  | 'alternating';

export const MODES: { value: CaseMode; labelFa: string; labelEn: string }[] = [
  { value: 'lower', labelFa: 'حروف کوچک', labelEn: 'lowercase' },
  { value: 'upper', labelFa: 'حروف بزرگ', labelEn: 'UPPERCASE' },
  { value: 'title', labelFa: 'عنوان', labelEn: 'Title Case' },
  { value: 'sentence', labelFa: 'جمله', labelEn: 'Sentence case' },
  { value: 'camel', labelFa: 'camelCase', labelEn: 'camelCase' },
  { value: 'pascal', labelFa: 'PascalCase', labelEn: 'PascalCase' },
  { value: 'snake', labelFa: 'snake_case', labelEn: 'snake_case' },
  { value: 'kebab', labelFa: 'kebab-case', labelEn: 'kebab-case' },
  { value: 'alternating', labelFa: 'یک‌درمیان', labelEn: 'aLtErNaTiNg' }
];

function toWords(text: string): string[] {
  return text
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_\-]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function capitalize(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function convertCase(text: string, mode: CaseMode): string {
  if (text === '') return '';

  switch (mode) {
    case 'lower':
      return text.toLowerCase();
    case 'upper':
      return text.toUpperCase();
    case 'title':
      return text.replace(/\S+/gu, w =>
        w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
      );
    case 'sentence':
      return text
        .toLowerCase()
        .replace(/(^\s*[\p{L}\p{N}]|[.!?]\s+[\p{L}\p{N}])/gu,
          (c) => c.toUpperCase());
    case 'camel': {
      const words = toWords(text);
      return words
        .map((w, i) => (i === 0 ? w.toLowerCase() : capitalize(w.toLowerCase())))
        .join('');
    }
    case 'pascal':
      return toWords(text)
        .map(w => capitalize(w.toLowerCase()))
        .join('');
    case 'snake':
      return toWords(text)
        .map(w => w.toLowerCase())
        .join('_');
    case 'kebab':
      return toWords(text)
        .map(w => w.toLowerCase())
        .join('-');
    case 'alternating': {
      let i = 0;
      return text.split('').map(c => {
        if (/\s/u.test(c)) return c;
        const r = i % 2 === 0 ? c.toLowerCase() : c.toUpperCase();
        i++;
        return r;
      }).join('');
    }
    default:
      return text;
  }
}
