'use client'

import { Box, Button, chakra, Input, Stack, Text } from '@chakra-ui/react'
import { useState } from 'react'

type FormState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success'; message: string }
  | { status: 'error'; message: string }

export function SubscribeForm() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<FormState>({ status: 'idle' })

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setState({ status: 'submitting' })

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = (await response.json().catch(() => ({}))) as {
        message?: string
        error?: string
      }

      if (!response.ok) {
        setState({
          status: 'error',
          message: data.error ?? 'Something went wrong. Please try again.',
        })
        return
      }

      setState({
        status: 'success',
        message:
          data.message ??
          'Almost there — check your inbox for a confirmation link to finish subscribing.',
      })
      setEmail('')
    } catch {
      setState({ status: 'error', message: 'Network error. Please try again.' })
    }
  }

  if (state.status === 'success') {
    return (
      <Box
        bg="brand.900"
        borderWidth="1px"
        borderColor="accent.400"
        rounded="lg"
        px={5}
        py={4}
        role="status"
      >
        <Text color="accent.300" fontWeight="semibold" mb={1}>
          Check your inbox
        </Text>
        <Text color="brand.100" fontSize="sm">
          {state.message}
        </Text>
      </Box>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Stack gap={3}>
        <chakra.label
          htmlFor="subscribe-email"
          color="brand.100"
          fontSize="sm"
          fontWeight="medium"
        >
          Email address
        </chakra.label>
        <Input
          id="subscribe-email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          bg="brand.900"
          borderColor="brand.700"
          color="brand.50"
          _placeholder={{ color: 'brand.400' }}
          _hover={{ borderColor: 'brand.600' }}
        />

        {state.status === 'error' ? (
          <Text color="red.300" fontSize="sm" role="alert">
            {state.message}
          </Text>
        ) : null}

        <Button
          type="submit"
          loading={state.status === 'submitting'}
          loadingText="Subscribing…"
          bg="accent.400"
          color="brand.950"
          fontWeight="semibold"
          _hover={{ bg: 'accent.300' }}
        >
          Subscribe
        </Button>
      </Stack>
    </form>
  )
}
