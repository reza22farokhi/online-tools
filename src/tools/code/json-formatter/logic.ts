export type JsonMode = 'format' | 'minify' | 'validate';

export interface JsonResult {
  ok: boolean;
  output: string;
  error?: string;
}

export interface JsonTransformOptions {
  sortKeys?: boolean;
  removeNulls?: boolean;
  removeEmpty?: boolean;
}

type JsonPathSegment = string | number | '*';
export const MAX_JSON_INPUT_LENGTH = 100_000;
export const MAX_JSON_NODES = 20_000;
const MAX_JSON_DEPTH = 200;
const MAX_JSON_PATH_LENGTH = 500;

function parseJsonWithLimits(input: string): unknown {
  if (input.length > MAX_JSON_INPUT_LENGTH) {
    throw new Error('حجم ورودی JSON بیش از حد مجاز است (حداکثر ۱۰۰٬۰۰۰ نویسه).');
  }
  const parsed: unknown = JSON.parse(input);
  const pending: Array<{ value: unknown; depth: number }> = [{ value: parsed, depth: 0 }];
  let nodes = 0;
  while (pending.length > 0) {
    const current = pending.pop()!;
    nodes++;
    if (nodes > MAX_JSON_NODES) {
      throw new Error('ساختار JSON از سقف ۲۰٬۰۰۰ گره عبور کرده است.');
    }
    if (current.depth > MAX_JSON_DEPTH) {
      throw new Error('ساختار JSON بیش از حد عمیق است (حداکثر ۲۰۰ سطح).');
    }
    if (Array.isArray(current.value)) {
      for (const item of current.value) pending.push({ value: item, depth: current.depth + 1 });
    } else if (current.value !== null && typeof current.value === 'object') {
      for (const key of Object.keys(current.value)) {
        pending.push({ value: (current.value as Record<string, unknown>)[key], depth: current.depth + 1 });
      }
    }
  }
  return parsed;
}

export function processJson(
  input: string,
  mode: JsonMode,
  indent: 2 | 4 = 2
): JsonResult {
  if (input.trim() === '') {
    return { ok: false, output: '', error: 'ورودی خالی است' };
  }

  let parsed: unknown;
  try {
    parsed = parseJsonWithLimits(input);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, output: '', error: msg };
  }

  if (mode === 'validate') {
    return { ok: true, output: 'JSON معتبر است ✓' };
  }

  try {
    const out = mode === 'minify'
      ? JSON.stringify(parsed)
      : JSON.stringify(parsed, null, indent);
    return { ok: true, output: out };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, output: '', error: msg };
  }
}

function isEmptyValue(value: unknown): boolean {
  if (value === '') return true;
  if (Array.isArray(value)) return value.length === 0;
  if (value !== null && typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

function transformValue(
  value: unknown,
  options: JsonTransformOptions,
  depth: number
): unknown {
  if (depth > MAX_JSON_DEPTH) throw new Error('ساختار JSON بیش از حد عمیق است (حداکثر ۲۰۰ سطح).');

  if (Array.isArray(value)) {
    const transformed = value
      .map(item => transformValue(item, options, depth + 1))
      .filter(item => !(options.removeNulls && item === null))
      .filter(item => !(options.removeEmpty && isEmptyValue(item)));
    return transformed;
  }

  if (value !== null && typeof value === 'object') {
    const source = value as Record<string, unknown>;
    const keys = Object.keys(source);
    if (options.sortKeys) keys.sort();
    const result = Object.create(null) as Record<string, unknown>;
    for (const key of keys) {
      const transformed = transformValue(source[key], options, depth + 1);
      if (options.removeNulls && transformed === null) continue;
      if (options.removeEmpty && isEmptyValue(transformed)) continue;
      result[key] = transformed;
    }
    return result;
  }

  return value;
}

export function transformJson(
  input: string,
  options: JsonTransformOptions,
  indent: 2 | 4 = 2
): JsonResult {
  if (input.trim() === '') return { ok: false, output: '', error: 'ورودی خالی است.' };
  try {
    const parsed: unknown = parseJsonWithLimits(input);
    const transformed = transformValue(parsed, options, 0);
    return { ok: true, output: JSON.stringify(transformed, null, indent) };
  } catch (e) {
    return {
      ok: false,
      output: '',
      error: e instanceof Error ? e.message : 'تبدیل JSON ناموفق بود.'
    };
  }
}

function parseJsonPath(path: string): JsonPathSegment[] {
  if (!path || path.length > MAX_JSON_PATH_LENGTH || !path.startsWith('$')) {
    throw new Error('مسیر باید با $ شروع شود و حداکثر ۵۰۰ نویسه باشد.');
  }

  const segments: JsonPathSegment[] = [];
  let index = 1;

  while (index < path.length) {
    if (path[index] === '.') {
      index++;
      const start = index;
      while (index < path.length && path[index] !== '.' && path[index] !== '[') index++;
      const key = path.slice(start, index);
      if (!key || /\s/.test(key)) throw new Error('نام ویژگی در مسیر JSONPath معتبر نیست.');
      segments.push(key);
      continue;
    }

    if (path[index] === '[') {
      const match = /^\[(\d+|\*|"(?:\\.|[^"\\])*")\]/.exec(path.slice(index));
      if (!match) throw new Error('شاخص یا ویژگی داخل کروشه معتبر نیست.');
      const token = match[1];
      if (token === '*') segments.push('*');
      else if (/^\d+$/.test(token)) {
        const numeric = Number(token);
        if (!Number.isSafeInteger(numeric)) throw new Error('شاخص آرایه بیش از حد بزرگ است.');
        segments.push(numeric);
      } else {
        segments.push(JSON.parse(token) as string);
      }
      index += match[0].length;
      continue;
    }

    throw new Error('ساختار مسیر JSONPath معتبر نیست.');
  }

  return segments;
}

export function queryJsonPath(input: string, path: string, indent: 2 | 4 = 2): JsonResult {
  if (input.trim() === '') return { ok: false, output: '', error: 'ورودی JSON خالی است.' };

  try {
    const root: unknown = parseJsonWithLimits(input);
    const segments = parseJsonPath(path.trim());
    let matches: unknown[] = [root];

    for (const segment of segments) {
      const next: unknown[] = [];
      for (const value of matches) {
        if (segment === '*') {
          if (Array.isArray(value)) next.push(...value);
          else if (value !== null && typeof value === 'object') next.push(...Object.values(value));
        } else if (typeof segment === 'number') {
          if (Array.isArray(value) && segment < value.length) next.push(value[segment]);
        } else if (value !== null && typeof value === 'object' && Object.prototype.hasOwnProperty.call(value, segment)) {
          next.push((value as Record<string, unknown>)[segment]);
        }
      }
      matches = next;
      if (!matches.length) return { ok: false, output: '', error: 'مسیر موردنظر در JSON پیدا نشد.' };
    }

    const selected = segments.includes('*') ? matches : matches[0];
    return { ok: true, output: JSON.stringify(selected, null, indent) };
  } catch (e) {
    return {
      ok: false,
      output: '',
      error: e instanceof Error ? e.message : 'خواندن مسیر JSON ناموفق بود.'
    };
  }
}
