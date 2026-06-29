import HijriDate from 'hijri-date/lib/safe'
import type { Payload } from 'payload'

import { getFormattedHijriDate } from '../controllers/hijriDate'
import { getMelbourneToday } from './calendar'
import { HIJRI_MONTHS } from './constants'
import type { HijriDateDisplay } from './types'

const MELBOURNE_TZ = 'Australia/Melbourne'

/**
 * How long a single verdict may anchor the displayed date before we treat the
 * data as stale and revert to the calculated estimate. Verdicts are published
 * monthly, so ~2 lunar months of slack means a missed/late ruling won't
 * immediately drop the site back to an estimate.
 */
const MAX_VERDICT_AGE_DAYS = 60

function melbourneParts(value: string | Date): { year: number; month: number; day: number } {
  const date = typeof value === 'string' ? new Date(value) : value
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: MELBOURNE_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value)
  return { year: get('year'), month: get('month'), day: get('day') }
}

function toUtcDay({ year, month, day }: { year: number; month: number; day: number }): number {
  return Date.UTC(year, month - 1, day)
}

function melbourneLongDateLabel(): string {
  return new Intl.DateTimeFormat('en-AU', {
    timeZone: MELBOURNE_TZ,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date())
}

/** UTC-day timestamp for the first of a given Hijri month (1-based month). */
function hijriMonthStartUtcDay(year: number, month: number): number {
  const greg = new HijriDate(year, month, 1).toGregorian()
  return Date.UTC(greg.getFullYear(), greg.getMonth(), greg.getDate())
}

/** Number of days in a Hijri month (29 or 30) per the conversion library. */
function hijriMonthLength(year: number, month: number): number {
  const next = month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 }
  const start = hijriMonthStartUtcDay(year, month)
  const nextStart = hijriMonthStartUtcDay(next.year, next.month)
  return Math.round((nextStart - start) / 86_400_000)
}

/**
 * Given a verdict's anchor (its `hijriMonth`/`hijriYear` begins on day 1) and
 * how many days have elapsed since that start, return today's Hijri date,
 * rolling forward through subsequent months if the verdict's own month has
 * already completed (e.g. a newer verdict hasn't been published yet).
 */
function advanceFromAnchor(
  monthName: string,
  hijriYear: number,
  diffDays: number,
): { hijriDay: number; monthName: string; hijriYear: number } | null {
  let month = HIJRI_MONTHS.indexOf(monthName as (typeof HIJRI_MONTHS)[number]) + 1
  if (month === 0) return null

  let year = hijriYear
  let day = diffDays + 1

  while (true) {
    const length = hijriMonthLength(year, month)
    if (day <= length) break
    day -= length
    month += 1
    if (month > 12) {
      month = 1
      year += 1
    }
  }

  return { hijriDay: day, monthName: HIJRI_MONTHS[month - 1], hijriYear: year }
}

/**
 * Resolves today's Hijri date for Melbourne, preferring the latest admin-entered
 * verdict over the calculated estimate.
 *
 * Confirmed dates always come from a published Melbourne verdict — never
 * auto-computed. We take the latest verdict (sighted *or* not-sighted) whose
 * `gregorianStartDate` is on or before today and treat that date as day 1 of its
 * `hijriMonth`/`hijriYear`. Today's date is counted forward from there, rolling
 * into the next month if a newer verdict hasn't landed yet. The estimate is only
 * used when no verdict exists, or the latest one is more than ~2 months stale
 * (`MAX_VERDICT_AGE_DAYS`).
 */
export async function resolveHijriDateDisplay(payload: Payload): Promise<HijriDateDisplay> {
  const today = getMelbourneToday()
  const cutoff = new Date(
    Date.UTC(today.year, today.month - 1, today.day, 23, 59, 59),
  ).toISOString()

  const { docs } = await payload.find({
    collection: 'verdicts',
    where: {
      and: [
        { publishedAt: { exists: true } },
        { region: { equals: 'melbourne' } },
        { gregorianStartDate: { less_than_equal: cutoff } },
      ],
    },
    sort: '-gregorianStartDate',
    limit: 1,
    depth: 0,
  })

  const verdict = docs[0]

  if (verdict) {
    const diffDays = Math.round(
      (toUtcDay(today) - toUtcDay(melbourneParts(verdict.gregorianStartDate))) / 86_400_000,
    )

    if (diffDays >= 0 && diffDays <= MAX_VERDICT_AGE_DAYS) {
      const resolved = advanceFromAnchor(verdict.hijriMonth, verdict.hijriYear, diffDays)
      if (resolved) {
        return {
          hijriLabel: `${resolved.hijriDay} ${resolved.monthName} ${resolved.hijriYear} AH`,
          gregorianLabel: melbourneLongDateLabel(),
          locationLabel: 'Melbourne, VIC',
          isEstimated: false,
        }
      }
    }
  }

  return getFormattedHijriDate()
}
