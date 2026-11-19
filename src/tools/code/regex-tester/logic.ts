export interface MatchResult {
  value: string;
  index: number;
  length: number;
  groups?: Record<string, string | undefined>;
}

export interface RegexResult {
  ok: boolean;
  error?: string;
  matches: MatchResult[];
}

export const MAX_PATTERN_LENGTH = 500;
export const MAX_INPUT_LENGTH = 100_000;
export const MAX_MATCHES = 1000;

export function testRegex(pattern: string, flags: string, input: string): RegexResult {
  if (pattern === '') return { ok: false, error: 'الگو خالی است', matches: [] };
  if (pattern.length > MAX_PATTERN_LENGTH) {
    return { ok: false, error: `الگو بیش از حد طولانی است (حداکثر ${MAX_PATTERN_LENGTH})`, matches: [] };
  }
  if (input.length > MAX_INPUT_LENGTH) {
    return { ok: false, error: `متن ورودی بیش از حد طولانی است (حداکثر ${MAX_INPUT_LENGTH})`, matches: [] };
  }

  const allowedFlags = 'gimsuyd';
  const uniqueFlags = Array.from(new Set(flags.split('').filter(f => allowedFlags.includes(f)))).join('');

  let regex: RegExp;
  try {
    regex = new RegExp(pattern, uniqueFlags);
  } catch (e) {
    return { ok: false, error: 'الگوی نامعتبر: ' + (e instanceof Error ? e.message : String(e)), matches: [] };
  }

  const matches: MatchResult[] = [];

  if (uniqueFlags.includes('g')) {
    let m: RegExpExecArray | null;
    while ((m = regex.exec(input)) !== null) {
      matches.push({
        value: m[0],
        index: m.index,
        length: m[0].length,
        groups: m.groups ? { ...m.groups } : undefined
      });
      if (m[0] === '') regex.lastIndex++;
      if (matches.length >= MAX_MATCHES) break;
    }
  } else {
    const m = regex.exec(input);
    if (m) {
      matches.push({
        value: m[0],
        index: m.index,
        length: m[0].length,
        groups: m.groups ? { ...m.groups } : undefined
      });
    }
  }

  return { ok: true, matches };
}
