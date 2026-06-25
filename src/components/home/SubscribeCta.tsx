import { Box, Button, Container, Heading, Stack, Text } from '@chakra-ui/react'
import NextLink from 'next/link'

export function SubscribeCta() {
  return (
    <Box as="section" bg="brand.900" pb={{ base: 16, md: 24 }}>
      <Container maxW="6xl">
        <Box
          bg="brand.950"
          borderWidth="1px"
          borderColor="brand.800"
          rounded="2xl"
          px={{ base: 6, md: 10 }}
          py={{ base: 8, md: 10 }}
        >
          <Stack
            gap={{ base: 4, md: 5 }}
            align={{ base: 'flex-start', md: 'center' }}
            textAlign={{ base: 'left', md: 'center' }}
          >
            <Stack gap={2} align={{ base: 'flex-start', md: 'center' }}>
              <Heading color="brand.50" size={{ base: 'lg', md: 'xl' }}>
                Never miss a verdict
              </Heading>
              <Text color="brand.200" fontSize={{ base: 'sm', md: 'md' }} maxW="xl">
                Get an email the moment an official moonsighting verdict is published for
                Melbourne — so you know if tomorrow is the first of the month.
              </Text>
            </Stack>

            <Button
              asChild
              size="lg"
              bg="accent.400"
              color="brand.950"
              fontWeight="semibold"
              _hover={{ bg: 'accent.300' }}
            >
              <NextLink href="/subscribe">Get email alerts</NextLink>
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}
