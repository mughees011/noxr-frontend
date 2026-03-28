'use client'

import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { addToCart, openCart } from '@/store/cartSlice'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

interface Variant {
  size: string
  color: string
  stock: number
}

interface ProductData {
  _id: string
  name: string
  slug: string
  description: string
  shortFabricNote: string
  editorialLine: string
  category: string
  price: number
  compareAtPrice: number
  lowStockThreshold: number

  variants: {
    color: string
    size: string
    stock: number
  }[]

  images: {
    url: string
    alt: string
    color: string
    position: number
    isPrimary: boolean
  }[]

  details: {
    fabric: string
    weight: string
    fit: string
    features: string[]
    care: string[]
  }

  fitInfo: {
    height: string
    chest: string
    wearing: string
  }

  socialProof: {
    rating: number
    reviewsCount: number
    testimonials: string[]
  }

  technicalSpecs: {
    garmentCode: string
    fabricOrigin: string
    season: string
  }
}

export default function ProductPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const params = useParams()
  const slug = params.slug as string

  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [variantHint, setVariantHint] = useState('')
  const [product, setProduct] = useState<ProductData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'details' | 'care' | 'fit'>('details')
  const [recentlyViewed, setRecentlyViewed] = useState<Array<{ slug: string; name: string; price: number; image: string }>>([])
  const [showFullDescription, setShowFullDescription] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${slug}`)
        if (!res.ok) {
          setLoading(false)
          return
        }

        const data = await res.json()
        setProduct(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    if (slug) fetchProduct()
  }, [slug])

  useEffect(() => {
    if (!product) return

    const colors = [...new Set(product.variants.map(v => v.color))]
      if (!selectedColor && colors.length > 0) {
        setSelectedColor(colors[0])
      }

    const existing = safeJsonParse(localStorage.getItem('noxr_recently_viewed'))
    const next = [
      {
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.images?.[0]?.url || '',
      },
      ...existing.filter((i: any) => i.slug !== product.slug),
    ].slice(0, 6)

    localStorage.setItem('noxr_recently_viewed', JSON.stringify(next))
    setRecentlyViewed(next.filter(item => item.slug !== product.slug).slice(0, 3))
  }, [product])


    useEffect(() => {
  setActiveImage(0)
}, [selectedColor])


  if (loading) return <PageState title="NOXR" subtitle="Loading piece..." />
  if (!product)
    return (
      <div className="min-h-screen bg-[#F7F3ED] flex items-center justify-center px-6">
        <div className="text-center">
          <h2 className="font-display font-light text-[#1A1208] mb-4" style={{ fontSize: 'clamp(32px, 6vw, 44px)' }}>
            Product not found
          </h2>
          <Link href="/shop" className="btn-primary">
            <span>Back to Shop</span>
          </Link>
        </div>
      </div>
    )

  const colors = [...new Set(product.variants.map(v => v.color))]
  const sizes = [...new Set(product.variants.filter(v => v.color === selectedColor).map(v => v.size))]
  const sizeStock = Object.fromEntries(
  sizes.map(size => {
    const variant = product.variants.find(
      v => v.color === selectedColor && v.size === size
    )
      return [size, variant?.stock || 0]
    })
  )
  const selectedStock = selectedSize ? sizeStock[selectedSize] || 0 : 0
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0)
  const maxQty = selectedSize ? selectedStock : 0
  const canCheckout = Boolean(selectedColor && selectedSize && selectedStock > 0)

  const mostChosen = sizes.includes('L') ? 'L' : sizes[0]
  const imageSets = buildColorImageSets(product.images, colors)
  const activeImages = imageSets[selectedColor]?.length?imageSets[selectedColor] : imageSets.default || []
  const threshold = product.lowStockThreshold || 5
  const scarcityText = totalStock <= threshold ? `ONLY ${totalStock} LEFT` : ''

  const addVariantToCart = () => {
    if (!selectedColor || !selectedSize) {
      setVariantHint('Select color and size')
      setTimeout(() => setVariantHint(''), 1400)
      return false
    }

    if (selectedStock <= 0) {
      setVariantHint('This size is currently unavailable')
      setTimeout(() => setVariantHint(''), 1400)
      return false
    }

    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        size: selectedSize,
        color: selectedColor,
        quantity: Math.min(quantity, selectedStock),
        image: activeImages?.[0]?.url ?? product.images?.[0]?.url ?? '',
      }),
    )

    return true
  }

  const handleAddToBag = () => {
    if (!addVariantToCart()) return
    dispatch(openCart())
  }

  const handleExpressCheckout = () => {
    if (!addVariantToCart()) return
    router.push('/checkout')
  }

  return (
    <div className="min-h-screen bg-[#F7F3ED]">
      <div className="border-b px-5 md:px-[52px]" style={{ borderColor: 'rgba(26,18,8,0.08)', paddingTop: '90px', paddingBottom: '16px' }}>
        <div className="max-w-[1320px] mx-auto flex items-center gap-3 overflow-x-auto no-scrollbar">
          <Link href="/shop" className="overline whitespace-nowrap" style={{ color: 'rgba(26,18,8,0.35)', textDecoration: 'none' }}>
            Shop
          </Link>
          <span style={{ width: '12px', height: '0.5px', backgroundColor: 'rgba(26,18,8,0.2)' }} />
          <span className="overline whitespace-nowrap" style={{ color: 'rgba(26,18,8,0.5)' }}>
            {product.category}
          </span>
          <span style={{ width: '12px', height: '0.5px', backgroundColor: 'rgba(26,18,8,0.2)' }} />
          <span className="overline whitespace-nowrap" style={{ color: '#1A1208' }}>
            {product.name}
          </span>
        </div>
      </div>

      <div className="max-w-[1320px] mx-auto px-5 md:px-[52px] py-10 md:py-16">
        <div className="grid lg:grid-cols-[58fr_42fr] gap-10 md:gap-16">
          
          {/* LEFT COLUMN - Images (Desktop & Mobile) */}
          <div>
            {/* Main Image */}
            <div className="relative overflow-hidden mb-3 md:mb-4 group" style={{ aspectRatio: '3/4', backgroundColor: '#EDE7DC' }}>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url('${activeImages[activeImage]?.url || activeImages[0]?.url}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'brightness(0.96) saturate(0.85)',
                  transform: 'scale(1)',
                  transition: 'transform 0.8s ease, opacity 0.5s ease',
                }}
                className="group-hover:scale-[1.03]"
              />
              <div style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '9px', letterSpacing: '0.35em', color: 'rgba(26,18,8,0.22)' }}>NOXR</div>
            </div>

            {/* Image Thumbnails */}
            <div className="grid grid-cols-5 gap-2 md:gap-3 mb-8">
              {activeImages.length > 0 && activeImages.map((img, i) => (
                <button
                  key={`${selectedColor}-${i}`}
                  onClick={() => setActiveImage(i)}
                  className="aspect-[3/4] relative overflow-hidden"
                  style={{ border: activeImage === i ? '0.5px solid #1A1208' : '0.5px solid rgba(26,18,8,0.1)', backgroundColor: '#EDE7DC' }}
                >
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('${img.url}')`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: activeImage === i ? 1 : 0.65, transition: 'opacity 0.35s ease' }} />
                </button>
              ))}
            </div>

            {/* DESKTOP ONLY - Editorial Shots */}
            <div className="hidden lg:grid md:grid-cols-2 gap-4 md:gap-6 mb-12 md:mb-16">
              <EditorialShot title="Full Body" image={activeImages[0]?.url || product.images?.[0]?.url} />
              <EditorialShot title="Texture" image={activeImages[1]?.url || activeImages[0]?.url || product.images?.[0]?.url} />
              <EditorialShot title="Stitch Detail" image={activeImages[2]?.url || activeImages[0]?.url || product.images?.[0]?.url} />
              <EditorialShot title="Lifestyle" image={activeImages[3]?.url || activeImages[0]?.url || product.images?.[0]?.url} />
            </div>
          </div>

          {/* RIGHT COLUMN - Product Info & Buying (Desktop & Mobile) */}
          <div className="lg:sticky lg:top-24 h-max">
            <p className="overline mb-3">{product.category}</p>
            <h1 className="font-display font-light text-[#1A1208] mb-4" style={{ fontSize: 'clamp(34px, 6vw, 68px)', lineHeight: 0.92, letterSpacing: '-0.02em' }}>
              {product.name}
            </h1>
            <p className="font-body font-light mb-4" style={{ fontSize: '11px', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(26,18,8,0.45)' }}>
              {product.editorialLine}
            </p>
            <p className="font-display font-light text-[#1A1208] mb-2" style={{ fontSize: 'clamp(22px, 3vw, 30px)' }}>
              PKR {product.price.toLocaleString()}
            </p>
            {scarcityText ? (
              <p className="overline mb-6" style={{ color: 'rgba(26,18,8,0.5)' }}>
                {scarcityText}
              </p>
            ) : (
              <div className="mb-6" />
            )}

            <p className="font-body font-light mb-8" style={{ fontSize: '14px', lineHeight: 1.9, color: 'rgba(26,18,8,0.55)' }}>
              {showFullDescription || product.description.length <= 200 
                ? product.description 
                : `${product.description.substring(0, 200)}...`}
            </p>

            {product.description.length > 200 && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="mb-8 -mt-6 font-body font-light"
                style={{
                  fontSize: '11px',
                  color: 'rgba(26,18,8,0.6)',
                  textDecoration: 'underline',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                }}
              >
                {showFullDescription ? 'Show Less' : 'Show More'}
              </button>
            )}

            {/* Color Selection */}
            <div className="mb-6">
              <p className="overline mb-3" style={{ color: 'rgba(26,18,8,0.45)' }}>Color</p>
              <div className="flex gap-3 flex-wrap mb-2">
                {colors.map(color => {
                  const colorStock = product.variants.filter(v => v.color === color).reduce((sum, v) => sum + v.stock, 0)
                  const isActive = selectedColor === color
                  const isDisabled = colorStock <= 0

                  return (
                    <button
                      key={color}
                      disabled={isDisabled}
                      onClick={() => {
                        setSelectedColor(color)
                        setSelectedSize('')
                        setQuantity(1)
                        setActiveImage(0)
                        setVariantHint('')
                      }}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        border: isActive ? '1px solid #1A1208' : '0.5px solid rgba(26,18,8,0.25)',
                        boxShadow: isActive ? '0 0 0 3px rgba(26,18,8,0.12)' : 'none',
                        backgroundColor: colorToHex(color),
                        opacity: isDisabled ? 0.35 : 1,
                        transition: 'all 0.3s ease',
                      }}
                      title={color}
                    />
                  )
                })}
              </div>
              <p className="font-body font-light" style={{ fontSize: '11px', color: 'rgba(26,18,8,0.45)' }}>
                {selectedColor || 'Select color'}
              </p>
            </div>

            {/* Size Selection */}
            <div className="mb-6 mt-8">
              <div className="flex justify-between items-center mb-2">
                <span className="overline" style={{ color: variantHint ? 'rgba(160,80,80,0.75)' : 'rgba(26,18,8,0.45)' }}>
                  {variantHint || 'Size'}
                </span>
                <Link href="/size-guide" className="btn-ghost" style={{ fontSize: '9px', padding: '4px 0' }}>
                  Size Guide
                </Link>
              </div>

              <p className="font-body font-light mb-4" style={{ fontSize: '11px', color: 'rgba(26,18,8,0.45)' }}>
                Model is {product.fitInfo?.height} wearing {product.fitInfo?.wearing}
                {mostChosen ? ` · Most customers choose ${mostChosen}` : ''}
              </p>

              <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                {sizes.map(size => {
                  const stock = sizeStock[size] || 0
                  const lowStock = stock > 0 && stock <= product.lowStockThreshold
                  const unavailable = stock <= 0
                  const active = selectedSize === size

                  return (
                    <button
                      key={size}
                      disabled={unavailable}
                      onClick={() => {
                        setSelectedSize(size)
                        setQuantity(1)
                        setVariantHint('')
                      }}
                      style={{
                        fontSize: '11px',
                        color: active ? '#F7F3ED' : unavailable ? 'rgba(26,18,8,0.25)' : '#1A1208',
                        backgroundColor: active ? '#1A1208' : 'transparent',
                        border: `0.5px solid ${active ? '#1A1208' : 'rgba(26,18,8,0.2)'}`,
                        opacity: unavailable ? 0.45 : 1,
                        transition: 'all 0.35s ease',
                        padding: '12px 10px',
                      }}
                    >
                      {size}
                      {lowStock ? <span style={{ display: 'block', fontSize: '8px', marginTop: '3px', letterSpacing: '0.15em' }}>LOW</span> : null}
                    </button>
                  )
                })}
              </div>

              {selectedSize ? (
                <p className="font-body font-light mt-3" style={{ fontSize: '11px', color: selectedStock <= product.lowStockThreshold ? 'rgba(26,18,8,0.55)' : 'rgba(26,18,8,0.4)' }}>
                  {selectedStock <= 0 ? 'Out of stock' : selectedStock <= product.lowStockThreshold ? `Only ${selectedStock} left in this size` : `${selectedStock} available`}
                </p>
              ) : null}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-3">
              <span className="overline">Qty</span>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center border" style={{ borderColor: 'rgba(26,18,8,0.2)', fontSize: '18px', color: 'rgba(26,18,8,0.6)' }}>
                  −
                </button>
                <span className="font-display font-light text-[#1A1208]" style={{ fontSize: '18px', minWidth: '24px', textAlign: 'center' }}>
                  {quantity}
                </span>
                <button
                  disabled={!selectedSize || quantity >= maxQty}
                  onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
                  className="w-10 h-10 flex items-center justify-center border"
                  style={{ borderColor: 'rgba(26,18,8,0.2)', fontSize: '18px', color: 'rgba(26,18,8,0.6)', opacity: !selectedSize || quantity >= maxQty ? 0.45 : 1 }}
                >
                  +
                </button>
              </div>
            </div>

            <p className="font-body font-light mb-6" style={{ fontSize: '10px', color: 'rgba(26,18,8,0.35)' }}>
              {selectedSize ? `Max ${maxQty} available` : 'Select color and size to set quantity'}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mb-6">
              <button disabled={!canCheckout} onClick={handleAddToBag} className="btn-primary w-full text-center" style={{ padding: '16px', opacity: canCheckout ? 1 : 0.45 }}>
                <span>{canCheckout ? 'Add to Bag' : 'Select variant'}</span>
              </button>
              <button disabled={!canCheckout} onClick={handleExpressCheckout} className="btn-ghost w-full text-center" style={{ padding: '16px', opacity: canCheckout ? 0.86 : 0.45 }}>
                Express Checkout
              </button>
            </div>

            {/* Details Tabs */}
            <div className="pt-7 mt-7 border-t" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
              <ProductDetailsTabs product={product} activeTab={activeTab} setActiveTab={setActiveTab}/>
            </div>

            {/* Social Proof */}
            <div className="pt-7 mt-7 border-t" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
              <p className="overline mb-3">Social Proof</p>
              <p className="font-body font-light mb-3" style={{ fontSize: '13px', color: '#1A1208' }}>
                {product.socialProof?.rating ?? 0} rating · {product.socialProof?.reviewsCount ?? 0} reviews
              </p>
              <div className="space-y-2">
                {(product.socialProof?.testimonials || []).map(t => (    
                  <p key={t} style={{ fontSize: '12px', lineHeight: 1.8, color: 'rgba(26,18,8,0.5)' }}>
                    {t}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE ONLY - Editorial Shots (moved after buying section) */}
        <div className="grid grid-cols-2 gap-4 mt-12 mb-12 lg:hidden">
          <EditorialShot title="Full Body" image={activeImages[0]?.url || product.images?.[0]?.url} />
          <EditorialShot title="Texture" image={activeImages[1]?.url || activeImages[0]?.url || product.images?.[0]?.url} />
          <EditorialShot title="Stitch Detail" image={activeImages[2]?.url || activeImages[0]?.url || product.images?.[0]?.url} />
          <EditorialShot title="Lifestyle" image={activeImages[3]?.url || activeImages[0]?.url || product.images?.[0]?.url} />
        </div>

        {/* Technical Specifications */}
        <section className="border-t pt-14 mt-14" style={{ borderColor: 'rgba(26,18,8,0.1)' }}>
          <h2 className="font-display font-light mb-6" style={{ fontSize: 'clamp(28px, 4vw, 42px)', letterSpacing: '-0.01em' }}>
            Technical Specifications
          </h2>
          <div className="grid md:grid-cols-2 gap-2 md:gap-4">
            <DetailRow label="Garment Code" value={product.technicalSpecs?.garmentCode} />
            <DetailRow label="Fabric Origin" value={product.technicalSpecs?.fabricOrigin} />
            <DetailRow label="Season" value={product.technicalSpecs?.season} />
          </div>
        </section>

        {/* Fabric Section */}
        <section className="mt-16">
          <div className="relative overflow-hidden" style={{ aspectRatio: '21/8', backgroundColor: '#EDE7DC' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('${activeImages[1]?.url || activeImages[0]?.url}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          </div>
          <div className="max-w-[760px] pt-8">
            <p className="overline mb-3">The Fabric</p>
            <h3 className="font-display font-light mb-4" style={{ fontSize: 'clamp(24px, 4vw, 40px)' }}>
              {product.shortFabricNote}
            </h3>
              <p className="text-[14px] text-[#1A1208]">
                {product.details?.fabric}
              </p>
              <p className="text-[12px] text-[rgba(26,18,8,0.5)]">
                {product.details?.weight}
              </p>
          </div>
        </section>

        {/* Recently Viewed */}
        {recentlyViewed.length ? (
          <section className="mt-16 border-t pt-12" style={{ borderColor: 'rgba(26,18,8,0.1)' }}>
            <h2 className="font-display font-light mb-6" style={{ fontSize: 'clamp(24px, 3.4vw, 38px)' }}>
              Recently Viewed
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              {recentlyViewed.map(item => (
                <Link key={item.slug} href={`/product/${item.slug}`} style={{ textDecoration: 'none' }}>
                  <div className="relative overflow-hidden mb-3" style={{ aspectRatio: '4/5', backgroundColor: '#EDE7DC' }}>
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('${item.image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  </div>
                  <p style={{ fontSize: '13px', color: '#1A1208' }}>{item.name}</p>
                  <p style={{ fontSize: '11px', color: 'rgba(26,18,8,0.45)' }}>PKR {item.price.toLocaleString()}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  )
}

function ProductDetailsTabs({ product, activeTab, setActiveTab }: any) {
  return (
    <div>
      <div className="flex border-b mb-6" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
        {[
          { key: 'details', label: 'Details' },
          { key: 'care', label: 'Care' },
          { key: 'fit', label: 'Fit' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="relative px-4 py-3 flex-1"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '10px',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              fontWeight: 300,
              color: activeTab === tab.key ? '#1A1208' : 'rgba(26,18,8,0.35)',
              background: 'none',
              border: 'none',
            }}
          >
            {tab.label}
            <span
              style={{
                position: 'absolute',
                bottom: '-1px',
                left: 0,
                right: 0,
                height: '1px',
                backgroundColor: '#1A1208',
                transform: activeTab === tab.key ? 'scaleX(1)' : 'scaleX(0)',
                transition: 'transform 0.3s ease',
              }}
            />
          </button>
        ))}
      </div>

      <div style={{ transition: 'opacity 0.45s ease' }}>
        {activeTab === 'details' && (
          <div className="space-y-3">
            <p style={{ fontSize: '13px', lineHeight: 1.8, color: 'rgba(26,18,8,0.55)' }}>
              {product.description || 'Heavyweight 220gsm cotton engineered for structure and fall.'}
            </p>
            <DetailRow label="Fabric" value={product.details?.fabric || ''} />
            <DetailRow label="Weight" value={product.details?.weight || ''} />
            <DetailRow label="Fit" value={product.details?.fit || ''} />
          </div>
        )}

        {activeTab === 'care' && (
          <div className="space-y-2">
            {(product.details?.care || []).map((instruction: string, i: number) => (
              <p key={i} style={{ fontSize: '13px', lineHeight: 1.7, color: 'rgba(26,18,8,0.55)' }}>
              {i + 1}. {instruction}
              </p>
            ))}
          </div>
        )}

        {activeTab === 'fit' && (
          <div className="space-y-2">
            <DetailRow label="Height" value={product.fitInfo?.height} />
            <DetailRow label="Chest" value={product.fitInfo?.chest} />
            <DetailRow label="Wearing" value={product.fitInfo?.wearing} />
            <p style={{ fontSize: '12px', lineHeight: 1.7, color: 'rgba(26,18,8,0.45)' }}>
              Relaxed architecture through shoulder and body. If between sizes, choose your regular fit for intended drape.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function EditorialShot({ title, image }: { title: string; image: string }) {
  return (
    <div>
      <div className="relative overflow-hidden mb-2 group" style={{ aspectRatio: '3/4', backgroundColor: '#EDE7DC' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('${image}')`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'transform 0.8s ease' }} className="group-hover:scale-[1.02]" />
      </div>
      <p className="overline" style={{ color: 'rgba(26,18,8,0.45)' }}>
        {title}
      </p>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline py-2 border-b" style={{ borderColor: 'rgba(26,18,8,0.06)' }}>
      <span style={{ fontSize: '11px', letterSpacing: '0.05em', color: 'rgba(26,18,8,0.4)' }}>{label}</span>
      <span style={{ fontSize: '12px', color: 'rgba(26,18,8,0.62)' }}>{value}</span>
    </div>
  )
}

function PageState({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="min-h-screen bg-[#F7F3ED] flex items-center justify-center">
      <div className="text-center">
        <div className="font-display font-light text-[#1A1208] mb-4" style={{ fontSize: '48px', opacity: 0.12 }}>
          {title}
        </div>
        <p className="overline" style={{ color: 'rgba(26,18,8,0.3)' }}>
          {subtitle}
        </p>
      </div>
    </div>
  )
}

function colorToHex(color: string) {
  const map: Record<string, string> = {
    black: '#171717',
    bone: '#E8E0D2',
    charcoal: '#3A3A3A',
    white: '#F3F2EF',
    olive: '#59624A',
    navy: '#1C2839',
    grey: '#7A7A7A',
  }

  return map[color.toLowerCase()] || '#C7BFB1'
}

function buildColorImageSets(images: ProductData['images'], colors: string[]) {
  const sets: Record<string, typeof images> = {}

  colors.forEach(color => {
    sets[color] = images
      .filter(img => img.color === color)
      .sort((a, b) => a.position - b.position)
  })

  sets.default = [...images].sort((a, b) => a.position - b.position)
  return sets
}

function safeJsonParse(raw: string | null) {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}