import config from '@payload-config'
import { getPayload, type Payload } from 'payload'

let cached: Promise<Payload> | null = null

/**
 * Cached Payload Local API client for server components and route handlers.
 * Reuses a single instance across requests in the same runtime so each
 * server render doesn't spin up a new connection pool.
 */
export function getPayloadClient(): Promise<Payload> {
  if (!cached) {
    cached = getPayload({ config })
  }
  return cached
}
