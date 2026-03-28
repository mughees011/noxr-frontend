'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { CSSProperties } from 'react'

export default function AdminSidebar() {
  const pathname = usePathname()

  const links = [
    { label: 'Overview', href: '/admin/dashboard' },
    { label: 'Products', href: '/admin/products' },
    { label: 'Orders', href: '/admin/orders' },
    { label: 'Customers', href: '/admin/customers' },
    { label: 'Collections', href: '/admin/collections' },
    { label: 'Analytics', href: '/admin/analytics' },
    { label: 'Discounts', href: '/admin/discounts' },
    { label: 'Content', href: '/admin/content' },
    { label: 'Returns', href: '/admin/returns' },
    { label: 'Emails', href: '/admin/email' },
    { label: 'Support', href: '/admin/support' },
    { label: 'Settings', href: '/admin/settings' },
  ]

  return (
    <aside style={sidebarStyle}>
      <div style={logoWrapperStyle}>
        <p style={logoStyle}>NOXR</p>
        <p style={subtitleStyle}>Admin</p>
      </div>

      <nav>
        {links.map(link => {
          const isActive = pathname === link.href

          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                ...linkStyle,
                color: isActive ? '#1A1208' : 'rgba(26,18,8,0.5)',
                borderLeft: isActive ? '2px solid #1A1208' : '2px solid transparent',
                backgroundColor: isActive ? 'rgba(26,18,8,0.04)' : 'transparent',
              }}
            >
              {link.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

const sidebarStyle: CSSProperties = {
  width: '240px',
  minHeight: '100vh',
  borderRight: '0.5px solid rgba(26,18,8,0.08)',
  padding: '32px 0',
  backgroundColor: '#F7F3ED',
  flexShrink: 0,
}

const logoWrapperStyle: CSSProperties = {
  padding: '0 32px',
  marginBottom: '28px',
}

const logoStyle: CSSProperties = {
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: '16px',
  fontWeight: 300,
  letterSpacing: '0.4em',
  color: '#1A1208',
  marginBottom: '6px',
}

const subtitleStyle: CSSProperties = {
  fontFamily: "'Jost', sans-serif",
  fontSize: '8px',
  letterSpacing: '0.3em',
  textTransform: 'uppercase',
  color: 'rgba(26,18,8,0.25)',
}

const linkStyle: CSSProperties = {
  display: 'block',
  padding: '12px 32px',
  fontFamily: "'Jost', sans-serif",
  fontSize: '11.5px',
  fontWeight: 300,
  letterSpacing: '0.03em',
  textDecoration: 'none',
  transition: 'background-color 0.3s ease, color 0.3s ease',
}