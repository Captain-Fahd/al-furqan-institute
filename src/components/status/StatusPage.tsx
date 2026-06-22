import { Box, Heading, Link as ChakraLink, Stack, Text } from '@chakra-ui/react'
import NextLink from 'next/link'
import React from 'react'

export interface StatusPageProps {
  tone: 'success' | 'error'
  title: string
  message: string
  cta?: { href: string; label: string }
}

const TONE_COLOR: Record<StatusPageProps['tone'], string> = {
  success: 'accent.400',
  error: 'red.300',
}

export function StatusPage({ tone, title, message, cta }: StatusPageProps) {
  return (
    <Box
      as="main"
      bg="brand.900"
      minH="100dvh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={6}
      py={24}
    >
      <Stack
        gap={5}
        maxW="md"
        textAlign="center"
        bg="brand.950"
        borderWidth="1px"
        borderColor="whiteAlpha.200"
        borderRadius="2xl"
        px={{ base: 6, md: 10 }}
        py={{ base: 10, md: 12 }}
      >
        <Box
          alignSelf="center"
          w={3}
          h={3}
          borderRadius="full"
          bg={TONE_COLOR[tone]}
        />
        <Heading size="lg" color="white">
          {title}
        </Heading>
        <Text color="whiteAlpha.800" fontSize="md" lineHeight="tall">
          {message}
        </Text>
        {cta ? (
          <ChakraLink
            as={NextLink}
            href={cta.href}
            color="brand.900"
            bg="accent.400"
            _hover={{ bg: 'accent.300', textDecoration: 'none' }}
            fontWeight="semibold"
            borderRadius="lg"
            px={6}
            py={3}
            alignSelf="center"
          >
            {cta.label}
          </ChakraLink>
        ) : null}
      </Stack>
    </Box>
  )
}
