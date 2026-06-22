import type { CollectionConfig } from 'payload'

import { HIJRI_MONTHS } from '@/lib/hijri/constants'
import {
  adminPanelAdminsOrEditors,
  adminsOrEditors,
  publishedOrEditors,
} from '../access'
import { notifySubscribersOnVerdict } from '../hooks/notifySubscribersOnVerdict'
import { upsertHijriMonthFromVerdict } from '../hooks/upsertHijriMonthFromVerdict'

const hijriMonthOptions = HIJRI_MONTHS.map((month) => ({
  label: month,
  value: month,
}))

/**
 * The institute's official ruling for a Hijri month start in Melbourne.
 * Source of truth for confirmed months — never auto-computed.
 */
export const Verdicts: CollectionConfig = {
  slug: 'verdicts',
  admin: {
    useAsTitle: 'hijriMonth',
    defaultColumns: ['hijriMonth', 'hijriYear', 'status', 'gregorianStartDate', 'publishedAt'],
    description:
      'Official moonsighting rulings for Melbourne. Publishing a sighted verdict confirms the Hijri month start.',
  },
  access: {
    admin: adminPanelAdminsOrEditors,
    read: publishedOrEditors,
    create: adminsOrEditors,
    update: adminsOrEditors,
    delete: adminsOrEditors,
  },
  hooks: {
    afterChange: [upsertHijriMonthFromVerdict, notifySubscribersOnVerdict],
  },
  fields: [
    {
      name: 'hijriMonth',
      type: 'select',
      required: true,
      options: hijriMonthOptions,
    },
    {
      name: 'hijriYear',
      type: 'number',
      required: true,
      min: 1,
      admin: { description: 'Hijri (AH) year, e.g. 1447.' },
    },
    {
      name: 'gregorianStartDate',
      type: 'date',
      required: true,
      admin: {
        description: 'The Gregorian date this Hijri month begins in Melbourne.',
        date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' },
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'sighted',
      options: [
        { label: 'Sighted', value: 'sighted' },
        { label: 'Not sighted', value: 'not-sighted' },
      ],
    },
    {
      name: 'region',
      type: 'select',
      required: true,
      defaultValue: 'melbourne',
      options: [{ label: 'Melbourne, VIC', value: 'melbourne' }],
      admin: {
        description: 'Verdicts are issued for Melbourne, Victoria, Australia.',
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      admin: {
        description: 'Short public-facing note shown with the verdict.',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      index: true,
      admin: {
        position: 'sidebar',
        description:
          'Set this to publish the verdict publicly. Leave empty to keep it as a draft.',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
  ],
  timestamps: true,
}
