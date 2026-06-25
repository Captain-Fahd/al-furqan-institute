import { NextResponse } from 'next/server'

import { sendConfirmationEmail } from '@/lib/email/send'
import { getPayloadClient } from '@/lib/payload'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Public double opt-in sign-up. Creates a pending subscriber (or reuses an
 * existing unconfirmed one) and emails a confirmation link. Always responds
 * with a generic success so the endpoint can't be used to probe which
 * addresses are already subscribed.
 */
export async function POST(request: Request) {
  let email: unknown
  try {
    const body = await request.json()
    email = body?.email
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json(
      { error: 'Please enter a valid email address.' },
      { status: 400 },
    )
  }

  const normalizedEmail = email.trim().toLowerCase()
  const payload = await getPayloadClient()

  const successResponse = NextResponse.json({
    message:
      'Almost there — check your inbox for a confirmation link to finish subscribing.',
  })

  try {
    const existing = await payload.find({
      collection: 'subscribers',
      where: { email: { equals: normalizedEmail } },
      limit: 1,
      depth: 0,
    })

    const current = existing.docs[0]

    // Already fully subscribed — nothing to do, but don't disclose that.
    if (current?.confirmedAt) {
      return successResponse
    }

    if (current) {
      const confirmToken =
        current.confirmToken ??
        (
          await payload.update({
            collection: 'subscribers',
            id: current.id,
            data: {},
          })
        ).confirmToken

      if (confirmToken) {
        await sendConfirmationEmail(payload, {
          to: normalizedEmail,
          confirmToken,
        })
      }
      return successResponse
    }

    const created = await payload.create({
      collection: 'subscribers',
      data: { email: normalizedEmail },
    })

    if (created.confirmToken) {
      await sendConfirmationEmail(payload, {
        to: normalizedEmail,
        confirmToken: created.confirmToken,
      })
    }

    return successResponse
  } catch (error) {
    payload.logger.error({ err: error }, 'Subscribe request failed')
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 },
    )
  }
}
