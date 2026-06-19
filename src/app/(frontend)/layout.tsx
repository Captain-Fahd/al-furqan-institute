import React from 'react'

import { Provider } from '@/components/ui/provider'

export const metadata = {
  description:
    'Al-Furqan Institute — official Hijri month verdicts and moonsighting for Melbourne, Australia.',
  title: 'Al-Furqan Institute',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}
