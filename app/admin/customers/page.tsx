'use client'

import { useMemo, useState, useEffect, type CSSProperties, type ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type CustomerStatus = 'active' | 'blocked' | 'vip'
type SegmentFilter = 'all' | 'first_time' | 'repeat' | 'high_spender' | 'inactive_90' | 'high_return'

type CustomerOrder = {
  id: string
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  amount: number
  date: string
}

type CustomerRecord = {
  id: string
  name: string
  email: string
  phone: string
  address: string
  createdAt: string
  lastOrderDate: string
  totalOrders: number
  totalSpent: number
  refundCount: number
  repeatRate: number
  status: CustomerStatus
  flags: {
    highReturnRate: boolean
    fraudSuspicion: boolean
    vipTag: boolean
  }
  supportTickets: number
  orders: CustomerOrder[]
}

export default function AdminCustomersPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<CustomerRecord[]>([])
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [segment, setSegment] = useState<SegmentFilter>('all')

  const filteredCustomers = useMemo(() => {
    const now = new Date('2026-02-26T00:00:00.000Z').getTime()
    return customers.filter(customer => {
      if (segment === 'all') return true
      if (segment === 'first_time') return customer.totalOrders === 1
      if (segment === 'repeat') return customer.totalOrders > 1
      if (segment === 'high_spender') return customer.totalSpent >= 50000
      if (segment === 'inactive_90') {
        const lastOrder = new Date(customer.lastOrderDate).getTime()
        return now - lastOrder >= 90 * 24 * 60 * 60 * 1000
      }
      if (segment === 'high_return') return customer.flags.highReturnRate || customer.refundCount >= 2
      return true
    })
  }, [customers, segment])

  const selectedCustomer = useMemo(
    () => filteredCustomers.find(customer => customer.id === selectedCustomerId) ?? filteredCustomers[0] ?? null,
    [filteredCustomers, selectedCustomerId],
  )

  const handleLogout = () => {
    localStorage.removeItem('noxr_admin_token')
    router.push('/admin/login')
  }

  const markVip = () => {
    if (!selectedCustomer) return
    setCustomers(prev =>
      prev.map(customer =>
        customer.id === selectedCustomer.id
          ? { ...customer, status: 'vip', flags: { ...customer.flags, vipTag: true } }
          : customer,
      ),
    )
  }

  const blockAccount = () => {
    if (!selectedCustomer) return
    setCustomers(prev => prev.map(customer => (customer.id === selectedCustomer.id ? { ...customer, status: 'blocked' } : customer)))
  }


  useEffect(() => {
  const fetchCustomers = async () => {
    const res = await fetch('http://localhost:5000/api/admin/customers', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('noxr_admin_token')}`
      }
    })

    const data = await res.json()
    setCustomers(data)
  }

  fetchCustomers()
}, [])


  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F3ED' }}>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>

        <main style={{ flex: 1, padding: '48px 52px' }}>
          <header style={{ marginBottom: '26px' }}>
            <h1 style={pageTitleStyle}>Customer Intelligence</h1>
            <p style={descriptionStyle}>Track buying patterns, segment customers, and take actions from one place.</p>
          </header>

          <section style={{ ...cardStyle, marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
              <h2 style={sectionTitleStyle}>Customer Segmentation</h2>
              <p style={hintStyle}>Use filters for campaigns, discount targeting, and retention</p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {[
                { key: 'all', label: 'All Customers' },
                { key: 'first_time', label: 'First time buyers' },
                { key: 'repeat', label: 'Repeat customers' },
                { key: 'high_spender', label: 'High spenders' },
                { key: 'inactive_90', label: 'Inactive 90+ days' },
                { key: 'high_return', label: 'High return customers' },
              ].map(item => {
                const active = segment === item.key
                return (
                  <button
                    key={item.key}
                    className="btn-ghost"
                    onClick={() => setSegment(item.key as SegmentFilter)}
                    style={{
                      fontSize: '9px',
                      backgroundColor: active ? 'rgba(26,18,8,0.08)' : undefined,
                      color: active ? '#1A1208' : undefined,
                      borderColor: active ? 'rgba(26,18,8,0.25)' : undefined,
                    }}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>
          </section>

          <section style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '18px' }}>
            <div style={cardStyle}>
              <div style={{ marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={sectionTitleStyle}>Customer List Overview</h2>
                <p style={hintStyle}>{filteredCustomers.length} records</p>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Full name', 'Email', 'Total orders', 'Total spent', 'Last order', 'Created', 'Status'].map(head => (
                        <th key={head} style={tableHeaderStyle}>
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map(customer => {
                      const isSelected = selectedCustomer?.id === customer.id
                      return (
                        <tr
                          key={customer.id}
                          onClick={() => setSelectedCustomerId(customer.id)}
                          style={{
                            backgroundColor: isSelected ? 'rgba(26,18,8,0.04)' : 'transparent',
                            cursor: 'pointer',
                          }}
                        >
                          <td style={tableCellStyle}>{customer.name}</td>
                          <td style={tableCellStyle}>{customer.email}</td>
                          <td style={tableCellStyle}>{customer.totalOrders}</td>
                          <td style={tableCellStyle}>PKR {customer.totalSpent.toLocaleString()}</td>
                          <td style={tableCellStyle}>{formatDate(customer.lastOrderDate)}</td>
                          <td style={tableCellStyle}>{formatDate(customer.createdAt)}</td>
                          <td style={tableCellStyle}>
                            <span style={statusBadge(customer.status)}>{customer.status}</span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={cardStyle}>
              <h2 style={sectionTitleStyle}>Customer Profile View</h2>
              {selectedCustomer ? (
                <div style={{ display: 'grid', gap: '14px' }}>
                  <InfoBlock title="Basic Info">
                    <ProfileLine label="Name" value={selectedCustomer.name} />
                    <ProfileLine label="Email" value={selectedCustomer.email} />
                    <ProfileLine label="Phone" value={selectedCustomer.phone} />
                    <ProfileLine label="Address" value={selectedCustomer.address} />
                    <ProfileLine label="Account created" value={formatDate(selectedCustomer.createdAt)} />
                  </InfoBlock>

                  <InfoBlock title="Order History">
                    <div style={{ display: 'grid', gap: '7px' }}>
                      {selectedCustomer.orders.map(order => (
                        <div key={order.id} style={orderRowStyle}>
                          <p style={smallTextStyle}>{order.id}</p>
                          <p style={smallTextStyle}>{order.status}</p>
                          <p style={smallTextStyle}>PKR {order.amount.toLocaleString()}</p>
                          <p style={smallTextStyle}>{formatDate(order.date)}</p>
                        </div>
                      ))}
                    </div>
                  </InfoBlock>

                  <InfoBlock title="Lifetime Metrics">
                    <ProfileLine label="Total spent" value={`PKR ${selectedCustomer.totalSpent.toLocaleString()}`} />
                    <ProfileLine
                      label="Average order value"
                      value={`PKR ${Math.round(selectedCustomer.totalSpent / Math.max(selectedCustomer.totalOrders, 1)).toLocaleString()}`}
                    />
                    <ProfileLine label="Repeat rate" value={`${selectedCustomer.repeatRate}%`} />
                    <ProfileLine label="Refund count" value={selectedCustomer.refundCount.toString()} />
                  </InfoBlock>

                  <InfoBlock title="Flags">
                    <ProfileLine label="High return rate" value={selectedCustomer.flags.highReturnRate ? 'Yes' : 'No'} />
                    <ProfileLine label="Fraud suspicion" value={selectedCustomer.flags.fraudSuspicion ? 'Yes' : 'No'} />
                    <ProfileLine label="VIP tag" value={selectedCustomer.flags.vipTag ? 'Yes' : 'No'} />
                  </InfoBlock>

                  <InfoBlock title="Actions You Can Add">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      <button className="btn-ghost" style={{ fontSize: '9px' }}>
                        Send manual discount code
                      </button>
                      <button onClick={blockAccount} className="btn-ghost" style={{ fontSize: '9px' }}>
                        Block account
                      </button>
                      <button className="btn-ghost" style={{ fontSize: '9px' }}>
                        Reset password
                      </button>
                      <button onClick={markVip} className="btn-ghost" style={{ fontSize: '9px' }}>
                        Add VIP tag
                      </button>
                      <Link href="/admin/support" className="btn-ghost" style={{ fontSize: '9px' }}>
                        See support tickets ({selectedCustomer.supportTickets})
                      </Link>
                    </div>
                  </InfoBlock>
                </div>
              ) : (
                <p style={descriptionStyle}>No customers found in this segment.</p>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

function InfoBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 style={blockTitleStyle}>{title}</h3>
      <div style={{ display: 'grid', gap: '8px' }}>{children}</div>
    </section>
  )
}

function ProfileLine({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
      <span style={hintStyle}>{label}</span>
      <span style={smallTextStyle}>{value}</span>
    </div>
  )
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function statusBadge(status: CustomerStatus): CSSProperties {
  if (status === 'vip') return badgeBase('rgba(107,143,94,0.08)', 'rgba(107,143,94,0.9)')
  if (status === 'blocked') return badgeBase('rgba(160,80,80,0.08)', 'rgba(160,80,80,0.9)')
  return badgeBase('rgba(26,18,8,0.06)', 'rgba(26,18,8,0.7)')
}

function badgeBase(backgroundColor: string, color: string): CSSProperties {
  return {
    fontFamily: "'Jost', sans-serif",
    fontSize: '8px',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    padding: '4px 8px',
    backgroundColor,
    color,
  }
}

const logoStyle: CSSProperties = {
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: '16px',
  fontWeight: 300,
  letterSpacing: '0.5em',
  color: '#1A1208',
  textDecoration: 'none',
  paddingLeft: '0.5em',
}

const subTitleStyle: CSSProperties = {
  fontFamily: "'Jost', sans-serif",
  fontSize: '8px',
  letterSpacing: '0.3em',
  textTransform: 'uppercase',
  color: 'rgba(26,18,8,0.25)',
}

const pageTitleStyle: CSSProperties = {
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: '44px',
  fontWeight: 300,
  letterSpacing: '-0.01em',
  color: '#1A1208',
  marginBottom: '8px',
}

const sectionTitleStyle: CSSProperties = {
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: '24px',
  fontWeight: 400,
  color: '#1A1208',
}

const blockTitleStyle: CSSProperties = {
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: '18px',
  fontWeight: 400,
  color: '#1A1208',
  marginBottom: '8px',
}

const descriptionStyle: CSSProperties = {
  fontFamily: "'Jost', sans-serif",
  fontSize: '12px',
  fontWeight: 300,
  color: 'rgba(26,18,8,0.4)',
}

const hintStyle: CSSProperties = {
  fontFamily: "'Jost', sans-serif",
  fontSize: '10px',
  color: 'rgba(26,18,8,0.4)',
}

const smallTextStyle: CSSProperties = {
  fontFamily: "'Jost', sans-serif",
  fontSize: '11px',
  color: '#1A1208',
}

const cardStyle: CSSProperties = {
  border: '0.5px solid rgba(26,18,8,0.08)',
  backgroundColor: '#F2EDE6',
  padding: '20px',
}

const tableHeaderStyle: CSSProperties = {
  textAlign: 'left',
  fontFamily: "'Jost', sans-serif",
  fontSize: '8px',
  textTransform: 'uppercase',
  letterSpacing: '0.22em',
  color: 'rgba(26,18,8,0.45)',
  padding: '10px 6px',
  borderBottom: '0.5px solid rgba(26,18,8,0.08)',
  whiteSpace: 'nowrap',
}

const tableCellStyle: CSSProperties = {
  fontFamily: "'Jost', sans-serif",
  fontSize: '11px',
  color: '#1A1208',
  padding: '10px 6px',
  borderBottom: '0.5px solid rgba(26,18,8,0.06)',
  whiteSpace: 'nowrap',
}

const orderRowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1.2fr 0.8fr 0.9fr 1fr',
  gap: '8px',
  borderBottom: '0.5px solid rgba(26,18,8,0.06)',
  paddingBottom: '6px',
}