import type { CollectionConfig } from 'payload'

import {
  adminOnly,
  adminPanelAdminOnly,
  adminsOrSelf,
  adminsOrSelfQuery,
  allowFirstUserCreate,
} from '../access'
import { isAdmin, USER_ROLES } from '../access/roles'
import { assignAdminToFirstUser } from '../hooks/assignAdminToFirstUser'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    admin: adminPanelAdminOnly,
    create: allowFirstUserCreate,
    read: adminsOrSelfQuery,
    update: adminsOrSelf,
    delete: adminOnly,
  },
  hooks: {
    beforeChange: [assignAdminToFirstUser],
  },
  fields: [
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      options: [...USER_ROLES],
      defaultValue: ['editor'],
      required: true,
      saveToJWT: true,
      access: {
        read: ({ req: { user } }) => isAdmin(user),
        update: ({ req: { user } }) => isAdmin(user),
      },
    },
  ],
}
