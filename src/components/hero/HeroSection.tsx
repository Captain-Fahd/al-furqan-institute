import { Box, Container, SimpleGrid } from '@chakra-ui/react'
import React from 'react'

import type { HijriDateDisplay } from '@/lib/hijri'

import { HeroBrand } from './HeroBrand'
import { PrayerTimesPanel } from './PrayerTimesPanel'

export function HeroSection({ hijri }: { hijri: HijriDateDisplay }) {
  return (
    <Box as="section" bg="brand.900" pt={{ base: 4, md: 6 }} pb={{ base: 8, md: 12 }}>
      <Container maxW="6xl">
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 8, md: 12 }} alignItems="start">
          <HeroBrand display={hijri} />
          <PrayerTimesPanel />
        </SimpleGrid>
      </Container>
    </Box>
  )
}
