export type HashAlgorithm = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';

export const ALGORITHMS: { id: HashAlgorithm; label: string; bits: number }[] = [
  { id: 'SHA-1', label: 'SHA-1', bits: 160 },
  { id: 'SHA-256', label: 'SHA-256', bits: 256 },
  { id: 'SHA-384', label: 'SHA-384', bits: 384 },
  { id: 'SHA-512', label: 'SHA-512', bits: 512 }
];

export async function computeHash(text: string, algorithm: HashAlgorithm): Promise<string> {
  if (typeof crypto === 'undefined' || !crypto.subtle) {
    throw new Error('Web Crypto API در دسترس نیست (اتصال امن HTTPS لازم است)');
  }
  const data = new TextEncoder().encode(text);
  const buffer = await crypto.subtle.digest(algorithm, data);
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}
