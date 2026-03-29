'use client'

import { useState, useEffect, type CSSProperties } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { clearCart } from '@/store/cartSlice'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'

type Step = 'shipping' | 'payment'

const STEPS: { id: Step; label: string; num: string }[] = [
  { id: 'shipping', label: 'Shipping', num: '01' },
  { id: 'payment', label: 'Payment', num: '02' },
]

interface ShippingData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  province: string
  postal: string
}

interface PaymentData {
  method: 'cod' | 'card'
  cardName: string
  cardNumber: string
  expiry: string
  cvv: string
}

export default function CheckoutPage() {
  const items = useSelector((state: RootState) => state.cart.items)
  const [step, setStep] = useState<Step>('shipping')
  const [loaded, setLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const [shipping, setShipping] = useState<ShippingData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postal: '',
  })
  const [payment, setPayment] = useState<PaymentData>({
    method: 'cod',
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  })

  // Discount state
  const [discountCode, setDiscountCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState<any>(null)
  const [discountError, setDiscountError] = useState('')
  const [validatingDiscount, setValidatingDiscount] = useState(false)

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100)

    const mq = window.matchMedia('(max-width: 900px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const subtotal = items.reduce((acc: number, i: any) => acc + i.price * i.quantity, 0)
  const shippingFee = subtotal > 5000 ? 0 : 250
  const discountAmount = appliedDiscount?.discountAmount || 0
  const total = subtotal + shippingFee - discountAmount

  const currentStepIndex = STEPS.findIndex(s => s.id === step)

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F7F3ED', padding: '24px' }}>
        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: isMobile ? '32px' : '44px',
              fontWeight: 300,
              color: '#1A1208',
              marginBottom: '16px',
            }}
          >
            Your bag is empty.
          </p>
          <Link href="/shop" className="btn-primary">
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F3ED' }}>
      <div
        style={{
          borderBottom: '0.5px solid rgba(26,18,8,0.08)',
          padding: isMobile ? '0 18px' : '0 52px',
          height: isMobile ? '56px' : '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: isMobile ? '14px' : '17px',
            letterSpacing: isMobile ? '0.38em' : '0.55em',
            fontWeight: 300,
            color: '#1A1208',
            textDecoration: 'none',
          }}
        >
          NOXR
        </Link>
        <Link
          href="/cart"
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: isMobile ? '8px' : '9px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(26,18,8,0.35)',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          ← Back to Bag
        </Link>
      </div>

      <div style={{ borderBottom: '0.5px solid rgba(26,18,8,0.08)', padding: isMobile ? '0 18px' : '0 52px' }}>
        <div
          className="max-w-[1240px] mx-auto"
          style={{
            display: 'flex',
            alignItems: 'center',
            height: isMobile ? '48px' : '52px',
            overflowX: 'auto',
            scrollbarWidth: 'none',
          }}
        >
          {STEPS.map((s, i) => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <button
                onClick={() => {
                  if (i < currentStepIndex) setStep(s.id)
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: isMobile ? '8px' : '10px',
                  background: 'none',
                  border: 'none',
                  cursor: i < currentStepIndex ? 'pointer' : 'default',
                  padding: isMobile ? '0 12px 0 0' : '0 20px 0 0',
                }}
              >
                <span style={stepNumStyle(step === s.id, i < currentStepIndex)}>{s.num}</span>
                <span style={stepLabelStyle(step === s.id, i < currentStepIndex, isMobile)}>{s.label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <span
                  style={{
                    width: isMobile ? '16px' : '24px',
                    height: '0.5px',
                    backgroundColor: 'rgba(26,18,8,0.12)',
                    marginRight: isMobile ? '12px' : '20px',
                    display: 'block',
                    flexShrink: 0,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div
        className="max-w-[1240px] mx-auto"
        style={{
          display: 'grid',
          gap: isMobile ? '22px' : '48px',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 380px',
          padding: isMobile ? '26px 18px 48px' : '64px 52px 120px',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.9s ease 0.1s',
        }}
      >
        <div>
          {step === 'shipping' && (
            <ShippingStep
              data={shipping}
              isMobile={isMobile}
              onChange={(f, v) => setShipping(p => ({ ...p, [f]: v }))}
              onNext={() => setStep('payment')}
            />
          )}
          {step === 'payment' && (
            <PaymentStep
              data={payment}
              shipping={shipping}
              isMobile={isMobile}
              onChange={(f, v) => setPayment(p => ({ ...p, [f]: v as any }))}
              onBack={() => setStep('shipping')}
              discountCode={discountCode}
              setDiscountCode={setDiscountCode}
              appliedDiscount={appliedDiscount}
              setAppliedDiscount={setAppliedDiscount}
              discountError={discountError}
              setDiscountError={setDiscountError}
              validatingDiscount={validatingDiscount}
              setValidatingDiscount={setValidatingDiscount}
              subtotal={subtotal}
              total={total}
            />
          )}
        </div>

        <div style={{ position: isMobile ? 'static' : 'sticky', top: '24px', alignSelf: 'start' }}>
          <OrderSummary 
            isMobile={isMobile} 
            items={items} 
            subtotal={subtotal} 
            shippingFee={shippingFee} 
            discount={appliedDiscount}
            total={total}
            discountCode={discountCode}
            setDiscountCode={setDiscountCode}
            discountError={discountError}
            setDiscountError={setDiscountError}
            validatingDiscount={validatingDiscount}
            setValidatingDiscount={setValidatingDiscount}
            setAppliedDiscount={setAppliedDiscount}
            shipping={shipping}
          />
        </div>
      </div>
    </div>
  )
}

function ShippingStep({ data, onChange, onNext, isMobile }: {
  data: ShippingData
  onChange: (field: string, value: string) => void
  onNext: () => void
  isMobile: boolean
}) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext()
  }

  return (
    <form onSubmit={handleSubmit}>
      <SectionHeading num="01" title="Shipping Information" isMobile={isMobile} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '18px' : '24px', marginTop: isMobile ? '22px' : '36px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
          <CheckoutField label="First Name" value={data.firstName} placeholder="Ali" onChange={v => onChange('firstName', v)} />
          <CheckoutField label="Last Name" value={data.lastName} placeholder="Khan" onChange={v => onChange('lastName', v)} />
        </div>
        <CheckoutField label="Email Address" type="email" value={data.email} placeholder="your@email.com" onChange={v => onChange('email', v)} />
        <CheckoutField label="Phone" type="tel" value={data.phone} placeholder="+92 300 0000000" onChange={v => onChange('phone', v)} />
        <CheckoutField label="Street Address" value={data.address} placeholder="House no., street, area" onChange={v => onChange('address', v)} />
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
          <CheckoutField label="City" value={data.city} placeholder="Karachi" onChange={v => onChange('city', v)} />
          <CheckoutField label="Province" value={data.province} placeholder="Sindh" onChange={v => onChange('province', v)} />
        </div>
        <CheckoutField label="Postal Code" value={data.postal} placeholder="75000" onChange={v => onChange('postal', v)} />
      </div>
      <div style={{ marginTop: isMobile ? '28px' : '40px' }}>
        <button type="submit" className="btn-primary" style={{ fontSize: '9px', padding: isMobile ? '14px 22px' : '16px 56px', width: isMobile ? '100%' : 'auto' }}>
          <span>Continue to Payment</span>
        </button>
      </div>
    </form>
  )
}

function PaymentStep({ 
  data, 
  shipping, 
  onChange, 
  onBack, 
  isMobile,
  discountCode,
  setDiscountCode,
  appliedDiscount,
  setAppliedDiscount,
  discountError,
  setDiscountError,
  validatingDiscount,
  setValidatingDiscount,
  subtotal,
  total
}: {
  data: PaymentData
  shipping: ShippingData
  onChange: (field: string, value: any) => void
  onBack: () => void
  isMobile: boolean
  discountCode: string
  setDiscountCode: (code: string) => void
  appliedDiscount: any
  setAppliedDiscount: (discount: any) => void
  discountError: string
  setDiscountError: (error: string) => void
  validatingDiscount: boolean
  setValidatingDiscount: (validating: boolean) => void
  subtotal: number
  total: number
}) {
  const items = useSelector((state: RootState) => state.cart.items)
  const dispatch = useDispatch()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const shippingFee = subtotal > 5000 ? 0 : 250

  const methods = [
    { 
      id: 'cod', 
      label: 'Cash on Delivery', 
      description: 'Pay when you receive your order',
      enabled: true 
    },
    { 
      id: 'card', 
      label: 'Credit / Debit Card', 
      description: 'Coming soon - Secure online payment',
      enabled: false 
    },
  ]

  // Validate discount code
  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      setDiscountError('Please enter a discount code')
      return
    }

    setValidatingDiscount(true)
    setDiscountError('')

    try {
      const res = await fetch(`${API_URL}/api/discounts/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: discountCode,
          orderAmount: subtotal,
          userEmail: shipping.email,
          cartItems: items.map((i: any) => ({ productId: i.productId }))
        })
      })

      const data = await res.json()

      if (data.valid) {
        setAppliedDiscount(data)
        setDiscountError('')
      } else {
        setDiscountError(data.message || 'Invalid discount code')
        setAppliedDiscount(null)
      }
    } catch (error) {
      setDiscountError('Failed to validate discount code')
      setAppliedDiscount(null)
    } finally {
      setValidatingDiscount(false)
    }
  }

  // Remove discount
  const handleRemoveDiscount = () => {
    setAppliedDiscount(null)
    setDiscountCode('')
    setDiscountError('')
  }

  const handlePlaceOrder = async () => {
    // Don't allow placing order with card payment (not yet integrated)
    if (data.method === 'card') {
      alert('Card payment is coming soon. Please use Cash on Delivery for now.')
      return
    }

    try {
      setLoading(true)
      const token = localStorage.getItem('noxr_user_token')

      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          items: items.map((i: any) => ({
            productId: i.productId,
            name: i.name,
            size: i.size,
            color: i.color,
            quantity: i.quantity,
            price: i.price,
            image: i.image
          })),
          total,
          subtotal,
          shippingFee,
          discount: appliedDiscount ? {
            code: appliedDiscount.code,
            amount: appliedDiscount.discountAmount
          } : null,
          email: shipping.email,
          shippingAddress: {
            fullName: `${shipping.firstName} ${shipping.lastName}`,
            phone: shipping.phone,
            address: shipping.address,
            city: shipping.city,
            province: shipping.province,
            postalCode: shipping.postal,
          },
          paymentMethod: data.method,
        }),
      })

      if (!res.ok) throw new Error('Order failed')
      const order = await res.json()

      // Apply discount usage if discount was used
      if (appliedDiscount) {
        await fetch(`${API_URL}/api/discounts/apply`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: appliedDiscount.code,
            orderId: order.orderId,
            userEmail: shipping.email
          })
        })
      }

      dispatch(clearCart())
      router.push(`/order-confirmation?orderId=${order.orderId}&email=${shipping.email}`)
    } catch {
      alert('Order failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <SectionHeading num="02" title="Payment Method" isMobile={isMobile} />

      <div style={{ marginTop: isMobile ? '24px' : '36px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {methods.map(m => (
          <button
            key={m.id}
            type="button"
            onClick={() => m.enabled && onChange('method', m.id)}
            disabled={!m.enabled}
            style={{
              padding: isMobile ? '16px' : '18px',
              border: `0.5px solid ${data.method === m.id ? '#1A1208' : 'rgba(26,18,8,0.12)'}`,
              backgroundColor: data.method === m.id ? 'rgba(26,18,8,0.03)' : 'transparent',
              textAlign: 'left',
              width: '100%',
              cursor: m.enabled ? 'pointer' : 'not-allowed',
              opacity: m.enabled ? 1 : 0.5,
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ 
                fontFamily: "'Jost', sans-serif", 
                fontSize: '13px', 
                fontWeight: 400, 
                color: '#1A1208' 
              }}>
                {m.label}
              </span>
              {!m.enabled && (
                <span style={{ 
                  fontSize: '8px', 
                  letterSpacing: '0.15em', 
                  textTransform: 'uppercase', 
                  color: 'rgba(26,18,8,0.35)',
                  backgroundColor: 'rgba(26,18,8,0.06)',
                  padding: '4px 8px',
                  borderRadius: '2px'
                }}>
                  Coming Soon
                </span>
              )}
            </div>
            <p style={{ 
              fontFamily: "'Jost', sans-serif", 
              fontSize: '11px', 
              fontWeight: 300, 
              color: 'rgba(26,18,8,0.45)',
              margin: 0
            }}>
              {m.description}
            </p>
          </button>
        ))}
      </div>

      {/* Info box for future payment gateway */}
      <div style={{ 
        marginTop: isMobile ? '20px' : '24px', 
        padding: '14px', 
        backgroundColor: 'rgba(107,143,94,0.08)',
        border: '0.5px solid rgba(107,143,94,0.2)',
        borderRadius: '4px'
      }}>
        <p style={{ 
          fontFamily: "'Jost', sans-serif", 
          fontSize: '11px', 
          fontWeight: 300, 
          color: 'rgba(26,18,8,0.6)',
          margin: 0,
          lineHeight: 1.6
        }}>
          <strong style={{ fontWeight: 400 }}>Card payment coming soon!</strong><br />
          We're integrating secure payment processing. For now, please use Cash on Delivery.
        </p>
      </div>

      <div style={{ marginTop: isMobile ? '26px' : '40px', display: 'flex', gap: '12px', flexDirection: isMobile ? 'column' : 'row' }}>
        <button
          onClick={handlePlaceOrder}
          disabled={loading || data.method === 'card'}
          className="btn-primary"
          style={{ 
            padding: isMobile ? '14px 18px' : '16px 56px', 
            opacity: (loading || data.method === 'card') ? 0.6 : 1, 
            width: isMobile ? '100%' : 'auto',
            cursor: data.method === 'card' ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Placing Order…' : data.method === 'card' ? 'Select COD to Continue' : 'Place Order'}
        </button>

        <button onClick={onBack} className="btn-ghost" style={{ width: isMobile ? '100%' : 'auto' }}>
          Back
        </button>
      </div>
    </div>
  )
}

function OrderSummary({ 
  items, 
  subtotal, 
  shippingFee, 
  discount, 
  total, 
  isMobile,
  discountCode,
  setDiscountCode,
  discountError,
  setDiscountError,
  validatingDiscount,
  setValidatingDiscount,
  setAppliedDiscount,
  shipping
}: any) {
  
  // Validate discount code
  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      setDiscountError('Enter a code')
      return
    }

    setValidatingDiscount(true)
    setDiscountError('')

    try {
      const res = await fetch(`${API_URL}/api/discounts/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: discountCode.trim(),
          orderAmount: subtotal,
          userEmail: shipping.email,
          cartItems: items.map((i: any) => ({
            productId: i.productId,
            quantity: i.quantity
          }))
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Validation failed')
      }

      if (data.valid) {
        setAppliedDiscount({
          code: data.code,
          discountAmount: data.discountAmount || 0,
          message: data.message || 'Discount applied'
        })
        setDiscountError('')
      } else {
        setDiscountError(data.message || 'Invalid code')
        setAppliedDiscount(null)
      }

    } catch (err: any) {
      setDiscountError(err.message || 'Error validating code')
      setAppliedDiscount(null)
    } finally {
      setValidatingDiscount(false)
    }
  }

  // Remove discount
  const handleRemoveDiscount = () => {
    setAppliedDiscount(null)
    setDiscountCode('')
    setDiscountError('')
  }

  return (
    <div style={{ border: '0.5px solid rgba(26,18,8,0.08)', backgroundColor: '#F2EDE6', padding: isMobile ? '18px' : '28px' }}>
      <p
        style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: '9px',
          letterSpacing: '0.38em',
          textTransform: 'uppercase',
          color: 'rgba(26,18,8,0.35)',
          marginBottom: '20px',
        }}
      >
        Order Summary
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px', borderBottom: '0.5px solid rgba(26,18,8,0.08)', paddingBottom: '20px' }}>
        {items.map((item: any, i: number) => (
          <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <div style={{ width: isMobile ? '44px' : '52px', height: isMobile ? '56px' : '64px', backgroundColor: '#EDE7DC', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
              {item.image && (
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
              )}
              <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#1A1208', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: "'Jost', sans-serif", fontSize: '8px', color: '#F7F3ED' }}>{item.quantity}</span>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? '14px' : '15px', fontWeight: 400, color: '#1A1208', marginBottom: '2px' }}>{item.name}</p>
              {item.size && <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '9px', color: 'rgba(26,18,8,0.4)', letterSpacing: '0.1em' }}>Size {item.size}</p>}
            </div>
            <span style={{ fontFamily: "'Jost', sans-serif", fontSize: isMobile ? '11px' : '12px', fontWeight: 300, color: 'rgba(26,18,8,0.6)', flexShrink: 0 }}>
              PKR {(item.price * item.quantity).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Discount Code Section */}
      <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '0.5px solid rgba(26,18,8,0.08)' }}>
        <p style={{ 
          fontFamily: "'Jost', sans-serif", 
          fontSize: '9px', 
          letterSpacing: '0.28em', 
          textTransform: 'uppercase', 
          color: 'rgba(26,18,8,0.35)', 
          marginBottom: '12px' 
        }}>
          Discount Code
        </p>
        
        {!discount ? (
          <div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                placeholder="ENTER CODE"
                disabled={validatingDiscount}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '0.5px solid rgba(26,18,8,0.2)',
                  padding: '11px 0',
                  fontFamily: "'Jost', sans-serif",
                  fontSize: '13px',
                  fontWeight: 300,
                  color: '#1A1208',
                  outline: 'none',
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase',
                  transition: 'border-color 0.3s ease',
                }}
              onFocus={e => {
                e.target.style.borderBottomColor = 'rgba(26,18,8,0.5)'
              }}
              onBlur={e => {
                e.target.style.borderBottomColor = 'rgba(26,18,8,0.2)'
              }}
              />
              <button
                type="button"
                onClick={handleApplyDiscount}
                disabled={validatingDiscount || !discountCode.trim()}
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: '9px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  padding: '0 16px',
                  border: 'none',
                  borderBottom: '0.5px solid rgba(26,18,8,0.2)',
                  backgroundColor: 'transparent',
                  color: '#1A1208',
                  height: '42px',
                  cursor: (validatingDiscount || !discountCode.trim()) ? 'not-allowed' : 'pointer',
                  opacity: (validatingDiscount || !discountCode.trim()) ? 0.4 : 1,
                }}
              >
                {validatingDiscount ? '...' : 'Apply'}
              </button>
            </div>
            
            {discountError && (
              <p style={{ 
                fontFamily: "'Jost', sans-serif", 
                fontSize: '10px', 
                color: 'rgba(160,80,80,0.8)',
                marginTop: '8px',
                lineHeight: 1.4
              }}>
                {discountError}
              </p>
            )}
          </div>
        ) : (
          <div style={{ 
            padding: '12px', 
            border: '0.5px solid rgba(107,143,94,0.25)',
            backgroundColor: 'rgba(107,143,94,0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <p style={{ 
                fontFamily: "'Jost', sans-serif", 
                fontSize: '10px',
                fontWeight: 500,
                color: '#6B8F5E',
                letterSpacing: '0.12em',
                marginBottom: '3px'
              }}>
                {discount.code}
              </p>
              <p style={{ 
                fontFamily: "'Jost', sans-serif", 
                fontSize: '9px',
                color: 'rgba(26,18,8,0.45)',
                lineHeight: 1.3
              }}>
                {discount.message}
              </p>
            </div>
            <button
              type="button"
              onClick={handleRemoveDiscount}
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: '8px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(26,18,8,0.35)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: '4px'
              }}
            >
              Remove
            </button>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        {[
          ['Subtotal', `PKR ${subtotal.toLocaleString()}`],
          ['Shipping', shippingFee === 0 ? 'Free' : `PKR ${shippingFee}`],
        ].map(([l, v]) => (
          <div key={l} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: "'Jost', sans-serif", fontSize: '11px', fontWeight: 300, color: 'rgba(26,18,8,0.4)', letterSpacing: '0.05em' }}>{l}</span>
            <span style={{ fontFamily: "'Jost', sans-serif", fontSize: '12px', fontWeight: 300, color: v === 'Free' ? '#6B8F5E' : '#1A1208' }}>{v}</span>
          </div>
        ))}
        
        {discount && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: "'Jost', sans-serif", fontSize: '11px', fontWeight: 300, color: 'rgba(26,18,8,0.4)', letterSpacing: '0.05em' }}>
              Discount
            </span>
            <span style={{ fontFamily: "'Jost', sans-serif", fontSize: '12px', fontWeight: 300, color: '#6B8F5E' }}>
              -PKR {discount.discountAmount.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      <div style={{ borderTop: '0.5px solid rgba(26,18,8,0.08)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontFamily: "'Jost', sans-serif", fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(26,18,8,0.45)' }}>Total</span>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? '20px' : '22px', fontWeight: 300, color: '#1A1208', letterSpacing: '-0.01em' }}>
          PKR {total.toLocaleString()}
        </span>
      </div>
    </div>
  )
}

function SectionHeading({ num, title, isMobile }: { num: string; title: string; isMobile: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '16px', flexWrap: 'wrap' }}>
      <span style={{ fontFamily: "'Jost', sans-serif", fontSize: '9px', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(26,18,8,0.3)' }}>{num}</span>
      <div style={{ width: isMobile ? '14px' : '20px', height: '0.5px', backgroundColor: 'rgba(26,18,8,0.15)' }} />
      <h2
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: isMobile ? '28px' : 'clamp(24px, 3vw, 36px)',
          fontWeight: 300,
          color: '#1A1208',
          letterSpacing: '-0.01em',
        }}
      >
        {title}
      </h2>
    </div>
  )
}

function CheckoutField({ label, type = 'text', value, placeholder, onChange, required = true }: {
  label: string
  type?: string
  value: string
  placeholder: string
  onChange: (v: string) => void
  required?: boolean
}) {
  return (
    <div>
      <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '9px', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(26,18,8,0.35)', marginBottom: '10px' }}>{label}</p>
      <input
        type={type}
        value={value}
        required={required}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          borderBottom: '0.5px solid rgba(26,18,8,0.2)',
          padding: '11px 0',
          fontFamily: "'Jost', sans-serif",
          fontSize: '13px',
          fontWeight: 300,
          color: '#1A1208',
          outline: 'none',
          letterSpacing: '0.02em',
          transition: 'border-color 0.3s ease',
        }}
        onFocus={e => {
          e.target.style.borderBottomColor = 'rgba(26,18,8,0.5)'
        }}
        onBlur={e => {
          e.target.style.borderBottomColor = 'rgba(26,18,8,0.2)'
        }}
      />
    </div>
  )
}

function stepNumStyle(active: boolean, completed: boolean): CSSProperties {
  return {
    fontFamily: "'Jost', sans-serif",
    fontSize: '8px',
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    color: active ? '#1A1208' : completed ? 'rgba(26,18,8,0.45)' : 'rgba(26,18,8,0.2)',
  }
}

function stepLabelStyle(active: boolean, completed: boolean, isMobile: boolean): CSSProperties {
  return {
    fontFamily: "'Jost', sans-serif",
    fontSize: isMobile ? '8.5px' : '9.5px',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: active ? '#1A1208' : completed ? 'rgba(26,18,8,0.45)' : 'rgba(26,18,8,0.2)',
    fontWeight: active ? 400 : 300,
  }
}