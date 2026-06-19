import { Box } from '@chakra-ui/react'
import React from 'react'

import { HeroSection } from '@/components/hero/HeroSection'

export default function HomePage() {
  return (
    <Box as="main" bg="brand.50" minH="100dvh">
      <HeroSection />
    </Box>
  )
}
