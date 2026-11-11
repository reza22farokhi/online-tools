export interface OgData {
  title: string;
  description: string;
  url: string;
  image: string;
}

export function extractDomain(url: string): string {
  if (!url) return 'example.com';
  let clean = url.trim();
  if (!clean.startsWith('http')) clean = 'https://' + clean;
  try {
    const u = new URL(clean);
    return u.hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}
