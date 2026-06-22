/** Base URL for building absolute links in emails and redirects. */
export function getServerUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, '') ||
    'http://localhost:3000'
  )
}

export function buildConfirmUrl(token: string): string {
  return `${getServerUrl()}/confirm?token=${encodeURIComponent(token)}`
}

export function buildUnsubscribeUrl(token: string): string {
  return `${getServerUrl()}/unsubscribe?token=${encodeURIComponent(token)}`
}
