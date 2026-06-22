import {toHijri} from 'hijri-date/lib/safe';
import { HijriDateDisplay } from '@/lib/hijri/types';
import { HIJRI_MONTHS } from '@/lib/hijri/constants';

export { HIJRI_MONTHS };

type HijriDateParts = {
    day: number,
    month: string,
    year: number,
    isEstimated: boolean,
}

export function getMelbourneGregorianDate(): {year: number, month: number, day: number} {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Australia/Melbourne',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(new Date());
    return {
        year: Number(parts.find(p => p.type === 'year')?.value),
        month: Number(parts.find(p => p.type === 'month')?.value),
        day: Number(parts.find(p => p.type === 'day')?.value),
    };
}

export function gregorianToHijriParts(gregorianDate: {year: number, month: number, day: number}): HijriDateParts {
    const hijriDate = toHijri(new Date(gregorianDate.year, gregorianDate.month - 1, gregorianDate.day));
    return {
        day: hijriDate.getDate(),
        month: HIJRI_MONTHS[hijriDate.getMonth() - 1],
        year: hijriDate.getFullYear(),
        isEstimated: true,
    }
}

function getMelbourneToday(): {year: number, month: number, day: number} {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Australia/Melbourne',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(new Date());
    
    const get = (type: string) => parts.find(p => p.type === type)?.value;
        return {
            year: Number(get('year')),
            month: Number(get('month')),
            day: Number(get('day')),
        }
}

const getEstimatedHijriDate = (): HijriDateParts => {
    const today = getMelbourneToday();
    const gregorianDate = new Date(today.year, today.month - 1, today.day);
    const hijriDate = toHijri(gregorianDate);

    return {
        day: hijriDate.getDate(),
        month: HIJRI_MONTHS[hijriDate.getMonth() - 1],
        year: hijriDate.getFullYear(),
        isEstimated: true,
    }
}

export function getFormattedHijriDate(): HijriDateDisplay {
    const today = getMelbourneToday();
    const estimatedHijriDate = getEstimatedHijriDate();
    const gregorianDate = new Intl.DateTimeFormat('en-AU', {
        timeZone: 'Australia/Melbourne',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date());
    
    return {
        hijriLabel: `${estimatedHijriDate.day} ${estimatedHijriDate.month} ${estimatedHijriDate.year} AH`,
        gregorianLabel: `${gregorianDate}`,
        locationLabel: 'Melbourne, VIC',
        isEstimated: estimatedHijriDate.isEstimated,
    };
}