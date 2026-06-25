import type { Payload } from 'payload'

import { getFormattedHijriDate } from '../controllers/hijriDate'
import { getMelbourneToday } from './calendar'
import type { HijriDateDisplay } from './types'

const MELBOURNE_TZ = 'Australia/Melbourne'

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

/**
 * Resolves today's Hijri date for Melbourne, preferring an admin-entered
 * verdict over the calculated estimate.
 *
 * Confirmed months always come from a published, `sighted` Verdict — never
 * auto-computed. We take the latest such verdict whose start date is on or
 * before today; if today falls within that month (day 1–30) the date is
 * confirmed (`isEstimated: false`). Otherwise — no verdict, or we've run past
 * the verdict's month with no newer ruling — we fall back to the estimate.
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
        { status: { equals: 'sighted' } },
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

    // Hijri months run 29–30 days; within range the verdict covers today.
    if (diffDays >= 0 && diffDays <= 29) {
      const hijriDay = diffDays + 1
      return {
        hijriLabel: `${hijriDay} ${verdict.hijriMonth} ${verdict.hijriYear} AH`,
        gregorianLabel: melbourneLongDateLabel(),
        locationLabel: 'Melbourne, VIC',
        isEstimated: false,
      }
    }
  }

  return getFormattedHijriDate()
}
