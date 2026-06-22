import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

export interface ConfirmationEmailProps {
  confirmUrl: string
}

const main: React.CSSProperties = {
  backgroundColor: '#0b1d26',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  padding: '24px 0',
}

const container: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  margin: '0 auto',
  maxWidth: '520px',
  padding: '32px',
}

const heading: React.CSSProperties = {
  color: '#0b1d26',
  fontSize: '22px',
  fontWeight: 700,
  margin: '0 0 16px',
}

const text: React.CSSProperties = {
  color: '#334155',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0 0 16px',
}

const button: React.CSSProperties = {
  backgroundColor: '#0b6e4f',
  borderRadius: '8px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '15px',
  fontWeight: 600,
  padding: '12px 24px',
  textDecoration: 'none',
}

const muted: React.CSSProperties = {
  color: '#94a3b8',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '0',
  wordBreak: 'break-all',
}

const hr: React.CSSProperties = {
  borderColor: '#e2e8f0',
  margin: '24px 0',
}

export function ConfirmationEmail({ confirmUrl }: ConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Confirm your subscription to Al-Furqan Institute</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Confirm your subscription</Heading>
          <Text style={text}>
            Assalamu alaikum, thank you for subscribing to moonsighting verdicts
            from Al-Furqan Institute. Please confirm your email address to start
            receiving official Hijri month announcements for Melbourne.
          </Text>
          <Section style={{ margin: '24px 0' }}>
            <Button href={confirmUrl} style={button}>
              Confirm subscription
            </Button>
          </Section>
          <Text style={text}>
            If the button doesn&apos;t work, copy and paste this link into your
            browser:
          </Text>
          <Text style={muted}>
            <Link href={confirmUrl} style={{ color: '#0b6e4f' }}>
              {confirmUrl}
            </Link>
          </Text>
          <Hr style={hr} />
          <Text style={muted}>
            You received this because someone subscribed with this address. If
            that wasn&apos;t you, you can safely ignore this email — no emails
            will be sent until you confirm.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default ConfirmationEmail
