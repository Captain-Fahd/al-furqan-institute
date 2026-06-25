import { Box, Container, Heading, Stack, Text } from '@chakra-ui/react'
import type { Metadata } from 'next'
import React from 'react'

import { SubscribeForm } from '@/components/subscribe/SubscribeForm'

export const metadata: Metadata = {
  title: 'Subscribe · Al-Furqan Institute',
  description:
    'Get email alerts the moment Al-Furqan Institute publishes a moonsighting verdict for Melbourne.',
}

export default function SubscribePage() {
  return (
    <Box
      as="main"
      bg="brand.900"
      minH="100dvh"
      pt={{ base: 24, md: 28 }}
      pb={{ base: 16, md: 24 }}
      px={6}
    >
      <Container maxW="lg">
        <Stack gap={{ base: 6, md: 8 }}>
          <Stack gap={2}>
            <Text
              color="accent.400"
              fontSize={{ base: 'sm', md: 'md' }}
              fontWeight="semibold"
              letterSpacing="wide"
              textTransform="uppercase"
            >
              Email alerts
            </Text>
            <Heading color="brand.50" size={{ base: 'xl', md: '2xl' }}>
              Never miss a verdict
            </Heading>
            <Text color="brand.200" fontSize={{ base: 'sm', md: 'md' }} lineHeight="tall">
              Subscribe to receive official moonsighting verdicts for Melbourne as soon as
              they&apos;re published. We&apos;ll send a confirmation link first to make sure
              it&apos;s really you.
            </Text>
          </Stack>

          <Box
            bg="brand.950"
            borderWidth="1px"
            borderColor="brand.800"
            rounded="2xl"
            px={{ base: 5, md: 8 }}
            py={{ base: 6, md: 8 }}
          >
            <SubscribeForm />
          </Box>

          <Text color="brand.400" fontSize="xs" lineHeight="tall">
            We only email moonsighting verdicts and essential updates. You can unsubscribe at
            any time using the link in every email.
          </Text>
        </Stack>
      </Container>
    </Box>
  )
}
