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
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; url: string }[], lang?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    ...(lang ? { inLanguage: lang } : {}),
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
    inLanguage: input.lang,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${input.url}tools/?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
}

export function buildFaqJsonLd(faqs: { q: string; a: string }[], lang?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    ...(lang ? { inLanguage: lang } : {}),
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a
      }
    }))
  };
}

export const SITE_NAME = 'Online Tools';
export const SITE_NAME_FA = 'ابزارهای آنلاین';
export const DEFAULT_DESCRIPTION = 'مجموعه‌ای از ابزارهای آنلاین رایگان برای متن، کدنویسی، سئو، تصویر، فایل و تاریخ؛ با پردازش سریع در مرورگر، بدون نیاز به نصب و با تمرکز بر حریم خصوصی.';
export const DEFAULT_DESCRIPTION_EN = 'Explore free online tools for text, code, SEO, images, files, colors, and date conversion, with fast browser-based processing and no software installation.';
