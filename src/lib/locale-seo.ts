export type SupportedLocale = 'fa' | 'en';

export interface LocaleSeoUrls {
  canonical: string;
  fa: string;
  en: string;
  xDefault: string;
}

/**
 * Build canonical and hreflang URLs for the site's query-based language variants.
 * Persian uses the clean canonical URL; English uses the explicit ?lang=en URL.
 */
export function getLocaleSeoUrls(
  canonical: string | URL,
  site: string | URL,
  locale: SupportedLocale = 'fa'
): LocaleSeoUrls {
  const input = new URL(canonical.toString(), site);
  const siteUrl = new URL(site);
  // Canonical URLs must always use the configured production origin, even when
  // Astro is rendered by a local preview server (localhost).
  const source = new URL(`${input.pathname}${input.search}${input.hash}`, siteUrl);
  const canonicalUrl = new URL(source);
  canonicalUrl.searchParams.delete('lang');
  const en = new URL(canonicalUrl);
  en.searchParams.set('lang', 'en');

  return {
    // The default Persian document uses the clean path listed in the sitemap.
    // The explicit English variant remains independently canonicalized.
    canonical: (locale === 'en' ? en : canonicalUrl).toString(),
    fa: canonicalUrl.toString(),
    en: en.toString(),
    xDefault: canonicalUrl.toString()
  };
}
