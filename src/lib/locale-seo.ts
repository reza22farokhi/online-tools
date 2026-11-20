export type SupportedLocale = 'fa' | 'en';

export interface LocaleSeoUrls {
  canonical: string;
  fa: string;
  en: string;
  xDefault: string;
}

/**
 * Build stable, self-referencing locale URLs for the site's query-based
 * language variants. Existing non-locale query parameters are preserved.
 */
export function getLocaleSeoUrls(
  canonical: string | URL,
  site: string | URL,
  locale: SupportedLocale = 'fa'
): LocaleSeoUrls {
  const source = new URL(canonical.toString(), site);
  const fa = new URL(source);
  const en = new URL(source);
  fa.searchParams.set('lang', 'fa');
  en.searchParams.set('lang', 'en');

  return {
    canonical: (locale === 'en' ? en : fa).toString(),
    fa: fa.toString(),
    en: en.toString(),
    xDefault: fa.toString()
  };
}
