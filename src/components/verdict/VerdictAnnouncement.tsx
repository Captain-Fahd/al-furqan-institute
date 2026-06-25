import { Box, Container, Image, Stack, Text } from '@chakra-ui/react'

import type { Media, Verdict } from '@/app/(payload)/payload-types'

type VerdictAnnouncementProps = {
  verdict: Verdict | null
}

function resolveImage(verdict: Verdict | null): Media | null {
  if (!verdict || !verdict.announcementImage) return null
  if (typeof verdict.announcementImage === 'number') return null
  return verdict.announcementImage
}

export function VerdictAnnouncement({ verdict }: VerdictAnnouncementProps) {
  const image = resolveImage(verdict)
  if (!image?.url) return null

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
              Official announcement
            </Text>
            <Text color="brand.100" fontSize={{ base: 'sm', md: 'md' }} maxW="2xl">
              The verdict as published by Al-Furqan Institute.
            </Text>
          </Stack>

          <Box
            bg="brand.700"
            borderWidth="1px"
            borderColor="brand.600"
            rounded="2xl"
            overflow="hidden"
            shadow="md"
          >
            <Image
              src={image.url}
              alt={image.alt || 'Official verdict announcement'}
              width="100%"
              height="auto"
              objectFit="contain"
            />
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}
