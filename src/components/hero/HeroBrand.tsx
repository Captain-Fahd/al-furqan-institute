import { Heading, Stack, Text } from '@chakra-ui/react'
import React from 'react'

import { getHijriDateDisplay } from '@/lib/hijri'

export function HeroBrand() {
  const { hijriLabel, gregorianLabel, locationLabel, isEstimated } = getHijriDateDisplay()

  return (
    <Stack gap={{ base: 3, md: 4 }} align="flex-start">
      <Stack gap={0} align="flex-start">
        <Text
          color="accent.600"
          fontSize={{ base: 'lg', md: 'xl' }}
          fontWeight="semibold"
          letterSpacing="tight"
        >
          Al Furqan Institute
        </Text>
        <Heading
          as="p"
          pl={{ base: 6, md: 10 }}
          mt={{ base: -1, md: -2 }}
          size={{ base: '3xl', md: '5xl' }}
          color="brand.800"
          fontWeight="light"
          lineHeight="shorter"
        >
          moonsighting
        </Heading>
      </Stack>

      <Stack gap={1}>
        <Text color="brand.700" fontSize={{ base: 'md', md: 'lg' }} fontWeight="medium">
          Today · {hijriLabel}
        </Text>
        <Text color="brand.600" fontSize="sm">
          {gregorianLabel} · {locationLabel}
        </Text>
        {isEstimated ? (
          <Text color="brand.500" fontSize="xs">
            Estimated Hijri date · month start pending verdict
          </Text>
        ) : null}
      </Stack>
    </Stack>
  )
}
