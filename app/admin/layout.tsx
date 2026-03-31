'use client'

import { useAdminAuth } from '@/hooks/useAdminAuth'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAdminAuth()

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('noxr_admin_token')
    router.push('/admin/login')
  }

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div 
        style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#F7F3ED' 
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div 
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(26,18,8,0.1)',
              borderTop: '3px solid #1A1208',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }}
          />
          <p style={{ 
            fontFamily: "'Jost', sans-serif", 
            fontSize: '11px', 
            color: 'rgba(26,18,8,0.4)',
            letterSpacing: '0.15em'
          }}>
            VERIFYING...
          </p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  // If not authenticated, don't render anything (redirect happens in hook)
  if (!isAuthenticated) {
    return null
  }

  // Authenticated - show admin layout
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F7F3ED' }}>
      
      <AdminSidebar />

      <div style={{ flex: 1 }}>
        
        {/* Top Admin Header */}
        <div
          style={{
            borderBottom: '0.5px solid rgba(26,18,8,0.08)',
            padding: '20px 52px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#F7F3ED',
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '18px',
                letterSpacing: '0.4em',
                color: '#1A1208',
              }}
            >
              NOXR ADMIN
            </p>
          </div>

          <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
            <Link 
              href="/" 
              style={{ 
                fontFamily: "'Jost', sans-serif",
                fontSize: '10px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'rgba(26,18,8,0.6)',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
            >
              View Store
            </Link>
            <button
              onClick={handleLogout}
              style={{ 
                fontFamily: "'Jost', sans-serif",
                fontSize: '10px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'rgba(26,18,8,0.6)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Page Content */}
        <main style={{ padding: '48px 52px' }}>
          {children}
        </main>

      </div>
    </div>
  )
}