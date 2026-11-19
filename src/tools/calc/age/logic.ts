export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  totalHours: number;
  totalMinutes: number;
  nextBirthdayDays: number;
}

export function calculateAge(birth: Date, ref: Date = new Date()): AgeResult | null {
  if (Number.isNaN(birth.getTime()) || Number.isNaN(ref.getTime())) return null;
  if (birth > ref) return null;

  let years = ref.getFullYear() - birth.getFullYear();
  let months = ref.getMonth() - birth.getMonth();
  let days = ref.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    const daysInPrevMonth = new Date(ref.getFullYear(), ref.getMonth(), 0).getDate();
    days += daysInPrevMonth;
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const dayMs = 86_400_000;
  const birthDay = Date.UTC(birth.getFullYear(), birth.getMonth(), birth.getDate());
  const refDay = Date.UTC(ref.getFullYear(), ref.getMonth(), ref.getDate());
  const totalDays = Math.round((refDay - birthDay) / dayMs);
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = years * 12 + months;
  const totalHours = totalDays * 24;
  const totalMinutes = totalDays * 24 * 60;

  let nextBirthday = Date.UTC(ref.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBirthday <= refDay) {
    nextBirthday = Date.UTC(ref.getFullYear() + 1, birth.getMonth(), birth.getDate());
  }
  const nextBirthdayDays = Math.round((nextBirthday - refDay) / dayMs);

  return {
    years, months, days,
    totalDays, totalWeeks, totalMonths,
    totalHours, totalMinutes, nextBirthdayDays
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
