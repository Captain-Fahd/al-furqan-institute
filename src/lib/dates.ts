const MELBOURNE_TZ = 'Australia/Melbourne'

/**
 * Region → time zone mapping for sighting reports. Verdicts are always
 * Melbourne-local, but supporting reports (e.g. Indonesia) are labelled with
 * their own zone so readers aren't misled about when a sighting happened.
 */
const REGION_ZONES: Record<string, { timeZone: string; label: string }> = {
  melbourne: { timeZone: MELBOURNE_TZ, label: 'AEST/AEDT' },
  indonesia: { timeZone: 'Asia/Jakarta', label: 'WIB' },
}

function toDate(value: string | Date): Date {
  return typeof value === 'string' ? new Date(value) : value
}

/** Formats a Gregorian date for Melbourne, e.g. "Wed, 18 Mar 2026". */
export function formatMelbourneDate(value: string | Date): string {
  return new Intl.DateTimeFormat('en-AU', {
    timeZone: MELBOURNE_TZ,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(toDate(value))
}

/** Formats a date + time for Melbourne, e.g. "18 Mar 2026, 7:32 pm AEDT". */
export function formatMelbourneDateTime(value: string | Date): string {
  return new Intl.DateTimeFormat('en-AU', {
    timeZone: MELBOURNE_TZ,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(toDate(value))
}

/** Formats a time only for Melbourne, e.g. "7:32 pm". */
export function formatMelbourneTime(value: string | Date): string {
  return new Intl.DateTimeFormat('en-AU', {
    timeZone: MELBOURNE_TZ,
    hour: 'numeric',
    minute: '2-digit',
  }).format(toDate(value))
}

/**
 * Formats a date + time in a region's own zone with a trailing zone label.
 * Used for sighting reports so Indonesian times read in WIB, not AEST.
 */
export function formatRegionDateTime(value: string | Date, region: string): string {
  const zone = REGION_ZONES[region] ?? REGION_ZONES.melbourne
  const formatted = new Intl.DateTimeFormat('en-AU', {
    timeZone: zone.timeZone,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(toDate(value))
  return `${formatted} ${zone.label}`
}
