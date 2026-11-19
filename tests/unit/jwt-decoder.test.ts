import { describe, it, expect } from 'vitest';
import { decodeJwt, formatTimestamp, getTimeRemaining } from '../../src/tools/code/jwt-decoder/logic';

const SAMPLE_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

function b64url(str: string): string {
  const binary = new TextEncoder().encode(str);
  let s = '';
  for (let i = 0; i < binary.length; i++) s += String.fromCharCode(binary[i]);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

describe('decodeJwt', () => {
  it('decodes valid sample JWT', () => {
    const r = decodeJwt(SAMPLE_JWT);
    expect(r.ok).toBe(true);
    expect(r.header?.alg).toBe('HS256');
    expect(r.header?.typ).toBe('JWT');
    expect(r.payload?.sub).toBe('1234567890');
    expect(r.payload?.name).toBe('John Doe');
  });

  it('returns error for empty token', () => {
    expect(decodeJwt('').ok).toBe(false);
  });

  it('returns error for wrong part count', () => {
    const r = decodeJwt('abc.def');
    expect(r.ok).toBe(false);
    expect(r.error).toContain('۳ بخش');
  });

  it('returns error for invalid base64', () => {
    const r = decodeJwt('!!!.###.$$$');
    expect(r.ok).toBe(false);
  });

  it('returns error for invalid JSON in payload', () => {
    const header = b64url(JSON.stringify({ alg: 'HS256' }));
    const payload = b64url('not-json');
    const r = decodeJwt(`${header}.${payload}.sig`);
    expect(r.ok).toBe(false);
  });

  it('detects expired token', () => {
    const header = b64url(JSON.stringify({ alg: 'HS256' }));
    const payload = b64url(JSON.stringify({ exp: 1516239022 }));
    const r = decodeJwt(`${header}.${payload}.sig`);
    expect(r.ok).toBe(true);
    expect(r.isExpired).toBe(true);
  });

  it('detects valid non-expired token', () => {
    const futureExp = Math.floor(Date.now() / 1000) + 3600;
    const header = b64url(JSON.stringify({ alg: 'HS256' }));
    const payload = b64url(JSON.stringify({ exp: futureExp }));
    const r = decodeJwt(`${header}.${payload}.sig`);
    expect(r.ok).toBe(true);
    expect(r.isExpired).toBe(false);
  });

  it('treats epoch-zero NumericDate claims as valid dates', () => {
    const header = b64url(JSON.stringify({ alg: 'HS256' }));
    const payload = b64url(JSON.stringify({ exp: 0, iat: 0 }));
    const r = decodeJwt(`${header}.${payload}.sig`);
    expect(r.ok).toBe(true);
    expect(r.isExpired).toBe(true);
    expect(r.expiresAt?.getTime()).toBe(0);
    expect(r.issuedAt?.getTime()).toBe(0);
  });

  it('rejects array headers and payloads', () => {
    const arrayHeader = b64url('[]');
    const objectPayload = b64url('{}');
    expect(decodeJwt(`${arrayHeader}.${objectPayload}.sig`).ok).toBe(false);
    const objectHeader = b64url('{}');
    const arrayPayload = b64url('[]');
    expect(decodeJwt(`${objectHeader}.${arrayPayload}.sig`).ok).toBe(false);
  });

  it('flags invalid NumericDate claims instead of creating Invalid Date objects', () => {
    const header = b64url('{}');
    const payload = b64url(JSON.stringify({ exp: 1e100 }));
    const r = decodeJwt(`${header}.${payload}.sig`);
    expect(r.ok).toBe(true);
    expect(r.invalidTimestamps).toContain('exp');
    expect(r.expiresAt).toBeUndefined();
    expect(r.isExpired).toBeUndefined();
  });

  it('rejects oversized tokens', () => {
    const r = decodeJwt('a'.repeat(10_001));
    expect(r.ok).toBe(false);
    expect(r.error).toContain('۱۰٬۰۰۰');
  });

  it('handles token without exp', () => {
    const r = decodeJwt(SAMPLE_JWT);
    expect(r.isExpired).toBeUndefined();
  });

  it('extracts issuedAt timestamp', () => {
    const r = decodeJwt(SAMPLE_JWT);
    expect(r.issuedAt).toBeInstanceOf(Date);
    expect(r.issuedAt?.getUTCFullYear()).toBe(2018);
  });

  it('strips whitespace and newlines', () => {
    const withWhitespace = `  ${SAMPLE_JWT}\n  `;
    const r = decodeJwt(withWhitespace);
    expect(r.ok).toBe(true);
  });
});

describe('formatTimestamp', () => {
  it('formats date correctly', () => {
    const d = new Date(2025, 0, 15, 10, 30, 45);
    expect(formatTimestamp(d)).toBe('2025-01-15 10:30:45');
  });
});

describe('getTimeRemaining', () => {
  it('shows past tense for expired', () => {
    const past = new Date(Date.now() - 3600_000);
    expect(getTimeRemaining(past)).toContain('پیش منقضی شده');
  });

  it('returns English remaining-time messages', () => {
    const future = new Date(Date.now() + 3600_000);
    expect(getTimeRemaining(future, 'en')).toContain('remaining');
    const past = new Date(Date.now() - 3600_000);
    expect(getTimeRemaining(past, 'en')).toContain('Expired');
  });

  it('shows remaining for future', () => {
    const future = new Date(Date.now() + 3600_000);
    expect(getTimeRemaining(future)).toContain('تا انقضا');
  });
});
