export function toJalaali(gy: number, gm: number, gd: number) {
  let g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy = (gy <= 1600) ? 0 : 979;
  gy -= (gy <= 1600) ? 621 : 1600;
  let gy2 = (gm > 2) ? (gy + 1) : gy;
  let days = (365 * gy) + parseInt(String((gy2 + 3) / 4)) - parseInt(String((gy2 + 99) / 100)) + parseInt(String((gy2 + 399) / 400)) - 80 + gd + g_d_m[gm - 1];
  jy += 33 * parseInt(String(days / 12053));
  days %= 12053;
  jy += 4 * parseInt(String(days / 1461));
  days %= 1461;
  if (days > 365) {
    jy += parseInt(String((days - 1) / 365));
    days = (days - 1) % 365;
  }
  let jm = (days < 186) ? 1 + parseInt(String(days / 31)) : 7 + parseInt(String((days - 186) / 30));
  let jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30));
  return { jy, jm, jd };
}

export function toGregorian(jy: number, jm: number, jd: number) {
  let gy = (jy <= 979) ? 621 : 1600;
  jy -= (jy <= 979) ? 0 : 979;
  let days = (365 * jy) + (parseInt(String(jy / 33)) * 8) + parseInt(String(((jy % 33) + 3) / 4)) + 78 + jd + ((jm < 7) ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);
  gy += 400 * parseInt(String(days / 146097));
  days %= 146097;
  if (days > 36524) {
    gy += 100 * parseInt(String(--days / 36524));
    days %= 36524;
    if (days >= 365) days++;
  }
  gy += 4 * parseInt(String(days / 1461));
  days %= 1461;
  if (days > 365) {
    gy += parseInt(String((days - 1) / 365));
    days = (days - 1) % 365;
  }
  let gd = days + 1;
  let sal_a = [0, 31, ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let gm = 0;
  for (gm = 0; gm < 13 && gd > sal_a[gm]; gm++) gd -= sal_a[gm];
  return { gy, gm, gd };
}
