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
  Text,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
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

function NavBrand() {
  return (
    <NextLink href="/" aria-label="Al-Furqan Institute home">
        <Image
          src="/logo.jpeg"
          alt=""
          w={{base: "80vw", md: "20%"}}
          h="auto"
          objectFit="contain"
        />
    </NextLink>
  )
}

export function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeDrawer = () => setDrawerOpen(false)

  return (
    <Box
      as="header"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex="sticky"
      bg="brand.900"
      borderBottomWidth={scrolled ? '1px' : '0'}
      borderColor="brand.800"
      transition="border-color 0.15s"
      p={{base: 0, md: 1}}
      w="100%"
    >
      <Container maxW="6xl">
        <Flex align="center" justify="space-between" h={{ base: 16, md: 20 }} w={{base: "100%", md: "90%"}} gap={4}>
          <HStack gap={{ base: 4, lg: 12 }} align="center">
            <NavBrand />

            <HStack as="nav" aria-label="Main" gap={1} display={{ base: 'none', lg: 'flex' }}>
              {NAV_ITEMS.map((item) => (
                <NavLink key={item.href} href={item.href} label={item.label} />
              ))}
            </HStack>
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
              open={drawerOpen}
              onOpenChange={(details) => setDrawerOpen(details.open)}
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
                          onNavigate={closeDrawer}
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
                        <NextLink href="/subscribe" onClick={closeDrawer}>
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
