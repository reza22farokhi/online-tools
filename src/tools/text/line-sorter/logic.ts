export type SortMode = 'asc' | 'desc' | 'length-asc' | 'length-desc' | 'reverse';

export interface SortOptions {
  mode: SortMode;
  caseInsensitive: boolean;
  numeric: boolean;
  trim: boolean;
  removeEmpty: boolean;
  unique: boolean;
}

export const DEFAULT_OPTIONS: SortOptions = {
  mode: 'asc',
  caseInsensitive: false,
  numeric: false,
  trim: true,
  removeEmpty: true,
  unique: false
};

export const SORT_MODES: { value: SortMode; fa: string }[] = [
  { value: 'asc', fa: 'صعودی (A→Z)' },
  { value: 'desc', fa: 'نزولی (Z→A)' },
  { value: 'length-asc', fa: 'کوتاه به بلند' },
  { value: 'length-desc', fa: 'بلند به کوتاه' },
  { value: 'reverse', fa: 'معکوس ترتیب اصلی' }
];

export function sortLines(input: string, opts: SortOptions): string {
  if (input === '') return '';

  let lines = input.split(/\r\n|\r|\n/);

  if (opts.trim) lines = lines.map(l => l.trim());
  if (opts.removeEmpty) lines = lines.filter(l => l !== '');
  if (opts.unique) lines = [...new Set(lines)];

  const cmpStr = (a: string, b: string): number => {
    if (opts.numeric) {
      const na = Number(a);
      const nb = Number(b);
      const aNum = a !== '' && !Number.isNaN(na);
      const bNum = b !== '' && !Number.isNaN(nb);
      if (aNum && bNum) return na - nb;
      if (aNum) return -1;
      if (bNum) return 1;
    }
    if (opts.caseInsensitive) {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    }
    return a.localeCompare(b);
  };

  switch (opts.mode) {
    case 'asc':
      lines.sort(cmpStr);
      break;
    case 'desc':
      lines.sort((a, b) => cmpStr(b, a));
      break;
    case 'length-asc':
      lines.sort((a, b) => a.length - b.length);
      break;
    case 'length-desc':
      lines.sort((a, b) => b.length - a.length);
      break;
    case 'reverse':
      lines.reverse();
      break;
  }

  return lines.join('\n');
}
