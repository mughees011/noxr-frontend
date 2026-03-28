'use client'

import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store/'
import { removeItem, updateQuantity, clearCart } from '@/store/cartSlice'
import type {CartItem} from '@/store/cartSlice'
import Link from 'next/link'
import { useRouter } from 'next/navigation'


export default function CartPage() {
  const cart = useSelector((state: RootState) => state.cart)
  const items: CartItem[] = cart?.items ?? []
  const dispatch = useDispatch()
  const router = useRouter()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => { setTimeout(() => setLoaded(true), 100) }, [])

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity,0)
  const shipping = subtotal > 5000 ? 0 : 250
  const total = subtotal + shipping

  const handleCheckout = () => {
    router.push('/checkout')
  }

  // Empty state
  if (items.length === 0){
    return (
      <div className="min-h-screen bg-[#F7F3ED]">
        <div className="border-b px-5 md:px-[52px] pt-24 md:pt-32 pb-8 md:pb-12" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
          <div className="max-w-[1240px] mx-auto">
            <p className="overline mb-5">Shopping</p>
            <h1
              className="font-display font-light text-[#1A1208]"
              style={{
                fontSize: 'clamp(42px, 10vw, 96px)',
                lineHeight: 0.9,
                letterSpacing: '-0.025em',
              }}
            >
              Cart
            </h1>
          </div>
        </div>

        <div className="flex items-center justify-center px-5 py-20 md:py-32">
          <div className="text-center max-w-[400px]">
            <div
              className="font-display font-light text-[#1A1208] mb-6"
              style={{ fontSize: 'clamp(48px, 10vw, 72px)', opacity: 0.1 }}
            >
              ✕
            </div>
            <h2
              className="font-display font-light text-[#1A1208] mb-4"
              style={{ fontSize: 'clamp(28px, 6vw, 36px)', letterSpacing: '-0.01em' }}
            >
              Your cart is empty
            </h2>
            <p className="font-body font-light mb-8" style={{ fontSize: '14px', lineHeight: 1.75, color: 'rgba(26,18,8,0.45)' }}>
              Start shopping to add items to your bag.
            </p>
            <Link href="/shop" className="btn-primary">
              <span>Browse Collection</span>
            </Link>
          </div>
        </div>
      </div>
    )
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <p className="overline mb-5">Shopping</p>
              <h1
                className="font-display font-light text-[#1A1208]"
                style={{
                  fontSize: 'clamp(42px, 10vw, 96px)',
                  lineHeight: 0.9,
                  letterSpacing: '-0.025em',
                }}
              >
                Cart
              </h1>
            </div>
            <p
              className="font-body font-light md:pb-2"
              style={{
                fontSize: '11px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(26,18,8,0.3)',
              }}
            >
              {items.length} {items.length === 1 ? 'Item' : 'Items'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-5 md:px-[52px] py-12 md:py-16 pb-32 md:pb-24">
        <div className="max-w-[1240px] mx-auto">
          
          {/* Desktop: 2-col (Items + Summary) */}
          {/* Mobile: Items only, Summary sticky bottom */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-0 lg:gap-16">
            
            {/* Cart Items */}
            <div>
              {/* Clear cart button */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
                <h2
                  className="font-display font-light text-[#1A1208]"
                  style={{ fontSize: 'clamp(20px, 4vw, 24px)', letterSpacing: '-0.01em' }}
                >
                  Your Items
                </h2>
                <button
                  onClick={() => dispatch(clearCart())}
                  className="btn-ghost"
                  style={{ fontSize: '9px', padding: '6px 12px' }}
                >
                  Clear Cart
                </button>
              </div>

              {/* Items list */}
              <div className="space-y-6">
                {items.map((item, i) => (
                  <CartItem
                    key={`${item.productId}-${item.size ?? ''}`}
                    item={item}
                    index={i}
                    onUpdateQuantity={(qty) => dispatch(updateQuantity({ productId: item.productId, size: item.size || '', color: item.color || '', quantity: qty }))}
                    onRemove={() => dispatch(removeItem({ productId: item.productId, size: item.size, color: item.color }))}
                  />
                ))}
              </div>

              {/* Continue shopping */}
              <div className="mt-10 pt-8 border-t" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 font-body font-light"
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'rgba(26,18,8,0.4)',
                    textDecoration: 'none',
                  }}
                >
                  <span style={{ fontSize: '16px' }}>←</span>
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <CartSummary subtotal={subtotal} shipping={shipping} total={total} onCheckout={handleCheckout} />
          </div>
        </div>
      </div>
    </div>
  )
}

function CartItem({
  item,
  index,
  onUpdateQuantity,
  onRemove,
}: {
  item: CartItem
  index: number
  onUpdateQuantity: (qty: number) => void
  onRemove: () => void
}) {
  return (
    <div
      className="flex gap-4 md:gap-6 pb-6 border-b"
      style={{
        borderColor: 'rgba(26,18,8,0.08)',
        opacity: 1,
        animation: `fadeIn 0.5s ease ${index * 0.1}s backwards`,
      }}
    >
      {/* Image */}
      <Link
        href={`/product/${item.slug || item.productId}`}
        className="relative flex-shrink-0 bg-[#EDE7DC] block"
        style={{ width: '100px', height: '130px' }}
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
      </Link>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between">
        
        {/* Top: Name + Price + Remove */}
        <div>
          <div className="flex justify-between items-start gap-4 mb-2">
            <div>
              <Link
                href={`/product/${item.slug || item.productId}`}
                style={{ textDecoration: 'none' }}
              >
                <h3
                  className="font-display font-light text-[#1A1208] mb-1"
                  style={{ fontSize: 'clamp(16px, 4vw, 18px)', letterSpacing: '0.01em' }}
                >
                  {item.name}
                </h3>
              </Link>
              <p className="overline mb-1" style={{ color: 'rgba(26,18,8,0.35)' }}>
                {item.category || 'Product'}
              </p>
              {item.size && (
                <p className="font-body font-light" style={{ fontSize: '11px', color: 'rgba(26,18,8,0.4)' }}>
                  Size: {item.size}
                </p>
              )}
            </div>

            <button
              onClick={onRemove}
              className="flex-shrink-0 p-2 -m-2"
              style={{ minWidth: '44px', minHeight: '44px' }}
              aria-label="Remove item"
            >
              <span className="font-display" style={{ fontSize: '20px', color: 'rgba(26,18,8,0.3)' }}>×</span>
            </button>
          </div>

          <p
            className="font-body font-light"
            style={{ fontSize: '13px', color: 'rgba(26,18,8,0.5)' }}
          >
            PKR {item.price.toLocaleString()}
          </p>
        </div>

        {/* Bottom: Quantity controls */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onUpdateQuantity(Math.max(1, item.quantity - 1))}
              className="flex items-center justify-center border"
              style={{
                width: '36px',
                height: '36px',
                borderColor: 'rgba(26,18,8,0.2)',
                fontSize: '18px',
                fontWeight: 300,
                color: 'rgba(26,18,8,0.6)',
                backgroundColor: 'transparent',
              }}
            >
              −
            </button>
            <span
              className="font-display font-light text-[#1A1208]"
              style={{ fontSize: '16px', minWidth: '24px', textAlign: 'center' }}
            >
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.quantity + 1)}
              className="flex items-center justify-center border"
              style={{
                width: '36px',
                height: '36px',
                borderColor: 'rgba(26,18,8,0.2)',
                fontSize: '18px',
                fontWeight: 300,
                color: 'rgba(26,18,8,0.6)',
                backgroundColor: 'transparent',
              }}
            >
              +
            </button>
          </div>

          <p
            className="font-display font-light text-[#1A1208]"
            style={{ fontSize: '18px', letterSpacing: '-0.01em' }}
          >
            PKR {(item.price * item.quantity).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}

function CartSummary({ subtotal, shipping, total, onCheckout }: any) {
  return (
    <>
      {/* Desktop: Sticky sidebar */}
      <div className="hidden lg:block sticky top-6 self-start">
        <SummaryContent subtotal={subtotal} shipping={shipping} total={total} onCheckout={onCheckout} />
      </div>

      {/* Mobile: Sticky bottom */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#F7F3ED] border-t px-5 py-4 z-40" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="overline mb-1" style={{ color: 'rgba(26,18,8,0.35)' }}>Total</p>
            <p className="font-display font-light text-[#1A1208]" style={{ fontSize: '28px', letterSpacing: '-0.01em' }}>
              PKR {total.toLocaleString()}
            </p>
          </div>
          <button onClick={onCheckout} className="btn-primary">
            <span>Checkout</span>
          </button>
        </div>
        
        {shipping > 0 && (
          <p className="font-body font-light text-center" style={{ fontSize: '10px', color: 'rgba(26,18,8,0.35)' }}>
            Add PKR {(5000 - subtotal).toLocaleString()} more for free shipping
          </p>
        )}
      </div>
    </>
  )
}

function SummaryContent({ subtotal, shipping, total, onCheckout }: any) {
  return (
    <div className="p-6 border" style={{ borderColor: 'rgba(26,18,8,0.08)', backgroundColor: '#F2EDE6' }}>
      <h3
        className="font-display font-light text-[#1A1208] mb-6"
        style={{ fontSize: 'clamp(20px, 4vw, 24px)', letterSpacing: '-0.01em' }}
      >
        Order Summary
      </h3>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-baseline">
          <span className="font-body font-light" style={{ fontSize: '12px', color: 'rgba(26,18,8,0.4)' }}>
            Subtotal
          </span>
          <span className="font-body font-light" style={{ fontSize: '14px', color: '#1A1208' }}>
            PKR {subtotal.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between items-baseline">
          <span className="font-body font-light" style={{ fontSize: '12px', color: 'rgba(26,18,8,0.4)' }}>
            Shipping
          </span>
          <span className="font-body font-light" style={{ fontSize: '14px', color: '#1A1208' }}>
            {shipping === 0 ? 'Free' : `PKR ${shipping}`}
          </span>
        </div>

        {shipping > 0 && (
          <p
            className="font-body font-light pt-2"
            style={{ fontSize: '10px', color: 'rgba(26,18,8,0.35)', lineHeight: 1.6 }}
          >
            Add PKR {(5000 - subtotal).toLocaleString()} more for free shipping
          </p>
        )}

        <div className="flex justify-between items-baseline pt-4 border-t" style={{ borderColor: 'rgba(26,18,8,0.15)' }}>
          <span
            className="font-body font-light"
            style={{ fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1A1208' }}
          >
            Total
          </span>
          <span className="font-display font-light text-[#1A1208]" style={{ fontSize: '28px', letterSpacing: '-0.01em' }}>
            PKR {total.toLocaleString()}
          </span>
        </div>
      </div>

      <button onClick={onCheckout} className="btn-primary w-full text-center mb-4">
        <span>Proceed to Checkout</span>
      </button>

      <Link
        href="/shop"
        className="btn-ghost w-full text-center block"
      >
        Continue Shopping
      </Link>

      {/* Trust signals */}
      <div className="mt-6 pt-6 border-t space-y-3" style={{ borderColor: 'rgba(26,18,8,0.15)' }}>
        {[
          'Secure checkout',
          '7-day returns',
          'Free shipping over PKR 5,000',
        ].map(item => (
          <div key={item} className="flex items-center gap-3">
            <span style={{ width: '16px', height: '0.5px', backgroundColor: 'rgba(26,18,8,0.2)', flexShrink: 0 }} />
            <span className="font-body font-light" style={{ fontSize: '10px', color: 'rgba(26,18,8,0.4)' }}>
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}