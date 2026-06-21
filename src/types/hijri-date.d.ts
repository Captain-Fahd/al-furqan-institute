declare module 'hijri-date/lib/safe' {
  export class HijriDate {
    constructor(...args: unknown[])

    getFullYear(): number
    getMonth(): number
    getDate(): number
    format(template?: string, locale?: string): string
  }

  export function toHijri(gregDate: Date): HijriDate

  export default HijriDate
}
