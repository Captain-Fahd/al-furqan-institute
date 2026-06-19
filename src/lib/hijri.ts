export type HijriDateDisplay = {
  hijriLabel: string
  gregorianLabel: string
  locationLabel: string
  isEstimated?: boolean
}

/** Placeholder until a Hijri library + verdict-aware logic is wired up. */
export function getHijriDateDisplay(): HijriDateDisplay {
  return {
    hijriLabel: '22 Dhul-Hijjah 1447 AH',
    gregorianLabel: 'Thursday 19 June 2026',
    locationLabel: 'Melbourne, VIC',
    isEstimated: true,
  }
}
