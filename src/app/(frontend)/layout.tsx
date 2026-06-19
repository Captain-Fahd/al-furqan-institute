import React from 'react'

import { Navbar } from '@/components/nav/Navbar'
import { Provider } from '@/components/ui/provider'
import { googleSans } from '@/lib/fonts'

export const metadata = {
  description:
    'Al-Furqan Institute — official Hijri month verdicts and moonsighting for Melbourne, Australia.',
  title: 'Al-Furqan Institute',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" className={googleSans.variable} suppressHydrationWarning>
      <body className={googleSans.className} suppressHydrationWarning>
        <Provider>
          <Navbar />
          {children}
        </Provider>
      </body>
    </html>
  )
}
