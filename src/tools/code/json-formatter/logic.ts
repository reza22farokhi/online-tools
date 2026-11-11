export type JsonMode = 'format' | 'minify' | 'validate';

export interface JsonResult {
  ok: boolean;
  output: string;
  error?: string;
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
    parsed = JSON.parse(input);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, output: '', error: msg };
  }

  if (mode === 'validate') {
    return { ok: true, output: 'JSON معتبر است ✓' };
  }

  try {
    const out =
      mode === 'minify'
        ? JSON.stringify(parsed)
        : JSON.stringify(parsed, null, indent);
    return { ok: true, output: out };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, output: '', error: msg };
  }
}
