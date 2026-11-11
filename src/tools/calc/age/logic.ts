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

  const totalMs = ref.getTime() - birth.getTime();
  const totalDays = Math.floor(totalMs / 86_400_000);
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = years * 12 + months;
  const totalHours = Math.floor(totalMs / 3_600_000);
  const totalMinutes = Math.floor(totalMs / 60_000);

  let nextBirthday = new Date(ref.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBirthday <= ref) {
    nextBirthday = new Date(ref.getFullYear() + 1, birth.getMonth(), birth.getDate());
  }
  const nextBirthdayDays = Math.floor((nextBirthday.getTime() - ref.getTime()) / 86_400_000);

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
