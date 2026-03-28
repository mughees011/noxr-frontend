'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
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
  createdAt: string
}

// Main component wrapped in Suspense
export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <OrderConfirmationContent />
    </Suspense>
  )
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#F7F3ED] flex items-center justify-center">
      <p className="font-body font-light" style={{ fontSize: '13px', color: 'rgba(26,18,8,0.3)' }}>
        Loading order details...
      </p>
    </div>
  )
}

// Content component that uses useSearchParams
function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  const orderId = searchParams.get('orderId')
  const email = searchParams.get('email')

  useEffect(() => {
    if (!orderId || !email) {
      router.push('/')
      return
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/orders/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orderId, email }),
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

    fetchOrder()
  }, [orderId, email, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F3ED] flex items-center justify-center">
        <p className="overline" style={{ color: 'rgba(26,18,8,0.3)' }}>
          Loading your order...
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
          <Link href="/" className="btn-primary">
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F3ED]">
      {/* Header */}
      <div className="border-b px-5 md:px-[52px] py-8 md:py-12" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
        <div className="max-w-[900px] mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-6 md:mb-8 flex justify-center">
            <div
              className="flex items-center justify-center"
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(107,143,94,0.12)',
                border: '1px solid rgba(107,143,94,0.3)',
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(107,143,94,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </div>

          <h1
            className="font-display font-light text-[#1A1208] mb-4"
            style={{
              fontSize: 'clamp(36px, 8vw, 72px)',
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
            }}
          >
            Thank You
          </h1>
          
          <p className="font-body font-light mb-2" style={{ fontSize: '15px', color: 'rgba(26,18,8,0.6)', lineHeight: 1.7 }}>
            Your order has been confirmed and will be shipped within 3-4 business days.
          </p>
          
          <p className="font-body font-light" style={{ fontSize: '13px', color: 'rgba(26,18,8,0.45)' }}>
            A confirmation email has been sent to <strong>{order.email}</strong>
          </p>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-5 md:px-[52px] py-12 md:py-16">
        
        {/* Order Number Card */}
        <div className="p-6 md:p-8 border mb-10 md:mb-12 text-center" style={{ borderColor: 'rgba(26,18,8,0.08)', backgroundColor: 'rgba(26,18,8,0.02)' }}>
          <p className="overline mb-3" style={{ color: 'rgba(26,18,8,0.4)' }}>
            Order Number
          </p>
          <h2 className="font-display font-light text-[#1A1208] mb-4" style={{ fontSize: 'clamp(28px, 5vw, 48px)', letterSpacing: '0.02em' }}>
            #{order.orderId}
          </h2>
          <p className="font-body font-light" style={{ fontSize: '12px', color: 'rgba(26,18,8,0.45)' }}>
            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Order Items */}
        <section className="mb-10 md:mb-12">
          <h3
            className="font-display font-light text-[#1A1208] mb-6"
            style={{ fontSize: 'clamp(22px, 4vw, 28px)', letterSpacing: '-0.01em' }}
          >
            Your Order
          </h3>

          <div className="space-y-5">
            {order.items.map((item, index) => (
              <div key={index} className="flex gap-4 pb-5 border-b" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
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
                  <div
                    className="absolute -top-2 -right-2 flex items-center justify-center"
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#1A1208',
                    }}
                  >
                    <span className="font-body font-light" style={{ fontSize: '10px', color: '#F7F3ED' }}>
                      {item.quantity}
                    </span>
                  </div>
                </div>

                <div className="flex-1">
                  <p className="font-body font-light mb-2" style={{ fontSize: '15px', color: '#1A1208' }}>
                    {item.name}
                  </p>
                  <p className="font-body font-light mb-3" style={{ fontSize: '12px', color: 'rgba(26,18,8,0.45)' }}>
                    {item.color} · {item.size}
                  </p>
                  <p className="font-display font-light" style={{ fontSize: '16px', color: '#1A1208' }}>
                    PKR {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-5">
            <span className="font-body font-light" style={{ fontSize: '15px', color: '#1A1208' }}>
              Total
            </span>
            <span className="font-display font-light" style={{ fontSize: '24px', color: '#1A1208' }}>
              PKR {order.total.toLocaleString()}
            </span>
          </div>
        </section>

        {/* Shipping Info */}
        <section className="mb-10 md:mb-12 p-6 border" style={{ borderColor: 'rgba(26,18,8,0.08)', backgroundColor: '#F2EDE6' }}>
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

        {/* Estimated Delivery */}
        <section className="mb-10 md:mb-12 p-6 border text-center" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
          <p className="overline mb-2">Estimated Delivery</p>
          <p className="font-display font-light" style={{ fontSize: '20px', color: '#1A1208' }}>
            {order.estimatedDelivery}
          </p>
        </section>

        {/* Next Steps */}
        <section className="mb-10 md:mb-12">
          <h3
            className="font-display font-light text-[#1A1208] mb-6"
            style={{ fontSize: 'clamp(22px, 4vw, 28px)', letterSpacing: '-0.01em' }}
          >
            What Happens Next?
          </h3>
          
          <div className="space-y-4">
            {[
              { 
                num: '01', 
                title: 'Order Confirmation', 
                desc: 'You will receive a confirmation email with your order details.' 
              },
              { 
                num: '02', 
                title: 'Processing', 
                desc: 'We will prepare your order for shipment within 24 hours.' 
              },
              { 
                num: '03', 
                title: 'Shipping', 
                desc: 'You will receive tracking information once your order ships.' 
              },
              { 
                num: '04', 
                title: 'Delivery', 
                desc: 'Your order will arrive within 3-4 business days.' 
              },
            ].map((step, i) => (
              <div key={i} className="flex gap-4 p-4 border" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
                <span className="overline flex-shrink-0" style={{ color: 'rgba(26,18,8,0.3)' }}>
                  {step.num}
                </span>
                <div>
                  <p className="font-body font-light mb-1" style={{ fontSize: '14px', color: '#1A1208' }}>
                    {step.title}
                  </p>
                  <p className="font-body font-light" style={{ fontSize: '12px', color: 'rgba(26,18,8,0.5)', lineHeight: 1.6 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href={`/track-order?orderId=${order.orderId}&email=${order.email}`} className="btn-primary w-full sm:w-auto text-center">
            <span>Track Your Order</span>
          </Link>
          <Link href="/shop" className="btn-ghost w-full sm:w-auto text-center">
            Continue Shopping
          </Link>
        </div>

        {/* Support Info */}
        <div className="mt-12 pt-8 border-t text-center" style={{ borderColor: 'rgba(26,18,8,0.1)' }}>
          <p className="overline mb-3">Need Help?</p>
          <p className="font-body font-light mb-4" style={{ fontSize: '13px', color: 'rgba(26,18,8,0.5)', lineHeight: 1.7 }}>
            If you have any questions about your order, feel free to contact us.
          </p>
          <Link href="/contact" className="btn-ghost" style={{ fontSize: '10px' }}>
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}