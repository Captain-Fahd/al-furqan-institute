import { Box, Button, Container, Heading, Stack, Text } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'

export default function HomePage() {
  return (
    <Box as="main" bg="brand.50" minH="100dvh" py={{ base: 12, md: 20 }}>
      <Container maxW="3xl">
        <Stack gap={6} textAlign="center" align="center">
          <Text color="brand.fg" fontWeight="medium" letterSpacing="wide" textTransform="uppercase">
            Al-Furqan Institute
          </Text>
          <Heading as="h1" size={{ base: '2xl', md: '4xl' }} color="brand.800">
            Moonsighting & Hijri Verdicts for Melbourne
          </Heading>
          <Text color="brand.700" fontSize={{ base: 'md', md: 'lg' }} maxW="2xl">
            Official Hijri month rulings, sighting reports, and moonsighting trips for the
            Melbourne, Australia community.
          </Text>
          <Button asChild colorPalette="brand" size="lg">
            <Link href="/admin">Admin panel</Link>
          </Button>
        </Stack>
      </Container>
    </Box>
  )
}
