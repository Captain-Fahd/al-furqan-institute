import type { CollectionAfterChangeHook } from 'payload'

/**
 * Confirmed Hijri months always come from admin-entered verdicts.
 * When a `sighted` Verdict is published, upsert the matching HijriMonth with
 * `isConfirmed: true` so the public site can flip from estimate to confirmed.
 *
 * Calculation never overrides a verdict — this hook is the only path that sets
 * `isConfirmed`.
 */
export const upsertHijriMonthFromVerdict: CollectionAfterChangeHook = async ({
  doc,
  req,
  context,
}) => {
  if (context?.skipVerdictHook) return doc

  // Only published, sighted verdicts confirm a month start.
  if (doc.status !== 'sighted' || !doc.publishedAt) return doc

  const { payload } = req

  const existing = await payload.find({
    collection: 'hijri-months',
    where: {
      and: [
        { name: { equals: doc.hijriMonth } },
        { year: { equals: doc.hijriYear } },
      ],
    },
    limit: 1,
    req,
  })

  const data = {
    name: doc.hijriMonth,
    year: doc.hijriYear,
    confirmedStartDate: doc.gregorianStartDate,
    isConfirmed: true,
  }

  if (existing.docs.length > 0) {
    await payload.update({
      collection: 'hijri-months',
      id: existing.docs[0].id,
      data,
      req,
      context: { skipVerdictHook: true },
    })
  } else {
    await payload.create({
      collection: 'hijri-months',
      data,
      req,
      context: { skipVerdictHook: true },
    })
  }

  return doc
}
