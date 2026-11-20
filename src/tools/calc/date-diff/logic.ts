export interface DateDiffResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalHours: number;
  totalMinutes: number;
  businessDays: number;
  weekendDays: number;
}

export function calculateDateDiff(from: Date, to: Date): DateDiffResult | null {
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return null;

  let a = from;
  let b = to;
  if (a > b) { a = to; b = from; }

  let years = b.getFullYear() - a.getFullYear();
  let months = b.getMonth() - a.getMonth();
  let days = b.getDate() - a.getDate();

  if (days < 0) {
    months--;
    const daysInPrevMonth = new Date(b.getFullYear(), b.getMonth(), 0).getDate();
    days += daysInPrevMonth;
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const dayMs = 86_400_000;
  const startDay = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const endDay = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  const totalDays = Math.round((endDay - startDay) / dayMs);
  const totalWeeks = Math.floor(totalDays / 7);
  const totalHours = totalDays * 24;
  const totalMinutes = totalDays * 24 * 60;

  // Count full weeks arithmetically, then inspect at most six remaining days.
  // The interval is (a, b], matching the previous implementation's semantics.
  const fullWeeks = Math.floor(totalDays / 7);
  const remainingDays = totalDays % 7;
  let businessDays = fullWeeks * 5;
  const firstDay = new Date(a.getFullYear(), a.getMonth(), a.getDate() + 1).getDay();
  for (let i = 0; i < remainingDays; i++) {
    const dayOfWeek = (firstDay + i) % 7;
    if (dayOfWeek !== 4 && dayOfWeek !== 5) businessDays++;
  }
  const weekendDays = totalDays - businessDays;

  return {
    years, months, days, totalDays, totalWeeks, totalHours, totalMinutes,
    businessDays, weekendDays
  };
}

export function parseIsoDate(s: string): Date | null {
  if (!s) return null;
  const parts = s.split('-');
  if (parts.length !== 3) return null;
  const y = Number(parts[0]);
  const m = Number(parts[1]);
  const d = Number(parts[2]);
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return null;
  const dt = new Date(y, m - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return null;
  return dt;
}
