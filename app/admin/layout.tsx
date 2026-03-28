import AdminSidebar from '@/components/admin/AdminSidebar'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
              Admin Page
            </p>
          </div>

          <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
            <Link href="/" style={{ fontSize: '12px' }}>
              View Store
            </Link>
            <Link href="/admin/login" style={{ fontSize: '12px' }}>
              Logout
            </Link>
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