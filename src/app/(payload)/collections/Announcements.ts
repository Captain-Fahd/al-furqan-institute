import type { CollectionConfig } from 'payload'

import {
  adminPanelAdminsOrEditors,
  adminsOrEditors,
  publishedOrEditors,
} from '../access'

/** General community announcements. */
export const Announcements: CollectionConfig = {
  slug: 'announcements',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedAt'],
  },
  access: {
    admin: adminPanelAdminsOrEditors,
    read: publishedOrEditors,
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
      name: 'body',
      type: 'richText',
      required: true,
    },
    {
      name: 'publishedAt',
      type: 'date',
      index: true,
      admin: {
        position: 'sidebar',
        description:
          'Set this to publish the announcement publicly. Leave empty to keep it as a draft.',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
  ],
  timestamps: true,
}
