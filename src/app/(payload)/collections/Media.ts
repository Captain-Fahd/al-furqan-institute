import type { CollectionConfig } from 'payload'

import { adminPanelAdminsOrEditors, adminsOrEditors } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    admin: adminPanelAdminsOrEditors,
    read: () => true,
    create: adminsOrEditors,
    update: adminsOrEditors,
    delete: adminsOrEditors,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
