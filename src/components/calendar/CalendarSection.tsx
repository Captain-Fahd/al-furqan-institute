import { Box, Container, Stack, Text } from '@chakra-ui/react'

import { getCurrentHijriMonth, getMelbourneToday } from '@/lib/hijri/calendar'

import { MonthCalendar } from './MonthCalendar'

export function CalendarSection() {
  const today = getMelbourneToday()
  const { hijriYear, hijriMonth } = getCurrentHijriMonth()

  return (
    <Box as="section" bg="brand.900" pb={{ base: 12, md: 16 }}>
      <Container maxW="6xl">
        <Stack gap={{ base: 4, md: 5 }}>
          <Stack gap={1}>
            <Text
              color="accent.400"
              fontSize={{ base: 'sm', md: 'md' }}
              fontWeight="semibold"
              letterSpacing="wide"
              textTransform="uppercase"
            >
              Calendar
            </Text>
            <Text color="brand.100" fontSize={{ base: 'sm', md: 'md' }} maxW="2xl">
              The Hijri date is shown for each day, with the Gregorian date beneath it.
            </Text>
          </Stack>

          <MonthCalendar
            initialHijriYear={hijriYear}
            initialHijriMonth={hijriMonth}
            today={today}
          />
        </Stack>
      </Container>
    </Box>
  )
}
