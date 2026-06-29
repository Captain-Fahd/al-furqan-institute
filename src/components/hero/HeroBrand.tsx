import { Heading, Stack, Text } from '@chakra-ui/react'
import type { HijriDateDisplay } from '@/lib/hijri'

export function HeroBrand({ display }: { display: HijriDateDisplay }) {
  const { hijriLabel, gregorianLabel, locationLabel, isEstimated } = display

  return (
    <Stack gap={{ base: 3, md: 4 }} align="flex-start">
      <Stack gap={1} align="flex-start">
        <Heading
          as="h1"
          size={{ base: '5xl', md: '7xl' }}
          color="brand.50"
          fontWeight="semibold"
          letterSpacing="wider"
          lineHeight="0.95"
        >
          AlFurqan Institute
        </Heading>
        <Text
          color="accent.400"
          fontSize={{ base: 'md', md: 'lg' }}
          fontWeight="medium"
          letterSpacing="wide"
          pl={{ base: 1, md: 2 }}
        >
          Moonsighting
        </Text>
      </Stack>

      <Stack gap={1} bg="brand.600" p={{base: 1, md: 3}} rounded="md" borderWidth="1px" borderColor="brand.800" shadow="xs">
        <Text color="brand.100" fontSize={{ base: 'md', md: 'lg' }} fontWeight="medium">
          Today · {hijriLabel}
        </Text>
        <Text color="brand.200" fontSize="sm">
          {gregorianLabel} · {locationLabel}
        </Text>
        {isEstimated ? (
          <Text color="brand.300" fontSize="xs">
            Estimated Hijri date · month start pending verdict
          </Text>
        ) : null}
      </Stack>
    </Stack>
  )
}
