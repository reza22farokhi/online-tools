export type Base64Mode = 'encode' | 'decode';
export interface Base64Options { urlSafe: boolean; }
export const DEFAULT_OPTIONS: Base64Options = { urlSafe: false };
export interface Base64Result { ok: boolean; output: string; error?: string; }

function utf8ToBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function base64ToUtf8(b64: string): string {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

export function processBase64(input: string, mode: Base64Mode, opts: Base64Options): Base64Result {
  if (input === '') return { ok: false, output: '', error: 'ورودی خالی است' };
  if (mode === 'encode') {
    try {
      let out = utf8ToBase64(input);
      if (opts.urlSafe) out = out.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      return { ok: true, output: out };
    } catch (e) {
      return { ok: false, output: '', error: e instanceof Error ? e.message : String(e) };
    }
  }
  try {
    let cleaned = input.trim();
    if (opts.urlSafe) cleaned = cleaned.replace(/-/g, '+').replace(/_/g, '/');
    const pad = cleaned.length % 4;
    if (pad === 2) cleaned += '==';
    else if (pad === 3) cleaned += '=';
    else if (pad !== 0) return { ok: false, output: '', error: 'طول Base64 نامعتبر است' };
    return { ok: true, output: base64ToUtf8(cleaned) };
  } catch {
    return { ok: false, output: '', error: 'Base64 نامعتبر است یا UTF-8 معتبر نیست' };
  }
}
