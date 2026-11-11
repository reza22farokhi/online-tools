export interface DedupOptions {
  caseInsensitive: boolean;
  trim: boolean;
  removeEmpty: boolean;
}

export const DEFAULT_OPTIONS: DedupOptions = {
  caseInsensitive: false,
  trim: true,
  removeEmpty: true
};

export interface DedupResult {
  output: string;
  removed: number;
  kept: number;
}

export function removeDuplicates(input: string, opts: DedupOptions): DedupResult {
  if (input === '') {
    return { output: '', removed: 0, kept: 0 };
  }

  let lines = input.split(/\r\n|\r|\n/);

  if (opts.trim) lines = lines.map(l => l.trim());
  if (opts.removeEmpty) lines = lines.filter(l => l !== '');

  const seen = new Set<string>();
  const result: string[] = [];

  for (const line of lines) {
    // اگر removeEmpty خاموش است، خطوط خالی را حفظ کن (dedupe نکن)
    if (line === '' && !opts.removeEmpty) {
      result.push(line);
      continue;
    }
    const key = opts.caseInsensitive ? line.toLowerCase() : line;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(line);
  }

  return {
    output: result.join('\n'),
    removed: lines.length - result.length,
    kept: result.length
  };
}
