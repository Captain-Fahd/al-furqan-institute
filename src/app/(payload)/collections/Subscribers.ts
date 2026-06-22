import type { CollectionConfig } from 'payload'

import { adminOnly, adminPanelAdminsOrEditors, adminsOrEditors } from '../access'
import { ensureSubscriberTokens } from '../hooks/ensureSubscriberTokens'

/**
 * Email subscribers (PII). No public read. Public sign-up arrives in Phase C
 * via a dedicated API route; in the admin only admins can read the list.
 */
export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'confirmedAt', 'createdAt'],
  },
  access: {
    admin: adminPanelAdminsOrEditors,
    read: adminOnly,
    create: adminsOrEditors,
    update: adminOnly,
    delete: adminOnly,
  },
  hooks: {
    beforeChange: [ensureSubscriberTokens],
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'confirmedAt',
      type: 'date',
      admin: {
        description: 'Set once the subscriber confirms (double opt-in).',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'confirmToken',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        description: 'Auto-generated. Used in double opt-in confirmation links.',
      },
    },
    {
      name: 'unsubscribeToken',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        description: 'Auto-generated. Used in unsubscribe links.',
      },
    },
  ],
  timestamps: true,
}
