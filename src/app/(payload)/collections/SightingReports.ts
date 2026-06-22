import type { CollectionConfig } from 'payload'

import {
  adminPanelAdminsOrEditors,
  adminsOrEditors,
  publicRead,
} from '../access'

/**
 * An individual crescent-sighting observation. Indonesian reports are
 * supporting evidence (Indonesia sights earlier / further west); the published
 * ruling remains Melbourne-local.
 */
export const SightingReports: CollectionConfig = {
  slug: 'sighting-reports',
  labels: { singular: 'Sighting Report', plural: 'Sighting Reports' },
  admin: {
    useAsTitle: 'observer',
    defaultColumns: ['date', 'region', 'observer', 'result', 'method'],
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
      name: 'date',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' } },
    },
    {
      name: 'region',
      type: 'select',
      required: true,
      defaultValue: 'melbourne',
      options: [
        { label: 'Melbourne, VIC', value: 'melbourne' },
        { label: 'Indonesia (supporting evidence)', value: 'indonesia' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description:
          'Indonesian sightings are supporting evidence only; verdicts are Melbourne-local.',
      },
    },
    {
      name: 'observer',
      type: 'text',
      required: true,
    },
    {
      name: 'method',
      type: 'select',
      options: [
        { label: 'Naked eye', value: 'naked-eye' },
        { label: 'Optical aid (binoculars)', value: 'optical-aid' },
        { label: 'Telescope', value: 'telescope' },
      ],
    },
    {
      name: 'result',
      type: 'select',
      required: true,
      defaultValue: 'not-sighted',
      options: [
        { label: 'Sighted', value: 'sighted' },
        { label: 'Not sighted', value: 'not-sighted' },
        { label: 'Inconclusive', value: 'inconclusive' },
      ],
    },
    {
      name: 'conditions',
      type: 'textarea',
      admin: { description: 'Weather, visibility, horizon conditions.' },
    },
    {
      name: 'trip',
      type: 'relationship',
      relationTo: 'trips',
      admin: { description: 'Optional trip this report came from.' },
    },
  ],
  timestamps: true,
}
