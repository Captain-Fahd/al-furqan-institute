import type { CollectionConfig } from 'payload'

import {
  adminPanelAdminsOrEditors,
  adminsOrEditors,
  publicRead,
} from '../access'

/** A scheduled moonsighting outing. */
export const Trips: CollectionConfig = {
  slug: 'trips',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'scheduledDate', 'status', 'location'],
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
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'scheduledDate',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' } },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'sunsetTime',
          type: 'date',
          admin: {
            width: '50%',
            date: { pickerAppearance: 'timeOnly', displayFormat: 'h:mm a' },
          },
        },
        {
          name: 'moonsetTime',
          type: 'date',
          admin: {
            width: '50%',
            date: { pickerAppearance: 'timeOnly', displayFormat: 'h:mm a' },
          },
        },
      ],
    },
    {
      name: 'location',
      type: 'text',
    },
    {
      name: 'attendees',
      type: 'array',
      labels: { singular: 'Attendee', plural: 'Attendees' },
      fields: [{ name: 'name', type: 'text', required: true }],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'scheduled',
      options: [
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    {
      name: 'outcome',
      type: 'textarea',
      admin: { description: 'Summary of what happened on the trip.' },
    },
  ],
  timestamps: true,
}
