import HijriDate, { toHijri } from 'hijri-date/lib/safe'

import { HIJRI_MONTHS } from './constants'

export type CalendarDay = {
  iso: string
  gregorianDay: number
  hijriDay: number
  hijriMonth: string
  hijriMonthIndex: number
  hijriYear: number
  weekday: number
  isCurrentMonth: boolean
  isToday: boolean
  isFriday: boolean
}

export type CalendarMonth = {
  hijriYear: number
  hijriMonth: number
  hijriLabel: string
  gregorianLabel: string
  weekdayLabels: string[]
  weeks: CalendarDay[][]
}

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Fixed labels so server (limited-ICU runtime) and client render identically — avoids
// Intl locale drift that causes React hydration mismatches.
const GREGORIAN_MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

function toIso(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getMelbourneToday(): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Australia/Melbourne',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())

  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value)
  return { year: get('year'), month: get('month'), day: get('day') }
}

function hijriMonthStartGregorian(hijriYear: number, hijriMonth: number): Date {
  const greg = new HijriDate(hijriYear, hijriMonth, 1).toGregorian()
  return new Date(greg.getFullYear(), greg.getMonth(), greg.getDate())
}

function nextHijriMonth(hijriYear: number, hijriMonth: number): { year: number; month: number } {
  return hijriMonth === 12 ? { year: hijriYear + 1, month: 1 } : { year: hijriYear, month: hijriMonth + 1 }
}

function buildDay(
  date: Date,
  targetYear: number,
  targetMonth: number,
  today: { year: number; month: number; day: number },
): CalendarDay {
  const hijri = toHijri(date)
  const hijriMonthIndex = hijri.getMonth()
  const hijriYear = hijri.getFullYear()
  const weekday = date.getDay()

  return {
    iso: toIso(date),
    gregorianDay: date.getDate(),
    hijriDay: hijri.getDate(),
    hijriMonth: HIJRI_MONTHS[hijriMonthIndex - 1],
    hijriMonthIndex,
    hijriYear,
    weekday,
    isCurrentMonth: hijriMonthIndex === targetMonth && hijriYear === targetYear,
    isToday:
      date.getFullYear() === today.year &&
      date.getMonth() + 1 === today.month &&
      date.getDate() === today.day,
    isFriday: weekday === 5,
  }
}

function buildGregorianLabel(start: Date, end: Date): string {
  const startMonth = GREGORIAN_MONTHS_SHORT[start.getMonth()]
  const endMonth = GREGORIAN_MONTHS_SHORT[end.getMonth()]
  const startYear = start.getFullYear()
  const endYear = end.getFullYear()

  if (startYear === endYear) {
    if (startMonth === endMonth) return `${startMonth} ${startYear}`
    return `${startMonth} – ${endMonth} ${startYear}`
  }

  return `${startMonth} ${startYear} – ${endMonth} ${endYear}`
}

export function buildCalendarMonth(
  hijriYear: number,
  hijriMonth: number,
  today: { year: number; month: number; day: number } = getMelbourneToday(),
): CalendarMonth {
  const monthStart = hijriMonthStartGregorian(hijriYear, hijriMonth)
  const next = nextHijriMonth(hijriYear, hijriMonth)
  const nextStart = hijriMonthStartGregorian(next.year, next.month)
  const monthEnd = new Date(nextStart)
  monthEnd.setDate(monthEnd.getDate() - 1)

  const gridStart = new Date(monthStart)
  gridStart.setDate(gridStart.getDate() - gridStart.getDay())

  const weeks: CalendarDay[][] = []
  const cursor = new Date(gridStart)

  while (true) {
    const week: CalendarDay[] = []
    for (let i = 0; i < 7; i += 1) {
      week.push(buildDay(new Date(cursor), hijriYear, hijriMonth, today))
      cursor.setDate(cursor.getDate() + 1)
    }
    weeks.push(week)

    const last = week[6]
    const passedMonth =
      last.hijriYear > hijriYear || (last.hijriYear === hijriYear && last.hijriMonthIndex > hijriMonth)
    if (passedMonth) break
    if (weeks.length >= 6) break
  }

  return {
    hijriYear,
    hijriMonth,
    hijriLabel: `${HIJRI_MONTHS[hijriMonth - 1]} ${hijriYear} AH`,
    gregorianLabel: buildGregorianLabel(monthStart, monthEnd),
    weekdayLabels: WEEKDAY_LABELS,
    weeks,
  }
}

export function getCurrentHijriMonth(): { hijriYear: number; hijriMonth: number } {
  const today = getMelbourneToday()
  const hijri = toHijri(new Date(today.year, today.month - 1, today.day))
  return { hijriYear: hijri.getFullYear(), hijriMonth: hijri.getMonth() }
}

export function getCurrentCalendarMonth(): CalendarMonth {
  const today = getMelbourneToday()
  const { hijriYear, hijriMonth } = getCurrentHijriMonth()
  return buildCalendarMonth(hijriYear, hijriMonth, today)
}
