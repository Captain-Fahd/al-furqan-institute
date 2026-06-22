import {
  Body,
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

export interface VerdictEmailProps {
  headline: string
  status: 'sighted' | 'not-sighted'
  hijriMonth: string
  hijriYear: number
  gregorianStartDate: string
  summary?: string | null
  unsubscribeUrl: string
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

const eyebrow: React.CSSProperties = {
  color: '#0b6e4f',
  fontSize: '13px',
  fontWeight: 600,
  letterSpacing: '0.08em',
  margin: '0 0 8px',
  textTransform: 'uppercase',
}

const heading: React.CSSProperties = {
  color: '#0b1d26',
  fontSize: '24px',
  fontWeight: 700,
  margin: '0 0 16px',
}

const text: React.CSSProperties = {
  color: '#334155',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0 0 16px',
}

const dateBox: React.CSSProperties = {
  backgroundColor: '#f1f5f9',
  borderRadius: '8px',
  margin: '0 0 16px',
  padding: '16px 20px',
}

const dateLabel: React.CSSProperties = {
  color: '#64748b',
  fontSize: '13px',
  margin: '0 0 4px',
}

const dateValue: React.CSSProperties = {
  color: '#0b1d26',
  fontSize: '18px',
  fontWeight: 700,
  margin: '0',
}

const muted: React.CSSProperties = {
  color: '#94a3b8',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '0',
}

const hr: React.CSSProperties = {
  borderColor: '#e2e8f0',
  margin: '24px 0',
}

export function VerdictEmail({
  headline,
  status,
  hijriMonth,
  hijriYear,
  gregorianStartDate,
  summary,
  unsubscribeUrl,
}: VerdictEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{headline}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={eyebrow}>Moonsighting verdict · Melbourne</Text>
          <Heading style={heading}>{headline}</Heading>
          {status === 'sighted' ? (
            <Section style={dateBox}>
              <Text style={dateLabel}>
                {hijriMonth} {hijriYear} AH begins
              </Text>
              <Text style={dateValue}>{gregorianStartDate}</Text>
            </Section>
          ) : (
            <Text style={text}>
              The crescent for {hijriMonth} {hijriYear} AH was not sighted in
              Melbourne. The current month completes 30 days.
            </Text>
          )}
          {summary ? <Text style={text}>{summary}</Text> : null}
          <Hr style={hr} />
          <Text style={muted}>
            You&apos;re receiving this because you subscribed to Al-Furqan
            Institute verdicts.{' '}
            <Link href={unsubscribeUrl} style={{ color: '#64748b' }}>
              Unsubscribe
            </Link>
            .
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default VerdictEmail
