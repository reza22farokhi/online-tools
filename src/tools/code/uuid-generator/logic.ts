export interface UuidOptions { count: number; uppercase: boolean; noHyphens: boolean; }
export const DEFAULT_OPTIONS: UuidOptions = { count: 1, uppercase: false, noHyphens: false };
export function generateUuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
  return hex.slice(0,8) + '-' + hex.slice(8,12) + '-' + hex.slice(12,16) + '-' + hex.slice(16,20) + '-' + hex.slice(20);
}
export function generateUuids(opts: UuidOptions): string {
  const count = Math.max(1, Math.min(1000, Math.floor(opts.count)));
  const lines: string[] = [];
  for (let i = 0; i < count; i++) {
    let u = generateUuid();
    if (opts.noHyphens) u = u.replace(/-/g, '');
    if (opts.uppercase) u = u.toUpperCase();
    lines.push(u);
  }
  return lines.join('\n');
}
