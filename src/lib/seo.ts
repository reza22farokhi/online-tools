export function buildWebAppJsonLd(input: {
  name: string;
  description: string;
  url: string;
  lang: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: input.name,
    description: input.description,
    url: input.url,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    inLanguage: input.lang,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    }
  };
}

export function buildBreadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url
    }))
  };
}

export function buildWebSiteJsonLd(input: {
  name: string;
  url: string;
  description: string;
  lang: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: input.name,
    url: input.url,
    description: input.description,
    inLanguage: input.lang
  };
}

export const SITE_NAME = 'Online Tools';
export const SITE_NAME_FA = 'ابزارهای آنلاین';
export const DEFAULT_DESCRIPTION =
  'مجموعه‌ای از ابزارهای آنلاین رایگان و حریم خصوصی‌محور برای متن، کد، سئو، تصویر و بیشتر.';
export const DEFAULT_DESCRIPTION_EN =
  'A collection of free, privacy-first online tools for text, code, SEO, images, and more.';
