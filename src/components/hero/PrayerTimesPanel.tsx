'use client'

import { Box, Flex, Stack, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

import type { PrayerName, PrayerTime, PrayerTimesDisplay } from '@/lib/prayerTimes'

const PRAYER_NAMES: PrayerName[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']

type PrayerTimesPanelState =
  | { status: 'loading' }
  | { status: 'loaded'; data: PrayerTimesDisplay }
  | { status: 'error' }

function LoadingTime() {
  return (
    <Box
      aria-hidden
      bg="brand.100"
      h="3"
      rounded="full"
      w="16"
      css={{
        animation: 'prayer-time-pulse 1.4s ease-in-out infinite',
        '@keyframes prayer-time-pulse': {
          '0%, 100%': { opacity: 0.35 },
          '50%': { opacity: 1 },
        },
      }}
    />
  )
}

function LoadingPrayerRow({ name }: { name: PrayerName }) {
  const isMaghrib = name === 'Maghrib'

  return (
    <Flex align="center" justify="space-between" py={2} px={3} rounded="md">
      <Flex align="center" gap={2}>
        <Text color="brand.700" fontSize="sm" fontWeight={isMaghrib ? 'semibold' : 'medium'}>
          {name}
        </Text>
        {isMaghrib ? (
          <Text color="accent.600" fontSize="xs" aria-hidden>
            ☾
          </Text>
        ) : null}
      </Flex>
      <LoadingTime />
    </Flex>
  )
}

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

function PrayerTimesTable({
  dateLabel,
  locationLabel,
  timezoneLabel,
  prayers,
}: {
  dateLabel: string
  locationLabel: string
  timezoneLabel: string
  prayers: PrayerTime[]
}) {
  return (
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
  )
}

function PrayerTimesLoading() {
  return (
    <Stack gap={3} aria-busy="true">
      <Stack gap={0.5}>
        <Text color="brand.800" fontSize="sm" fontWeight="semibold">
          Prayer times
        </Text>
        <Text color="brand.600" fontSize="xs">
          Melbourne, VIC · Loading times...
        </Text>
      </Stack>

      <Stack gap={0} as="ul" listStyleType="none" m={0} p={0}>
        {PRAYER_NAMES.map((name) => (
          <Box as="li" key={name}>
            <LoadingPrayerRow name={name} />
          </Box>
        ))}
      </Stack>
    </Stack>
  )
}

export function PrayerTimesPanel() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesPanelState>({ status: 'loading' })

  useEffect(() => {
    const controller = new AbortController()

    async function loadPrayerTimes() {
      try {
        const response = await fetch('/api/prayer-times', {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Prayer times request failed with ${response.status}`)
        }

        const data = (await response.json()) as PrayerTimesDisplay
        setPrayerTimes({ status: 'loaded', data })
      } catch (error) {
        if (controller.signal.aborted) {
          return
        }

        console.error('Failed to load prayer times', error)
        setPrayerTimes({ status: 'error' })
      }
    }

    loadPrayerTimes()

    return () => controller.abort()
  }, [])

  const content =
    prayerTimes.status === 'loaded' ? (
      <PrayerTimesTable {...prayerTimes.data} />
    ) : prayerTimes.status === 'error' ? (
      <PrayerTimesTable
        dateLabel="Times unavailable"
        locationLabel="Melbourne, VIC"
        timezoneLabel="Australia/Melbourne"
        prayers={PRAYER_NAMES.map((name) => ({ name, time: 'Unavailable' }))}
      />
    ) : (
      <PrayerTimesLoading />
    )

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
      {content}
    </Box>
  )
}
