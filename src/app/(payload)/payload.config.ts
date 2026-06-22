import { postgresAdapter } from '@payloadcms/db-postgres'
import { resendAdapter } from '@payloadcms/email-resend'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Verdicts } from './collections/Verdicts'
import { HijriMonths } from './collections/HijriMonths'
import { SightingReports } from './collections/SightingReports'
import { Trips } from './collections/Trips'
import { Announcements } from './collections/Announcements'
import { Subscribers } from './collections/Subscribers'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * Only wire the Resend adapter when an API key is present. Without it (local
 * dev, CI) Payload falls back to its built-in console transport so
 * `payload.sendEmail` logs instead of throwing.
 */
const email = process.env.RESEND_API_KEY
  ? resendAdapter({
      defaultFromAddress: process.env.EMAIL_FROM || 'noreply@alfurqan.institute',
      defaultFromName: 'Al-Furqan Institute',
      apiKey: process.env.RESEND_API_KEY,
    })
  : undefined

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Verdicts,
    HijriMonths,
    SightingReports,
    Trips,
    Announcements,
    Subscribers,
  ],
  editor: lexicalEditor(),
  email,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [],
})
