import { Box } from '@chakra-ui/react'
import type { Metadata } from 'next'
import React from 'react'

import { CalendarSection } from '@/components/calendar/CalendarSection'
import { HeroSection } from '@/components/hero/HeroSection'
import { RecentAnnouncements } from '@/components/home/RecentAnnouncements'
import { SubscribeCta } from '@/components/home/SubscribeCta'
import { UpcomingTrip } from '@/components/home/UpcomingTrip'
import { VerdictAnnouncement } from '@/components/verdict/VerdictAnnouncement'
import { VerdictBanner } from '@/components/verdict/VerdictBanner'
import { getLatestVerdict, getNextTrip, getRecentAnnouncements } from '@/lib/content'
import { resolveHijriDateDisplay } from '@/lib/hijri'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Al-Furqan Institute — Moonsighting verdicts for Melbourne',
  description:
    'Official Hijri month verdicts and moonsighting updates for Melbourne, Australia. See the latest ruling, live prayer times, and the Hijri calendar.',
  openGraph: {
    title: 'Al-Furqan Institute — Moonsighting verdicts for Melbourne',
    description:
      'Official Hijri month verdicts and moonsighting updates for Melbourne, Australia.',
    type: 'website',
  },
}

export default async function HomePage() {
  const payload = await getPayloadClient()

  const [hijri, verdict, nextTrip, announcements] = await Promise.all([
    resolveHijriDateDisplay(payload),
    getLatestVerdict(),
    getNextTrip(),
    getRecentAnnouncements(3),
  ])

  return (
    <Box as="main" bg="brand.900" minH="100dvh">
      <VerdictBanner verdict={verdict} hijri={hijri} />
      <HeroSection hijri={hijri} />
      <CalendarSection />
      <VerdictAnnouncement verdict={verdict} />
      <UpcomingTrip trip={nextTrip} />
      <RecentAnnouncements announcements={announcements} />
      <SubscribeCta />
    </Box>
  )
}
