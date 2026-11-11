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

  const totalMs = b.getTime() - a.getTime();
  const totalDays = Math.floor(totalMs / 86_400_000);
  const totalWeeks = Math.floor(totalDays / 7);
  const totalHours = Math.floor(totalMs / 3_600_000);
  const totalMinutes = Math.floor(totalMs / 60_000);

  let businessDays = 0;
  let weekendDays = 0;
  const cursor = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const end = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  while (cursor <= end) {
    const dow = cursor.getDay();
    if (dow === 5 || dow === 6) {
      weekendDays++;
    } else {
      businessDays++;
    }
    cursor.setDate(cursor.getDate() + 1);
  }

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
