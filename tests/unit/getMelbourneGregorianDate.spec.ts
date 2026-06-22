import { expect, afterEach, describe, vi, it } from 'vitest'
import { getMelbourneGregorianDate } from '@/lib/controllers/hijriDate'

describe('getMelbourneGregorianDate', () => {
  afterEach(() => vi.useRealTimers())

  it('returns 20 June 2026 in Melbourne near local midnight', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-19T14:00:00Z'))
    expect(getMelbourneGregorianDate()).toEqual({
      year: 2026,
      month: 6,
      day: 20,
    })
  })

  it('returns 16 January 2026 in Melbourne', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-16T00:00:00Z'))
    expect(getMelbourneGregorianDate()).toEqual({
      year: 2026,
      month: 1,
      day: 16,
    })
  })

  it('returns 19 June 2026 in Melbourne when UTC is still 18 June', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-19T00:00:00Z'))
    expect(getMelbourneGregorianDate()).toEqual({
      year: 2026,
      month: 6,
      day: 19,
    })
  })
})
