import { getPayload, Payload } from 'payload'
import config from '@payload-config'

import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

describe('API', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  it('fetches users', async () => {
    const users = await payload.find({
      collection: 'users',
    })
    expect(users).toBeDefined()
  })

  it('persists editor role for non-first users', async () => {
    const { totalDocs } = await payload.count({ collection: 'users' })

    if (totalDocs === 0) {
      await payload.create({
        collection: 'users',
        data: {
          email: `bootstrap-${Date.now()}@example.com`,
          password: 'test-password',
          roles: ['admin'],
        },
      })
    }

    const email = `editor-${Date.now()}@example.com`

    const user = await payload.create({
      collection: 'users',
      data: {
        email,
        password: 'test-password',
        roles: ['editor'],
      },
    })

    expect(user.roles).toEqual(['editor'])

    await payload.delete({
      collection: 'users',
      id: user.id,
    })
  })

  it('confirms a HijriMonth when a sighted verdict is published', async () => {
    const hijriYear = 9000 + Math.floor(Math.random() * 1000)

    const verdict = await payload.create({
      collection: 'verdicts',
      data: {
        hijriMonth: 'Ramadan',
        hijriYear,
        gregorianStartDate: '2026-02-18T00:00:00.000Z',
        status: 'sighted',
        region: 'melbourne',
        publishedAt: new Date().toISOString(),
      },
    })

    const months = await payload.find({
      collection: 'hijri-months',
      where: {
        and: [
          { name: { equals: 'Ramadan' } },
          { year: { equals: hijriYear } },
        ],
      },
    })

    expect(months.totalDocs).toBe(1)
    expect(months.docs[0]?.isConfirmed).toBe(true)

    await payload.delete({ collection: 'verdicts', id: verdict.id })
    await payload.delete({ collection: 'hijri-months', id: months.docs[0]!.id })
  })

  it('does not confirm a HijriMonth for an unpublished verdict', async () => {
    const hijriYear = 9000 + Math.floor(Math.random() * 1000)

    const verdict = await payload.create({
      collection: 'verdicts',
      data: {
        hijriMonth: 'Shawwal',
        hijriYear,
        gregorianStartDate: '2026-03-20T00:00:00.000Z',
        status: 'sighted',
        region: 'melbourne',
      },
    })

    const months = await payload.find({
      collection: 'hijri-months',
      where: {
        and: [
          { name: { equals: 'Shawwal' } },
          { year: { equals: hijriYear } },
        ],
      },
    })

    expect(months.totalDocs).toBe(0)

    await payload.delete({ collection: 'verdicts', id: verdict.id })
  })

  it('auto-generates confirm + unsubscribe tokens for new subscribers', async () => {
    const subscriber = await payload.create({
      collection: 'subscribers',
      data: { email: `subscriber-${Date.now()}@example.com` },
    })

    expect(subscriber.confirmToken).toBeTruthy()
    expect(subscriber.unsubscribeToken).toBeTruthy()
    expect(subscriber.confirmToken).not.toBe(subscriber.unsubscribeToken)
    expect(subscriber.confirmedAt).toBeFalsy()

    await payload.delete({ collection: 'subscribers', id: subscriber.id })
  })

  it('confirms a subscriber by their confirm token (double opt-in)', async () => {
    const subscriber = await payload.create({
      collection: 'subscribers',
      data: { email: `optin-${Date.now()}@example.com` },
    })

    expect(subscriber.confirmedAt).toBeFalsy()
    const token = subscriber.confirmToken!

    // Mirrors the /confirm page: look up by token, then set confirmedAt.
    const { docs } = await payload.find({
      collection: 'subscribers',
      where: { confirmToken: { equals: token } },
      limit: 1,
    })
    expect(docs).toHaveLength(1)

    const confirmed = await payload.update({
      collection: 'subscribers',
      id: docs[0]!.id,
      data: { confirmedAt: new Date().toISOString() },
    })

    expect(confirmed.confirmedAt).toBeTruthy()

    await payload.delete({ collection: 'subscribers', id: subscriber.id })
  })
})
