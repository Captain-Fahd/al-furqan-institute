import { Box, Container, Stack, Text } from '@chakra-ui/react'

import type { Verdict } from '@/app/(payload)/payload-types'
import { formatMelbourneDate, formatMelbourneDateTime } from '@/lib/dates'
import type { HijriDateDisplay } from '@/lib/hijri'

type VerdictBannerProps = {
  verdict: Verdict | null
  hijri: HijriDateDisplay
}

type BannerContent = {
  tone: 'sighted' | 'neutral'
  eyebrow: string
  title: string
  subtitle: string
  summary?: string | null
  footnote: string
}

function buildContent({ verdict, hijri }: VerdictBannerProps): BannerContent {
  if (verdict && verdict.status === 'sighted') {
    return {
      tone: 'sighted',
      eyebrow: 'Latest verdict · Melbourne',
      title: `${verdict.hijriMonth} ${verdict.hijriYear} AH has begun`,
      subtitle: `The crescent was sighted. ${verdict.hijriMonth} began ${formatMelbourneDate(verdict.gregorianStartDate)} in Melbourne.`,
      summary: verdict.summary,
      footnote: verdict.publishedAt
        ? `Published ${formatMelbourneDateTime(verdict.publishedAt)}`
        : 'Official ruling of Al-Furqan Institute.',
    }
  }

  if (verdict && verdict.status === 'not-sighted') {
    return {
      tone: 'neutral',
      eyebrow: 'Latest verdict · Melbourne',
      title: `${verdict.hijriMonth} ${verdict.hijriYear} AH — crescent not sighted`,
      subtitle:
        'The crescent was not sighted in Melbourne, so the current month completes 30 days.',
      summary: verdict.summary,
      footnote: verdict.publishedAt
        ? `Published ${formatMelbourneDateTime(verdict.publishedAt)}`
        : 'Official ruling of Al-Furqan Institute.',
    }
  }

  return {
    tone: 'neutral',
    eyebrow: 'Moonsighting · Melbourne',
    title: 'Awaiting the next verdict',
    subtitle: `Estimated today: ${hijri.hijriLabel} · ${hijri.gregorianLabel}.`,
    footnote: "The next official ruling will appear here as soon as it's announced.",
  }
}

export function VerdictBanner({ verdict, hijri }: VerdictBannerProps) {
  const content = buildContent({ verdict, hijri })
  const isSighted = content.tone === 'sighted'

  return (
    <Box as="section" bg="brand.900" pt={{ base: 20, md: 24 }} pb={{ base: 4, md: 6 }}>
      <Container maxW="6xl">
        <Box
          bg={isSighted ? 'accent.400' : 'brand.700'}
          borderWidth="1px"
          borderColor={isSighted ? 'accent.300' : 'brand.600'}
          rounded="2xl"
          px={{ base: 5, md: 8 }}
          py={{ base: 5, md: 7 }}
          shadow="md"
        >
          <Stack gap={{ base: 2, md: 3 }}>
            <Text
              color={isSighted ? 'accent.800' : 'accent.300'}
              fontSize={{ base: 'xs', md: 'sm' }}
              fontWeight="bold"
              letterSpacing="wide"
              textTransform="uppercase"
            >
              {content.eyebrow}
            </Text>

            <Text
              as="h2"
              color={isSighted ? 'brand.950' : 'brand.50'}
              fontSize={{ base: '2xl', md: '4xl' }}
              fontWeight="bold"
              letterSpacing="tight"
              lineHeight="1.1"
            >
              {content.title}
            </Text>

            <Text
              color={isSighted ? 'brand.900' : 'brand.100'}
              fontSize={{ base: 'sm', md: 'md' }}
              maxW="3xl"
            >
              {content.subtitle}
            </Text>

            {content.summary ? (
              <Text
                color={isSighted ? 'brand.800' : 'brand.200'}
                fontSize={{ base: 'sm', md: 'md' }}
                maxW="3xl"
              >
                {content.summary}
              </Text>
            ) : null}

            <Text
              color={isSighted ? 'accent.800' : 'brand.300'}
              fontSize="xs"
              fontWeight="medium"
            >
              {content.footnote}
            </Text>
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}
