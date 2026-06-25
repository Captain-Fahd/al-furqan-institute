import { HIJRI_MONTHS } from '@/lib/hijri/constants'

// Shared Melbourne date formatting lives in src/lib/dates.ts; re-exported here
// so existing email callers keep their import path.
export { formatMelbourneDate } from '@/lib/dates'

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
