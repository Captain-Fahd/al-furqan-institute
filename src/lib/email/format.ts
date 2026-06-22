import { HIJRI_MONTHS } from '@/lib/hijri/constants'

const MELBOURNE_TZ = 'Australia/Melbourne'

/** Formats a Gregorian date for Melbourne, e.g. "Wed, 18 Mar 2026". */
export function formatMelbourneDate(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value
  return new Intl.DateTimeFormat('en-AU', {
    timeZone: MELBOURNE_TZ,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

/** Human label for a verdict subject line and heading. */
export function verdictHeadline(
  hijriMonth: (typeof HIJRI_MONTHS)[number] | string,
  hijriYear: number,
  status: 'sighted' | 'not-sighted',
): string {
  return status === 'sighted'
    ? `${hijriMonth} ${hijriYear} AH has begun`
    : `${hijriMonth} ${hijriYear} AH — crescent not sighted`
}
