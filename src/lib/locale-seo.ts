export type SupportedLocale = 'fa' | 'en';

export interface LocaleSeoUrls {
  canonical: string;
  fa: string;
  en: string;
  xDefault: string;
}

/**
 * Build reciprocal, path-based locale URLs.
 * Persian is the default root; English is published under /en/.
 * Legacy ?lang= links are normalized to the corresponding path URL.
 */
export function getLocaleSeoUrls(
  canonical: string | URL,
  site: string | URL,
  locale: SupportedLocale = 'fa'
): LocaleSeoUrls {
  const input = new URL(canonical.toString(), site);
  const origin = new URL(site);
  const params = new URLSearchParams(input.search);
  params.delete('lang');

  let pathname = input.pathname.replace(/^\/en(?=\/|$)/, '') || '/';
  if (!pathname.startsWith('/')) pathname = '/' + pathname;
  if (!pathname.endsWith('/')) pathname += '/';

  const suffix = params.size ? `?${params.toString()}` : '';
  const fa = new URL(`${pathname}${suffix}`, origin).toString();
  const enPath = pathname === '/' ? '/en/' : `/en${pathname}`;
  const en = new URL(`${enPath}${suffix}`, origin).toString();

  return {
    canonical: locale === 'en' ? en : fa,
    fa,
    en,
    xDefault: fa
  };
}
