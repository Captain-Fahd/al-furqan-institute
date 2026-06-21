import { expect, afterEach, describe, vi, it } from "vitest";
import { getMelbourneGregorianDate } from "@/lib/controllers/hijriDate";
//testing date 20/06/2026
describe('getMelbourneGregorianDate', () => {
    afterEach(() => vi.useRealTimers())

    it('uses Melbourne date, not UTC date, near midnight', () => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date('2026-06-19T00:00:00Z'))
        expect(getMelbourneGregorianDate()).toEqual({
            year: 2026,
            month: 6,
            day: 20,
        })
    })
})
//testing date 16/01/2026
describe('getMelbourneGregorianDate', () => {
    afterEach(() => vi.useRealTimers())

    it('uses Melbourne date, not UTC date, near midnight', () => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date('2026-01-16T00:00:00Z'))
        expect(getMelbourneGregorianDate()).toEqual({
            year: 2026,
            month: 1,
            day: 16,
        })
    })
})
//testing date 19/06/2026
describe('getMelbourneGregorianDate', () => {
    afterEach(() => vi.useRealTimers())

    it('uses Melbourne date, not UTC date, near midnight', () => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date('2026-06-19T00:00:00Z'))
        expect(getMelbourneGregorianDate()).toEqual({
            year: 2026,
            month: 6,
            day: 19,
        })
    })
})
