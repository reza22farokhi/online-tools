import { describe, it, expect, beforeAll } from 'vitest';
import {
  decode,
  verify,
  checkExpiration,
  analyzeSecurity,
  JwtError,
  MAX_TOKEN_BYTES,
} from '../../src/tools/jwt-inspector/jwt';

beforeAll(() => {
  if (!globalThis.crypto) {
    throw new Error('WebCrypto لازم است — Node 20+ یا jsdom با polyfill');
  }
});

const HS256_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
  'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.' +
  'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
const HS256_SECRET = 'your-256-bit-secret';

function base64UrlEncode(input: string): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

async function signHS256(header: object, payload: object, secret: string): Promise<string> {
  const h = base64UrlEncode(JSON.stringify(header));
  const p = base64UrlEncode(JSON.stringify(payload));
  const data = new TextEncoder().encode(`${h}.${p}`);
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sigBuf = await crypto.subtle.sign('HMAC', key, data);
  const sig = Buffer.from(new Uint8Array(sigBuf)).toString('base64')
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  return `${h}.${p}.${sig}`;
}

describe('decode()', () => {
  it('decodes header and payload', () => {
    const d = decode(HS256_TOKEN);
    expect(d.header.alg).toBe('HS256');
    expect(d.header.typ).toBe('JWT');
    expect(d.payload.sub).toBe('1234567890');
    expect(d.payload.name).toBe('John Doe');
  });

  it('rejects empty input', () => {
    expect(() => decode('')).toThrow(JwtError);
  });

  it('rejects malformed token', () => {
    expect(() => decode('a.b')).toThrow(JwtError);
  });

  it('rejects invalid base64url', () => {
    expect(() => decode('!!!.@@@.###')).toThrow(JwtError);
  });

  it('rejects oversized token', () => {
    const big = 'a'.repeat(MAX_TOKEN_BYTES + 1) + '.b.c';
    expect(() => decode(big)).toThrow(JwtError);
  });
});

describe('verify()', () => {
  it('verifies valid HS256 token', async () => {
    const result = await verify(HS256_TOKEN, HS256_SECRET);
    expect(result.valid).toBe(true);
    expect(result.algorithm).toBe('HS256');
  });

  it('rejects wrong HS256 secret', async () => {
    const result = await verify(HS256_TOKEN, 'wrong-secret');
    expect(result.valid).toBe(false);
  });

  it('rejects unsigned (alg: none)', async () => {
    const header = base64UrlEncode(JSON.stringify({ alg: 'none', typ: 'JWT' }));
    const payload = base64UrlEncode(JSON.stringify({ sub: 'x' }));
    const token = `${header}.${payload}.`;
    await expect(verify(token, 'x')).rejects.toThrow(JwtError);
  });

  it('rejects empty key', async () => {
    await expect(verify(HS256_TOKEN, '')).rejects.toThrow(JwtError);
  });

  it('round-trip custom HS256 token', async () => {
    const token = await signHS256({ alg: 'HS256', typ: 'JWT' }, { sub: 'x', exp: 9999999999 }, 'k');
    const r = await verify(token, 'k');
    expect(r.valid).toBe(true);
  });
});

describe('checkExpiration()', () => {
  it('returns valid for future exp', () => {
    const now = Date.now();
    const info = checkExpiration({ exp: Math.floor(now / 1000) + 3600 });
    expect(info.status).toBe('valid');
    expect(info.remainingSeconds).toBeGreaterThan(3500);
  });

  it('returns expired for past exp', () => {
    const info = checkExpiration({ exp: Math.floor(Date.now() / 1000) - 100 });
    expect(info.status).toBe('expired');
  });

  it('returns no-exp when exp is missing', () => {
    expect(checkExpiration({}).status).toBe('no-exp');
  });

  it('returns not-yet-valid for future nbf', () => {
    const info = checkExpiration({ nbf: Math.floor(Date.now() / 1000) + 3600 });
    expect(info.status).toBe('not-yet-valid');
  });
});

describe('analyzeSecurity()', () => {
  it('flags alg none as danger', () => {
    const w = analyzeSecurity({ alg: 'none' }, {});
    expect(w.some((x) => x.code === 'ALG_NONE' && x.level === 'danger')).toBe(true);
  });

  it('flags missing exp', () => {
    const w = analyzeSecurity({ alg: 'HS256' }, {});
    expect(w.some((x) => x.code === 'NO_EXP')).toBe(true);
  });

  it('flags long TTL', () => {
    const now = Math.floor(Date.now() / 1000);
    const w = analyzeSecurity({ alg: 'HS256' }, { iat: now, exp: now + 100000 });
    expect(w.some((x) => x.code === 'LONG_TTL')).toBe(true);
  });

  it('flags sensitive claim', () => {
    const w = analyzeSecurity({ alg: 'HS256' }, { password: 'x' } as any);
    expect(w.some((x) => x.code === 'SENSITIVE_CLAIM')).toBe(true);
  });

  it('passes clean token', () => {
    const now = Math.floor(Date.now() / 1000);
    const w = analyzeSecurity({ alg: 'HS256', typ: 'JWT' }, { iat: now, exp: now + 3600 });
    expect(w.filter((x) => x.level === 'danger')).toHaveLength(0);
  });
});
