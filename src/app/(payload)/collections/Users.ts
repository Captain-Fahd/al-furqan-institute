import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  roles: ('admin' | 'editor'),
  saveToJWT: true,
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
}
