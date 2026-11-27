export type UrlMode = 'encode' | 'decode';
export type UrlKind = 'component' | 'full';
export interface UrlResult { ok: boolean; output: string; error?: string; }
export const MAX_URL_INPUT_LENGTH = 100_000;

export function processUrl(input: string, mode: UrlMode, kind: UrlKind): UrlResult {
  if (input === '') return { ok: false, output: '', error: 'ورودی خالی است' };
  if (input.length > MAX_URL_INPUT_LENGTH) {
    return { ok: false, output: '', error: 'ورودی باید حداکثر ۱۰۰٬۰۰۰ کاراکتر باشد.' };
  }
  try {
    if (mode === 'encode') {
      return { ok: true, output: kind === 'component' ? encodeURIComponent(input) : encodeURI(input) };
    }
    return { ok: true, output: kind === 'component' ? decodeURIComponent(input) : decodeURI(input) };
  } catch (e) {
    return { ok: false, output: '', error: e instanceof Error ? e.message : 'ورودی نامعتبر' };
  }
}
