'use client'

import {
  Box,
  Button,
  Container,
  Drawer,
  Flex,
  HStack,
  IconButton,
  Image,
  Stack,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { LuMenu } from 'react-icons/lu'

import { NAV_ITEMS } from './nav-config'

type NavLinkProps = {
  href: string
  label: string
  onNavigate?: () => void
  stacked?: boolean
}

function NavLink({ href, label, onNavigate, stacked = false }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <NextLink href={href} onClick={onNavigate}>
      <Box
        px={stacked ? 4 : 3}
        py={stacked ? 3 : 2}
        w={stacked ? 'full' : 'auto'}
        rounded="md"
        fontSize="sm"
        fontWeight={isActive ? 'semibold' : 'medium'}
        color={isActive ? 'accent.300' : 'brand.50'}
        bg={isActive ? 'whiteAlpha.100' : 'transparent'}
        borderLeftWidth={stacked && isActive ? '3px' : '0'}
        borderLeftColor="accent.400"
        borderBottomWidth={!stacked && isActive ? '2px' : '0'}
        borderBottomColor="accent.400"
        _hover={{ color: 'accent.200', bg: 'whiteAlpha.100' }}
        transition="color 0.15s, background 0.15s"
      >
        {label}
      </Box>
    </NextLink>
  )
}

export function Navbar() {
  const [open, setOpen] = useState(false)

  const closeMenu = () => setOpen(false)

  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex="sticky"
      bg="brand.900"
      borderBottomWidth="1px"
      borderColor="brand.800"
    >
      <Container maxW="6xl">
        <Flex align="center" justify="space-between" h={{ base: 16, md: 20 }} gap={4}>
          <NextLink href="/" aria-label="Al-Furqan Institute home">
            <Image
              src="/logo.jpeg"
              alt=""
              h={{ base: 14, md: 16 }}
              w="auto"
            />
          </NextLink>

          <HStack as="nav" aria-label="Main" gap={1} display={{ base: 'none', lg: 'flex' }}>
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} />
            ))}
          </HStack>

          <HStack gap={2}>
            <Button
              asChild
              size="sm"
              display={{ base: 'none', lg: 'inline-flex' }}
              bg="accent.500"
              color="brand.950"
              fontWeight="semibold"
              _hover={{ bg: 'accent.400' }}
            >
              <NextLink href="/subscribe">Get alerts</NextLink>
            </Button>

            <Drawer.Root
              open={open}
              onOpenChange={(details) => setOpen(details.open)}
              placement="end"
            >
              <Drawer.Trigger asChild>
                <IconButton
                  display={{ base: 'inline-flex', lg: 'none' }}
                  variant="ghost"
                  color="brand.50"
                  aria-label="Open menu"
                  size="sm"
                >
                  <LuMenu />
                </IconButton>
              </Drawer.Trigger>
              <Drawer.Backdrop />
              <Drawer.Positioner>
                <Drawer.Content bg="brand.900" color="brand.50" maxW="xs">
                  <Drawer.Header borderBottomWidth="1px" borderColor="brand.800">
                    <Drawer.Title color="accent.400" fontSize="md">
                      Menu
                    </Drawer.Title>
                    <Drawer.CloseTrigger color="brand.50" />
                  </Drawer.Header>
                  <Drawer.Body py={4}>
                    <Stack as="nav" aria-label="Main" gap={1}>
                      {NAV_ITEMS.map((item) => (
                        <NavLink
                          key={item.href}
                          href={item.href}
                          label={item.label}
                          stacked
                          onNavigate={closeMenu}
                        />
                      ))}
                      <Button
                        asChild
                        mt={4}
                        w="full"
                        bg="accent.500"
                        color="brand.950"
                        fontWeight="semibold"
                        _hover={{ bg: 'accent.400' }}
                      >
                        <NextLink href="/subscribe" onClick={closeMenu}>
                          Get alerts
                        </NextLink>
                      </Button>
                    </Stack>
                  </Drawer.Body>
                </Drawer.Content>
              </Drawer.Positioner>
            </Drawer.Root>
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}
