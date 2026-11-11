export const MAX_TITLE_LEN = 60;
export const MAX_DESC_LEN = 160;

export function truncate(text: string, max: number): string {
  if (!text) return '';
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1).trimEnd();
  return cut + '…';
}

export function formatUrlForSerp(url: string): string {
  if (!url) return 'example.com';
  let clean = url.trim();
  if (!clean.startsWith('http')) clean = 'https://' + clean;
  try {
    const u = new URL(clean);
    const parts = u.pathname.split('/').filter(Boolean);
    const domain = u.hostname.replace(/^www\./, '');
    return [domain, ...parts].join(' › ');
  } catch {
    return url;
  }
}
