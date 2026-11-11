export { toJalali, toGregorian, gregorianToHijri, JALALI_MONTHS, HIJRI_MONTHS } from '../../../lib/calendar';

export function timestampToDate(ts: number): Date | null {
  if (!Number.isFinite(ts)) return null;
  const ms = ts > 9999999999 ? ts : ts * 1000;
  const d = new Date(ms);
  if (isNaN(d.getTime())) return null;
  return d;
}

export function dateToTimestamp(d: Date, inSeconds = true): number {
  const ms = d.getTime();
  return inSeconds ? Math.floor(ms / 1000) : ms;
}

export function getCurrentTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

export function formatDateTime(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}
