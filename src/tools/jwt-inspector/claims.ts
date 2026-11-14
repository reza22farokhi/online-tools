// دیکشنری claims استاندارد با توضیح فارسی برای UI

export interface ClaimDesc {
  key: string;
  fa: string;
  en: string;
  kind: 'string' | 'number' | 'date' | 'array';
  hint?: string;
}

export const STANDARD_CLAIMS: Record<string, ClaimDesc> = {
  iss: { key: 'iss', fa: 'صادرکننده', en: 'Issuer', kind: 'string', hint: 'کس یا سرویسی که توکن را صادر کرده' },
  sub: { key: 'sub', fa: 'موضوع', en: 'Subject', kind: 'string', hint: 'شناسه کاربر یا موجودیتی که توکن به آن اشاره دارد' },
  aud: { key: 'aud', fa: 'مخاطب', en: 'Audience', kind: 'string', hint: 'گیرنده مجاز توکن (مثلاً URL سرویس)' },
  exp: { key: 'exp', fa: 'زمان انقضا', en: 'Expiration Time', kind: 'date', hint: 'پس از این زمان توکن معتبر نیست' },
  nbf: { key: 'nbf', fa: 'شروع اعتبار', en: 'Not Before', kind: 'date', hint: 'پیش از این زمان توکن معتبر نیست' },
  iat: { key: 'iat', fa: 'زمان صدور', en: 'Issued At', kind: 'date', hint: 'زمانی که توکن صادر شده' },
  jti: { key: 'jti', fa: 'شناسه توکن', en: 'JWT ID', kind: 'string', hint: 'شناسه یکتای توکن برای جلوگیری از replay' },
};

export function describeClaim(key: string): ClaimDesc | null {
  return STANDARD_CLAIMS[key] ?? null;
}

export function formatClaimValue(
  key: string,
  value: unknown,
  locale: 'fa' | 'en' = 'fa'
): string {
  const desc = STANDARD_CLAIMS[key];
  if (desc?.kind === 'date' && typeof value === 'number') {
    try {
      return new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
        dateStyle: 'medium',
        timeStyle: 'medium',
      }).format(new Date(value * 1000));
    } catch {
      return String(value);
    }
  }
  if (Array.isArray(value)) return value.map(String).join(', ');
  return String(value);
}
