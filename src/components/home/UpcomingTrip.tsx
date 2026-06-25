import { Box, Container, Flex, Stack, Text } from '@chakra-ui/react'

import type { Trip } from '@/app/(payload)/payload-types'
import { formatMelbourneDate, formatMelbourneTime } from '@/lib/dates'

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <Stack gap={0.5} minW="24">
      <Text
        color="brand.500"
        fontSize="2xs"
        fontWeight="semibold"
        letterSpacing="wide"
        textTransform="uppercase"
      >
        {label}
      </Text>
      <Text color="brand.800" fontSize="sm" fontWeight="medium">
        {value}
      </Text>
    </Stack>
  )
}

export function UpcomingTrip({ trip }: { trip: Trip | null }) {
  if (!trip) return null

  return (
    <Box as="section" bg="brand.900" pb={{ base: 12, md: 16 }}>
      <Container maxW="6xl">
        <Stack gap={{ base: 4, md: 5 }}>
          <Text
            color="accent.400"
            fontSize={{ base: 'sm', md: 'md' }}
            fontWeight="semibold"
            letterSpacing="wide"
            textTransform="uppercase"
          >
            Next sighting trip
          </Text>

          <Box
            bg="white"
            borderWidth="1px"
            borderColor="brand.200"
            rounded="xl"
            p={{ base: 5, md: 6 }}
            shadow="sm"
          >
            <Stack gap={4}>
              <Stack gap={1}>
                <Text color="brand.900" fontSize={{ base: 'lg', md: 'xl' }} fontWeight="bold">
                  {trip.title}
                </Text>
                <Text color="brand.500" fontSize="sm" fontWeight="medium">
                  {formatMelbourneDate(trip.scheduledDate)}
                </Text>
              </Stack>

              <Flex gap={{ base: 4, md: 8 }} flexWrap="wrap">
                {trip.location ? <DetailItem label="Location" value={trip.location} /> : null}
                {trip.sunsetTime ? (
                  <DetailItem label="Sunset" value={formatMelbourneTime(trip.sunsetTime)} />
                ) : null}
                {trip.moonsetTime ? (
                  <DetailItem label="Moonset" value={formatMelbourneTime(trip.moonsetTime)} />
                ) : null}
              </Flex>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}
