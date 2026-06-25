import React from 'react'

import { StatusPage } from '@/components/status/StatusPage'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Unsubscribe · Al-Furqan Institute',
  robots: { index: false },
}

export default async function UnsubscribePage(props: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await props.searchParams

  if (!token) {
    return (
      <StatusPage
        tone="error"
        title="Invalid unsubscribe link"
        message="This link is missing its token. Please use the unsubscribe link from one of our emails."
      />
    )
  }

  const payload = await getPayloadClient()

  const { docs } = await payload.find({
    collection: 'subscribers',
    where: { unsubscribeToken: { equals: token } },
    limit: 1,
    depth: 0,
  })

  const subscriber = docs[0]

  // Deleting is idempotent from the user's perspective: whether the record
  // existed or was already removed, the outcome they want is the same.
  if (subscriber) {
    await payload.delete({
      collection: 'subscribers',
      id: subscriber.id,
    })
  }

  return (
    <StatusPage
      tone="success"
      title="You've been unsubscribed"
      message="You won't receive any more emails from Al-Furqan Institute. You can resubscribe at any time if you change your mind."
      cta={{ href: '/', label: 'Back to home' }}
    />
  )
}
