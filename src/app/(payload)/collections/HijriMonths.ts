import type { CollectionConfig } from 'payload'

import { HIJRI_MONTHS } from '@/lib/hijri/constants'
import {
  adminPanelAdminsOrEditors,
  adminsOrEditors,
  publicRead,
} from '../access'

const hijriMonthOptions = HIJRI_MONTHS.map((month) => ({
  label: month,
  value: month,
}))

/**
 * Confirmed/known Hijri months. Confirmed months are upserted automatically
 * when a sighted Verdict is published, but staff can also add estimated
 * upcoming months manually (leave `isConfirmed` off for estimates).
 */
export const HijriMonths: CollectionConfig = {
  slug: 'hijri-months',
  labels: { singular: 'Hijri Month', plural: 'Hijri Months' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'year', 'confirmedStartDate', 'isConfirmed'],
  },
  access: {
    admin: adminPanelAdminsOrEditors,
    read: publicRead,
    create: adminsOrEditors,
    update: adminsOrEditors,
    delete: adminsOrEditors,
  },
  fields: [
    {
      name: 'name',
      type: 'select',
      required: true,
      options: hijriMonthOptions,
    },
    {
      name: 'year',
      type: 'number',
      required: true,
      min: 1,
      admin: { description: 'Hijri (AH) year, e.g. 1447.' },
    },
    {
      name: 'confirmedStartDate',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' } },
    },
    {
      name: 'isConfirmed',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'On = confirmed by an official verdict. Off = estimated/upcoming.',
      },
    },
  ],
  timestamps: true,
}
