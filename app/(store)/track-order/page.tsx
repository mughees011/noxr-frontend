'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { API_URL } from '@/lib/api'

type TrackingState = 'idle' | 'loading' | 'found' | 'not-found'

interface OrderStatus {
  orderId: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
  date: string
  estimatedDelivery: string
  items: Array<{ name: string; quantity: number; image: string }>
  trackingNumber?: string
  carrier?: string
  timeline: Array<{
    status: string
    date: string
    description: string
    completed: boolean
  }>
}

export default function TrackOrderPage() {
  const [loaded, setLoaded] = useState(false)
  const [trackingState, setTrackingState] = useState<TrackingState>('idle')
  const [form, setForm] = useState({ orderId: '', email: '' })
  const [orderData, setOrderData] = useState<OrderStatus | null>(null)

  useEffect(() => { setTimeout(() => setLoaded(true), 100) }, [])

  const update = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleTrack = async (e: React.FormEvent) => {
  e.preventDefault()
  setTrackingState('loading')

  try {
    const res = await fetch(`${API_URL}/api/orders/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        orderId: form.orderId,
        email: form.email
      })
    })

    if (!res.ok) {
      throw new Error()
    }

    const data = await res.json()
    setOrderData(data)
    setTrackingState('found')

  } catch {
    setTrackingState('not-found')
  }
}

  const handleReset = () => {
    setTrackingState('idle')
    setForm({ orderId: '', email: '' })
    setOrderData(null)
  }

  return (
    <div className="min-h-screen bg-[#F7F3ED]">

      {/* Header */}
      <div className="border-b px-5 md:px-[52px] pt-24 md:pt-32 pb-8 md:pb-12" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
        <div
          className="max-w-[1240px] mx-auto"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'none' : 'translateY(20px)',
            transition: 'all 1s ease',
          }}
        >
          <p className="overline mb-5">Order Tracking</p>
          <h1
            className="font-display font-light text-[#1A1208]"
            style={{
              fontSize: 'clamp(42px, 10vw, 96px)',
              lineHeight: 0.9,
              letterSpacing: '-0.025em',
            }}
          >
            Track Order
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 md:px-[52px] py-12 md:py-20 pb-24 md:pb-32">
        <div className="max-w-[800px] mx-auto">
          
          {trackingState === 'idle' || trackingState === 'loading' ? (
            <TrackingForm
              form={form}
              update={update}
              onSubmit={handleTrack}
              isLoading={trackingState === 'loading'}
            />
          ) : trackingState === 'not-found' ? (
            <NotFoundState onReset={handleReset} />
          ) : (
            <OrderDetails order={orderData!} onReset={handleReset} />
          )}
        </div>
      </div>
    </div>
  )
}

function TrackingForm({ form, update, onSubmit, isLoading }: any) {
  return (
    <div className="max-w-[500px] mx-auto">
      <div className="mb-8">
        <h2
          className="font-display font-light text-[#1A1208] mb-4"
          style={{ fontSize: 'clamp(24px, 5vw, 32px)', letterSpacing: '-0.01em' }}
        >
          Enter your details
        </h2>
        <p className="font-body font-light" style={{ fontSize: '14px', lineHeight: 1.75, color: 'rgba(26,18,8,0.45)' }}>
          We'll look up your order and show you the latest tracking information.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">

        <FormField
          label="Order ID"
          type="text"
          value={form.orderId}
          onChange={(v: string) => update('orderId', v)}
          placeholder="NOXR-24-00142"
        />

        <FormField
          label="Email Address"
          type="email"
          value={form.email}
          onChange={(v: string) => update('email', v)}
          placeholder="your@email.com"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full text-center"
          style={{ padding: '16px', marginTop: '16px', opacity: isLoading ? 0.6 : 1 }}
        >
          <span>{isLoading ? 'Tracking Order...' : 'Track Order'}</span>
        </button>
      </form>

      <div className="mt-8 p-6 border" style={{ borderColor: 'rgba(26,18,8,0.08)', backgroundColor: '#F2EDE6' }}>
        <p className="overline mb-3">Need help?</p>
        <p className="font-body font-light mb-4" style={{ fontSize: '12px', lineHeight: 1.7, color: 'rgba(26,18,8,0.45)' }}>
          Can't find your order ID? Check your confirmation email or{' '}
          <Link href="/contact" style={{ color: '#1A1208', textDecoration: 'none', borderBottom: '0.5px solid rgba(26,18,8,0.3)' }}>
            contact us
          </Link>
          .
        </p>
      </div>
    </div>
  )
}

function NotFoundState({ onReset }: any) {
  return (
    <div className="text-center py-12">
      <div
        className="font-display font-light text-[#1A1208] mb-6"
        style={{ fontSize: 'clamp(48px, 10vw, 72px)', opacity: 0.1 }}
      >
        ?
      </div>
      <h2
        className="font-display font-light text-[#1A1208] mb-4"
        style={{ fontSize: 'clamp(28px, 6vw, 36px)', letterSpacing: '-0.01em' }}
      >
        Order not found
      </h2>
      <p className="font-body font-light mb-8 max-w-[400px] mx-auto" style={{ fontSize: '14px', lineHeight: 1.75, color: 'rgba(26,18,8,0.45)' }}>
        We couldn't find an order matching those details. Please check your order ID and email, or contact support.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button onClick={onReset} className="btn-primary">
          <span>Try Again</span>
        </button>
        <Link href="/contact" className="btn-ghost">
          Contact Support
        </Link>
      </div>
    </div>
  )
}

function OrderDetails({ order, onReset }: any) {
  return (
    <div className="space-y-8">
      
      {/* Success header */}
      <div className="text-center pb-8 border-b" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 border rounded-full" style={{ borderColor: 'rgba(107,143,94,0.3)', backgroundColor: 'rgba(107,143,94,0.05)' }}>
          <span className="font-display" style={{ fontSize: '28px', color: 'rgba(107,143,94,0.9)' }}>✓</span>
        </div>
        <h2
          className="font-display font-light text-[#1A1208] mb-2"
          style={{ fontSize: 'clamp(24px, 5vw, 32px)', letterSpacing: '-0.01em' }}
        >
          Order {order.orderId}
        </h2>
        <p className="overline" style={{ color: 'rgba(26,18,8,0.35)' }}>
          Placed on {order.date}
        </p>
      </div>

      {/* Status badge */}
      <div className="p-6 border" style={{ borderColor: 'rgba(26,18,8,0.08)', backgroundColor: '#F2EDE6' }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="overline mb-2">Current Status</p>
            <p
              className="font-display font-light text-[#1A1208] capitalize"
              style={{ fontSize: 'clamp(20px, 4vw, 24px)' }}
            >
              {order.status}
            </p>
          </div>
          <div className="md:text-right">
            <p className="overline mb-2">Estimated Delivery</p>
            <p className="font-body font-light" style={{ fontSize: '14px', color: 'rgba(26,18,8,0.6)' }}>
              {order.estimatedDelivery}
            </p>
          </div>
        </div>

        {order.trackingNumber && (
          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(26,18,8,0.1)' }}>
            <p className="overline mb-2">Tracking Number</p>
            <p className="font-body font-light" style={{ fontSize: '13px', color: 'rgba(26,18,8,0.6)' }}>
              {order.carrier}: {order.trackingNumber}
            </p>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div>
        <h3
          className="font-display font-light text-[#1A1208] mb-6"
          style={{ fontSize: 'clamp(20px, 4vw, 24px)', letterSpacing: '-0.01em' }}
        >
          Tracking History
        </h3>
        
        <div className="space-y-0">
          {order.timeline.map((event: any, i: number) => (
            <div
              key={i}
              className="flex gap-4 pb-6 last:pb-0"
              style={{ borderLeft: i < order.timeline.length - 1 ? '0.5px solid rgba(26,18,8,0.1)' : 'none', paddingLeft: '24px', marginLeft: '11px' }}
            >
              <div
                className="flex-shrink-0 -ml-[36px] mt-1"
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: `0.5px solid ${event.completed ? '#1A1208' : 'rgba(26,18,8,0.2)'}`,
                  backgroundColor: event.completed ? '#1A1208' : '#F7F3ED',
                }}
              />
              <div className="flex-1">
                <p
                  className="font-body font-light mb-1"
                  style={{ fontSize: '14px', color: event.completed ? '#1A1208' : 'rgba(26,18,8,0.4)' }}
                >
                  {event.status}
                </p>
                <p className="font-body font-light mb-1" style={{ fontSize: '11px', color: 'rgba(26,18,8,0.35)' }}>
                  {event.date}
                </p>
                <p className="font-body font-light" style={{ fontSize: '12px', color: 'rgba(26,18,8,0.4)' }}>
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Items */}
      <div>
        <h3
          className="font-display font-light text-[#1A1208] mb-4"
          style={{ fontSize: 'clamp(20px, 4vw, 24px)', letterSpacing: '-0.01em' }}
        >
          Items in this order
        </h3>
        
        <div className="space-y-4">
          {order.items.map((item: any, i: number) => (
            <div key={i} className="flex gap-4 items-center p-4 border" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
              <div
                className="relative flex-shrink-0 bg-[#EDE7DC]"
                style={{ width: '60px', height: '75px' }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url('${item.image}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'brightness(0.95) saturate(0.85)',
                  }}
                />
              </div>
              <div className="flex-1">
                <p className="font-body font-light" style={{ fontSize: '14px', color: '#1A1208' }}>
                  {item.name}
                </p>
                <p className="font-body font-light" style={{ fontSize: '11px', color: 'rgba(26,18,8,0.4)' }}>
                  Qty: {item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button onClick={onReset} className="btn-ghost">
          <span>Track Another Order</span>
        </button>
        <Link href="/contact" className="btn-ghost">
          Contact Support
        </Link>
      </div>
    </div>
  )
}

function FormField({ label, type, value, onChange, placeholder }: any) {
  return (
    <div>
      <p className="overline mb-3" style={{ color: 'rgba(26,18,8,0.35)' }}>{label}</p>
      <input
        type={type}
        required
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border-b outline-none"
        style={{
          borderColor: 'rgba(26,18,8,0.2)',
          padding: '12px 0',
          fontFamily: "'Jost', sans-serif",
          fontSize: '14px',
          fontWeight: 300,
          color: '#1A1208',
        }}
        onFocus={e => { e.target.style.borderBottomColor = 'rgba(26,18,8,0.5)' }}
        onBlur={e => { e.target.style.borderBottomColor = 'rgba(26,18,8,0.2)' }}
      />
    </div>
  )
}