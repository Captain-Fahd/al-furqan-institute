export const USER_ROLES = ['admin', 'editor'] as const

export type UserRole = (typeof USER_ROLES)[number]

export type UserWithRoles = {
  id?: number | string
  roles?: UserRole[] | null
}

export function hasRole(
  user: UserWithRoles | null | undefined,
  role: UserRole,
): boolean {
  return Boolean(user?.roles?.includes(role))
}

export function isAdmin(user: UserWithRoles | null | undefined): boolean {
  return hasRole(user, 'admin')
}

export function isAdminOrEditor(
  user: UserWithRoles | null | undefined,
): boolean {
  return Boolean(
    user?.roles?.some((role) => role === 'admin' || role === 'editor'),
  )
}
