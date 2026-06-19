export type NavItem = {
  label: string
  href: string
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Calendar', href: '/calendar' },
  { label: 'Trips', href: '/trips' },
  { label: 'Reports', href: '/reports' },
  { label: 'About', href: '/about' },
]
