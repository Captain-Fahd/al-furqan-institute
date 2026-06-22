'use client'

import { Box, Button, Flex, Grid, IconButton, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import { useMemo, useState } from 'react'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'

import { buildCalendarMonth, type CalendarDay } from '@/lib/hijri/calendar'

type MonthCalendarProps = {
  initialHijriYear: number
  initialHijriMonth: number
  today: { year: number; month: number; day: number }
}

function DayCell({ day }: { day: CalendarDay }) {
  const { isToday, isCurrentMonth, isFriday } = day

  const hijriColor = isToday ? 'brand.950' : isCurrentMonth ? 'brand.800' : 'brand.300'
  const gregorianColor = isToday ? 'brand.700' : isCurrentMonth ? 'brand.500' : 'brand.200'

  return (
    <Box
      role="gridcell"
      aria-current={isToday ? 'date' : undefined}
      bg={isToday ? 'accent.100' : 'transparent'}
      borderWidth="1px"
      borderColor={isToday ? 'accent.400' : 'transparent'}
      rounded="md"
      px={1}
      py={{ base: 1.5, md: 2 }}
      minH={{ base: 12, md: 16 }}
      transition="background 0.15s"
      _hover={isCurrentMonth ? { bg: isToday ? 'accent.100' : 'brand.50' } : undefined}
    >
      <Stack gap={0} align="center" justify="center" h="full">
        <Text
          fontSize={{ base: 'lg', md: '2xl' }}
          fontWeight="bold"
          lineHeight="1.1"
          color={hijriColor}
          fontVariantNumeric="tabular-nums"
        >
          {day.hijriDay}
        </Text>
        <Text
          fontSize={{ base: '2xs', md: 'xs' }}
          fontWeight="medium"
          color={gregorianColor}
          fontVariantNumeric="tabular-nums"
        >
          {day.gregorianDay}
        </Text>
        {isFriday && isCurrentMonth ? (
          <Text fontSize="2xs" color="accent.600" aria-hidden lineHeight="1">
            ☾
          </Text>
        ) : null}
      </Stack>
    </Box>
  )
}

export function MonthCalendar({ initialHijriYear, initialHijriMonth, today }: MonthCalendarProps) {
  const [view, setView] = useState({ year: initialHijriYear, month: initialHijriMonth })

  const calendar = useMemo(
    () => buildCalendarMonth(view.year, view.month, today),
    [view.year, view.month, today],
  )

  const goToMonth = (delta: number) => {
    setView((prev) => {
      const next = prev.month + delta
      if (next < 1) return { year: prev.year - 1, month: 12 }
      if (next > 12) return { year: prev.year + 1, month: 1 }
      return { year: prev.year, month: next }
    })
  }

  const isCurrentView = view.year === initialHijriYear && view.month === initialHijriMonth

  return (
    <Box
      bg="white"
      borderWidth="1px"
      borderColor="brand.200"
      rounded="xl"
      p={{ base: 4, md: 6 }}
      w="full"
      shadow="sm"
    >
      <Flex align="center" justify="space-between" gap={3} mb={{ base: 3, md: 4 }}>
        <Stack gap={0}>
          <Text
            color="brand.900"
            fontSize={{ base: 'xl', md: '2xl' }}
            fontWeight="bold"
            letterSpacing="tight"
          >
            {calendar.hijriLabel}
          </Text>
          <Text color="brand.500" fontSize={{ base: 'xs', md: 'sm' }} fontWeight="medium">
            {calendar.gregorianLabel}
          </Text>
        </Stack>

        <Flex align="center" gap={1}>
          {!isCurrentView ? (
            <Button
              size="xs"
              variant="ghost"
              color="brand.600"
              fontWeight="semibold"
              _hover={{ bg: 'brand.50' }}
              onClick={() => setView({ year: initialHijriYear, month: initialHijriMonth })}
            >
              Today
            </Button>
          ) : null}
          <IconButton
            aria-label="Previous month"
            size="sm"
            variant="ghost"
            color="brand.700"
            _hover={{ bg: 'brand.50' }}
            onClick={() => goToMonth(-1)}
          >
            <LuChevronLeft />
          </IconButton>
          <IconButton
            aria-label="Next month"
            size="sm"
            variant="ghost"
            color="brand.700"
            _hover={{ bg: 'brand.50' }}
            onClick={() => goToMonth(1)}
          >
            <LuChevronRight />
          </IconButton>
        </Flex>
      </Flex>

      <SimpleGrid columns={7} gap={1} mb={1}>
        {calendar.weekdayLabels.map((label) => (
          <Text
            key={label}
            textAlign="center"
            fontSize={{ base: '2xs', md: 'xs' }}
            fontWeight="semibold"
            textTransform="uppercase"
            letterSpacing="wide"
            color="brand.400"
          >
            {label}
          </Text>
        ))}
      </SimpleGrid>

      <Stack gap={1} role="grid">
        {calendar.weeks.map((week, weekIndex) => (
          <Grid key={weekIndex} templateColumns="repeat(7, 1fr)" gap={1} role="row">
            {week.map((day) => (
              <DayCell key={day.iso} day={day} />
            ))}
          </Grid>
        ))}
      </Stack>

      <Flex align="center" gap={4} mt={{ base: 3, md: 4 }} flexWrap="wrap">
        <Flex align="center" gap={1.5}>
          <Text fontSize="sm" fontWeight="bold" color="brand.800" lineHeight="1">
            12
          </Text>
          <Text fontSize="2xs" color="brand.500">
            Hijri
          </Text>
        </Flex>
        <Flex align="center" gap={1.5}>
          <Text fontSize="xs" fontWeight="medium" color="brand.500" lineHeight="1">
            12
          </Text>
          <Text fontSize="2xs" color="brand.500">
            Gregorian
          </Text>
        </Flex>
        <Text fontSize="2xs" color="brand.400">
          Hijri dates are estimated until confirmed by verdict.
        </Text>
      </Flex>
    </Box>
  )
}
