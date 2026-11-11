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
}

function base64UrlDecode(str: string): string {
  let s = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = s.length % 4;
  if (pad === 2) s += '==';
  else if (pad === 3) s += '=';
  else if (pad !== 0) throw new Error('Invalid base64url length');
  const binary = atob(s);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

export function decodeJwt(token: string): JwtResult {
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
    const decoded = JSON.parse(base64UrlDecode(headerB64));
    if (typeof decoded !== 'object' || decoded === null) throw new Error('not object');
    header = decoded;
  } catch {
    return { ok: false, error: 'Header نامعتبر است (Base64URL یا JSON معتبر نیست)' };
  }

  try {
    const decoded = JSON.parse(base64UrlDecode(payloadB64));
    if (typeof decoded !== 'object' || decoded === null) throw new Error('not object');
    payload = decoded;
  } catch {
    return { ok: false, error: 'Payload نامعتبر است (Base64URL یا JSON معتبر نیست)' };
  }

  const now = Math.floor(Date.now() / 1000);
  const exp = typeof payload.exp === 'number' ? payload.exp : undefined;
  const iat = typeof payload.iat === 'number' ? payload.iat : undefined;
  const nbf = typeof payload.nbf === 'number' ? payload.nbf : undefined;

  return {
    ok: true,
    header,
    payload,
    signature,
    isExpired: exp !== undefined ? exp < now : undefined,
    expiresAt: exp ? new Date(exp * 1000) : undefined,
    issuedAt: iat ? new Date(iat * 1000) : undefined,
    notBefore: nbf ? new Date(nbf * 1000) : undefined
  };
}

export function formatTimestamp(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function getTimeRemaining(expiry: Date): string {
  const diff = expiry.getTime() - Date.now();
  if (diff < 0) return formatDuration(Math.abs(diff)) + ' پیش منقضی شده';
  return formatDuration(diff) + ' تا انقضا';
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const parts: string[] = [];
  if (days > 0) parts.push(`${days} روز`);
  if (hours > 0) parts.push(`${hours} ساعت`);
  if (minutes > 0) parts.push(`${minutes} دقیقه`);
  if (parts.length === 0) parts.push(`${seconds} ثانیه`);
  return parts.join(' و ');
}
