import { Box, Container, SimpleGrid } from '@chakra-ui/react'
import React from 'react'

import { HeroBrand } from './HeroBrand'
import { PrayerTimesPanel } from './PrayerTimesPanel'

export function HeroSection() {
  return (
    <Box as="section" bg="brand.900" pt={{ base: 20, md: 24 }} pb={{ base: 8, md: 12 }}>
      <Container maxW="6xl">
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 8, md: 12 }} alignItems="start">
          <HeroBrand />
          <PrayerTimesPanel />
        </SimpleGrid>
      </Container>
    </Box>
  )
}
