'use client'

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { openCart } from '@/store/cartSlice'
import { RootState } from '@/store'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'

export default function Header() {
  const dispatch = useDispatch()
  const pathname = usePathname()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Live cart count from Redux
  const cartItems = useSelector((state: RootState) => state.cart.items)
  const cartItemCount = cartItems.reduce(
    (sum: number, item: any) => sum + item.quantity,
    0
  )

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Handle search submission
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setIsMobileMenuOpen(false)
    }
  }

  // Handle Enter key in search input
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const isAtTop = !isScrolled

  const navLinks = [
    { name: 'Shop',        href: '/shop' },
    { name: 'Collections', href: '/collections' },
    { name: 'About',       href: '/about' },
    { name: 'Contact',     href: '/contact' },
  ]

  return (
    <header
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 50,
        transition: 'background-color 0.6s cubic-bezier(0.25,0.46,0.45,0.94), border-color 0.6s ease',
        backgroundColor: isAtTop
          ? 'transparent'
          : 'rgba(26,18,8,0.3)',
        backdropFilter: isAtTop ? 'none' : 'blur(12px)',
        WebkitBackdropFilter: isAtTop ? 'none' : 'blur(12px)',
        borderBottom: isAtTop
          ? 'none'
          : '0.5px solid rgba(247,243,237,0.15)',
      }}
    >
      <nav
        className="flex items-center justify-between"
        style={{
          maxWidth: '1320px',
          margin: '0 auto',
          padding: '0 40px',
          height: '64px',
        }}
      >
        {/* Left links */}
        <ul className="hidden md:flex items-center gap-5" style={{ flex: 1, minWidth: 0 }}>
          {navLinks.map(link => (
            <NavItem
              key={link.href}
              link={link}
              isActive={pathname === link.href}
              isAtTop={isAtTop}
            />
          ))}
        </ul>

        {/* Logo */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Image
            src={isAtTop ? "/logo/noxr-logo-1.png" : "/logo/noxr-logo1.png"}
            alt="NOXR"
            width={110}
            height={40}
            priority
            style={{
              height: '40px',
              width: 'auto',
              objectFit: 'contain',
              transition: 'opacity 0.4s ease',
              opacity: isAtTop ? 1 : 0.95,
            }}
          />
        </Link>

        {/* Right links + icons */}
        <ul
          className="hidden md:flex items-center gap-5"
          style={{ flex: 1, justifyContent: 'flex-end', minWidth: 0 }}
        >
          {/* Search */}
          <div style={{ position: 'relative', width: '220px' }}>
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: isAtTop
                    ? '0.5px solid rgba(26,18,8,0.45)'
                    : '0.5px solid rgba(247,243,237,0.6)',
                  color: isAtTop
                    ? 'rgba(26,18,8,0.8)'
                    : 'rgba(247,243,237,0.9)',
                  padding: '10px 26px 8px 0',
                  fontFamily: "'Jost', sans-serif",
                  fontSize: '11px',
                  fontWeight: 300,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  outline: 'none',
                  transition: 'border-color 0.3s ease, color 0.3s ease',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderBottom =
                    isAtTop
                      ? '0.5px solid #1A1208'
                      : '0.5px solid #F7F3ED'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderBottom =
                    isAtTop
                      ? '0.5px solid rgba(26,18,8,0.45)'
                      : '0.5px solid rgba(247,243,237,0.6)'
                }}
              />
            </form>

            <button
              onClick={handleSearch}
              style={{
                position: 'absolute',
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                color: isAtTop
                  ? 'rgba(26,18,8,0.5)'
                  : 'rgba(247,243,237,0.6)',
              }}
              aria-label="Search"
            >
              <SearchIcon />
            </button>
          </div>

          {/* Account */}
          <li style={{ listStyle: 'none' }}>
            <Link
              href="/auth/login"
              aria-label="Account"
              style={{
                display: 'flex',
                alignItems: 'center',
                color: isAtTop
                  ? 'rgba(26,18,8,0.6)'
                  : 'rgba(247,243,237,0.6)',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.color = isAtTop ? '#1A1208' : '#FFFFFF'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.color = isAtTop
                  ? 'rgba(26,18,8,0.6)'
                  : 'rgba(247,243,237,0.6)'
              }}
            >
              <UserIcon />
            </Link>
          </li>

          {/* Cart */}
          <li>
            <button
              onClick={() => dispatch(openCart())}
              aria-label="Open cart"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                color: isAtTop
                  ? 'rgba(26,18,8,0.6)'
                  : 'rgba(247,243,237,0.6)',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.color = isAtTop ? '#1A1208' : '#FFFFFF'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.color = isAtTop
                  ? 'rgba(26,18,8,0.6)'
                  : 'rgba(247,243,237,0.6)'
              }}
            >
              <BagIcon />
              {cartItemCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-7px',
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    backgroundColor: isAtTop ? '#F7F3ED' : '#1A1208',
                    color: isAtTop ? '#1A1208' : '#F7F3ED',
                    fontFamily: "'Jost', sans-serif",
                    fontSize: '7px',
                    fontWeight: 300,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    letterSpacing: 0,
                    transition: 'background-color 0.5s ease, color 0.5s ease',
                  }}
                >
                  {cartItemCount}
                </span>
              )}
            </button>
          </li>
        </ul>

        {/* Mobile: right side */}
        <div className="md:hidden flex items-center" style={{ gap: '20px', paddingRight: '20px' }}>
          <Link
            href="/auth/login"
            aria-label="Account"
            style={{
              display: 'flex',
              alignItems: 'center',
              color: isAtTop ? '#1A1208' : '#F7F3ED',
            }}
          >
            <UserIcon />
          </Link>

          <button
            onClick={() => dispatch(openCart())}
            aria-label="Open cart"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              color: isAtTop ? '#1A1208' : '#F7F3ED',
            }}
          >
            <BagIcon />
            {cartItemCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-7px',
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  backgroundColor: isAtTop ? '#F7F3ED' : '#1A1208',
                  color: isAtTop ? '#1A1208' : '#F7F3ED',
                  fontFamily: "'Jost', sans-serif",
                  fontSize: '7px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {cartItemCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(o => !o)}
            aria-label="Toggle menu"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              color: isAtTop ? '#1A1208' : '#F7F3ED',
            }}
          >
            {isMobileMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className="md:hidden overflow-hidden"
        style={{
          maxHeight: isMobileMenuOpen ? '400px' : '0px',
          transition: 'max-height 0.5s cubic-bezier(0.25,0.46,0.45,0.94)',
          backgroundColor: 'rgba(247,243,237,0.98)',
          backdropFilter: 'blur(16px)',
          borderBottom: isMobileMenuOpen
            ? '0.5px solid rgba(26,18,8,0.08)'
            : 'none',
        }}
      >
        <div style={{ padding: '24px 52px 32px' }}>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {navLinks.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    display: 'block',
                    padding: '14px 0',
                    borderBottom: '0.5px solid rgba(26,18,8,0.07)',
                    fontFamily: "'Jost', sans-serif",
                    fontSize: '11px',
                    fontWeight: 300,
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    color: pathname === link.href
                      ? '#1A1208'
                      : 'rgba(26,18,8,0.4)',
                    transition: 'color 0.3s ease',
                  }}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile search */}
          <div style={{ marginTop: '24px' }}>
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '0.5px solid rgba(26,18,8,0.2)',
                  padding: '11px 0',
                  fontFamily: "'Jost', sans-serif",
                  fontSize: '12px',
                  fontWeight: 300,
                  color: '#1A1208',
                  outline: 'none',
                  letterSpacing: '0.02em',
                }}
              />
            </form>
          </div>
        </div>
      </div>
    </header>
  )
}

// Nav item
function NavItem({
  link,
  isActive,
  isAtTop,
}: {
  link: { name: string; href: string }
  isActive: boolean
  isAtTop: boolean
}) {
  const defaultColor = isActive
    ? (isAtTop ? '#1A1208' : '#F7F3ED')
    : (isAtTop ? 'rgba(26,18,8,0.6)' : 'rgba(247,243,237,0.6)')

  return (
    <li style={{ listStyle: 'none' }}>
      <Link
        href={link.href}
        style={{
          position: 'relative',
          display: 'inline-block',
          fontFamily: "'Jost', sans-serif",
          fontSize: '9.5px',
          fontWeight: 300,
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          color: isActive
            ? (isAtTop ? '#1A1208' : '#F7F3ED')
            : (isAtTop ? 'rgba(26,18,8,0.6)' : 'rgba(247,243,237,0.6)'),
          transition: 'color 0.3s ease',
          paddingBottom: '3px',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement
          el.style.color = isAtTop ? '#1A1208' : '#FFFFFF'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement
          el.style.color = defaultColor
        }}
      >
        {link.name}
        <span
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '0.5px',
            backgroundColor: isAtTop
              ? 'rgba(26,18,8,0.45)'
              : 'rgba(26,18,8,0.5)',
            transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'left',
            transition: 'transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94)',
            display: 'block',
          }}
          className="nav-underline"
        />
      </Link>
    </li>
  )
}

// Icons
function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-5-5" />
    </svg>
  )
}

function BagIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  )
}

function HamburgerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round">
      <line x1="3" y1="7" x2="21" y2="7" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="17" x2="21" y2="17" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21a8 8 0 10-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}