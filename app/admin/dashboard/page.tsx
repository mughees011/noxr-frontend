'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { adminApi } from '@/lib/api'

export default function AdminDashboardPage() {
  const router = useRouter()
  const [loaded, setLoaded] = useState(false)
  const [stats, setStats] = useState<any>(null)
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [lowStock, setLowStock] = useState<any[]>([])

  useEffect(() => {
  const loadDashboard = async () => {
    try {
      const statsRes = await adminApi.get('/admin/stats')
      setStats(statsRes.data || statsRes)

      const ordersRes = await adminApi.get('/admin/recent-orders')
      setRecentOrders(ordersRes.data || ordersRes)

      const lowStockRes = await adminApi.get('/admin/low-stock')
      setLowStock(lowStockRes.data || lowStockRes)

      setLoaded(true)
    } catch (error) {
      router.push('/admin/login')
    }
  }

  loadDashboard()
}, [router])

  const handleLogout = () => {
    localStorage.removeItem('noxr_admin_token');
    router.push('/admin/login')
  }

  if (!loaded) return null

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F3ED' }}>

      {/* ── Body ── */}
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>

        {/* Main content */}
        <div style={{ flex: 1, padding: '48px 52px' }}>

          {/* Header */}
          <div style={{ marginBottom: '40px' }}>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '44px',
                fontWeight: 300,
                letterSpacing: '-0.01em',
                color: '#1A1208',
                marginBottom: '8px',
              }}
            >
              Overview
            </h1>
            <p
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: '12px',
                fontWeight: 300,
                color: 'rgba(26,18,8,0.4)',
              }}
            >
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Stats grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px',
              marginBottom: '40px',
            }}
          >
            <StatCard
  stat={{
    label: 'Total Revenue',
    value: `PKR ${stats?.totalRevenue || 0}`,
    change: '',
    period: ''
  }}
/>

<StatCard
  stat={{
    label: 'Orders',
    value: stats?.totalOrders?.toString() || '0',
    change: '',
    period: ''
  }}
/>

<StatCard
  stat={{
    label: 'Products',
    value: stats?.totalProducts?.toString() || '0',
    change: '',
    period: ''
  }}
/>

<StatCard
  stat={{
    label: 'Customers',
    value: stats?.totalUsers?.toString() || '0',
    change: '',
    period: ''
  }}
/>
          </div>

          {/* Two-column layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>

            {/* Recent orders */}
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                }}
              >
                <h2
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '24px',
                    fontWeight: 400,
                    color: '#1A1208',
                  }}
                >
                  Recent Orders
                </h2>
                <Link href="/admin/orders" className="btn-ghost" style={{ fontSize: '9px' }}>
                  View All
                </Link>
              </div>

              <div style={{ border: '0.5px solid rgba(26,18,8,0.08)', backgroundColor: '#F2EDE6' }}>
                {recentOrders.map((order: any, i: number) => (
                  <OrderRow
                    key={order._id || i}
                    order={{
                      id: order._id.slice(-6),
                      customer: order.user?.name || 'Customer',
                      total: `PKR ${order.total}`,
                      status: order.status || 'pending',
                      date: new Date(order.createdAt).toLocaleDateString(),
                    }}
                    isLast={i === recentOrders.length - 1}
                  />
                ))}
              </div>
            </div>

            {/* Low stock alert */}
            <div>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '24px',
                  fontWeight: 400,
                  color: '#1A1208',
                  marginBottom: '20px',
                }}
              >
                Low Stock
              </h2>

              <div
                style={{
                  border: '0.5px solid rgba(160,80,80,0.2)',
                  backgroundColor: 'rgba(160,80,80,0.04)',
                  padding: '20px',
                }}
              >
                {lowStock.map((item: any, i: number) => (
              <div
              key={item._id || i}
              style={{
                paddingBottom: i === lowStock.length - 1 ? 0 : '16px',
                marginBottom: i === lowStock.length - 1 ? 0 : '16px',
                borderBottom:
                i === lowStock.length - 1
                ? 'none'
                : '0.5px solid rgba(26,18,8,0.06)',
              }}
            >
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '12px',
      }}
    >
      <div>
        <p
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: '12px',
            fontWeight: 300,
            color: '#1A1208',
            marginBottom: '3px',
          }}
        >
          {item.name}
        </p>

        <p
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: '10px',
            color: 'rgba(26,18,8,0.4)',
          }}
        >
          Size: {item.size} • Stock: {item.stock}
        </p>
      </div>

      <span
        style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: '11px',
          fontWeight: 300,
          color: 'rgba(160,80,80,0.9)',
          backgroundColor: 'rgba(160,80,80,0.08)',
          padding: '4px 10px',
          borderRadius: '2px',
          flexShrink: 0,
        }}
      >
        {item.stock} left
      </span>
    </div>
  </div>
))}

                <Link
                  href="/admin/products"
                  className="btn-ghost"
                  style={{ fontSize: '9px', marginTop: '16px', display: 'inline-block' }}
                >
                  Manage Stock
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({
  stat,
}: {
  stat: {
    label: string
    value: string
    change: string
    period: string
  }
}) {
  return (
    <div
      style={{
        border: '0.5px solid rgba(26,18,8,0.08)',
        backgroundColor: '#F2EDE6',
        padding: '24px',
      }}
    >
      <p
        style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: '8.5px',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: 'rgba(26,18,8,0.3)',
          marginBottom: '12px',
        }}
      >
        {stat.label}
      </p>
      <p
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '32px',
          fontWeight: 300,
          color: '#1A1208',
          marginBottom: '8px',
          letterSpacing: '-0.01em',
        }}
      >
        {stat.value}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: '10px',
            fontWeight: 300,
            color: stat.change.startsWith('+') ? '#6B8F5E' : 'rgba(160,80,80,0.9)',
          }}
        >
          {stat.change}
        </span>
        <span
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: '10px',
            color: 'rgba(26,18,8,0.3)',
          }}
        >
          {stat.period}
        </span>
      </div>
    </div>
  )
}

// ─── Order row ────────────────────────────────────────────────────────────────
// function OrderRow({ order, isLast }: { order: typeof RECENT_ORDERS[0]; isLast: boolean }) {
function OrderRow({ order, isLast }: { order: any; isLast: boolean }) {
  const statusColors = {
    paid: { bg: 'rgba(107,143,94,0.08)', color: 'rgba(107,143,94,0.9)' },
    pending: { bg: 'rgba(180,130,50,0.08)', color: 'rgba(180,130,50,0.9)' },
    shipped: { bg: 'rgba(26,18,8,0.06)', color: 'rgba(26,18,8,0.5)' },
    processing: { bg: 'rgba(122,92,142,0.08)', color: 'rgba(122,92,142,0.9)' },
    delivered: { bg: 'rgba(79,124,92,0.08)', color: 'rgba(79,124,92,0.9)' },
    cancelled: { bg: 'rgba(160,80,80,0.08)', color: 'rgba(160,80,80,0.9)' },
  }

  const status =
    statusColors[order.status as keyof typeof statusColors] ||
    { bg: 'rgba(26,18,8,0.06)', color: 'rgba(26,18,8,0.5)' }

  return (
    <div
      style={{
        padding: '18px 20px',
        borderBottom: isLast ? 'none' : '0.5px solid rgba(26,18,8,0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div>
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '11.5px', fontWeight: 300, color: '#1A1208', marginBottom: '4px' }}>
          {order.id} · {order.customer}
        </p>
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '10px', color: 'rgba(26,18,8,0.35)' }}>
          {order.date}
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontFamily: "'Jost', sans-serif", fontSize: '12px', fontWeight: 300, color: 'rgba(26,18,8,0.6)' }}>
          {order.total}
        </span>
        <span
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: '8px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            padding: '4px 10px',
            backgroundColor: status.bg,
            color: status.color,
          }}
        >
          {order.status}
        </span>
      </div>
    </div>
  )
}
