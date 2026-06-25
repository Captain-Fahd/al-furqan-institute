import type { Announcement, Trip, Verdict } from '@/app/(payload)/payload-types'

import { getMelbourneToday } from './hijri/calendar'
import { getPayloadClient } from './payload'

function melbourneStartOfTodayIso(): string {
  const { year, month, day } = getMelbourneToday()
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0)).toISOString()
}

/** The most recently published Melbourne verdict, regardless of status. */
export async function getLatestVerdict(): Promise<Verdict | null> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'verdicts',
    where: {
      and: [{ publishedAt: { exists: true } }, { region: { equals: 'melbourne' } }],
    },
    sort: '-publishedAt',
    limit: 1,
    depth: 1,
  })
  return docs[0] ?? null
}

/** The next scheduled trip on or after today (Melbourne), if any. */
export async function getNextTrip(): Promise<Trip | null> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'trips',
    where: {
      and: [
        { status: { equals: 'scheduled' } },
        { scheduledDate: { greater_than_equal: melbourneStartOfTodayIso() } },
      ],
    },
    sort: 'scheduledDate',
    limit: 1,
    depth: 0,
  })
  return docs[0] ?? null
}

/** Most recent published announcements, newest first. */
export async function getRecentAnnouncements(limit = 3): Promise<Announcement[]> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'announcements',
    where: { publishedAt: { exists: true } },
    sort: '-publishedAt',
    limit,
    depth: 0,
  })
  return docs
}
