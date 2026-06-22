export const HIJRI_MONTHS = [
  'Muharram',
  'Safar',
  "Rabi' I",
  "Rabi' II",
  'Jumada I',
  'Jumada II',
  'Rajab',
  "Sha'ban",
  'Ramadan',
  'Shawwal',
  "Dhul-Qi'dah",
  'Dhul-Hijjah',
] as const

export type HijriMonthName = (typeof HIJRI_MONTHS)[number]
