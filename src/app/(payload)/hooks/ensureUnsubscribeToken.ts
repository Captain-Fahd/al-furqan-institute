import { randomUUID } from 'crypto'
import type { CollectionBeforeChangeHook } from 'payload'

/**
 * Guarantees every subscriber has a stable unsubscribe token, regardless of
 * whether they were created via the public subscribe route (Phase C) or by an
 * admin in the panel.
 */
export const ensureUnsubscribeToken: CollectionBeforeChangeHook = ({
  data,
  operation,
}) => {
  if (operation === 'create' && !data.unsubscribeToken) {
    data.unsubscribeToken = randomUUID()
  }
  return data
}
