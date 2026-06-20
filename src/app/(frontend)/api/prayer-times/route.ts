import { NextResponse } from 'next/server'

import { getPrayerTimesDisplay } from '@/lib/prayerTimes'

export async function GET() {
  try {
    const prayerTimes = await getPrayerTimesDisplay()

    return NextResponse.json(prayerTimes)
  } catch (error) {
    console.error('Failed to load prayer times', error)

    return NextResponse.json({ error: 'Failed to load prayer times' }, { status: 503 })
  }
}
