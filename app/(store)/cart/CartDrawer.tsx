'use client'

import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store/'
import { closeCart, removeItem, updateQuantity } from '@/store/cartSlice'
import { useRouter } from 'next/navigation'
// import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function CartDrawer() {
  // const [mounted, setMounted] = useState(false)

  // useEffect(() => {
  //   setMounted(true)
  // }, [])

  // if (!mounted) return null

  const dispatch = useDispatch()
  const items = useSelector((state: RootState) => state.cart.items)
  const isOpen = useSelector((state: RootState) => state.cart.isOpen)
  const router = useRouter()

  

  const subtotal = items.reduce(
    (acc: number, item: any) => acc + item.price * item.quantity,
    0
  )
  const shippingFee = subtotal > 5000 ? 0 : 250
  const total = subtotal + shippingFee

  const handleCheckout = () => {
    dispatch(closeCart())
    router.push('/checkout')
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-50 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => dispatch(closeCart())}
        style={{ backdropFilter: isOpen ? 'blur(4px)' : 'none' }}
      />

      {/* Drawer */}
      <div
  className={`fixed right-0 bottom-0 bg-[#F7F3ED] shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${
    isOpen ? 'translate-x-0' : 'translate-x-full'
  }`}
  style={{
    top: '50px',              // 👈 push below header
    height: 'calc(100% - 50px)', // 👈 prevent overlap
    width: 'min(440px, 100vw)',
  }}
>
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
          <div>
            <p className="overline mb-1" style={{ color: 'rgba(26,18,8,0.35)' }}>Shopping</p>
            <h2 className="font-display font-light text-[#1A1208]" style={{ fontSize: '28px', letterSpacing: '-0.01em' }}>
              Your Bag
            </h2>
          </div>
          <button
            onClick={() => dispatch(closeCart())}
            className="flex items-center justify-center"
            style={{ width: '40px', height: '40px' }}
          >
            <span className="font-display" style={{ fontSize: '28px', color: 'rgba(26,18,8,0.35)' }}>×</span>
          </button>
        </div>

        {/* Items count */}
        <div className="px-6 py-3 border-b" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
          <p className="overline" style={{ color: 'rgba(26,18,8,0.3)' }}>
            {items.length} {items.length === 1 ? 'Item' : 'Items'}
          </p>
        </div>

        {/* Items List - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="font-display font-light text-[#1A1208] mb-4" style={{ fontSize: '64px', opacity: 0.1 }}>
                ✕
              </div>
              <p className="font-display font-light text-[#1A1208] mb-2" style={{ fontSize: '20px' }}>
                Your bag is empty
              </p>
              <p className="font-body font-light mb-6" style={{ fontSize: '13px', color: 'rgba(26,18,8,0.45)' }}>
                Start shopping to add items
              </p>
              <Link 
                href="/shop" 
                onClick={() => dispatch(closeCart())}
                className="btn-primary"
              >
                <span>Browse Collection</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {items.map((item: any, i: number) => (
                <DrawerCartItem
                  key={`${item.productId}_${item.size ?? ''}_${item.color ?? ''}`}
                  item={item}
                  index={i}
                  onUpdateQuantity={(qty) =>
                    dispatch(
                      updateQuantity({
                        productId: item.productId,
                        size: item.size || '',
                        color: item.color || '',
                        quantity: qty,
                      })
                    )
                  }
                  onRemove={() =>
                    dispatch(
                      removeItem({
                        productId: item.productId,
                        size: item.size || '',
                        color: item.color || '',
                      })
                    )
                  }
                  onCloseDrawer={() => dispatch(closeCart())}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer - Summary & Checkout */}
        {items.length > 0 && (
          <div className="border-t px-6 py-5" style={{ borderColor: 'rgba(26,18,8,0.08)', backgroundColor: '#F2EDE6' }}>
            {/* Subtotal & Shipping */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-baseline">
                <span className="font-body font-light" style={{ fontSize: '12px', color: 'rgba(26,18,8,0.4)' }}>
                  Subtotal
                </span>
                <span className="font-body font-light" style={{ fontSize: '13px', color: '#1A1208' }}>
                  PKR {subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="font-body font-light" style={{ fontSize: '12px', color: 'rgba(26,18,8,0.4)' }}>
                  Shipping
                </span>
                <span className="font-body font-light" style={{ fontSize: '13px', color: shippingFee === 0 ? '#6B8F5E' : '#1A1208' }}>
                  {shippingFee === 0 ? 'Free' : `PKR ${shippingFee}`}
                </span>
              </div>
            </div>

            {/* Free shipping message */}
            {shippingFee > 0 && (
              <p className="font-body font-light mb-4 pb-4 border-b" style={{ fontSize: '10px', color: 'rgba(26,18,8,0.35)', borderColor: 'rgba(26,18,8,0.1)' }}>
                Add PKR {(5000 - subtotal).toLocaleString()} more for free shipping
              </p>
            )}

            {/* Total */}
            <div className="flex justify-between items-baseline mb-4 pb-4 border-b" style={{ borderColor: 'rgba(26,18,8,0.1)' }}>
              <span className="overline" style={{ color: 'rgba(26,18,8,0.45)' }}>
                Total
              </span>
              <span className="font-display font-light text-[#1A1208]" style={{ fontSize: '24px', letterSpacing: '-0.01em' }}>
                PKR {total.toLocaleString()}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button onClick={handleCheckout} className="btn-primary w-full text-center">
                <span>Checkout</span>
              </button>
              <Link 
                href="/cart"
                onClick={() => dispatch(closeCart())}
                className="btn-ghost w-full text-center block"
              >
                View Full Cart
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function DrawerCartItem({
  item,
  index,
  onUpdateQuantity,
  onRemove,
  onCloseDrawer,
}: {
  item: any
  index: number
  onUpdateQuantity: (qty: number) => void
  onRemove: () => void
  onCloseDrawer: () => void
}) {
  return (
    <div
      className="flex gap-3 pb-6 border-b"
      style={{
        borderColor: 'rgba(26,18,8,0.08)',
        opacity: 1,
        animation: `fadeIn 0.4s ease ${index * 0.05}s backwards`,
      }}
    >
      {/* Image */}
      <Link
        href={`/product/${item.slug || item.productId}`}
        onClick={onCloseDrawer}
        className="relative flex-shrink-0 bg-[#EDE7DC] block"
        style={{ width: '70px', height: '90px' }}
      >
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
      </Link>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        {/* Top: Name, Size, Price, Remove */}
        <div>
          <div className="flex justify-between items-start gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <Link
                href={`/product/${item.slug || item.productId}`}
                onClick={onCloseDrawer}
                style={{ textDecoration: 'none' }}
              >
                <h3 className="font-body font-light text-[#1A1208] mb-1 truncate" style={{ fontSize: '14px' }}>
                  {item.name}
                </h3>
              </Link>
              {item.size && (
                <p className="font-body font-light" style={{ fontSize: '10px', color: 'rgba(26,18,8,0.4)' }}>
                  Size: {item.size} {item.color ? `· ${item.color}` : ''}
                </p>
              )}
            </div>

            <button
              onClick={onRemove}
              className="flex-shrink-0"
              style={{ width: '32px', height: '32px', marginTop: '-4px', marginRight: '-8px' }}
              aria-label="Remove item"
            >
              <span className="font-display" style={{ fontSize: '18px', color: 'rgba(26,18,8,0.3)' }}>×</span>
            </button>
          </div>

          <p className="font-body font-light mb-3" style={{ fontSize: '12px', color: 'rgba(26,18,8,0.5)' }}>
            PKR {item.price.toLocaleString()}
          </p>
        </div>

        {/* Bottom: Quantity controls & Item Total */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateQuantity(Math.max(1, item.quantity - 1))}
              className="flex items-center justify-center border"
              style={{
                width: '28px',
                height: '28px',
                borderColor: 'rgba(26,18,8,0.2)',
                fontSize: '16px',
                fontWeight: 300,
                color: 'rgba(26,18,8,0.6)',
                backgroundColor: 'transparent',
              }}
            >
              −
            </button>
            <span className="font-display font-light text-[#1A1208]" style={{ fontSize: '14px', minWidth: '20px', textAlign: 'center' }}>
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.quantity + 1)}
              className="flex items-center justify-center border"
              style={{
                width: '28px',
                height: '28px',
                borderColor: 'rgba(26,18,8,0.2)',
                fontSize: '16px',
                fontWeight: 300,
                color: 'rgba(26,18,8,0.6)',
                backgroundColor: 'transparent',
              }}
            >
              +
            </button>
          </div>

          <p className="font-display font-light text-[#1A1208]" style={{ fontSize: '15px', letterSpacing: '-0.01em' }}>
            PKR {(item.price * item.quantity).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}