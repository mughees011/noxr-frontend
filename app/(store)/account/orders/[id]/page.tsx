'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface OrderItem {
  productId: string
  name: string
  image: string
  color: string
  size: string
  quantity: number
  price: number
}

interface TimelineStep {
  status: string
  date: string
  description: string
  completed: boolean
}

interface Order {
  _id: string
  orderId: string
  email: string
  items: OrderItem[]
  total: number
  status: string
  estimatedDelivery: string
  shippingAddress: {
    fullName: string
    address: string
    city: string
    postalCode: string
    phone: string
  }
  timeline: TimelineStep[]
  createdAt: string
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  const subtotal = order ? order.items.reduce((acc, item) => acc + item.price * item.quantity, 0) : 0
  const shippingFee = subtotal > 5000 ? 0 : 250
  const total = subtotal + shippingFee    

  useEffect(() => {
    const fetchOrder = async () => {
      const token = localStorage.getItem('noxr_user_token')

      if (!token) {
        router.push('/auth/login')
        return
      }

      try {
        const res = await fetch(`http://localhost:5000/api/orders/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          throw new Error('Order not found')
        }

        const data = await res.json()
        setOrder(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchOrder()
    }
  }, [params.id, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F3ED] flex items-center justify-center">
        <p className="overline" style={{ color: 'rgba(26,18,8,0.3)' }}>
          Loading order...
        </p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#F7F3ED] flex items-center justify-center px-6">
        <div className="text-center">
          <h2 className="font-display font-light text-[#1A1208] mb-4" style={{ fontSize: 'clamp(32px, 6vw, 44px)' }}>
            Order not found
          </h2>
          <Link href="/account" className="btn-primary">
            <span>Back to Account</span>
          </Link>
        </div>
      </div>
    )
  }

  const statusColorMap: Record<string, string> = {
    pending: 'rgba(26,18,8,0.4)',
    paid: 'rgba(26,18,8,0.45)',
    processing: 'rgba(26,18,8,0.5)',
    shipped: 'rgba(180,130,50,0.7)',
    delivered: 'rgba(107,143,94,0.7)',
    cancelled: 'rgba(160,80,80,0.7)',
  }

  const statusColor = statusColorMap[order.status] || 'rgba(26,18,8,0.5)'

  return (
    <div className="min-h-screen bg-[#F7F3ED]">
      {/* Header */}
      <div className="border-b px-5 md:px-[52px]" style={{ borderColor: 'rgba(26,18,8,0.08)', paddingTop: '90px', paddingBottom: '16px' }}>
        <div className="max-w-[1240px] mx-auto">
          <Link href="/account" className="overline mb-5 inline-block" style={{ color: 'rgba(26,18,8,0.35)', textDecoration: 'none' }}>
            ← Back to Account
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
            <div>
              <p className="overline mb-3">Order Details</p>
              <h1
                className="font-display font-light text-[#1A1208]"
                style={{
                  fontSize: 'clamp(32px, 8vw, 64px)',
                  lineHeight: 0.95,
                  letterSpacing: '-0.02em',
                }}
              >
                #{order.orderId}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: statusColor,
                }}
              />
              <span className="overline" style={{ color: statusColor }}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>
          <p className="font-body font-light" style={{ fontSize: '13px', color: 'rgba(26,18,8,0.4)' }}>
            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-5 md:px-[52px] py-10 md:py-16">
        <div className="grid lg:grid-cols-[1fr_400px] gap-10 md:gap-16">
          
          {/* LEFT COLUMN - Timeline & Items */}
          <div>
            {/* Order Timeline */}
            <section className="mb-12">
              <h2
                className="font-display font-light text-[#1A1208] mb-8"
                style={{ fontSize: 'clamp(24px, 4vw, 32px)', letterSpacing: '-0.01em' }}
              >
                Order Progress
              </h2>
              
              <div className="space-y-6">
                {order.timeline.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: step.completed ? '#1A1208' : 'rgba(26,18,8,0.1)',
                          border: step.completed ? 'none' : '1px solid rgba(26,18,8,0.2)',
                          flexShrink: 0,
                        }}
                      />
                      {index < order.timeline.length - 1 && (
                        <div
                          style={{
                            width: '1px',
                            height: '40px',
                            backgroundColor: step.completed ? 'rgba(26,18,8,0.2)' : 'rgba(26,18,8,0.1)',
                            marginTop: '8px',
                          }}
                        />
                      )}
                    </div>
                    
                    <div className="flex-1 pb-6">
                      <p
                        className="font-body font-light mb-1"
                        style={{
                          fontSize: '14px',
                          color: step.completed ? '#1A1208' : 'rgba(26,18,8,0.4)',
                          fontWeight: step.completed ? 400 : 300,
                        }}
                      >
                        {step.status}
                      </p>
                      <p className="font-body font-light mb-1" style={{ fontSize: '12px', color: 'rgba(26,18,8,0.45)' }}>
                        {step.description}
                      </p>
                      {step.date && (
                        <p className="font-body font-light" style={{ fontSize: '11px', color: 'rgba(26,18,8,0.35)' }}>
                          {step.date}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-[rgba(26,18,8,0.02)] border" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
                <p className="overline mb-2">Estimated Delivery</p>
                <p className="font-body font-light" style={{ fontSize: '14px', color: '#1A1208' }}>
                  {order.estimatedDelivery}
                </p>
              </div>
            </section>

            {/* Order Items */}
            <section className="border-t pt-12" style={{ borderColor: 'rgba(26,18,8,0.1)' }}>
              <h2
                className="font-display font-light text-[#1A1208] mb-8"
                style={{ fontSize: 'clamp(24px, 4vw, 32px)', letterSpacing: '-0.01em' }}
              >
                Order Items
              </h2>

              <div className="space-y-6">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-4 pb-6 border-b" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
                    <div
                      className="relative flex-shrink-0 bg-[#EDE7DC]"
                      style={{ width: '80px', height: '100px' }}
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
                      <p className="font-body font-light mb-2" style={{ fontSize: '15px', color: '#1A1208' }}>
                        {item.name}
                      </p>
                      <p className="font-body font-light mb-3" style={{ fontSize: '12px', color: 'rgba(26,18,8,0.45)' }}>
                        {item.color} · {item.size} · Qty: {item.quantity}
                      </p>
                      <p className="font-display font-light" style={{ fontSize: '16px', color: '#1A1208' }}>
                        PKR {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-6">
                <span className="font-body font-light" style={{ fontSize: '16px', color: '#1A1208' }}>
                  Total
                </span>
                <span className="font-display font-light" style={{ fontSize: '24px', color: '#1A1208' }}>
                  PKR {order.total.toLocaleString()}
                </span>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN - Order Summary */}
          <div className="lg:sticky lg:top-24 h-max">
            {/* Shipping Address */}
            <section className="p-6 border mb-6" style={{ borderColor: 'rgba(26,18,8,0.08)', backgroundColor: 'rgba(26,18,8,0.01)' }}>
              <h3 className="overline mb-4">Shipping Address</h3>
              <p className="font-body font-light mb-2" style={{ fontSize: '14px', color: '#1A1208' }}>
                {order.shippingAddress.fullName}
              </p>
              <p className="font-body font-light mb-1" style={{ fontSize: '13px', color: 'rgba(26,18,8,0.55)' }}>
                {order.shippingAddress.address}
              </p>
              <p className="font-body font-light mb-3" style={{ fontSize: '13px', color: 'rgba(26,18,8,0.55)' }}>
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
              </p>
              <p className="font-body font-light" style={{ fontSize: '13px', color: 'rgba(26,18,8,0.55)' }}>
                {order.shippingAddress.phone}
              </p>
            </section>

            {/* Order Summary */}
            <section className="p-6 border mb-6" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
              <h3 className="overline mb-4">Order Summary</h3>
              
              <div className="flex justify-between">
                <span className="font-body font-light" style={{ fontSize: '13px', color: 'rgba(26,18,8,0.55)' }}>
                  Subtotal
                </span>
                <span className="font-body font-light" style={{ fontSize: '13px', color: '#1A1208' }}>
                  PKR {subtotal.toLocaleString()}
                </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body font-light" style={{ fontSize: '13px', color: 'rgba(26,18,8,0.55)' }}>
                    Shipping
                  </span>
                  <span className="font-body font-light" style={{ fontSize: '13px', color: '#1A1208' }}>
                    {shippingFee === 0 ? 'Free' : `PKR ${shippingFee.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-body font-light" style={{ fontSize: '15px', color: '#1A1208' }}>
                    Total
                  </span>
                  <span className="font-display font-light" style={{ fontSize: '20px', color: '#1A1208' }}>
                    PKR {total.toLocaleString()}
                  </span>
                </div>
            </section>

            {/* Support */}
            <section className="p-6 border" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
              <h3 className="overline mb-4">Need Help?</h3>
              <p className="font-body font-light mb-4" style={{ fontSize: '12px', lineHeight: 1.7, color: 'rgba(26,18,8,0.55)' }}>
                If you have any questions about your order, please contact our support team.
              </p>
              <Link href="/contact" className="btn-ghost w-full text-center" style={{ fontSize: '10px', padding: '12px' }}>
                Contact Support
              </Link>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}