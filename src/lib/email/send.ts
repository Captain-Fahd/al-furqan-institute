import { render } from '@react-email/render'
import type { BasePayload, PayloadRequest } from 'payload'

import type { Verdict } from '@/app/(payload)/payload-types'
import { formatMelbourneDate, verdictHeadline } from './format'
import { ConfirmationEmail } from './templates/ConfirmationEmail'
import { VerdictEmail } from './templates/VerdictEmail'
import { buildConfirmUrl, buildUnsubscribeUrl } from './urls'

interface ConfirmationArgs {
  to: string
  confirmToken: string
}

/** Sends the double opt-in confirmation email to a pending subscriber. */
export async function sendConfirmationEmail(
  payload: BasePayload,
  { to, confirmToken }: ConfirmationArgs,
): Promise<void> {
  const confirmUrl = buildConfirmUrl(confirmToken)
  const html = await render(ConfirmationEmail({ confirmUrl }))

  await payload.sendEmail({
    to,
    subject: 'Confirm your Al-Furqan Institute subscription',
    html,
  })
}

interface VerdictBlastArgs {
  verdict: Verdict
  req?: PayloadRequest
}

/**
 * Emails every confirmed subscriber about a published verdict. Each recipient
 * gets their own unsubscribe link. Failures for a single recipient are logged
 * and skipped so one bad address can't abort the whole blast.
 */
export async function sendVerdictBlast(
  payload: BasePayload,
  { verdict, req }: VerdictBlastArgs,
): Promise<number> {
  const headline = verdictHeadline(
    verdict.hijriMonth,
    verdict.hijriYear,
    verdict.status,
  )
  const gregorianStartDate = formatMelbourneDate(verdict.gregorianStartDate)

  const pageSize = 200
  let page = 1
  let sent = 0

  for (;;) {
    const { docs, hasNextPage } = await payload.find({
      collection: 'subscribers',
      where: { confirmedAt: { exists: true } },
      limit: pageSize,
      page,
      depth: 0,
      req,
    })

    for (const subscriber of docs) {
      if (!subscriber.unsubscribeToken) continue

      const html = await render(
        VerdictEmail({
          headline,
          status: verdict.status,
          hijriMonth: verdict.hijriMonth,
          hijriYear: verdict.hijriYear,
          gregorianStartDate,
          summary: verdict.summary,
          unsubscribeUrl: buildUnsubscribeUrl(subscriber.unsubscribeToken),
        }),
      )

      try {
        await payload.sendEmail({
          to: subscriber.email,
          subject: headline,
          html,
        })
        sent += 1
      } catch (error) {
        payload.logger.error(
          { err: error, subscriber: subscriber.id },
          'Failed to send verdict email to subscriber',
        )
      }
    }

    if (!hasNextPage) break
    page += 1
  }

  return sent
}
