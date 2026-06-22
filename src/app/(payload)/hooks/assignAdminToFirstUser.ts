import type { CollectionBeforeChangeHook } from 'payload'

export const assignAdminToFirstUser: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  if (operation !== 'create') return data

  const { totalDocs } = await req.payload.count({
    collection: 'users',
    req,
  })

  if (totalDocs === 0) {
    return { ...data, roles: ['admin'] }
  }

  return data
}
