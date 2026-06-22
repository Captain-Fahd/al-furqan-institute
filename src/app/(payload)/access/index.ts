import type { Access } from 'payload'

import { isAdmin, isAdminOrEditor, type UserWithRoles } from './roles'

export { USER_ROLES, type UserRole, type UserWithRoles } from './roles'
export { isAdmin, isAdminOrEditor, hasRole } from './roles'

export const adminOnly: Access = ({ req: { user } }) =>
  isAdmin(user as UserWithRoles)

export const adminPanelAdminOnly = ({ req: { user } }: { req: { user: unknown } }) =>
  isAdmin(user as UserWithRoles)

export const adminPanelAdminsOrEditors = ({
  req: { user },
}: {
  req: { user: unknown }
}) => isAdminOrEditor(user as UserWithRoles)

export const adminsOrEditors: Access = ({ req: { user } }) =>
  isAdminOrEditor(user as UserWithRoles)

export const adminsOrSelf: Access = ({ req: { user }, id }) => {
  const authUser = user as UserWithRoles
  if (isAdmin(authUser)) return true
  return authUser?.id === id
}

export const adminsOrSelfQuery: Access = ({ req: { user } }) => {
  const authUser = user as UserWithRoles
  if (isAdmin(authUser)) return true
  if (!authUser?.id) return false
  return { id: { equals: authUser.id } }
}

/** Public read for non-gated content (trips, reports, hijri months). */
export const publicRead: Access = () => true

/**
 * Public read for published content only; admins/editors see everything
 * (drafts included). "Published" means `publishedAt` is set.
 */
export const publishedOrEditors: Access = ({ req: { user } }) => {
  if (isAdminOrEditor(user as UserWithRoles)) return true
  return { publishedAt: { exists: true } }
}

/** Allows the first user bootstrap flow; admins create users thereafter. */
export const allowFirstUserCreate: Access = async ({ req }) => {
  const { user, payload } = req
  if (isAdmin(user as UserWithRoles)) return true

  const { totalDocs } = await payload.count({
    collection: 'users',
    req,
  })

  return totalDocs === 0
}
