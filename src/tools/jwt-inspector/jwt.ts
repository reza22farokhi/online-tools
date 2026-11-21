// منطق خالص دیکد و تأیید JWT — بدون وابستگی خارجی، فقط Web Crypto API
// تست‌پذیر، بدون side-effect، بدون دسترسی به DOM

export interface JwtHeader {
  alg: string;
  typ?: string;
  kid?: string;
  crit?: unknown;
  b64?: unknown;
  [key: string]: unknown;
}

export interface JwtPayload {
  iss?: string;
  sub?: string;
  aud?: string | string[];
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  [key: string]: unknown;
}

export interface DecodedJwt {
  header: JwtHeader;
  payload: JwtPayload;
  signature: string;
  raw: { header: string; payload: string; signature: string };
}

export class JwtError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = 'JwtError';
  }
}

export const MAX_TOKEN_BYTES = 1024 * 1024; // 1 MB
const BASE64URL_RE = /^[A-Za-z0-9_-]*$/;

function base64UrlToBytes(s: string): Uint8Array {
  if (!BASE64URL_RE.test(s)) {
    throw new JwtError('INVALID_BASE64URL', 'رشته base64url نامعتبر است');
  }
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + pad;
  let bin: string;
  try {
    bin = atob(b64);
  } catch {
    throw new JwtError('INVALID_BASE64URL', 'رشته base64url نامعتبر است');
  }
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function bytesToJson(bytes: Uint8Array): unknown {
  let text: string;
  try {
    text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    throw new JwtError('INVALID_UTF8', 'محتوای توکن UTF-8 معتبر نیست');
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new JwtError('INVALID_JSON', 'محتوای توکن JSON معتبر نیست');
  }
}

export function decode(token: string): DecodedJwt {
  if (typeof token !== 'string') throw new JwtError('INVALID_INPUT', 'توکن نامعتبر است');
  const trimmed = token.trim();
  if (trimmed.length === 0) throw new JwtError('EMPTY', 'توکن خالی است');
  if (new TextEncoder().encode(trimmed).length > MAX_TOKEN_BYTES) {
    throw new JwtError('TOO_LARGE', 'حجم توکن بیش از حد مجاز است (حداکثر ۱ مگابایت)');
  }
  const parts = trimmed.split('.');
  if (parts.length !== 3) {
    throw new JwtError(
      'INVALID_FORMAT',
      'توکن JWT باید سه بخش داشته باشد: header.payload.signature'
    );
  }
  const [h, p, s] = parts;
  const header = bytesToJson(base64UrlToBytes(h)) as JwtHeader;
  const payloadValue = bytesToJson(base64UrlToBytes(p));
  if (!header || typeof header !== 'object' || Array.isArray(header) || typeof header.alg !== 'string') {
    throw new JwtError('INVALID_HEADER', 'هدر توکن باید یک شیء JSON شامل فیلد alg باشد');
  }
  if (!payloadValue || typeof payloadValue !== 'object' || Array.isArray(payloadValue)) {
    throw new JwtError('INVALID_PAYLOAD', 'Payload توکن JWT باید یک شیء JSON باشد');
  }
  const payload = payloadValue as JwtPayload;
  return { header, payload, signature: s, raw: { header: h, payload: p, signature: s } };
}

// ---------- Verification ----------

function assertSupportedCriticalHeaders(header: JwtHeader): void {
  if (header.b64 !== undefined && typeof header.b64 !== 'boolean') {
    throw new JwtError('INVALID_B64', 'پارامتر b64 در هدر JWT باید بولی باشد');
  }
  if (header.b64 === false) {
    throw new JwtError('UNSUPPORTED_B64', 'این ابزار از payload بدون کدگذاری Base64URL پشتیبانی نمی‌کند');
  }
  if (header.crit !== undefined) {
    if (
      !Array.isArray(header.crit) ||
      header.crit.length === 0 ||
      header.crit.some((value: unknown) => typeof value !== 'string' || value.trim().length === 0)
    ) {
      throw new JwtError('INVALID_CRIT', 'فهرست crit در هدر JWT نامعتبر است');
    }
    throw new JwtError('UNSUPPORTED_CRIT', 'هدر JWT شامل پارامتر حیاتی است که این ابزار پشتیبانی نمی‌کند؛ تأیید امضا متوقف شد');
  }
}

interface HmacParam { hash: AlgorithmIdentifier; }
interface RsaParam { hash: AlgorithmIdentifier; padding: 'RSASSA-PKCS1-v1_5' | 'RSA-PSS'; saltLength?: number; }
interface EcParam { hash: AlgorithmIdentifier; namedCurve: string; }

const HMAC: Record<string, HmacParam> = {
  HS256: { hash: 'SHA-256' },
  HS384: { hash: 'SHA-384' },
  HS512: { hash: 'SHA-512' },
};

const RSA: Record<string, RsaParam> = {
  RS256: { hash: 'SHA-256', padding: 'RSASSA-PKCS1-v1_5' },
  RS384: { hash: 'SHA-384', padding: 'RSASSA-PKCS1-v1_5' },
  RS512: { hash: 'SHA-512', padding: 'RSASSA-PKCS1-v1_5' },
  PS256: { hash: 'SHA-256', padding: 'RSA-PSS', saltLength: 32 },
  PS384: { hash: 'SHA-384', padding: 'RSA-PSS', saltLength: 48 },
  PS512: { hash: 'SHA-512', padding: 'RSA-PSS', saltLength: 64 },
};

const EC: Record<string, EcParam> = {
  ES256: { hash: 'SHA-256', namedCurve: 'P-256' },
  ES384: { hash: 'SHA-384', namedCurve: 'P-384' },
  ES512: { hash: 'SHA-512', namedCurve: 'P-521' },
};

function pemToDer(pem: string): Uint8Array {
  const cleaned = pem
    .replace(/-----BEGIN [^-]+-----/g, '')
    .replace(/-----END [^-]+-----/g, '')
    .replace(/\s+/g, '');
  if (!cleaned) throw new JwtError('INVALID_KEY', 'کلید PEM نامعتبر است');
  let bin: string;
  try {
    bin = atob(cleaned);
  } catch {
    throw new JwtError('INVALID_KEY', 'کلید PEM نامعتبر است');
  }
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

export interface VerifyResult {
  valid: boolean;
  algorithm: string;
}

export async function verify(
  token: string,
  keyInput: string,
  algorithmOverride?: string
): Promise<VerifyResult> {
  if (typeof crypto === 'undefined' || !crypto.subtle) {
    throw new JwtError('NO_WEBCRYPTO', 'مرورگر شما از Web Crypto پشتیبانی نمی‌کند (نیاز به HTTPS)');
  }
  const decoded = decode(token);
  assertSupportedCriticalHeaders(decoded.header);
  const alg = (algorithmOverride || decoded.header.alg).toString();

  if (alg !== decoded.header.alg) {
    throw new JwtError('ALG_MISMATCH', 'الگوریتم انتخاب‌شده با الگوریتم ثبت‌شده در هدر توکن مطابقت ندارد');
  }
  if (alg === 'none' || alg === '') {
    throw new JwtError('UNSIGNED', 'توکن بدون امضا (alg: none) قابل تأیید نیست');
  }
  if (!keyInput || keyInput.trim().length === 0) {
    throw new JwtError('NO_KEY', 'کلید تأیید را وارد کنید');
  }
  if (
    Object.prototype.hasOwnProperty.call(HMAC, alg) &&
    /-----BEGIN (?:RSA )?PUBLIC KEY-----|-----BEGIN CERTIFICATE-----/i.test(keyInput)
  ) {
    throw new JwtError('KEY_TYPE_MISMATCH', 'کلید عمومی PEM یا گواهی نباید به‌عنوان secret در الگوریتم HMAC استفاده شود');
  }
  if (
    (Object.prototype.hasOwnProperty.call(RSA, alg) || Object.prototype.hasOwnProperty.call(EC, alg)) &&
    /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/i.test(keyInput)
  ) {
    throw new JwtError('PRIVATE_KEY_NOT_ALLOWED', 'برای تأیید امضا فقط کلید عمومی PEM لازم است؛ کلید خصوصی را وارد نکنید');
  }

  const data = new TextEncoder().encode(
    `${decoded.raw.header}.${decoded.raw.payload}`
  ) as BufferSource; // Fix TS error
  const sig = base64UrlToBytes(decoded.raw.signature) as BufferSource; // Fix TS error

  if (Object.prototype.hasOwnProperty.call(HMAC, alg)) {
    const { hash } = HMAC[alg];
    const secret = new TextEncoder().encode(keyInput) as BufferSource; // Fix TS error
    const key = await crypto.subtle.importKey(
      'raw',
      secret,
      { name: 'HMAC', hash },
      false,
      ['verify']
    );
    const valid = await crypto.subtle.verify('HMAC', key, sig, data);
    return { valid, algorithm: alg };
  }

  if (Object.prototype.hasOwnProperty.call(RSA, alg)) {
    const { hash, padding, saltLength } = RSA[alg];
    const der = pemToDer(keyInput) as BufferSource; // Fix TS error
    const key = await crypto.subtle.importKey(
      'spki',
      der,
      { name: padding, hash },
      false,
      ['verify']
    );
    const params =
      padding === 'RSA-PSS'
        ? { name: padding, saltLength: saltLength! }
        : { name: padding };
    const valid = await crypto.subtle.verify(params as RsaPssParams, key, sig, data);
    return { valid, algorithm: alg };
  }

  if (Object.prototype.hasOwnProperty.call(EC, alg)) {
    const { hash, namedCurve } = EC[alg];
    const der = pemToDer(keyInput) as BufferSource; // Fix TS error
    const key = await crypto.subtle.importKey(
      'spki',
      der,
      { name: 'ECDSA', namedCurve },
      false,
      ['verify']
    );
    const valid = await crypto.subtle.verify({ name: 'ECDSA', hash }, key, sig, data);
    return { valid, algorithm: alg };
  }

  throw new JwtError('UNSUPPORTED_ALG', `الگوریتم ${alg} پشتیبانی نمی‌شود`);
}

// ---------- Expiration & security checks ----------

export type ExpStatus = 'valid' | 'expired' | 'not-yet-valid' | 'no-exp' | 'unknown';

export interface ExpInfo {
  status: ExpStatus;
  exp?: number;
  nbf?: number;
  remainingSeconds?: number;
}

export function checkExpiration(
  payload: JwtPayload,
  nowMs: number = Date.now()
): ExpInfo {
  const maxTimestampSeconds = 8_640_000_000_000;
  const isValidTimestamp = (value: unknown): value is number =>
    typeof value === 'number' &&
    Number.isFinite(value) &&
    Math.abs(value) <= maxTimestampSeconds;

  if (!Number.isFinite(nowMs)) return { status: 'unknown' };

  const rawExp = payload.exp;
  const rawNbf = payload.nbf;
  if (rawExp !== undefined && !isValidTimestamp(rawExp)) return { status: 'unknown' };
  if (rawNbf !== undefined && !isValidTimestamp(rawNbf)) return { status: 'unknown' };

  const now = Math.floor(nowMs / 1000);
  const exp = isValidTimestamp(rawExp) ? rawExp : undefined;
  const nbf = isValidTimestamp(rawNbf) ? rawNbf : undefined;

  if (nbf !== undefined && now < nbf) {
    return { status: 'not-yet-valid', exp, nbf };
  }
  if (exp === undefined) {
    return { status: 'no-exp', nbf };
  }
  const remaining = exp - now;
  if (remaining <= 0) {
    return { status: 'expired', exp, nbf, remainingSeconds: remaining };
  }
  return { status: 'valid', exp, nbf, remainingSeconds: remaining };
}

export interface SecurityWarning {
  level: 'info' | 'warn' | 'danger';
  code: string;
  message: string;
}

export function analyzeSecurity(header: JwtHeader, payload: JwtPayload): SecurityWarning[] {
  const warnings: SecurityWarning[] = [];

  if (header.crit !== undefined) {
    warnings.push({
      level: 'danger',
      code: 'UNSUPPORTED_CRIT',
      message: 'این توکن دارای پارامترهای حیاتی JOSE است که این ابزار تفسیر نمی‌کند؛ تأیید امضا متوقف می‌شود.',
    });
  }
  if (header.b64 === false) {
    warnings.push({
      level: 'danger',
      code: 'UNSUPPORTED_B64',
      message: 'این توکن از payload بدون کدگذاری Base64URL استفاده می‌کند که توسط این ابزار پشتیبانی نمی‌شود.',
    });
  }

  if (header.alg === 'none') {
    warnings.push({
      level: 'danger',
      code: 'ALG_NONE',
      message: 'الگوریتم "none" به معنای عدم امضا است — هرگز در محیط تولید استفاده نکنید.',
    });
  }
  if (typeof payload.exp !== 'number') {
    warnings.push({
      level: 'warn',
      code: 'NO_EXP',
      message: 'این توکن فاقد claim «exp» است؛ زمان انقضای مشخصی از روی آن قابل تشخیص نیست.',
    });
  } else if (typeof payload.iat === 'number') {
    const ttl = payload.exp - payload.iat;
    if (ttl > 24 * 3600) {
      warnings.push({
        level: 'warn',
        code: 'LONG_TTL',
        message: 'طول عمر توکن بیش از ۲۴ ساعت است — کاهش آن توصیه می‌شود.',
      });
    }
  }
  if ('password' in payload || 'pwd' in payload) {
    warnings.push({
      level: 'danger',
      code: 'SENSITIVE_CLAIM',
      message: 'claim حساس (password) در payload وجود دارد — این کار خطرناک است.',
    });
  }
  if (header.typ && header.typ !== 'JWT') {
    warnings.push({
      level: 'info',
      code: 'TYP_UNUSUAL',
      message: `مقدار typ به‌جای JWT برابر "${header.typ}" است.`,
    });
  }
  return warnings;
}
