'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function CollectionDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [collection, setCollection] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (slug) {
      fetchCollection()
    }
  }, [slug])

  useEffect(() => {
    if (collection) {
      setTimeout(() => setLoaded(true), 100)
    }
  }, [collection])

  const fetchCollection = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/collections/${slug}`)
      
      if (!res.ok) {
        setCollection(null)
        return
      }
      
      const data = await res.json()
      setCollection(data)
    } catch (error) {
      console.error('Failed to fetch collection:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F3ED] flex items-center justify-center">
        <p className="overline" style={{ color: 'rgba(26,18,8,0.3)' }}>
          Loading collection...
        </p>
      </div>
    )
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-[#F7F3ED] flex items-center justify-center px-6">
        <div className="text-center">
          <h2 className="font-display font-light text-[#1A1208] mb-4" style={{ fontSize: 'clamp(32px, 6vw, 44px)' }}>
            Collection not found
          </h2>
          <Link href="/collections" className="btn-primary">
            <span>Back to Collections</span>
          </Link>
        </div>
      </div>
    )
  }

  const products = collection.productIds || []

  return (
    <div className="min-h-screen bg-[#F7F3ED]">
      
      {/* Breadcrumb */}
      <div className="border-b px-5 md:px-[52px]" style={{ borderColor: 'rgba(26,18,8,0.08)', paddingTop: '90px', paddingBottom: '16px' }}>
        <div className="max-w-[1320px] mx-auto flex items-center gap-3 overflow-x-auto no-scrollbar">
          <Link href="/collections" className="overline whitespace-nowrap" style={{ color: 'rgba(26,18,8,0.35)', textDecoration: 'none' }}>
            Collections
          </Link>
          <span style={{ width: '12px', height: '0.5px', backgroundColor: 'rgba(26,18,8,0.2)' }} />
          <span className="overline whitespace-nowrap" style={{ color: '#1A1208' }}>
            {collection.name}
          </span>
        </div>
      </div>

      {/* Hero */}
      <section className="px-5 md:px-[52px] pt-12 md:pt-16 pb-16 md:pb-20 border-b" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
        <div
          className="max-w-[1320px] mx-auto"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'none' : 'translateY(20px)',
            transition: 'all 1s ease',
          }}
        >
          <div className="grid lg:grid-cols-[1fr_500px] gap-12 md:gap-16 items-center">
            
            {/* Content */}
            <div>
              {collection.tagline && (
                <p className="overline mb-4">{collection.tagline}</p>
              )}
              
              <h1
                className="font-display font-light text-[#1A1208] mb-6"
                style={{
                  fontSize: 'clamp(42px, 10vw, 84px)',
                  lineHeight: 0.9,
                  letterSpacing: '-0.025em',
                }}
              >
                {collection.name}
              </h1>

              {collection.season && (
                <p className="overline mb-6" style={{ color: 'rgba(26,18,8,0.35)' }}>
                  {collection.season}
                </p>
              )}

              <p
                className="font-body font-light mb-8"
                style={{
                  fontSize: '15px',
                  lineHeight: 1.9,
                  color: 'rgba(26,18,8,0.5)',
                  maxWidth: '540px',
                }}
              >
                {collection.description}
              </p>

              <div className="flex items-center gap-6 pt-6 border-t" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
                <div>
                  <p className="overline mb-1" style={{ color: 'rgba(26,18,8,0.3)' }}>Pieces</p>
                  <p className="font-display font-light text-[#1A1208]" style={{ fontSize: '24px' }}>
                    {products.length}
                  </p>
                </div>
                {collection.releaseDate && (
                  <div>
                    <p className="overline mb-1" style={{ color: 'rgba(26,18,8,0.3)' }}>Released</p>
                    <p className="font-body font-light" style={{ fontSize: '13px', color: 'rgba(26,18,8,0.5)' }}>
                      {new Date(collection.releaseDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Image */}
            {collection.heroImage && (
              <div className="relative overflow-hidden" style={{ aspectRatio: '4/5', backgroundColor: '#EDE7DC' }}>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url('${collection.heroImage}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'brightness(0.94) saturate(0.85)',
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-5 md:px-[52px] py-16 md:py-24">
        <div className="max-w-[1320px] mx-auto">
          
          <div className="flex justify-between items-center mb-10 md:mb-12">
            <h2
              className="font-display font-light text-[#1A1208]"
              style={{ fontSize: 'clamp(24px, 5vw, 32px)', letterSpacing: '-0.01em' }}
            >
              Products
            </h2>
            <p className="overline" style={{ color: 'rgba(26,18,8,0.3)' }}>
              {products.length} {products.length === 1 ? 'piece' : 'pieces'}
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
              {products.map((product: any, i: number) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="font-body font-light" style={{ fontSize: '13px', color: 'rgba(26,18,8,0.3)' }}>
                No products in this collection yet.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Back to Collections */}
      <div className="border-t px-5 md:px-[52px] py-12 md:py-16" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
        <div className="max-w-[1320px] mx-auto text-center">
          <Link
            href="/collections"
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
            Browse All Collections
          </Link>
        </div>
      </div>
    </div>
  )
}

function ProductCard({ product, index }: { product: any; index: number }) {
  const primaryImage = product.images?.find((img: any) => img.isPrimary)?.url || product.images?.[0]?.url || ''

  return (
    <Link
      href={`/product/${product.slug}`}
      className="block"
      style={{
        textDecoration: 'none',
        opacity: 1,
        animation: `fadeIn 0.5s ease ${index * 0.05}s backwards`,
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden mb-3 group" style={{ aspectRatio: '3/4', backgroundColor: '#EDE7DC' }}>
        {primaryImage && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url('${primaryImage}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.95) saturate(0.85)',
              transform: 'scale(1)',
              transition: 'transform 0.8s ease',
            }}
            className="group-hover:scale-[1.03]"
          />
        )}
      </div>

      {/* Info */}
      <div>
        {product.category && (
          <p className="overline mb-1" style={{ color: 'rgba(26,18,8,0.3)' }}>
            {product.category}
          </p>
        )}
        
        <h3
          className="font-body font-light mb-2"
          style={{ fontSize: '14px', color: '#1A1208', lineHeight: 1.4 }}
        >
          {product.name}
        </h3>

        <p className="font-display font-light" style={{ fontSize: '16px', color: 'rgba(26,18,8,0.6)' }}>
          PKR {product.price.toLocaleString()}
        </p>
      </div>
    </Link>
  )
}