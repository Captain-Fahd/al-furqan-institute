import { getPrayerTimes } from './controllers/prayerTimesController'
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

function getMelbourneMinutesNow() {
  const [hour = '0', minute = '0'] = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Australia/Melbourne',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date()).split(':')

  return Number(hour) * 60 + Number(minute)
}

function getPrayerMinutes(time: string) {
  const [clock = '0:00'] = time.split(' ')
  const [hour = '0', minute = '0'] = clock.split(':')

  return Number(hour) * 60 + Number(minute)
}

function markNextPrayer(prayers: PrayerTime[]): PrayerTime[] {
  const now = getMelbourneMinutesNow()
  const nextPrayer = prayers.find((prayer) => getPrayerMinutes(prayer.time) > now) ?? prayers[0]

  return prayers.map((prayer) => ({
    ...prayer,
    isNext: prayer.name === nextPrayer?.name,
  }))
}

export async function getPrayerTimesDisplay(): Promise<PrayerTimesDisplay> {
  const prayerTimesResponse = await getPrayerTimes()
  const { date, meta, timings } = prayerTimesResponse.data
  const prayers: PrayerTime[] = [
    { name: 'Fajr', time: timings.Fajr },
    { name: 'Dhuhr', time: timings.Dhuhr },
    { name: 'Asr', time: timings.Asr },
    { name: 'Maghrib', time: timings.Maghrib },
    { name: 'Isha', time: timings.Isha },
  ]

  return {
    dateLabel: `${date.gregorian.weekday.en} ${date.readable}`,
    locationLabel: 'Melbourne, VIC',
    timezoneLabel: meta.timezone,
    prayers: markNextPrayer(prayers),
  }
}
