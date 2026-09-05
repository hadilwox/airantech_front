import { isValidJalaaliDate, jalaaliMonthLength, toGregorian, toJalaali } from 'jalaali-js'

const PERSIAN_MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند',
]

/** Converts an ISO date (YYYY-MM-DD, as stored/returned by the API) to a Jalali display string. */
export function toJalaliDisplay(isoDate: string | null | undefined): string {
  if (!isoDate) return '—'

  const [gy, gm, gd] = isoDate.split('-').map(Number)
  const { jy, jm, jd } = toJalaali(gy, gm, gd)

  return `${toPersianDigits(jd)} ${PERSIAN_MONTHS[jm - 1]} ${toPersianDigits(jy)}`
}

/** Converts a Jalali (year, month, day) selection to an ISO date string for the API. */
export function gregorianFromJalali(jy: number, jm: number, jd: number): string {
  const { gy, gm, gd } = toGregorian(jy, jm, jd)

  return `${String(gy).padStart(4, '0')}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`
}

/** Converts an ISO date string to its Jalali (year, month, day) parts, for populating a JalaliDateInput. */
export function jalaliFromIso(isoDate: string | null | undefined): { jy: number; jm: number; jd: number } | null {
  if (!isoDate) return null

  const [gy, gm, gd] = isoDate.split('-').map(Number)

  return toJalaali(gy, gm, gd)
}

export function daysInJalaliMonth(jy: number, jm: number): number {
  return jalaaliMonthLength(jy, jm)
}

export { isValidJalaaliDate }
export const PERSIAN_MONTH_NAMES = PERSIAN_MONTHS

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']

export function toPersianDigits(value: string | number): string {
  return String(value).replace(/[0-9]/g, (digit) => PERSIAN_DIGITS[Number(digit)])
}
