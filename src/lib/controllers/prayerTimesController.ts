import axios from 'axios'

export type AlAdhanTimings = {
  Fajr: string
  Dhuhr: string
  Asr: string
  Maghrib: string
  Isha: string
  [key: string]: string
}

export type AlAdhanPrayerTimesResponse = {
  code: number
  status: string
  data: {
    timings: AlAdhanTimings
    date: {
      readable: string
      gregorian: {
        weekday: {
          en: string
        }
      }
    }
    meta: {
      timezone: string
    }
  }
}

export const getPrayerTimes = async (): Promise<AlAdhanPrayerTimesResponse> => {
  const date = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Australia/Melbourne',
  }).format(new Date()).replaceAll('/', '-')
  const options = {
    method: 'GET',
    url: `https://api.aladhan.com/v1/timingsByAddress/${date}`,
    params: {
      address: 'Melbourne, VIC, Australia',
      method: '3',
      shafaq: 'general',
      tune: '5%2C3%2C5%2C7%2C9%2C-1%2C0%2C8%2C-6',
      school: '0',
      midnightMode: '0',
      timezonestring: 'Australia/Melbourne',
      latitudeAdjustmentMethod: '1',
      calendarMethod: 'UAQ',
      iso8601: 'false',
    },
    headers: {
      'Accept-Encoding': '',
    },
  }

  const { data } = await axios.request<AlAdhanPrayerTimesResponse>(options)

  return data
}