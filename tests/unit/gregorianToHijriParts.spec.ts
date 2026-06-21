import { expect, describe, it } from 'vitest'
import { gregorianToHijriParts, HIJRI_MONTHS } from '@/lib/controllers/hijriDate'

describe('gregorianToHijriParts', () => {
  it('should return 5 Muharram 1448 hijri date parts for 20 June 2026', () => {
    expect(gregorianToHijriParts({year: 2026, month: 6, day: 20})).toEqual({
        day: 5,
        month: 'Muharram',
        year: 1448,
        isEstimated: true, 
    })
})
})

describe('gregorianToHijriParts', () => {
  it('should return 4 Muharram 1448 hijri date parts for 19 June 2026', () => {
    expect(gregorianToHijriParts({year: 2026, month: 6, day: 19})).toEqual({
      day: 4,
      month: 'Muharram',
      year: 1448,
      isEstimated: true,
    })
})
})
describe('gregorianToHijriParts', () => {
  it('should return 2 Ramadan 1446 hijri date parts for 21 March 2025', () => {
    expect(gregorianToHijriParts({year: 2025, month: 3, day: 21})).toEqual({
      day: 2,
      month: 'Ramadan',
      year: 1446,
      isEstimated: true,
     })
    })
  })

  it('HIJRI_MONTHS should be an array of 12 months', () => {
    expect(HIJRI_MONTHS).toHaveLength(12)
    expect(new Set(HIJRI_MONTHS).size).toBe(12)
  })