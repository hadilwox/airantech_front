import { toPersianDigits } from '@/utils/jalali'

export function formatToman(amount: string | number | null | undefined): string {
  if (amount === null || amount === undefined || amount === '') return '—'

  const numeric = Number(amount)
  const formatted = new Intl.NumberFormat('en-US').format(numeric)

  return `${toPersianDigits(formatted)} تومان`
}

export function formatNumber(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') return '—'

  return toPersianDigits(new Intl.NumberFormat('en-US').format(Number(value)))
}
