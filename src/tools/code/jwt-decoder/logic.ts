export interface JwtResult {
  ok: boolean;
  error?: string;
  header?: Record<string, unknown>;
  payload?: Record<string, unknown>;
  signature?: string;
  isExpired?: boolean;
  expiresAt?: Date;
  issuedAt?: Date;
  notBefore?: Date;
  invalidTimestamps?: string[];
}

export const MAX_TOKEN_LENGTH = 10_000;
const MAX_DATE_SECONDS = 8_640_000_000_000;

function base64UrlDecode(str: string): string {
  if (!/^[A-Za-z0-9_-]*$/.test(str) || str.length % 4 === 1) {
    throw new Error('Invalid base64url');
  }
  let s = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = s.length % 4;
  if (pad === 2) s += '==';
  else if (pad === 3) s += '=';
  const binary = atob(s);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

function claimDate(value: unknown, claim: string, invalid: string[]): Date | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== 'number' || !Number.isFinite(value) || Math.abs(value) > MAX_DATE_SECONDS) {
    invalid.push(claim);
    return undefined;
  }
  const date = new Date(value * 1000);
  if (Number.isNaN(date.getTime())) {
    invalid.push(claim);
    return undefined;
  }
  return date;
}

export function decodeJwt(token: string): JwtResult {
  if (token.length > MAX_TOKEN_LENGTH) return { ok: false, error: 'طول توکن بیش از حد مجاز است (حداکثر ۱۰٬۰۰۰ نویسه).' };
  const trimmed = token.trim().replace(/\s+/g, '');
  if (!trimmed) return { ok: false, error: 'توکن خالی است' };

  const parts = trimmed.split('.');
  if (parts.length !== 3) {
    return { ok: false, error: 'ساختار JWT نامعتبر است (باید ۳ بخش داشته باشد: header.payload.signature)' };
  }

  const [headerB64, payloadB64, signature] = parts;
  let header: Record<string, unknown>;
  let payload: Record<string, unknown>;

  try {
    const decoded: unknown = JSON.parse(base64UrlDecode(headerB64));
    if (typeof decoded !== 'object' || decoded === null || Array.isArray(decoded)) throw new Error('not object');
    header = decoded as Record<string, unknown>;
  } catch {
    return { ok: false, error: 'Header نامعتبر است (Base64URL یا JSON معتبر نیست)' };
  }

  try {
    const decoded: unknown = JSON.parse(base64UrlDecode(payloadB64));
    if (typeof decoded !== 'object' || decoded === null || Array.isArray(decoded)) throw new Error('not object');
    payload = decoded as Record<string, unknown>;
  } catch {
    return { ok: false, error: 'Payload نامعتبر است (Base64URL یا JSON معتبر نیست)' };
  }

  const invalidTimestamps: string[] = [];
  const expiresAt = claimDate(payload.exp, 'exp', invalidTimestamps);
  const issuedAt = claimDate(payload.iat, 'iat', invalidTimestamps);
  const notBefore = claimDate(payload.nbf, 'nbf', invalidTimestamps);

  return {
    ok: true,
    header,
    payload,
    signature,
    isExpired: expiresAt ? expiresAt.getTime() <= Date.now() : undefined,
    expiresAt,
    issuedAt,
    notBefore,
    invalidTimestamps
  };
}

export function formatTimestamp(d: Date): string {
  if (Number.isNaN(d.getTime())) return 'Invalid date';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function formatDuration(ms: number, lang: 'fa' | 'en'): string {
  const seconds = Math.floor(ms / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  const parts: string[] = [];
  const add = (value: number, fa: string, en: string) => {
    if (value > 0) parts.push(lang === 'en' ? `${value} ${en}${value === 1 ? '' : 's'}` : `${value} ${fa}`);
  };
  add(days, 'روز', 'day');
  add(hours, 'ساعت', 'hour');
  add(minutes, 'دقیقه', 'minute');
  if (parts.length === 0) add(remainingSeconds, 'ثانیه', 'second');
  return parts.join(lang === 'en' ? ', ' : ' و ');
}

export function getTimeRemaining(expiry: Date, lang: 'fa' | 'en' = 'fa'): string {
  const diff = expiry.getTime() - Date.now();
  if (diff <= 0) {
    const duration = formatDuration(Math.abs(diff), lang);
    return lang === 'en' ? `Expired ${duration} ago` : `${duration} پیش منقضی شده`;
  }
  const duration = formatDuration(diff, lang);
  return lang === 'en' ? `${duration} remaining` : `${duration} تا انقضا`;
}
