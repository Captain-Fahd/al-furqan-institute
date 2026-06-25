import { Box, Container, Stack, Text } from '@chakra-ui/react'

import type { Announcement } from '@/app/(payload)/payload-types'
import { formatMelbourneDate } from '@/lib/dates'
import { lexicalToExcerpt } from '@/lib/richText'

function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  const excerpt = lexicalToExcerpt(announcement.body)

  return (
    <Box
      bg="white"
      borderWidth="1px"
      borderColor="brand.200"
      rounded="lg"
      p={{ base: 4, md: 5 }}
      shadow="sm"
    >
      <Stack gap={1.5}>
        {announcement.publishedAt ? (
          <Text color="brand.500" fontSize="xs" fontWeight="medium">
            {formatMelbourneDate(announcement.publishedAt)}
          </Text>
        ) : null}
        <Text color="brand.900" fontSize={{ base: 'md', md: 'lg' }} fontWeight="bold">
          {announcement.title}
        </Text>
        {excerpt ? (
          <Text color="brand.600" fontSize="sm" lineHeight="tall">
            {excerpt}
          </Text>
        ) : null}
      </Stack>
    </Box>
  )
}

export function RecentAnnouncements({ announcements }: { announcements: Announcement[] }) {
  if (announcements.length === 0) return null

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
            Announcements
          </Text>

          <Stack gap={3}>
            {announcements.map((announcement) => (
              <AnnouncementCard key={announcement.id} announcement={announcement} />
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}
