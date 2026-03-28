'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

/* ================= TYPES ================= */

interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
}

interface Order {
  _id: string
  user?: {
    name?: string
    email?: string
  }
  items: OrderItem[]
  total: number
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  trackingNumber?: string
}

/* ================= PAGE ================= */

export default function AdminOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [filter, setFilter] = useState<'all' | Order['status']>('all')
  const [search, setSearch] = useState('')
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('noxr_admin_token')
      if (!token) {
        router.push('/admin/login')
        return
      }

      const res = await fetch('http://localhost:5000/api/admin/orders', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await res.json()
      if (Array.isArray(data)) {
        setOrders(data)
      }
    }

    fetchOrders()
  }, [router])

  const filteredOrders = orders
    .filter(o => filter === 'all' || o.status === filter)
    .filter(
      o =>
        search === '' ||
        o._id.toLowerCase().includes(search.toLowerCase()) ||
        (o.user?.name || '').toLowerCase().includes(search.toLowerCase())
    )


    const updateTracking = async (orderId: string, trackingNumber: string) => {
  if (!trackingNumber) return

  const token = localStorage.getItem('noxr_admin_token')

  const res = await fetch(
    `http://localhost:5000/api/admin/orders/${orderId}/tracking`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ trackingNumber })
    }
  )

  if (!res.ok) {
    const err = await res.json()
    alert(err.message || 'Tracking update failed')
    return
  }

  const updated = await res.json()

  setOrders(prev =>
    prev.map(o => (o._id === updated._id ? updated : o))
  )
}



  const handleStatusUpdate = async (
  orderId: string,
  newStatus: Order['status']
) => {
  const order = orders.find(o => o._id === orderId)

  if (newStatus === 'shipped' && !order?.trackingNumber) {
    alert('Add tracking number first')
    return
  }

  const token = localStorage.getItem('noxr_admin_token')

  const res = await fetch(
    `http://localhost:5000/api/admin/orders/${orderId}/status`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus })
    }
  )

  if (!res.ok) {
    const err = await res.json()
    alert(err.message)
    return
  }

  const updated = await res.json()

  setOrders(prev =>
    prev.map(o => (o._id === updated._id ? updated : o))
  )
}


  const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return '#BFAE9F'
    case 'paid':
      return '#4A6FA5'
    case 'processing':
      return '#7A5C8E'
    case 'shipped':
      return '#C27C2C'
    case 'delivered':
      return '#4F7C5C'
    case 'cancelled':
      return '#A54A4A'
    default:
      return '#000'
  }
}
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F3ED' }}>
      
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>

        <div style={{ flex: 1, padding: '48px 52px' }}>
          
          {/* Header */}
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '44px',
              fontWeight: 300,
              color: '#1A1208'
            }}>
              Orders
            </h1>
            <p style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '12px',
              color: 'rgba(26,18,8,0.4)'
            }}>
              {filteredOrders.length} orders
            </p>
          </div>

          {/* Filters */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '28px'
          }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['all', 'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: '8px 18px',
                    fontSize: '9px',
                    letterSpacing: '0.28em',
                    textTransform: 'uppercase',
                    backgroundColor: filter === f ? '#1A1208' : 'transparent',
                    color: filter === f ? '#F7F3ED' : 'rgba(26,18,8,0.4)',
                    border: `0.5px solid ${
                      filter === f ? '#1A1208' : 'rgba(26,18,8,0.15)'
                    }`
                  }}
                >
                  {f}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearch(e.target.value)
              }
              placeholder="Search orders…"
              style={{
                width: '280px',
                background: 'transparent',
                border: 'none',
                borderBottom: '0.5px solid rgba(26,18,8,0.2)',
                padding: '10px 0'
              }}
            />
          </div>

          {/* Table */}
          <div style={{
            border: '0.5px solid rgba(26,18,8,0.08)',
            backgroundColor: '#F2EDE6'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '0.5px solid rgba(26,18,8,0.08)' }}>
                  {['Order', 'Customer', 'Total', 'Tracking', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} style={{
                      padding: '16px 20px',
                      fontSize: '8.5px',
                      letterSpacing: '0.35em',
                      textTransform: 'uppercase',
                      color: 'rgba(26,18,8,0.35)',
                      textAlign: 'left'
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order, i) => {
                  const date = new Date(order.createdAt)

                  return (
                    <tr key={order._id}
                      style={{
                        borderBottom:
                          i === filteredOrders.length - 1
                            ? 'none'
                            : '0.5px solid rgba(26,18,8,0.05)'
                      }}>
                      
                      <td style={{ padding: '16px 20px' }}>
                        #{order._id.slice(-6)}
                      </td>

                      <td style={{ padding: '16px 20px' }}>
                        {order.user?.name || 'Guest'}
                      </td>

                      <td style={{ padding: '16px 20px' }}>
                        PKR {order.total.toLocaleString()}
                      </td>

                      {/* TRACKING COLUMN */}
                      <td style={{ padding: '16px 20px' }}>
                      <input
                        type="text"
                        defaultValue={order.trackingNumber || ''}
                        placeholder="Tracking #"
                        onBlur={(e) =>
                          updateTracking(order._id, e.target.value)
                        }
                        style={{
                          border: '0.5px solid rgba(26,18,8,0.2)',
                          padding: '6px 8px',
                          background: 'transparent',
                          fontSize: '12px',
                          width: '140px'
                        }}
                      />
                      </td>

                      {/* STATUS COLUMN */}
                      <td style={{ padding: '16px 20px' }}>
                        <select
                          value={order.status}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                            handleStatusUpdate(order._id, e.target.value as Order['status'])
                          }  
                          disabled={order.status === 'delivered' || order.status === 'cancelled'}
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td style={{ padding: '16px 20px' }}>
                        {date.toLocaleDateString()}
                      </td>

                      <td style={{ padding: '16px 20px' }}>
                        <Link
                          href={`/admin/orders/${order._id}`}
                          className="btn-ghost"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {filteredOrders.length === 0 && (
              <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                No orders found.
              </div>
            )}
          </div>
        </div>
      </div>

      {viewingOrder && (
        <OrderDetailModal
          order={viewingOrder}
          onClose={() => setViewingOrder(null)}
        />
      )}
    </div>
  )
}

/* ================= MODAL ================= */

function OrderDetailModal({
  order,
  onClose
}: {
  order: Order
  onClose: () => void
}) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(26,18,8,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        onClick={(e: React.MouseEvent<HTMLDivElement>) =>
          e.stopPropagation()
        }
        style={{
          backgroundColor: '#F7F3ED',
          padding: '40px',
          maxWidth: '600px',
          width: '100%'
        }}
      >
        <h2>Order #{order._id.slice(-6)}</h2>

        {order.items.map((item, i) => (
          <div key={i}>
            {item.name} × {item.quantity} — PKR{' '}
            {(item.price * item.quantity).toLocaleString()}
          </div>
        ))}

        <p>Total: PKR {order.total.toLocaleString()}</p>

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  )
}