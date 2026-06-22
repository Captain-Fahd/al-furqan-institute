import type { CollectionAfterChangeHook } from 'payload'

import { sendVerdictBlast } from '@/lib/email/send'
import type { Verdict } from '../payload-types'

/**
 * Emails confirmed subscribers when a verdict is first published. Fires on the
 * publish transition only (publishedAt going from empty → set), so editing an
 * already-published verdict never re-sends. Both sighted and not-sighted
 * verdicts are announced. Email failures are swallowed so they can't roll back
 * the verdict itself.
 */
export const notifySubscribersOnVerdict: CollectionAfterChangeHook<Verdict> = async ({
  doc,
  previousDoc,
  req,
  context,
}) => {
  if (context?.skipVerdictHook) return doc

  const isPublished = Boolean(doc.publishedAt)
  const wasPublished = Boolean(previousDoc?.publishedAt)
  if (!isPublished || wasPublished) return doc

  try {
    const sent = await sendVerdictBlast(req.payload, { verdict: doc, req })
    req.payload.logger.info(
      { verdict: doc.id, sent },
      'Sent verdict notification emails',
    )
  } catch (error) {
    req.payload.logger.error(
      { err: error, verdict: doc.id },
      'Verdict notification blast failed',
    )
  }

  return doc
}
