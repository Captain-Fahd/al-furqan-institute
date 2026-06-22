import config from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { StatusPage } from '@/components/status/StatusPage'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Confirm subscription · Al-Furqan Institute',
  robots: { index: false },
}

export default async function ConfirmPage(props: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await props.searchParams

  if (!token) {
    return (
      <StatusPage
        tone="error"
        title="Invalid confirmation link"
        message="This link is missing its confirmation token. Please use the link from your confirmation email, or subscribe again."
        cta={{ href: '/subscribe', label: 'Subscribe' }}
      />
    )
  }

  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'subscribers',
    where: { confirmToken: { equals: token } },
    limit: 1,
    depth: 0,
  })

  const subscriber = docs[0]

  if (!subscriber) {
    return (
      <StatusPage
        tone="error"
        title="Link not recognised"
        message="This confirmation link is invalid or has already been used. If you're not receiving emails, please subscribe again."
        cta={{ href: '/subscribe', label: 'Subscribe' }}
      />
    )
  }

  if (!subscriber.confirmedAt) {
    await payload.update({
      collection: 'subscribers',
      id: subscriber.id,
      data: { confirmedAt: new Date().toISOString() },
    })
  }

  return (
    <StatusPage
      tone="success"
      title="You're subscribed"
      message="Your email is confirmed. You'll now receive official moonsighting verdicts for Melbourne as soon as they're published."
      cta={{ href: '/', label: 'Back to home' }}
    />
  )
}
