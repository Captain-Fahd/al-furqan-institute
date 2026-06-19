export type PrayerName = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha'

export type PrayerTime = {
  name: PrayerName
  time: string
  isNext?: boolean
}

export type PrayerTimesDisplay = {
  dateLabel: string
  locationLabel: string
  timezoneLabel: string
  prayers: PrayerTime[]
}

/** Placeholder until Al-Adhan API integration is wired up. */
export function getPrayerTimesDisplay(): PrayerTimesDisplay {

  // const prayers = await getPrayerTimes();
  return {
    dateLabel: 'Thursday 19 June 2026',
    locationLabel: 'Melbourne, VIC',
    timezoneLabel: 'AEST',
    prayers: [
      { name: 'Fajr', time: '5:42 am' },
      { name: 'Dhuhr', time: '12:18 pm' },
      { name: 'Asr', time: '3:04 pm', isNext: true },
      { name: 'Maghrib', time: '5:22 pm' },
      { name: 'Isha', time: '6:38 pm' },
    ],
  }
}
