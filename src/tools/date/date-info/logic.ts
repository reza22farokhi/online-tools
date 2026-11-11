export function isLeapYear(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

export function dayOfYear(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 1);
  return Math.floor((d.getTime() - start.getTime()) / 86400000) + 1;
}

export function daysInYear(y: number): number {
  return isLeapYear(y) ? 366 : 365;
}

export function daysRemainingInYear(d: Date): number {
  return daysInYear(d.getFullYear()) - dayOfYear(d);
}

export function isoWeekNumber(d: Date): number {
  const target = new Date(d.getTime());
  const dayNr = (d.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.getTime();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  return 1 + Math.ceil((firstThursday - target.getTime()) / 604800000);
}

export function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}
