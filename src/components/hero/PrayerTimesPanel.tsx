import { Box, Flex, Stack, Text } from '@chakra-ui/react'
import React from 'react'

import { getPrayerTimesDisplay, type PrayerTime } from '@/lib/prayer-times'

function PrayerRow({ prayer }: { prayer: PrayerTime }) {
  const isHighlighted = prayer.isNext === true
  const isMaghrib = prayer.name === 'Maghrib'

  return (
    <Flex
      align="center"
      justify="space-between"
      py={2}
      px={3}
      rounded="md"
      bg={isHighlighted ? 'accent.50' : 'transparent'}
      borderLeftWidth={isHighlighted ? '3px' : '0'}
      borderLeftColor="accent.400"
    >
      <Flex align="center" gap={2}>
        <Text
          color={isHighlighted ? 'brand.800' : 'brand.700'}
          fontSize="sm"
          fontWeight={isHighlighted || isMaghrib ? 'semibold' : 'medium'}
        >
          {prayer.name}
        </Text>
        {isMaghrib ? (
          <Text color="accent.600" fontSize="xs" aria-hidden>
            ☾
          </Text>
        ) : null}
        {isHighlighted ? (
          <Text color="accent.600" fontSize="xs" fontWeight="medium">
            Next
          </Text>
        ) : null}
      </Flex>
      <Text
        color={isHighlighted ? 'brand.800' : 'brand.700'}
        fontSize="sm"
        fontWeight={isHighlighted ? 'semibold' : 'normal'}
        fontVariantNumeric="tabular-nums"
      >
        {prayer.time}
      </Text>
    </Flex>
  )
}

export function PrayerTimesPanel() {
  const { dateLabel, locationLabel, timezoneLabel, prayers } = getPrayerTimesDisplay()

  return (
    <Box
      bg="white"
      borderWidth="1px"
      borderColor="brand.200"
      rounded="lg"
      p={{ base: 4, md: 5 }}
      w="full"
      maxW={{ md: 'sm' }}
      ml={{ md: 'auto' }}
    >
      <Stack gap={3}>
        <Stack gap={0.5}>
          <Text color="brand.800" fontSize="sm" fontWeight="semibold">
            Prayer times
          </Text>
          <Text color="brand.600" fontSize="xs">
            {locationLabel} · {dateLabel} · {timezoneLabel}
          </Text>
        </Stack>

        <Stack gap={0} as="ul" listStyleType="none" m={0} p={0}>
          {prayers.map((prayer) => (
            <Box as="li" key={prayer.name}>
              <PrayerRow prayer={prayer} />
            </Box>
          ))}
        </Stack>
      </Stack>
    </Box>
  )
}
