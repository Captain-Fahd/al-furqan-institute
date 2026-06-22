import { randomUUID } from 'crypto'
import type { CollectionBeforeChangeHook } from 'payload'

/**
 * Guarantees every subscriber has stable confirm + unsubscribe tokens,
 * regardless of whether they were created via the public subscribe route or by
 * an admin in the panel. Tokens are opaque, single-purpose, and live for the
 * lifetime of the record.
 */
export const ensureSubscriberTokens: CollectionBeforeChangeHook = ({
  data,
  operation,
}) => {
  if (operation === 'create') {
    if (!data.confirmToken) data.confirmToken = randomUUID()
    if (!data.unsubscribeToken) data.unsubscribeToken = randomUUID()
  }
  return data
}
