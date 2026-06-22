import { Box } from '@chakra-ui/react'
import React from 'react'

import { CalendarSection } from '@/components/calendar/CalendarSection'
import { HeroSection } from '@/components/hero/HeroSection'

export default function HomePage() {
  return (
    <Box as="main" bg="brand.900" minH="100dvh">
      <HeroSection />
      <CalendarSection />
    </Box>
  )
}
