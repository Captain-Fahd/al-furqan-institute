import { Box, Container, Flex, Link as ChakraLink, Stack, Text } from '@chakra-ui/react'
import NextLink from 'next/link'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <Box as="footer" bg="brand.950" borderTopWidth="1px" borderColor="brand.800" py={{ base: 8, md: 10 }}>
      <Container maxW="6xl">
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align={{ base: 'flex-start', md: 'center' }}
          gap={4}
        >
          <Stack gap={1}>
            <Text color="brand.50" fontSize="md" fontWeight="semibold">
              Al-Furqan Institute
            </Text>
            <Text color="brand.300" fontSize="sm" maxW="sm">
              Official Hijri month verdicts and moonsighting for Melbourne, Australia.
            </Text>
          </Stack>

          <ChakraLink
            asChild
            color="accent.300"
            fontSize="sm"
            fontWeight="medium"
            _hover={{ color: 'accent.200', textDecoration: 'none' }}
          >
            <NextLink href="/subscribe">Get email alerts</NextLink>
          </ChakraLink>
        </Flex>

        <Text color="brand.400" fontSize="xs" mt={{ base: 6, md: 8 }}>
          © {year} Al-Furqan Institute. Times shown for Australia/Melbourne (AEST/AEDT).
        </Text>
      </Container>
    </Box>
  )
}
